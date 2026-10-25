import { Router } from 'express';
import { db } from '../db.ts';
import type { User, MemberStatus, StatusHistoryEntry, UnitId } from '../../src/types/index.ts';
import { sanitizeUser } from './auth.ts';
import { generateSecureResetToken, hashPassword, validatePasswordPolicy, getPublicAppUrl } from '../services/authSecurity.ts';
import { sendAccountInviteEmail, sendPasswordResetEmail, isValidEmailFormat } from '../services/emailService.ts';
import { requireAuth, requireNormalSession } from '../middleware/auth.ts';

export const membersRouter = Router();

// Apply authentication and normal session requirement to all member endpoints
membersRouter.use(requireAuth);
membersRouter.use(requireNormalSession);

// GET /api/members - List members with privacy protection
membersRouter.get('/', (req, res) => {
  const actor = req.user!;
  const store = db.get();

  const isBnOrAdmin = actor.unit === 'BN' || actor.role === 'admin';
  const isBtv = actor.unit === 'BTV';

  // Privacy rules:
  // - BN, Admin, BTV see status history with reasons.
  // - Leaders of other units: masked reasons.
  // - Member only sees basic public directory info without sensitive private histories.
  let memberList = store.users;

  if (actor.role === 'member' || actor.role === 'applicant' || actor.role === 'guest') {
    memberList = store.users.map(u => {
      if (u.id === actor.id) return u;
      return {
        ...u,
        phone: undefined,
        statusHistory: []
      };
    });
    return res.json({ success: true, members: memberList.map(sanitizeUser) });
  }

  // Leaders of other units: mask private reasons
  const sanitized = memberList.map(u => {
    if (isBnOrAdmin || isBtv || u.id === actor.id) {
      return u;
    }
    return {
      ...u,
      statusHistory: u.statusHistory?.map(sh => ({
        ...sh,
        reason: sh.newStatus !== 'active' ? 'Đã được Ban Chủ nhiệm phê duyệt bảo lưu/thay đổi trạng thái' : sh.reason
      }))
    };
  });

  res.json({ success: true, members: sanitized.map(sanitizeUser) });
});

// GET /api/members/:id - Get specific member details
membersRouter.get('/:id', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const member = store.users.find(u => u.id === req.params.id);

  if (!member) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên' });
  }

  // Member can only see their own private info
  if ((actor.role === 'member' || actor.role === 'applicant') && actor.id !== member.id) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền xem thông tin chi tiết riêng tư của thành viên khác'
    });
  }

  const isBnOrAdmin = actor.unit === 'BN' || actor.role === 'admin';
  const isBtv = actor.unit === 'BTV';

  if (!isBnOrAdmin && !isBtv && actor.id !== member.id) {
    const masked = {
      ...member,
      statusHistory: member.statusHistory?.map(sh => ({
        ...sh,
        reason: sh.newStatus !== 'active' ? 'Bảo lưu theo quyết định phê duyệt của Ban Chủ nhiệm' : sh.reason
      }))
    };
    return res.json({ success: true, member: sanitizeUser(masked) });
  }

  res.json({ success: true, member: sanitizeUser(member) });
});

// POST /api/members/:id/status-change - Change member status (active/paused/left)
// Business rule: BN approves decision, BTV updates record.
membersRouter.post('/:id/status-change', (req, res) => {
  const actor = req.user!;
  const { newStatus, effectiveDate, reason, approvedBy } = req.body;

  if (!newStatus || !reason || !effectiveDate) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ trạng thái mới, ngày hiệu lực và lý do' });
  }

  // Permission check: Only BN or Admin or BTV can request/update status
  if (actor.unit !== 'BN' && actor.unit !== 'BTV' && actor.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm và Ban Thành viên mới có quyền cập nhật trạng thái thành viên'
    });
  }

  const store = db.get();
  const member = store.users.find(u => u.id === req.params.id);

  if (!member) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên' });
  }

  const previousStatus = member.status;
  const historyEntry: StatusHistoryEntry = {
    id: `sh-${Date.now()}`,
    previousStatus,
    newStatus,
    effectiveDate,
    reason,
    approvedBy: approvedBy || (actor.unit === 'BN' ? actor.fullName : 'Ban Chủ nhiệm CLB (Đã phê duyệt)'),
    updatedBy: actor.fullName,
    timestamp: new Date().toISOString()
  };

  member.status = newStatus;
  member.statusEffectiveDate = effectiveDate;
  if (!member.statusHistory) member.statusHistory = [];
  member.statusHistory.unshift(historyEntry);

  // Business rule: cancel ongoing tasks if paused or left
  if (newStatus === 'paused' || newStatus === 'left') {
    const memberTasks = store.tasks.filter(
      t => t.assigneeId === member.id && (t.status === 'not_started' || t.status === 'in_progress')
    );
    for (const task of memberTasks) {
      task.status = 'cancelled';
      task.cancellationReason = `Thành viên chuyển sang trạng thái ${newStatus === 'paused' ? 'Bảo lưu' : 'Đã rời CLB'} từ ngày ${effectiveDate}. Bảo lưu tiến độ cũ, không trừ điểm.`;
      task.cancelledBy = actor.fullName;
      task.cancelledAt = new Date().toISOString();
      task.history.push({
        timestamp: new Date().toISOString(),
        actorName: actor.fullName,
        action: 'Hủy nhiệm vụ do thay đổi trạng thái thành viên',
        reason: task.cancellationReason,
        oldStatus: 'in_progress',
        newStatus: 'cancelled'
      });
    }
  }

  // Audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Thay đổi trạng thái thành viên',
    targetType: 'User',
    targetId: member.id,
    previousValue: previousStatus,
    newValue: newStatus,
    reason,
    details: `Chuyển trạng thái ${member.fullName} (${member.studentId}) từ ${previousStatus} sang ${newStatus}. Phê duyệt bởi: ${historyEntry.approvedBy}`
  });

  db.save();

  res.json({
    success: true,
    message: `Đã cập nhật trạng thái thành viên sang ${newStatus === 'active' ? 'Đang hoạt động' : newStatus === 'paused' ? 'Tạm ngưng/Bảo lưu' : 'Đã rời CLB'} thành công!`,
    member: sanitizeUser(member)
  });
});

