// Task Management Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { Task, TaskStatus, SubTask } from '../../src/types/index.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const tasksRouter = Router();

tasksRouter.use(requireAuth);
tasksRouter.use(requireNormalSession);

// GET /api/tasks - List tasks with role and unit filtering
tasksRouter.get('/', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { unit, assigneeId, status } = req.query;

  let tasks = store.tasks;

  if (unit) {
    tasks = tasks.filter(t => t.assignedUnit === unit || t.primaryUnit === unit);
  }
  if (assigneeId) {
    tasks = tasks.filter(t => t.assigneeId === assigneeId || t.subTasks?.some(st => st.assigneeId === assigneeId));
  }
  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }

  // Access control:
  // Member only sees their assigned tasks or subtasks
  if (actor.role === 'member' || actor.role === 'applicant') {
    tasks = tasks.filter(t => 
      t.assigneeId === actor.id || 
      t.subTasks?.some(st => st.assigneeId === actor.id)
    );
  } else if (actor.role === 'leader') {
    // Leader sees tasks of their unit or tasks where they are leadAssignee
    tasks = tasks.filter(t => 
      t.assignedUnit === actor.unit || 
      t.primaryUnit === actor.unit || 
      t.leadAssigneeId === actor.id
    );
  }

  res.json({ success: true, tasks });
});

// GET /api/tasks/stats/:memberId - Calculate member completion rate
tasksRouter.get('/stats/:memberId', (req, res) => {
  const store = db.get();
  const memberId = req.params.memberId;
  const actor = req.user!;

  // Member can only check their own stats unless leader/admin
  if ((actor.role === 'member' || actor.role === 'applicant') && actor.id !== memberId) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền xem thống kê của thành viên khác.'
    });
  }

  const memberTasks = store.tasks.filter(t => t.assigneeId === memberId);
  const total = memberTasks.length;
  const cancelled = memberTasks.filter(t => t.status === 'cancelled').length;
  const completed = memberTasks.filter(t => t.status === 'completed').length;
  const inProgress = memberTasks.filter(t => t.status === 'in_progress').length;
  const overdue = memberTasks.filter(t => t.status === 'overdue').length;

  const applicableTasks = total - cancelled;
  const completionRate = applicableTasks > 0 ? Math.round((completed / applicableTasks) * 100) : null;

  res.json({
    success: true,
    stats: {
      totalTasks: total,
      completed,
      inProgress,
      overdue,
      cancelled,
      applicableTasks,
      completionRate,
      isNotApplicable: applicableTasks === 0
    }
  });
});

