// Production Readiness & Edge-Case Security Test Suite
// Pure HTTP integration testing against the running server

const BASE_URL = 'http://127.0.0.1:3000';

async function runProductionReadinessTests() {
  console.log('====================================================');
  console.log('BK-IC DIGITAL HUB - PRODUCTION READINESS TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`[PASS] Scenario ${total}: ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] Scenario ${total}: ${message}`);
      process.exit(1);
    }
  }

  // 1. Verify GET /api/settings does not leak SMTP configuration to public visitors
  const settingsRes = await fetch(`${BASE_URL}/api/settings`);
  const settingsData = await settingsRes.json();
  assert(settingsRes.status === 200, 'Public settings returns 200 OK');
  assert(settingsData.settings && settingsData.settings.smtpConfig === undefined, 'Public settings strictly omits smtpConfig');

  // 2. Admin Login to acquire real session token from server
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin.bkic@dut.udn.vn', password: '123456' })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  assert(Boolean(adminToken), 'Master Admin logged in successfully and acquired server session token');

  // 3. Verify SMTP status is restricted to admin and sanitized
  const unauthSmtpRes = await fetch(`${BASE_URL}/api/auth/smtp-status`);
  assert(unauthSmtpRes.status === 401, 'Unauthenticated access to smtp-status returns 401 Unauthorized');

  const adminSmtpRes = await fetch(`${BASE_URL}/api/auth/smtp-status`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminSmtpData = await adminSmtpRes.json();
  assert(adminSmtpRes.status === 200 && adminSmtpData.success, 'Admin can view sanitized SMTP status');
  assert(!adminSmtpData.pass, 'Admin SMTP status does not return plain text SMTP password');

  // 4. Test disabled account is NOT reactivated on password reset
  const disabledStudentId = `99${Date.now().toString().slice(-6)}`;
  const disabledEmail = `disabled.${Date.now()}@example.com`;
  const createDisabledRes = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      fullName: 'Disabled Test Member',
      studentId: disabledStudentId,
      email: disabledEmail,
      role: 'member',
      unit: 'BDH',
      accountStatus: 'disabled'
    })
  });
  const createDisabledData = await createDisabledRes.json();
  assert(createDisabledRes.status === 200 && createDisabledData.success, 'Admin created disabled test member');

  // Request password reset link for disabled member
  const reqResetRes = await fetch(`${BASE_URL}/api/members/${createDisabledData.member.id}/reset-password`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const reqResetData = await reqResetRes.json();
  assert(reqResetRes.status === 200 && reqResetData.success, 'Admin issued reset link for member');

  // Retrieve reset token from outbox
  const outboxRes = await fetch(`${BASE_URL}/api/auth/email-outbox`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const outboxData = await outboxRes.json();
  const resetEmail = outboxData.emails.find((e: any) => e.to === disabledEmail);
  assert(Boolean(resetEmail && resetEmail.resetLink), 'Reset link found in system outbox');

  const tokenMatch = resetEmail.resetLink.match(/token=([a-f0-9]+)/);
  const rawToken = tokenMatch ? tokenMatch[1] : null;
  assert(Boolean(rawToken), 'Extracted raw reset token from link');

  // Complete reset password with token
  const doResetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: rawToken,
      newPassword: 'BrandNewSecurePass@2026!'
    })
  });
  const doResetData = await doResetRes.json();
  assert(doResetRes.status === 200 && doResetData.success, 'Reset password with token succeeded');

  // Verify that account is STILL disabled and cannot log in
  const tryLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: disabledEmail,
      password: 'BrandNewSecurePass@2026!'
    })
  });
  const tryLoginData = await tryLoginRes.json();
  assert(tryLoginRes.status === 403, 'Disabled account attempting login is blocked with HTTP 403');
  assert(tryLoginData.code === 'ACCOUNT_DISABLED', 'Account error code is strictly ACCOUNT_DISABLED (No auto-activation)');

  // 5. Test applicant cannot check in to attendance meetings
  const applicantStudentId = `88${Date.now().toString().slice(-6)}`;
  const applicantEmail = `applicant.${Date.now()}@example.com`;
  const registerApplRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Candidate Applicant',
      studentId: applicantStudentId,
      email: applicantEmail,
      password: 'ApplicantPass@2026!',
      desiredUnit: 'BDH'
    })
  });
  const registerApplData = await registerApplRes.json();
  assert(registerApplRes.status === 200 && registerApplData.success, 'Applicant registered successfully');
  const applicantToken = registerApplData.token;
  assert(Boolean(applicantToken), 'Applicant acquired session token upon registration');

  // Attempt attendance check-in as applicant
  const sessionsRes = await fetch(`${BASE_URL}/api/sessions`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const sessionsData = await sessionsRes.json();
  const targetSession = sessionsData.sessions[0];

  const checkInRes = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${applicantToken}`
    },
    body: JSON.stringify({
      sessionId: targetSession.id,
      token: 'dummy-qr-token'
    })
  });
  const checkInData = await checkInRes.json();
  assert(checkInRes.status === 403, 'Applicant attempting attendance check-in is rejected with HTTP 403');
  assert(
    checkInData.message && (checkInData.message.includes('kết nạp') || checkInData.message.includes('chưa kích hoạt')),
    'Refusal message correctly explains member induction or activation requirement: ' + checkInData.message
  );

  console.log('\n====================================================');
  console.log(`TOTAL SCENARIOS TESTED: ${total}`);
  console.log(`PASSED: ${passed}/${total}`);
  console.log('>>> ALL PRODUCTION READINESS CHECKS VERIFIED! <<<');
  console.log('====================================================');
}

runProductionReadinessTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
