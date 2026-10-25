// Training Quality Feedback Routes - Secure, Anonymous, and Scoped RBAC
import { Router } from 'express';
import { db, type DecoupledFeedback, type FeedbackEligibility } from '../db.ts';
import type { FeedbackSummary } from '../../src/types/index.ts';
import { isFeedbackWindowOpen, syncSessionsLifecycle } from '../timeUtils.ts';
import crypto from 'crypto';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const feedbackRouter = Router();

feedbackRouter.use(requireAuth);
feedbackRouter.use(requireNormalSession);

// In-flight concurrency lock to prevent race conditions during simultaneous submissions
const inFlightFeedbackSubmissions = new Set<string>();

/**
 * Checks whether an actor has authority to view detailed feedback for a specific session.
 * - Admin: All sessions club-wide.
 * - BN: All sessions within governance scope (club-wide).
 * - BDH: Only sessions belonging to BDH unit or managed by actor.
 * - Others: False.
 */
function canViewDetailedSessionFeedback(actor: { id: string; role?: string; unit?: string }, session: any): boolean {
  if (actor.role === 'admin' || actor.role === 'sysadmin') return true;
  // Ban Chủ nhiệm (BN leadership)
  if (actor.unit === 'BN' && (actor.role === 'leader' || actor.role === 'admin' || actor.role !== 'member')) return true;
  // Person in Charge of the meeting
  if (session && actor.id === session.personInChargeId) return true;
  // Ban Điều hành (BDH leadership)
  if (actor.unit === 'BDH' && (actor.role === 'leader' || actor.role === 'admin')) {
    return session.unit === 'BDH' || session.personInChargeId === actor.id || session.createdById === actor.id;
  }
  return false;
}

/**
 * Helper to safely sanitize feedback text input
 */
function sanitizeTextInput(text?: any, maxLength = 1000): string | undefined {
  if (text === undefined || text === null) return undefined;
  const str = String(text).trim();
  if (!str) return undefined;
  // Truncate to reasonable length and strip dangerous control characters
  return str.slice(0, maxLength);
}

// GET /api/feedback/my-feedback/:sessionId - Check member's feedback status & retrieve own response
feedbackRouter.get('/my-feedback/:sessionId', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { sessionId } = req.params;

  syncSessionsLifecycle(store);

  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiên sinh hoạt.' });
  }

  const windowStatus = isFeedbackWindowOpen(session);

  // Check if member attended this session (present or late)
  const attendance = store.attendance.find(a => a.sessionId === sessionId && a.memberId === actor.id);
  const isAttended = Boolean(attendance && (attendance.status === 'present' || attendance.status === 'late'));

  // Look up eligibility record
  const eligibility = store.feedbackEligibility.find(e => e.sessionId === sessionId && e.memberId === actor.id);

  // Find user's existing response if submitted
  let existingFeedback: any = null;
  if (eligibility?.hasSubmitted) {
    const rawFeedback = store.feedbacks.find(f =>
      f.sessionId === sessionId && (
        (eligibility.submissionToken && f.submissionToken === eligibility.submissionToken) ||
        (f.authorHash && f.authorHash === eligibility.submissionToken) ||
        f.memberId === actor.id
      )
    );

    if (rawFeedback) {
      existingFeedback = {
        id: rawFeedback.id,
        sessionId: rawFeedback.sessionId,
        contentQuality: rawFeedback.contentQuality || rawFeedback.usefulnessScore || 5,
        delivery: rawFeedback.delivery || rawFeedback.clarityScore || 5,
        durationSuitability: rawFeedback.durationSuitability || rawFeedback.organizationScore || 5,
        usefulness: rawFeedback.usefulness || rawFeedback.usefulnessScore || 5,
        valuableTakeaway: rawFeedback.valuableTakeaway || rawFeedback.feedbackText || '',
        improvementSuggestion: rawFeedback.improvementSuggestion || '',
        nextTopicIdea: rawFeedback.nextTopicIdea || '',
        submittedAt: rawFeedback.submittedAt,
        updatedAt: rawFeedback.updatedAt
      };
    }
  }

  res.json({
    success: true,
    sessionId,
    isEligible: isAttended,
    hasSubmitted: Boolean(eligibility?.hasSubmitted),
    isOpen: windowStatus.isOpen,
    windowReason: windowStatus.reason,
    deadline: windowStatus.deadline,
    message: windowStatus.message,
    canEdit: Boolean(eligibility?.hasSubmitted && windowStatus.isOpen),
    feedback: existingFeedback
  });
});

