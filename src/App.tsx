// BK-IC Digital Hub - Main Application Router & Sitemap Architecture
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { PortalLayout } from './components/portal/PortalLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Primary Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Activities Layout & 6 Tabs
import { ActivitiesLayout } from './pages/activities/ActivitiesLayout';
import { InternalActivitiesTab } from './pages/activities/tabs/InternalActivitiesTab';
import { WorkshopsTab } from './pages/activities/tabs/WorkshopsTab';
import { CompetitionsTab } from './pages/activities/tabs/CompetitionsTab';
import { CompanionProjectsTab } from './pages/activities/tabs/CompanionProjectsTab';
import { BKSharkTab } from './pages/activities/tabs/BKSharkTab';
import { RecruitmentTab } from './pages/activities/tabs/RecruitmentTab';

// Activities Detail Pages
import { WorkshopDetailPage } from './pages/activities/WorkshopDetailPage';
import { CompetitionDetailPage } from './pages/activities/CompetitionDetailPage';
import { CompanionProjectDetailPage } from './pages/activities/CompanionProjectDetailPage';
import { BKSharkSeasonDetailPage } from './pages/activities/BKSharkSeasonDetailPage';

// Partnership Subpages (3 Subcategories)
import { CompanionProjectPartnershipPage } from './pages/partnership/CompanionProjectPartnershipPage';
import { PartnershipPartnersPage } from './pages/partnership/PartnershipPartnersPage';
import { PartnershipBusinessPage } from './pages/partnership/PartnershipBusinessPage';

// Legacy / Existing Public Pages (Preserved for compatibility)
import { EventsPage } from './pages/EventsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NewsPage } from './pages/NewsPage';
import { JoinPage } from './pages/JoinPage';
import { ContactPage } from './pages/ContactPage';

// Auth Pages (Dedicated Login Split-Screen & Recovery)
import { LoginPage } from './pages/auth/LoginPage';
import { PendingApprovalPage } from './pages/auth/PendingApprovalPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { CheckInPage } from './pages/checkin/CheckInPage';

// Member Portal Pages (Preserved)
import { PortalDashboardPage } from './pages/portal/PortalDashboardPage';
import { PortalProfilePage } from './pages/portal/PortalProfilePage';
import { PortalSessionsPage } from './pages/portal/PortalSessionsPage';
import { PortalAttendancePage } from './pages/portal/PortalAttendancePage';
import { PortalEvaluationsPage } from './pages/portal/PortalEvaluationsPage';
import { PortalFeedbackPage } from './pages/portal/PortalFeedbackPage';

// Admin Portal Pages (Preserved)
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminSessionsPage } from './pages/admin/AdminSessionsPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { AdminEvaluationsPage } from './pages/admin/AdminEvaluationsPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminPartnershipRequestsPage } from './pages/admin/AdminPartnershipRequestsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { useApp } from './context/AppContext';
import { ForceChangePasswordModal } from './components/auth/ForceChangePasswordModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';

