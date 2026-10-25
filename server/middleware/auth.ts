// Centralized Authentication and Role-Based Access Control (RBAC) Middleware
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db.ts';
import { getSession, type AuthSession } from '../services/sessionStore.ts';
import type { User, UserRole, UnitId } from '../../src/types/index.ts';

// Augment Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: AuthSession;
      token?: string;
    }
  }
}

/**
 * Global authentication resolver middleware.
 * Inspects Authorization: Bearer <token> or x-auth-token.
 * Completely disables untrusted x-user-id spoofing!
 */
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let rawToken: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    rawToken = authHeader.slice(7).trim();
  } else if (req.headers['x-auth-token']) {
    rawToken = (req.headers['x-auth-token'] as string).trim();
  }

  if (rawToken) {
    const session = getSession(rawToken);
    if (session) {
      const store = db.get();
      const user = store.users.find(u => u.id === session.userId);

      if (user) {
        if (user.accountStatus === 'disabled') {
          return res.status(403).json({
            success: false,
            code: 'ACCOUNT_DISABLED',
            message: 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ Ban Chủ nhiệm.'
          });
        }

        // Strict verification: If x-user-id header is provided, it MUST match authenticated user identity
        const clientUserId = req.headers['x-user-id'] as string;
        if (clientUserId && clientUserId !== user.id) {
          return res.status(403).json({
            success: false,
            code: 'IDENTITY_SPOOF_DETECTED',
            message: 'Danh tính x-user-id gửi kèm không khớp với phiên làm việc đã xác thực.'
          });
        }

        req.user = user;
        req.session = session;
        req.token = rawToken;
      }
    }
  }

  next();
}

/**
 * Strict authentication requirement middleware.
 * Returns 401 Unauthorized if no valid session/user is authenticated.
 * NO fallback to Admin under any circumstances.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.session) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Yêu cầu đăng nhập hợp lệ để truy cập tài nguyên này.'
    });
  }
  next();
}

/**
 * Enforce normal authenticated session.
 * Blocks any business endpoints if the user is in a temporary password recovery session.
 */
export function requireNormalSession(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.session) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Yêu cầu đăng nhập hợp lệ.'
    });
  }

  if (req.session.isRecoverySession || req.user.mustChangePassword) {
    return res.status(403).json({
      success: false,
      code: 'MUST_CHANGE_PASSWORD',
      message:
        'Bạn đang trong phiên đăng nhập khôi phục bằng mật khẩu tạm thời. Vui lòng hoàn tất việc đặt mật khẩu mới trước khi truy cập bất kỳ tính năng nghiệp vụ nào của hệ thống.'
    });
  }

  next();
}

/**
 * Role-based access control middleware.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Yêu cầu đăng nhập để truy cập tài nguyên này.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền thực hiện thao tác này.'
      });
    }

    next();
  };
}

/**
 * Admin-only access middleware.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Yêu cầu đăng nhập để thực hiện thao tác này.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN',
      message: 'Thao tác chỉ dành riêng cho Quản trị viên hệ thống (Admin).'
    });
  }

  next();
}

/**
 * Unit or Role based access control middleware (e.g. BN, BDH, BTV or specific roles).
 */
export function requireUnitOrRole(units: UnitId[], roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Yêu cầu đăng nhập để truy cập tài nguyên này.'
      });
    }

    const hasRole = roles.includes(req.user.role);
    const hasUnit = req.user.unit ? units.includes(req.user.unit) : false;

    if (!hasRole && !hasUnit) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'Bạn không thuộc đơn vị hoặc không có vai trò phù hợp để thực hiện thao tác này.'
      });
    }

    next();
  };
}
