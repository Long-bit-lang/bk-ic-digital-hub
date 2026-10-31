// Recurring Tuesday Schedule Generator for BK-IC Digital Hub
import type { DatabaseSchema } from '../db.ts';
import type { TrainingSession } from '../../src/types/index.ts';
import { getVNCurrentDateStr, VN_TIMEZONE } from '../timeUtils.ts';

/**
 * Computes the dates of upcoming Tuesdays in Asia/Ho_Chi_Minh for the next `weeksAhead` weeks.
 */
export function getUpcomingTuesdayDates(startOrWeeks?: string | number, weeksAhead: number = 4): string[] {
  let effectiveStart = getVNCurrentDateStr();
  let effectiveWeeks = weeksAhead;

  if (typeof startOrWeeks === 'number') {
    effectiveWeeks = startOrWeeks;
  } else if (typeof startOrWeeks === 'string') {
    effectiveStart = startOrWeeks;
  }

  const [year, month, day] = effectiveStart.split('-').map(Number);
  // Start from UTC noon of given VN date to guarantee date boundaries in +07:00
  const baseDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  const tuesdayDates: string[] = [];
  
  // Check from today up to weeksAhead * 7 days
  for (let offset = 0; offset <= effectiveWeeks * 7; offset++) {
    const current = new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);
    
    // Format date in Vietnam timezone (YYYY-MM-DD)
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: VN_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const dateStr = formatter.format(current);
    
    // Check weekday in Vietnam timezone
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: VN_TIMEZONE,
      weekday: 'short'
    });
    const weekday = dayFormatter.format(current); // 'Tue', 'Wed', etc.
    
    if (weekday === 'Tue' && !tuesdayDates.includes(dateStr)) {
      tuesdayDates.push(dateStr);
    }
  }
  
  return tuesdayDates;
}

/**
 * Ensures upcoming Tuesday recurring sessions exist in store.sessions.
 * Preserves existing sessions (including cancelled sessions, reasons, audit logs, and attendance).
 */
export function syncRecurringTuesdaySessions(store: DatabaseSchema, weeksAhead: number = 4): boolean {
  if (!store || !Array.isArray(store.sessions)) return false;
  
  const todayVN = getVNCurrentDateStr();
  const tuesdayDates = getUpcomingTuesdayDates(todayVN, weeksAhead);
  let changed = false;
  
  for (const dateStr of tuesdayDates) {
    const id = `ses-tuesday-${dateStr}`;
    // Check if session already exists for this Tuesday
    const existing = store.sessions.find(s => s.id === id || (s.date === dateStr && s.isRecurring));
    
    if (!existing) {
      const [y, m, d] = dateStr.split('-');
      const formattedDate = `${d}/${m}/${y}`;
      const newSession: TrainingSession = {
        id,
        title: `Sinh hoạt định kỳ CLB BK-IC (Thứ Ba ${formattedDate})`,
        description: 'Buổi sinh hoạt định kỳ thứ Ba hằng tuần của CLB Khởi nghiệp và Đổi mới sáng tạo BK-IC.',
        targetAudience: 'Toàn thể thành viên chính thức',
        targetParticipants: 'Toàn thể thành viên chính thức',
        date: dateStr,
        startTime: '17:30',
        endTime: '19:00',
        location: 'Văn phòng BK-IC / Trường Đại học Bách khoa – ĐHĐN',
        status: 'scheduled',
        attendanceStatus: 'closed',
        unit: 'BDH',
        isRecurring: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;TIME=17:30-19:00;TZ=Asia/Ho_Chi_Minh',
        category: 'general_meeting',
        createdById: 'system-recurring',
        createdByName: 'Hệ thống BK-IC (Lịch định kỳ)',
        personInChargeId: 'usr-admin',
        personInChargeName: 'Quản trị viên Hệ thống (Admin)',
        feedbackStatus: 'closed',
        cancellationHistory: []
      };
      store.sessions.push(newSession);
      changed = true;
    }
  }
  
  if (changed) {
    store.sessions.sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.startTime.localeCompare(b.startTime);
    });
  }
  
  return changed;
}
