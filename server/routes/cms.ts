// CMS, Applications and System Utility Routes
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import type { Application, UnitId, User } from '../../src/types/index.ts';
import { extractAcademicYear } from './auth.ts';
import { getVNCurrentTimeStr, getVNCurrentDateStr, getNowISO } from '../timeUtils.ts';
import { requireAuth, requireNormalSession, requireAdmin, requireUnitOrRole } from '../middleware/auth.ts';
import { checkRateLimit } from '../services/authSecurity.ts';
import { dispatchEmail, isValidEmailFormat } from '../services/emailService.ts';

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

// POST /api/partnerships/request (Public Partnership Request with Rate Limiting, Honeypot & Validation)
cmsRouter.post('/partnerships/request', async (req, res) => {
  // 1. IP Rate Limiting (5 requests per 15 minutes per IP)
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || 'unknown-ip';
  const rateCheck = checkRateLimit(`partnership_req:${clientIp}`, 5, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      message: `Bạn đã gửi quá nhiều yêu cầu từ địa chỉ IP này. Vui lòng thử lại sau ${rateCheck.retryAfterSec || 60} giây.`
    });
  }

  // 2. Anti-spam Honeypot Check
  const { hp_website } = req.body;
  if (hp_website && typeof hp_website === 'string' && hp_website.trim().length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Yêu cầu không hợp lệ.'
    });
  }

  const {
    organizationName,
    representativeName,
    position,
    email,
    phone,
    partnershipType,
    proposalContent,
    attachmentUrl
  } = req.body;

  // 3. Required Fields & Length Bounds Validation
  if (!organizationName || typeof organizationName !== 'string' || organizationName.trim().length < 2 || organizationName.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp tên tổ chức/doanh nghiệp hợp lệ (2 - 200 ký tự).'
    });
  }

  if (!representativeName || typeof representativeName !== 'string' || representativeName.trim().length < 2 || representativeName.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp họ và tên người đại diện hợp lệ (2 - 100 ký tự).'
    });
  }

  if (position && (typeof position !== 'string' || position.trim().length > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Chức vụ người đại diện không được vượt quá 100 ký tự.'
    });
  }

  const cleanEmail = (email || '').toString().trim().toLowerCase();
  if (!cleanEmail || cleanEmail.length > 100 || !isValidEmailFormat(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp địa chỉ email liên hệ hợp lệ.'
    });
  }

  const cleanPhone = (phone || '').toString().trim();
  const phoneRegex = /^[0-9+() -]{9,20}$/;
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp số điện thoại liên hệ hợp lệ (9 - 20 ký tự số).'
    });
  }

  if (!proposalContent || typeof proposalContent !== 'string' || proposalContent.trim().length < 20 || proposalContent.trim().length > 3000) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng mô tả chi tiết nội dung đề xuất hợp tác (từ 20 đến 3000 ký tự).'
    });
  }

  // Validate optional attachment URL
  let cleanAttachmentUrl = '';
  if (attachmentUrl && typeof attachmentUrl === 'string' && attachmentUrl.trim().length > 0) {
    const trimmedUrl = attachmentUrl.trim();
    if (trimmedUrl.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Liên kết tài liệu đính kèm không được vượt quá 500 ký tự.'
      });
    }
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
      cleanAttachmentUrl = trimmedUrl;
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Liên kết tài liệu đính kèm phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).'
      });
    }
  }

  // 7 Official Canonical Partnership Types & Legacy Aliases
  const validTypes = [
    // 7 Official Canonical Types
    'financial_sponsor',
    'in_kind_sponsor',
    'expert_mentoring',
    'business_challenge',
    'startup_project',
    'media_cooperation',
    'academic_exchange',
    // Legacy Aliases
    'sponsor',
    'problem_solving',
    'media_coop',
    'academic_partner',
    'recruitment_partner',
    'companion_project',
    'business_coop',
    'event_cohost',
    'other'
  ];
  const normalizedType = validTypes.includes(partnershipType) ? partnershipType : 'financial_sponsor';

  const store = db.get();
  store.partnershipRequests = store.partnershipRequests || [];

  const request = {
    id: `preq-${Date.now()}`,
    organizationName: organizationName.trim(),
    representativeName: representativeName.trim(),
    position: position ? position.trim() : '',
    email: cleanEmail,
    phone: cleanPhone,
    partnershipType: normalizedType,
    proposalContent: proposalContent.trim(),
    attachmentUrl: cleanAttachmentUrl,
    status: 'received' as const,
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
    details: `Đơn vị "${organizationName.trim()}" gửi đề xuất hợp tác hình thức [${normalizedType}]`
  });

  db.save();

  // 4. Asynchronous email notification to partner (with safe fallback)
  try {
    await dispatchEmail({
      to: cleanEmail,
      recipientName: representativeName.trim(),
      subject: `[BK-IC] Xác nhận tiếp nhận đề xuất hợp tác - ${organizationName.trim()}`,
      type: 'partnership_acknowledgment',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #0284C7, #38BDF8); padding: 24px; border-radius: 12px 12px 0 0; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">CLB Khởi nghiệp & Đổi mới Sáng tạo BK-IC</h2>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Trường Đại học Bách khoa – Đại học Đà Nẵng</p>
          </div>
          <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p>Kính gửi <strong>${representativeName.trim()}</strong> (${organizationName.trim()}),</p>
            <p>Ban Chủ nhiệm Câu lạc bộ BK-IC xin chân thành cảm ơn Quý đơn vị đã quan tâm và gửi đề xuất hợp tác cùng chúng tôi.</p>
            <div style="background: #f8fafc; border-left: 4px solid #0284C7; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0 0 6px; font-size: 13px;"><strong>Mã tham chiếu:</strong> ${request.id}</p>
              <p style="margin: 0 0 6px; font-size: 13px;"><strong>Đơn vị:</strong> ${organizationName.trim()}</p>
              <p style="margin: 0 0 6px; font-size: 13px;"><strong>Hình thức:</strong> ${normalizedType}</p>
              <p style="margin: 0; font-size: 13px;"><strong>Thời gian tiếp nhận:</strong> ${new Date(request.submittedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
            </div>
            <p>Sau khi tiếp nhận đề xuất, Ban Chủ nhiệm BK-IC sẽ xem xét nội dung và chủ động liên hệ lại với Quý đơn vị theo thông tin liên hệ đã cung cấp để trao đổi phương án phối hợp chi tiết.</p>
            <p style="margin-top: 24px;">Trân trọng,<br/><strong>Ban Chủ nhiệm CLB BK-IC</strong><br/><span style="font-size: 12px; color: #64748b;">Trường Đại học Bách khoa, Đại học Đà Nẵng</span></p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.warn('[CMS Partnership] Email notification fallback:', err);
  }

  res.json({
    success: true,
    message: 'Đề xuất hợp tác đã được gửi thành công! Ban Chủ nhiệm BK-IC sẽ liên hệ làm việc trong thời gian sớm nhất.',
    request
  });
});

// GET /api/partnerships/requests (Admin & BN Only with Filter & Search)
cmsRouter.get('/partnerships/requests', requireAuth, requireNormalSession, requireUnitOrRole(['BN'], ['admin']), (req, res) => {
  const store = db.get();
  let requests = store.partnershipRequests || [];

  const { status, type, search } = req.query;

  if (status && typeof status === 'string' && status !== 'all') {
    requests = requests.filter(r => r.status === status);
  }

  if (type && typeof type === 'string' && type !== 'all') {
    requests = requests.filter(r => r.partnershipType === type);
  }

  if (search && typeof search === 'string' && search.trim().length > 0) {
    const q = search.trim().toLowerCase();
    requests = requests.filter(r =>
      r.organizationName.toLowerCase().includes(q) ||
      r.representativeName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q))
    );
  }

  res.json({
    success: true,
    requests
  });
});