// POST /api/tasks - Create new task
tasksRouter.post('/', (req, res) => {
  const actor = req.user!;
  const {
    title,
    description,
    isInterUnit,
    assignedUnit,
    assigneeId,
    deadline,
    subTasks
  } = req.body;

  if (!title || !deadline || !assigneeId) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp tiêu đề, người phụ trách và thời hạn nhiệm vụ.'
    });
  }

  // Permission: Leader or Admin or BN/BDH
  if (actor.role !== 'leader' && actor.role !== 'admin' && actor.unit !== 'BN' && actor.unit !== 'BDH') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Trưởng ban, Ban Điều hành hoặc Ban Chủ nhiệm mới có quyền giao nhiệm vụ.'
    });
  }

  const store = db.get();
  const assignee = store.users.find(u => u.id === assigneeId);

  if (!assignee) {
    return res.status(404).json({ success: false, message: 'Người nhận nhiệm vụ không tồn tại.' });
  }

  if (assignee.status === 'paused' || assignee.status === 'left') {
    return res.status(400).json({
      success: false,
      message: `Thành viên ${assignee.fullName} đang ở trạng thái "${assignee.status === 'paused' ? 'Bảo lưu' : 'Đã rời CLB'}", không thể giao nhiệm vụ mới.`
    });
  }

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title,
    description: description || '',
    isInterUnit: Boolean(isInterUnit),
    primaryUnit: actor.unit || 'BDH',
    assignedUnit: assignedUnit || assignee.unit,
    assigneeId: assignee.id,
    assigneeName: assignee.fullName,
    leadAssigneeId: actor.id,
    leadAssigneeName: actor.fullName,
    deadline,
    status: 'not_started',
    subTasks: subTasks || [],
    history: [
      {
        timestamp: new Date().toISOString(),
        actorName: actor.fullName,
        action: 'Khởi tạo và giao nhiệm vụ',
        newStatus: 'not_started'
      }
    ]
  };

  store.tasks.unshift(newTask);

  store.notifications.unshift({
    id: `notif-${Date.now()}`,
    recipientId: assignee.id,
    recipientEmail: assignee.email,
    title: `Nhiệm vụ mới: ${newTask.title}`,
    message: `Bạn được giao nhiệm vụ "${newTask.title}" bởi ${actor.fullName}. Hạn hoàn thành: ${new Date(deadline).toLocaleString('vi-VN')}`,
    type: 'system',
    referenceType: 'task',
    referenceId: newTask.id,
    isRead: false,
    createdAt: new Date().toISOString(),
    emailSent: true,
    emailStatus: 'sent'
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Giao nhiệm vụ',
    targetType: 'Task',
    targetId: newTask.id,
    details: `${actor.fullName} giao nhiệm vụ "${newTask.title}" cho ${assignee.fullName} (${newTask.assignedUnit})`
  });

  db.save();

  res.json({
    success: true,
    message: 'Giao nhiệm vụ thành công!',
    task: newTask
  });
});

// POST /api/tasks/:id/submit-deliverable - Member submits deliverable
tasksRouter.post('/:id/submit-deliverable', (req, res) => {
  const actor = req.user!;
  const { content, proofUrl } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập mô tả kết quả hoàn thành hoặc đính kèm minh chứng.' });
  }

  const store = db.get();
  const task = store.tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy nhiệm vụ.' });
  }

  const isAssignee = task.assigneeId === actor.id || task.subTasks?.some(st => st.assigneeId === actor.id);
  if (!isAssignee && actor.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bạn không phải là người phụ trách nhiệm vụ này.' });
  }

  task.deliverable = {
    content,
    proofUrl,
    submittedAt: new Date().toISOString()
  };
  task.status = 'pending_review';

  task.history.push({
    timestamp: new Date().toISOString(),
    actorName: actor.fullName,
    action: 'Nộp báo cáo hoàn thành nhiệm vụ & minh chứng',
    oldStatus: 'in_progress',
    newStatus: 'pending_review'
  });

  const leadUser = store.users.find(u => u.id === task.leadAssigneeId);
  store.notifications.unshift({
    id: `notif-${Date.now()}`,
    recipientId: task.leadAssigneeId,
    recipientEmail: leadUser?.email || '',
    title: `Báo cáo nhiệm vụ: ${task.title}`,
    message: `${actor.fullName} đã nộp báo cáo kết quả cho nhiệm vụ "${task.title}". Vui lòng kiểm tra và duyệt hoàn thành.`,
    type: 'approval_required',
    referenceType: 'task',
    referenceId: task.id,
    isRead: false,
    createdAt: new Date().toISOString(),
    emailSent: Boolean(leadUser?.email),
    emailStatus: leadUser?.email ? 'sent' : 'failed'
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Nộp báo cáo nhiệm vụ',
    targetType: 'Task',
    targetId: task.id,
    details: `${actor.fullName} nộp báo cáo nhiệm vụ "${task.title}" (Chuyển sang Chờ xác nhận)`
  });

  db.save();

  res.json({
    success: true,
    message: 'Đã nộp kết quả nhiệm vụ thành công. Đang chờ Trưởng ban xác nhận hoàn thành.',
    task
  });
});

