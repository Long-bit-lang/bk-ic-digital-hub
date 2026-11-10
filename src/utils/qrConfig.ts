// Shared QR attendance rotation interval and token helpers

export const DEFAULT_QR_INTERVAL_SEC = 60;

/**
 * Resolves the effective QR token rotation interval (in seconds) for a session.
 * Upgrades legacy 20s default values to the 60s (1 minute) rotation interval.
 */
export function resolveQrIntervalSec(qrIntervalSec?: number | null): number {
  const numeric = Number(qrIntervalSec);
  if (!Number.isFinite(numeric) || numeric <= 0 || numeric === 20) {
    return DEFAULT_QR_INTERVAL_SEC;
  }
  return numeric;
}

/**
 * Computes the rotating opaque QR token for a given session and time slot.
 */
export function buildQrToken(sessionId: string, timeSlot: number): string {
  return `BKIC-QR-${sessionId.slice(-6)}-${timeSlot.toString(36).toUpperCase()}-${((timeSlot * 47) % 10000).toString().padStart(4, '0')}`;
}

export interface ParsedQrPayload {
  valid: boolean;
  sessionId?: string;
  token?: string;
  raw: string;
}

/**
 * Checks whether a training session currently has an open attendance gate.
 */
export function isSessionAttendanceOpen(session: {
  status?: string;
  attendanceStatus?: string;
  isAttendanceOpen?: boolean;
} | null | undefined): boolean {
  if (!session || session.status === 'cancelled' || session.attendanceStatus === 'finalized') {
    return false;
  }
  return Boolean(
    session.isAttendanceOpen ||
    session.attendanceStatus === 'open' ||
    session.status === 'open'
  );
}

/**
 * Parses a scanned QR string or pasted token into a normalized check-in payload.
 * Supports full /checkin URLs, JSON objects, and raw BKIC-QR-... tokens.
 */
export function parseScannedQrPayload(
  rawText: string,
  sessions: Array<{ id: string; status?: string; attendanceStatus?: string; isAttendanceOpen?: boolean }> = []
): ParsedQrPayload {
  const trimmed = (rawText || '').trim();
  if (!trimmed) {
    return { valid: false, raw: '' };
  }

  // 1. URL format (e.g. https://domain/checkin?sessionId=...&token=... or /checkin/:sessionId?token=...)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.includes('sessionId=') ||
    trimmed.includes('token=')
  ) {
    try {
      const normalizedInput = trimmed.includes('://') || trimmed.startsWith('/')
        ? trimmed
        : `https://bkic.local/checkin?${trimmed.replace(/^\?/, '')}`;
      const url = new URL(normalizedInput, 'https://bkic.local');
      let sessionId = url.searchParams.get('sessionId')?.trim() || undefined;
      if (!sessionId) {
        const pathMatch = url.pathname.match(/\/checkin\/([^/?#]+)/);
        if (pathMatch?.[1]) {
          sessionId = decodeURIComponent(pathMatch[1]);
        }
      }
      const token = url.searchParams.get('token')?.trim() || undefined;
      if (sessionId || (token && token.toUpperCase().startsWith('BKIC-QR-'))) {
        return { valid: true, sessionId, token, raw: trimmed };
      }
    } catch {
      // Fall through to other formats
    }
  }

  // 2. JSON payload
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && (parsed.sessionId || parsed.token)) {
        return {
          valid: true,
          sessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId.trim() : undefined,
          token: typeof parsed.token === 'string' ? parsed.token.trim() : undefined,
          raw: trimmed
        };
      }
    } catch {
      // Fall through
    }
  }

  // 3. Raw BKIC-QR token (BKIC-QR-<sessionSuffix>-<slot>-<hash>)
  if (/^BKIC-QR-[A-Za-z0-9_-]+$/i.test(trimmed)) {
    const parts = trimmed.split('-');
    const suffix = parts[2];
    const matchedSession = suffix
      ? (sessions.find(s => isSessionAttendanceOpen(s) && s.id.slice(-6) === suffix) ||
         sessions.find(s => s.id.slice(-6) === suffix))
      : undefined;
    return {
      valid: true,
      sessionId: matchedSession?.id,
      token: trimmed,
      raw: trimmed
    };
  }

  return { valid: false, raw: trimmed };
}

