// BK-IC Digital Hub - Main Application Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { PortalLayout } from './components/portal/PortalLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { EventsPage } from './pages/EventsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NewsPage } from './pages/NewsPage';
import { JoinPage } from './pages/JoinPage';
import { ContactPage } from './pages/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { PendingApprovalPage } from './pages/auth/PendingApprovalPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { CheckInPage } from './pages/checkin/CheckInPage';

// Member Portal Pages
import { PortalDashboardPage } from './pages/portal/PortalDashboardPage';
import { PortalProfilePage } from './pages/portal/PortalProfilePage';
import { PortalSessionsPage } from './pages/portal/PortalSessionsPage';
import { PortalAttendancePage } from './pages/portal/PortalAttendancePage';
import { PortalEvaluationsPage } from './pages/portal/PortalEvaluationsPage';
import { PortalFeedbackPage } from './pages/portal/PortalFeedbackPage';

// Admin Portal Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminSessionsPage } from './pages/admin/AdminSessionsPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { AdminEvaluationsPage } from './pages/admin/AdminEvaluationsPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { useApp } from './context/AppContext';
import { ForceChangePasswordModal } from './components/auth/ForceChangePasswordModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function AppRouter() {
  const { currentUser } = useApp();

  return (
    <>
      {/* Requirement 4: Globally enforce mandatory password change for recovery sessions */}
      {(currentUser?.mustChangePassword || currentUser?.isRecoverySession) && <ForceChangePasswordModal />}
      
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        <Route path="/auth/callback" element={<Navigate to="/portal" replace />} />

        {/* Dedicated QR Check-in Routes */}
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/checkin/:sessionId" element={<CheckInPage />} />

        {/* Member Portal Routes */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalDashboardPage />} />
          <Route path="profile" element={<PortalProfilePage />} />
          <Route path="sessions" element={<PortalSessionsPage />} />
          <Route path="attendance" element={<PortalAttendancePage />} />
          <Route path="evaluations" element={<PortalEvaluationsPage />} />
          <Route path="feedback" element={<PortalFeedbackPage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="sessions" element={<AdminSessionsPage />} />
          <Route path="attendance" element={<AdminAttendancePage />} />
          <Route path="evaluations" element={<AdminEvaluationsPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

