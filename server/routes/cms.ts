// CMS, Applications and System Utility Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { Application, UnitId, User } from '../../src/types/index.ts';
import { extractAcademicYear } from './auth.ts';
import { getVNCurrentTimeStr, getVNCurrentDateStr, getNowISO } from '../timeUtils.ts';
import { requireAuth, requireNormalSession, requireAdmin, requireUnitOrRole } from '../middleware/auth.ts';

export const cmsRouter = Router();

// GET /api/system/time - Return authoritative server time in Asia/Ho_Chi_Minh (Public)
cmsRouter.get('/system/time', (req, res) => {
  res.json({
    success: true,
    iso: getNowISO(),
    currentTimeVN: getVNCurrentTimeStr(),
    currentDateVN: getVNCurrentDateStr(),
    timestamp: Date.now(),
    timezone: 'Asia/Ho_Chi_Minh'
  });
});

// GET /api/applications - List recruitment applications (Restricted to BN, BTV, Admin)
cmsRouter.get('/applications', requireAuth, requireNormalSession, requireUnitOrRole(['BN', 'BTV'], ['admin']), (req, res) => {
  const store = db.get();
  res.json({ success: true, applications: store.applications });
});

// POST /api/applications - Submit new recruitment application (Public)
cmsRouter.post('/applications', (req, res) => {
  const store = db.get();
  const settings = store.siteSettings;
  const todayVN = getVNCurrentDateStr();

  // 1. Check if recruitment is explicitly closed
  if (settings.recruitmentStatus !== 'open') {
    return res.status(403).json({
      success: false,
      message: 'Hiện tại chưa đến thời gian tuyển thành viên mới. Hãy theo dõi Fanpage chính thức của BK-IC để cập nhật thông tin về đợt tuyển tiếp theo!'
    });
  }

  // 2. Check if recruitment has not started yet
  if (settings.recruitmentStartDate && todayVN < settings.recruitmentStartDate) {
    return res.status(403).json({
      success: false,
      message: 'Hiện tại chưa đến thời gian tuyển thành viên mới. Hãy theo dõi Fanpage chính thức của BK-IC để cập nhật thông tin về đợt tuyển tiếp theo!'
    });
  }

  // 3. Check if recruitment has ended
  if (settings.recruitmentDeadline && todayVN > settings.recruitmentDeadline) {
    // Automatically close status
    settings.recruitmentStatus = 'closed';
    db.save();
    return res.status(403).json({
      success: false,
      message: 'Đợt tuyển thành viên mới đã kết thúc. Hãy theo dõi Fanpage chính thức của BK-IC để cập nhật thông tin về đợt tuyển tiếp theo!'
    });
  }

  const {
    fullName,
    studentId,
    email,
    phone,
    faculty,
    classId,
    academicYear,
    interestTrack,
    motivation,
    skills,
    experience,
    portfolioUrl
  } = req.body;

  if (!fullName || !studentId || !email || !phone || !interestTrack) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc trong đơn đăng ký.'
    });
  }
  const newApp: Application = {
    id: `app-${Date.now()}`,
    fullName: fullName.trim(),
    studentId: studentId.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    faculty: faculty || 'Khoa Công nghệ Thông tin',
    classId: classId || 'DUT-2026',
    academicYear: academicYear && academicYear !== 'K24'
      ? (academicYear.match(/^(?:k|khóa\s*)?(\d{2})/i)?.[1] || academicYear)
      : extractAcademicYear(classId, '24'),
    interestTrack,
    motivation: motivation || '',
    skills: skills || '',
    experience,
    portfolioUrl,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  store.applications.unshift(newApp);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: 'guest-applicant',
    actorName: newApp.fullName,
    actorRole: 'applicant',
    action: 'Nộp đơn tuyển dụng thành viên mới',
    targetType: 'Application',
    targetId: newApp.id,
    details: `Ứng viên ${newApp.fullName} (${newApp.studentId}) đăng ký vào mảng ${newApp.interestTrack}`
  });

  db.save();

  res.json({
    success: true,
    message: 'Nộp đơn ứng tuyển thành công! Hội đồng tuyển dụng BK-IC sẽ liên hệ với bạn.',
    application: newApp
  });
});

