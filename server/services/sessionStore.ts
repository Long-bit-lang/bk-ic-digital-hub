// Cryptographically Secure Server-Authoritative Session Store
import crypto from 'crypto';
import type { UserRole, UnitId } from '../../src/types/index.ts';

export interface AuthSession {
  tokenHash: string;
  userId: string;
  role: UserRole;
  unit?: UnitId;
  createdAt: number;
  expiresAt: number;
  isRecoverySession: boolean;
  mustChangePassword: boolean;
  ip?: string;
  userAgent?: string;
}

// In-memory session store indexed by tokenHash (SHA-256)
const sessions = new Map<string, AuthSession>();

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function createSession(
  userId: string,
  role: UserRole,
  unit?: UnitId,
  options: {
    isRecoverySession?: boolean;
    mustChangePassword?: boolean;
    ttlMs?: number;
    ip?: string;
    userAgent?: string;
  } = {}
): { token: string; session: AuthSession } {
  // Generate 256-bit cryptographically secure raw token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);

  const now = Date.now();
  // Default TTL: 15 minutes for recovery session, 24 hours for normal session
  const defaultTtl = options.isRecoverySession ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const ttlMs = options.ttlMs || defaultTtl;

  const session: AuthSession = {
    tokenHash,
    userId,
    role,
    unit,
    createdAt: now,
    expiresAt: now + ttlMs,
    isRecoverySession: Boolean(options.isRecoverySession),
    mustChangePassword: Boolean(options.mustChangePassword),
    ip: options.ip,
    userAgent: options.userAgent
  };

  sessions.set(tokenHash, session);
  return { token: rawToken, session };
}

export function getSession(rawToken: string): AuthSession | null {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const tokenHash = hashToken(rawToken);
  const session = sessions.get(tokenHash);

  if (!session) return null;

  // Check expiration
  if (Date.now() > session.expiresAt) {
    sessions.delete(tokenHash);
    return null;
  }

  return session;
}

export function revokeSession(rawToken: string): boolean {
  if (!rawToken) return false;
  const tokenHash = hashToken(rawToken);
  return sessions.delete(tokenHash);
}

export function revokeAllUserSessions(userId: string): number {
  let count = 0;
  for (const [hash, session] of sessions.entries()) {
    if (session.userId === userId) {
      sessions.delete(hash);
      count++;
    }
  }
  return count;
}

export function upgradeRecoverySession(rawToken: string): AuthSession | null {
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);
  const session = sessions.get(tokenHash);
  if (!session) return null;

  session.isRecoverySession = false;
  session.mustChangePassword = false;
  // Extend expiration to standard 24 hours
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return session;
}

// Periodic cleanup of expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [hash, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(hash);
    }
  }
}, 10 * 60 * 1000);
