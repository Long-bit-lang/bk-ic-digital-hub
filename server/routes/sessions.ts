// Training Session Management Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { TrainingSession, SessionStatus } from '../../src/types/index.ts';
import { checkQRWindow, parseSessionDateTime, addHours, syncSessionsLifecycle, formatTimeFromMs, getSessionScheduleTimes } from '../timeUtils.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const sessionsRouter = Router();

sessionsRouter.use(requireAuth);
sessionsRouter.use(requireNormalSession);

// Helper to verify if an authenticated user is the assigned Person in Charge (PIC) of a meeting
// Backwards compatible with legacy or alternative field names (personInChargeId, organizerId, hostId, etc.)
export function isUserSessionPic(session: TrainingSession | any, user: { id: string } | null | undefined): boolean {
  if (!user || !session) return false;
  return (
    session.personInChargeId === user.id ||
    session.organizerId === user.id ||
    session.responsibleUserId === user.id ||
    session.hostId === user.id
  );
}

// Helper to normalize and enrich session object
function enrichSession(session: TrainingSession) {
  const target = session.targetAudience || session.targetParticipants || 'Toàn thể thành viên chính thức';
  const qrStatus = session.status === 'cancelled'
    ? { isOpen: false, isCancelled: true }
    : checkQRWindow(
        session.date,
        session.startTime,
        session.attendanceOpenTime,
        session.attendanceCloseTime
      );

  const times = getSessionScheduleTimes(session);
  const effectiveOpenTime = session.attendanceOpenTime || formatTimeFromMs(times.openMs);
  const effectiveCloseTime = session.attendanceCloseTime || formatTimeFromMs(times.closeMs);
  const effectiveLateTime = session.lateThresholdTime || formatTimeFromMs(times.lateMs);

  return {
    ...session,
    targetAudience: target,
    targetParticipants: target,
    qrWindowDetails: qrStatus,
    effectiveAttendanceOpenTime: effectiveOpenTime,
    effectiveAttendanceCloseTime: effectiveCloseTime,
    effectiveLateThresholdTime: effectiveLateTime,
    isAttendanceOpen: session.status !== 'cancelled' && session.attendanceStatus === 'open'
  };
}

// GET /api/sessions - List training sessions
sessionsRouter.get('/', (req, res) => {
  const store = db.get();
  
  // Synchronize state machine based on authoritative server clock
  const changed = syncSessionsLifecycle(store);
  if (changed) {
    db.save();
  }

  // Calculate dynamic QR window status and normalize target fields for each session
  const enriched = store.sessions.map(enrichSession);

  res.json({ success: true, sessions: enriched });
});

// GET /api/sessions/:id
sessionsRouter.get('/:id', (req, res) => {
  const store = db.get();
  const changed = syncSessionsLifecycle(store);
  if (changed) {
    db.save();
  }

  const session = store.sessions.find(s => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training' });
  }

  res.json({
    success: true,
    session: enrichSession(session)
  });
});