// POST /api/feedback/submit - Submit or edit feedback
// Enforces:
// 1. Authenticated user from session middleware.
// 2. Member must have verified attendance (present or late).
// 3. Meeting must be ended, not cancelled, and within feedback window (24h or reopened).
// 4. 4 criteria (contentQuality, delivery, durationSuitability, usefulness) integers 1 to 5.
// 5. 3 separate text fields (valuableTakeaway, improvementSuggestion, nextTopicIdea).
// 6. Cryptographic decoupled linkage token (no authorHash from memberId+salt).
// 7. Strictly one submission per member/meeting; allows editing while feedback window is open.
feedbackRouter.post('/submit', (req, res) => {
  const actor = req.user!;
  const {
    sessionId,
    contentQuality,
    delivery,
    durationSuitability,
    usefulness,
    valuableTakeaway,
    improvementSuggestion,
    nextTopicIdea,
    // Backwards compatibility payload aliases
    feedbackText,
    usefulnessScore,
    clarityScore,
    organizationScore
  } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Thiếu mã phiên sinh hoạt (sessionId).' });
  }

  // Anti-concurrency lock per user & meeting
  const lockKey = `${sessionId}:${actor.id}`;
  if (inFlightFeedbackSubmissions.has(lockKey)) {
    return res.status(409).json({
      success: false,
      message: 'Hệ thống đang xử lý phản hồi của bạn, vui lòng không gửi liên tiếp.'
    });
  }

  inFlightFeedbackSubmissions.add(lockKey);

  try {
    const store = db.get();
    syncSessionsLifecycle(store);

    const session = store.sessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên sinh hoạt.' });
    }

    // Check meeting status & feedback window
    const windowStatus = isFeedbackWindowOpen(session);
    if (!windowStatus.isOpen) {
      return res.status(400).json({
        success: false,
        message: windowStatus.message || 'Biểu mẫu phản hồi hiện không mở cho phiên sinh hoạt này.'
      });
    }

    // Check attendance: must be recorded as present or late
    const attendance = store.attendance.find(a => a.sessionId === sessionId && a.memberId === actor.id);
    const isAttended = attendance && (attendance.status === 'present' || attendance.status === 'late');

    if (!isAttended) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa có ghi nhận tham dự buổi sinh hoạt này (hoặc đã vắng mặt), nên không đủ điều kiện gửi đánh giá.'
      });
    }

    // Resolve 4 integer ratings
    const q1 = Number(contentQuality);
    const q2 = Number(delivery ?? clarityScore);
    const q3 = Number(durationSuitability ?? organizationScore);
    const q4 = Number(usefulness ?? usefulnessScore);

    const allScores = [q1, q2, q3, q4];
    const allValid = allScores.every(s => Number.isInteger(s) && s >= 1 && s <= 5);

    if (!allValid) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng đánh giá đầy đủ 4 tiêu chí chất lượng bằng điểm số từ 1 đến 5 sao.'
      });
    }

    // Sanitize 3 separate text responses
    const cleanTakeaway = sanitizeTextInput(valuableTakeaway || feedbackText);
    const cleanSuggestion = sanitizeTextInput(improvementSuggestion);
    const cleanNextTopic = sanitizeTextInput(nextTopicIdea);

    // Find or create eligibility record
    let eligibility = store.feedbackEligibility.find(e => e.sessionId === sessionId && e.memberId === actor.id);

    // Check if this is an edit of an existing response
    let existingFeedback: DecoupledFeedback | undefined;
    if (eligibility?.submissionToken) {
      existingFeedback = store.feedbacks.find(f =>
        f.sessionId === sessionId && f.submissionToken === eligibility!.submissionToken
      );
    }

    // Legacy fallback lookup if eligibility existed without token
    if (!existingFeedback && eligibility?.hasSubmitted) {
      existingFeedback = store.feedbacks.find(f => f.sessionId === sessionId && f.memberId === actor.id);
    }

    const nowIso = new Date().toISOString();

    if (existingFeedback) {
      // Edit mode: update existing response in place
      existingFeedback.contentQuality = q1;
      existingFeedback.delivery = q2;
      existingFeedback.durationSuitability = q3;
      existingFeedback.usefulness = q4;
      existingFeedback.valuableTakeaway = cleanTakeaway;
      existingFeedback.improvementSuggestion = cleanSuggestion;
      existingFeedback.nextTopicIdea = cleanNextTopic;
      existingFeedback.updatedAt = nowIso;

      if (eligibility) {
        eligibility.updatedAt = nowIso;
      }
    } else {
      // Create new decoupled response
      const newToken = crypto.randomBytes(32).toString('hex');

      const newFeedback: DecoupledFeedback = {
        id: `fb-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        sessionId: session.id,
        sessionTitle: session.title,
        submissionToken: newToken,
        contentQuality: q1,
        delivery: q2,
        durationSuitability: q3,
        usefulness: q4,
        valuableTakeaway: cleanTakeaway,
        improvementSuggestion: cleanSuggestion,
        nextTopicIdea: cleanNextTopic,
        submittedAt: nowIso
      };

      store.feedbacks.unshift(newFeedback);

      if (!eligibility) {
        eligibility = {
          id: `fe-${Date.now()}`,
          sessionId: session.id,
          memberId: actor.id,
          hasSubmitted: true,
          submissionToken: newToken,
          submittedAt: nowIso
        };
        store.feedbackEligibility.push(eligibility);
      } else {
        eligibility.hasSubmitted = true;
        eligibility.submissionToken = newToken;
        eligibility.submittedAt = nowIso;
      }
    }

    // Audit log without leaking feedback content, scores, or cryptographic submission token
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      actorUnit: actor.unit,
      action: existingFeedback ? 'Cập nhật phản hồi chất lượng buổi học' : 'Gửi phản hồi chất lượng buổi học',
      targetType: 'TrainingFeedback',
      targetId: session.id,
      details: `Thành viên đã ${existingFeedback ? 'cập nhật' : 'gửi'} phản hồi ẩn danh cho buổi "${session.title}".`
    });

    db.save();

    return res.json({
      success: true,
      message: existingFeedback
        ? 'Đã cập nhật phản hồi của bạn thành công!'
        : 'Đã gửi phản hồi ẩn danh thành công! Danh tính của bạn được bảo vệ tuyệt đối.',
      feedback: {
        sessionId: session.id,
        contentQuality: q1,
        delivery: q2,
        durationSuitability: q3,
        usefulness: q4,
        valuableTakeaway: cleanTakeaway,
        improvementSuggestion: cleanSuggestion,
        nextTopicIdea: cleanNextTopic,
        submittedAt: nowIso
      }
    });
  } finally {
    inFlightFeedbackSubmissions.delete(lockKey);
  }
});

// GET /api/feedback/summary/:sessionId - Get feedback summary with strict RBAC & anonymity
// Rules:
// 1. Regular members: Only allowed if >= 5 valid responses.
//    If < 5: returns not eligible for publication, NO detailed answers returned.
// 2. BDH: Can only access meetings within their designated unit/scope.
// 3. Admin & BN: Can access all meetings.
// 4. Anonymity: Never exposes authorHash, memberId, email, or token to viewers.
feedbackRouter.get('/summary/:sessionId', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { sessionId } = req.params;

  syncSessionsLifecycle(store);

  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiên sinh hoạt.' });
  }

  const list = store.feedbacks.filter(f => f.sessionId === sessionId);
  const total = list.length;
  const canPublish = total >= 5;

  const isDetailedViewer = canViewDetailedSessionFeedback(actor, session);
  const isRegularMember = !isDetailedViewer;

  // Scope verification for BDH: If actor is in BDH leadership but session is outside their scope, reject with 403
  const isBdhLead = actor.unit === 'BDH' && (actor.role === 'leader' || actor.role === 'admin');
  if (isBdhLead && !isDetailedViewer) {
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN_SCOPE',
      message: 'Ban Điều hành chỉ được xem góp ý của các meeting thuộc đơn vị hoặc phạm vi được phân công.'
    });
  }

  // If total < 5 and user is a regular member: Block summary & detailed answers
  if (!canPublish && isRegularMember) {
    return res.json({
      success: true,
      canPublish: false,
      isPublished: false,
      totalResponses: total,
      threshold: 5,
      message: `Hiện mới có ${total}/5 phản hồi. Theo quy định bảo mật ẩn danh, cần tối thiểu 5 phản hồi hợp lệ để đủ điều kiện công bố báo cáo tổng hợp.`
    });
  }

  // Compute aggregated scores
  let sumContent = 0;
  let sumDelivery = 0;
  let sumDuration = 0;
  let sumUseful = 0;

  for (const item of list) {
    sumContent += (item.contentQuality || item.usefulnessScore || 0);
    sumDelivery += (item.delivery || item.clarityScore || 0);
    sumDuration += (item.durationSuitability || item.organizationScore || 0);
    sumUseful += (item.usefulness || item.usefulnessScore || 0);
  }

  const avgContentQuality = total > 0 ? Math.round((sumContent / total) * 10) / 10 : 0;
  const avgDelivery = total > 0 ? Math.round((sumDelivery / total) * 10) / 10 : 0;
  const avgDurationSuitability = total > 0 ? Math.round((sumDuration / total) * 10) / 10 : 0;
  const avgUsefulness = total > 0 ? Math.round((sumUseful / total) * 10) / 10 : 0;
  const overallAverage = total > 0
    ? Math.round(((avgContentQuality + avgDelivery + avgDurationSuitability + avgUsefulness) / 4) * 10) / 10
    : 0;

  // Aggregate separate text answers
  const valuableTakeaways = list
    .map(f => (f.valuableTakeaway || f.feedbackText || '').trim())
    .filter(Boolean);

  const improvementSuggestions = list
    .map(f => (f.improvementSuggestion || '').trim())
    .filter(Boolean);

  const nextTopicIdeas = list
    .map(f => (f.nextTopicIdea || '').trim())
    .filter(Boolean);

  const sanitizedComments = [...valuableTakeaways, ...improvementSuggestions];

  const summary: FeedbackSummary = {
    sessionId: session.id,
    sessionTitle: session.title,
    totalResponses: total,
    canPublish,
    isPublished: canPublish,
    avgContentQuality,
    avgDelivery,
    avgDurationSuitability,
    avgUsefulness,
    overallAverage,
    valuableTakeaways,
    improvementSuggestions,
    nextTopicIdeas,
    sanitizedComments
  };

  // Provide anonymous detailed responses only to authorized viewers (Admin, BN, scoped BDH)
  let responses: any[] | undefined = undefined;
  if (isDetailedViewer) {
    responses = list.map(f => ({
      id: f.id,
      sessionId: f.sessionId,
      sessionTitle: f.sessionTitle,
      contentQuality: f.contentQuality || f.usefulnessScore || 5,
      delivery: f.delivery || f.clarityScore || 5,
      durationSuitability: f.durationSuitability || f.organizationScore || 5,
      usefulness: f.usefulness || f.usefulnessScore || 5,
      valuableTakeaway: f.valuableTakeaway || f.feedbackText || '',
      improvementSuggestion: f.improvementSuggestion || '',
      nextTopicIdea: f.nextTopicIdea || '',
      submittedAt: f.submittedAt,
      updatedAt: f.updatedAt,
      isAnonymous: true // Strictly anonymous presentation
    }));
  }

  res.json({
    success: true,
    canPublish,
    isPublished: canPublish,
    summary,
    responses
  });
});

// GET /api/feedback/list - Admin and Lead Feedback Viewer with Scope Filtering
feedbackRouter.get('/list', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { sessionId } = req.query;

  syncSessionsLifecycle(store);

  const isAdminOrBn = actor.role === 'admin' || actor.role === 'sysadmin' || (actor.unit === 'BN' && actor.role !== 'member');
  const isBdhLead = actor.unit === 'BDH' && (actor.role === 'leader' || actor.role === 'admin');

  if (!isAdminOrBn && !isBdhLead) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập trang quản trị danh sách phản hồi.'
    });
  }

  // Filter sessions by actor scope
  let allowedSessions = store.sessions;
  if (isBdhLead && !isAdminOrBn) {
    allowedSessions = allowedSessions.filter(s =>
      s.unit === 'BDH' || s.personInChargeId === actor.id || s.createdById === actor.id
    );
  }

  const allowedSessionIds = new Set(allowedSessions.map(s => s.id));

  if (sessionId && typeof sessionId === 'string') {
    if (!allowedSessionIds.has(sessionId)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem phản hồi của phiên sinh hoạt ngoài phạm vi quản lý.'
      });
    }
  }

  let feedbacks = store.feedbacks.filter(f => allowedSessionIds.has(f.sessionId));
  if (sessionId && typeof sessionId === 'string') {
    feedbacks = feedbacks.filter(f => f.sessionId === sessionId);
  }

  const count = feedbacks.length;
  let sumContent = 0;
  let sumDelivery = 0;
  let sumDuration = 0;
  let sumUseful = 0;

  for (const item of feedbacks) {
    sumContent += (item.contentQuality || item.usefulnessScore || 0);
    sumDelivery += (item.delivery || item.clarityScore || 0);
    sumDuration += (item.durationSuitability || item.organizationScore || 0);
    sumUseful += (item.usefulness || item.usefulnessScore || 0);
  }

  const metrics = {
    count,
    avgContentQuality: count > 0 ? (sumContent / count).toFixed(1) : null,
    avgDelivery: count > 0 ? (sumDelivery / count).toFixed(1) : null,
    avgDurationSuitability: count > 0 ? (sumDuration / count).toFixed(1) : null,
    avgUsefulness: count > 0 ? (sumUseful / count).toFixed(1) : null,
    overallAverage: count > 0
      ? (((sumContent + sumDelivery + sumDuration + sumUseful) / (count * 4))).toFixed(1)
      : null
  };

  // Sanitize every record to strip all tokens and private identifiers
  const sanitizedList = feedbacks.map(f => ({
    id: f.id,
    sessionId: f.sessionId,
    sessionTitle: f.sessionTitle,
    contentQuality: f.contentQuality || f.usefulnessScore || 5,
    delivery: f.delivery || f.clarityScore || 5,
    durationSuitability: f.durationSuitability || f.organizationScore || 5,
    usefulness: f.usefulness || f.usefulnessScore || 5,
    valuableTakeaway: f.valuableTakeaway || f.feedbackText || '',
    improvementSuggestion: f.improvementSuggestion || '',
    nextTopicIdea: f.nextTopicIdea || '',
    submittedAt: f.submittedAt,
    updatedAt: f.updatedAt,
    isAnonymous: true
  }));

  res.json({
    success: true,
    feedbacks: sanitizedList,
    metrics
  });
});

// POST /api/feedback/reopen/:sessionId - Reopen feedback window with audit trail
feedbackRouter.post('/reopen/:sessionId', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { sessionId } = req.params;
  const { hours, reason } = req.body;

  // Authorization: Only Admin or Ban Chủ nhiệm (BN)
  if (actor.unit !== 'BN' && actor.role !== 'admin' && actor.role !== 'sysadmin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) hoặc Quản trị viên mới có quyền mở lại thời hạn góp ý.'
    });
  }

  const session = store.sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiên sinh hoạt.' });
  }

  if (session.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Không thể mở lại góp ý cho phiên sinh hoạt đã bị hủy.' });
  }

  const extensionHours = Number(hours) || 24;
  if (extensionHours <= 0 || extensionHours > 168) {
    return res.status(400).json({ success: false, message: 'Thời gian gia hạn phải từ 1 đến 168 giờ (7 ngày).' });
  }

  if (!reason || !String(reason).trim()) {
    return res.status(400).json({ success: false, message: 'Bắt buộc phải ghi rõ lý do mở lại thời hạn góp ý.' });
  }

  const now = new Date();
  const newDeadline = new Date(now.getTime() + extensionHours * 3600 * 1000).toISOString();

  session.feedbackStatus = 'reopened';
  session.feedbackDeadline = newDeadline;
  session.feedbackReopenedBy = actor.fullName;
  session.feedbackReopenedAt = now.toISOString();
  session.feedbackReopenReason = String(reason).trim();

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: now.toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Mở lại biểu mẫu góp ý sau meeting',
    targetType: 'TrainingSession',
    targetId: session.id,
    details: `${actor.fullName} đã mở lại biểu mẫu góp ý cho buổi "${session.title}" thêm ${extensionHours} giờ (hạn mới: ${new Date(newDeadline).toLocaleString('vi-VN')}). Lý do: ${reason}`
  });

  db.save();

  res.json({
    success: true,
    message: `Đã mở lại biểu mẫu góp ý cho buổi "${session.title}" thành công (thời hạn mới đến ${new Date(newDeadline).toLocaleString('vi-VN')})!`,
    session
  });
});
