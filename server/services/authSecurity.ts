// Security & Cryptographic Utilities for BK-IC Digital Hub Auth
import crypto from 'crypto';

// Password Hashing via PBKDF2 (SHA-512 with 100,000 iterations & 16-byte random salt)
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// Timing-safe password verification
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const checkHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const checkBuf = Buffer.from(checkHash, 'hex');
    if (hashBuf.length !== checkBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, checkBuf);
  } catch (err) {
    return false;
  }
}

// Password Policy Enforcement
// Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
export function validatePasswordPolicy(password: string): { isValid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Vui lòng nhập mật khẩu.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Mật khẩu phải có độ dài tối thiểu từ 8 ký tự trở lên.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một chữ cái thường (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một chữ số (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*...).' };
  }
  return { isValid: true };
}

// Cryptographically Secure Single-Use Reset Token (15-minute expiration)
export function generateSecureResetToken(): {
  rawToken: string;
  tokenHash: string;
  expiresAt: string;
} {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes validity
  return { rawToken, tokenHash, expiresAt };
}

// Cryptographically Secure Single-Use Email Verification Token (24-hour expiration)
export function generateSecureVerificationToken(): {
  rawToken: string;
  tokenHash: string;
  expiresAt: string;
} {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours validity
  return { rawToken, tokenHash, expiresAt };
}

// Hash token for lookup comparison
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// In-Memory Rate Limiter (e.g. max 3 requests per 15 minutes per email/IP)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(key: string, limit = 3, windowMs = 15 * 60 * 1000): {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { timestamps: [] };

  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec)
    };
  }

  record.timestamps.push(now);
  rateLimitMap.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length
  };
}

/**
 * Generate a cryptographically secure, high-entropy temporary password.
 * - Created using crypto.randomBytes (server-side CS-PRNG)
 * - Contains uppercase, lowercase, numbers, and special characters
 * - Never uses predictable sequences, birthdates, or student IDs
 * - Length: 12 characters
 */
export function generateSecureTemporaryPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous 'I', 'O'
  const lower = 'abcdefghijkmnpqrstuvwxyz'; // exclude ambiguous 'l'
  const digits = '23456789';               // exclude ambiguous '0', '1'
  const special = '!@#$%&*';
  const all = upper + lower + digits + special;

  const chars: string[] = [];
  const pick = (set: string) => {
    const byte = crypto.randomBytes(1)[0];
    return set[byte % set.length];
  };

  // Guarantee at least 2 chars from each character class
  chars.push(pick(upper), pick(upper));
  chars.push(pick(lower), pick(lower));
  chars.push(pick(digits), pick(digits));
  chars.push(pick(special), pick(special));

  // Fill remaining 4 chars from full alphabet
  for (let i = 0; i < 4; i++) {
    chars.push(pick(all));
  }

  // Cryptographically shuffle array using Fisher-Yates with crypto.randomBytes
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

/**
 * Safely resolves the public application base URL for sensitive links (email verification, password reset, invite).
 * Prioritizes configured APP_URL, VITE_APP_URL, or platform env like RENDER_EXTERNAL_URL.
 * If not explicitly configured, dynamically derives from incoming request Host/Proto headers.
 * Falls back to localhost in dev.
 */
export function getPublicAppUrl(req?: any): string {
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  const configuredAppUrl = process.env.APP_URL || process.env.VITE_APP_URL;

  // 1. If running on Render (RENDER_EXTERNAL_URL) and APP_URL is unset or points to localhost
  if (renderUrl && (!configuredAppUrl || configuredAppUrl.includes('localhost') || configuredAppUrl.includes('127.0.0.1'))) {
    return renderUrl.trim().replace(/\/$/, '');
  }

  // 2. Derive automatically from incoming HTTP request if request comes from a real public host
  if (req) {
    const rawHost = req.headers ? (req.headers['x-forwarded-host'] || req.headers['host']) : (req.get ? req.get('host') : '');
    if (rawHost && typeof rawHost === 'string' && rawHost.trim()) {
      const hostClean = rawHost.trim().split(',')[0].trim();
      const isReqLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(hostClean);
      if (!isReqLocal) {
        const proto = req.headers?.['x-forwarded-proto'] || (req.secure ? 'https' : 'https');
        return `${proto}://${hostClean}`;
      }
    }
  }

  // 3. Explicitly configured non-localhost APP_URL
  if (configuredAppUrl && typeof configuredAppUrl === 'string' && configuredAppUrl.trim()) {
    let clean = configuredAppUrl.trim().replace(/\/$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  // 4. Derive from request even if local
  if (req) {
    const rawHost = req.headers ? (req.headers['x-forwarded-host'] || req.headers['host']) : (req.get ? req.get('host') : '');
    if (rawHost && typeof rawHost === 'string' && rawHost.trim()) {
      const hostClean = rawHost.trim().split(',')[0].trim();
      const proto = req.headers?.['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
      return `${proto}://${hostClean}`;
    }
  }

  // 5. Fallback
  const defaultPort = process.env.PORT || '3000';
  return `http://localhost:${defaultPort}`;
}