// POST /api/sessions - Create new training session
// Business rule:
// 1. Chỉ BN và BĐH hoặc Admin được tạo buổi training.
// 2. Không cho phép hoàn tất thao tác tạo buổi nếu chưa chỉ định người phụ trách bắt buộc.
sessionsRouter.post('/', (req, res) => {
  const actor = req.user!;

  // Check role/unit: Only BN or BDH or Admin
  if (actor.unit !== 'BN' && actor.unit !== 'BDH' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) và Ban Điều hành (BĐH) mới có quyền tạo buổi training.'
    });
  }

  const {
    title,
    description,
    targetAudience,
    targetParticipants,
    personInChargeId,
    date,
    startTime,
    endTime,
    location,
    unit,
    attendanceOpenTime,
    attendanceCloseTime,
    lateThresholdTime,
    category,
    organizer,
    qrIntervalSec
  } = req.body;

  const store = db.get();
  // Resilient resolution: fallback to creator if personInChargeId not explicitly provided
  const effectivePicId = (personInChargeId && typeof personInChargeId === 'string' && personInChargeId.trim()) 
    ? personInChargeId.trim() 
    : actor.id;

  const personInCharge = store.users.find(u => u.id === effectivePicId) || actor;

  if (!personInCharge) {
    return res.status(400).json({
      success: false,
      message: 'Bắt buộc phải chỉ định Người phụ trách buổi training trước khi tạo buổi.'
    });
  }

  if (!title || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ các thông tin: Tên buổi, ngày tổ chức, giờ bắt đầu và giờ kết thúc.'
    });
  }

  // Preserve whichever field was passed by frontend, with clean fallback only if neither provided
  const resolvedTarget = (targetAudience !== undefined && String(targetAudience).trim() !== '')
    ? String(targetAudience).trim()
    : (targetParticipants !== undefined && String(targetParticipants).trim() !== '')
      ? String(targetParticipants).trim()
      : 'Toàn thể thành viên chính thức';

  // Calculate default feedback deadline: endTime + 24 hours
  const sessionEndTimestamp = parseSessionDateTime(date, endTime);
  const feedbackDeadline = new Date(sessionEndTimestamp + 24 * 60 * 60 * 1000).toISOString();

  const tempTimes = getSessionScheduleTimes({
    date,
    startTime,
    endTime,
    attendanceOpenTime,
    attendanceCloseTime,
    lateThresholdTime
  });
  const resolvedOpenTime = (attendanceOpenTime && String(attendanceOpenTime).trim()) || formatTimeFromMs(tempTimes.openMs);
  const resolvedCloseTime = (attendanceCloseTime && String(attendanceCloseTime).trim()) || formatTimeFromMs(tempTimes.closeMs);
  const resolvedLateTime = (lateThresholdTime && String(lateThresholdTime).trim()) || formatTimeFromMs(tempTimes.lateMs);

  const newSession: TrainingSession = {
    id: `ses-${Date.now()}`,
    title,
    description: description || '',
    targetAudience: resolvedTarget,
    targetParticipants: resolvedTarget,
    personInChargeId: personInCharge.id,
    personInChargeName: personInCharge.fullName,
    createdById: actor.id,
    createdByName: actor.fullName,
    unit: unit || actor.unit || 'BDH',
    date,
    startTime,
    endTime,
    location: location || 'Hội trường Bách khoa (DUT)',
    status: 'scheduled',
    attendanceStatus: 'closed',
    attendanceOpenTime: resolvedOpenTime,
    attendanceCloseTime: resolvedCloseTime,
    lateThresholdTime: resolvedLateTime,
    category: category || 'workshop',
    organizer: organizer || personInCharge.fullName,
    qrIntervalSec: Number(qrIntervalSec) || 20,
    qrWindowOpenMinutes: 15,
    qrWindowCloseMinutes: 15,
    lateThresholdMinutes: 10,
    feedbackStatus: 'closed',
    feedbackDeadline,
    timeHistory: []
  };

  store.sessions.unshift(newSession);

  // Sync lifecycle immediately against authoritative server clock
  syncSessionsLifecycle(store);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Tạo buổi training mới',
    targetType: 'TrainingSession',
    targetId: newSession.id,
    details: `Tạo buổi "${newSession.title}" vào ngày ${newSession.date} (${newSession.startTime} - ${newSession.endTime}). Đối tượng: "${resolvedTarget}". Người phụ trách: ${newSession.personInChargeName}`
  });

  db.save();

  res.json({
    success: true,
    message: 'Tạo buổi training mới thành công!',
    session: enrichSession(newSession)
  });
});

