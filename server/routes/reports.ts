// Reporting and Export Routes (Excel CSV with BOM & Printable PDF Layouts)
import { Router } from 'express';
import { db } from '../db.ts';
import type { ExportLog } from '../../src/types/index.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);
reportsRouter.use(requireNormalSession);

// GET /api/reports/summary - Aggregate club dashboard metrics
reportsRouter.get('/summary', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  const isBnOrAdmin = actor.unit === 'BN' || actor.role === 'admin';
  const unitFilter = isBnOrAdmin ? undefined : actor.unit;

  // Filter members
  const members = unitFilter ? store.users.filter(u => u.unit === unitFilter) : store.users;
  const activeMembers = members.filter(u => u.status === 'active').length;
  const pausedMembers = members.filter(u => u.status === 'paused').length;
  const leftMembers = members.filter(u => u.status === 'left').length;

  // Filter tasks
  const tasks = unitFilter ? store.tasks.filter(t => t.assignedUnit === unitFilter || t.primaryUnit === unitFilter) : store.tasks;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const cancelledTasks = tasks.filter(t => t.status === 'cancelled').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;

  const applicableTasks = tasks.length - cancelledTasks;
  const taskCompletionRate = applicableTasks > 0 ? Math.round((completedTasks / applicableTasks) * 100) : 0;

  // Sessions
  const sessions = store.sessions;
  const totalSessions = sessions.length;
  const finalizedSessions = sessions.filter(s => s.attendanceStatus === 'finalized').length;

  // Attendance
  const totalAttendances = store.attendance.length;
  const onTimeCount = store.attendance.filter(a => a.status === 'present').length;
  const lateCount = store.attendance.filter(a => a.status === 'late').length;
  const attendanceOnTimeRate = totalAttendances > 0 ? Math.round((onTimeCount / totalAttendances) * 100) : 0;

  // Evaluations
  const evaluations = unitFilter ? store.evaluations.filter(e => e.unit === unitFilter) : store.evaluations;
  const approvedEvals = evaluations.filter(e => e.status === 'approved');
  const validScores = approvedEvals.filter(e => e.totalScore !== null).map(e => e.totalScore!);
  const avgEvaluationScore = validScores.length > 0 
    ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 100) / 100 
    : 0;

  res.json({
    success: true,
    metrics: {
      totalMembers: members.length,
      activeMembers,
      pausedMembers,
      leftMembers,
      totalSessions,
      finalizedSessions,
      attendanceOnTimeRate,
      totalTasks: tasks.length,
      completedTasks,
      cancelledTasks,
      inProgressTasks,
      overdueTasks,
      taskCompletionRate,
      totalEvaluations: evaluations.length,
      approvedEvaluations: approvedEvals.length,
      avgEvaluationScore
    }
  });
});

