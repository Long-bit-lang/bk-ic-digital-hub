// QR and Manual Attendance Management Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { AttendanceRecord, AttendanceRequest, AttendanceStatus } from '../../src/types/index.ts';
import {
  checkQRWindow,
  evaluateLateStatus,
  parseSessionDateTime,
  syncSessionsLifecycle
} from '../timeUtils.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';
import { isUserSessionPic } from './sessions.ts';

export const attendanceRouter = Router();

// In-flight concurrency lock to prevent race conditions during simultaneous check-in scans
const inFlightCheckins = new Set<string>();

// Helper to format Vietnam time: HH:mm ngày DD/MM/YYYY
function formatVietnamDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(d);
    const get = (type: string) => parts.find(p => p.type === type)?.value || '';
    return `${get('hour')}:${get('minute')} ngày ${get('day')}/${get('month')}/${get('year')}`;
  } catch {
    return isoString;
  }
}

// Check if a target audience string represents all club members
export function isSessionOpenToAll(targetAudience?: string, targetParticipants?: string): boolean {
  const target = (targetAudience || targetParticipants || '').trim().toLowerCase();
  if (!target) return true;

  const allKeywords = [
    'all',
    'tất cả',
    'tat ca',
    'toàn thể',
    'toan the',
    'toàn clb',
    'toan clb',
    'thành viên chính thức',
    'thanh vien chinh thuc',
    'toàn thể thành viên chính thức',
    'toàn thể thành viên clb',
    'chung',
    'mọi thành viên',
    'moi thanh vien'
  ];

  return allKeywords.some(kw => target.includes(kw));
}

// Check if an authenticated user is eligible to attend a session
export function checkUserAttendanceEligibility(session: any, user: any): { eligible: boolean; message?: string } {
  // Admins always have access
  if (user.role === 'admin' || user.role === 'sysadmin') {
    return { eligible: true };
  }

  // Account validity checks
  if (user.accountStatus && user.accountStatus !== 'active') {
    return {
      eligible: false,
      message: 'Tài khoản của bạn chưa kích hoạt hoặc đang bị tạm khóa. Vui lòng liên hệ Ban Thành viên để kiểm tra tài khoản.'
    };
  }

  // Paused or left members cannot check in
  if (user.status === 'paused' || user.status === 'left' || user.status === 'suspended') {
    const statusLabel = user.status === 'paused' ? 'Bảo lưu' : user.status === 'suspended' ? 'Đình chỉ sinh hoạt' : 'Đã rời CLB';
    return {
      eligible: false,
      message: `Tài khoản của bạn đang ở trạng thái "${statusLabel}", không thể tham gia điểm danh sinh hoạt.`
    };
  }

  // Must be an official member (or approved account)
  if (user.role === 'guest' || user.role === 'applicant') {
    return {
      eligible: false,
      message: 'Tài khoản chưa được kết nạp thành viên chính thức để điểm danh.'
    };
  }

  // If session is open to all members, any approved active member is eligible
  const audience = session.targetAudience || session.targetParticipants || '';
  if (isSessionOpenToAll(session.targetAudience, session.targetParticipants)) {
    return { eligible: true };
  }

  // Restricted session: check specific unit/committee affiliation
  const target = audience.toLowerCase();
  const actorUnit = (user.unit || user.committee || '').toLowerCase();
  const actorPosition = (user.position || '').toLowerCase();

  const unitAliases: Record<string, string[]> = {
    'bn': ['bn', 'ban chủ nhiệm', 'ban chu nhiem', 'bcn'],
    'bdh': ['bdh', 'bđh', 'ban điều hành', 'ban dieu hanh'],
    'btv': ['btv', 'ban thành viên', 'ban thanh vien']
  };

  let matches = false;
  if (actorUnit && (target.includes(actorUnit) || (unitAliases[actorUnit] && unitAliases[actorUnit].some(alias => target.includes(alias))))) {
    matches = true;
  }

  // Specific sub-unit keywords (e.g. Truyền thông, Kỹ thuật, Dự án, Đối ngoại)
  const subUnits = ['truyền thông', 'truyen thong', 'kỹ thuật', 'ky thuat', 'dự án', 'du an', 'đối ngoại', 'doi ngoai'];
  for (const su of subUnits) {
    if (target.includes(su) && (actorUnit.includes(su) || (user.unit || '').toLowerCase().includes(su))) {
      matches = true;
      break;
    }
  }

  // Position matching: only for non-generic roles (e.g. "Trưởng ban", "Phó ban", "Chủ nhiệm"), NOT generic "thành viên"
  const genericPositions = ['thành viên', 'thanh vien', 'member', ''];
  if (!matches && actorPosition && !genericPositions.includes(actorPosition) && target.includes(actorPosition)) {
    matches = true;
  }

  if (!matches) {
    return {
      eligible: false,
      message: `Buổi meeting này dành riêng cho đối tượng: "${audience}". Bạn hiện thuộc đơn vị "${user.unit || 'Chưa phân ban'}". Vui lòng liên hệ Ban Thành viên nếu bạn cần tham gia.`
    };
  }

  return { eligible: true };
}

