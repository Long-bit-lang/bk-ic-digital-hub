// Server Time Utilities - Enforcing Asia/Ho_Chi_Minh timezone
export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Returns current Date in ISO format or formatted string
 */
export function getNow(): Date {
  return new Date();
}

export function getNowISO(): string {
  return new Date().toISOString();
}

/**
 * Returns current time in Vietnam timezone (HH:mm)
 */
export function getVNCurrentTimeStr(): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: VN_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return formatter.format(new Date());
}

/**
 * Returns current date in Vietnam timezone (YYYY-MM-DD)
 */
export function getVNCurrentDateStr(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

/**
 * Parses session date and time (YYYY-MM-DD and HH:mm) into timestamp (ms)
 * Correctly accounts for Asia/Ho_Chi_Minh (+07:00) and handles hour rollover safely.
 */
export function parseSessionDateTime(dateStr: string, timeStr: string): number {
  if (!dateStr || !timeStr) return Date.now();
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // UTC offset for Asia/Ho_Chi_Minh is +7 hours.
  // Using Date.UTC handles hour values like 24, 25 or minute values without throwing RangeError.
  return Date.UTC(year, (month || 1) - 1, day || 1, (hour || 0) - 7, minute || 0, 0);
}

/**
 * Formats a millisecond timestamp into HH:mm string in Vietnam timezone.
 */
export function formatTimeFromMs(ms: number): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: VN_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return formatter.format(new Date(ms));
}

export interface SessionScheduleTimes {
  startMs: number;
  endMs: number;
  openMs: number;
  lateMs: number;
  closeMs: number;
}

/**
 * Computes exact schedule timestamps for a session in Vietnam timezone.
 * Handles both explicit times (attendanceOpenTime, attendanceCloseTime, lateThresholdTime)
 * and relative minutes thresholds (qrWindowOpenMinutes, qrWindowCloseMinutes, lateThresholdMinutes).
 */
export function getSessionScheduleTimes(session: {
  date: string;
  startTime: string;
  endTime: string;
  attendanceOpenTime?: string;
  attendanceCloseTime?: string;
  lateThresholdTime?: string;
  qrWindowOpenMinutes?: number;
  qrWindowCloseMinutes?: number;
  lateThresholdMinutes?: number;
}): SessionScheduleTimes {
  const startMs = parseSessionDateTime(session.date, session.startTime);
  let endMs = parseSessionDateTime(session.date, session.endTime);

  // If endTime is numerically earlier than startTime, session ends past midnight (next day)
  if (endMs <= startMs) {
    endMs += 24 * 60 * 60 * 1000;
  }

  // Open time: explicit attendanceOpenTime or fallback to startMs - openMinutes
  let openMs: number;
  if (session.attendanceOpenTime && session.attendanceOpenTime.includes(':')) {
    openMs = parseSessionDateTime(session.date, session.attendanceOpenTime);
    // Midnight rollover: If session start is early morning (e.g. 00:15) and openTime is e.g. 23:55 (previous day),
    // openMs on the same date will be ~23 hours in the future. In reality openMs is before startMs.
    if (openMs > startMs) {
      openMs -= 24 * 60 * 60 * 1000;
    }
  } else {
    const openMins = session.qrWindowOpenMinutes ?? 15;
    openMs = startMs - openMins * 60 * 1000;
  }

  // Close time: explicit attendanceCloseTime or fallback to startMs + closeMinutes
  let closeMs: number;
  if (session.attendanceCloseTime && session.attendanceCloseTime.includes(':')) {
    closeMs = parseSessionDateTime(session.date, session.attendanceCloseTime);
    // Midnight rollover: if closeTime is past midnight relative to start or open time
    if (closeMs < openMs) {
      closeMs += 24 * 60 * 60 * 1000;
    }
  } else {
    const closeMins = session.qrWindowCloseMinutes ?? 15;
    closeMs = startMs + closeMins * 60 * 1000;
  }

  // Late threshold: explicit lateThresholdTime or fallback to startMs + lateMinutes
  let lateMs: number;
  if (session.lateThresholdTime && session.lateThresholdTime.includes(':')) {
    lateMs = parseSessionDateTime(session.date, session.lateThresholdTime);
    if (lateMs < openMs) {
      lateMs += 24 * 60 * 60 * 1000;
    }
  } else {
    const lateMins = session.lateThresholdMinutes ?? 10;
    lateMs = startMs + lateMins * 60 * 1000;
  }

  return { startMs, endMs, openMs, lateMs, closeMs };
}

