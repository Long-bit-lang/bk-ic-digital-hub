// Verification test for Identified Feedback, 24h Warning Email, and Closing Penalty Tickets
import assert from 'assert';
import { db } from '../server/db.ts';
import { processFeedbackLifecycle } from '../server/services/feedbackLifecycle.ts';
import { getEmailOutbox, clearEmailOutbox } from '../server/services/emailService.ts';
import type { TrainingSession, AttendanceRecord, User } from '../src/types/index.ts';

async function runTestSuite() {
  console.log('================================================================');
  console.log('TEST SUITE: FEEDBACK IDENTITY, 24H WARNING EMAIL & PENALTY TICKETS');
  console.log('================================================================\n');

  clearEmailOutbox();
  const store = db.get();

  // Setup test session and test users
  const timestamp = Date.now();
  const testSessionId = `test-ses-${timestamp}`;
  const userAId = `usr-test-a-${timestamp}`;
  const userBId = `usr-test-b-${timestamp}`;

  const userA: User = {
    id: userAId,
    memberId: 'BKIC-2026-A01',
    email: `memberA.${timestamp}@dut.udn.vn`,
    fullName: 'Nguyễn Văn A',
    studentId: '102220001',
    faculty: 'Công nghệ Thông tin',
    classId: '22T_DT1',
    academicYear: '2022-2026',
    role: 'member',
    unit: 'BDH',
    position: 'Thành viên BĐH',
    joinDate: '2026-01-15',
    status: 'active',
    accountStatus: 'active',
    emailVerified: true,
    createdAt: new Date().toISOString()
  };

  const userB: User = {
    id: userBId,
    memberId: 'BKIC-2026-B02',
    email: `memberB.${timestamp}@dut.udn.vn`,
    fullName: 'Lê Thị B',
    studentId: '102220002',
    faculty: 'Điện tử Viễn thông',
    classId: '22DT2',
    academicYear: '2022-2026',
    role: 'member',
    unit: 'BTV',
    position: 'Thành viên BTV',
    joinDate: '2026-01-15',
    status: 'active',
    accountStatus: 'active',
    emailVerified: true,
    createdAt: new Date().toISOString()
  };

  store.users.push(userA, userB);

  // Session ended 1 hour ago
  const now = Date.now();
  const endMs = now - 60 * 60 * 1000;
  const startMs = endMs - 90 * 60 * 1000;

  // Deadline: exactly 20 hours from now (<= 24h away -> should trigger 24h warning)
  const deadlineMs = now + 20 * 60 * 60 * 1000;

  const testSession: TrainingSession = {
    id: testSessionId,
    title: `Buổi Workshop Kiểm thử ${timestamp}`,
    description: 'Kiểm thử quy trình cảnh báo 24h và vé phạt',
    date: '2026-11-14',
    startTime: '17:30',
    endTime: '19:00',
    location: 'Văn phòng BK-IC',
    status: 'ended',
    attendanceStatus: 'finalized',
    feedbackStatus: 'open',
    feedbackDeadline: new Date(deadlineMs).toISOString(),
    unit: 'BDH'
  };

  store.sessions.push(testSession);

  // Both userA and userB attended the session
  const attA: AttendanceRecord = {
    id: `att-a-${timestamp}`,
    sessionId: testSessionId,
    sessionTitle: testSession.title,
    memberId: userAId,
    memberName: userA.fullName,
    studentId: userA.studentId,
    unit: userA.unit,
    checkInTime: new Date(startMs).toISOString(),
    status: 'present',
    method: 'qr'
  };

  const attB: AttendanceRecord = {
    id: `att-b-${timestamp}`,
    sessionId: testSessionId,
    sessionTitle: testSession.title,
    memberId: userBId,
    memberName: userB.fullName,
    studentId: userB.studentId,
    unit: userB.unit,
    checkInTime: new Date(startMs).toISOString(),
    status: 'present',
    method: 'qr'
  };

  store.attendance.push(attA, attB);

  // --------------------------------------------------------------------------
  // TEST 1: User A submits identified feedback (No longer anonymous)
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: User A submits identified feedback ---');
  store.feedbacks.unshift({
    id: `fb-${timestamp}`,
    sessionId: testSessionId,
    sessionTitle: testSession.title,
    submissionToken: `tok-${timestamp}`,
    memberId: userA.id,
    memberName: userA.fullName,
    studentId: userA.studentId,
    memberEmail: userA.email,
    unit: userA.unit,
    isAnonymous: false,
    contentQuality: 5,
    delivery: 5,
    durationSuitability: 4,
    usefulness: 5,
    valuableTakeaway: 'Nội dung rất thực tế và chi tiết',
    submittedAt: new Date().toISOString()
  });

  store.feedbackEligibility.push({
    id: `fe-${timestamp}-a`,
    sessionId: testSessionId,
    memberId: userA.id,
    hasSubmitted: true,
    submissionToken: `tok-${timestamp}`,
    submittedAt: new Date().toISOString()
  });

  const fbStored = store.feedbacks.find(f => f.sessionId === testSessionId && f.memberId === userA.id);
  assert(fbStored, 'User A feedback must exist');
  assert.strictEqual(fbStored?.memberName, userA.fullName, 'Author name must be preserved');
  assert.strictEqual(fbStored?.studentId, userA.studentId, 'Student ID must be preserved');
  assert.strictEqual(fbStored?.isAnonymous, false, 'isAnonymous must be false');
  console.log('[PASS] Test 1: Feedback is identified with real author name and student ID.');

  // --------------------------------------------------------------------------
  // TEST 2: Trigger Lifecycle: User B hasn't submitted & deadline <= 24h
  // -> Warning email should be sent to User B, NOT to User A
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: 24h Warning Email Dispatch ---');
  clearEmailOutbox();
  const changed1 = await processFeedbackLifecycle(store, now);
  assert(changed1, 'Lifecycle should update state when warning email is dispatched');
  assert(testSession.feedbackWarningSentAt, 'feedbackWarningSentAt should be recorded on session');

  const outboxAfterWarning = getEmailOutbox();
  const warningForB = outboxAfterWarning.find(m => m.to.toLowerCase() === userB.email.toLowerCase() && m.type === 'feedback_warning');
  const warningForA = outboxAfterWarning.find(m => m.to.toLowerCase() === userA.email.toLowerCase());

  assert(warningForB, 'Warning email must be dispatched to User B who has not submitted');
  assert(!warningForA, 'User A who already submitted must NOT receive a warning email');
  assert(warningForB.subject.includes('Cảnh báo'), 'Subject must indicate warning');
  assert(warningForB.htmlContent.includes(testSession.title), 'Body must contain session title');
  assert(warningForB.htmlContent.includes('VÉ PHẠT'), 'Body must warn about penalty ticket');
  console.log('[PASS] Test 2: Warning email sent exclusively to unsubmitted attendee B, with penalty warnings.');

  // Idempotency: Running lifecycle again within 24h window must NOT send duplicate email
  clearEmailOutbox();
  const changed2 = await processFeedbackLifecycle(store, now + 1000);
  assert(!changed2, 'Lifecycle must be idempotent within same warning cycle');
  assert.strictEqual(getEmailOutbox().length, 0, 'No duplicate emails sent');
  console.log('[PASS] Test 2b: Warning email dispatch is strictly idempotent.');

  // --------------------------------------------------------------------------
  // TEST 3: Time advances past deadline -> Feedback closes -> Penalty Ticket issued to User B
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: Penalty Ticket Issuance on Closing ---');
  clearEmailOutbox();
  const expiredTime = deadlineMs + 1000; // Past deadline

  const changed3 = await processFeedbackLifecycle(store, expiredTime);
  assert(changed3, 'Lifecycle must update state on form closing');
  assert.strictEqual(testSession.feedbackStatus, 'closed', 'Session feedback status must be closed');
  assert(testSession.feedbackPenaltiesIssuedAt, 'feedbackPenaltiesIssuedAt must be set');

  // Verify Penalty Ticket
  const userBTicket = store.penaltyTickets.find(
    t => t.sessionId === testSessionId && t.memberId === userB.id && t.type === 'missing_feedback'
  );
  const userATicket = store.penaltyTickets.find(
    t => t.sessionId === testSessionId && t.memberId === userA.id
  );

  assert(userBTicket, 'User B must receive a penalty ticket for missing feedback deadline');
  assert(!userATicket, 'User A who submitted must NOT receive a penalty ticket');
  assert.strictEqual(userBTicket.status, 'active', 'New ticket must be active');
  assert.strictEqual(userBTicket.penaltyPoints, 1, 'Ticket must carry 1 penalty point');
  assert(userBTicket.ticketCode.startsWith('VP-'), 'Ticket code must start with VP-');

  // Verify Penalty Email
  const penaltyEmailB = getEmailOutbox().find(
    m => m.to.toLowerCase() === userB.email.toLowerCase() && m.type === 'penalty_ticket'
  );
  assert(penaltyEmailB, 'Formal penalty ticket email must be dispatched to User B');
  assert(penaltyEmailB.subject.includes(userBTicket.ticketCode), 'Subject must contain ticket code');
  console.log(`[PASS] Test 3: Issued Penalty Ticket ${userBTicket.ticketCode} and sent penalty email to User B.`);

  // Verify In-app notification
  const notifB = store.notifications.find(
    n => n.recipientId === userB.id && n.referenceId === testSessionId && n.title.includes('Vé phạt')
  );
  assert(notifB, 'In-app notification for penalty ticket must be created for User B');
  console.log('[PASS] Test 3b: In-app notification recorded for penalty ticket.');

  // --------------------------------------------------------------------------
  // TEST 4: Cleanup
  // --------------------------------------------------------------------------
  store.sessions = store.sessions.filter(s => s.id !== testSessionId);
  store.attendance = store.attendance.filter(a => a.sessionId !== testSessionId);
  store.feedbacks = store.feedbacks.filter(f => f.sessionId !== testSessionId);
  store.feedbackEligibility = store.feedbackEligibility.filter(e => e.sessionId !== testSessionId);
  store.penaltyTickets = store.penaltyTickets.filter(t => t.sessionId !== testSessionId);
  store.notifications = store.notifications.filter(n => n.referenceId !== testSessionId);
  store.users = store.users.filter(u => u.id !== userAId && u.id !== userBId);
  db.save();

  console.log('\n================================================================');
  console.log('ALL VERIFICATION TESTS FOR IDENTIFIED FEEDBACK, WARNING EMAIL & PENALTIES PASSED!');
  console.log('================================================================');
  process.exit(0);
}

runTestSuite().catch(err => {
  console.error('[FAIL] Test suite failed:', err);
  process.exit(1);
});
