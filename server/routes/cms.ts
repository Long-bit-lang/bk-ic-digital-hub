// CMS, Applications and System Utility Routes
import { Router } from 'express';
import { db } from '../db.ts';
import type { Application, UnitId, User } from '../../src/types/index.ts';
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

  const store = db.get();
  const newApp: Application = {
    id: `app-${Date.now()}`,
    fullName: fullName.trim(),
    studentId: studentId.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    faculty: faculty || 'Khoa Công nghệ Thông tin',
    classId: classId || 'DUT-2026',
    academicYear: academicYear || 'K24',
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

// GET /api/settings (Public site settings with masked SMTP password)
cmsRouter.get('/settings', (req, res) => {
  const store = db.get();
  const safeSettings = { ...store.siteSettings };
  if (safeSettings.smtpConfig) {
    safeSettings.smtpConfig = {
      ...safeSettings.smtpConfig,
      pass: safeSettings.smtpConfig.pass ? '••••••••' : ''
    };
  }
  res.json({ success: true, settings: safeSettings });
});

// PATCH /api/settings (Admin or BN only)
cmsRouter.patch('/settings', requireAuth, requireNormalSession, requireUnitOrRole(['BN'], ['admin']), (req, res) => {
  const actor = req.user!;
  const store = db.get();
  
  // Do not allow updating smtpConfig via public settings PATCH
  const { smtpConfig, ...rest } = req.body;
  store.siteSettings = {
    ...store.siteSettings,
    ...rest
  };
  db.save();

  res.json({ success: true, settings: store.siteSettings });
});

// POST /api/system/reset-demo - Reset data to initial verified baseline (Strictly Admin only)
cmsRouter.post('/system/reset-demo', requireAuth, requireNormalSession, requireAdmin, (req, res) => {
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