/**
 * Checks if current time is within the attendance window.
 */
export function checkQRWindow(
  dateStr: string,
  startTimeStr: string,
  openTimeStr?: string,
  closeTimeStr?: string
): {
  isOpen: boolean;
  isBeforeWindow: boolean;
  isAfterWindow: boolean;
  minutesRelative: number;
} {
  const times = getSessionScheduleTimes({
    date: dateStr,
    startTime: startTimeStr,
    endTime: startTimeStr,
    attendanceOpenTime: openTimeStr,
    attendanceCloseTime: closeTimeStr
  });

  const now = Date.now();
  const diffMinutes = (now - times.startMs) / (60 * 1000);

  const isBeforeWindow = now < times.openMs;
  const isAfterWindow = now > times.closeMs;
  const isOpen = now >= times.openMs && now <= times.closeMs;

  return {
    isOpen,
    isBeforeWindow,
    isAfterWindow,
    minutesRelative: Math.round(diffMinutes)
  };
}

/**
 * Evaluates whether attendance is ON TIME ('present') or LATE ('late').
 */
export function evaluateLateStatus(
  dateStr: string,
  startTimeStr: string,
  lateThresholdTimeStr?: string
): 'present' | 'late' {
  const now = Date.now();
  if (lateThresholdTimeStr && lateThresholdTimeStr.includes(':')) {
    const lateMs = parseSessionDateTime(dateStr, lateThresholdTimeStr);
    return now > lateMs ? 'late' : 'present';
  }
  const sessionStartTime = parseSessionDateTime(dateStr, startTimeStr);
  const diffMinutes = (now - sessionStartTime) / (60 * 1000);
  return diffMinutes > 10 ? 'late' : 'present';
}

/**
 * Synchronizes session status and attendance lifecycle based on authoritative server time.
 * Idempotent, safe to run repeatedly.
 *
 * Rules:
 * 1. Scheduled: now < startMs
 * 2. Ongoing: startMs <= now < endMs
 * 3. Ended: now >= endMs
 * 4. Attendance: 'open' when openMs <= now <= closeMs, else 'closed' (unless 'finalized')
 * 5. Cancelled sessions remain 'cancelled', attendance remains 'closed'
 */
export function syncSessionsLifecycle(store: any, nowMs = Date.now()): boolean {
  if (!store || !Array.isArray(store.sessions)) return false;
  let changed = false;

  for (const session of store.sessions) {
    if (!session.date || !session.startTime || !session.endTime) continue;

    const times = getSessionScheduleTimes(session);

    // 1. Session Status Transition
    if (session.status !== 'cancelled') {
      if (session.manualGate === 'open') {
        if (session.status !== 'ongoing') {
          session.status = 'ongoing';
          changed = true;
        }
      } else if (nowMs >= times.endMs) {
        if (session.status !== 'ended') {
          session.status = 'ended';
          changed = true;
        }
      } else if (nowMs >= times.startMs) {
        if (session.status !== 'ongoing') {
          session.status = 'ongoing';
          changed = true;
        }
      } else if (session.status !== 'scheduled') {
        session.status = 'scheduled';
        changed = true;
      }
    }

    // 2. Attendance Status Transition (Automatically closes when nowMs > times.closeMs)
    if (session.attendanceStatus !== 'finalized') {
      if (session.status === 'cancelled') {
        if (session.attendanceStatus !== 'closed') {
          session.attendanceStatus = 'closed';
          changed = true;
        }
        if (session.manualGate) {
          delete session.manualGate;
          delete session.manualGateUntilMs;
          changed = true;
        }
      } else if (session.status === 'ended' && session.manualGate !== 'open') {
        if (session.attendanceStatus !== 'closed') {
          session.attendanceStatus = 'closed';
          changed = true;
        }
      } else if (session.manualGate === 'closed') {
        // PIC or Admin manually closed gate early. Stays closed.
        if (session.attendanceStatus !== 'closed') {
          session.attendanceStatus = 'closed';
          changed = true;
        }
      } else {
        // Automatic lifecycle based on configured openMs and closeMs
        const isWithinWindow = nowMs >= times.openMs && nowMs <= times.closeMs;
        // If manager manually opened gate, allow it to remain open until manualGateUntilMs (or closeMs)
        const effectiveManualCloseMs = session.manualGateUntilMs || times.closeMs;
        const isManualOpen = session.manualGate === 'open' && nowMs <= effectiveManualCloseMs;
        const isOpen = isWithinWindow || isManualOpen;
        const desiredAttStatus = isOpen ? 'open' : 'closed';

        if (session.attendanceStatus !== desiredAttStatus) {
          session.attendanceStatus = desiredAttStatus;
          changed = true;
        }

        // Clean up manualGate once expiry has passed
        if (session.manualGate === 'open' && nowMs > effectiveManualCloseMs) {
          delete session.manualGate;
          delete session.manualGateUntilMs;
          changed = true;
        }
      }
    }

    // 3. Feedback Status & Deadline Transition (VI. QUY TRÌNH TRẠNG THÁI MEETING VÀ GÓP Ý)
    // - Cancelled: closed
    // - Scheduled/ongoing (before endMs): closed
    // - Ended: automatically open for 24 hours after actual end time, then closed
    // - Reopened: remains open until explicit feedbackDeadline, then closed
    if (session.status === 'cancelled') {
      if (session.feedbackStatus !== 'closed') {
        session.feedbackStatus = 'closed';
        changed = true;
      }
    } else {
      // Ensure feedbackDeadline is initialized (endMs + 24h)
      if (!session.feedbackDeadline) {
        session.feedbackDeadline = new Date(times.endMs + 24 * 60 * 60 * 1000).toISOString();
        changed = true;
      }

      const deadlineMs = new Date(session.feedbackDeadline).getTime();

      if (nowMs < times.endMs) {
        // Meeting is upcoming or ongoing: feedback not open yet
        if (session.feedbackStatus !== 'closed') {
          session.feedbackStatus = 'closed';
          changed = true;
        }
      } else {
        // Meeting has ended
        if (session.feedbackStatus === 'reopened') {
          if (nowMs > deadlineMs) {
            session.feedbackStatus = 'closed';
            changed = true;
          }
        } else {
          const desiredFbStatus = nowMs <= deadlineMs ? 'open' : 'closed';
          if (session.feedbackStatus !== desiredFbStatus) {
            session.feedbackStatus = desiredFbStatus;
            changed = true;
          }
        }
      }
    }
  }

  return changed;
}

