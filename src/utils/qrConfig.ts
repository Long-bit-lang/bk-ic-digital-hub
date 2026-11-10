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

