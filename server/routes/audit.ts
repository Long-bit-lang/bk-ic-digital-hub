// Audit Logging Query Route
import { Router } from 'express';
import { db } from '../db.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const auditRouter = Router();

auditRouter.use(requireAuth);
auditRouter.use(requireNormalSession);

// GET /api/audit-logs
// Rule:
// - BN và admin: xem toàn CLB.
// - Leader: xem trong phạm vi đơn vị được giao.
// - Member: không được xem nhật ký quản trị.
// - Nhật ký không được sửa hoặc xóa bởi người dùng thông thường.
auditRouter.get('/', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  if (actor.role === 'member' || actor.role === 'applicant' || actor.role === 'guest') {
    return res.status(403).json({
      success: false,
      message: 'Thành viên thông thường không có quyền truy cập nhật ký kiểm toán hệ thống.'
    });
  }

  let logs = store.auditLogs;

  // Leader only sees logs related to their unit
  if (actor.role === 'leader' && actor.unit && actor.unit !== 'BN') {
    const leaderUnit = actor.unit;
    logs = logs.filter(l => l.actorUnit === leaderUnit || (l.details && l.details.includes(leaderUnit)));
  }

  res.json({ success: true, logs });
});