/**
 * Real-time authoritative evaluator for feedback window status.
 * Evaluates live timestamps without depending on background sync.
 */
export function isFeedbackWindowOpen(session: any, nowMs = Date.now()): {
  isOpen: boolean;
  reason?: 'cancelled' | 'not_ended_yet' | 'expired' | 'closed_manually';
  deadline?: string;
  message?: string;
} {
  if (!session) {
    return { isOpen: false, reason: 'closed_manually', message: 'Không tìm thấy phiên sinh hoạt.' };
  }

  if (session.status === 'cancelled') {
    return {
      isOpen: false,
      reason: 'cancelled',
      message: 'Buổi meeting đã bị hủy, biểu mẫu phản hồi không tiếp nhận thông tin.'
    };
  }

  const times = getSessionScheduleTimes(session);
  const deadlineMs = session.feedbackDeadline
    ? new Date(session.feedbackDeadline).getTime()
    : (times.endMs + 24 * 60 * 60 * 1000);
  const deadlineIso = new Date(deadlineMs).toISOString();

  if (nowMs < times.endMs) {
    return {
      isOpen: false,
      reason: 'not_ended_yet',
      deadline: deadlineIso,
      message: 'Buổi sinh hoạt chưa kết thúc, biểu mẫu góp ý chỉ mở sau khi buổi kết thúc.'
    };
  }

  if (nowMs > deadlineMs) {
    return {
      isOpen: false,
      reason: 'expired',
      deadline: deadlineIso,
      message: `Biểu mẫu phản hồi đã hết hạn vào ${new Date(deadlineMs).toLocaleString('vi-VN')}. Chỉ Ban Chủ nhiệm mới có quyền mở lại.`
    };
  }

  // If meeting ended and within deadline, it is open (unless manually marked closed and not reopened)
  if (session.feedbackStatus === 'closed' && nowMs > times.endMs && nowMs <= deadlineMs && !session.feedbackReopenedBy) {
    // Edge-case if status was previously stuck at closed before sync
    return { isOpen: true, deadline: deadlineIso };
  }

  return { isOpen: true, deadline: deadlineIso };
}

/**
 * Calculates deadline from an ISO or date string plus hours
 */
export function addHours(dateOrIso: string | Date, hours: number): string {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : new Date(dateOrIso);
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  return d.toISOString();
}

/**
 * Checks if a deadline has expired
 */
export function isExpired(deadlineIso: string): boolean {
  return Date.now() > new Date(deadlineIso).getTime();
}