// GET /api/attendance/session-info/:sessionId - Public endpoint for mobile check-in landing page
attendanceRouter.get('/session-info/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const store = db.get();
  
  // Sync state machine before returning
  const changed = syncSessionsLifecycle(store);
  if (changed) {
    db.save();
  }

  const session = store.sessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi meeting / training.' });
  }

  const qrWindow = checkQRWindow(
    session.date,
    session.startTime,
    session.attendanceOpenTime,
    session.attendanceCloseTime
  );
  const pic = store.users.find(u => u.id === session.personInChargeId);
  const targetLabel = session.targetAudience || session.targetParticipants || 'Toàn thể thành viên chính thức';

  res.json({
    success: true,
    session: {
      id: session.id,
      title: session.title,
      description: session.description,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      location: session.location,
      status: session.status,
      attendanceStatus: session.attendanceStatus,
      targetAudience: targetLabel,
      targetParticipants: targetLabel,
      personInChargeName: pic?.fullName || session.personInChargeName || 'Ban Chủ nhiệm',
      attendanceOpenTime: session.attendanceOpenTime,
      attendanceCloseTime: session.attendanceCloseTime,
      lateThresholdTime: session.lateThresholdTime,
      qrWindowOpenMinutes: session.qrWindowOpenMinutes || 15,
      qrWindowCloseMinutes: session.qrWindowCloseMinutes || 15,
      lateThresholdMinutes: session.lateThresholdMinutes || 10
    },
    qrWindow
  });
});

attendanceRouter.use(requireAuth);
attendanceRouter.use(requireNormalSession);

// GET /api/attendance - List attendance records
attendanceRouter.get('/', (req, res) => {
  const { sessionId, memberId } = req.query;
  const store = db.get();
  const actor = req.user!;

  let records: AttendanceRecord[] = Array.isArray(store.attendance) 
    ? store.attendance 
    : (Array.isArray((store as any).attendanceRecords) ? (store as any).attendanceRecords : []);

  if (sessionId) {
    records = records.filter(r => r.sessionId === sessionId);
  }

  if (memberId) {
    records = records.filter(r => r.memberId === memberId);
  }

  // Regular members can see their own attendance records, AND attendance records of sessions they are designated as Person in Charge (PIC)
  if (actor.role === 'member' || actor.role === 'applicant') {
    const picSessionIds = new Set(
      (store.sessions || []).filter(s => isUserSessionPic(s, actor)).map(s => s.id)
    );
    records = records.filter(r => r.memberId === actor.id || picSessionIds.has(r.sessionId));
  }

  res.json({ success: true, attendance: records || [] });
});