// POST /api/applications/:id/convert-to-member - Convert approved applicant into official member
cmsRouter.post(
  '/applications/:id/convert-to-member',
  requireAuth,
  requireNormalSession,
  requireUnitOrRole(['BN', 'BTV'], ['admin']),
  (req, res) => {
    const actor = req.user!;
    const { unit, position } = req.body;

    const store = db.get();
    const app = store.applications.find(a => a.id === req.params.id);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng viên.' });
    }

    const targetUnit: UnitId = unit || 'BDH';

    let targetUser: User;
    const existingUser = store.users.find(
      u => u.email.toLowerCase() === app.email.toLowerCase() || u.studentId === app.studentId
    );

    const nowISO = new Date().toISOString();
    if (existingUser) {
      existingUser.role = 'member';
      existingUser.unit = targetUnit;
      existingUser.committee = targetUnit;
      existingUser.position = position || `Thành viên ${targetUnit}`;
      existingUser.status = 'active';
      existingUser.statusEffectiveDate = nowISO.split('T')[0];
      if (!existingUser.memberId) {
        existingUser.memberId = `BKIC-${targetUnit}-${app.studentId}`;
      }
      targetUser = existingUser;
    } else {
      targetUser = {
        id: `usr-member-${Date.now()}`,
        memberId: `BKIC-${targetUnit}-${app.studentId}`,
        email: app.email,
        fullName: app.fullName,
        studentId: app.studentId,
        faculty: app.faculty,
        classId: app.classId,
        academicYear: app.academicYear,
        role: 'member',
        unit: targetUnit,
        committee: targetUnit,
        position: position || `Thành viên ${targetUnit} (Gen 2026)`,
        joinDate: nowISO.split('T')[0],
        status: 'active',
        statusEffectiveDate: nowISO.split('T')[0],
        accountStatus: 'pending_setup',
        emailVerified: false,
        createdAt: nowISO,
        phone: app.phone,
        statusHistory: [
          {
            id: `sh-${Date.now()}`,
            previousStatus: 'active',
            newStatus: 'active',
            effectiveDate: nowISO.split('T')[0],
            reason: 'Kết nạp thành viên chính thức sau đợt tuyển quân',
            approvedBy: actor.fullName,
            updatedBy: actor.fullName,
            timestamp: nowISO
          }
        ]
      };
      store.users.push(targetUser);
    }

    app.status = 'approved';
    app.reviewNotes = `Đã kết nạp vào đơn vị ${targetUnit}. Phê duyệt bởi: ${actor.fullName}`;
    app.reviewedBy = actor.fullName;

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      actorUnit: actor.unit,
      action: 'Kết nạp thành viên mới',
      targetType: 'Application',
      targetId: app.id,
      details: `${actor.fullName} kết nạp ứng viên ${app.fullName} vào đơn vị ${targetUnit} với chức vụ: ${targetUser.position}`
    });

    db.save();

    res.json({
      success: true,
      message: `Đã kết nạp ${app.fullName} vào ${targetUnit} thành công!`,
      member: targetUser
    });
  }
);

// GET /api/projects (Public)
cmsRouter.get('/projects', (req, res) => {
  const store = db.get();
  res.json({ success: true, projects: store.projects });
});

// GET /api/events (Public)
cmsRouter.get('/events', (req, res) => {
  const store = db.get();
  res.json({ success: true, events: store.events });
});

// POST /api/workshops/register (Public Workshop Registration)
cmsRouter.post('/workshops/register', (req, res) => {
  const { workshopId, workshopTitle, fullName, email, phone, organization, questionsForSpeaker } = req.body;
  if (!workshopTitle || !fullName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email, Số điện thoại.'
    });
  }

  const store = db.get();
  store.workshopRegistrations = store.workshopRegistrations || [];

  const registration = {
    id: `wreg-${Date.now()}`,
    workshopId: workshopId || 'ws-general',
    workshopTitle: workshopTitle.trim(),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    organization: organization ? organization.trim() : '',
    questionsForSpeaker: questionsForSpeaker ? questionsForSpeaker.trim() : '',
    registeredAt: new Date().toISOString()
  };

  store.workshopRegistrations.unshift(registration);
  db.save();

  res.json({
    success: true,
    message: 'Đăng ký tham gia workshop thành công! Ban tổ chức BK-IC sẽ gửi email xác nhận và tài liệu hội thảo đến bạn.',
    registration
  });
});

// POST /api/competitions/register (Public Competition Registration)
cmsRouter.post('/competitions/register', (req, res) => {
  const { competitionId, competitionTitle, regType, teamName, leaderName, leaderEmail, leaderPhone, membersCount, projectIdeaSummary } = req.body;
  if (!competitionTitle || !leaderName || !leaderEmail || !leaderPhone) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin trưởng nhóm/người đăng ký, email và số điện thoại liên lạc.'
    });
  }

  const store = db.get();
  store.competitionRegistrations = store.competitionRegistrations || [];

  const registration = {
    id: `creg-${Date.now()}`,
    competitionId: competitionId || 'comp-general',
    competitionTitle: competitionTitle.trim(),
    regType: regType === 'team' ? 'team' : 'individual',
    teamName: teamName ? teamName.trim() : '',
    leaderName: leaderName.trim(),
    leaderEmail: leaderEmail.trim().toLowerCase(),
    leaderPhone: leaderPhone.trim(),
    membersCount: Number(membersCount) || 1,
    projectIdeaSummary: projectIdeaSummary ? projectIdeaSummary.trim() : '',
    registeredAt: new Date().toISOString()
  };

  store.competitionRegistrations.unshift(registration);
  db.save();

  res.json({
    success: true,
    message: 'Hồ sơ đăng ký dự thi đã được ghi nhận thành công! Ban Chuyên môn BK-IC sẽ liên hệ hỗ trợ đội thi.',
    registration
  });
});

