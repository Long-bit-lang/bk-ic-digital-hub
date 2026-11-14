import assert from 'node:assert';
import { pruneAndArchiveOldSessions, getArchivedSessions } from '../server/services/sessionArchiveService.js';
import type { DatabaseSchema } from '../server/db.ts';

async function runTests() {
  console.log('--- Testing 30-day Session Archival & Pruning ---');

  const nowMs = 1773500000000; // Reference timestamp: ~2026-03-14
  const THIRTY_ONE_DAYS_MS = 31 * 24 * 60 * 60 * 1000;
  const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

  // Mock store conforming to DatabaseSchema
  const mockStore: Partial<DatabaseSchema> = {
    sessions: [
      {
        id: 'old-session-1',
        title: 'Buổi sinh hoạt 35 ngày trước',
        description: 'Session ended 35 days ago',
        date: '2026-02-07',
        startTime: '14:00',
        endTime: '17:00',
        location: 'P201',
        status: 'ended',
        category: 'workshop'
      },
      {
        id: 'recent-session-2',
        title: 'Buổi sinh hoạt 10 ngày trước',
        description: 'Session ended 10 days ago',
        date: '2026-03-04',
        startTime: '14:00',
        endTime: '17:00',
        location: 'P202',
        status: 'ended',
        category: 'training'
      },
      {
        id: 'upcoming-session-3',
        title: 'Buổi sinh hoạt tuần tới',
        description: 'Session scheduled in future',
        date: '2026-03-20',
        startTime: '14:00',
        endTime: '17:00',
        location: 'P203',
        status: 'scheduled',
        category: 'workshop'
      }
    ],
    attendance: [
      {
        id: 'att-1',
        sessionId: 'old-session-1',
        sessionTitle: 'Buổi sinh hoạt 35 ngày trước',
        memberId: 'user-1',
        memberName: 'Nguyen Van A',
        studentId: '102210001',
        checkInTime: '14:05',
        status: 'present',
        method: 'qr'
      },
      {
        id: 'att-2',
        sessionId: 'recent-session-2',
        sessionTitle: 'Buổi sinh hoạt 10 ngày trước',
        memberId: 'user-1',
        memberName: 'Nguyen Van A',
        studentId: '102210001',
        checkInTime: '14:02',
        status: 'present',
        method: 'qr'
      }
    ],
    feedbacks: [
      {
        id: 'fb-1',
        sessionId: 'old-session-1',
        sessionTitle: 'Buổi sinh hoạt 35 ngày trước',
        submissionToken: 'tok-1',
        studentId: '102210001',
        memberName: 'Nguyen Van A',
        contentQuality: 5,
        delivery: 5,
        durationSuitability: 5,
        usefulness: 5,
        submittedAt: new Date(nowMs - THIRTY_ONE_DAYS_MS).toISOString()
      },
      {
        id: 'fb-2',
        sessionId: 'recent-session-2',
        sessionTitle: 'Buổi sinh hoạt 10 ngày trước',
        submissionToken: 'tok-2',
        studentId: '102210001',
        memberName: 'Nguyen Van A',
        contentQuality: 4,
        delivery: 4,
        durationSuitability: 4,
        usefulness: 4,
        submittedAt: new Date(nowMs - TEN_DAYS_MS).toISOString()
      }
    ],
    feedbackEligibility: [
      { id: 'el-1', sessionId: 'old-session-1', memberId: 'user-1', hasSubmitted: true },
      { id: 'el-2', sessionId: 'recent-session-2', memberId: 'user-1', hasSubmitted: true }
    ],
    attendanceRequests: [
      {
        id: 'req-1',
        type: 'absence_explanation',
        sessionId: 'old-session-1',
        sessionTitle: 'Buổi sinh hoạt 35 ngày trước',
        memberId: 'user-2',
        memberName: 'Tran Van C',
        studentId: '102210002',
        reason: 'Ốm',
        submittedAt: new Date(nowMs - THIRTY_ONE_DAYS_MS).toISOString(),
        isLateSubmission: false,
        status: 'approved'
      },
      {
        id: 'req-2',
        type: 'correction_request',
        sessionId: 'recent-session-2',
        sessionTitle: 'Buổi sinh hoạt 10 ngày trước',
        memberId: 'user-2',
        memberName: 'Tran Van C',
        studentId: '102210002',
        reason: 'Quên quét QR',
        submittedAt: new Date(nowMs - TEN_DAYS_MS).toISOString(),
        isLateSubmission: false,
        status: 'pending'
      }
    ],
    penaltyTickets: [
      {
        id: 'pt-1',
        ticketCode: 'VP-2026-0001',
        memberId: 'user-3',
        studentId: '102210099',
        memberName: 'Le Van B',
        memberEmail: 'levanb@dut.udn.vn',
        type: 'missing_feedback',
        sessionId: 'old-session-1',
        sessionTitle: 'Buổi sinh hoạt 35 ngày trước',
        reason: 'Không đánh giá sau buổi sinh hoạt',
        issuedAt: new Date(nowMs - THIRTY_ONE_DAYS_MS).toISOString(),
        issuedBy: 'Hệ thống tự động',
        status: 'active'
      }
    ],
    users: [],
    units: [],
    tasks: [],
    evaluations: [],
    notifications: [],
    exportLogs: [],
    auditLogs: [],
    applications: [],
    projects: [],
    events: [],
    articles: [],
    siteSettings: {} as any
  };

  // Test 1: Run prune
  const result = pruneAndArchiveOldSessions(mockStore as DatabaseSchema, 30, nowMs);

  assert.strictEqual(result.prunedCount, 1, 'Should prune exactly 1 old session (>30 days)');
  assert.strictEqual(result.archivedSessionTitles[0], 'Buổi sinh hoạt 35 ngày trước');

  // Verify active sessions in store
  assert.strictEqual(mockStore.sessions?.length, 2, 'Store should now only have 2 sessions');
  assert.ok(!mockStore.sessions?.some((s: any) => s.id === 'old-session-1'), 'old-session-1 should be removed');
  assert.ok(mockStore.sessions?.some((s: any) => s.id === 'recent-session-2'), 'recent-session-2 should be preserved');
  assert.ok(mockStore.sessions?.some((s: any) => s.id === 'upcoming-session-3'), 'upcoming-session-3 should be preserved');

  // Verify child collections pruned
  assert.strictEqual(mockStore.attendance?.length, 1, 'Old attendance should be pruned');
  assert.strictEqual(mockStore.attendance?.[0].sessionId, 'recent-session-2');

  assert.strictEqual(mockStore.feedbacks?.length, 1, 'Old feedback should be pruned');
  assert.strictEqual(mockStore.feedbacks?.[0].sessionId, 'recent-session-2');

  assert.strictEqual(mockStore.feedbackEligibility?.length, 1, 'Old eligibility should be pruned');
  assert.strictEqual(mockStore.feedbackEligibility?.[0].sessionId, 'recent-session-2');

  assert.strictEqual(mockStore.attendanceRequests?.length, 1, 'Old attendance request should be pruned');
  assert.strictEqual(mockStore.attendanceRequests?.[0].sessionId, 'recent-session-2');

  // Verify penalty ticket is PRESERVED
  assert.strictEqual(mockStore.penaltyTickets?.length, 1, 'Penalty tickets must be preserved for disciplinary records');
  assert.strictEqual(mockStore.penaltyTickets?.[0].ticketCode, 'VP-2026-0001');

  // Test 2: Verify archive file was written and can be read back
  const archived = getArchivedSessions();
  assert.ok(archived.length > 0, 'Archive should contain entries');
  const found = archived.find((b: any) => b.session?.id === 'old-session-1');
  assert.ok(found, 'Archived bundle for old-session-1 should be present in archive file');
  assert.strictEqual(found.attendance.length, 1);
  assert.strictEqual(found.feedbacks.length, 1);
  assert.strictEqual(found.attendanceRequests.length, 1);

  console.log('✓ All 30-day session archival tests PASSED successfully!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