// GET /api/attendance/report/:sessionId - Objective Attendance Summary Report
attendanceRouter.get('/report/:sessionId', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { sessionId } = req.params;

  syncSessionsLifecycle(store);

  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiên sinh hoạt.' });
  }

  // Permission check: Admin, BN, or the assigned Person in Charge (PIC), or BDH scoped, or eligible attendee
  const isAdminOrBn = actor.role === 'admin' || actor.role === 'sysadmin' || actor.unit === 'BN';
  const isPic = isUserSessionPic(session, actor);
  const isBdh = actor.unit === 'BDH';
  const isBdhScoped = isBdh && (session.unit === 'BDH' || isPic || session.createdById === actor.id);
  const isTargetAudience = checkUserAttendanceEligibility(session, actor).eligible;

  if (!isAdminOrBn && !isPic && !isBdhScoped && !isTargetAudience) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập báo cáo tham dự của phiên sinh hoạt này.'
    });
  }

  // Total eligible members
  const eligibleUsers = store.users.filter(u => {
    if (u.accountStatus !== 'active' || u.status === 'paused' || u.status === 'left' || u.status === 'suspended') {
      return false;
    }
    return checkUserAttendanceEligibility(session, u).eligible;
  });

  const totalEligible = eligibleUsers.length;

  const sessionRecords = store.attendance.filter(a => a.sessionId === sessionId);
  const presentCount = sessionRecords.filter(a => a.status === 'present').length;
  const lateCount = sessionRecords.filter(a => a.status === 'late').length;
  const excusedCount = sessionRecords.filter(a => a.status === 'excused').length;
  const unexcusedCount = sessionRecords.filter(a => a.status === 'unexcused').length;

  const recordedAttended = presentCount + lateCount;
  const absentCount = Math.max(unexcusedCount, totalEligible - recordedAttended - excusedCount);

  // Rate calculation formula: (present + late) / (totalEligible - excusedCount) * 100%
  const effectiveDenominator = totalEligible - excusedCount;
  const attendanceRate = effectiveDenominator > 0
    ? Math.round(((presentCount + lateCount) / effectiveDenominator) * 1000) / 10
    : 0;

  const rateCalculationFormula = 'Tỷ lệ tham dự = ((Có mặt đúng giờ + Đi trễ) / (Tổng đủ điều kiện - Vắng có phép)) * 100%';

  const report = {
    sessionId: session.id,
    sessionTitle: session.title,
    sessionDate: session.date,
    totalEligible,
    presentCount,
    lateCount,
    absentCount,
    excusedCount,
    attendanceRate,
    rateCalculationFormula
  };

  // Provide detailed attendee list according to viewing privilege (Admin/BN/BDH/BTV and PIC)
  let attendees = undefined;
  if (isAdminOrBn || isBdhScoped || actor.unit === 'BTV' || isPic) {
    attendees = sessionRecords.map(r => ({
      id: r.id,
      memberId: r.memberId,
      memberName: r.memberName,
      studentId: r.studentId,
      unit: r.unit,
      status: r.status,
      checkInTime: r.checkInTime,
      method: r.method,
      notes: r.notes
    }));
  }

  res.json({
    success: true,
    report,
    attendees
  });
});

// POST /api/attendance/qr-token - Generate dynamic rotating QR token from server
// Only Person in charge, BN, BDH, BTV or Admin can generate QR code
attendanceRouter.post('/qr-token', (req, res) => {
  const actor = req.user!;
  const { sessionId } = req.body;
  const store = db.get();
  
  // Sync state machine
  const changed = syncSessionsLifecycle(store);
  if (changed) {
    db.save();
  }

  const session = store.sessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training' });
  }

  // Check authorization to display QR: Only PIC, Ban Chủ nhiệm (BN), or Admin
  const isPic = isUserSessionPic(session, actor);
  const isAuthorizedManager = actor.unit === 'BN' || actor.role === 'admin' || actor.role === 'sysadmin';
  if (!isPic && !isAuthorizedManager) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền tạo hoặc hiển thị mã QR điểm danh.'
    });
  }

  if (session.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Buổi training đã bị hủy, mã QR bị vô hiệu hóa.' });
  }

  const qrWindow = checkQRWindow(
    session.date,
    session.startTime,
    session.attendanceOpenTime,
    session.attendanceCloseTime
  );
  const intervalSec = session.qrIntervalSec || 20;
  const nowSec = Math.floor(Date.now() / 1000);
  const timeSlot = Math.floor(nowSec / intervalSec);
  const expiresIn = intervalSec - (nowSec % intervalSec);

  // Dynamic server-authoritative token
  const token = `BKIC-QR-${session.id.slice(-6)}-${timeSlot.toString(36).toUpperCase()}-${((timeSlot * 47) % 10000).toString().padStart(4, '0')}`;

  res.json({
    success: true,
    token,
    expiresIn,
    intervalSec,
    qrWindowDetails: qrWindow
  });
});