function AppRouter() {
  const { currentUser } = useApp();

  return (
    <>
      {/* Requirement 4: Globally enforce mandatory password change for recovery sessions */}
      {(currentUser?.mustChangePassword || currentUser?.isRecoverySession) && <ForceChangePasswordModal />}
      
      <Routes>
        {/* ========================================================================= */}
        {/* 1. PUBLIC WEBSITE ROUTES (5 Main Navigation Items & Subsystems)           */}
        {/* ========================================================================= */}
        <Route element={<PublicLayout />}>
          {/* Item 1: Trang chủ (Home) */}
          <Route path="/" element={<HomePage />} />

          {/* Item 2: Về chúng tôi (About Us) */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/organization" element={<Navigate to="/about#structure" replace />} />

          {/* Item 3: Hoạt động (Activities) — 6 Tabs nested under ActivitiesLayout */}
          <Route path="/activities" element={<ActivitiesLayout />}>
            <Route index element={<Navigate to="/activities/sinh-hoat" replace />} />

            {/* 6 Official Tab Routes */}
            <Route path="sinh-hoat" element={<InternalActivitiesTab />} />
            <Route path="workshop" element={<WorkshopsTab />} />
            <Route path="cuoc-thi" element={<CompetitionsTab />} />
            <Route path="du-an" element={<CompanionProjectsTab />} />
            <Route path="bk-shark" element={<BKSharkTab />} />
            <Route path="tuyen-thanh-vien" element={<RecruitmentTab />} />

            {/* Backward Compatibility Aliases (Preserve old URLs and test stability) */}
            <Route path="internal" element={<Navigate to="/activities/sinh-hoat" replace />} />
            <Route path="workshops" element={<Navigate to="/activities/workshop" replace />} />
            <Route path="competitions" element={<Navigate to="/activities/cuoc-thi" replace />} />
            <Route path="companion-projects" element={<Navigate to="/activities/du-an" replace />} />
            <Route path="recruitment" element={<Navigate to="/activities/tuyen-thanh-vien" replace />} />
          </Route>

          {/* Subpage Detail Routes */}
          <Route path="/activities/workshops/:slug" element={<WorkshopDetailPage />} />
          <Route path="/activities/workshop/:slug" element={<WorkshopDetailPage />} />
          <Route path="/activities/competitions/:slug" element={<CompetitionDetailPage />} />
          <Route path="/activities/cuoc-thi/:slug" element={<CompetitionDetailPage />} />
          <Route path="/activities/companion-projects/:slug" element={<CompanionProjectDetailPage />} />
          <Route path="/activities/du-an/:slug" element={<CompanionProjectDetailPage />} />
          <Route path="/activities/bk-shark/:season" element={<BKSharkSeasonDetailPage />} />

          {/* Item 4: Hợp tác (Partnership) — Dedicated Companion Project Platform */}
          <Route path="/partnership" element={<PartnershipPage />} />
          <Route path="/partnership/companion-project" element={<Navigate to="/partnership" replace />} />
          <Route path="/partnership/partners" element={<Navigate to="/partnership" replace />} />
          <Route path="/partnership/business" element={<Navigate to="/partnership" replace />} />

          {/* Legacy / Alias Routes (Preserved for backward compatibility) */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/contact" element={<PartnershipPage />} />

          {/* 404 Unknown Route Handling */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ========================================================================= */}
        {/* 2. AUTHENTICATION ROUTES (Item 5: Đăng nhập - Login)                       */}
        {/* ========================================================================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route path="/auth/callback" element={<Navigate to="/portal" replace />} />

        {/* Dedicated QR Check-in Routes */}
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/checkin/:sessionId" element={<CheckInPage />} />

        {/* ========================================================================= */}
        {/* 3. MEMBER PORTAL ROUTES (Preserved 100%)                                  */}
        {/* ========================================================================= */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalDashboardPage />} />
          <Route path="profile" element={<PortalProfilePage />} />
          <Route path="sessions" element={<PortalSessionsPage />} />
          <Route path="attendance" element={<PortalAttendancePage />} />
          <Route path="evaluations" element={<PortalEvaluationsPage />} />
          <Route path="feedback" element={<PortalFeedbackPage />} />
          <Route path="penalties" element={<Navigate to="/portal/attendance?tab=penalties" replace />} />
        </Route>

        {/* ========================================================================= */}
        {/* 4. ADMIN PORTAL ROUTES (Preserved 100%)                                   */}
        {/* ========================================================================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="sessions" element={<AdminSessionsPage />} />
          <Route path="attendance" element={<AdminAttendancePage />} />
          <Route path="evaluations" element={<AdminEvaluationsPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
          <Route path="penalties" element={<Navigate to="/admin/attendance?tab=penalties" replace />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="partnerships" element={<AdminPartnershipRequestsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