// PATCH /api/partnerships/requests/:id (Admin & BN Only: Status, Internal Notes & Assignment)
cmsRouter.patch('/partnerships/requests/:id', requireAuth, requireNormalSession, requireUnitOrRole(['BN'], ['admin']), (req, res) => {
  const { id } = req.params;
  const { status, notes, assignedTo } = req.body;

  const validStatuses = ['received', 'reviewing', 'contacted', 'in_discussion', 'approved', 'accepted', 'rejected', 'declined'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(', ')}`
    });
  }

  const store = db.get();
  store.partnershipRequests = store.partnershipRequests || [];

  const request = store.partnershipRequests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy hồ sơ đề xuất hợp tác có mã ${id}.`
    });
  }

  const prevStatus = request.status;
  if (status) request.status = status;
  if (notes !== undefined) request.notes = typeof notes === 'string' ? notes.trim() : '';
  if (assignedTo !== undefined) request.assignedTo = typeof assignedTo === 'string' ? assignedTo.trim() : '';
  request.updatedAt = new Date().toISOString();

  // Audit logging
  const currentUser = (req as any).user;
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: currentUser?.id || 'admin',
    actorName: currentUser?.fullName || currentUser?.name || 'Quản trị viên',
    actorRole: currentUser?.role || 'admin',
    action: 'Cập nhật đề xuất hợp tác',
    targetType: 'PartnershipRequest',
    targetId: request.id,
    details: `Cập nhật trạng thái từ [${prevStatus}] sang [${request.status}] cho đơn vị "${request.organizationName}"`
  });

  db.save();

  res.json({
    success: true,
    message: 'Cập nhật trạng thái đề xuất thành công.',
    request
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

// =============================================================================
// CMS NEWS MANAGEMENT (HOMEPAGE NEWS & FANPAGE CRAWL ARTICLES)
// =============================================================================

// GET /api/news (Public / Admin: retrieve news)
cmsRouter.get('/news', (req, res) => {
  const store = db.get();
  const allNews = store.news || [];
  const { status, priority } = req.query;
  let result = [...allNews];
  if (status && typeof status === 'string' && status !== 'all') {
    result = result.filter((n: any) => n.status === status);
  }
  if (priority && typeof priority === 'string' && priority !== 'all') {
    result = result.filter((n: any) => n.priority === priority);
  }
  res.json({ success: true, news: result });
});

// GET /api/news/:id (Public / Admin)
cmsRouter.get('/news/:id', (req, res) => {
  const store = db.get();
  const allNews = store.news || [];
  const item = allNews.find((n: any) => n.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
  }
  res.json({ success: true, item });
});

// POST /api/news (Admin only: create news item)
cmsRouter.post('/news', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  const actor = req.user!;
  const store = db.get();
  store.news = store.news || [];

  const {
    title,
    description,
    category,
    publishedAt,
    image,
    source,
    sourceUrl,
    detailUrl,
    verificationNotes,
    status,
    priority,
    readTime
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Tiêu đề và tóm tắt không được để trống' });
  }

  const newItem = {
    id: `news-${Date.now()}`,
    title: title.trim(),
    description: description.trim(),
    category: category || 'Tin tức CLB',
    publishedAt: publishedAt || new Date().toLocaleDateString('vi-VN'),
    image: image || '/images/bkic/bkic_launch.jpg',
    source: source || 'Facebook Fanpage BK-IC',
    sourceUrl: sourceUrl || 'https://www.facebook.com/dut.bkic',
    detailUrl: detailUrl || sourceUrl || 'https://www.facebook.com/dut.bkic',
    verificationNotes: verificationNotes || '',
    status: status || 'draft',
    priority: priority || 'normal',
    readTime: readTime || '3 phút đọc',
    createdAt: new Date().toISOString()
  };

  store.news.unshift(newItem);

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Tạo bài viết CMS mới',
    targetType: 'News',
    targetId: newItem.id,
    details: `${actor.fullName} tạo bài viết "${newItem.title}" với trạng thái [${newItem.status}]`
  });

  db.save();
  res.json({ success: true, message: 'Tạo bài viết mới thành công', item: newItem });
});