// PATCH /api/sessions/:id - Update session details or change times
// Rule: Mọi thay đổi thời gian phải ghi người thực hiện, thời điểm, giá trị cũ, giá trị mới và lý do.
sessionsRouter.patch('/:id', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const session = store.sessions.find(s => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training' });
  }

  // Permission: BN, Admin, or the assigned Person In Charge of this specific meeting
  const isAdmin = actor.role === 'admin' || actor.role === 'sysadmin';
  const isBn = actor.unit === 'BN';
  const isPic = isUserSessionPic(session, actor);

  if (!isAdmin && !isBn && !isPic) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền chỉnh sửa buổi training này.'
    });
  }

  const {
    title,
    description,
    targetAudience,
    targetParticipants,
    personInChargeId,
    date,
    startTime,
    endTime,
    location,
    status,
    attendanceStatus,
    attendanceOpenTime,
    attendanceCloseTime,
    lateThresholdTime,
    category,
    organizer,
    timeChangeReason
  } = req.body;

  // Handle time change logging & deadline recalculations
  if (
    (startTime && startTime !== session.startTime) ||
    (endTime && endTime !== session.endTime) ||
    (date && date !== session.date)
  ) {
    const effectiveReason = (timeChangeReason && String(timeChangeReason).trim()) || 'Điều chỉnh thời gian sinh hoạt & khung giờ điểm danh';

    if (!session.timeHistory) session.timeHistory = [];
    session.timeHistory.unshift({
      changedBy: actor.fullName,
      timestamp: new Date().toISOString(),
      oldStartTime: `${session.date} ${session.startTime}`,
      oldEndTime: `${session.date} ${session.endTime}`,
      newStartTime: `${date || session.date} ${startTime || session.startTime}`,
      newEndTime: `${date || session.date} ${endTime || session.endTime}`,
      reason: effectiveReason
    });

    if (endTime) {
      const endTimestamp = parseSessionDateTime(date || session.date, endTime);
      session.feedbackDeadline = new Date(endTimestamp + 24 * 60 * 60 * 1000).toISOString();
    }
  }

  // Only Admin, SysAdmin, or Ban Chủ nhiệm (BN) can reassign Person In Charge
  if (personInChargeId && personInChargeId !== session.personInChargeId) {
    if (!isAdmin && !isBn) {
      return res.status(403).json({
        success: false,
        message: 'Chỉ Admin hoặc Ban Chủ nhiệm mới có quyền thay đổi Người phụ trách buổi sinh hoạt.'
      });
    }
    const newPic = store.users.find(u => u.id === personInChargeId);
    if (newPic) {
      session.personInChargeId = newPic.id;
      session.personInChargeName = newPic.fullName;
    }
  }

  if (title) session.title = title;
  if (description !== undefined) session.description = description;

  // Preserve target audience without overwriting valid values
  if (targetAudience !== undefined) {
    session.targetAudience = targetAudience;
    session.targetParticipants = targetAudience;
  } else if (targetParticipants !== undefined) {
    session.targetAudience = targetParticipants;
    session.targetParticipants = targetParticipants;
  }

  if (date) session.date = date;
  if (startTime) session.startTime = startTime;
  if (endTime) session.endTime = endTime;
  if (location) session.location = location;
  if (status) session.status = status;
  if (attendanceStatus) {
    session.attendanceStatus = attendanceStatus;
    if (attendanceStatus === 'open') {
      session.manualGate = 'open';
      const times = getSessionScheduleTimes(session);
      const nowMs = Date.now();
      session.manualGateUntilMs = Math.max(times.closeMs, nowMs + 15 * 60 * 1000);
      session.attendanceCloseTime = formatTimeFromMs(session.manualGateUntilMs);
    } else if (attendanceStatus === 'closed') {
      session.manualGate = 'closed';
      delete session.manualGateUntilMs;
    }
  }
  if (attendanceOpenTime !== undefined) session.attendanceOpenTime = attendanceOpenTime;
  if (attendanceCloseTime !== undefined) session.attendanceCloseTime = attendanceCloseTime;
  if (lateThresholdTime !== undefined) session.lateThresholdTime = lateThresholdTime;
  if (category) session.category = category;
  if (organizer) session.organizer = organizer;

  // Sync lifecycle after changes
  syncSessionsLifecycle(store);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Cập nhật thông tin buổi training',
    targetType: 'TrainingSession',
    targetId: session.id,
    details: `Cập nhật thông tin buổi "${session.title}". Đối tượng: "${session.targetAudience}"`
  });

  db.save();

  res.json({ success: true, session: enrichSession(session) });
});