// POST /api/attendance/checkin-qr - QR Attendance Scan Endpoint
attendanceRouter.post('/checkin-qr', (req, res) => {
  const actor = req.user!;
  const { sessionId, token } = req.body;

  // Account validity & membership status checks take precedence
  if (actor.status === 'paused' || actor.status === 'left' || actor.status === 'suspended') {
    const statusLabel = actor.status === 'paused' ? 'Bảo lưu' : actor.status === 'suspended' ? 'Đình chỉ sinh hoạt' : 'Đã rời CLB';
    return res.status(403).json({
      success: false,
      message: `Tài khoản của bạn đang ở trạng thái "${statusLabel}", không thể tham gia điểm danh sinh hoạt.`
    });
  }

  if (actor.accountStatus && actor.accountStatus !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Tài khoản của bạn chưa kích hoạt hoặc đang bị tạm khóa. Vui lòng liên hệ Ban Thành viên để kiểm tra tài khoản.'
    });
  }

  const store = db.get();
  
  // Sync lifecycle based on server clock
  const changed = syncSessionsLifecycle(store);
  if (changed) {
    db.save();
  }

  const session = store.sessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi meeting / training.' });
  }

  if (session.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Buổi meeting đã bị hủy. Không ghi nhận điểm danh.' });
  }

  if (session.attendanceStatus === 'finalized') {
    return res.status(400).json({
      success: false,
      message: 'Danh sách điểm danh của buổi meeting này đã được chốt và khóa. Vui lòng liên hệ Người phụ trách hoặc Ban Thành viên.'
    });
  }

  // Target audience eligibility check
  const eligibility = checkUserAttendanceEligibility(session, actor);
  if (!eligibility.eligible) {
    return res.status(403).json({
      success: false,
      message: eligibility.message || 'Bạn không thuộc đối tượng tham gia buổi sinh hoạt này.'
    });
  }

  // Check manual closed gate
  if (session.manualGate === 'closed' && session.attendanceStatus === 'closed') {
    return res.status(400).json({
      success: false,
      message: 'Cổng điểm danh đã được Người phụ trách hoặc Ban Chủ nhiệm đóng. Vui lòng liên hệ Người phụ trách buổi họp hoặc Ban Thành viên.'
    });
  }

  // Check QR Window if attendanceStatus is not explicitly open
  const qrWindow = checkQRWindow(
    session.date,
    session.startTime,
    session.attendanceOpenTime,
    session.attendanceCloseTime
  );
  if (session.attendanceStatus !== 'open') {
    if (qrWindow.isBeforeWindow) {
      return res.status(400).json({
        success: false,
        message: 'Cửa sổ QR chưa mở. QR chỉ mở trước giờ bắt đầu 15 phút.'
      });
    }
    if (qrWindow.isAfterWindow) {
      return res.status(400).json({
        success: false,
        message: 'Cửa sổ QR đã đóng (quá 15 phút sau giờ bắt đầu). Vui lòng liên hệ Người phụ trách buổi hoặc Ban Thành viên để điểm danh thủ công.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Cổng điểm danh hiện đang đóng. Vui lòng liên hệ Người phụ trách buổi họp hoặc Ban Thành viên.'
    });
  }

  // Validate Token rotation (current or previous window)
  if (token) {
    const intervalSec = session.qrIntervalSec || 20;
    const nowSec = Math.floor(Date.now() / 1000);
    const currentSlot = Math.floor(nowSec / intervalSec);
    const validCurrent = `BKIC-QR-${session.id.slice(-6)}-${currentSlot.toString(36).toUpperCase()}-${((currentSlot * 47) % 10000).toString().padStart(4, '0')}`;
    const validPrev = `BKIC-QR-${session.id.slice(-6)}-${(currentSlot - 1).toString(36).toUpperCase()}-${(((currentSlot - 1) * 47) % 10000).toString().padStart(4, '0')}`;

    if (token !== validCurrent && token !== validPrev) {
      return res.status(400).json({
        success: false,
        message: 'Mã QR đã hết hạn xoay vòng. Vui lòng quét lại mã đang hiển thị trên màn hình.'
      });
    }
  }

  // Concurrency & Strict Anti-Duplicate Lock:
  // Each member has at most 1 attendance record per meeting.
  // Simultaneous or repeated scans return informative message without duplicating or altering the record.
  const lockKey = `${sessionId}:${actor.id}`;
  if (inFlightCheckins.has(lockKey)) {
    return res.status(409).json({
      success: false,
      message: 'Hệ thống đang xử lý yêu cầu điểm danh của bạn, vui lòng không gửi liên tiếp.'
    });
  }

  inFlightCheckins.add(lockKey);
  try {
    const existing = store.attendance.find(a => a.sessionId === sessionId && a.memberId === actor.id);
    if (existing) {
      const formattedTime = formatVietnamDateTime(existing.checkInTime);
      return res.json({
        success: true,
        alreadyCheckedIn: true,
        status: existing.status,
        statusText: existing.status === 'present' ? 'Có mặt đúng giờ' : 'Đi trễ',
        message: `Bạn đã điểm danh buổi meeting này lúc ${formattedTime}. Hệ thống không tạo thêm bản ghi mới.`,
        record: existing,
        session: {
          id: session.id,
          title: session.title,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          location: session.location
        },
        member: {
          id: actor.id,
          fullName: actor.fullName,
          studentId: actor.studentId,
          email: actor.email,
          unit: actor.unit
        }
      });
    }

    // Determine Present vs Late using configured or default late threshold
    const attendanceStatus = evaluateLateStatus(session.date, session.startTime, session.lateThresholdTime);

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      sessionId: session.id,
      sessionTitle: session.title,
      memberId: actor.id,
      memberName: actor.fullName,
      studentId: actor.studentId,
      unit: actor.unit,
      positionAtTime: actor.position,
      checkInTime: new Date().toISOString(),
      status: attendanceStatus,
      method: 'qr',
      notes: attendanceStatus === 'present'
        ? 'Điểm danh đúng giờ qua QR'
        : 'Điểm danh qua QR sau ngưỡng tính muộn (Ghi nhận Đi trễ)'
    };

    store.attendance.unshift(newRecord);

    // Update feedback eligibility table
    const existingEligibility = store.feedbackEligibility.find(e => e.sessionId === session.id && e.memberId === actor.id);
    if (!existingEligibility) {
      store.feedbackEligibility.push({
        id: `fe-${Date.now()}`,
        sessionId: session.id,
        memberId: actor.id,
        hasSubmitted: false
      });
    }

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      actorUnit: actor.unit,
      action: 'Điểm danh QR thành công',
      targetType: 'Attendance',
      targetId: newRecord.id,
      details: `${actor.fullName} (${actor.studentId}) điểm danh buổi "${session.title}" - Trạng thái: ${attendanceStatus}`
    });

    db.save();

    res.json({
      success: true,
      alreadyCheckedIn: false,
      status: attendanceStatus,
      statusText: attendanceStatus === 'present' ? 'Có mặt đúng giờ' : 'Đi trễ',
      message: attendanceStatus === 'present'
        ? `Điểm danh thành công! Bạn có mặt đúng giờ tại "${session.title}".`
        : `Điểm danh thành công! Bạn đến sau mốc 10 phút, được ghi nhận "Đi trễ".`,
      record: newRecord,
      session: {
        id: session.id,
        title: session.title,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location
      },
      member: {
        id: actor.id,
        fullName: actor.fullName,
        studentId: actor.studentId,
        email: actor.email,
        unit: actor.unit
      }
    });
  } finally {
    inFlightCheckins.delete(lockKey);
  }
});

