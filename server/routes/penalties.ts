// Penalty Tickets Routes - BK-IC Digital Hub
import { Router } from 'express';
import { db } from '../db.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';
import { syncSessionsLifecycle } from '../timeUtils.ts';
import { processFeedbackLifecycle } from '../services/feedbackLifecycle.ts';

export const penaltiesRouter = Router();

penaltiesRouter.use(requireAuth);
penaltiesRouter.use(requireNormalSession);

// GET /api/penalties/my-tickets - Return logged in user's penalty tickets
penaltiesRouter.get('/my-tickets', async (req, res) => {
  const actor = req.user!;
  const store = db.get();

  syncSessionsLifecycle(store);
  await processFeedbackLifecycle(store);

  const tickets = (store.penaltyTickets || []).filter(t => t.memberId === actor.id);
  const activeCount = tickets.filter(t => t.status === 'active').length;

  res.json({
    success: true,
    tickets,
    activeCount,
    totalCount: tickets.length
  });
});

// GET /api/penalties - List all penalty tickets (Admin, BN, BTV)
penaltiesRouter.get('/', async (req, res) => {
  const actor = req.user!;
  const store = db.get();

  const isAdminOrBn = actor.role === 'admin' || actor.role === 'sysadmin' || (actor.unit === 'BN' && actor.role !== 'member');
  const isBtvLead = actor.unit === 'BTV';

  if (!isAdminOrBn && !isBtvLead) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập danh sách vé phạt kỷ luật.'
    });
  }

  syncSessionsLifecycle(store);
  await processFeedbackLifecycle(store);

  const { sessionId, memberId, status } = req.query;

  let tickets = store.penaltyTickets || [];
  if (sessionId && typeof sessionId === 'string') {
    tickets = tickets.filter(t => t.sessionId === sessionId);
  }
  if (memberId && typeof memberId === 'string') {
    tickets = tickets.filter(t => t.memberId === memberId);
  }
  if (status && typeof status === 'string') {
    tickets = tickets.filter(t => t.status === status);
  }

  res.json({
    success: true,
    tickets,
    total: tickets.length,
    activeCount: tickets.filter(t => t.status === 'active').length
  });
});

// GET /api/penalties/session-status/:sessionId - Get attendee evaluation compliance breakdown for a session
penaltiesRouter.get('/session-status/:sessionId', async (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { sessionId } = req.params;

  const isAdminOrBn = actor.role === 'admin' || actor.role === 'sysadmin' || (actor.unit === 'BN' && actor.role !== 'member');
  const isBdhLead = actor.unit === 'BDH' && (actor.role === 'leader' || actor.role === 'admin');

  if (!isAdminOrBn && !isBdhLead) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền xem bảng theo dõi chấp hành quy chế buổi sinh hoạt.'
    });
  }

  syncSessionsLifecycle(store);
  await processFeedbackLifecycle(store);

  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiên sinh hoạt.' });
  }

  const attendances = store.attendance.filter(
    a => a.sessionId === sessionId && (a.status === 'present' || a.status === 'late')
  );

  const submittedMemberIds = new Set<string>();
  for (const f of store.feedbacks) {
    if (f.sessionId !== sessionId) continue;
    if (f.memberId) submittedMemberIds.add(f.memberId);
    if (f.submissionToken) {
      const el = store.feedbackEligibility.find(e => e.sessionId === sessionId && e.submissionToken === f.submissionToken);
      if (el?.memberId) submittedMemberIds.add(el.memberId);
    }
  }

  const attendeesList = attendances.map(att => {
    const user = store.users.find(u => u.id === att.memberId);
    const hasSubmitted = submittedMemberIds.has(att.memberId);
    const ticket = store.penaltyTickets?.find(
      t => t.sessionId === sessionId && t.memberId === att.memberId && t.type === 'missing_feedback'
    );
    const el = store.feedbackEligibility?.find(e => e.sessionId === sessionId && e.memberId === att.memberId);

    return {
      memberId: att.memberId,
      memberName: att.memberName || user?.fullName || 'Thành viên',
      studentId: att.studentId || user?.studentId || '',
      memberEmail: user?.email || '',
      unit: att.unit || user?.unit,
      attendanceStatus: att.status,
      checkInTime: att.checkInTime,
      hasSubmitted,
      warningSentAt: el?.warningSentAt || session.feedbackWarningSentAt,
      penaltyTicket: ticket ? {
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        status: ticket.status,
        issuedAt: ticket.issuedAt,
        reason: ticket.reason
      } : null
    };
  });

  res.json({
    success: true,
    sessionId: session.id,
    sessionTitle: session.title,
    feedbackStatus: session.feedbackStatus,
    feedbackDeadline: session.feedbackDeadline,
    warningSentAt: session.feedbackWarningSentAt,
    penaltiesIssuedAt: session.feedbackPenaltiesIssuedAt,
    totalAttendees: attendances.length,
    submittedCount: attendeesList.filter(a => a.hasSubmitted).length,
    unsubmittedCount: attendeesList.filter(a => !a.hasSubmitted).length,
    penalizedCount: attendeesList.filter(a => a.penaltyTicket && a.penaltyTicket.status === 'active').length,
    attendees: attendeesList
  });
});

