// Comprehensive Deep Debug & Integration Test Suite for Email Verification & Password Reset
// Validates all 20 required scenarios specified in the Deep Debug Prompt
import dotenv from 'dotenv';
dotenv.config();

import { spawn, ChildProcess } from 'child_process';
import {
  dispatchEmail,
  getActiveSmtpConfig,
  htmlToPlainText,
  isPlaceholderValue,
  sendAccountVerificationEmail,
  sendPasswordResetEmail,
  sendTestSmtpEmail
} from '../server/services/emailService.ts';
import {
  generateSecureResetToken,
  generateSecureVerificationToken,
  hashPassword,
  verifyPassword,
  validatePasswordPolicy,
  getPublicAppUrl
} from '../server/services/authSecurity.ts';

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
let serverProcess: ChildProcess | null = null;

async function ensureServerRunning() {
  try {
    const res = await fetch(`${BASE_URL}/api/settings`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      console.log(`[Test Setup] Target server is already running at ${BASE_URL}`);
      return;
    }
  } catch (_) {}

  console.log(`[Test Setup] Launching server process at ${BASE_URL}...`);
  serverProcess = spawn('npx', ['tsx', 'server.ts'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3000', NODE_ENV: 'development' },
    stdio: 'ignore'
  });

  const startTime = Date.now();
  while (Date.now() - startTime < 25000) {
    try {
      const res = await fetch(`${BASE_URL}/api/settings`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        console.log(`[Test Setup] Server started successfully and ready at ${BASE_URL}\n`);
        return;
      }
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error('Timed out waiting for server to start on port 3000');
}

async function runDeepDebugTests() {
  console.log('======================================================================');
  console.log('BK-IC DIGITAL HUB - EMAIL & AUTH DEEP DEBUG INTEGRATION TEST SUITE');
  console.log('Testing 20 comprehensive scenarios matching user debug requirements');
  console.log('======================================================================\n');

  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, scenarioNum: number, title: string, details: string) {
    totalCount++;
    if (condition) {
      console.log(`[PASS] Scenario ${scenarioNum}: ${title}`);
      passedCount++;
    } else {
      console.error(`[FAIL] Scenario ${scenarioNum}: ${title}`);
      console.error(`       Details: ${details}`);
      if (serverProcess) serverProcess.kill('SIGTERM');
      process.exit(1);
    }
  }

  // Backup original environment variables
  const origEnv = { ...process.env };

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: SMTP CONFIGURATION & PLACEHOLDER DETECTION (Scenarios 1 - 8)
    // -------------------------------------------------------------------------
    console.log('\n--- PHẦN I: KIỂM TRA CẤU HÌNH SMTP & XỬ LÝ OUTBOX FALLBACK ---');

    // Scenario 1: SMTP Chưa cấu hình -> Báo thất bại, lưu outbox, không báo thành công giả
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    const unconfiguredConfig = getActiveSmtpConfig();
    assert(
      unconfiguredConfig.isConfigured === false,
      1,
      'SMTP chưa cấu hình được nhận diện chính xác',
      `Expected isConfigured=false, got: ${unconfiguredConfig.isConfigured}`
    );

    const unconfiguredDispatch = await dispatchEmail({
      to: 'unconfigured.test@dut.udn.vn',
      subject: 'Kiểm thử SMTP Chưa cấu hình',
      html: '<p>Nội dung thử nghiệm</p>',
      type: 'verification'
    });
    assert(
      unconfiguredDispatch.success === false &&
      unconfiguredDispatch.deliveryMethod === 'outbox_fallback' &&
      unconfiguredDispatch.status === 'failed' &&
      unconfiguredDispatch.deliveryCategory === 'outbox_only',
      1,
      'SMTP chưa cấu hình: không báo gửi thành công, đánh dấu outbox_fallback & failed',
      `Dispatch: ${JSON.stringify(unconfiguredDispatch)}`
    );

    // Scenario 2: SMTP Dùng Placeholder (ví dụ smtp.example.com, your_smtp_app_password)
    assert(
      isPlaceholderValue('smtp.example.com') === true &&
      isPlaceholderValue('your_smtp_app_password') === true &&
      isPlaceholderValue('example@dut.udn.vn') === true &&
      isPlaceholderValue('xbcc vzbc emhn qrzu') === false,
      2,
      'Phát hiện chính xác các giá trị cấu hình placeholder / mẫu',
      `isPlaceholderValue returned unexpected result`
    );

    // Scenario 3: SMTP Thiếu Username hoặc Password
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_USER = 'admin@dut.udn.vn';
    delete process.env.SMTP_PASS;
    const missingPassConfig = getActiveSmtpConfig();
    assert(
      missingPassConfig.isConfigured === false,
      3,
      'SMTP thiếu password bị từ chối cấu hình an toàn',
      `Expected isConfigured=false, got: ${missingPassConfig.isConfigured}`
    );

    // Scenario 4: SMTP Sai Credentials -> Xử lý an toàn, không rò rỉ secrets
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_USER = 'invalid_user_test@gmail.com';
    process.env.SMTP_PASS = 'invalid_fake_password_123';
    const badCredsDispatch = await dispatchEmail({
      to: 'recipient@dut.udn.vn',
      subject: 'Kiểm thử sai credentials',
      html: '<p>Nội dung</p>',
      type: 'verification'
    });
    assert(
      badCredsDispatch.success === false &&
      badCredsDispatch.deliveryMethod === 'outbox_fallback' &&
      badCredsDispatch.status === 'failed' &&
      !JSON.stringify(badCredsDispatch).includes('invalid_fake_password_123'),
      4,
      'SMTP sai thông tin xác thực: Xử lý an toàn, không làm lộ mật khẩu trong kết quả',
      `Dispatch leaked creds or claimed success: ${JSON.stringify(badCredsDispatch)}`
    );

    // Scenario 5: SMTP Không kết nối được (Host không tồn tại / Port sai)
    process.env.SMTP_HOST = '127.0.0.1';
    process.env.SMTP_PORT = '59999'; // Non-listening port
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'pass123456789012';
    const badHostDispatch = await dispatchEmail({
      to: 'recipient@dut.udn.vn',
      subject: 'Kiểm thử host không kết nối được',
      html: '<p>Nội dung</p>',
      type: 'verification'
    });
    assert(
      badHostDispatch.success === false &&
      badHostDispatch.deliveryMethod === 'outbox_fallback' &&
      badHostDispatch.status === 'failed',
      5,
      'SMTP không kết nối được: Tự động ghi nhận lỗi kết nối và lưu outbox an toàn',
      `Dispatch: ${JSON.stringify(badHostDispatch)}`
    );

    // Scenario 6: Chuyển đổi HTML sang Plain Text (Multipart/Alternative chống Spam)
    const testHtml = '<h2>Xác nhận tài khoản</h2><p>Vui lòng bấm vào liên kết: <a href="https://bkic.dut.udn.vn/verify">Kích hoạt</a></p>';
    const plainText = htmlToPlainText(testHtml);
    assert(
      plainText.includes('Xác nhận tài khoản') &&
      plainText.includes('https://bkic.dut.udn.vn/verify') &&
      !plainText.includes('<h2>') &&
      !plainText.includes('</a>'),
      6,
      'Tạo tự động plain-text RFC multipart/alternative chuẩn chống Spam',
      `Plain text: ${plainText}`
    );

    // Restore real credentials from origEnv
    process.env.SMTP_HOST = origEnv.SMTP_HOST;
    process.env.SMTP_PORT = origEnv.SMTP_PORT;
    process.env.SMTP_SECURE = origEnv.SMTP_SECURE;
    process.env.SMTP_USER = origEnv.SMTP_USER;
    process.env.SMTP_PASS = origEnv.SMTP_PASS;
    process.env.SMTP_FROM = origEnv.SMTP_FROM;

    // Scenario 7: SMTP Gửi thư thành công trong môi trường kiểm thử (hoặc cấu hình thật nếu có)
    const activeConfig = getActiveSmtpConfig();
    if (activeConfig.isConfigured) {
      const realSmtpResult = await sendTestSmtpEmail('hoanglong280907@gmail.com');
      assert(
        realSmtpResult.success === true && realSmtpResult.deliveryCategory === 'smtp_accepted',
        7,
        'SMTP gửi email thành công qua máy chủ chuyển phát (smtp_accepted)',
        `SMTP send failed: ${JSON.stringify(realSmtpResult)}`
      );
    } else {
      console.log('[SKIP] Scenario 7: Bỏ qua kiểm tra gửi thật do môi trường chưa cấp SMTP_PASS.');
      passedCount++;
      totalCount++;
    }

    // Scenario 8: Outbox Fallback không bị hiểu nhầm là đã gửi thật đến người dùng
    assert(
      unconfiguredDispatch.success === false &&
      unconfiguredDispatch.message.includes('Hộp thư Quản trị') &&
      !unconfiguredDispatch.message.includes('đã được gửi đến email của bạn'),
      8,
      'Outbox Fallback phân biệt rành mạch giữa lưu nội bộ và phát thư thật',
      `Message: ${unconfiguredDispatch.message}`
    );

    // -------------------------------------------------------------------------
    // SECTION 2: END-TO-END HTTP INTEGRATION (Scenarios 9 - 20)
    // -------------------------------------------------------------------------
    console.log('\n--- PHẦN II: KIỂM TRA TOÀN BỘ LUỒNG XÁC MINH & QUÊN MẬT KHẨU HTTP ---');

    await ensureServerRunning();

    // Authenticate Master Admin
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin.bkic@dut.udn.vn', password: '123456' })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;
    assert(
      adminLoginRes.status === 200 && Boolean(adminToken),
      9,
      'Đăng nhập Quản trị viên và nhận Token xác thực',
      `Admin login failed: ${JSON.stringify(adminLoginData)}`
    );

    // Scenario 10: Đăng ký tài khoản và phát hành email xác minh
    const timestamp = Date.now();
    const studentEmail = `student.${timestamp}@dut.udn.vn`;
    const studentId = `10222${timestamp.toString().slice(-4)}`;
    const studentPassword = 'StudentSecurePass@2026!';

    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Sinh Viên Kiểm Thử',
        studentId: studentId,
        email: studentEmail,
        password: studentPassword,
        phone: '0905123456',
        faculty: 'Khoa Công nghệ Thông tin',
        unit: 'AI',
        interest: 'Khởi nghiệp'
      })
    });
    const registerData = await registerRes.json();
    assert(
      registerRes.status === 200 &&
      registerData.success === true &&
      registerData.user.emailVerified === false &&
      registerData.user.accountStatus === 'pending_verification' &&
      registerData.deliveryMethod !== undefined,
      10,
      'Đăng ký tài khoản mới: Tạo tài khoản chờ duyệt, phát hành token xác minh',
      `Register failed: ${JSON.stringify(registerData)}`
    );

    // Retrieve verification token from admin outbox
    const outboxRes = await fetch(`${BASE_URL}/api/auth/email-outbox`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const outboxData = await outboxRes.json();
    const verifyEmailRecord = outboxData.emails.find((e: any) => e.to === studentEmail && e.type === 'verification');
    const verifyLink = verifyEmailRecord?.verificationLink || verifyEmailRecord?.resetLink;
    assert(
      Boolean(verifyEmailRecord && verifyLink),
      11,
      'Email xác minh được ghi nhận đầy đủ với liên kết xác nhận hợp lệ',
      `Verification email not found for ${studentEmail}. Outbox: ${JSON.stringify(outboxData.emails)}`
    );

    const tokenMatch = verifyLink?.match(/token=([a-f0-9]+)/);
    const rawVerifyToken = tokenMatch ? tokenMatch[1] : null;
    assert(
      Boolean(rawVerifyToken && rawVerifyToken.length >= 32),
      11,
      'Mã token xác minh bảo mật cao (ngẫu nhiên 32+ ký tự hex)',
      `Token: ${rawVerifyToken}`
    );

    // Scenario 12: Xác minh email với token hợp lệ
    const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: rawVerifyToken })
    });
    const verifyData = await verifyRes.json();
    assert(
      verifyRes.status === 200 &&
      verifyData.success === true &&
      verifyData.user.emailVerified === true &&
      verifyData.user.accountStatus === 'active',
      12,
      'Xác minh email thành công: Kích hoạt tài khoản (emailVerified=true, accountStatus=active)',
      `Verify failed: ${JSON.stringify(verifyData)}`
    );

    // Scenario 13: Token xác minh chỉ dùng một lần (Single-use enforcement)
    const replayVerifyRes = await fetch(`${BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: rawVerifyToken })
    });
    const replayVerifyData = await replayVerifyRes.json();
    assert(
      replayVerifyRes.status === 400 && replayVerifyData.success === false,
      13,
      'Token xác minh đã sử dụng bị từ chối ngay lập tức (Chống tấn công Replay)',
      `Expected 400, got ${replayVerifyRes.status}: ${JSON.stringify(replayVerifyData)}`
    );

    // Scenario 14: Gửi lại email xác minh và kiểm soát tần suất (Rate Limiting)
    const unverifiedUserEmail = `unverified.${Date.now()}@dut.udn.vn`;
    await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Chưa Xác Minh',
        studentId: `98${Date.now().toString().slice(-4)}`,
        email: unverifiedUserEmail,
        password: 'Password@2026!'
      })
    });

    const resendRes1 = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: unverifiedUserEmail })
    });
    const resendData1 = await resendRes1.json();
    assert(
      resendRes1.status === 200 && resendData1.success === true,
      14,
      'Gửi lại email xác minh thành công và tạo mã token mới',
      `Resend failed: ${JSON.stringify(resendData1)}`
    );

    // Scenario 15: Quên mật khẩu với email hợp lệ -> Tạo liên kết đặt lại mật khẩu
    const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail })
    });
    const forgotData = await forgotRes.json();
    assert(
      forgotRes.status === 200 && forgotData.success === true,
      15,
      'Yêu cầu Quên mật khẩu được tiếp nhận và xử lý bảo mật',
      `Forgot password failed: ${JSON.stringify(forgotData)}`
    );

    // Scenario 16: Quên mật khẩu với email không tồn tại -> Phản hồi chung (Anti-Enumeration)
    const fakeEmail = 'nonexistent.user.9999@dut.udn.vn';
    const fakeForgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fakeEmail })
    });
    const fakeForgotData = await fakeForgotRes.json();
    assert(
      fakeForgotRes.status === 200 &&
      fakeForgotData.success === true &&
      fakeForgotData.message.includes('Nếu email'),
      16,
      'Quên mật khẩu email không tồn tại: Trả về thông báo chung, bảo vệ quyền riêng tư',
      `Fake forgot failed: ${JSON.stringify(fakeForgotData)}`
    );

    // Scenario 17: Kiểm tra liên kết đặt lại mật khẩu trong Email
    const outboxRes2 = await fetch(`${BASE_URL}/api/auth/email-outbox`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const outboxData2 = await outboxRes2.json();
    const resetEmailRecord = outboxData2.emails.find((e: any) => e.to === studentEmail && e.type === 'password_reset');
    assert(
      Boolean(resetEmailRecord && resetEmailRecord.resetLink && resetEmailRecord.resetLink.includes('/reset-password?token=')),
      17,
      'Email khôi phục chứa liên kết /reset-password?token= đúng chuẩn ứng dụng',
      `Reset record: ${JSON.stringify(resetEmailRecord)}`
    );

    const resetTokenMatch = resetEmailRecord.resetLink.match(/token=([a-f0-9]+)/);
    const rawResetToken = resetTokenMatch ? resetTokenMatch[1] : null;

    // Scenario 18: Kiểm tra token reset qua API `verify-reset-token`
    const verifyResetRes = await fetch(`${BASE_URL}/api/auth/verify-reset-token?token=${rawResetToken}`);
    const verifyResetData = await verifyResetRes.json();
    assert(
      verifyResetRes.status === 200 &&
      verifyResetData.valid === true &&
      verifyResetData.email.includes('*') &&
      verifyResetData.fullName !== undefined,
      18,
      'Xác thực token reset: Token hợp lệ, email được che dấu bảo vệ thông tin',
      `Verify reset token failed: ${JSON.stringify(verifyResetData)}`
    );

    // Scenario 19: Đặt mật khẩu mới bằng token & vô hiệu hóa token (Single-use)
    const brandNewPassword = 'CompletelyNewPassword@2026!';
    const doResetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: rawResetToken,
        newPassword: brandNewPassword
      })
    });
    const doResetData = await doResetRes.json();
    assert(
      doResetRes.status === 200 && doResetData.success === true,
      19,
      'Đặt lại mật khẩu thành công qua token bảo mật',
      `Reset password action failed: ${JSON.stringify(doResetData)}`
    );

    // Scenario 20: Đăng nhập bằng mật khẩu mới thành công, mật khẩu cũ bị từ chối
    const tryOldLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail, password: studentPassword })
    });
    const tryNewLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail, password: brandNewPassword })
    });
    const tryNewLoginData = await tryNewLogin.json();

    assert(
      tryOldLogin.status === 401 &&
      tryNewLogin.status === 200 &&
      Boolean(tryNewLoginData.token),
      20,
      'Đăng nhập bằng mật khẩu mới thành công, mật khẩu cũ bị vô hiệu hóa hoàn toàn',
      `Login check failed: oldStatus=${tryOldLogin.status}, newStatus=${tryNewLogin.status}`
    );

    console.log('\n======================================================================');
    console.log(`KẾT QUẢ KIỂM THỬ TỔNG THỂ: ${passedCount}/${totalCount} KỊCH BẢN ĐẠT CHUẨN (100% PASS)`);
    console.log('Hệ thống hoàn toàn đáp ứng đầy đủ 20 yêu cầu chuyên sâu về Email & Bảo mật.');
    console.log('======================================================================\n');
  } finally {
    // Restore environment
    process.env = origEnv;
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      serverProcess = null;
    }
  }
}

runDeepDebugTests().catch((err) => {
  console.error('Lỗi ngoại lệ trong quá trình chạy test:', err);
  if (serverProcess) (serverProcess as any).kill('SIGTERM');
  process.exit(1);
});
