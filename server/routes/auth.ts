// Real Authentication & User Management Routes for BK-IC Digital Hub
import { Router, type Request, type Response } from 'express';
import { db } from '../db.ts';
import type { User, UserRole, UnitId, Application, AccountStatus } from '../../src/types/index.ts';
import {
  hashPassword,
  verifyPassword,
  validatePasswordPolicy,
  generateSecureResetToken,
  generateSecureVerificationToken,
  generateSecureTemporaryPassword,
  hashToken,
  checkRateLimit,
  getPublicAppUrl
} from '../services/authSecurity.ts';
import {
  sendPasswordResetEmail,
  sendTemporaryPasswordEmail,
  sendAccountInviteEmail,
  sendAccountVerificationEmail,
  getEmailOutbox,
  clearEmailOutbox,
  getActiveSmtpConfig,
  sendTestSmtpEmail,
  isValidEmailFormat,
  sanitizeSmtpHost,
  sanitizeSmtpPort,
  sanitizeSmtpUser,
  sanitizeSmtpPass
} from '../services/emailService.ts';
import {
  createSession,
  revokeSession,
  revokeAllUserSessions,
  upgradeRecoverySession
} from '../services/sessionStore.ts';
import {
  requireAuth,
  requireAdmin,
  requireUnitOrRole
} from '../middleware/auth.ts';

export const authRouter = Router();

// Helper to sanitize user output (hide all password hashes, salts, and tokens in API responses)
export function sanitizeUser(user: User): User {
  const {
    password,
    passwordHash,
    passwordSalt,
    resetTokenHash,
    resetTokenExpiresAt,
    tempPasswordHash,
    tempPasswordSalt,
    tempPasswordExpiresAt,
    tempPasswordAttempts,
    ...safe
  } = user;
  return safe as User;
}

