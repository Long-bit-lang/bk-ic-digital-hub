// Monthly Member Evaluations and Appeals Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { MonthlyEvaluation, EvaluationCriterion } from '../../src/types/index.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const evaluationsRouter = Router();

evaluationsRouter.use(requireAuth);
evaluationsRouter.use(requireNormalSession);

// Helper to compute arithmetic mean of applicable criteria
function calculateTotalScore(criteria: EvaluationCriterion[]): {
  totalScore: number | null;
  status: 'draft' | 'submitted' | 'approved' | 'under_appeal' | 'insufficient_data';
} {
  const applicableCriteria = criteria.filter(c => c.isApplicable && !c.isMissingData && c.score !== null);
  
  if (applicableCriteria.length === 0) {
    return { totalScore: null, status: 'insufficient_data' };
  }

  const sum = applicableCriteria.reduce((acc, c) => acc + (c.score || 0), 0);
  const rawAvg = sum / applicableCriteria.length;
  const totalScore = Math.round(rawAvg * 100) / 100;

  return { totalScore, status: 'submitted' };
}

// GET /api/evaluations - List evaluations
evaluationsRouter.get('/', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const { month, memberId, unit } = req.query;

  let evals = store.evaluations;

  if (month) evals = evals.filter(e => e.month === month);
  if (memberId) evals = evals.filter(e => e.memberId === memberId);
  if (unit) evals = evals.filter(e => e.unit === unit);

  // Access control
  if (actor.role === 'member' || actor.role === 'applicant') {
    evals = evals.filter(e => e.memberId === actor.id);
  } else if (actor.role === 'leader' && actor.unit !== 'BN') {
    evals = evals.filter(e => e.unit === actor.unit);
  }

  res.json({ success: true, evaluations: evals });
});

// POST /api/evaluations - Create / Draft monthly evaluation
evaluationsRouter.post('/', (req, res) => {
  const actor = req.user!;
  const { memberId, month, criteria } = req.body;

  if (!memberId || !month || !criteria || !Array.isArray(criteria)) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ: Mã thành viên, tháng đánh giá và bộ tiêu chí.'
    });
  }

  // Permission: Leader or BN or Admin
  if (actor.role !== 'leader' && actor.unit !== 'BN' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Trưởng ban, Ban Chủ nhiệm hoặc Quản trị viên mới có quyền tạo phiếu đánh giá.'
    });
  }

  const store = db.get();
  const targetMember = store.users.find(u => u.id === memberId);

  if (!targetMember) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên cần đánh giá.' });
  }

  // If leader, verify they belong to same unit
  if (actor.role === 'leader' && actor.unit !== 'BN') {
    if (targetMember.unit !== actor.unit) {
      return res.status(403).json({
        success: false,
        message: 'Trưởng ban chỉ có quyền đánh giá thành viên thuộc đơn vị mình.'
      });
    }
  }

  const { totalScore, status } = calculateTotalScore(criteria);

  let existing = store.evaluations.find(e => e.memberId === memberId && e.month === month);

  if (existing) {
    if (existing.status === 'approved' && actor.unit !== 'BN' && actor.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bản đánh giá này đã được Ban Chủ nhiệm phê duyệt chính thức. Cần quy trình khiếu nại để điều chỉnh.'
      });
    }

    existing.criteria = criteria;
    existing.totalScore = totalScore;
    existing.status = status === 'insufficient_data' ? 'insufficient_data' : 'submitted';
    existing.evaluatorId = actor.id;
    existing.evaluatorName = actor.fullName;

    db.save();
    return res.json({
      success: true,
      message: 'Đã cập nhật phiếu đánh giá thành công!',
      evaluation: existing
    });
  }

  const newEval: MonthlyEvaluation = {
    id: `eval-${month}-${targetMember.studentId}-${Date.now()}`,
    memberId: targetMember.id,
    memberName: targetMember.fullName,
    studentId: targetMember.studentId,
    unit: targetMember.unit,
    positionAtTime: targetMember.position,
    month,
    version: 1,
    status: status === 'insufficient_data' ? 'insufficient_data' : 'submitted',
    criteria,
    totalScore,
    evaluatorId: actor.id,
    evaluatorName: actor.fullName,
    versionHistory: [
      {
        version: 1,
        totalScore,
        updatedAt: new Date().toISOString(),
        reason: 'Khởi tạo đánh giá định kỳ'
      }
    ]
  };

  store.evaluations.unshift(newEval);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Đánh giá thành viên tháng',
    targetType: 'MonthlyEvaluation',
    targetId: newEval.id,
    details: `${actor.fullName} hoàn thành đánh giá tháng ${month} cho ${targetMember.fullName} (Điểm: ${totalScore !== null ? totalScore : 'Chưa đủ dữ liệu'})`
  });

  db.save();

  res.json({
    success: true,
    message: status === 'insufficient_data'
      ? 'Đã lưu đánh giá. Do thiếu dữ liệu hoặc tiêu chí không áp dụng, trạng thái ghi nhận "Chưa đủ dữ liệu" và chưa công bố điểm.'
      : 'Đã lưu đánh giá thành công, đang chờ Ban Chủ nhiệm phê duyệt.',
    evaluation: newEval
  });
});