// POST /api/attendance/manual-checkin - Manual check-in by authorized person
// Rule: Người phụ trách buổi hoặc BTV được ghi nhận điểm danh thủ công.
attendanceRouter.post('/manual-checkin', (req, res) => {
  const actor = req.user!;
  const { sessionId, memberId, status, notes } = req.body;

  const store = db.get();
  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training.' });
  }

  // Authorization check: Person in charge, BTV, BN, or Admin
  const isPic = isUserSessionPic(session, actor);
  const isBtv = actor.unit === 'BTV';
  const isBn = actor.unit === 'BN';
  const isAdmin = actor.role === 'admin' || actor.role === 'sysadmin';

  if (!isPic && !isBtv && !isBn && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Người phụ trách buổi, Ban Thành viên hoặc Ban Chủ nhiệm mới có quyền điểm danh thủ công.'
    });
  }

  const targetMember = store.users.find(u => u.id === memberId);
  if (!targetMember) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên cần điểm danh.' });
  }

  let record = store.attendance.find(a => a.sessionId === sessionId && a.memberId === memberId);

  if (record) {
    const previousStatus = record.status;
    record.status = status;
    record.method = 'manual';
    record.verifiedBy = actor.fullName;
    record.notes = notes || `Điểm danh thủ công bởi ${actor.fullName}`;
    if (!record.overrideHistory) record.overrideHistory = [];
    record.overrideHistory.unshift({
      previousStatus,
      newStatus: status,
      editedBy: actor.fullName,
      timestamp: new Date().toISOString(),
      reason: notes || 'Điểm danh thủ công tại chỗ'
    });
  } else {
    record = {
      id: `att-${Date.now()}`,
      sessionId: session.id,
      sessionTitle: session.title,
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      studentId: targetMember.studentId,
      unit: targetMember.unit,
      positionAtTime: targetMember.position,
      checkInTime: new Date().toISOString(),
      status: status || 'present',
      method: 'manual',
      verifiedBy: actor.fullName,
      notes: notes || `Điểm danh thủ công bởi ${actor.fullName}`
    };
    store.attendance.unshift(record);
  }

  // If attended, update feedback eligibility
  if (record.status === 'present' || record.status === 'late') {
    const el = store.feedbackEligibility.find(e => e.sessionId === session.id && e.memberId === targetMember.id);
    if (!el) {
      store.feedbackEligibility.push({
        id: `fe-${Date.now()}`,
        sessionId: session.id,
        memberId: targetMember.id,
        hasSubmitted: false
      });
    }
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Điểm danh thủ công',
    targetType: 'Attendance',
    targetId: record.id,
    details: `${actor.fullName} ghi nhận điểm danh thủ công cho ${targetMember.fullName}: ${status}`
  });

  db.save();

  res.json({ success: true, message: 'Ghi nhận điểm danh thủ công thành công!', record });
});

