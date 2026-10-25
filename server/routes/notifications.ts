// Notifications and Reminders Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { Notification } from '../../src/types/index.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);
notificationsRouter.use(requireNormalSession);

// GET /api/notifications - List user's notifications
notificationsRouter.get('/', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  const notifs = store.notifications.filter(n => n.recipientId === actor.id);
  const unreadCount = notifs.filter(n => !n.isRead).length;

  res.json({ success: true, notifications: notifs, unreadCount });
});

// PATCH /api/notifications/:id/read - Mark as read
notificationsRouter.patch('/:id/read', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  const notif = store.notifications.find(n => n.id === req.params.id && n.recipientId === actor.id);
  if (notif) {
    notif.isRead = true;
    db.save();
  }

  res.json({ success: true });
});

// POST /api/notifications/mark-all-read - Mark all as read
notificationsRouter.post('/mark-all-read', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  store.notifications.forEach(n => {
    if (n.recipientId === actor.id) {
      n.isRead = true;
    }
  });
  db.save();

  res.json({ success: true });
});

// POST /api/notifications/run-reminder-engine - Automated check for 24h, 3h, and overdue reminders
notificationsRouter.post('/run-reminder-engine', (req, res) => {
  const store = db.get();
  const now = Date.now();
  let generatedCount = 0;

  // 1. Check Task Deadlines
  for (const task of store.tasks) {
    if (task.status === 'completed' || task.status === 'cancelled') continue;

    const deadlineTime = new Date(task.deadline).getTime();
    const hoursRemaining = (deadlineTime - now) / (60 * 60 * 1000);
    const assigneeUser = store.users.find(u => u.id === task.assigneeId);
    const assigneeEmail = assigneeUser?.email || '';

    // 24h reminder
    if (hoursRemaining > 0 && hoursRemaining <= 24 && hoursRemaining > 20) {
      const alreadySent = store.notifications.some(
        n => n.referenceId === task.id && n.type === 'reminder_24h'
      );
      if (!alreadySent) {
        store.notifications.unshift({
          id: `notif-rem-24h-${task.id}`,
          recipientId: task.assigneeId,
          recipientEmail: assigneeEmail,
          title: `Nhắc việc: 24h còn lại cho "${task.title}"`,
          message: `Nhiệm vụ "${task.title}" sẽ đến hạn vào ngày mai (${new Date(task.deadline).toLocaleString('vi-VN')}). Hãy hoàn thành và nộp minh chứng.`,
          type: 'reminder_24h',
          referenceType: 'task',
          referenceId: task.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          emailSent: Boolean(assigneeEmail),
          emailStatus: assigneeEmail ? 'sent' : 'failed'
        });
        generatedCount++;
      }
    }

    // 3h reminder
    if (hoursRemaining > 0 && hoursRemaining <= 3 && hoursRemaining > 0.5) {
      const alreadySent = store.notifications.some(
        n => n.referenceId === task.id && n.type === 'reminder_3h'
      );
      if (!alreadySent) {
        store.notifications.unshift({
          id: `notif-rem-3h-${task.id}`,
          recipientId: task.assigneeId,
          recipientEmail: assigneeEmail,
          title: `Khẩn: 3 giờ còn lại cho "${task.title}"`,
          message: `Nhiệm vụ "${task.title}" sắp đến hạn hoàn thành (${new Date(task.deadline).toLocaleTimeString('vi-VN')}).`,
          type: 'reminder_3h',
          referenceType: 'task',
          referenceId: task.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          emailSent: Boolean(assigneeEmail),
          emailStatus: assigneeEmail ? 'sent' : 'failed'
        });
        generatedCount++;
      }
    }

    // Overdue check
    if (hoursRemaining < 0) {
      if (task.status !== 'overdue') {
        task.status = 'overdue';
      }

      const daysOverdue = Math.abs(hoursRemaining) / 24;

      // Daily overdue reminder to assignee
      const todayDateStr = new Date().toISOString().split('T')[0];
      const overdueToday = store.notifications.some(
        n => n.referenceId === task.id && n.type === 'overdue' && n.createdAt.startsWith(todayDateStr)
      );

      if (!overdueToday) {
        store.notifications.unshift({
          id: `notif-overdue-${task.id}-${todayDateStr}`,
          recipientId: task.assigneeId,
          recipientEmail: assigneeEmail,
          title: `Nhiệm vụ đã quá hạn: ${task.title}`,
          message: `Nhiệm vụ "${task.title}" đã quá hạn ${Math.floor(daysOverdue)} ngày. Vui lòng cập nhật tiến độ hoặc giải trình với Trưởng ban.`,
          type: 'overdue',
          referenceType: 'task',
          referenceId: task.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          emailSent: Boolean(assigneeEmail),
          emailStatus: assigneeEmail ? 'sent' : 'failed'
        });
        generatedCount++;
      }

      // Escalation rule: Quá hạn 3 ngày -> chuyển thông báo lên cấp quản lý tiếp theo (BN)
      if (daysOverdue >= 3) {
        const alreadyEscalated = store.notifications.some(
          n => n.referenceId === task.id && n.type === 'escalation'
        );
        if (!alreadyEscalated) {
          const bnLeaders = store.users.filter(u => u.unit === 'BN');
          for (const bn of bnLeaders) {
            store.notifications.unshift({
              id: `notif-esc-${task.id}-${bn.id}`,
              recipientId: bn.id,
              recipientEmail: bn.email,
              title: `[Chuyển cấp giám sát] Nhiệm vụ quá hạn 3 ngày: ${task.title}`,
              message: `Nhiệm vụ "${task.title}" thuộc đơn vị ${task.assignedUnit} do ${task.assigneeName} phụ trách đã quá hạn 3 ngày mà chưa hoàn thành. Chuyển cấp Ban Chủ nhiệm theo dõi.`,
              type: 'escalation',
              referenceType: 'task',
              referenceId: task.id,
              isRead: false,
              createdAt: new Date().toISOString(),
              emailSent: true,
              emailStatus: 'sent'
            });
            generatedCount++;
          }
        }
      }
    }
  }

  if (generatedCount > 0) {
    db.save();
  }

  res.json({
    success: true,
    message: `Đã chạy engine nhắc việc. Tạo mới ${generatedCount} thông báo.`,
    generatedCount
  });
});