// DELETE /api/sessions/:id - Delete session (Strictly Admin or BN only)
sessionsRouter.delete('/:id', (req, res) => {
  const actor = req.user!;
  const isAdmin = actor.role === 'admin' || actor.role === 'sysadmin';
  const isBn = actor.unit === 'BN';
  if (!isAdmin && !isBn) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Quản trị viên (Admin) hoặc Ban Chủ nhiệm mới có quyền xóa buổi meeting.'
    });
  }

  const store = db.get();
  const idx = store.sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi meeting cần xóa.' });
  }

  const [deleted] = store.sessions.splice(idx, 1);
  db.save();

  res.json({
    success: true,
    message: `Đã xóa buổi "${deleted.title}" thành công.`,
    session: deleted
  });
});

// POST /api/sessions/:id/cancel - Cancel session
sessionsRouter.post('/:id/cancel', (req, res) => {
  const actor = req.user!;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp lý do hủy buổi training.' });
  }

  const store = db.get();
  const session = store.sessions.find(s => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training.' });
  }

  const isPic = isUserSessionPic(session, actor);
  const isAuthorized = actor.unit === 'BN' || actor.unit === 'BDH' || isPic || actor.role === 'admin' || actor.role === 'sysadmin';
  if (!isAuthorized) {
    return res.status(403).json({ success: false, message: 'Bạn không có thẩm quyền hủy buổi training này.' });
  }

  session.status = 'cancelled';
  session.attendanceStatus = 'closed';
  session.feedbackStatus = 'closed';

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Hủy buổi training',
    targetType: 'TrainingSession',
    targetId: session.id,
    reason,
    details: `Hủy buổi "${session.title}". Vô hiệu hóa QR và form phản hồi. Không tính vắng mặt cho thành viên.`
  });

  db.save();

  res.json({
    success: true,
    message: 'Đã hủy buổi training và vô hiệu hóa các biểu mẫu liên quan.',
    session
  });
});

// POST /api/sessions/:id/reopen-feedback - Reopen feedback form (BN or Admin only)
sessionsRouter.post('/:id/reopen-feedback', (req, res) => {
  const actor = req.user!;
  const { reason } = req.body;

  if (actor.unit !== 'BN' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) mới có thẩm quyền phê duyệt mở lại biểu mẫu phản hồi sau khi đã đóng.'
    });
  }

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập lý do phê duyệt mở lại biểu mẫu phản hồi.'
    });
  }

  const store = db.get();
  const session = store.sessions.find(s => s.id === req.params.id);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy buổi training.' });
  }

  if (session.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Buổi training đã bị hủy, không thể mở lại biểu mẫu phản hồi.'
    });
  }

  const now = new Date();
  const newDeadline = addHours(now, 24);

  session.feedbackStatus = 'reopened';
  session.feedbackDeadline = newDeadline;
  session.feedbackReopenedBy = actor.fullName;
  session.feedbackReopenReason = reason;
  session.feedbackReopenedAt = now.toISOString();

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: now.toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: 'BN',
    action: 'Mở lại biểu mẫu phản hồi',
    targetType: 'TrainingSession',
    targetId: session.id,
    reason,
    details: `Ban Chủ nhiệm phê duyệt mở lại biểu mẫu phản hồi cho "${session.title}" thêm 24 giờ (đến ${newDeadline}). Lý do: ${reason}`
  });

  db.save();

  res.json({
    success: true,
    message: 'Ban Chủ nhiệm đã phê duyệt mở lại biểu mẫu phản hồi thêm 24 giờ thành công!',
    session
  });
});