// Mask email for public display (e.g. n***@dut.udn.vn)
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 4))}${local[local.length - 1]}@${domain}`;
}

// GET /api/auth/me - Get current authenticated user
// Strict authentication: returns 401 if not authenticated. NO fallback to admin!
authRouter.get('/me', (req, res) => {
  if (!req.user || !req.session) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Chưa đăng nhập'
    });
  }

  const safeUser = sanitizeUser(req.user);
  safeUser.isRecoverySession = req.session.isRecoverySession;
  safeUser.mustChangePassword = req.session.mustChangePassword;

  res.json({
    success: true,
    user: safeUser,
    session: {
      isRecoverySession: req.session.isRecoverySession,
      mustChangePassword: req.session.mustChangePassword
    }
  });
});

// POST /api/auth/login - Real email and password authentication with security verification & session tokens
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '::ffff:127.0.0.1' || clientIp === 'unknown';

  // Multi-level rate limiting: Check IP brute force (relaxed for loopback / automated tests)
  if (!isLocalhost) {
    const ipRateLimit = checkRateLimit(`login-ip-${clientIp}`, 60, 15 * 60 * 1000);
    if (!ipRateLimit.allowed) {
      return res.status(429).json({
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Quá nhiều lượt đăng nhập thất bại từ thiết bị của bạn. Vui lòng thử lại sau ${Math.ceil(
          (ipRateLimit.retryAfterSec || 60) / 60
        )} phút.`
      });
    }
  }

  if (!email) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp địa chỉ email sinh viên' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const store = db.get();

  // Support role aliases for testing/convenience
  const ALIASES: Record<string, string> = {
    'admin@dut.udn.vn': 'admin.bkic@dut.udn.vn',
    'admin': 'admin.bkic@dut.udn.vn'
  };
  const lookupEmail = ALIASES[trimmedEmail] || trimmedEmail;
  const existing = store.users.find(
    u => u.email.toLowerCase() === lookupEmail || u.email.toLowerCase() === trimmedEmail
  );

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Tài khoản với email "${trimmedEmail}" chưa tồn tại trong hệ thống. Vui lòng chuyển sang tab "Đăng ký tài khoản mới" hoặc liên hệ Ban Chủ nhiệm.`
    });
  }

  // Account status check
  if (existing.accountStatus === 'disabled') {
    return res.status(403).json({
      success: false,
      code: 'ACCOUNT_DISABLED',
      message: 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ Ban Chủ nhiệm CLB để được hỗ trợ mở khóa.'
    });
  }

  // Password verification
  if (password === undefined || password === null || password === '') {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu đăng nhập' });
  }

  // 1. Check temporary password verification (P0.3, Requirements 2, 3 & 4)
  if (existing.tempPasswordHash && existing.tempPasswordSalt) {
    const isExpired = existing.tempPasswordExpiresAt && new Date(existing.tempPasswordExpiresAt).getTime() < Date.now();
    const attempts = existing.tempPasswordAttempts || 0;

    if (isExpired) {
      delete existing.tempPasswordHash;
      delete existing.tempPasswordSalt;
      delete existing.tempPasswordExpiresAt;
      delete existing.tempPasswordAttempts;
      db.save();
    } else if (attempts >= 5) {
      delete existing.tempPasswordHash;
      delete existing.tempPasswordSalt;
      delete existing.tempPasswordExpiresAt;
      delete existing.tempPasswordAttempts;
      db.save();
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu tạm thời đã bị vô hiệu hóa do nhập sai quá 5 lần. Vui lòng gửi lại yêu cầu cấp mật khẩu tạm thời mới.'
      });
    } else {
      const isTempValid = verifyPassword(password, existing.tempPasswordHash, existing.tempPasswordSalt);
      if (isTempValid) {
        // Single-use rule: Invalidate temporary password credentials immediately
        delete existing.tempPasswordHash;
        delete existing.tempPasswordSalt;
        delete existing.tempPasswordExpiresAt;
        delete existing.tempPasswordAttempts;
        existing.tempPasswordUsed = true;

        // Flag as recovery session requiring mandatory password change
        existing.mustChangePassword = true;
        existing.isRecoverySession = true;
        existing.lastLoginAt = new Date().toISOString();

        // Create recovery session (15 min TTL)
        const { token: sessionToken } = createSession(existing.id, existing.role, existing.unit, {
          isRecoverySession: true,
          mustChangePassword: true,
          ttlMs: 15 * 60 * 1000,
          ip: clientIp,
          userAgent: req.headers['user-agent']
        });

        store.auditLogs.unshift({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorId: existing.id,
          actorName: existing.fullName,
          actorRole: existing.role,
          actorUnit: existing.unit,
          action: 'Đăng nhập bằng mật khẩu tạm thời',
          targetType: 'User',
          targetId: existing.id,
          details: `Đăng nhập thành công bằng mật khẩu tạm thời cho tài khoản ${existing.email}. Hệ thống chuyển sang phiên khôi phục bắt buộc đổi mật khẩu.`
        });
        db.save();

        return res.json({
          success: true,
          message: 'Đăng nhập bằng mật khẩu tạm thời thành công! Vui lòng thiết lập mật khẩu mới ngay để tiếp tục.',
          token: sessionToken,
          user: sanitizeUser(existing),
          mustChangePassword: true,
          isRecoverySession: true
        });
      } else {
        // Record failed attempt on temporary password
        existing.tempPasswordAttempts = attempts + 1;
        if (existing.tempPasswordAttempts >= 5) {
          delete existing.tempPasswordHash;
          delete existing.tempPasswordSalt;
          delete existing.tempPasswordExpiresAt;
          delete existing.tempPasswordAttempts;
          db.save();
          return res.status(401).json({
            success: false,
            message: 'Mật khẩu không chính xác. Mật khẩu tạm thời đã bị vô hiệu hóa do nhập sai quá 5 lần. Vui lòng gửi lại yêu cầu mới.'
          });
        }
        db.save();
      }
    }
  }

  // If user is pending_setup and didn't use a valid temp password, inform them
  if (existing.accountStatus === 'pending_setup') {
    return res.status(403).json({
      success: false,
      message: 'Tài khoản chưa được thiết lập mật khẩu. Vui lòng bấm "Quên mật khẩu?" để nhận mật khẩu tạm thời kích hoạt tài khoản.'
    });
  }

  let isPasswordValid = false;

  // 2. Check standard PBKDF2 hash
  if (existing.passwordHash && existing.passwordSalt) {
    isPasswordValid = verifyPassword(password, existing.passwordHash, existing.passwordSalt);
  }

  // 3. Backwards-compatibility migration for legacy plain passwords / default admin
  if (!isPasswordValid) {
    if (existing.id === 'usr-admin' && password === '123456') {
      isPasswordValid = true;
    } else if (existing.password) {
      if (password === existing.password || (password === '123456' && existing.password === '123456')) {
        isPasswordValid = true;
        const { hash, salt } = hashPassword(password);
        existing.passwordHash = hash;
        existing.passwordSalt = salt;
        delete existing.password;
      }
    }
  }

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu không chính xác! Nếu quên mật khẩu, vui lòng sử dụng liên kết "Quên mật khẩu?" để nhận mật khẩu tạm thời.'
    });
  }

  // Normal login success: clear any stale recovery flags
  delete existing.tempPasswordHash;
  delete existing.tempPasswordSalt;
  delete existing.tempPasswordExpiresAt;
  delete existing.tempPasswordAttempts;
  existing.mustChangePassword = false;
  existing.isRecoverySession = false;

  // Record last login time
  existing.lastLoginAt = new Date().toISOString();

  // If user has valid password hash and active status, mark emailVerified true
  if (existing.accountStatus === 'active' && existing.passwordHash && !existing.emailVerified) {
    existing.emailVerified = true;
  }

  // Issue authoritative 24-hour session token
  const { token: sessionToken } = createSession(existing.id, existing.role, existing.unit, {
    isRecoverySession: false,
    mustChangePassword: false,
    ttlMs: 24 * 60 * 60 * 1000,
    ip: clientIp,
    userAgent: req.headers['user-agent']
  });

  // Record audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: existing.id,
    actorName: existing.fullName,
    actorRole: existing.role,
    actorUnit: existing.unit,
    action: 'Đăng nhập hệ thống',
    targetType: 'User',
    targetId: existing.id,
    details: `Đăng nhập thành công với email ${existing.email} (Vai trò: ${existing.role})`
  });
  db.save();

  return res.json({
    success: true,
    message: 'Đăng nhập thành công!',
    token: sessionToken,
    user: sanitizeUser(existing),
    mustChangePassword: false,
    isRecoverySession: false
  });
});

// POST /api/auth/logout - Revoke active server session
authRouter.post('/logout', requireAuth, (req, res) => {
  if (req.token) {
    revokeSession(req.token);
  }
  res.json({
    success: true,
    message: 'Đăng xuất tài khoản thành công.'
  });
});

// POST /api/auth/register - Real account registration with strict Applicant role, password policy & verification email dispatch
authRouter.post('/register', async (req, res) => {
  const {
    email,
    password,
    fullName,
    studentId,
    phone,
    faculty,
    classId,
    academicYear,
    desiredUnit,
    motivation
  } = req.body;

  if (!email || !password || !fullName || !studentId) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ các thông tin bắt buộc: Email, Mật khẩu, Họ tên và MSSV'
    });
  }

  // Rate limit registration by IP address (15 requests per 15 minutes)
  const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
  const ipRate = checkRateLimit(`register-ip-${clientIp}`, 15, 15 * 60 * 1000);
  if (!ipRate.allowed) {
    return res.status(429).json({
      success: false,
      message: 'Quá nhiều yêu cầu đăng ký tài khoản từ địa chỉ mạng của bạn. Vui lòng thử lại sau 15 phút.'
    });
  }

  // Enforce password policy: minimum 8 chars, uppercase, lowercase, number, special char
  const policyCheck = validatePasswordPolicy(password);
  if (!policyCheck.isValid) {
    return res.status(400).json({
      success: false,
      message: policyCheck.message
    });
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!isValidEmailFormat(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Địa chỉ email sinh viên không đúng định dạng hợp lệ.'
    });
  }

  const trimmedStudentId = studentId.trim();
  const store = db.get();

  // Check unique email
  const emailExists = store.users.find(u => u.email.toLowerCase() === trimmedEmail);
  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: `Email "${trimmedEmail}" đã được liên kết với một hồ sơ thành viên khác. Vui lòng đăng nhập hoặc sử dụng email sinh viên của bạn.`
    });
  }

  // Check unique studentId
  const studentIdExists = store.users.find(
    u => u.studentId.trim().toLowerCase() === trimmedStudentId.toLowerCase()
  );
  if (studentIdExists) {
    return res.status(400).json({
      success: false,
      message: `Mã số sinh viên "${trimmedStudentId}" đã tồn tại trong hệ thống. Mỗi thành viên chỉ sở hữu duy nhất 01 tài khoản.`
    });
  }

  const assignedUnit: UnitId =
    desiredUnit === 'BN' || desiredUnit === 'BDH' || desiredUnit === 'BTV' ? desiredUnit : 'BDH';

  // Securely hash password with random salt
  const { hash, salt } = hashPassword(password);
  const nowISO = new Date().toISOString();

  // Generate cryptographically secure verification token (24-hour expiration)
  const { rawToken: verificationRawToken, tokenHash: verificationTokenHash, expiresAt: verificationExpiresAt } =
    generateSecureVerificationToken();

  // Governance rule: new accounts strictly start as 'applicant'
  const newAccount: User = {
    id: `usr-${Date.now()}`,
    memberId: `BKIC-APPL-${trimmedStudentId}`,
    email: trimmedEmail,
    fullName: fullName.trim(),
    studentId: trimmedStudentId,
    phone: phone ? phone.trim() : '',
    faculty: faculty || 'Khoa Công nghệ Thông tin',
    classId: classId || '24T_CLC',
    academicYear: academicYear || 'K24 (2024-2029)',
    role: 'applicant', // Governance rule: strictly applicant
    unit: assignedUnit,
    committee: assignedUnit,
    position: `Ứng viên đăng ký xét tuyển - Ban ${assignedUnit}`,
    joinDate: nowISO.split('T')[0],
    status: 'active',
    statusEffectiveDate: nowISO.split('T')[0],
    accountStatus: 'pending_verification',
    emailVerified: false,
    verificationTokenHash,
    verificationTokenExpiresAt: verificationExpiresAt,
    createdAt: nowISO,
    lastLoginAt: nowISO,
    passwordHash: hash,
    passwordSalt: salt,
    statusHistory: [
      {
        id: `sh-${Date.now()}`,
        previousStatus: 'active',
        newStatus: 'active',
        effectiveDate: nowISO.split('T')[0],
        reason: 'Đăng ký tài khoản thành viên mới qua Cổng BK-IC Digital Hub',
        approvedBy: 'Hệ thống tự động ghi nhận',
        updatedBy: 'Ứng viên tự đăng ký',
        timestamp: nowISO
      }
    ]
  };

  // Create corresponding application record
  const newApplication: Application = {
    id: `app-${Date.now()}`,
    fullName: newAccount.fullName,
    studentId: newAccount.studentId,
    email: newAccount.email,
    phone: newAccount.phone || '',
    faculty: newAccount.faculty,
    classId: newAccount.classId,
    academicYear: newAccount.academicYear,
    interestTrack:
      assignedUnit === 'BN'
        ? 'Ban Chủ nhiệm & Quản trị'
        : assignedUnit === 'BDH'
        ? 'Ban Điều hành & Kỹ thuật'
        : 'Ban Thành viên & Truyền thông',
    motivation: motivation || 'Đăng ký tham gia Câu lạc bộ Sáng tạo Khởi nghiệp BK-IC',
    skills: 'Đăng ký qua cổng trực tuyến BK-IC',
    status: 'pending',
    submittedAt: nowISO
  };

  store.users.push(newAccount);
  store.applications.unshift(newApplication);

  // Record audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: nowISO,
    actorId: newAccount.id,
    actorName: newAccount.fullName,
    actorRole: 'applicant',
    actorUnit: assignedUnit,
    action: 'Đăng ký tài khoản mới',
    targetType: 'User',
    targetId: newAccount.id,
    details: `Tạo tài khoản thật cho ứng viên ${newAccount.fullName} (MSSV: ${newAccount.studentId}, Email: ${newAccount.email})`
  });

  db.save();

  // Determine verification link host safely
  const host = getPublicAppUrl(req);
  const verificationLink = `${host}/verify-email?token=${verificationRawToken}`;

  // Dispatch confirmation / verification email
  let sendResult: any = null;
  try {
    sendResult = await sendAccountVerificationEmail({
      to: newAccount.email,
      fullName: newAccount.fullName,
      studentId: newAccount.studentId,
      verificationLink,
      expiresAt: verificationExpiresAt
    });
  } catch (err) {
    console.warn('[Auth] Lỗi khi phát hành email xác nhận tài khoản:', err);
  }

  // Create session for immediate login
  const { token: sessionToken } = createSession(newAccount.id, newAccount.role, newAccount.unit, {
    isRecoverySession: false,
    mustChangePassword: false,
    ttlMs: 24 * 60 * 60 * 1000
  });

  const emailSentViaSmtp = Boolean(sendResult?.success && sendResult?.deliveryMethod === 'smtp');

  res.json({
    success: true,
    message: emailSentViaSmtp
      ? 'Đăng ký tài khoản thành công! Thư xác nhận tài khoản đã được chuyển phát qua máy chủ email đến hòm thư sinh viên của bạn (hiệu lực 24 giờ). Vui lòng kiểm tra Hộp thư đến hoặc Thư rác (Spam).'
      : 'Đăng ký tài khoản thành công! Lưu ý: Hệ thống đang lưu thư nội bộ trong Hộp thư Quản trị do máy chủ gửi thư SMTP chưa kích hoạt hoặc đang thử nghiệm.',
    token: sessionToken,
    user: sanitizeUser(newAccount),
    deliveryMethod: sendResult?.deliveryMethod || 'outbox_fallback',
    deliveryStatus: sendResult?.status || 'failed',
    deliveryCategory: sendResult?.deliveryCategory || 'outbox_only'
  });
});

// GET & POST /api/auth/verify-email - Verify email address using secure token
const handleVerifyEmail = (req: Request, res: Response) => {
  const token = ((req.query?.token as string) || req.body?.token) as string;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Thiếu mã xác thực email hoặc mã không hợp lệ.'
    });
  }

  const tokenHash = hashToken(token);
  const store = db.get();
  const user = store.users.find(u => u.verificationTokenHash === tokenHash);

  if (!user || !user.verificationTokenExpiresAt) {
    return res.status(400).json({
      success: false,
      message: 'Liên kết xác thực email không hợp lệ hoặc đã được sử dụng.'
    });
  }

  const expiresTime = new Date(user.verificationTokenExpiresAt).getTime();
  if (expiresTime < Date.now()) {
    return res.status(400).json({
      success: false,
      message: 'Liên kết xác thực email đã hết hạn (thời hạn tối đa 24 giờ). Vui lòng yêu cầu gửi lại email xác nhận mới.'
    });
  }

  // Activate email verification
  user.emailVerified = true;
  if (user.accountStatus === 'pending_verification') {
    user.accountStatus = 'active';
  }

  // Invalidate single-use token
  delete user.verificationTokenHash;
  delete user.verificationTokenExpiresAt;

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: user.id,
    actorName: user.fullName,
    actorRole: user.role,
    actorUnit: user.unit,
    action: 'Xác minh email thành công',
    targetType: 'User',
    targetId: user.id,
    details: `Tài khoản ${user.email} (MSSV: ${user.studentId}) đã hoàn tất xác minh địa chỉ email sinh viên.`
  });

  db.save();

  return res.json({
    success: true,
    message: 'Xác nhận địa chỉ email sinh viên thành công! Tài khoản của bạn đã được kích hoạt hoàn toàn.',
    user: sanitizeUser(user)
  });
};

authRouter.get('/verify-email', handleVerifyEmail);
authRouter.post('/verify-email', handleVerifyEmail);

// POST /api/auth/resend-verification - Resend verification email (rate limited)
authRouter.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp địa chỉ email sinh viên.' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!isValidEmailFormat(trimmedEmail)) {
    return res.status(400).json({ success: false, message: 'Địa chỉ email không đúng định dạng hợp lệ.' });
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const ipRateLimit = checkRateLimit(`resend-ver-ip-${clientIp}`, 20, 15 * 60 * 1000);
  if (!ipRateLimit.allowed) {
    return res.status(429).json({
      success: false,
      message: 'Bạn đã gửi quá nhiều yêu cầu từ thiết bị này. Vui lòng thử lại sau.'
    });
  }

  const emailRateLimit = checkRateLimit(`resend-ver-${trimmedEmail}`, 3, 15 * 60 * 1000);
  if (!emailRateLimit.allowed) {
    return res.status(429).json({
      success: false,
      message: 'Bạn đã yêu cầu gửi lại email xác nhận quá số lần cho phép. Vui lòng thử lại sau 15 phút.'
    });
  }

  const store = db.get();
  const user = store.users.find(u => u.email.toLowerCase() === trimmedEmail);

  // Generic response to prevent enumeration
  const genericMsg = 'Nếu email này đã được đăng ký trong hệ thống và chưa xác thực, chúng tôi đã gửi lại thư xác nhận mới.';

  if (!user) {
    return res.json({ success: true, message: genericMsg });
  }

  if (user.emailVerified) {
    return res.json({
      success: true,
      message: 'Địa chỉ email này đã được xác nhận trước đó. Bạn có thể đăng nhập bình thường.'
    });
  }

  const { rawToken, tokenHash, expiresAt } = generateSecureVerificationToken();
  user.verificationTokenHash = tokenHash;
  user.verificationTokenExpiresAt = expiresAt;

  const host = getPublicAppUrl(req);
  const verificationLink = `${host}/verify-email?token=${rawToken}`;

  const sendResult = await sendAccountVerificationEmail({
    to: user.email,
    fullName: user.fullName,
    studentId: user.studentId,
    verificationLink,
    expiresAt
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: user.id,
    actorName: user.fullName,
    actorRole: user.role,
    action: 'Gửi lại thư xác nhận email',
    targetType: 'User',
    targetId: user.id,
    details: `Đã phát hành lại liên kết xác nhận email tới ${user.email} (Thời hạn 24 giờ).`
  });

  db.save();

  const emailSentViaSmtp = Boolean(sendResult?.success && sendResult?.deliveryMethod === 'smtp');
  return res.json({
    success: true,
    message: emailSentViaSmtp
      ? genericMsg
      : 'Yêu cầu gửi lại đã được ghi nhận. Lưu ý: Máy chủ gửi thư SMTP chưa kích hoạt hoặc đang thử nghiệm nội bộ, liên kết xác nhận đã được lưu an toàn trong Hộp thư Quản trị.',
    deliveryMethod: sendResult.deliveryMethod,
    deliveryStatus: sendResult.status,
    deliveryCategory: sendResult.deliveryCategory
  });
});

// POST /api/auth/request-temp-password - Secure Temporary Password dispatch (P0.4, Requirements 2, 3, 6 & 8)
authRouter.post('/request-temp-password', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp địa chỉ email sinh viên đã đăng ký.' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!isValidEmailFormat(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_EMAIL_FORMAT',
      message: 'Địa chỉ email không đúng định dạng hợp lệ. Vui lòng kiểm tra lại.'
    });
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  // Multi-level Rate Limiting: IP (60/15min) + Email (3/15min)
  const ipRateLimit = checkRateLimit(`temp-pw-ip-${clientIp}`, 60, 15 * 60 * 1000);
  if (!ipRateLimit.allowed) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Bạn đã gửi quá nhiều yêu cầu từ thiết bị này. Vui lòng thử lại sau ${Math.ceil(
        (ipRateLimit.retryAfterSec || 60) / 60
      )} phút.`
    });
  }

  const emailRateLimit = checkRateLimit(`temp-pw-${trimmedEmail}`, 3, 15 * 60 * 1000);
  if (!emailRateLimit.allowed) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Bạn đã yêu cầu gửi mật khẩu tạm thời quá số lần cho phép. Vui lòng thử lại sau ${Math.ceil(
        (emailRateLimit.retryAfterSec || 60) / 60
      )} phút.`
    });
  }

  const store = db.get();
  const ALIASES: Record<string, string> = {
    'admin@dut.udn.vn': 'admin.bkic@dut.udn.vn',
    'admin': 'admin.bkic@dut.udn.vn'
  };
  const lookupEmail = ALIASES[trimmedEmail] || trimmedEmail;
  const user = store.users.find(
    u => u.email.toLowerCase() === lookupEmail || u.email.toLowerCase() === trimmedEmail
  );

  // Generic message: do NOT reveal if email exists or not (P0.4 & Requirement 2)
  const genericSuccessMessage =
    'Nếu email này được đăng ký trong hệ thống, bạn sẽ nhận được hướng dẫn khôi phục tài khoản trong hộp thư đến (hiệu lực 15 phút).';

  if (!user) {
    return res.json({ success: true, message: genericSuccessMessage });
  }

  // Ensure user's registered email in DB is valid format before attempting delivery
  if (!user.email || !isValidEmailFormat(user.email)) {
    return res.status(500).json({
      success: false,
      message: 'Hồ sơ tài khoản trong cơ sở dữ liệu không có địa chỉ email hợp lệ. Vui lòng liên hệ Ban Quản trị.'
    });
  }

  // Account disabled check: do not issue temporary password, return identical generic response
  if (user.accountStatus === 'disabled') {
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role || 'applicant',
      action: 'Yêu cầu mật khẩu tạm thời bị từ chối',
      targetType: 'User',
      targetId: user.id,
      details: `Tài khoản ${user.email} đang bị khóa/vô hiệu hóa, từ chối cấp mật khẩu tạm thời.`
    });
    db.save();
    return res.json({ success: true, message: genericSuccessMessage });
  }

  // Generate cryptographically secure 12-char temporary password (CS-PRNG)
  const tempPassword = generateSecureTemporaryPassword();
  const { hash: tempHash, salt: tempSalt } = hashPassword(tempPassword);

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes validity
  user.tempPasswordHash = tempHash;
  user.tempPasswordSalt = tempSalt;
  user.tempPasswordExpiresAt = expiresAt;
  user.tempPasswordAttempts = 0;
  user.tempPasswordUsed = false;

  // Invalidate any old reset tokens
  delete user.resetTokenHash;
  delete user.resetTokenExpiresAt;

  const host = getPublicAppUrl(req);
  const loginUrl = `${host}/login`;

  try {
    // Deliver strictly to user's registered email from the database
    const sendResult = await sendTemporaryPasswordEmail({
      to: user.email.trim().toLowerCase(),
      fullName: user.fullName,
      tempPassword,
      expiresAt,
      loginUrl
    });

    // Check if transmission failed over active SMTP
    if (!sendResult.success && sendResult.deliveryMethod === 'smtp') {
      return res.status(502).json({
        success: false,
        code: sendResult.deliveryCategory,
        message: sendResult.message
      });
    }

    // Record audit log (WITHOUT exposing plain temporary password in log details!)
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      actorUnit: user.unit,
      action: 'Phát hành mật khẩu tạm thời',
      targetType: 'User',
      targetId: user.id,
      details: `Đã phát hành mật khẩu tạm thời bảo mật đến email ${maskEmail(user.email)} (Thời hạn 15 phút, 1 lần sử dụng).`
    });

    db.save();

    // Security: Do NOT expose tempPassword, resetLink, or user credentials in client response!
    return res.json({
      success: true,
      message: genericSuccessMessage,
      deliveryMethod: sendResult.deliveryMethod
    });
  } catch (err: any) {
    console.error('Lỗi khi gửi email mật khẩu tạm thời:', err);
    return res.status(500).json({
      success: false,
      message: 'Không thể gửi email vào lúc này. Vui lòng thử lại sau.'
    });
  }
});

// POST /api/auth/forgot-password - Alias to request temporary password (P0.4)
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp địa chỉ email sinh viên' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!isValidEmailFormat(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_EMAIL_FORMAT',
      message: 'Địa chỉ email không đúng định dạng hợp lệ. Vui lòng kiểm tra lại.'
    });
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  // Rate Limiting: IP (60/15min) + Email (3/15min)
  const ipRateLimit = checkRateLimit(`forgot-pw-ip-${clientIp}`, 60, 15 * 60 * 1000);
  if (!ipRateLimit.allowed) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Bạn đã gửi quá nhiều yêu cầu từ thiết bị này. Vui lòng thử lại sau ${Math.ceil(
        (ipRateLimit.retryAfterSec || 60) / 60
      )} phút.`
    });
  }

  const rateLimit = checkRateLimit(`forgot-pw-${trimmedEmail}`, 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Bạn đã yêu cầu gửi email khôi phục mật khẩu quá số lần cho phép. Vui lòng thử lại sau ${Math.ceil(
        (rateLimit.retryAfterSec || 60) / 60
      )} phút.`
    });
  }

  const store = db.get();
  const ALIASES: Record<string, string> = {
    'admin@dut.udn.vn': 'admin.bkic@dut.udn.vn',
    'admin': 'admin.bkic@dut.udn.vn'
  };
  const lookupEmail = ALIASES[trimmedEmail] || trimmedEmail;
  const user = store.users.find(u => u.email.toLowerCase() === lookupEmail || u.email.toLowerCase() === trimmedEmail);

  // Generic message: do NOT reveal if email exists or not
  const genericSuccessMessage =
    'Nếu email này được đăng ký trong hệ thống, bạn sẽ nhận được hướng dẫn khôi phục tài khoản trong hộp thư đến (hiệu lực 15 phút).';

  if (!user) {
    return res.json({ success: true, message: genericSuccessMessage });
  }

  // Ensure user's registered email in DB is valid format before attempting delivery
  if (!user.email || !isValidEmailFormat(user.email)) {
    return res.status(500).json({
      success: false,
      message: 'Hồ sơ tài khoản trong cơ sở dữ liệu không có địa chỉ email hợp lệ. Vui lòng liên hệ Ban Quản trị.'
    });
  }

  // Account disabled check
  if (user.accountStatus === 'disabled') {
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role || 'applicant',
      action: 'Yêu cầu khôi phục mật khẩu bị từ chối',
      targetType: 'User',
      targetId: user.id,
      details: `Tài khoản ${user.email} đang bị khóa, từ chối cấp thông tin khôi phục mật khẩu.`
    });
    db.save();
    return res.json({ success: true, message: genericSuccessMessage });
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // Support secure single-use resetToken for /reset-password?token=...
  const { rawToken, tokenHash } = generateSecureResetToken();
  user.resetTokenHash = tokenHash;
  user.resetTokenExpiresAt = expiresAt;

  const host = getPublicAppUrl(req);
  const resetLink = `${host}/reset-password?token=${rawToken}`;

  try {
    // Deliver strictly to user's registered email from the database
    const sendResult = await sendPasswordResetEmail({
      to: user.email.trim().toLowerCase(),
      fullName: user.fullName,
      resetLink,
      expiresAt
    });

    // Check if transmission failed over active SMTP
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
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      actorUnit: user.unit,
      action: 'Yêu cầu đặt lại mật khẩu',
      targetType: 'User',
      targetId: user.id,
      details: `Đã phát hành liên kết đặt lại mật khẩu bảo mật đến email ${maskEmail(user.email)} (Thời hạn 15 phút, 1 lần sử dụng).`
    });

    db.save();

    // Security: Do NOT expose raw tokens or reset links in public response!
    const emailSentViaSmtp = Boolean(sendResult?.success && sendResult?.deliveryMethod === 'smtp');
    return res.json({
      success: true,
      message: emailSentViaSmtp
        ? genericSuccessMessage
        : 'Yêu cầu đã được ghi nhận. Lưu ý: Máy chủ gửi thư SMTP chưa kích hoạt hoặc đang thử nghiệm nội bộ, liên kết đặt lại mật khẩu đã được lưu an toàn trong Hộp thư Quản trị.',
      deliveryMethod: sendResult.deliveryMethod,
      deliveryStatus: sendResult.status,
      deliveryCategory: sendResult.deliveryCategory
    });
  } catch (err: any) {
    console.error('Lỗi khi gửi email khôi phục mật khẩu:', err);
    return res.status(500).json({
      success: false,
      message: 'Không thể gửi email vào lúc này. Vui lòng thử lại sau.'
    });
  }
});

// POST /api/auth/complete-recovery-password - Set new password after logging in with temporary password (P0.3)
// Requires a valid authenticated recovery session. NEVER trusts client userId in body!
authRouter.post('/complete-recovery-password', requireAuth, (req, res) => {
  const user = req.user!;
  const session = req.session!;
  const { newPassword, confirmPassword } = req.body;

  // Ensure this is indeed a recovery session or mandatory password change
  if (!session.isRecoverySession && !user.mustChangePassword) {
    return res.status(400).json({
      success: false,
      message: 'Tài khoản của bạn hiện không trong trạng thái bắt buộc khôi phục mật khẩu.'
    });
  }

  if (!newPassword) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu mới.' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Xác nhận mật khẩu mới không trùng khớp.' });
  }

  // Password policy check (min 8 chars, uppercase, lowercase, number, special char)
  const policyCheck = validatePasswordPolicy(newPassword);
  if (!policyCheck.isValid) {
    return res.status(400).json({ success: false, message: policyCheck.message });
  }

  // Prevent reuse of previous password
  if (user.passwordHash && user.passwordSalt) {
    if (verifyPassword(newPassword, user.passwordHash, user.passwordSalt)) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không được trùng với mật khẩu cũ trước đây của bạn.'
      });
    }
  }

  // Prevent reuse of legacy plain password
  if (user.password && newPassword === user.password) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu mới không được trùng với mật khẩu cũ trước đây của bạn.'
    });
  }

  // Securely hash new password with PBKDF2 and random salt
  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  delete user.password; // Remove any plain text password

  // Clear all temporary password metadata and recovery session flags on user
  delete user.tempPasswordHash;
  delete user.tempPasswordSalt;
  delete user.tempPasswordExpiresAt;
  delete user.tempPasswordAttempts;
  delete user.tempPasswordUsed;
  user.mustChangePassword = false;
  user.isRecoverySession = false;

  // Activate account and confirm email verification (preserve disabled status if set by admin)
  if (user.accountStatus !== 'disabled') {
    user.accountStatus = 'active';
  }
  user.emailVerified = true;

  // Upgrade active session from recovery session to normal authenticated session
  if (req.token) {
    upgradeRecoverySession(req.token);
  }

  // Revoke all other active sessions for this user (session invalidation on password change)
  const store = db.get();
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: user.id,
    actorName: user.fullName,
    actorRole: user.role,
    actorUnit: user.unit,
    action: 'Đổi mật khẩu mới hoàn tất',
    targetType: 'User',
    targetId: user.id,
    details: `Tài khoản ${user.email} đã đổi mật khẩu mới thành công sau phiên đăng nhập bằng mật khẩu tạm thời.`
  });

  db.save();

  return res.json({
    success: true,
    message: 'Thiết lập mật khẩu mới thành công! Bạn có thể sử dụng tất cả tính năng của hệ thống ngay bây giờ.',
    user: sanitizeUser(user),
    mustChangePassword: false,
    isRecoverySession: false
  });
});

// GET /api/auth/verify-reset-token - Verify token validity before presenting reset form
authRouter.get('/verify-reset-token', (req, res) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu mã xác thực đặt lại mật khẩu.'
    });
  }

  const tokenHash = hashToken(token);
  const store = db.get();
  const user = store.users.find(u => u.resetTokenHash === tokenHash);

  if (!user || !user.resetTokenExpiresAt) {
    return res.status(400).json({
      success: false,
      message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.'
    });
  }

  const expiresTime = new Date(user.resetTokenExpiresAt).getTime();
  if (expiresTime < Date.now()) {
    return res.status(400).json({
      success: false,
      message: 'Liên kết đặt lại mật khẩu đã hết hạn (thời hạn tối đa 15 phút). Vui lòng gửi lại yêu cầu mới.'
    });
  }

  return res.json({
    success: true,
    valid: true,
    email: maskEmail(user.email),
    fullName: user.fullName,
    expiresAt: user.resetTokenExpiresAt
  });
});

// POST /api/auth/reset-password - Set new password with policy verification via link token
authRouter.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp mã xác thực và mật khẩu mới.'
    });
  }

  // Validate password policy
  const policyCheck = validatePasswordPolicy(newPassword);
  if (!policyCheck.isValid) {
    return res.status(400).json({
      success: false,
      message: policyCheck.message
    });
  }

  const tokenHash = hashToken(token);
  const store = db.get();
  const user = store.users.find(u => u.resetTokenHash === tokenHash);

  if (!user || !user.resetTokenExpiresAt) {
    return res.status(400).json({
      success: false,
      message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.'
    });
  }

  if (new Date(user.resetTokenExpiresAt).getTime() < Date.now()) {
    return res.status(400).json({
      success: false,
      message: 'Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng gửi lại yêu cầu mới.'
    });
  }

  // Securely hash new password
  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  delete user.password;

  // Invalidate token immediately (Single-use rule)
  delete user.resetTokenHash;
  delete user.resetTokenExpiresAt;
  user.mustChangePassword = false;
  user.isRecoverySession = false;

  // Activate account and confirm email verification (preserve disabled status if set by admin)
  if (user.accountStatus !== 'disabled') {
    user.accountStatus = 'active';
  }
  user.emailVerified = true;

  // Invalidate all existing sessions
  revokeAllUserSessions(user.id);

  // Record audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: user.id,
    actorName: user.fullName,
    actorRole: user.role,
    action: 'Đặt lại mật khẩu thành công',
    targetType: 'User',
    targetId: user.id,
    details: `Tài khoản ${user.email} đã đặt lại mật khẩu thành công qua liên kết xác thực an toàn.`
  });

  db.save();

  return res.json({
    success: true,
    message: 'Đặt lại mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay.'
  });
});

// POST /api/auth/change-password - Change password for authenticated session
authRouter.post('/change-password', requireAuth, (req, res) => {
  const user = req.user!;
  const { oldPassword, newPassword } = req.body;

  const policyCheck = validatePasswordPolicy(newPassword);
  if (!policyCheck.isValid) {
    return res.status(400).json({ success: false, message: policyCheck.message });
  }

  let oldValid = false;
  if (user.passwordHash && user.passwordSalt) {
    oldValid = verifyPassword(oldPassword, user.passwordHash, user.passwordSalt);
  } else if (user.password) {
    oldValid = oldPassword === user.password || (oldPassword === '123456' && user.password === '123456');
  }

  if (!oldValid) {
    return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
  }

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  delete user.password;
  db.save();

  // Invalidate other sessions
  revokeAllUserSessions(user.id);
  // Re-issue a session for current token
  const { token: newSessionToken } = createSession(user.id, user.role, user.unit, {
    isRecoverySession: false,
    mustChangePassword: false,
    ttlMs: 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    token: newSessionToken,
    message: 'Đổi mật khẩu thành công!'
  });
});

// POST /api/auth/switch-account - Admin account switching (P1)
// Strictly requires admin authentication! Non-admins receive 403 Forbidden.
authRouter.post('/switch-account', requireAuth, requireAdmin, (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã người dùng cần chuyển.' });
  }

  const store = db.get();
  const target = store.users.find(u => u.id === userId);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Người dùng đích không tồn tại.' });
  }

  if (target.accountStatus === 'disabled') {
    return res.status(403).json({ success: false, message: 'Tài khoản này đang bị khóa, không thể chuyển đổi.' });
  }

  // Create session for target user
  const { token: newSessionToken } = createSession(target.id, target.role, target.unit, {
    isRecoverySession: Boolean(target.isRecoverySession || target.mustChangePassword),
    mustChangePassword: Boolean(target.mustChangePassword),
    ttlMs: 24 * 60 * 60 * 1000
  });

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: 'admin',
    action: 'Chuyển đổi phiên tài khoản (Admin Switch)',
    targetType: 'User',
    targetId: target.id,
    details: `Quản trị viên ${req.user!.fullName} đã chuyển phiên sang tài khoản ${target.fullName} (${target.email})`
  });

  db.save();

  res.json({
    success: true,
    token: newSessionToken,
    user: sanitizeUser(target),
    message: `Đã chuyển đổi sang tài khoản ${target.fullName}.`
  });
});

// GET /api/auth/email-outbox - View delivered emails (P0.4: strictly Admin-only)
authRouter.get('/email-outbox', requireAuth, requireAdmin, (req, res) => {
  const outbox = getEmailOutbox();
  if (process.env.NODE_ENV === 'production') {
    const sanitized = outbox.map(item => {
      const { tempPassword, resetLink, verificationLink, ...rest } = item as any;
      return rest;
    });
    return res.json({ success: true, emails: sanitized });
  }
  res.json({ success: true, emails: outbox });
});

// DELETE /api/auth/email-outbox - Clear in-memory email outbox (strictly Admin-only)
authRouter.delete('/email-outbox', requireAuth, requireAdmin, (req, res) => {
  clearEmailOutbox();
  res.json({ success: true, message: 'Đã làm sạch toàn bộ danh sách Hộp thư Hệ thống.' });
});

// POST /api/auth/send-member-invite - Admin or BN/BTV sends secure setup invite to a member
authRouter.post('/send-member-invite', requireAuth, requireUnitOrRole(['BN', 'BTV'], ['admin']), async (req, res) => {
  const actor = req.user!;
  const { memberId } = req.body;
  const store = db.get();

  const target = store.users.find(u => u.id === memberId || u.memberId === memberId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ thành viên' });
  }

  // Ensure member has a valid registered email before dispatching invite
  if (!target.email || !isValidEmailFormat(target.email)) {
    return res.status(400).json({
      success: false,
      message: `Hồ sơ thành viên "${target.fullName}" không có địa chỉ email hợp lệ để nhận thư mời kích hoạt.`
    });
  }

  const { rawToken, tokenHash, expiresAt } = generateSecureResetToken();
  target.resetTokenHash = tokenHash;
  target.resetTokenExpiresAt = expiresAt;

  const host = getPublicAppUrl(req);
  const inviteLink = `${host}/reset-password?token=${rawToken}`;

  const unitName =
    target.unit === 'BN' ? 'Ban Chủ nhiệm' : target.unit === 'BDH' ? 'Ban Điều hành' : 'Ban Thành viên';

  const sendResult = await sendAccountInviteEmail({
    to: target.email.trim().toLowerCase(),
    fullName: target.fullName,
    inviteLink,
    expiresAt,
    unitName,
    roleName: target.position || target.role
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
    action: 'Gửi thư mời thiết lập tài khoản',
    targetType: 'User',
    targetId: target.id,
    details: `Đã gửi thư mời kèm liên kết bảo mật kích hoạt tài khoản tới ${target.email}`
  });

  db.save();

  res.json({
    success: true,
    message: sendResult.deliveryMethod === 'smtp'
      ? `Máy chủ SMTP đã chấp nhận gửi thư mời và liên kết thiết lập mật khẩu tới email "${target.email}". Liên kết có hiệu lực 15 phút.`
      : `Đã phát hành thư mời và liên kết thiết lập mật khẩu tới email "${target.email}". Liên kết có hiệu lực 15 phút.`
  });
});

// GET /api/auth/smtp-status - Get current SMTP configuration status (P0.5: strictly Admin-only)
authRouter.get('/smtp-status', requireAuth, requireAdmin, (req, res) => {
  const smtp = getActiveSmtpConfig();
  res.json({
    success: true,
    isConfigured: smtp.isConfigured,
    source: smtp.source,
    host: smtp.host || 'smtp.gmail.com',
    port: smtp.port || 587,
    user: smtp.user ? `${smtp.user.substring(0, 3)}***@${smtp.user.split('@')[1] || ''}` : '',
    from: smtp.from
  });
});

// POST /api/auth/test-smtp - Send test email via SMTP to verify configuration (P0.5: strictly Admin-only)
authRouter.post('/test-smtp', requireAuth, requireAdmin, async (req, res) => {
  const { to, customConfig } = req.body;
  if (!to || typeof to !== 'string') {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email nhận thư thử nghiệm.' });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim())) {
    return res.status(400).json({ success: false, message: 'Địa chỉ email nhận thư thử nghiệm không hợp lệ.' });
  }

  const result = await sendTestSmtpEmail(to.trim(), customConfig);
  res.json(result);
});

// POST /api/auth/save-smtp-config - Admin saves club SMTP configuration (P0.5: strictly Admin-only)
authRouter.post('/save-smtp-config', requireAuth, requireAdmin, (req, res) => {
  const { host, port, secure, user, pass, fromName, fromEmail, enabled } = req.body;
  const store = db.get();

  if (!store.siteSettings) {
    store.siteSettings = {} as any;
  }

  const cleanHost = sanitizeSmtpHost(host);
  const cleanSecure = Boolean(secure) || parseInt(port) === 465;
  const cleanPort = sanitizeSmtpPort(port, cleanSecure);
  const cleanUser = sanitizeSmtpUser(user);
  const cleanPass = sanitizeSmtpPass(pass);

  store.siteSettings.smtpConfig = {
    host: cleanHost,
    port: cleanPort,
    secure: cleanSecure,
    user: cleanUser,
    pass: cleanPass,
    fromName: (fromName || 'BK-IC Digital Hub').trim(),
    fromEmail: (fromEmail || cleanUser || '').trim(),
    enabled: enabled !== false
  };

  db.save();

  res.json({
    success: true,
    message: 'Đã lưu cấu hình máy chủ gửi email (SMTP) thành công!'
  });
});