// POST /api/attendance/finalize - Finalize/Lock attendance list
attendanceRouter.post('/finalize', (req, res) => {
  const actor = req.user!;
  const { sessionId } = req.body;

  const store = db.get();
  const session = store.sessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training.' });
  }

  const isPic = isUserSessionPic(session, actor);
  const isBn = actor.unit === 'BN';
  const isAdmin = actor.role === 'admin' || actor.role === 'sysadmin';

  if (!isPic && !isBn && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Người phụ trách buổi hoặc Ban Chủ nhiệm mới có quyền chốt danh sách điểm danh.'
    });
  }

  session.attendanceStatus = 'finalized';
  session.finalizedBy = actor.fullName;
  session.finalizedAt = new Date().toISOString();

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Chốt danh sách điểm danh',
    targetType: 'TrainingSession',
    targetId: session.id,
    details: `${actor.fullName} đã chốt danh sách điểm danh cho buổi "${session.title}"`
  });

  db.save();

  res.json({
    success: true,
    message: `Đã chốt danh sách điểm danh buổi "${session.title}" thành công!`,
    session
  });
});

// PATCH /api/attendance/:id/override - Edit attendance after finalization
attendanceRouter.patch('/:id/override', (req, res) => {
  const actor = req.user!;
  const { newStatus, reason } = req.body;

  if (!newStatus || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Bắt buộc phải cung cấp trạng thái mới và lý do điều chỉnh điểm danh.'
    });
  }

  // Check authorization: BTV, BN, or Admin
  if (actor.unit !== 'BTV' && actor.unit !== 'BN' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Thành viên (BTV) hoặc Ban Chủ nhiệm (BN) mới có quyền chỉnh sửa điểm danh sau khi chốt.'
    });
  }

  const store = db.get();
  const record = store.attendance.find(a => a.id === req.params.id);

  if (!record) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi điểm danh.' });
  }

  const previousStatus = record.status;
  record.status = newStatus;
  if (!record.overrideHistory) record.overrideHistory = [];
  record.overrideHistory.unshift({
    previousStatus,
    newStatus,
    editedBy: actor.fullName,
    timestamp: new Date().toISOString(),
    reason
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Điều chỉnh điểm danh sau chốt',
    targetType: 'Attendance',
    targetId: record.id,
    previousValue: previousStatus,
    newValue: newStatus,
    reason,
    details: `Đổi trạng thái điểm danh của ${record.memberName} từ ${previousStatus} sang ${newStatus}. Lý do: ${reason}`
  });

  db.save();

  res.json({
    success: true,
    message: 'Điều chỉnh kết quả điểm danh thành công!',
    record
  });
});

