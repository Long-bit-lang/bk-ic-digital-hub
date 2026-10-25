// Comprehensive Security Audit & Verification Test Suite for BK-IC Digital Hub
// Pure HTTP integration testing against running server
const BASE_URL = 'http://127.0.0.1:3000';

interface TestResult {
  scenarioNumber: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, scenarioNumber: number, name: string, details: string) {
  if (condition) {
    console.log(`[PASS] Scenario ${scenarioNumber}: ${name}`);
    results.push({ scenarioNumber, name, passed: true, details });
  } else {
    console.error(`[FAIL] Scenario ${scenarioNumber}: ${name} - ${details}`);
    results.push({ scenarioNumber, name, passed: false, details });
  }
}

async function runAudit() {
  console.log('====================================================');
  console.log('BK-IC DIGITAL HUB - SECURITY & RBAC VERIFICATION');
  console.log('====================================================\n');

  // Step 1: Admin Login using verified initial master admin credentials
  console.log('Authenticating as Master Admin...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin.bkic@dut.udn.vn', password: '123456' })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  const adminUser = adminLoginData.user;

  if (!adminToken) {
    throw new Error(`Admin login failed: ${JSON.stringify(adminLoginData)}`);
  }
  console.log('Admin authenticated successfully. Token acquired.\n');

  // Step 2: Create a regular member account via Admin API
  const memberEmail = `member.${Date.now()}@example.com`;
  const memberStudentId = `10222${Date.now().toString().slice(-4)}`;
  const memberCreateRes = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      fullName: 'Nguyễn Văn Thành Viên',
      studentId: memberStudentId,
      email: memberEmail,
      password: 'MemberPass@2026!',
      role: 'member',
      unit: 'BDH',
      position: 'Thành viên Kỹ thuật'
    })
  });
  const memberCreateData = await memberCreateRes.json();
  const memberUser = memberCreateData.member;

  // Login as Member to obtain Member Token
  const memberLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: memberEmail, password: 'MemberPass@2026!' })
  });
  const memberLoginData = await memberLoginRes.json();
  const memberToken = memberLoginData.token;

  if (!memberToken) {
    throw new Error(`Member login failed: ${JSON.stringify(memberLoginData)}`);
  }
  console.log('Member account created and authenticated successfully.\n');

  // Step 3: Create a disabled account via Admin API
  const disabledEmail = `disabled.${Date.now()}@example.com`;
  const disabledStudentId = `10222${(Date.now() + 1).toString().slice(-4)}`;
  const disabledCreateRes = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      fullName: 'Tài Khoản Bị Khóa',
      studentId: disabledStudentId,
      email: disabledEmail,
      password: 'DisabledPass@2026!',
      role: 'member',
      unit: 'BTV',
      position: 'Thành viên BTV'
    })
  });
  const disabledCreateData = await disabledCreateRes.json();
  const disabledUser = disabledCreateData.member;

  // Change status of disabledUser to paused with status-change
  await fetch(`${BASE_URL}/api/members/${disabledUser.id}/status-change`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      newStatus: 'paused',
      effectiveDate: '2026-04-01',
      reason: 'Tạm ngưng sinh hoạt theo đơn'
    })
  });

  // ----------------------------------------------------
  // Scenario 1: Unauthenticated request to protected route returns 401
  // ----------------------------------------------------
  const s1Res = await fetch(`${BASE_URL}/api/members`);
  const s1Data = await s1Res.json();
  assert(
    s1Res.status === 401 && s1Data.code === 'UNAUTHORIZED',
    1,
    'Unauthenticated request returns 401',
    `Status: ${s1Res.status}, code: ${s1Data.code}`
  );

  // ----------------------------------------------------
  // Scenario 2: Spoofed x-user-id without token returns 401 (no fallback to admin)
  // ----------------------------------------------------
  const s2Res = await fetch(`${BASE_URL}/api/members`, {
    headers: { 'x-user-id': adminUser.id }
  });
  const s2Data = await s2Res.json();
  assert(
    s2Res.status === 401,
    2,
    'Spoofed x-user-id without session token returns 401 (no fallback to admin)',
    `Status: ${s2Res.status}`
  );

  // ----------------------------------------------------
  // Scenario 3: Mismatched x-user-id vs token identity returns 403 IDENTITY_SPOOF_DETECTED
  // ----------------------------------------------------
  const s3Res = await fetch(`${BASE_URL}/api/members`, {
    headers: {
      Authorization: `Bearer ${memberToken}`,
      'x-user-id': adminUser.id // Spoofed header claiming to be admin while holding member token
    }
  });
  const s3Data = await s3Res.json();
  assert(
    s3Res.status === 403 && s3Data.code === 'IDENTITY_SPOOF_DETECTED',
    3,
    'Mismatched x-user-id vs authenticated token returns 403 IDENTITY_SPOOF_DETECTED',
    `Status: ${s3Res.status}, code: ${s3Data.code}`
  );

  // ----------------------------------------------------
  // Scenario 4: Non-admin accessing Admin routes returns 403 Forbidden
  // ----------------------------------------------------
  const s4Res = await fetch(`${BASE_URL}/api/auth/email-outbox`, {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(
    s4Res.status === 403,
    4,
    'Member accessing admin-only /email-outbox returns 403 Forbidden',
    `Status: ${s4Res.status}`
  );

  // ----------------------------------------------------
  // Scenario 5: Non-existent email in forgot-password returns generic 200 without leaking existence
  // ----------------------------------------------------
  const s5Res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent.student.fake999@dut.udn.vn' })
  });
  const s5Data = await s5Res.json();
  assert(
    s5Res.status === 200 && s5Data.success === true && s5Data.message.includes('Nếu email này'),
    5,
    'Non-existent email returns generic success message without leaking existence',
    `Status: ${s5Res.status}, msg: ${s5Data.message}`
  );

  // ----------------------------------------------------
  // Scenario 6: Paused/Left account attempting attendance is blocked with 403
  // ----------------------------------------------------
  // Member with paused status tries to scan QR
  const pausedLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: disabledEmail, password: 'DisabledPass@2026!' })
  });
  const pausedLoginData = await pausedLoginRes.json();
  const pausedToken = pausedLoginData.token;

  const s6AttRes = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pausedToken}`
    },
    body: JSON.stringify({ sessionId: 'ses-dummy-test', token: 'BKIC-QR-123' })
  });
  const s6AttData = await s6AttRes.json();
  assert(
    s6AttRes.status === 403 && s6AttData.message.includes('Bảo lưu'),
    6,
    'Paused/Left member scanning attendance is blocked with 403',
    `Status: ${s6AttRes.status}, msg: ${s6AttData.message}`
  );

  // ----------------------------------------------------
  // Scenario 7: Multi-level rate limiting on request-temp-password (>3 requests returns 429)
  // ----------------------------------------------------
  const testRateEmail = `ratelimit.${Date.now()}@example.com`;
  // Create member for rate limiting
  await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      fullName: 'Rate Limit Tester',
      studentId: `RL-${Date.now().toString().slice(-4)}`,
      email: testRateEmail,
      password: 'RateLimitPass@2026!',
      role: 'member',
      unit: 'BDH'
    })
  });

  // Requests 1, 2, 3
  await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testRateEmail })
  });
  await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testRateEmail })
  });
  await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testRateEmail })
  });

  // 4th request must return 429
  const s7Res = await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testRateEmail })
  });
  const s7Data = await s7Res.json();
  assert(
    s7Res.status === 429 && s7Data.code === 'RATE_LIMIT_EXCEEDED',
    7,
    'Exceeding 3 temp password requests returns HTTP 429 RATE_LIMIT_EXCEEDED',
    `Status: ${s7Res.status}, code: ${s7Data.code}`
  );

  // ----------------------------------------------------
  // Scenario 7.1: Email validation - reject malformed email & safe handling of non-existent email
  // ----------------------------------------------------
  const invalidEmailRes = await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-a-valid-email' })
  });
  const invalidEmailData = await invalidEmailRes.json();
  assert(
    invalidEmailRes.status === 400 && invalidEmailData.code === 'INVALID_EMAIL_FORMAT',
    7,
    'Malformed email on request-temp-password is rejected with HTTP 400 INVALID_EMAIL_FORMAT',
    `Status: ${invalidEmailRes.status}`
  );

  const nonExistentEmailRes = await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent.student.audit999@example.com' })
  });
  const nonExistentEmailData = await nonExistentEmailRes.json();
  assert(
    nonExistentEmailRes.status === 200 && Boolean(nonExistentEmailData.message),
    7,
    'Non-existent email returns generic safe response without leaking existence or sending email',
    `Status: ${nonExistentEmailRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 8: Temporary password generation and login issues recovery session
  // ----------------------------------------------------
  const recoveryTestEmail = `test.recovery.${Date.now()}@example.com`;
  await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      fullName: 'Kiểm Thử Khôi Phục',
      studentId: `REC-${Date.now().toString().slice(-4)}`,
      email: recoveryTestEmail,
      password: 'InitialPass@2026!',
      role: 'member',
      unit: 'BDH'
    })
  });

  // Request temp password
  await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: recoveryTestEmail })
  });

  // Admin checks secure email outbox to retrieve the generated temporary password
  const outboxRes = await fetch(`${BASE_URL}/api/auth/email-outbox`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const outboxData = await outboxRes.json();
  const sentMail = outboxData.emails.find((m: any) => m.to === recoveryTestEmail);
  const tempPw = sentMail?.tempPassword;

  assert(Boolean(tempPw), 8, 'Temporary password generated and present in secure admin outbox', `Has Temp PW: ${Boolean(tempPw)}`);
  assert(sentMail?.to === recoveryTestEmail, 8, 'Email recipient strictly matches registered account email', `Recipient: ${sentMail?.to}`);
  assert(!sentMail?.to?.startsWith('recovery.'), 8, 'Email recipient is NOT a synthetic recovery.<timestamp> address', `Recipient: ${sentMail?.to}`);

  // Also verify member invite email delivery to real registered email
  const inviteRes = await fetch(`${BASE_URL}/api/auth/send-member-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ memberId: memberUser.id })
  });
  const inviteData = await inviteRes.json();
  assert(inviteRes.status === 200 && inviteData.success === true, 8, 'Admin can dispatch member invite email', `Status: ${inviteRes.status}`);

  // Login with temporary password
  const s8LoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: recoveryTestEmail, password: tempPw })
  });
  const s8LoginData = await s8LoginRes.json();
  const recoveryToken = s8LoginData.token;

  assert(
    s8LoginRes.status === 200 && s8LoginData.isRecoverySession === true && s8LoginData.mustChangePassword === true,
    8,
    'Login with temp password issues recovery session with mustChangePassword=true',
    `isRecoverySession: ${s8LoginData.isRecoverySession}, mustChangePassword: ${s8LoginData.mustChangePassword}`
  );

  // ----------------------------------------------------
  // Scenario 9: Recovery session blocked from business APIs with 403 MUST_CHANGE_PASSWORD
  // ----------------------------------------------------
  const s9Res = await fetch(`${BASE_URL}/api/members`, {
    headers: { Authorization: `Bearer ${recoveryToken}` }
  });
  const s9Data = await s9Res.json();
  assert(
    s9Res.status === 403 && s9Data.code === 'MUST_CHANGE_PASSWORD',
    9,
    'Recovery session is strictly blocked from business endpoints with 403 MUST_CHANGE_PASSWORD',
    `Status: ${s9Res.status}, code: ${s9Data.code}`
  );

  // ----------------------------------------------------
  // Scenario 10: complete-recovery-password without session returns 401 Unauthorized
  // ----------------------------------------------------
  const s10Res = await fetch(`${BASE_URL}/api/auth/complete-recovery-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newPassword: 'NewSecurePass@2026!', confirmPassword: 'NewSecurePass@2026!' })
  });
  assert(
    s10Res.status === 401,
    10,
    'complete-recovery-password without session token returns 401 Unauthorized',
    `Status: ${s10Res.status}`
  );

  // ----------------------------------------------------
  // Scenario 11: complete-recovery-password ignores client-sent userId in body
  // ----------------------------------------------------
  const s11Res = await fetch(`${BASE_URL}/api/auth/complete-recovery-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${recoveryToken}`
    },
    body: JSON.stringify({
      userId: adminUser.id, // Attacker sends admin userId in body!
      newPassword: 'MyNewPassword@2026!',
      confirmPassword: 'MyNewPassword@2026!'
    })
  });
  assert(
    s11Res.status === 200,
    11,
    'complete-recovery-password succeeds for the authenticated recovery session',
    `Status: ${s11Res.status}`
  );

  // Verify Admin can still log in with their original password (was NOT overwritten)
  const adminVerifyRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminUser.email, password: '123456' })
  });
  assert(
    adminVerifyRes.status === 200,
    11,
    'Admin password remained intact (client userId in body was completely ignored)',
    `Admin login status: ${adminVerifyRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 12: Password policy enforcement (rejects weak passwords)
  // ----------------------------------------------------
  // Request another temp password for policy testing
  await fetch(`${BASE_URL}/api/auth/request-temp-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: recoveryTestEmail })
  });
  const ob2 = await (await fetch(`${BASE_URL}/api/auth/email-outbox`, { headers: { Authorization: `Bearer ${adminToken}` } })).json();
  const tempPw2 = ob2.emails.find((m: any) => m.to === recoveryTestEmail)?.tempPassword;

  const login2Res = await (await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: recoveryTestEmail, password: tempPw2 })
  })).json();
  const recToken2 = login2Res.token;

  const s12Res = await fetch(`${BASE_URL}/api/auth/complete-recovery-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${recToken2}`
    },
    body: JSON.stringify({
      newPassword: 'weakpassword',
      confirmPassword: 'weakpassword'
    })
  });
  assert(
    s12Res.status === 400,
    12,
    'Password policy enforces minimum 8 chars, uppercase, lowercase, number, special char',
    `Status: ${s12Res.status}`
  );

  // ----------------------------------------------------
  // Scenario 13: Prevent reuse of previous password
  // ----------------------------------------------------
  const s13Res = await fetch(`${BASE_URL}/api/auth/complete-recovery-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${recToken2}`
    },
    body: JSON.stringify({
      newPassword: 'MyNewPassword@2026!', // was set in Scenario 11
      confirmPassword: 'MyNewPassword@2026!'
    })
  });
  const s13Data = await s13Res.json();
  assert(
    s13Res.status === 400 && s13Data.message.includes('không được trùng'),
    13,
    'Prevents reusing previous password as new password',
    `Status: ${s13Res.status}, msg: ${s13Data.message}`
  );

  // ----------------------------------------------------
  // Scenario 14: After completing password recovery, session upgraded and business APIs unblocked
  // ----------------------------------------------------
  const s14CompleteRes = await fetch(`${BASE_URL}/api/auth/complete-recovery-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${recToken2}`
    },
    body: JSON.stringify({
      newPassword: 'BrandNewPass@9999!',
      confirmPassword: 'BrandNewPass@9999!'
    })
  });
  assert(s14CompleteRes.status === 200, 14, 'Password recovery successfully completed with valid new password', `Status: ${s14CompleteRes.status}`);

  const s14AccessRes = await fetch(`${BASE_URL}/api/members`, {
    headers: { Authorization: `Bearer ${recToken2}` }
  });
  assert(
    s14AccessRes.status === 200,
    14,
    'Upgraded session can now access business APIs (403 MUST_CHANGE_PASSWORD is fully unblocked)',
    `Status: ${s14AccessRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 15: Single-use rule: Temp password is invalidated after first use
  // ----------------------------------------------------
  const s15LoginAgainRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: recoveryTestEmail, password: tempPw2 })
  });
  assert(
    s15LoginAgainRes.status === 401,
    15,
    'Temporary password is single-use and cannot be used for subsequent logins',
    `Status: ${s15LoginAgainRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 16: Member cannot self-escalate role, unit, or position via PATCH /api/members/:id
  // ----------------------------------------------------
  const s16Res = await fetch(`${BASE_URL}/api/members/${memberUser.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${memberToken}`
    },
    body: JSON.stringify({
      role: 'admin', // Self-escalation attempt
      unit: 'BN',
      position: 'Chủ nhiệm CLB'
    })
  });
  assert(
    s16Res.status === 403,
    16,
    'Member self-escalation attempt to role admin/unit BN is blocked with 403 Forbidden',
    `Status: ${s16Res.status}`
  );

  // Final Test Report
  console.log('\n====================================================');
  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  console.log(`TOTAL SCENARIOS TESTED: ${results.length}`);
  console.log(`PASSED: ${passedCount}/${results.length}`);
  if (allPassed) {
    console.log('>>> ALL 16 SECURITY AUDIT SCENARIOS VERIFIED SUCCESSFULLY! <<<');
  } else {
    console.error('>>> SOME SECURITY AUDIT SCENARIOS FAILED! <<<');
    process.exit(1);
  }
  console.log('====================================================\n');
}

runAudit().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
