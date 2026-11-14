// Feedback Lifecycle Service - Automated 24h Warning Emails & Closing Penalty Tickets
import crypto from 'crypto';
import type { DatabaseSchema } from '../db.ts';
import type { PenaltyTicket } from '../../src/types/index.ts';
import { getSessionScheduleTimes } from '../timeUtils.ts';
import { sendFeedbackWarningEmail, sendPenaltyTicketEmail } from './emailService.ts';

/**
 * Checks all active sessions to:
 * 1. Dispatch 24-hour warning emails to attendees who have not submitted feedback.
 * 2. Issue penalty tickets to attendees who failed to submit when feedback closes.
 */
export async function processFeedbackLifecycle(store: DatabaseSchema, nowMs = Date.now()): Promise<boolean> {
  if (!store || !Array.isArray(store.sessions)) return false;
  let changed = false;

  if (!Array.isArray(store.penaltyTickets)) {
    store.penaltyTickets = [];
    changed = true;
  }
  if (!Array.isArray(store.feedbackEligibility)) {
    store.feedbackEligibility = [];
    changed = true;
  }
  if (!Array.isArray(store.notifications)) {
    store.notifications = [];
    changed = true;
  }
  if (!Array.isArray(store.auditLogs)) {
    store.auditLogs = [];
    changed = true;
  }

  for (const session of store.sessions) {
    if (session.status === 'cancelled') continue;

    const times = getSessionScheduleTimes(session);
    // If meeting hasn't ended yet, feedback form is not open
    if (nowMs < times.endMs && session.feedbackStatus !== 'reopened') continue;

    // Default deadline: 48 hours after meeting ends
    const defaultDeadlineMs = times.endMs + 48 * 60 * 60 * 1000;
    const deadlineMs = session.feedbackDeadline ? new Date(session.feedbackDeadline).getTime() : defaultDeadlineMs;
    const deadlineIso = new Date(deadlineMs).toISOString();

    if (!session.feedbackDeadline) {
      session.feedbackDeadline = deadlineIso;
      changed = true;
    }

    // Gather attendees (present or late)
    const attendances = store.attendance.filter(
      a => a.sessionId === session.id && (a.status === 'present' || a.status === 'late')
    );

    if (attendances.length === 0) continue;

    // Ensure feedbackEligibility exists for all attendees
    for (const att of attendances) {
      let el = store.feedbackEligibility.find(e => e.sessionId === session.id && e.memberId === att.memberId);
      if (!el) {
        el = {
          id: `fe-${session.id}-${att.memberId}`,
          sessionId: session.id,
          memberId: att.memberId,
          hasSubmitted: false
        };
        store.feedbackEligibility.push(el);
        changed = true;
      }
    }

    // Determine who has submitted feedback
    const submittedMemberIds = new Set<string>();
    for (const f of store.feedbacks) {
      if (f.sessionId !== session.id) continue;
      if (f.memberId) {
        submittedMemberIds.add(f.memberId);
      }
      if (f.submissionToken) {
        const el = store.feedbackEligibility.find(
          e => e.sessionId === session.id && e.submissionToken === f.submissionToken
        );
        if (el?.memberId) submittedMemberIds.add(el.memberId);
      }
    }

    // Sync hasSubmitted on feedbackEligibility
    for (const att of attendances) {
      const el = store.feedbackEligibility.find(e => e.sessionId === session.id && e.memberId === att.memberId);
      if (el) {
        const isSubmitted = submittedMemberIds.has(att.memberId);
        if (el.hasSubmitted !== isSubmitted) {
          el.hasSubmitted = isSubmitted;
          changed = true;
        }
      }
    }

    const timeRemainingMs = deadlineMs - nowMs;
    const isWindowOpen = (session.feedbackStatus === 'open' || session.feedbackStatus === 'reopened') && timeRemainingMs > 0;
    const isWindowExpired = timeRemainingMs <= 0 || session.feedbackStatus === 'closed';

    // =========================================================================
    // STEP A: 24-HOUR WARNING EMAIL (~1 day before deadline)
    // =========================================================================
    if (isWindowOpen && timeRemainingMs <= 24 * 60 * 60 * 1000 && !session.feedbackWarningSentAt) {
      const unsubmittedAttendees = attendances.filter(att => !submittedMemberIds.has(att.memberId));

      for (const att of unsubmittedAttendees) {
        const user = store.users.find(u => u.id === att.memberId);
        if (!user || !user.email) continue;

        const el = store.feedbackEligibility.find(e => e.sessionId === session.id && e.memberId === att.memberId);
        if (el?.warningSentAt) continue;

        const hoursLeft = Math.max(1, Math.round(timeRemainingMs / (1000 * 60 * 60)));
        const deadlineFormatted = new Date(deadlineMs).toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        // 1. Dispatch email
        try {
          await sendFeedbackWarningEmail({
            to: user.email,
            recipientName: user.fullName,
            studentId: user.studentId,
            sessionTitle: session.title,
            sessionDate: session.date,
            deadlineIso,
            hoursRemaining: hoursLeft
          });
        } catch (err) {
          console.error(`[FeedbackLifecycle] Error sending warning email to ${user.email}:`, err);
        }

        // 2. In-app notification
        store.notifications.unshift({
          id: `notif-warn-${session.id}-${user.id}`,
          recipientId: user.id,
          recipientEmail: user.email,
          title: `[Cảnh báo] Hạn chót đánh giá sinh hoạt: ${session.title}`,
          message: `Chỉ còn khoảng ${hoursLeft} giờ trước khi đóng form đánh giá sinh hoạt "${session.title}" (Hạn chót: ${deadlineFormatted}). Theo quy chế CLB, nếu không hoàn thành đánh giá trước khi đóng form, tài khoản sẽ tự động nhận 01 VÉ PHẠT.`,
          type: 'reminder_24h',
          referenceType: 'session',
          referenceId: session.id,
          isRead: false,
          createdAt: new Date(nowMs).toISOString(),
          emailSent: true,
          emailStatus: 'sent'
        });

        if (el) {
          el.warningSentAt = new Date(nowMs).toISOString();
        }
        changed = true;
      }

      session.feedbackWarningSentAt = new Date(nowMs).toISOString();
      changed = true;

      store.auditLogs.unshift({
        id: `audit-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        timestamp: new Date(nowMs).toISOString(),
        actorId: 'system-lifecycle',
        actorName: 'Hệ thống tự động BK-IC',
        actorRole: 'sysadmin',
        action: 'Gửi cảnh báo hạn chót đánh giá sinh hoạt',
        targetType: 'TrainingSession',
        targetId: session.id,
        details: `Đã gửi email cảnh báo trước 24 giờ cho ${unsubmittedAttendees.length} thành viên chưa nộp đánh giá cho buổi "${session.title}".`
      });
    }

    // =========================================================================
    // STEP B: PENALTY TICKETS ON FORM CLOSING
    // =========================================================================
    if (isWindowExpired && !session.feedbackPenaltiesIssuedAt) {
      if (session.feedbackStatus !== 'closed') {
        session.feedbackStatus = 'closed';
        changed = true;
      }

      const delinquentAttendees = attendances.filter(att => !submittedMemberIds.has(att.memberId));
      let newlyPenalizedCount = 0;

      for (const att of delinquentAttendees) {
        const user = store.users.find(u => u.id === att.memberId);
        if (!user) continue;

        // Ensure no duplicate ticket for this session and member
        const existingTicket = store.penaltyTickets.find(
          t => t.sessionId === session.id && t.memberId === user.id && t.type === 'missing_feedback'
        );
        if (existingTicket) continue;

        const ticketId = `ticket-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
        const ticketCode = `VP-${new Date(nowMs).getFullYear()}-${String(store.penaltyTickets.length + 1).padStart(4, '0')}`;
        const reason = `Không hoàn thành đánh giá sinh hoạt đúng hạn sau khi tham dự buổi "${session.title}".`;

        const newTicket: PenaltyTicket = {
          id: ticketId,
          ticketCode,
          memberId: user.id,
          studentId: user.studentId,
          memberName: user.fullName,
          memberEmail: user.email,
          unit: user.unit,
          type: 'missing_feedback',
          reason,
          sessionId: session.id,
          sessionTitle: session.title,
          issuedAt: new Date(nowMs).toISOString(),
          issuedBy: 'Hệ thống tự động (Quy chế Sinh hoạt CLB)',
          status: 'active',
          penaltyPoints: 1,
          notes: 'Tự động phát hành vé phạt khi biểu mẫu đánh giá sinh hoạt kết thúc thời hạn.'
        };

        store.penaltyTickets.unshift(newTicket);
        newlyPenalizedCount++;

        const el = store.feedbackEligibility.find(e => e.sessionId === session.id && e.memberId === user.id);
        if (el) {
          el.penaltyTicketId = ticketId;
        }

        // 1. Dispatch Penalty Ticket Email
        try {
          await sendPenaltyTicketEmail({
            to: user.email,
            recipientName: user.fullName,
            studentId: user.studentId,
            sessionTitle: session.title,
            ticketCode,
            issuedAt: newTicket.issuedAt,
            reason
          });
        } catch (err) {
          console.error(`[FeedbackLifecycle] Error sending penalty ticket email to ${user.email}:`, err);
        }

        // 2. In-app Notification
        store.notifications.unshift({
          id: `notif-ticket-${newTicket.id}`,
          recipientId: user.id,
          recipientEmail: user.email,
          title: `[Vé phạt] Nhận 1 vé phạt quy chế sinh hoạt (${ticketCode})`,
          message: `Tài khoản của bạn đã nhận 01 vé phạt (${ticketCode}) do không hoàn thành đánh giá buổi "${session.title}" trước khi đóng biểu mẫu theo quy chế CLB.`,
          type: 'system',
          referenceType: 'session',
          referenceId: session.id,
          isRead: false,
          createdAt: new Date(nowMs).toISOString(),
          emailSent: true,
          emailStatus: 'sent'
        });

        // 3. Audit Log
        store.auditLogs.unshift({
          id: `audit-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
          timestamp: new Date(nowMs).toISOString(),
          actorId: 'system-lifecycle',
          actorName: 'Hệ thống tự động BK-IC',
          actorRole: 'sysadmin',
          action: 'Phát hành vé phạt vi phạm quy chế',
          targetType: 'PenaltyTicket',
          targetId: newTicket.id,
          details: `Phát hành vé phạt ${ticketCode} cho ${user.fullName} (MSSV: ${user.studentId}) do không đánh giá buổi "${session.title}".`
        });

        changed = true;
      }

      session.feedbackPenaltiesIssuedAt = new Date(nowMs).toISOString();
      changed = true;

      console.log(`[FeedbackLifecycle] Session "${session.title}" feedback closed. Penalized ${newlyPenalizedCount} member(s).`);
    }
  }

  return changed;
}