// POST /api/attendance/absence-explanation - Submit absence explanation (48-hour window)
attendanceRouter.post('/absence-explanation', (req, res) => {
  const actor = req.user!;
  const { sessionId, reason, evidenceUrl } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập lý do giải trình vắng mặt.' });
  }

  const store = db.get();
  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training.' });
  }

  const sessionEndTimestamp = parseSessionDateTime(session.date, session.endTime);
  const deadline48h = sessionEndTimestamp + 48 * 60 * 60 * 1000;
  const isLateSubmission = Date.now() > deadline48h;

  const newRequest: AttendanceRequest = {
    id: `req-abs-${Date.now()}`,
    type: 'absence_explanation',
    sessionId: session.id,
    sessionTitle: session.title,
    memberId: actor.id,
    memberName: actor.fullName,
    studentId: actor.studentId,
    reason,
    evidenceUrl,
    submittedAt: new Date().toISOString(),
    isLateSubmission,
    status: 'pending'
  };

  store.attendanceRequests.unshift(newRequest);

  // Notify PIC and Admins/BN
  if (Array.isArray(store.notifications)) {
    const notifyTargets: string[] = [];
    if (session.personInChargeId) notifyTargets.push(session.personInChargeId);
    const adminUsers = store.users.filter(u => u.role === 'admin' || u.role === 'sysadmin' || u.unit === 'BN');
    adminUsers.forEach(adm => {
      if (!notifyTargets.includes(adm.id) && adm.id !== actor.id) {
        notifyTargets.push(adm.id);
      }
    });

    notifyTargets.forEach(targetId => {
      const targetUser = store.users.find(u => u.id === targetId);
      store.notifications.unshift({
        id: `notif-${Date.now()}-abs-${targetId}`,
        userId: targetId,
        recipientId: targetId,
        recipientEmail: targetUser?.email || '',
        title: 'Đơn xin vắng mới cần duyệt',
        content: `Thành viên ${actor.fullName} (${actor.studentId}) vừa gửi đơn xin vắng cho buổi "${session.title}".`,
        message: `Thành viên ${actor.fullName} (${actor.studentId}) vừa gửi đơn xin vắng cho buổi "${session.title}".`,
        type: 'approval_required',
        referenceType: 'attendance',
        referenceId: newRequest.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        emailSent: false
      } as any);
    });
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Nộp giải trình vắng mặt',
    targetType: 'AttendanceRequest',
    targetId: newRequest.id,
    details: `${actor.fullName} gửi giải trình vắng mặt buổi "${session.title}" (Nộp trễ hạn 48h: ${isLateSubmission ? 'Có' : 'Không'})`
  });

  db.save();

  res.json({
    success: true,
    message: isLateSubmission
      ? 'Đơn giải trình đã gửi sau hạn 48h. Hệ thống sẽ chuyển đến Ban Chủ nhiệm để quyết định có tiếp nhận xem xét ngoại lệ hay không.'
      : 'Gửi đơn giải trình vắng mặt thành công. Người phụ trách buổi sẽ xem xét theo quy định.',
    request: newRequest
  });
});

// POST /api/attendance/correction-request - Submit correction request (24-hour window)
attendanceRouter.post('/correction-request', (req, res) => {
  const actor = req.user!;
  const { sessionId, reason, evidenceUrl } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập lý do yêu cầu sửa điểm danh.' });
  }

  const store = db.get();
  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training.' });
  }

  const sessionEndTimestamp = parseSessionDateTime(session.date, session.endTime);
  const deadline24h = sessionEndTimestamp + 24 * 60 * 60 * 1000;
  const isLateSubmission = Date.now() > deadline24h;

  const newRequest: AttendanceRequest = {
    id: `req-cor-${Date.now()}`,
    type: 'correction_request',
    sessionId: session.id,
    sessionTitle: session.title,
    memberId: actor.id,
    memberName: actor.fullName,
    studentId: actor.studentId,
    reason,
    evidenceUrl,
    submittedAt: new Date().toISOString(),
    isLateSubmission,
    status: 'pending'
  };

  store.attendanceRequests.unshift(newRequest);

  // Notify PIC and Admins/BN
  if (Array.isArray(store.notifications)) {
    const notifyTargets: string[] = [];
    if (session.personInChargeId) notifyTargets.push(session.personInChargeId);
    const adminUsers = store.users.filter(u => u.role === 'admin' || u.role === 'sysadmin' || u.unit === 'BN');
    adminUsers.forEach(adm => {
      if (!notifyTargets.includes(adm.id) && adm.id !== actor.id) {
        notifyTargets.push(adm.id);
      }
    });

    notifyTargets.forEach(targetId => {
      const targetUser = store.users.find(u => u.id === targetId);
      store.notifications.unshift({
        id: `notif-${Date.now()}-cor-${targetId}`,
        userId: targetId,
        recipientId: targetId,
        recipientEmail: targetUser?.email || '',
        title: 'Khiếu nại điểm danh mới cần duyệt',
        content: `Thành viên ${actor.fullName} (${actor.studentId}) vừa gửi đơn đính chính điểm danh cho buổi "${session.title}".`,
        message: `Thành viên ${actor.fullName} (${actor.studentId}) vừa gửi đơn đính chính điểm danh cho buổi "${session.title}".`,
        type: 'approval_required',
        referenceType: 'attendance',
        referenceId: newRequest.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        emailSent: false
      } as any);
    });
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Nộp yêu cầu sửa điểm danh',
    targetType: 'AttendanceRequest',
    targetId: newRequest.id,
    details: `${actor.fullName} gửi yêu cầu sửa điểm danh buổi "${session.title}" (Quá hạn 24h: ${isLateSubmission ? 'Có' : 'Không'})`
  });

  db.save();

  res.json({
    success: true,
    message: isLateSubmission
      ? 'Yêu cầu gửi sau thời hạn 24h. BTV đã tiếp nhận và đang chờ Ban Chủ nhiệm quyết định ngoại lệ.'
      : 'Yêu cầu sửa điểm danh đã được gửi thành công.',
    request: newRequest
  });
});

