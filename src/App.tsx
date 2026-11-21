// BK-IC Digital Hub - Main Application Router & Sitemap Architecture
// Optimized with Route-Based Code Splitting (React.lazy + Suspense) for Admin, Portal, Auth & Detail Subpages
// while keeping core Public Pages & 6 Activities Tabs instant (0ms in-page switching)
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Public Layout & Primary Public Pages (Eagerly loaded for instant FCP/LCP)
import { PublicLayout } from './components/layout/PublicLayout';
import { HomePage } from './pages/HomePage';

// Route-based Code Splitting for heavy subpages (Optimizes bundle size, memory & avoids UI freezing)
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage').then((m) => ({ default: m.PartnershipPage })));

// Activities Layout & 6 Tabs (Kept eager together so switching tabs inside /activities is 0ms instant)
import { ActivitiesLayout } from './pages/activities/ActivitiesLayout';
import { InternalActivitiesTab } from './pages/activities/tabs/InternalActivitiesTab';
import { WorkshopsTab } from './pages/activities/tabs/WorkshopsTab';
import { CompetitionsTab } from './pages/activities/tabs/CompetitionsTab';
import { CompanionProjectsTab } from './pages/activities/tabs/CompanionProjectsTab';
import { BKSharkTab } from './pages/activities/tabs/BKSharkTab';
import { RecruitmentTab } from './pages/activities/tabs/RecruitmentTab';

// Lazy-loaded Detail Subpages
const WorkshopDetailPage = lazy(() =>
  import('./pages/activities/WorkshopDetailPage').then((m) => ({ default: m.WorkshopDetailPage }))
);
const CompetitionDetailPage = lazy(() =>
  import('./pages/activities/CompetitionDetailPage').then((m) => ({ default: m.CompetitionDetailPage }))
);
const CompanionProjectDetailPage = lazy(() =>
  import('./pages/activities/CompanionProjectDetailPage').then((m) => ({ default: m.CompanionProjectDetailPage }))
);
const BKSharkSeasonDetailPage = lazy(() =>
  import('./pages/activities/BKSharkSeasonDetailPage').then((m) => ({ default: m.BKSharkSeasonDetailPage }))
);

// Lazy-loaded Legacy / Secondary Public Pages
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })));
const JoinPage = lazy(() => import('./pages/JoinPage').then((m) => ({ default: m.JoinPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Lazy-loaded Auth & QR Check-in Pages (Isolates jsqr & QR camera dependencies from public visitors)
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const PendingApprovalPage = lazy(() =>
  import('./pages/auth/PendingApprovalPage').then((m) => ({ default: m.PendingApprovalPage }))
);
const ResetPasswordPage = lazy(() =>
  import('./pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const VerifyEmailPage = lazy(() =>
  import('./pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage }))
);
const CheckInPage = lazy(() =>
  import('./pages/checkin/CheckInPage').then((m) => ({ default: m.CheckInPage }))
);

// Lazy-loaded Member Portal Layout & Pages
const PortalLayout = lazy(() =>
  import('./components/portal/PortalLayout').then((m) => ({ default: m.PortalLayout }))
);
const PortalDashboardPage = lazy(() =>
  import('./pages/portal/PortalDashboardPage').then((m) => ({ default: m.PortalDashboardPage }))
);
const PortalProfilePage = lazy(() =>
  import('./pages/portal/PortalProfilePage').then((m) => ({ default: m.PortalProfilePage }))
);
const PortalSessionsPage = lazy(() =>
  import('./pages/portal/PortalSessionsPage').then((m) => ({ default: m.PortalSessionsPage }))
);
const PortalAttendancePage = lazy(() =>
  import('./pages/portal/PortalAttendancePage').then((m) => ({ default: m.PortalAttendancePage }))
);
const PortalEvaluationsPage = lazy(() =>
  import('./pages/portal/PortalEvaluationsPage').then((m) => ({ default: m.PortalEvaluationsPage }))
);
const PortalFeedbackPage = lazy(() =>
  import('./pages/portal/PortalFeedbackPage').then((m) => ({ default: m.PortalFeedbackPage }))
);

// Lazy-loaded Admin CMS Layout & 10 Admin Pages (Isolates all Admin CMS code from public bundle)
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminMembersPage = lazy(() =>
  import('./pages/admin/AdminMembersPage').then((m) => ({ default: m.AdminMembersPage }))
);
const AdminSessionsPage = lazy(() =>
  import('./pages/admin/AdminSessionsPage').then((m) => ({ default: m.AdminSessionsPage }))
);
const AdminAttendancePage = lazy(() =>
  import('./pages/admin/AdminAttendancePage').then((m) => ({ default: m.AdminAttendancePage }))
);
const AdminEvaluationsPage = lazy(() =>
  import('./pages/admin/AdminEvaluationsPage').then((m) => ({ default: m.AdminEvaluationsPage }))
);
const AdminFeedbackPage = lazy(() =>
  import('./pages/admin/AdminFeedbackPage').then((m) => ({ default: m.AdminFeedbackPage }))
);
const AdminApplicationsPage = lazy(() =>
  import('./pages/admin/AdminApplicationsPage').then((m) => ({ default: m.AdminApplicationsPage }))
);
const AdminPartnershipRequestsPage = lazy(() =>
  import('./pages/admin/AdminPartnershipRequestsPage').then((m) => ({
    default: m.AdminPartnershipRequestsPage
  }))
);
const AdminContentPage = lazy(() =>
  import('./pages/admin/AdminContentPage').then((m) => ({ default: m.AdminContentPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);

import { useApp } from './context/AppContext';
import { ForceChangePasswordModal } from './components/auth/ForceChangePasswordModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';

// Minimal, non-blocking loading fallback that preserves layout stability (0 CLS)
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
  </div>
);

function AppRouter() {
  const { currentUser } = useApp();

  return (
    <>
      {/* Requirement 4: Globally enforce mandatory password change for recovery sessions */}
      {(currentUser?.mustChangePassword || currentUser?.isRecoverySession) && <ForceChangePasswordModal />}

      <Suspense fallback={<RouteLoadingFallback />}>
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
      </Suspense>
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
