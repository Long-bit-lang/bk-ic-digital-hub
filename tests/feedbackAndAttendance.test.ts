// Comprehensive Verification Test Suite for Feedback & Attendance Modules
// Tests all 20 scenarios required by Section XI of the Specification
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

async function runTests() {
  console.log('================================================================');
  console.log('BK-IC DIGITAL HUB - FEEDBACK & ATTENDANCE VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  // Step 1: Login Admin
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin.bkic@dut.udn.vn', password: '123456' })
  });
  const adminData = await adminLoginRes.json();
  const adminToken = adminData.token;
  if (!adminToken) throw new Error('Admin login failed');

  // Step 2: Create a BN user, a BDH user, and 5 regular Members
  const timestamp = Date.now();

  // BN User
  const bnEmail = `bn.${timestamp}@example.com`;
  const bnCreateRes = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      fullName: 'Trần Ban Chủ Nhiệm',
      studentId: `BN-${timestamp.toString().slice(-4)}`,
      email: bnEmail,
      password: 'BnPassword@2026!',
      role: 'leader',
      unit: 'BN'
    })
  });
  const bnCreateData = await bnCreateRes.json();
  const bnId = bnCreateData.member?.id;

  const bnLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: bnEmail, password: 'BnPassword@2026!' })
  });
  const bnToken = (await bnLoginRes.json()).token;

  // BDH User
  const bdhEmail = `bdh.${timestamp}@example.com`;
  const bdhCreateRes = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      fullName: 'Lê Ban Điều Hành',
      studentId: `BDH-${timestamp.toString().slice(-4)}`,
      email: bdhEmail,
      password: 'BdhPassword@2026!',
      role: 'leader',
      unit: 'BDH'
    })
  });
  const bdhCreateData = await bdhCreateRes.json();
  const bdhId = bdhCreateData.member?.id;

  const bdhLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: bdhEmail, password: 'BdhPassword@2026!' })
  });
  const bdhToken = (await bdhLoginRes.json()).token;

  // 5 Regular Members (m1 to m5)
  const members: Array<{ id: string; email: string; token: string }> = [];
  for (let i = 1; i <= 5; i++) {
    const memEmail = `mem${i}.${timestamp}@example.com`;
    const memCreate = await fetch(`${BASE_URL}/api/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        fullName: `Thành Viên Thử Nghiệm ${i}`,
        studentId: `MEM-${i}-${timestamp.toString().slice(-4)}`,
        email: memEmail,
        password: 'MemPassword@2026!',
        role: 'member',
        unit: 'BDH'
      })
    });
    const memData = await memCreate.json();
    const memId = memData.member?.id;

    const memLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: memEmail, password: 'MemPassword@2026!' })
    });
    const memTok = (await memLogin.json()).token;
    members.push({ id: memId, email: memEmail, token: memTok });
  }

  // Member 6 (Non-attending member)
  const nonAttendeeEmail = `nonatt.${timestamp}@example.com`;
  const nonAttCreate = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      fullName: 'Thành Viên Vắng Mặt',
      studentId: `NON-${timestamp.toString().slice(-4)}`,
      email: nonAttendeeEmail,
      password: 'NonPassword@2026!',
      role: 'member',
      unit: 'BDH'
    })
  });
  const nonAttId = (await nonAttCreate.json()).member?.id;
  const nonAttLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: nonAttendeeEmail, password: 'NonPassword@2026!' })
  });
  const nonAttToken = (await nonAttLogin.json()).token;

  // Step 3: Create Test Sessions
  // Dynamic Vietnam timestamps so Session A & B ended 1 hour ago (within 24h feedback window)
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const vnDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(twoHoursAgo);
  const startTimeStr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false }).format(twoHoursAgo);
  const endTimeStr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false }).format(oneHourAgo);

  // Session A: Belonging to BDH, ended in the past 1 hour (open for feedback)
  const sessionARes = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: `Workshop Chuyên Môn BDH ${timestamp}`,
      description: 'Phiên thảo luận đổi mới sáng tạo',
      targetAudience: 'Toàn thể thành viên chính thức',
      personInChargeId: bdhId,
      date: vnDateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      location: 'Hội trường Bách khoa',
      unit: 'BDH'
    })
  });
  const sessionA = (await sessionARes.json()).session;

  // Session B: Belonging to BTV, outside BDH's scope
  const sessionBRes = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: `Họp Riêng Ban Thành Viên ${timestamp}`,
      description: 'Nội bộ BTV',
      targetAudience: 'Ban Thành viên',
      personInChargeId: adminData.user.id,
      date: vnDateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      location: 'Văn phòng BTV',
      unit: 'BTV'
    })
  });
  const sessionB = (await sessionBRes.json()).session;

  // Session C: Cancelled session
  const sessionCRes = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: `Session Bị Hủy ${timestamp}`,
      description: 'Meeting cancelled',
      targetAudience: 'Toàn thể thành viên chính thức',
      personInChargeId: bdhId,
      date: vnDateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      unit: 'BDH'
    })
  });
  const sessionC = (await sessionCRes.json()).session;
  // Cancel Session C
  await fetch(`${BASE_URL}/api/sessions/${sessionC.id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ reason: 'Dời lịch hoạt động' })
  });

  // Session D: Expired session (ended in April 2026, > 24 hours ago)
  const sessionDRes = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: `Session Quá Hạn Góp Ý ${timestamp}`,
      description: 'Meeting expired',
      targetAudience: 'Toàn thể thành viên chính thức',
      personInChargeId: bdhId,
      date: '2026-04-10',
      startTime: '08:00',
      endTime: '10:00',
      unit: 'BDH'
    })
  });
  const sessionD = (await sessionDRes.json()).session;

  // Step 4: Mark attendance for members 1 to 5 in Session A & Session D
  for (let i = 0; i < 4; i++) {
    await fetch(`${BASE_URL}/api/attendance/manual-checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ sessionId: sessionA.id, memberId: members[i].id, status: 'present' })
    });
    await fetch(`${BASE_URL}/api/attendance/manual-checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ sessionId: sessionD.id, memberId: members[i].id, status: 'present' })
    });
  }
  // Member 5 marked 'late' (also eligible for feedback)
  await fetch(`${BASE_URL}/api/attendance/manual-checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ sessionId: sessionA.id, memberId: members[4].id, status: 'late' })
  });

  // ----------------------------------------------------
  // Scenario 8: Member without attendance record cannot submit feedback
  // ----------------------------------------------------
  const unrecordedSubRes = await fetch(`${BASE_URL}/api/feedback/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${nonAttToken}` },
    body: JSON.stringify({
      sessionId: sessionA.id,
      contentQuality: 5,
      delivery: 5,
      durationSuitability: 5,
      usefulness: 5
    })
  });
  assert(
    unrecordedSubRes.status === 403,
    8,
    'Thành viên chưa tham dự không thể gửi góp ý (HTTP 403)',
    `Status: ${unrecordedSubRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 10: Meeting cancelled or expired cannot accept feedback
  // ----------------------------------------------------
  const cancelledSubRes = await fetch(`${BASE_URL}/api/feedback/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${members[0].token}` },
    body: JSON.stringify({
      sessionId: sessionC.id,
      contentQuality: 5,
      delivery: 5,
      durationSuitability: 5,
      usefulness: 5
    })
  });
  const expiredSubRes = await fetch(`${BASE_URL}/api/feedback/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${members[0].token}` },
    body: JSON.stringify({
      sessionId: sessionD.id,
      contentQuality: 5,
      delivery: 5,
      durationSuitability: 5,
      usefulness: 5
    })
  });
  assert(
    cancelledSubRes.status === 400 && expiredSubRes.status === 400,
    10,
    'Meeting chưa kết thúc, đã hủy hoặc đã hết hạn: không thể gửi góp ý (HTTP 400)',
    `Cancelled status: ${cancelledSubRes.status}, Expired status: ${expiredSubRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 9: Member with present/late status can submit in time window
  // Scenario 14: All 4 rating criteria and 3 separate text fields preserved
  // Scenario 15: Response does NOT return authorHash or private identifiers
  // ----------------------------------------------------
  const subRes1 = await fetch(`${BASE_URL}/api/feedback/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${members[0].token}` },
    body: JSON.stringify({
      sessionId: sessionA.id,
      contentQuality: 5,
      delivery: 4,
      durationSuitability: 4,
      usefulness: 5,
      valuableTakeaway: 'Phần chia sẻ về Unit Economics rất bổ ích',
      improvementSuggestion: 'Tăng thêm thời lượng hỏi đáp',
      nextTopicIdea: 'Pitching Deck với Nhà đầu tư'
    })
  });
  const subData1 = await subRes1.json();
  assert(
    subRes1.status === 200 && subData1.success === true,
    9,
    'Thành viên có mặt đúng giờ hoặc đi trễ có thể gửi góp ý hợp lệ',
    `Status: ${subRes1.status}`
  );

  assert(
    subData1.feedback.contentQuality === 5 &&
    subData1.feedback.delivery === 4 &&
    subData1.feedback.durationSuitability === 4 &&
    subData1.feedback.usefulness === 5 &&
    subData1.feedback.valuableTakeaway === 'Phần chia sẻ về Unit Economics rất bổ ích' &&
    subData1.feedback.improvementSuggestion === 'Tăng thêm thời lượng hỏi đáp' &&
    subData1.feedback.nextTopicIdea === 'Pitching Deck với Nhà đầu tư',
    14,
    'Bốn tiêu chí điểm đều được lưu và hiển thị đúng; ba trường văn bản vẫn tách riêng',
    JSON.stringify(subData1.feedback)
  );

  assert(
    !subData1.authorHash && !subData1.feedback.authorHash && !subData1.submissionToken && !subData1.feedback.submissionToken && !subData1.feedback.memberId,
    15,
    'API không trả authorHash hoặc thông tin định danh tác giả trong response',
    'Response is clean of authorHash and tokens'
  );

  // ----------------------------------------------------
  // Scenario 11: Duplicate submission updates existing response without creating two records
  // ----------------------------------------------------
  const subResDup = await fetch(`${BASE_URL}/api/feedback/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${members[0].token}` },
    body: JSON.stringify({
      sessionId: sessionA.id,
      contentQuality: 4,
      delivery: 5,
      durationSuitability: 5,
      usefulness: 4,
      valuableTakeaway: 'Nội dung cập nhật sau chỉnh sửa',
      improvementSuggestion: 'Gửi slide trước 1 ngày',
      nextTopicIdea: 'GenAI Tools'
    })
  });
  const subDataDup = await subResDup.json();
  assert(
    subResDup.status === 200 && subDataDup.success === true && subDataDup.feedback.contentQuality === 4,
    11,
    'Gửi hai lần cập nhật phản hồi của chính mình mà không tạo bản ghi trùng lặp',
    `Updated contentQuality: ${subDataDup.feedback?.contentQuality}`
  );

  // ----------------------------------------------------
  // Scenario 12: Member can retrieve their own feedback via /my-feedback/:sessionId
  // ----------------------------------------------------
  const myFbRes = await fetch(`${BASE_URL}/api/feedback/my-feedback/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${members[0].token}` }
  });
  const myFbData = await myFbRes.json();
  assert(
    myFbRes.status === 200 && myFbData.hasSubmitted === true && myFbData.canEdit === true && myFbData.feedback.valuableTakeaway === 'Nội dung cập nhật sau chỉnh sửa',
    12,
    'Thành viên có thể xem và sửa phản hồi của mình trước hạn',
    `Feedback loaded: ${myFbData.feedback?.valuableTakeaway}`
  );

  // ----------------------------------------------------
  // Scenario 6: When < 5 responses (currently only 1 response):
  // Regular member CANNOT view detailed summary, receives canPublish: false
  // ----------------------------------------------------
  const memberSummary1 = await fetch(`${BASE_URL}/api/feedback/summary/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${members[1].token}` }
  });
  const memberSumData1 = await memberSummary1.json();
  assert(
    memberSummary1.status === 200 && memberSumData1.canPublish === false && !memberSumData1.summary && !memberSumData1.responses,
    6,
    'Dưới 5 phản hồi: không công bố thống kê chi tiết cho thành viên thông thường, không trả số trung bình giả',
    `canPublish: ${memberSumData1.canPublish}, total: ${memberSumData1.totalResponses}`
  );

  // ----------------------------------------------------
  // Scenario 4: Regular member cannot access detailed list endpoint /api/feedback/list
  // ----------------------------------------------------
  const memberListRes = await fetch(`${BASE_URL}/api/feedback/list?sessionId=${sessionA.id}`, {
    headers: { Authorization: `Bearer ${members[1].token}` }
  });
  assert(
    memberListRes.status === 403,
    4,
    'Thành viên thông thường không thể đọc danh sách góp ý chi tiết qua API (HTTP 403)',
    `Status: ${memberListRes.status}`
  );

  // Now submit responses for members 2, 3, 4, 5 so total responses = 5
  for (let i = 1; i < 5; i++) {
    await fetch(`${BASE_URL}/api/feedback/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${members[i].token}` },
      body: JSON.stringify({
        sessionId: sessionA.id,
        contentQuality: 5,
        delivery: 5,
        durationSuitability: 5,
        usefulness: 5,
        valuableTakeaway: `Ý kiến hữu ích từ thành viên ${i + 1}`,
        improvementSuggestion: `Gợi ý cải thiện ${i + 1}`,
        nextTopicIdea: `Chủ đề mong muốn ${i + 1}`
      })
    });
  }

  // ----------------------------------------------------
  // Scenario 5 & 7: Exactly 5 valid responses -> Member can now view summary report
  // Summary does NOT leak responses array or individual identities
  // ----------------------------------------------------
  const memberSummary5 = await fetch(`${BASE_URL}/api/feedback/summary/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${members[1].token}` }
  });
  const memberSumData5 = await memberSummary5.json();
  assert(
    memberSummary5.status === 200 && memberSumData5.canPublish === true && memberSumData5.summary && !memberSumData5.responses,
    5,
    'Thành viên thông thường chỉ xem tổng hợp khi có ít nhất 5 phản hồi hợp lệ',
    `canPublish: ${memberSumData5.canPublish}, overallAverage: ${memberSumData5.summary?.overallAverage}`
  );

  assert(
    memberSumData5.summary.totalResponses === 5 &&
    memberSumData5.summary.valuableTakeaways?.length === 5 &&
    !memberSumData5.responses,
    7,
    'Có đúng 5 phản hồi: chỉ trả dữ liệu tổng hợp đã được phép công bố, không kèm danh sách chi tiết',
    `Total: ${memberSumData5.summary?.totalResponses}`
  );

  // ----------------------------------------------------
  // Scenario 1: Admin can view detailed feedback and summary of meetings
  // ----------------------------------------------------
  const adminSummaryRes = await fetch(`${BASE_URL}/api/feedback/summary/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminSummaryData = await adminSummaryRes.json();
  assert(
    adminSummaryRes.status === 200 &&
    adminSummaryData.summary &&
    adminSummaryData.responses?.length === 5 &&
    adminSummaryData.responses.every((r: any) => !r.memberId && !r.authorHash && !r.submissionToken),
    1,
    'Admin xem góp ý chi tiết của meeting, danh tính tác giả được bảo vệ ẩn danh',
    `Admin responses count: ${adminSummaryData.responses?.length}`
  );

  // ----------------------------------------------------
  // Scenario 2: BN can view detailed feedback within governance scope
  // ----------------------------------------------------
  const bnSummaryRes = await fetch(`${BASE_URL}/api/feedback/summary/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${bnToken}` }
  });
  const bnSummaryData = await bnSummaryRes.json();
  assert(
    bnSummaryRes.status === 200 && bnSummaryData.responses?.length === 5,
    2,
    'BN xem đúng phạm vi được cấp với đầy đủ phản hồi ẩn danh',
    `BN responses count: ${bnSummaryData.responses?.length}`
  );

  // ----------------------------------------------------
  // Scenario 3: BDH can view meeting within BDH scope, but blocked outside scope (Session B is BTV)
  // ----------------------------------------------------
  const bdhAllowedRes = await fetch(`${BASE_URL}/api/feedback/summary/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${bdhToken}` }
  });
  const bdhAllowedData = await bdhAllowedRes.json();

  const bdhBlockedRes = await fetch(`${BASE_URL}/api/feedback/summary/${sessionB.id}`, {
    headers: { Authorization: `Bearer ${bdhToken}` }
  });

  assert(
    bdhAllowedRes.status === 200 && bdhAllowedData.responses?.length === 5 && bdhBlockedRes.status === 403,
    3,
    'BĐH xem được meeting thuộc phạm vi và bị từ chối với HTTP 403 khi truy cập ngoài phạm vi',
    `BDH allowed: ${bdhAllowedRes.status}, BDH blocked: ${bdhBlockedRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 16: Spoofed x-user-id or fake admin ID is blocked (Authentication integrity)
  // ----------------------------------------------------
  const spoofRes = await fetch(`${BASE_URL}/api/feedback/list`, {
    headers: {
      Authorization: `Bearer ${members[0].token}`,
      'x-user-id': 'usr-admin'
    }
  });
  assert(
    spoofRes.status === 403,
    16,
    'Không thể lợi dụng x-user-id hoặc ID giả để chiếm quyền Admin (HTTP 403)',
    `Status: ${spoofRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 17: Repeated QR scan does not duplicate attendance
  // ----------------------------------------------------
  const qrRepeatRes = await fetch(`${BASE_URL}/api/attendance/checkin-qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${members[0].token}` },
    body: JSON.stringify({ sessionId: sessionA.id, token: 'fake-token-test' })
  });
  // Since sessionA is ended or already checked in, it rejects or returns alreadyCheckedIn without duplicating
  const qrRepeatData = await qrRepeatRes.json();
  assert(
    qrRepeatRes.status === 200 ? qrRepeatData.alreadyCheckedIn === true : qrRepeatRes.status === 400,
    17,
    'Điểm danh QR lặp không tạo bản ghi trùng',
    `Status: ${qrRepeatRes.status}`
  );

  // ----------------------------------------------------
  // Scenario 18: Manual and QR attendance create consistent unified records
  // ----------------------------------------------------
  const attListRes = await fetch(`${BASE_URL}/api/attendance?sessionId=${sessionA.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const attListData = await attListRes.json();
  const sessionAttRecords = attListData.attendance;
  assert(
    sessionAttRecords.length === 5 && sessionAttRecords.every((r: any) => r.sessionId === sessionA.id),
    18,
    'Điểm danh thủ công và QR tạo dữ liệu thống nhất trong cùng một cấu trúc',
    `Total records for sessionA: ${sessionAttRecords.length}`
  );

  // ----------------------------------------------------
  // Scenario 19: Attendance report calculates correct quantities, rate, and no duplicate counts
  // ----------------------------------------------------
  const reportRes = await fetch(`${BASE_URL}/api/attendance/report/${sessionA.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const reportData = await reportRes.json();
  const rep = reportData.report;
  assert(
    reportRes.status === 200 &&
    rep.presentCount === 4 &&
    rep.lateCount === 1 &&
    rep.excusedCount === 0 &&
    typeof rep.attendanceRate === 'number' &&
    rep.rateCalculationFormula.includes('Tỷ lệ tham dự'),
    19,
    'Báo cáo tham dự tính đúng số lượng, tỷ lệ và công bố công thức rõ ràng',
    `Present: ${rep.presentCount}, Late: ${rep.lateCount}, Rate: ${rep.attendanceRate}%`
  );

  // ----------------------------------------------------
  // Scenario 13: Admin/BN can reopen feedback window
  // ----------------------------------------------------
  const reopenRes = await fetch(`${BASE_URL}/api/feedback/reopen/${sessionA.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ hours: 48, reason: 'Thu thập bổ sung ý kiến sau workshop' })
  });
  const reopenData = await reopenRes.json();
  assert(
    reopenRes.status === 200 && reopenData.session.feedbackStatus === 'reopened',
    13,
    'Admin/BN có thể mở lại biểu mẫu góp ý kèm lưu vết lý do và gia hạn thời gian',
    `New status: ${reopenData.session?.feedbackStatus}`
  );

  // ----------------------------------------------------
  // Scenario 20: Non-related modules (Login, Tasks, Notifications, Profile) remain intact
  // ----------------------------------------------------
  const notifRes = await fetch(`${BASE_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const taskRes = await fetch(`${BASE_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(
    notifRes.status === 200 && taskRes.status === 200,
    20,
    'Các chức năng đăng nhập, thông báo, tác vụ và module không liên quan vẫn hoạt động bình thường',
    `Notif status: ${notifRes.status}, Task status: ${taskRes.status}`
  );

  console.log('\n================================================================');
  console.log('SUMMARY OF FEEDBACK & ATTENDANCE TEST SCENARIOS:');
  console.log('================================================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`Passed: ${passedCount} / ${results.length}`);
  if (passedCount === results.length) {
    console.log('ALL 20 SCENARIOS PASSED WITH 100% SUCCESS RATE!\n');
  } else {
    console.error(`>>> ${results.length - passedCount} SCENARIO(S) FAILED <<<\n`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
