// Automated Session Archival & Pruning Service for BK-IC Digital Hub
// Automatically filters meetings older than 1 month (30 days) from active database
// into persistent archival storage to prevent database bloat and memory overload.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { DatabaseSchema } from '../db.ts';
import { getSessionScheduleTimes } from '../timeUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const ARCHIVES_DIR = path.join(DATA_DIR, 'archives');
const ARCHIVE_FILE = path.join(ARCHIVES_DIR, 'sessions_archive.json');

export interface ArchivedSessionBundle {
  session: any;
  archivedAt: string;
  retentionDays: number;
  attendanceCount: number;
  feedbacksCount: number;
  attendance: any[];
  feedbacks: any[];
  feedbackEligibility: any[];
  attendanceRequests: any[];
}

/**
 * Ensures archive directory exists
 */
function ensureArchiveDir(): void {
  if (!fs.existsSync(ARCHIVES_DIR)) {
    fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
  }
}

/**
 * Reads all archived sessions from the archive store
 */
export function getArchivedSessions(): ArchivedSessionBundle[] {
  try {
    ensureArchiveDir();
    if (!fs.existsSync(ARCHIVE_FILE)) return [];
    const content = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[SessionArchiveService] Error reading archived sessions:', err);
    return [];
  }
}

/**
 * Saves or updates archived session bundles in persistent JSON archive file
 */
function saveArchivedSessions(archives: ArchivedSessionBundle[]): void {
  ensureArchiveDir();
  const tempFile = `${ARCHIVE_FILE}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(archives, null, 2), 'utf-8');
  fs.renameSync(tempFile, ARCHIVE_FILE);
}

/**
 * Automatically archives and prunes meetings older than retentionDays (default: 30 days)
 * from active memory and data/db.json.
 * 
 * Safety invariants:
 * 1. Scheduled or ongoing sessions are NEVER archived.
 * 2. Only ended, closed, or cancelled sessions past the 30-day cutoff are archived.
 * 3. Associated attendance, feedback, and requests are preserved in sessions_archive.json before removal.
 * 4. Penalty tickets remain preserved in store.penaltyTickets for member accountability records.
 */
export function pruneAndArchiveOldSessions(
  store: DatabaseSchema,
  retentionDays: number = 30,
  nowMs: number = Date.now()
): {
  prunedCount: number;
  archivedSessionTitles: string[];
  archivedSessionIds: string[];
} {
  if (!store || !Array.isArray(store.sessions) || store.sessions.length === 0) {
    return { prunedCount: 0, archivedSessionTitles: [], archivedSessionIds: [] };
  }

  const cutoffMs = nowMs - retentionDays * 24 * 60 * 60 * 1000;
  const sessionsToPrune: any[] = [];

  for (const session of store.sessions) {
    // Invariant: Never archive upcoming or ongoing sessions
    if (session.status === 'scheduled' || session.status === 'ongoing') {
      continue;
    }

    const times = getSessionScheduleTimes(session);
    // Meeting must be ended or cancelled, and its scheduled end time must be older than 30 days
    const isCompletedOrCancelled = session.status === 'ended' || session.status === 'closed' || session.status === 'cancelled';
    const isPastCutoff = times.endMs < cutoffMs;

    if (isCompletedOrCancelled && isPastCutoff) {
      sessionsToPrune.push(session);
    }
  }

  if (sessionsToPrune.length === 0) {
    return { prunedCount: 0, archivedSessionTitles: [], archivedSessionIds: [] };
  }

  const prunedIds = new Set(sessionsToPrune.map(s => s.id));
  const existingArchives = getArchivedSessions();

  // Create archive bundles preserving full relational tree
  const newBundles: ArchivedSessionBundle[] = sessionsToPrune.map(session => {
    const sessionAttendance = (store.attendance || []).filter(a => a.sessionId === session.id);
    const sessionFeedbacks = (store.feedbacks || []).filter(f => f.sessionId === session.id);
    const sessionEligibility = (store.feedbackEligibility || []).filter(fe => fe.sessionId === session.id);
    const sessionRequests = (store.attendanceRequests || []).filter(ar => ar.sessionId === session.id);

    return {
      session,
      archivedAt: new Date(nowMs).toISOString(),
      retentionDays,
      attendanceCount: sessionAttendance.length,
      feedbacksCount: sessionFeedbacks.length,
      attendance: sessionAttendance,
      feedbacks: sessionFeedbacks,
      feedbackEligibility: sessionEligibility,
      attendanceRequests: sessionRequests
    };
  });

  // Merge into persistent archive file (deduplicating by session.id)
  const mergedArchives = [
    ...newBundles,
    ...existingArchives.filter(bundle => !prunedIds.has(bundle.session?.id))
  ];

  try {
    saveArchivedSessions(mergedArchives);
  } catch (err) {
    console.error('[SessionArchiveService] Failed to write archive file. Aborting prune to prevent data loss:', err);
    return { prunedCount: 0, archivedSessionTitles: [], archivedSessionIds: [] };
  }

  // Safely prune from active database
  store.sessions = store.sessions.filter(s => !prunedIds.has(s.id));
  store.attendance = (store.attendance || []).filter(a => !prunedIds.has(a.sessionId));
  if (Array.isArray(store.attendanceRecords)) {
    store.attendanceRecords = store.attendance;
  }
  store.feedbacks = (store.feedbacks || []).filter(f => !prunedIds.has(f.sessionId));
  store.feedbackEligibility = (store.feedbackEligibility || []).filter(fe => !prunedIds.has(fe.sessionId));
  store.attendanceRequests = (store.attendanceRequests || []).filter(ar => !prunedIds.has(ar.sessionId));

  const archivedSessionTitles = sessionsToPrune.map(s => s.title);
  const archivedSessionIds = sessionsToPrune.map(s => s.id);

  // Record audit log
  if (Array.isArray(store.auditLogs)) {
    store.auditLogs.unshift({
      id: `audit-archive-${Date.now()}`,
      timestamp: new Date(nowMs).toISOString(),
      actorId: 'system-archive-service',
      actorName: 'Hệ thống tự động BK-IC',
      actorRole: 'sysadmin',
      action: 'Lọc & Lưu trữ meeting quá 1 tháng',
      targetType: 'TrainingSession',
      targetId: 'multiple',
      details: `Đã tự động lưu trữ và lọc khỏi database hoạt động ${sessionsToPrune.length} buổi sinh hoạt diễn ra hơn ${retentionDays} ngày trước (${archivedSessionTitles.join(', ')}) để tránh quá tải database.`
    });
  }

  console.log(`[SessionArchiveService] Successfully archived & pruned ${sessionsToPrune.length} session(s) older than ${retentionDays} days.`);

  return {
    prunedCount: sessionsToPrune.length,
    archivedSessionTitles,
    archivedSessionIds
  };
}