// POST /api/evaluations/:id/approve - BN Approves final evaluation
evaluationsRouter.post('/:id/approve', (req, res) => {
  const actor = req.user!;

  if (actor.unit !== 'BN' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) mới có thẩm quyền phê duyệt đánh giá thành viên cuối cùng.'
    });
  }

  const store = db.get();
  const evaluation = store.evaluations.find(e => e.id === req.params.id);

  if (!evaluation) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu đánh giá.' });
  }

  if (evaluation.status === 'insufficient_data') {
    return res.status(400).json({
      success: false,
      message: 'Phiếu đánh giá đang ở trạng thái "Chưa đủ dữ liệu", không thể phê duyệt công bố điểm.'
    });
  }

  evaluation.status = 'approved';
  evaluation.approvedBy = actor.fullName;
  evaluation.approvedAt = new Date().toISOString();

  const evalMember = store.users.find(u => u.id === evaluation.memberId);
  store.notifications.unshift({
    id: `notif-${Date.now()}`,
    recipientId: evaluation.memberId,
    recipientEmail: evalMember?.email || '',
    title: `Kết quả đánh giá tháng ${evaluation.month} đã được công bố`,
    message: `Ban Chủ nhiệm đã phê duyệt kết quả đánh giá tháng ${evaluation.month} của bạn: ${evaluation.totalScore}/10 điểm. Bạn có 7 ngày lịch để khiếu nại nếu có thắc mắc.`,
    type: 'system',
    referenceType: 'evaluation',
    referenceId: evaluation.id,
    isRead: false,
    createdAt: new Date().toISOString(),
    emailSent: Boolean(evalMember?.email),
    emailStatus: evalMember?.email ? 'sent' : 'failed'
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: 'BN',
    action: 'Phê duyệt đánh giá thành viên',
    targetType: 'MonthlyEvaluation',
    targetId: evaluation.id,
    details: `${actor.fullName} (BN) phê duyệt đánh giá tháng ${evaluation.month} của ${evaluation.memberName} (${evaluation.totalScore}/10)`
  });

  db.save();

  res.json({
    success: true,
    message: `Ban Chủ nhiệm đã phê duyệt kết quả đánh giá của ${evaluation.memberName} thành công!`,
    evaluation
  });
});

