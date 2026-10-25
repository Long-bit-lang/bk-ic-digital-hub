// Targeted Test Suite: Person-in-Charge (PIC) Meeting Authorization & Dynamic QR Projection
// Verifies server-side authorization, gate control, isolation, reassignment, and anti-tamper mechanisms

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

async function runPicMeetingTests() {
  console.log('========================================================================');
  console.log('BK-IC DIGITAL HUB - PERSON IN CHARGE (PIC) MEETING & QR PROJECTION TESTS');
  console.log('========================================================================\n');

  // 1. Login as Admin
  const adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin.bkic@dut.udn.vn', password: '123456' })
  });
  const adminData = await adminRes.json();
  const adminToken = adminData.token;
  if (!adminToken) throw new Error('Cannot login as admin');

  // Helper to create member
  const createMember = async (name: string, unit: string) => {
    const unique = `${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
    const email = `pic.mem.${unique}@dut.udn.vn`;
    const studentId = `11${unique}`;
    const password = 'Password@2026!';
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
        password,
        role: 'member',
        unit,
        position: 'Thành viên',
        status: 'active',
        accountStatus: 'active',
        faculty: 'CNTT',
        academicYear: 'K24'
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(`Create member failed: ${JSON.stringify(data)}`);
    return { member: data.member, email, password };
  };

  const loginUser = async (email: string, password: string = 'Password@2026!') => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  };

  // Create Member A (regular member) and Member B (regular member)
  const memAInfo = await createMember('Nguyễn Văn Phụ Trách A', 'BDH');
  const memBInfo = await createMember('Trần Thị Phụ Trách B', 'BDH');

  const memALogin = await loginUser(memAInfo.email, memAInfo.password);
  const memBLogin = await loginUser(memBInfo.email, memBInfo.password);

  const tokenA = memALogin.token;
  const tokenB = memBLogin.token;

  // Create Meeting 1 assigned to Member A
  const session1Res = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Hội thảo AI & Robotics 2026',
      description: 'Phân công Member A làm người phụ trách meeting',
      date: '2026-10-23',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Hội trường C102',
      personInChargeId: memAInfo.member.id,
      targetAudience: 'Toàn thể thành viên chính thức'
    })
  });
  const session1Data = await session1Res.json();
  const session1 = session1Data.session;

  // Create Meeting 2 assigned to Admin/BN (Member A is NOT PIC)
  const session2Res = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Họp giao ban Ban Chủ nhiệm',
      description: 'Meeting nội bộ BCN',
      date: '2026-10-23',
      startTime: '17:00',
      endTime: '19:00',
      location: 'Văn phòng BK-IC',
      targetAudience: 'Ban Chủ nhiệm'
    })
  });
  const session2Data = await session2Res.json();
  const session2 = session2Data.session;

  // SCENARIO 1: Member A (assigned PIC) logs in and gets QR token for Meeting 1
  const qrA1Res = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({ sessionId: session1.id })
  });
  const qrA1Data = await qrA1Res.json();
  recordScenario(
    1,
    'Người phụ trách (Member A) tạo và lấy mã QR xoay vòng thành công cho meeting được phân công',
    qrA1Res.status === 200 && qrA1Data.success && typeof qrA1Data.token === 'string' && qrA1Data.token.startsWith('BKIC-QR-'),
    `Status: ${qrA1Res.status}, token: ${qrA1Data.token}`
  );

  // SCENARIO 2: Member B (NOT PIC) attempts to get QR token for Meeting 1
  const qrB1Res = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({ sessionId: session1.id })
  });
  const qrB1Data = await qrB1Res.json();
  recordScenario(
    2,
    'Thành viên khác (Member B) không được phân công bị chặn 403 khi cố mở mã QR của Meeting 1',
    qrB1Res.status === 403 && qrB1Data.success === false,
    `Status: ${qrB1Res.status}, Message: ${qrB1Data.message}`
  );

  // SCENARIO 3: Member A attempts to get QR token for Meeting 2 where A is NOT PIC
  const qrA2Res = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({ sessionId: session2.id })
  });
  const qrA2Data = await qrA2Res.json();
  recordScenario(
    3,
    'Member A bị chặn 403 khi cố mở QR cho meeting khác (Meeting 2) mà mình không phụ trách',
    qrA2Res.status === 403 && qrA2Data.success === false,
    `Status: ${qrA2Res.status}, Message: ${qrA2Data.message}`
  );

  // SCENARIO 4: Unauthenticated request to get QR token is rejected with 401
  const qrAnonRes = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: session1.id })
  });
  recordScenario(
    4,
    'Request chưa đăng nhập bị từ chối 401 khi gọi API QR token',
    qrAnonRes.status === 401,
    `Status: ${qrAnonRes.status}`
  );

  // SCENARIO 5: Member A attempts to transfer personInChargeId to Member B (Anti-Privilege Escalation)
  const tamperPicRes = await fetch(`${BASE_URL}/api/sessions/${session1.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({ personInChargeId: memBInfo.member.id })
  });
  const tamperPicData = await tamperPicRes.json();
  recordScenario(
    5,
    'Người phụ trách (Member A) không được phép tự ý thay đổi hoặc chuyển quyền PIC cho người khác (Chặn 403)',
    tamperPicRes.status === 403 && tamperPicData.success === false,
    `Status: ${tamperPicRes.status}, Message: ${tamperPicData.message}`
  );

  // SCENARIO 6: Member A toggles attendance gate (Open and Close) for Meeting 1
  const openGateRes = await fetch(`${BASE_URL}/api/sessions/${session1.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      attendanceStatus: 'open',
      status: 'ongoing',
      timeChangeReason: 'PIC A mở cổng điểm danh'
    })
  });
  const openGateData = await openGateRes.json();
  recordScenario(
    6,
    'Người phụ trách (Member A) mở cổng điểm danh thành công cho meeting của mình',
    openGateRes.status === 200 && openGateData.success && openGateData.session.attendanceStatus === 'open',
    `Status: ${openGateRes.status}, AttendanceStatus: ${openGateData.session?.attendanceStatus}`
  );

  // SCENARIO 7: Member B attends Meeting 1 via dynamic QR scan
  const checkinBRes = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({
      sessionId: session1.id,
      token: qrA1Data.token
    })
  });
  const checkinBData = await checkinBRes.json();
  recordScenario(
    7,
    'Thành viên quét mã QR do Member A trình chiếu và ghi nhận điểm danh thành công',
    checkinBRes.status === 200 && checkinBData.success && (checkinBData.status === 'present' || checkinBData.status === 'late'),
    `Status: ${checkinBRes.status}, Attendance Status: ${checkinBData.status}`
  );

  // SCENARIO 8: Member A (PIC) views attendance records for Meeting 1 (sees Member B's checkin)
  const attListPicRes = await fetch(`${BASE_URL}/api/attendance?sessionId=${session1.id}`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  const attListPicData = await attListPicRes.json();
  const picSeesAttendee = attListPicData.attendance?.some((a: any) => a.memberId === memBInfo.member.id);
  recordScenario(
    8,
    'Người phụ trách (Member A) xem được danh sách thành viên đã điểm danh của meeting mình phụ trách',
    attListPicRes.status === 200 && attListPicData.success && picSeesAttendee,
    `Records count: ${attListPicData.attendance?.length}, Sees attendee B: ${picSeesAttendee}`
  );

  // SCENARIO 9: Member B attempts to view attendance roster of Meeting 1
  const attListNonPicRes = await fetch(`${BASE_URL}/api/attendance?sessionId=${session1.id}`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  const attListNonPicData = await attListNonPicRes.json();
  // Member B should only see their own record, NOT Member A or other attendees
  const nonPicSeesOnlySelf = attListNonPicData.attendance?.every((a: any) => a.memberId === memBInfo.member.id);
  recordScenario(
    9,
    'Thành viên thường (Member B) chỉ thấy bản ghi của chính mình, không xem được danh sách người khác',
    attListNonPicRes.status === 200 && nonPicSeesOnlySelf,
    `Records visible: ${attListNonPicData.attendance?.length}`
  );

  // SCENARIO 10: Admin reassigns Meeting 1 from Member A to Member B
  const reassignRes = await fetch(`${BASE_URL}/api/sessions/${session1.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ personInChargeId: memBInfo.member.id })
  });
  const reassignData = await reassignRes.json();
  recordScenario(
    10,
    'Admin phân công lại Người phụ trách từ Member A sang Member B thành công',
    reassignRes.status === 200 && reassignData.session.personInChargeId === memBInfo.member.id,
    `New PIC ID: ${reassignData.session?.personInChargeId}`
  );

  // SCENARIO 11: Member A's QR projection rights are immediately revoked
  const qrAAfterRevoke = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({ sessionId: session1.id })
  });
  recordScenario(
    11,
    'Quyền trình chiếu QR của Member A bị thu hồi ngay lập tức sau khi thay đổi người phụ trách (403)',
    qrAAfterRevoke.status === 403,
    `Status: ${qrAAfterRevoke.status}`
  );

  // SCENARIO 12: Member B now has QR projection rights
  const qrBAfterAssign = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({ sessionId: session1.id })
  });
  const qrBAfterData = await qrBAfterAssign.json();
  recordScenario(
    12,
    'Người phụ trách mới (Member B) mở và lấy mã QR trình chiếu thành công',
    qrBAfterAssign.status === 200 && qrBAfterData.success && typeof qrBAfterData.token === 'string',
    `Status: ${qrBAfterAssign.status}, Token: ${qrBAfterData.token}`
  );

  // SCENARIO 13: Admin cancels the meeting -> QR is invalidated for everyone
  const cancelRes = await fetch(`${BASE_URL}/api/sessions/${session1.id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ reason: 'Hủy buổi do trùng lịch trường' })
  });
  const qrCancelledRes = await fetch(`${BASE_URL}/api/attendance/qr-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({ sessionId: session1.id })
  });
  recordScenario(
    13,
    'Meeting bị hủy: API QR token từ chối 400 và vô hiệu hóa toàn bộ việc trình chiếu',
    qrCancelledRes.status === 400,
    `Cancel Status: ${cancelRes.status}, QR Status: ${qrCancelledRes.status}`
  );

  // SCENARIO 14: Member A cannot access Admin routes (/api/members, /api/cms)
  const adminRouteRes = await fetch(`${BASE_URL}/api/cms/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({ bannerTitle: 'Hacked' })
  });
  recordScenario(
    14,
    'Người phụ trách không được cấp quyền Admin ngoài phạm vi meeting (Chặn 403 tại API Admin)',
    adminRouteRes.status === 403,
    `Status: ${adminRouteRes.status}`
  );

  console.log('\n========================================================================');
  console.log('RESULTS:');
  const allPassed = results.every(r => r.passed);
  console.log(`Passed: ${results.filter(r => r.passed).length} / ${results.length}`);
  console.log(`Status: ${allPassed ? 'ALL SCENARIOS PASSED WITH 100% SUCCESS' : 'SOME TESTS FAILED'}`);
  console.log('========================================================================\n');

  if (!allPassed) process.exit(1);
}

runPicMeetingTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