// GET /api/attendance/requests - List requests
attendanceRouter.get('/requests', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  let requests = store.attendanceRequests;
  if (actor.role === 'member' || actor.role === 'applicant') {
    requests = requests.filter(r => r.memberId === actor.id);
  }

  res.json({ success: true, requests });
});

// POST /api/attendance/requests/:id/decide - Review request
attendanceRouter.post('/requests/:id/decide', (req, res) => {
  const actor = req.user!;
  const { decision, notes, newAttendanceStatus } = req.body;

  const store = db.get();
  const request = store.attendanceRequests.find(r => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
  }

  // Authorization check according to request type:
  // For late submission: BN must approve review permission first
  if (request.isLateSubmission && !request.bnApprovedForReview && actor.unit !== 'BN' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Đơn này nộp quá hạn, cần sự phê duyệt cho phép xem xét từ Ban Chủ nhiệm trước.'
    });
  }

  request.status = decision;
  request.decidedBy = actor.fullName;
  request.decidedAt = new Date().toISOString();
  request.decisionNotes = notes;

  if (decision === 'approved' && newAttendanceStatus) {
    let rec = store.attendance.find(a => a.sessionId === request.sessionId && a.memberId === request.memberId);
    if (rec) {
      const prev = rec.status;
      rec.status = newAttendanceStatus as AttendanceStatus;
      if (!rec.overrideHistory) rec.overrideHistory = [];
      rec.overrideHistory.unshift({
        previousStatus: prev,
        newStatus: newAttendanceStatus as AttendanceStatus,
        editedBy: actor.fullName,
        timestamp: new Date().toISOString(),
        reason: `Duyệt đơn ${request.type === 'absence_explanation' ? 'giải trình vắng' : 'sửa điểm danh'}: ${notes || ''}`
      });
    } else {
      rec = {
        id: `att-${Date.now()}`,
        sessionId: request.sessionId,
        sessionTitle: request.sessionTitle,
        memberId: request.memberId,
        memberName: request.memberName,
        studentId: request.studentId,
        unit: 'BDH',
        positionAtTime: 'Thành viên',
        checkInTime: new Date().toISOString(),
        status: newAttendanceStatus as AttendanceStatus,
        method: 'appeal',
        notes: `Cập nhật từ đơn được duyệt: ${notes || ''}`
      };
      store.attendance.unshift(rec);
    }
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: `Quyết định đơn ${request.type}`,
    targetType: 'AttendanceRequest',
    targetId: request.id,
    details: `${actor.fullName} đã ${decision === 'approved' ? 'chấp thuận' : 'từ chối'} đơn của ${request.memberName}. Ghi chú: ${notes || 'Không'}`
  });

  // Notify student of decision
  if (Array.isArray(store.notifications)) {
    const studentUser = store.users.find(u => u.id === request.memberId);
    store.notifications.unshift({
      id: `notif-${Date.now()}-dec`,
      userId: request.memberId,
      recipientId: request.memberId,
      recipientEmail: studentUser?.email || '',
      title: decision === 'approved' 
        ? (request.type === 'absence_explanation' ? 'Đơn xin vắng đã được duyệt' : 'Khiếu nại điểm danh đã được duyệt')
        : (request.type === 'absence_explanation' ? 'Đơn xin vắng bị từ chối' : 'Khiếu nại điểm danh bị từ chối'),
      content: `Đơn của bạn cho buổi "${request.sessionTitle}" đã được ${actor.fullName} ${decision === 'approved' ? 'chấp thuận (Cập nhật kết quả: Vắng có phép)' : 'từ chối'}.${notes ? ` Ghi chú: ${notes}` : ''}`,
      message: `Đơn của bạn cho buổi "${request.sessionTitle}" đã được ${actor.fullName} ${decision === 'approved' ? 'chấp thuận (Cập nhật kết quả: Vắng có phép)' : 'từ chối'}.${notes ? ` Ghi chú: ${notes}` : ''}`,
      type: 'status_change',
      referenceType: 'attendance',
      referenceId: request.id,
      isRead: false,
      createdAt: new Date().toISOString(),
      emailSent: false
    } as any);
  }

  db.save();

  res.json({ success: true, message: `Đã xử lý yêu cầu (${decision === 'approved' ? 'Chấp thuận' : 'Từ chối'}) thành công!`, request });
});