// PATCH /api/news/:id (Admin only: update news item)
cmsRouter.patch('/news/:id', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  const actor = req.user!;
  const store = db.get();
  store.news = store.news || [];
  const idx = store.news.findIndex((n: any) => n.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
  }

  const oldItem = store.news[idx];
  const updatedItem = {
    ...oldItem,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  store.news[idx] = updatedItem;

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Cập nhật bài viết CMS',
    targetType: 'News',
    targetId: updatedItem.id,
    details: `${actor.fullName} cập nhật bài viết "${updatedItem.title}" - Trạng thái: [${updatedItem.status}]`
  });

  db.save();
  res.json({ success: true, message: 'Cập nhật bài viết thành công', item: updatedItem });
});

// DELETE /api/news/:id (Admin only: delete news item)
cmsRouter.delete('/news/:id', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  const actor = req.user!;
  const store = db.get();
  store.news = store.news || [];
  const idx = store.news.findIndex((n: any) => n.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
  }

  const removed = store.news.splice(idx, 1)[0];

  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    actorUnit: actor.unit,
    action: 'Xóa bài viết CMS',
    targetType: 'News',
    targetId: removed.id,
    details: `${actor.fullName} đã xóa bài viết "${removed.title}"`
  });

  db.save();
  res.json({ success: true, message: 'Đã xóa bài viết thành công' });
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