// POST /api/penalties/:id/revoke - Revoke/pardon a penalty ticket with reason (Admin or BN)
penaltiesRouter.post('/:id/revoke', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { id } = req.params;
  const { reason } = req.body;

  if (actor.unit !== 'BN' && actor.role !== 'admin' && actor.role !== 'sysadmin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) hoặc Quản trị viên mới có thẩm quyền hủy hoặc ân xá vé phạt.'
    });
  }

  if (!reason || !String(reason).trim()) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp lý do hủy vé phạt.'
    });
  }

  const ticket = store.penaltyTickets?.find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy vé phạt.' });
  }

  ticket.status = 'revoked';
  ticket.revokedBy = actor.fullName;
  ticket.revokedAt = new Date().toISOString();
  ticket.revokeReason = String(reason).trim();

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Hủy vé phạt kỷ luật',
    targetType: 'PenaltyTicket',
    targetId: ticket.id,
    details: `Hủy vé phạt ${ticket.ticketCode} cho thành viên ${ticket.memberName}. Lý do: ${ticket.revokeReason}`
  });

  db.save();

  res.json({
    success: true,
    message: `Đã hủy vé phạt ${ticket.ticketCode} thành công.`,
    ticket
  });
});

// POST /api/penalties/clear-all - Clear all penalty tickets (Admin or BN)
penaltiesRouter.post('/clear-all', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  if (actor.unit !== 'BN' && actor.role !== 'admin' && actor.role !== 'sysadmin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) hoặc Quản trị viên mới có thẩm quyền xóa toàn bộ vé phạt.'
    });
  }

  const previousCount = store.penaltyTickets?.length || 0;
  store.penaltyTickets = [];

  // Clear references from feedbackEligibility
  if (Array.isArray(store.feedbackEligibility)) {
    for (const el of store.feedbackEligibility) {
      if (el.penaltyTicketId) {
        delete el.penaltyTicketId;
      }
    }
  }

  // Clear notifications
  if (Array.isArray(store.notifications)) {
    store.notifications = store.notifications.filter(
      n => !n.id?.startsWith('notif-ticket-') && 
           !n.title?.includes('Vé phạt') && 
           !n.message?.includes('vé phạt')
    );
  }

  // Mark all past ended sessions so they don't regenerate penalties
  const nowIso = new Date().toISOString();
  if (Array.isArray(store.sessions)) {
    for (const session of store.sessions) {
      if (session.status === 'ended' || (session as any).status === 'closed' || session.status === 'cancelled') {
        if (!session.feedbackPenaltiesIssuedAt) {
          session.feedbackPenaltiesIssuedAt = nowIso;
        }
      }
    }
  }

  // Audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}-clear-all-penalties`,
    timestamp: nowIso,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Ân xá kỷ luật & Xóa toàn bộ vé phạt cũ',
    targetType: 'PenaltyTicket',
    targetId: 'ALL',
    details: `Đã xóa toàn bộ ${previousCount} vé phạt vi phạm quy chế trước đây và ân xá lỗi cho tất cả các thành viên.`
  });

  db.save();

  res.json({
    success: true,
    message: `Đã xóa sạch toàn bộ ${previousCount} vé phạt kỷ luật và ân xá cho toàn thể thành viên thành công.`,
    clearedCount: previousCount
  });
});