// POST /api/partnerships/request (Public Partnership Request)
cmsRouter.post('/partnerships/request', (req, res) => {
  const { organizationName, representativeName, position, email, phone, partnershipType, proposalContent, attachmentUrl } = req.body;
  if (!organizationName || !representativeName || !email || !phone || !proposalContent) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ: Tên tổ chức/doanh nghiệp, Người đại diện, Email, Số điện thoại và Nội dung đề xuất.'
    });
  }

  const store = db.get();
  store.partnershipRequests = store.partnershipRequests || [];

  const request = {
    id: `preq-${Date.now()}`,
    organizationName: organizationName.trim(),
    representativeName: representativeName.trim(),
    position: position ? position.trim() : '',
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    partnershipType: partnershipType || 'business_coop',
    proposalContent: proposalContent.trim(),
    attachmentUrl: attachmentUrl || '',
    status: 'received',
    submittedAt: new Date().toISOString()
  };

  store.partnershipRequests.unshift(request);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: 'guest-partner',
    actorName: representativeName.trim(),
    actorRole: 'partner',
    action: 'Gửi đề xuất hợp tác',
    targetType: 'PartnershipRequest',
    targetId: request.id,
    details: `Đơn vị ${organizationName} gửi đề xuất hợp tác mảng ${partnershipType}`
  });

  db.save();

  res.json({
    success: true,
    message: 'Đề xuất hợp tác đã được gửi thành công! Ban Chủ nhiệm BK-IC sẽ liên hệ làm việc trong thời gian sớm nhất.',
    request
  });
});

// GET /api/partnerships/requests (Admin & BCN Only)
cmsRouter.get('/partnerships/requests', requireAuth, requireNormalSession, requireUnitOrRole(['BN'], ['admin']), (req, res) => {
  const store = db.get();
  res.json({
    success: true,
    requests: store.partnershipRequests || []
  });
});

// GET /api/settings (Public site settings - strictly excluding internal SMTP configuration)
cmsRouter.get('/settings', (req, res) => {
  const store = db.get();
  const todayVN = getVNCurrentDateStr();
  if (
    store.siteSettings.recruitmentStatus === 'open' &&
    store.siteSettings.recruitmentDeadline &&
    todayVN > store.siteSettings.recruitmentDeadline
  ) {
    store.siteSettings.recruitmentStatus = 'closed';
    db.save();
  }
  const { smtpConfig, ...safeSettings } = (store.siteSettings || {}) as any;
  res.json({ success: true, settings: safeSettings });
});

// PATCH /api/settings (Admin, BN, or BTV for recruitment and site settings)
cmsRouter.patch('/settings', requireAuth, requireNormalSession, requireUnitOrRole(['BN', 'BTV'], ['admin']), (req, res) => {
  const actor = req.user!;
  const store = db.get();
  
  // Do not allow updating smtpConfig via public settings PATCH
  const { smtpConfig, ...rest } = req.body;
  store.siteSettings = {
    ...store.siteSettings,
    ...rest
  };

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Cập nhật cấu hình hệ thống / tuyển dụng',
    targetType: 'SystemSettings',
    targetId: 'siteSettings',
    details: `${actor.fullName} cập nhật cấu hình: trạng thái tuyển ${store.siteSettings.recruitmentStatus}`
  });

  db.save();

  res.json({ success: true, settings: store.siteSettings });
});

// POST /api/system/clean-test-data - Clean synthetic test accounts and mock sessions (Strictly Admin only)
cmsRouter.post('/system/clean-test-data', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  const result = db.cleanSyntheticTestData();
  res.json({
    success: true,
    message: `Đã dọn dẹp sạch toàn bộ dữ liệu thử nghiệm! Đã xóa ${result.removedUsers} tài khoản thử nghiệm và ${result.removedSessions} buổi họp giả lập.`,
    data: result
  });
});

// POST /api/system/reload-db - Reload database from disk (Strictly Admin only)
cmsRouter.post('/system/reload-db', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  db.reload();
  res.json({
    success: true,
    message: 'Đã tải lại cơ sở dữ liệu từ đĩa thành công!'
  });
});

// POST /api/system/reset-demo - Reset data to initial verified baseline (Strictly Admin only, disabled in production)
cmsRouter.post('/system/reset-demo', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Thao tác reset demo bị vô hiệu hóa trên môi trường Production để bảo toàn dữ liệu.'
    });
  }
  const actor = req.user!;
  const fresh = db.resetToDefaults();
  res.json({ success: true, message: 'Đã khôi phục dữ liệu hệ thống về trạng thái ban đầu!', data: fresh });
});

// Admin-only CMS content endpoints (strictly protected by requireAdmin)
cmsRouter.post('/cms/content', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Cập nhật nội dung CMS thành công!' });
});

cmsRouter.all('/cms/*', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Thao tác CMS quản trị thành công!' });
});