// PATCH /api/members/:id - Update member profile details
// P0.2: Prevent self-escalation of role, unit, position, or status!
membersRouter.patch('/:id', (req, res) => {
  const actor = req.user!;
  const store = db.get();
  const member = store.users.find(u => u.id === req.params.id);

  if (!member) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên' });
  }

  const isSelf = actor.id === member.id;
  const isBnOrAdmin = actor.role === 'admin' || actor.unit === 'BN';
  const isBtv = actor.unit === 'BTV';

  // Permission check: only self, admin, or BN/BTV can edit profile
  if (!isSelf && !isBnOrAdmin && !isBtv) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền chỉnh sửa thông tin của thành viên này.'
    });
  }

  const { fullName, phone, faculty, classId, position, unit, role, avatarUrl, accountStatus, emailVerified } = req.body;

  // Strict Privilege Check: Disallow self-escalation or unauthorized tampering of governance fields!
  if ((role !== undefined || unit !== undefined || position !== undefined || accountStatus !== undefined || emailVerified !== undefined) && !isBnOrAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có thẩm quyền thay đổi vai trò (Role), đơn vị (Unit), chức vụ (Position) hoặc trạng thái tài khoản.'
    });
  }

  // Update administrative fields if authorized
  if (isBnOrAdmin) {
    if (accountStatus && ['active', 'disabled', 'pending_setup', 'pending_verification'].includes(accountStatus)) {
      member.accountStatus = accountStatus;
      if (accountStatus === 'active' && member.passwordHash) {
        member.emailVerified = true;
      }
    }
    if (emailVerified !== undefined) {
      member.emailVerified = Boolean(emailVerified);
      if (member.emailVerified && member.accountStatus === 'pending_setup') {
        member.accountStatus = 'active';
      }
    }
    if (role && role !== member.role) {
      member.role = role;
    }
    if (unit && unit !== member.unit) {
      if (!member.unitHistory) member.unitHistory = [];
      member.unitHistory.unshift({
        id: `uh-${Date.now()}`,
        previousUnit: member.unit || 'BTV',
        newUnit: unit,
        previousPosition: member.position,
        newPosition: position || member.position,
        effectiveDate: new Date().toISOString().split('T')[0],
        approvedBy: actor.fullName,
        timestamp: new Date().toISOString()
      });
      member.unit = unit;
      member.committee = unit;
    }
    if (position) {
      member.position = position;
    }
  }

  // Non-sensitive fields: can be updated by self or admin
  if (fullName && (isBnOrAdmin || isBtv)) member.fullName = fullName.trim();
  if (phone !== undefined) member.phone = phone.trim();
  if (faculty) member.faculty = faculty;
  if (classId) member.classId = classId;
  if (avatarUrl) member.avatarUrl = avatarUrl;

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Cập nhật thông tin thành viên',
    targetType: 'User',
    targetId: member.id,
    details: `Cập nhật hồ sơ thành viên ${member.fullName} (${member.studentId})`
  });

  db.save();
  res.json({ success: true, member: sanitizeUser(member) });
});