// GET /api/public/album-members - Public endpoint returning official GEN 1 club members for About Page Album
cmsRouter.get('/public/album-members', (req, res) => {
  const store = db.get();
  // Filter out standalone master admin
  const clubMembers = (store.users || []).filter(u => u.id !== 'usr-admin' && u.studentId !== 'ADMIN-DUT-2026');

  // Check which members have uploaded avatars in /public/imageAVT
  const avtDir = path.resolve(__dirname, '../../public/imageAVT');
  const availableAvatars = new Set<string>();
  if (fs.existsSync(avtDir)) {
    try {
      const files = fs.readdirSync(avtDir);
      for (const f of files) {
        const match = f.match(/^(\d{8,10})\.(jpe?g|png|webp)$/i);
        if (match) {
          availableAvatars.add(match[1]);
        }
      }
    } catch {
      // fallback gracefully
    }
  }

  // Sanitize and format for Album GEN 1
  // If studentId doesn't have an avatar in /imageAVT, fall back to /imageAVT/defaults.jpg
  const sanitized = clubMembers.map(u => {
    const hasPhoto = u.studentId && availableAvatars.has(u.studentId);
    const avatarUrl = hasPhoto
      ? `/imageAVT/${u.studentId}.jpg?v=20261120c`
      : `/imageAVT/defaults.jpg?v=20261120c`;

    return {
      id: u.id,
      fullName: u.fullName,
      position: u.position,
      faculty: u.faculty,
      studentId: u.studentId,
      classId: u.classId,
      memberId: u.memberId,
      unit: u.unit,
      avatarUrl,
      departmentName: u.unit === 'BN' ? 'Ban chủ nhiệm' : u.unit === 'BDH' ? 'Ban điều hành' : 'Ban thành viên'
    };
  });

  res.json({
    success: true,
    total: sanitized.length,
    members: sanitized
  });
});

// In-memory cache for avatar scan results (prevents synchronous filesystem I/O on every request)
let cachedAvatarResponse: { count: number; avatars: Record<string, string>; expiresAt: number } | null = null;

// GET /api/album/avatars - Public avatar scanner returning available member photos in /public/imageAVT
cmsRouter.get('/album/avatars', (req, res) => {
  const now = Date.now();
  if (cachedAvatarResponse && now < cachedAvatarResponse.expiresAt) {
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.json({ success: true, count: cachedAvatarResponse.count, avatars: cachedAvatarResponse.avatars });
  }

  const avtDir = path.resolve(__dirname, '../../public/imageAVT');
  const avatars: Record<string, string> = {};
  if (fs.existsSync(avtDir)) {
    try {
      const files = fs.readdirSync(avtDir);
      for (const f of files) {
        // Match files starting with student ID (digits) and common image extensions
        const match = f.match(/^(\d{8,10})\.(jpe?g|png|webp)$/i);
        if (match) {
          const mssv = match[1];
          avatars[mssv] = `/imageAVT/${f}?v=20261120c`;
        }
      }
    } catch {
      // fallback gracefully
    }
  }

  cachedAvatarResponse = {
    count: Object.keys(avatars).length,
    avatars,
    expiresAt: now + 60_000 // 60s cache
  };

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json({ success: true, count: cachedAvatarResponse.count, avatars });
});

// Admin-only CMS content endpoints (strictly protected by requireAdmin)
cmsRouter.post('/cms/content', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Cập nhật nội dung CMS thành công!' });
});

cmsRouter.all('/cms/*', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Thao tác CMS quản trị thành công!' });
});