// POST /api/tasks/:id/review - Review and confirm task completion
tasksRouter.post('/:id/review', (req, res) => {
  const actor = req.user!;
  const { decision, reviewNotes } = req.body;

  if (!decision || (decision !== 'completed' && decision !== 'needs_revision')) {
    return res.status(400).json({ success: false, message: 'Quyết định không hợp lệ (phải là completed hoặc needs_revision).' });
  }

  const store = db.get();
  const task = store.tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy nhiệm vụ.' });
  }

  // Authorization check: Lead assignee, Unit Leader, BN, or Admin
  const isLead = task.leadAssigneeId === actor.id;
  const isUnitLeader = actor.role === 'leader' && (actor.unit === task.assignedUnit || actor.unit === task.primaryUnit);
  const isManagement = actor.unit === 'BN' || actor.role === 'admin';

  if (!isLead && !isUnitLeader && !isManagement) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có thẩm quyền kiểm duyệt kết quả nhiệm vụ này.'
    });
  }

  task.status = decision;
  task.reviewNotes = reviewNotes || '';
  task.reviewedBy = actor.fullName;
  task.reviewedAt = new Date().toISOString();

  task.history.push({
    timestamp: new Date().toISOString(),
    actorName: actor.fullName,
    action: decision === 'completed' ? 'Xác nhận hoàn thành nhiệm vụ' : 'Yêu cầu chỉnh sửa thêm',
    reason: reviewNotes,
    oldStatus: 'pending_review',
    newStatus: decision
  });

  const assigneeUser = store.users.find(u => u.id === task.assigneeId);
  store.notifications.unshift({
    id: `notif-${Date.now()}`,
    recipientId: task.assigneeId,
    recipientEmail: assigneeUser?.email || '',
    title: `Kết quả đánh giá nhiệm vụ: ${task.title}`,
    message: decision === 'completed'
      ? `Nhiệm vụ "${task.title}" đã được xác nhận HOÀN THÀNH bởi ${actor.fullName}.`
      : `Nhiệm vụ "${task.title}" cần chỉnh sửa: ${reviewNotes}`,
    type: 'system',
    referenceType: 'task',
    referenceId: task.id,
    isRead: false,
    createdAt: new Date().toISOString(),
    emailSent: Boolean(assigneeUser?.email),
    emailStatus: assigneeUser?.email ? 'sent' : 'failed'
  });

  db.save();

  res.json({
    success: true,
    message: decision === 'completed' ? 'Đã duyệt hoàn thành nhiệm vụ!' : 'Đã gửi yêu cầu chỉnh sửa lại nhiệm vụ.',
    task
  });
});

// POST /api/tasks/:id/cancel - Cancel task with reason
tasksRouter.post('/:id/cancel', (req, res) => {
  const actor = req.user!;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Bắt buộc phải cung cấp lý do hủy nhiệm vụ.' });
  }

  const store = db.get();
  const task = store.tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy nhiệm vụ.' });
  }

  const isLead = task.leadAssigneeId === actor.id;
  const isUnitLeader = actor.role === 'leader' && (actor.unit === task.assignedUnit || actor.unit === task.primaryUnit);
  const isManagement = actor.unit === 'BN' || actor.role === 'admin';

  if (!isLead && !isUnitLeader && !isManagement) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có thẩm quyền hủy nhiệm vụ này.'
    });
  }

  const prevStatus = task.status;
  task.status = 'cancelled';
  task.cancellationReason = reason;
  task.cancelledBy = actor.fullName;
  task.cancelledAt = new Date().toISOString();

  task.history.push({
    timestamp: new Date().toISOString(),
    actorName: actor.fullName,
    action: 'Hủy nhiệm vụ',
    reason,
    oldStatus: prevStatus,
    newStatus: 'cancelled'
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Hủy nhiệm vụ có lý do',
    targetType: 'Task',
    targetId: task.id,
    reason,
    details: `${actor.fullName} hủy nhiệm vụ "${task.title}". Lý do: ${reason}. Nhiệm vụ này được loại khỏi mẫu số tính tỷ lệ hoàn thành.`
  });

  db.save();

  res.json({
    success: true,
    message: 'Đã hủy nhiệm vụ thành công. Nhiệm vụ sẽ được bảo lưu trong lịch sử và loại khỏi công thức tính tỷ lệ hoàn thành.',
    task
  });
});