// POST /api/members - Admin or BN creates a new member account directly
membersRouter.post('/', async (req, res) => {
  const actor = req.user!;
  if (actor.role !== 'admin' && actor.unit !== 'BN') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm hoặc Quản trị viên mới có quyền tạo tài khoản trực tiếp.'
    });
  }

  const {
    fullName,
    studentId,
    email,
    password,
    phone,
    faculty,
    classId,
    academicYear,
    role,
    unit,
    position,
    status,
    accountStatus
  } = req.body;

  if (!fullName || !studentId || !email) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền các thông tin bắt buộc: Họ tên, MSSV và Email.'
    });
  }

  const store = db.get();
  const trimmedEmail = email.trim().toLowerCase();
  if (!isValidEmailFormat(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Địa chỉ email thành viên không đúng định dạng hợp lệ.'
    });
  }

  const trimmedStudentId = studentId.trim();

  // Check uniqueness
  if (store.users.some(u => u.email.toLowerCase() === trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: `Email "${trimmedEmail}" đã tồn tại trong hệ thống.`
    });
  }

  if (store.users.some(u => u.studentId.trim().toLowerCase() === trimmedStudentId.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Mã số sinh viên "${trimmedStudentId}" đã tồn tại trong hệ thống.`
    });
  }

  const assignedUnit: UnitId = unit || 'BDH';
  const nowISO = new Date().toISOString();

  let initialPasswordHash: string | undefined;
  let initialPasswordSalt: string | undefined;
  let rawToken: string | undefined;
  let tokenHash: string | undefined;
  let expiresAt: string | undefined;
  let inviteLink: string | undefined;

  const host = getPublicAppUrl(req);

  if (password && typeof password === 'string' && password.trim()) {
    const policy = validatePasswordPolicy(password.trim());
    if (!policy.isValid) {
      return res.status(400).json({
        success: false,
        message: `Mật khẩu khởi tạo không hợp lệ: ${policy.message || 'Chưa đáp ứng chính sách bảo mật'}`
      });
    }
    const hashed = hashPassword(password.trim());
    initialPasswordHash = hashed.hash;
    initialPasswordSalt = hashed.salt;
  } else {
    const tokenData = generateSecureResetToken();
    rawToken = tokenData.rawToken;
    tokenHash = tokenData.tokenHash;
    expiresAt = tokenData.expiresAt;
    inviteLink = `${host}/reset-password?token=${rawToken}`;
  }

  const newMember: User = {
    id: `usr-${Date.now()}`,
    memberId: `BKIC-${assignedUnit}-${trimmedStudentId}`,
    email: trimmedEmail,
    fullName: fullName.trim(),
    studentId: trimmedStudentId,
    phone: phone ? phone.trim() : '',
    faculty: faculty || 'Khoa Công nghệ Thông tin',
    classId: classId || '24T_CLC',
    academicYear: academicYear || 'K24 (2024-2029)',
    role: role || 'member',
    unit: assignedUnit,
    committee: assignedUnit,
    position: position || `Thành viên Ban ${assignedUnit}`,
    joinDate: nowISO.split('T')[0],
    status: status || 'active',
    statusEffectiveDate: nowISO.split('T')[0],
    accountStatus: accountStatus || (initialPasswordHash ? 'active' : 'pending_setup'),
    emailVerified: Boolean(initialPasswordHash),
    createdAt: nowISO,
    passwordHash: initialPasswordHash,
    passwordSalt: initialPasswordSalt,
    resetTokenHash: tokenHash,
    resetTokenExpiresAt: expiresAt,
    statusHistory: [
      {
        id: `sh-${Date.now()}`,
        previousStatus: 'active',
        newStatus: status || 'active',
        effectiveDate: nowISO.split('T')[0],
        reason: 'Khởi tạo tài khoản trực tiếp bởi Ban Chủ nhiệm/Admin',
        approvedBy: actor.fullName,
        updatedBy: actor.fullName,
        timestamp: nowISO
      }
    ]
  };

  store.users.push(newMember);

  const unitName = assignedUnit === 'BN' ? 'Ban Chủ nhiệm' : assignedUnit === 'BDH' ? 'Ban Điều hành' : 'Ban Thành viên';

  let inviteSendResult: any = null;
  if (inviteLink && expiresAt) {
    try {
      inviteSendResult = await sendAccountInviteEmail({
        to: newMember.email,
        fullName: newMember.fullName,
        inviteLink,
        expiresAt,
        unitName,
        roleName: newMember.position
      });
    } catch (err) {
      console.error('[Members] Lỗi gửi thư mời thành viên:', err);
    }
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: nowISO,
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Cấp tài khoản mới',
    targetType: 'User',
    targetId: newMember.id,
    details: `Tạo tài khoản mới cho ${newMember.fullName} (${newMember.studentId}, ${newMember.email}) với vai trò ${newMember.role} - Ban ${newMember.unit}.`
  });

  db.save();

  res.json({
    success: true,
    message: initialPasswordHash
      ? `Đã cấp tài khoản thành công cho ${newMember.fullName}. Tài khoản đã được kích hoạt và có thể đăng nhập ngay!`
      : (inviteSendResult && inviteSendResult.deliveryMethod === 'smtp' && inviteSendResult.success)
        ? `Đã cấp tài khoản thành công cho ${newMember.fullName} và gửi thư mời thiết lập mật khẩu bảo mật tới email "${newMember.email}".`
        : `Đã cấp tài khoản thành công cho ${newMember.fullName}. Thư mời đã được tạo và lưu trong Hộp thư Quản trị (Admin Outbox).`,
    member: sanitizeUser(newMember),
    inviteLink,
    initialPassword: initialPasswordHash ? password.trim() : undefined,
    deliveryMethod: inviteSendResult?.deliveryMethod,
    deliveryStatus: inviteSendResult?.status,
    deliveryMessage: inviteSendResult?.message
  });
});

// POST /api/members/:id/reset-password - Admin or BN issues a secure reset link / email for member
membersRouter.post('/:id/reset-password', async (req, res) => {
  const actor = req.user!;
  if (actor.role !== 'admin' && actor.unit !== 'BN') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm hoặc Quản trị viên mới có quyền đặt lại mật khẩu thành viên.'
    });
  }

  const store = db.get();
  const member = store.users.find(u => u.id === req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên.' });
  }

  // Ensure member has a valid registered email before issuing reset link
  if (!member.email || !isValidEmailFormat(member.email)) {
    return res.status(400).json({
      success: false,
      message: `Thành viên "${member.fullName}" không có địa chỉ email hợp lệ để nhận liên kết đặt lại mật khẩu.`
    });
  }

  const { rawToken, tokenHash, expiresAt } = generateSecureResetToken();
  member.resetTokenHash = tokenHash;
  member.resetTokenExpiresAt = expiresAt;

  const host = getPublicAppUrl(req);
  const resetLink = `${host}/reset-password?token=${rawToken}`;

  try {
    const sendResult = await sendPasswordResetEmail({
      to: member.email.trim().toLowerCase(),
      fullName: member.fullName,
      resetLink,
      expiresAt
    });

    if (!sendResult.success && sendResult.deliveryMethod === 'smtp') {
      return res.status(502).json({
        success: false,
        code: sendResult.deliveryCategory,
        message: sendResult.message
      });
    }

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'Phát hành liên kết đặt lại mật khẩu',
      targetType: 'User',
      targetId: member.id,
      details: `Đã gửi liên kết bảo mật đặt lại mật khẩu tới email ${member.email} (Thời hạn 15 phút, 1 lần sử dụng).`
    });

    db.save();

    res.json({
      success: true,
      message: sendResult.deliveryMethod === 'smtp'
        ? `Máy chủ SMTP đã chấp nhận gửi email hướng dẫn đặt lại mật khẩu tới email "${member.email}".`
        : `Đã phát hành liên kết bảo mật và gửi email hướng dẫn đặt lại mật khẩu tới email "${member.email}".`,
      resetLink
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi email đặt lại mật khẩu.'
    });
  }
});

// POST /api/members/:id/verify-email - Admin or BN manually marks member email as verified
membersRouter.post('/:id/verify-email', (req, res) => {
  const actor = req.user!;
  if (actor.role !== 'admin' && actor.unit !== 'BN') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm hoặc Quản trị viên mới có quyền xác thực email thành viên.'
    });
  }

  const store = db.get();
  const member = store.users.find(u => u.id === req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên.' });
  }

  member.emailVerified = true;
  if (member.accountStatus === 'pending_setup' || member.accountStatus === 'pending_verification') {
    member.accountStatus = 'active';
  }

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    action: 'Xác thực email thành viên',
    targetType: 'User',
    targetId: member.id,
    details: `Quản trị viên đã xác thực email thành công cho tài khoản ${member.fullName} (${member.email}).`
  });

  db.save();

  res.json({
    success: true,
    message: `Đã xác thực email cho tài khoản ${member.fullName} (${member.email}) thành công!`,
    member: sanitizeUser(member)
  });
});

// DELETE /api/members/:id - Admin or BN deletes member
membersRouter.delete('/:id', (req, res) => {
  const actor = req.user!;
  if (actor.role !== 'admin' && actor.unit !== 'BN') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Ban Chủ nhiệm hoặc Quản trị viên mới có quyền xóa tài khoản.'
    });
  }

  const store = db.get();
  const index = store.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thành viên.' });
  }

  const removed = store.users.splice(index, 1)[0];

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    action: 'Xóa tài khoản thành viên',
    targetType: 'User',
    targetId: removed.id,
    details: `Đã xóa tài khoản của ${removed.fullName} (${removed.email}) khỏi hệ thống`
  });

  db.save();
  res.json({ success: true, message: `Đã xóa thành viên "${removed.fullName}" khỏi hệ thống.` });
});