// POST /api/evaluations/:id/appeal - Member submits appeal within 7 calendar days
evaluationsRouter.post('/:id/appeal', (req, res) => {
  const actor = req.user!;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nêu rõ lý do và căn cứ khiếu nại.' });
  }

  const store = db.get();
  const evaluation = store.evaluations.find(e => e.id === req.params.id);

  if (!evaluation) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu đánh giá.' });
  }

  if (evaluation.memberId !== actor.id && actor.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bạn chỉ có quyền khiếu nại bản đánh giá của chính mình.' });
  }

  if (evaluation.status !== 'approved' && evaluation.status !== 'under_appeal') {
    return res.status(400).json({ success: false, message: 'Bản đánh giá chưa được công bố chính thức, không thể khiếu nại.' });
  }

  if (evaluation.approvedAt) {
    const approvedTime = new Date(evaluation.approvedAt).getTime();
    const daysDiff = (Date.now() - approvedTime) / (24 * 60 * 60 * 1000);
    if (daysDiff > 7) {
      return res.status(400).json({
        success: false,
        message: 'Đã quá thời hạn 7 ngày lịch kể từ ngày công bố đánh giá để nộp khiếu nại.'
      });
    }
  }

  evaluation.status = 'under_appeal';
  evaluation.appeal = {
    reason,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Khiếu nại điểm đánh giá',
    targetType: 'MonthlyEvaluation',
    targetId: evaluation.id,
    reason,
    details: `${actor.fullName} gửi khiếu nại điểm đánh giá tháng ${evaluation.month}. Trạng thái chuyển sang "Đang xem xét khiếu nại".`
  });

  db.save();

  res.json({
    success: true,
    message: 'Đã gửi khiếu nại thành công. Bản đánh giá được đánh dấu đang xem xét và chuyển đến Ban Chủ nhiệm thụ lý.',
    evaluation
  });
});

// POST /api/evaluations/:id/resolve-appeal - BN resolves appeal and creates a NEW version
evaluationsRouter.post('/:id/resolve-appeal', (req, res) => {
  const actor = req.user!;
  const { decision, resolutionNotes, updatedCriteria } = req.body;

  if (actor.unit !== 'BN' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm (BN) mới có thẩm quyền giải quyết khiếu nại điểm đánh giá.'
    });
  }

  const store = db.get();
  const evaluation = store.evaluations.find(e => e.id === req.params.id);

  if (!evaluation || !evaluation.appeal) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn khiếu nại.' });
  }

  evaluation.appeal.status = decision;
  evaluation.appeal.decidedBy = actor.fullName;
  evaluation.appeal.decidedAt = new Date().toISOString();
  evaluation.appeal.resolutionNotes = resolutionNotes;

  if (decision === 'accepted' && updatedCriteria) {
    const newVersion = (evaluation.version || 1) + 1;
    const { totalScore } = calculateTotalScore(updatedCriteria);

    evaluation.criteria = updatedCriteria;
    evaluation.totalScore = totalScore;
    evaluation.version = newVersion;
    evaluation.status = 'approved';

    if (!evaluation.versionHistory) evaluation.versionHistory = [];
    evaluation.versionHistory.unshift({
      version: newVersion,
      totalScore,
      updatedAt: new Date().toISOString(),
      reason: `Khiếu nại được BN chấp thuận: ${resolutionNotes}`
    });
  } else {
    evaluation.status = 'approved';
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: 'BN',
    action: `Giải quyết khiếu nại đánh giá (${decision === 'accepted' ? 'Chấp thuận' : 'Bác bỏ'})`,
    targetType: 'MonthlyEvaluation',
    targetId: evaluation.id,
    details: `${actor.fullName} đã ${decision === 'accepted' ? 'chấp thuận khiếu nại và tạo Version mới' : 'bác đơn khiếu nại'} của ${evaluation.memberName}`
  });

  db.save();

  res.json({
    success: true,
    message: decision === 'accepted'
      ? `Đã chấp thuận khiếu nại và nâng cấp lên Phiên bản ${evaluation.version} thành công!`
      : 'Đã giải quyết và giữ nguyên kết quả đánh giá ban đầu.',
    evaluation
  });
});