// POST /api/reports/export - Export data (Excel CSV UTF-8 with BOM or Printable Data)
reportsRouter.post('/export', (req, res) => {
  const actor = req.user!;
  const { type, format, unit, month, sessionId } = req.body;

  // Authorization check: Leader, BN, or Admin
  if (actor.role !== 'leader' && actor.role !== 'admin' && actor.unit !== 'BN') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền xuất báo cáo dữ liệu.'
    });
  }

  const store = db.get();
  const isBnOrAdmin = actor.unit === 'BN' || actor.role === 'admin';
  const effectiveUnit = isBnOrAdmin ? unit : actor.unit;

  let csvContent = '';
  let filename = `BKIC_BaoCao_${type}_${Date.now()}`;

  // Log export
  const exportLog: ExportLog = {
    id: `exp-${Date.now()}`,
    exporterId: actor.id,
    exporterName: actor.fullName,
    exporterRole: actor.role,
    exportType: type,
    format: format || 'excel',
    filterSummary: JSON.stringify({ unit: effectiveUnit, month, sessionId }),
    timestamp: new Date().toISOString()
  };
  store.exportLogs.unshift(exportLog);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: `Xuất dữ liệu báo cáo (${format?.toUpperCase() || 'EXCEL'})`,
    targetType: 'Report',
    targetId: exportLog.id,
    details: `${actor.fullName} xuất báo cáo "${type}". Định dạng: ${format}. Bộ lọc: Đơn vị ${effectiveUnit || 'Tất cả'}`
  });

  db.save();

  // Generate Excel CSV with UTF-8 BOM (\uFEFF)
  const BOM = '\uFEFF';

  if (type === 'members') {
    let list = store.users;
    if (effectiveUnit) list = list.filter(u => u.unit === effectiveUnit);

    const headers = ['Mã TV', 'Họ và Tên', 'MSSV', 'Khoa', 'Lớp', 'Đơn vị', 'Chức vụ', 'Trạng thái', 'Ngày hiệu lực', 'Email'];
    const rows = list.map(m => [
      m.id,
      `"${m.fullName}"`,
      m.studentId,
      `"${m.faculty}"`,
      m.classId,
      m.unit,
      `"${m.position}"`,
      m.status === 'active' ? 'Đang hoạt động' : m.status === 'paused' ? 'Bảo lưu' : 'Đã rời CLB',
      m.statusEffectiveDate,
      m.email
    ]);

    csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    filename = `BKIC_DanhSachThanhVien_${effectiveUnit || 'ToanCLB'}.csv`;
  } else if (type === 'attendance') {
    let list = store.attendance;
    if (sessionId) list = list.filter(a => a.sessionId === sessionId);
    if (effectiveUnit) list = list.filter(a => a.unit === effectiveUnit);

    const headers = ['Buổi Training', 'Họ và Tên', 'MSSV', 'Đơn vị', 'Thời gian điểm danh', 'Trạng thái', 'Phương thức', 'Ghi chú'];
    const rows = list.map(a => [
      `"${a.sessionTitle}"`,
      `"${a.memberName}"`,
      a.studentId,
      a.unit,
      new Date(a.checkInTime).toLocaleString('vi-VN'),
      a.status === 'present' ? 'Có mặt đúng giờ' : a.status === 'late' ? 'Đi trễ' : a.status === 'excused' ? 'Vắng có phép' : 'Vắng không phép',
      a.method === 'qr' ? 'Quét QR' : a.method === 'manual' ? 'Thủ công' : 'Đơn giải trình',
      `"${a.notes || ''}"`
    ]);

    csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    filename = `BKIC_DiemDanh_${sessionId || 'TongHop'}.csv`;
  } else if (type === 'tasks') {
    let list = store.tasks;
    if (effectiveUnit) list = list.filter(t => t.assignedUnit === effectiveUnit || t.primaryUnit === effectiveUnit);

    const headers = ['Mã Task', 'Tiêu đề', 'Đơn vị', 'Người thực hiện', 'Người giao', 'Hạn hoàn thành', 'Trạng thái'];
    const rows = list.map(t => [
      t.id,
      `"${t.title}"`,
      t.assignedUnit,
      `"${t.assigneeName}"`,
      `"${t.leadAssigneeName}"`,
      new Date(t.deadline).toLocaleString('vi-VN'),
      t.status === 'completed' ? 'Hoàn thành' : t.status === 'in_progress' ? 'Đang thực hiện' : t.status === 'overdue' ? 'Quá hạn' : t.status === 'cancelled' ? 'Đã hủy (Không trừ điểm)' : t.status
    ]);

    csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    filename = `BKIC_NhiemVu_${effectiveUnit || 'ToanCLB'}.csv`;
  } else if (type === 'evaluations') {
    let list = store.evaluations;
    if (month) list = list.filter(e => e.month === month);
    if (effectiveUnit) list = list.filter(e => e.unit === effectiveUnit);

    const headers = ['Tháng', 'Họ và Tên', 'MSSV', 'Đơn vị', 'Điểm tổng kết', 'Trạng thái', 'Phiên bản', 'Người duyệt'];
    const rows = list.map(e => [
      e.month,
      `"${e.memberName}"`,
      e.studentId,
      e.unit,
      e.totalScore !== null ? e.totalScore.toFixed(2) : 'Chưa đủ dữ liệu',
      e.status === 'approved' ? 'Đã duyệt' : e.status === 'under_appeal' ? 'Đang khiếu nại' : e.status === 'insufficient_data' ? 'Chưa đủ dữ liệu' : e.status,
      `v${e.version}`,
      `"${e.approvedBy || ''}"`
    ]);

    csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    filename = `BKIC_DanhGia_${month || 'TongHop'}.csv`;
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
});

// GET /api/reports/export-logs - View audit trail of exports
reportsRouter.get('/export-logs', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  if (actor.role !== 'admin' && actor.unit !== 'BN') {
    return res.status(403).json({ success: false, message: 'Chỉ Ban Chủ nhiệm hoặc Quản trị viên mới xem được nhật ký xuất báo cáo.' });
  }

  res.json({ success: true, exportLogs: store.exportLogs });
});
