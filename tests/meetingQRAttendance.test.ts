// Comprehensive Verification Test Suite for BK-IC Digital Hub QR Meeting Attendance
// Tests all 16 designated scenarios against running server on 127.0.0.1:3000

const BASE_URL = 'http://127.0.0.1:3000';

interface ScenarioResult {
  number: number;
  title: string;
  passed: boolean;
  notes: string;
}

const results: ScenarioResult[] = [];

function recordScenario(number: number, title: string, passed: boolean, notes: string) {
  results.push({ number, title, passed, notes });
  if (passed) {
    console.log(`[PASS] Scenario ${number}: ${title}`);
  } else {
    console.error(`[FAIL] Scenario ${number}: ${title} - ${notes}`);
  }
}

async function runMeetingQRTests() {
  console.log('================================================================');
  console.log('BK-IC DIGITAL HUB - REAL-WORLD QR MEETING ATTENDANCE TEST SUITE');
  console.log('================================================================\n');

  // 1. Admin Login
  const adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin.bkic@dut.udn.vn', password: '123456' })
  });
  const adminData = await adminRes.json();
  const adminToken = adminData.token;
  if (!adminToken) throw new Error('Cannot login as admin');

  // Helper to create test member
  const createMember = async (name: string, unit: string, status: string = 'active', accountStatus: string = 'active') => {
    const uniqueSuffix = `${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
    const email = `test.mem.${uniqueSuffix}@dut.udn.vn`;
    const studentId = `10${uniqueSuffix}`;
    const res = await fetch(`${BASE_URL}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        fullName: name,
        studentId,
        email,
        password: 'Password@2026!',
        role: 'member',
        unit,
        position: 'Thành viên',
        status,
        accountStatus,
        faculty: 'CNTT',
        classId: '24T_CLC',
        academicYear: 'K24'
      })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Failed to create member ${email}: ${JSON.stringify(data)}`);
    }
    return { member: data.member, email, password: 'Password@2026!' };
  };

  // Helper to login as a user
  const loginUser = async (email: string, password: string = 'Password@2026!') => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Failed to login user ${email}: ${JSON.stringify(data)}`);
    }
    return data;
  };

  // Helper to create test session
  const createSession = async (title: string, date: string, startTime: string, endTime: string, targetAudience: string = 'Tất cả thành viên') => {
    const res = await fetch(`${BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title,
        description: 'Test session for QR attendance validation',
        date,
        startTime,
        endTime,
        location: 'Phòng Hội thảo Smart Campus BK-IC',
        targetAudience,
        personInChargeId: adminData.user.id
      })
    });
    const data = await res.json();
    return data.session;
  };

  // Get current time in Vietnam (HH:mm)
  const nowVN = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const todayStr = `${nowVN.getFullYear()}-${String(nowVN.getMonth() + 1).padStart(2, '0')}-${String(nowVN.getDate()).padStart(2, '0')}`;
  
  // Safe date/time math with automatic calendar day adjustment
  const pad = (n: number) => String(n).padStart(2, '0');
  const getOffsetDateTime = (offsetMinutes: number) => {
    const d = new Date(nowVN.getTime() + offsetMinutes * 60 * 1000);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return { dateStr, timeStr };
  };

  // Create an active session starting 2 minutes ago (within on_time window)
  const { dateStr: activeDateStr, timeStr: activeStartTime } = getOffsetDateTime(-2);
  const { timeStr: activeEndTime } = getOffsetDateTime(120);

  const activeSession = await createSession('Buổi Sinh Hoạt Kỹ Thuật Toàn CLB', activeDateStr, activeStartTime, activeEndTime);

  // SCENARIO 1: Quét QR khi chưa đăng nhập -> Public session-info endpoint accessible without auth
  const publicInfoRes = await fetch(`${BASE_URL}/api/attendance/session-info/${activeSession.id}`);
  const publicInfoData = await publicInfoRes.json();
  const s1Passed = publicInfoRes.status === 200 && publicInfoData.success === true && publicInfoData.session.title === activeSession.title;
  recordScenario(1, 'Truy cập thông tin meeting khi chưa đăng nhập', s1Passed,
    s1Passed ? `Trả về thông tin session "${publicInfoData.session.title}" mà không cần token` : JSON.stringify(publicInfoData));

  // Create standard test member
  const { member: mem1, email: email1 } = await createMember('Lê Thành Nam', 'BDH', 'active', 'active');
  const login1 = await loginUser(email1);
  const token1 = login1.token;

  // SCENARIO 2: Quét QR khi đã đăng nhập hợp lệ -> điểm danh thành công với tài khoản đang đăng nhập
  const checkin2Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token1}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const checkin2Data = await checkin2Res.json();
  const s2Passed = checkin2Res.status === 200 && checkin2Data.success === true && checkin2Data.record?.memberId === mem1.id && checkin2Data.alreadyCheckedIn === false;
  recordScenario(2, 'Điểm danh hợp lệ khi đã đăng nhập', s2Passed,
    s2Passed ? `Ghi nhận thành công cho ${mem1.fullName} - Status: ${checkin2Data.status}` : JSON.stringify(checkin2Data));

  // SCENARIO 3: Quét QR nhiều lần cùng một tài khoản -> hiển thị thông báo đã điểm danh, không tạo bản ghi mới
  const checkin3Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token1}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const checkin3Data = await checkin3Res.json();
  // Check that records list for activeSession still only has 1 record for this member
  const listAttRes = await fetch(`${BASE_URL}/api/attendance?sessionId=${activeSession.id}&memberId=${mem1.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const listAttData = await listAttRes.json();
  const s3Passed = checkin3Data.success === true && checkin3Data.alreadyCheckedIn === true && listAttData.attendance.length === 1 && checkin3Data.message.includes('Bạn đã điểm danh buổi meeting này lúc');
  recordScenario(3, 'Quét QR lặp lại nhiều lần (Chống trùng lặp)', s3Passed,
    s3Passed ? `Phát hiện bản ghi cũ: ${checkin3Data.message}` : JSON.stringify(checkin3Data));

  // SCENARIO 4: Quét QR với email không có trong hệ thống -> từ chối, không thể đăng nhập
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'stranger@gmail.com', password: 'randompassword' })
  });
  const badLoginData = await badLoginRes.json();
  const s4Passed = badLoginRes.status === 401 || badLoginData.success === false;
  recordScenario(4, 'Tài khoản không tồn tại trong hệ thống', s4Passed,
    s4Passed ? 'Từ chối đăng nhập với email chưa đăng ký trong BK-IC' : JSON.stringify(badLoginData));

  // SCENARIO 5: Quét QR với tài khoản đang bị bảo lưu, đình chỉ hoặc rời CLB -> từ chối (403)
  const { member: memPaused, email: emailPaused } = await createMember('Trần Văn Bảo Lưu', 'BDH', 'paused', 'active');
  const loginPaused = await loginUser(emailPaused);
  const checkin5Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPaused.token}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const checkin5Data = await checkin5Res.json();
  const s5Passed = checkin5Res.status === 403 && checkin5Data.success === false && checkin5Data.message.includes('Bảo lưu');
  recordScenario(5, 'Tài khoản bảo lưu/đình chỉ không thể điểm danh', s5Passed,
    s5Passed ? `Từ chối thành công: ${checkin5Data.message}` : JSON.stringify(checkin5Data));

  // SCENARIO 6: Quét QR với tài khoản chưa kích hoạt hoặc bị tạm khóa -> từ chối (403)
  const { member: memDisabled, email: emailDisabled } = await createMember('Nguyễn Văn Khóa', 'BDH', 'active', 'active');
  const loginDisabled = await loginUser(emailDisabled);
  // Khóa tài khoản sau khi đã cấp phiên đăng nhập
  await fetch(`${BASE_URL}/api/members/${memDisabled.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ accountStatus: 'disabled' })
  });
  const checkin6Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginDisabled.token}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const checkin6Data = await checkin6Res.json();
  const s6Passed = checkin6Res.status === 403 && checkin6Data.success === false && checkin6Data.message.includes('tạm khóa');
  recordScenario(6, 'Tài khoản bị tạm khóa / vô hiệu hóa', s6Passed,
    s6Passed ? `Từ chối thành công: ${checkin6Data.message}` : JSON.stringify(checkin6Data));

  // SCENARIO 7: Quét QR với tài khoản thuộc ban khác khi meeting giới hạn ban -> từ chối (403)
  const restrictedSession = await createSession('Họp Kín Ban Thành Viên', todayStr, activeStartTime, activeEndTime, 'Ban Thành viên BTV');
  const { member: memBDH, email: emailBDH } = await createMember('Phạm Thị Điều Hành', 'BDH', 'active', 'active');
  const loginBDH = await loginUser(emailBDH);
  const checkin7Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginBDH.token}`
    },
    body: JSON.stringify({ sessionId: restrictedSession.id })
  });
  const checkin7Data = await checkin7Res.json();
  const s7Passed = checkin7Res.status === 403 && checkin7Data.success === false && checkin7Data.message.includes('dành riêng cho đối tượng');
  recordScenario(7, 'Kiểm tra tính hợp lệ đối tượng tham gia meeting', s7Passed,
    s7Passed ? `Từ chối ban không khớp: ${checkin7Data.message}` : JSON.stringify(checkin7Data));

  // SCENARIO 8: Quét QR trước giờ mở điểm danh (-15 phút) -> từ chối
  // Session in future: +60 mins from now (safely handling midnight date rollover)
  const { dateStr: futureDateStr, timeStr: futureStartTime } = getOffsetDateTime(60);
  const { timeStr: futureEndTime } = getOffsetDateTime(180);
  const futureSession = await createSession('Buổi Họp Tương Lai', futureDateStr, futureStartTime, futureEndTime);
  const { member: mem8, email: email8 } = await createMember('Học Viên 8', 'BDH', 'active', 'active');
  const login8 = await loginUser(email8);
  const checkin8Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login8.token}`
    },
    body: JSON.stringify({ sessionId: futureSession.id })
  });
  const checkin8Data = await checkin8Res.json();
  const s8Passed = checkin8Res.status === 400 && checkin8Data.success === false && checkin8Data.message.includes('Cửa sổ QR chưa mở');
  recordScenario(8, 'Quét QR trước giờ mở điểm danh (-15 phút)', s8Passed,
    s8Passed ? `Từ chối thành công: ${checkin8Data.message}` : JSON.stringify(checkin8Data));

  // SCENARIO 9: Quét QR đúng giờ (trong vòng 10 phút sau giờ bắt đầu) -> ghi nhận on_time (present)
  // activeSession started 2 minutes ago, so status should be 'present'
  const { member: mem9, email: email9 } = await createMember('Học Viên Đúng Giờ', 'BDH', 'active', 'active');
  const login9 = await loginUser(email9);
  const checkin9Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login9.token}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const checkin9Data = await checkin9Res.json();
  const s9Passed = checkin9Res.status === 200 && checkin9Data.status === 'present' && checkin9Data.statusText === 'Có mặt đúng giờ';
  recordScenario(9, 'Quét QR đúng giờ (≤ 10 phút sau giờ bắt đầu)', s9Passed,
    s9Passed ? `Ghi nhận on_time (present): ${checkin9Data.statusText}` : JSON.stringify(checkin9Data));

  // SCENARIO 10: Quét QR từ phút 10 đến phút 15 sau giờ bắt đầu -> ghi nhận late
  // Session started 12 minutes ago
  const { dateStr: lateDateStr, timeStr: lateStartTime } = getOffsetDateTime(-12);
  const { timeStr: lateEndTime } = getOffsetDateTime(120);
  const lateSession = await createSession('Buổi Họp Đã Chạy 12 Phút', lateDateStr, lateStartTime, lateEndTime);
  const { member: mem10, email: email10 } = await createMember('Học Viên Đến Muộn', 'BDH', 'active', 'active');
  const login10 = await loginUser(email10);
  const checkin10Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login10.token}`
    },
    body: JSON.stringify({ sessionId: lateSession.id })
  });
  const checkin10Data = await checkin10Res.json();
  const s10Passed = checkin10Res.status === 200 && checkin10Data.status === 'late' && checkin10Data.statusText === 'Đi trễ';
  recordScenario(10, 'Quét QR trong khoảng 10-15 phút sau giờ bắt đầu (Đi trễ)', s10Passed,
    s10Passed ? `Ghi nhận late: ${checkin10Data.statusText}` : JSON.stringify(checkin10Data));

  // SCENARIO 11: Quét QR sau khi đóng điểm danh (+15 phút) -> từ chối
  // Session started 30 minutes ago
  const { dateStr: closedDateStr, timeStr: closedStartTime } = getOffsetDateTime(-30);
  const { timeStr: closedEndTime } = getOffsetDateTime(120);
  const closedSession = await createSession('Buổi Họp Đã Đóng Cửa Sổ QR', closedDateStr, closedStartTime, closedEndTime);
  const { member: mem11, email: email11 } = await createMember('Học Viên Quá Hạn', 'BDH', 'active', 'active');
  const login11 = await loginUser(email11);
  const checkin11Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login11.token}`
    },
    body: JSON.stringify({ sessionId: closedSession.id })
  });
  const checkin11Data = await checkin11Res.json();
  const s11Passed = checkin11Res.status === 400 && checkin11Data.success === false && checkin11Data.message.includes('Cửa sổ QR đã đóng');
  recordScenario(11, 'Quét QR sau khi đóng điểm danh (> 15 phút)', s11Passed,
    s11Passed ? `Từ chối thành công: ${checkin11Data.message}` : JSON.stringify(checkin11Data));

  // SCENARIO 12: Quét QR của meeting đã bị hủy -> từ chối
  const cancelledSession = await createSession('Buổi Họp Bị Hủy Đột Xuất', todayStr, activeStartTime, activeEndTime);
  await fetch(`${BASE_URL}/api/sessions/${cancelledSession.id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ reason: 'Giảng đường bảo trì hệ thống điện' })
  });
  const { member: mem12, email: email12 } = await createMember('Học Viên 12', 'BDH', 'active', 'active');
  const login12 = await loginUser(email12);
  const checkin12Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login12.token}`
    },
    body: JSON.stringify({ sessionId: cancelledSession.id })
  });
  const checkin12Data = await checkin12Res.json();
  const s12Passed = checkin12Res.status === 400 && checkin12Data.message.includes('đã bị hủy');
  recordScenario(12, 'Quét QR của meeting đã bị hủy', s12Passed,
    s12Passed ? `Từ chối đúng: ${checkin12Data.message}` : JSON.stringify(checkin12Data));

  // SCENARIO 13: Quét QR của meeting đã chốt danh sách -> từ chối
  const finalizeSession = await createSession('Buổi Họp Đã Chốt Sổ', todayStr, activeStartTime, activeEndTime);
  await fetch(`${BASE_URL}/api/attendance/finalize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ sessionId: finalizeSession.id })
  });
  const { member: mem13, email: email13 } = await createMember('Học Viên 13', 'BDH', 'active', 'active');
  const login13 = await loginUser(email13);
  const checkin13Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login13.token}`
    },
    body: JSON.stringify({ sessionId: finalizeSession.id })
  });
  const checkin13Data = await checkin13Res.json();
  const s13Passed = checkin13Res.status === 400 && checkin13Data.message.includes('đã được chốt');
  recordScenario(13, 'Quét QR của meeting đã chốt danh sách', s13Passed,
    s13Passed ? `Từ chối đúng: ${checkin13Data.message}` : JSON.stringify(checkin13Data));

  // SCENARIO 14: Trình chiếu QR sinh ra token xoay vòng hợp lệ
  const qrTokenRes = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const qrTokenData = await qrTokenRes.json();
  const s14Passed = qrTokenRes.status === 200 && qrTokenData.token && qrTokenData.token.startsWith('BKIC-QR-') && qrTokenData.expiresIn > 0;
  recordScenario(14, 'Tạo mã QR xoay vòng thời gian thực', s14Passed,
    s14Passed ? `Token sinh ra: ${qrTokenData.token} (Hạn: ${qrTokenData.expiresIn}s)` : JSON.stringify(qrTokenData));

  // SCENARIO 15: Quét mã QR xoay vòng đã cũ (hết hạn slot) -> từ chối
  const expiredFakeToken = `BKIC-QR-${activeSession.id.slice(-6)}-ZZZZ-0000`;
  const { member: mem15, email: email15 } = await createMember('Học Viên 15', 'BDH', 'active', 'active');
  const login15 = await loginUser(email15);
  const checkin15Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login15.token}`
    },
    body: JSON.stringify({ sessionId: activeSession.id, token: expiredFakeToken })
  });
  const checkin15Data = await checkin15Res.json();
  const s15Passed = checkin15Res.status === 400 && checkin15Data.message.includes('hết hạn xoay vòng');
  recordScenario(15, 'Mã QR xoay vòng hết hạn', s15Passed,
    s15Passed ? `Từ chối token cũ: ${checkin15Data.message}` : JSON.stringify(checkin15Data));

  // SCENARIO 16: Điểm danh thủ công bởi Người phụ trách / BTV -> ghi nhận đúng, lưu audit log
  const { member: memManual } = await createMember('Học Viên Quên Điện Thoại', 'BDH', 'active', 'active');
  const manualRes = await fetch(`${BASE_URL}/api/attendance/manual-checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      sessionId: activeSession.id,
      memberId: memManual.id,
      status: 'present',
      notes: 'Điểm danh thủ công tại cửa hội trường (không mang điện thoại)'
    })
  });
  const manualData = await manualRes.json();
  // Check audit log
  const auditRes = await fetch(`${BASE_URL}/api/audit-logs`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const auditData = await auditRes.json();
  const foundAudit = auditData.logs?.some((l: any) => l.action.includes('Điểm danh thủ công') && l.details.includes(memManual.fullName));

  const s16Passed = manualRes.status === 200 && manualData.success === true && foundAudit === true;
  recordScenario(16, 'Điểm danh thủ công bởi PIC/BTV kèm Audit Log', s16Passed,
    s16Passed ? `Ghi nhận thủ công và lưu Audit Log: ${manualData.record.memberName}` : JSON.stringify(manualData));

  // SCENARIO 17: Hai request điểm danh đồng thời (Concurrency) -> Chỉ tạo đúng 1 bản ghi
  const { member: memConcurrent, email: emailConcurrent } = await createMember('Học Viên Gửi Song Song', 'BDH', 'active', 'active');
  const loginConcurrent = await loginUser(emailConcurrent);
  const [resA, resB] = await Promise.all([
    fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginConcurrent.token}`
      },
      body: JSON.stringify({ sessionId: activeSession.id })
    }),
    fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginConcurrent.token}`
      },
      body: JSON.stringify({ sessionId: activeSession.id })
    })
  ]);
  const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);
  const checkRecordsRes = await fetch(`${BASE_URL}/api/attendance?sessionId=${activeSession.id}&memberId=${memConcurrent.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const checkRecordsData = await checkRecordsRes.json();
  const s17Passed = checkRecordsData.attendance.length === 1 && (dataA.success === true || dataB.success === true);
  recordScenario(17, 'Hai request điểm danh đồng thời (Chống race condition)', s17Passed,
    s17Passed ? `Chỉ 1 bản ghi duy nhất được tạo cho ${memConcurrent.fullName}` : `A: ${JSON.stringify(dataA)}, B: ${JSON.stringify(dataB)}`);

  // SCENARIO 18: Cố tình giả mạo hoặc đổi memberId trong body để điểm danh hộ người khác -> Bị bỏ qua, chỉ điểm danh cho chính mình
  const { member: victimMember } = await createMember('Nạn Nhân Điểm Danh Hộ', 'BDH', 'active', 'active');
  const { member: hackerMember, email: emailHacker } = await createMember('Kẻ Thử Giả Mạo', 'BDH', 'active', 'active');
  const loginHacker = await loginUser(emailHacker);
  const spoofRes = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginHacker.token}`
    },
    body: JSON.stringify({
      sessionId: activeSession.id,
      memberId: victimMember.id, // Trying to spoof identity
      userId: victimMember.id,
      email: victimMember.email
    })
  });
  const spoofData = await spoofRes.json();
  // The created record MUST belong to hackerMember, NOT victimMember
  const s18Passed = spoofRes.status === 200 && spoofData.record?.memberId === hackerMember.id && spoofData.record?.memberId !== victimMember.id;
  recordScenario(18, 'Chống đổi memberId trong body để điểm danh cho người khác', s18Passed,
    s18Passed ? `Backend chỉ ghi nhận cho tài khoản trong session (${spoofData.record?.memberName}), bỏ qua memberId gửi từ client` : JSON.stringify(spoofData));

  // SCENARIO 19: Gửi sessionId không tồn tại -> Từ chối 404
  const notFoundRes = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginHacker.token}`
    },
    body: JSON.stringify({ sessionId: 'ses-non-existent-999999' })
  });
  const notFoundData = await notFoundRes.json();
  const s19Passed = notFoundRes.status === 404 && notFoundData.success === false;
  recordScenario(19, 'Quét QR với mã meeting không tồn tại (404)', s19Passed,
    s19Passed ? `Từ chối thành công: ${notFoundData.message}` : JSON.stringify(notFoundData));

  // SCENARIO 20: Thành viên thường cố tình gọi API tạo QR Token -> Bị chặn 403 Forbidden
  const tokenGenRes = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginHacker.token}`
    },
    body: JSON.stringify({ sessionId: activeSession.id })
  });
  const tokenGenData = await tokenGenRes.json();
  const s20Passed = tokenGenRes.status === 403 && tokenGenData.success === false;
  recordScenario(20, 'Thành viên thường không có quyền tạo/hiển thị QR xoay vòng', s20Passed,
    s20Passed ? `Chặn thành công 403: ${tokenGenData.message}` : JSON.stringify(tokenGenData));

  // SCENARIO 21 (Phần 5): Tài khoản thành viên đã được duyệt điểm danh thành công phiên "Toàn thể thành viên chính thức"
  const allOfficialSession = await createSession(
    'Sinh Hoạt Toàn CLB - Tất Cả Thành Viên',
    todayStr,
    activeStartTime,
    activeEndTime,
    'Toàn thể thành viên chính thức'
  );
  const { member: approvedMember, email: emailApproved } = await createMember('Trần Thị Chính Thức', 'BDH', 'active', 'active');
  const loginApproved = await loginUser(emailApproved);
  const checkin21Res = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginApproved.token}`
    },
    body: JSON.stringify({ sessionId: allOfficialSession.id })
  });
  const checkin21Data = await checkin21Res.json();
  const s21Passed = checkin21Res.status === 200 && checkin21Data.success === true && checkin21Data.record?.memberId === approvedMember.id;
  recordScenario(21, 'Tài khoản được duyệt điểm danh phiên "Toàn thể thành viên chính thức" thành công', s21Passed,
    s21Passed ? `Điểm danh thành công cho ${approvedMember.fullName} (Đơn vị: ${approvedMember.unit})` : JSON.stringify(checkin21Data));

  // SCENARIO 22 (Phần 2): Tạo phiên với đối tượng tùy chọn ("Ban Truyền thông") -> Lưu và đọc lại chính xác, không tự đổi thành mặc định
  const customTargetRes = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Workshop Chuyên sâu Ban Truyền thông & Media',
      description: 'Đào tạo kỹ năng thiết kế và truyền thông số',
      date: todayStr,
      startTime: activeStartTime,
      endTime: activeEndTime,
      location: 'Phòng Lab Media',
      targetParticipants: 'Ban Truyền thông',
      personInChargeId: adminData.user.id
    })
  });
  const customTargetData = await customTargetRes.json();
  const createdSId = customTargetData.session?.id;
  
  // Fetch session details back from GET /api/sessions/:id
  const getDetailRes = await fetch(`${BASE_URL}/api/sessions/${createdSId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const getDetailData = await getDetailRes.json();
  const fetchedTarget = getDetailData.session?.targetAudience || getDetailData.session?.targetParticipants;
  const s22Passed = customTargetRes.status === 200 && fetchedTarget === 'Ban Truyền thông';
  recordScenario(22, 'Lưu và hiển thị chính xác đối tượng tham gia tùy chọn ("Ban Truyền thông")', s22Passed,
    s22Passed ? `Đối tượng lưu và đọc lại chính xác: "${fetchedTarget}"` : JSON.stringify(getDetailData));

  // SCENARIO 23 (Phần 3 & 4): Tự động chuyển trạng thái phiên (scheduled -> ongoing -> ended) và tự động mở/đóng điểm danh theo lịch
  const getOngoingRes = await fetch(`${BASE_URL}/api/sessions/${activeSession.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const getOngoingData = await getOngoingRes.json();
  const activeStatus = getOngoingData.session?.status;
  const activeAttStatus = getOngoingData.session?.attendanceStatus;
  const s23Passed = (activeStatus === 'ongoing' || activeStatus === 'open') && activeAttStatus === 'open';
  recordScenario(23, 'Tự động chuyển trạng thái phiên và tự động mở điểm danh theo giờ hệ thống', s23Passed,
    s23Passed ? `Phiên "${activeSession.title}": status="${activeStatus}", attendanceStatus="${activeAttStatus}"` : JSON.stringify(getOngoingData));

  // Summary
  console.log('\n================================================================');
  console.log(`SUMMARY OF ${results.length} TEST SCENARIOS:`);
  console.log('================================================================');
  const totalPassed = results.filter(r => r.passed).length;
  console.log(`Passed: ${totalPassed} / ${results.length}`);

  if (totalPassed === results.length) {
    console.log(`ALL ${results.length} SCENARIOS PASSED WITH 100% SUCCESS RATE!`);
  } else {
    console.error('SOME SCENARIOS FAILED. Check details above.');
    process.exit(1);
  }
}

runMeetingQRTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
