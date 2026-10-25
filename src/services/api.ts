// BK-IC Client API Service - Communicating with Server-Authoritative Backend
import {
  User,
  TrainingSession,
  AttendanceRecord,
  AttendanceRequest,
  Task,
  MonthlyEvaluation,
  Notification,
  AuditLog,
  Application,
  FeedbackSummary,
  AttendanceStatus,
  MemberStatus,
  UnitId
} from '../types';

const TOKEN_KEY = 'bkic_session_token';
let currentAuthToken: string | null = typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_KEY) : null;
let currentUserIdHeader: string | null = null;

export function setApiAuthToken(token: string | null) {
  currentAuthToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }
}

export function getApiAuthToken(): string | null {
  return currentAuthToken;
}

export function setApiUserContext(userId: string | null) {
  currentUserIdHeader = userId;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (currentAuthToken) {
    headers.set('Authorization', `Bearer ${currentAuthToken}`);
  }

  if (currentUserIdHeader) {
    headers.set('x-user-id', currentUserIdHeader);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error: any = new Error(data.message || `Lỗi yêu cầu (${res.status})`);
    error.status = res.status;
    error.code = data.code;
    throw error;
  }
  return data;
}

export const api = {
  auth: {
    getMe: () => request<{ success: boolean; user: User; session?: { isRecoverySession?: boolean; mustChangePassword?: boolean } }>('/api/auth/me'),
    login: (email: string, password?: string) => request<{
      success: boolean;
      user: User;
      token?: string;
      message: string;
      mustChangePassword?: boolean;
      isRecoverySession?: boolean;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    logout: () => request<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST'
    }),
    register: (payload: {
      email: string;
      password: string;
      fullName: string;
      studentId: string;
      phone?: string;
      faculty?: string;
      classId?: string;
      academicYear?: string;
      desiredUnit?: UnitId;
      motivation?: string;
    }) => request<{ success: boolean; message: string; user: User; token?: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    changePassword: (payload: { oldPassword?: string; newPassword: string }) =>
      request<{ success: boolean; message: string; token?: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    requestTempPassword: (email: string) =>
      request<{ success: boolean; message: string; deliveryMethod?: string }>('/api/auth/request-temp-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    completeRecoveryPassword: (payload: { newPassword: string; confirmPassword: string }) =>
      request<{ success: boolean; message: string; user: User; token?: string }>('/api/auth/complete-recovery-password', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    forgotPassword: (email: string) =>
      request<{ success: boolean; message: string; deliveryMethod?: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    verifyResetToken: (token: string) =>
      request<{ success: boolean; valid: boolean; email?: string; fullName?: string; message?: string }>(
        `/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`
      ),
    resetPasswordWithToken: (token: string, newPassword: string) =>
      request<{ success: boolean; message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      }),
    verifyEmail: (token: string) =>
      request<{ success: boolean; message: string; user?: User }>(
        `/api/auth/verify-email?token=${encodeURIComponent(token)}`
      ),
    resendVerification: (email: string) =>
      request<{ success: boolean; message: string; deliveryMethod?: string }>('/api/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    getEmailOutbox: () => request<{ success: boolean; emails: any[] }>('/api/auth/email-outbox'),
    clearEmailOutbox: () => request<{ success: boolean; message: string }>('/api/auth/email-outbox', {
      method: 'DELETE'
    }),
    sendMemberInvite: (memberId: string) =>
      request<{ success: boolean; message: string; inviteLink?: string }>('/api/auth/send-member-invite', {
        method: 'POST',
        body: JSON.stringify({ memberId })
      }),
    resetPassword: (email: string) =>
      request<{ success: boolean; message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    switchAccount: (payload: { role?: string; unit?: string; userId?: string }) =>
      request<{ success: boolean; user: User; token?: string; message?: string }>('/api/auth/switch-account', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getSmtpStatus: () =>
      request<{ success: boolean; isConfigured: boolean; source: string; host: string; port: number; user: string; from: string }>('/api/auth/smtp-status'),
    testSmtp: (payload: { to: string; customConfig?: any }) =>
      request<{ success: boolean; message: string }>('/api/auth/test-smtp', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    saveSmtpConfig: (payload: any) =>
      request<{ success: boolean; message: string }>('/api/auth/save-smtp-config', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },

  members: {
    getAll: () => request<{ success: boolean; members: User[] }>('/api/members'),
    getById: (id: string) => request<{ success: boolean; member: User }>(`/api/members/${id}`),
    create: (payload: any) => request<{ success: boolean; message: string; member: User; inviteLink?: string; initialPassword?: string }>('/api/members', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    changeStatus: (id: string, payload: { newStatus: MemberStatus; effectiveDate: string; reason: string; approvedBy?: string }) =>
      request<{ success: boolean; message: string; member: User }>(`/api/members/${id}/status-change`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    updateProfile: (id: string, payload: Partial<User>) =>
      request<{ success: boolean; member: User }>(`/api/members/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }),
    resetPassword: (id: string, newPassword?: string) =>
      request<{ success: boolean; message: string }>(`/api/members/${id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/api/members/${id}`, {
      method: 'DELETE'
    }),
    verifyEmail: (id: string) => request<{ success: boolean; message: string; member: User }>(`/api/members/${id}/verify-email`, {
      method: 'POST'
    })
  },

  sessions: {
    getAll: () => request<{ success: boolean; sessions: (TrainingSession & { qrWindowDetails?: any })[] }>('/api/sessions'),
    getById: (id: string) => request<{ success: boolean; session: TrainingSession & { qrWindowDetails?: any } }>(`/api/sessions/${id}`),
    create: (payload: any) => request<{ success: boolean; message: string; session: TrainingSession }>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    update: (id: string, payload: any) => request<{ success: boolean; session: TrainingSession }>(`/api/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
    cancel: (id: string, reason: string) => request<{ success: boolean; message: string; session: TrainingSession }>(`/api/sessions/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }),
    reopenFeedback: (id: string, reason: string) => request<{ success: boolean; message: string; session: TrainingSession }>(`/api/sessions/${id}/reopen-feedback`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  },

  attendance: {
    getSessionInfo: (sessionId: string) =>
      request<{
        success: boolean;
        session: TrainingSession;
        qrWindow: {
          isOpen: boolean;
          isBeforeWindow: boolean;
          isAfterWindow: boolean;
          remainingMinutes?: number;
          message?: string;
        };
      }>(`/api/attendance/session-info/${sessionId}`),
    getRecords: (params?: { sessionId?: string; memberId?: string }) => {
      const q = new URLSearchParams();
      if (params?.sessionId) q.set('sessionId', params.sessionId);
      if (params?.memberId) q.set('memberId', params.memberId);
      return request<{ success: boolean; attendance: AttendanceRecord[] }>(`/api/attendance?${q.toString()}`);
    },
    getQRToken: (sessionId: string) => request<{ success: boolean; token: string; expiresIn: number; intervalSec: number; qrWindowDetails: any }>('/api/attendance/qr-token', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    }),
    checkinQR: (sessionId: string, token?: string) =>
      request<{
        success: boolean;
        alreadyCheckedIn?: boolean;
        status?: AttendanceStatus;
        statusText?: string;
        message: string;
        record?: AttendanceRecord;
        session?: any;
        member?: any;
      }>('/api/attendance/checkin-qr', {
        method: 'POST',
        body: JSON.stringify({ sessionId, token })
      }),
    manualCheckin: (payload: { sessionId: string; memberId: string; status: AttendanceStatus; notes?: string }) =>
      request<{ success: boolean; message: string; record: AttendanceRecord }>('/api/attendance/manual-checkin', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    finalizeSession: (sessionId: string) =>
      request<{ success: boolean; message: string; session: TrainingSession }>('/api/attendance/finalize', {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      }),
    overrideRecord: (recordId: string, payload: { newStatus: AttendanceStatus; reason: string }) =>
      request<{ success: boolean; message: string; record: AttendanceRecord }>(`/api/attendance/${recordId}/override`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }),
    submitAbsenceExplanation: (payload: { sessionId: string; reason: string; evidenceUrl?: string }) =>
      request<{ success: boolean; message: string; request: AttendanceRequest }>('/api/attendance/absence-explanation', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    submitCorrectionRequest: (payload: { sessionId: string; reason: string; evidenceUrl?: string }) =>
      request<{ success: boolean; message: string; request: AttendanceRequest }>('/api/attendance/correction-request', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getRequests: () => request<{ success: boolean; requests: AttendanceRequest[] }>('/api/attendance/requests'),
    decideRequest: (id: string, payload: { decision: 'approved' | 'rejected'; notes?: string; newAttendanceStatus?: AttendanceStatus }) =>
      request<{ success: boolean; message: string; request: AttendanceRequest }>(`/api/attendance/requests/${id}/decide`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getReport: (sessionId: string) =>
      request<{ success: boolean; report: any; attendees?: any[] }>(`/api/attendance/report/${sessionId}`)
  },

  feedback: {
    getMyFeedback: (sessionId: string) =>
      request<{
        success: boolean;
        sessionId: string;
        isEligible: boolean;
        hasSubmitted: boolean;
        isOpen: boolean;
        windowReason?: string;
        deadline?: string;
        message?: string;
        canEdit: boolean;
        feedback: any;
      }>(`/api/feedback/my-feedback/${sessionId}`),
    submit: (payload: {
      sessionId: string;
      contentQuality: number;
      delivery: number;
      durationSuitability: number;
      usefulness: number;
      valuableTakeaway?: string;
      improvementSuggestion?: string;
      nextTopicIdea?: string;
      feedbackText?: string;
      isAnonymous?: boolean;
    }) => request<{ success: boolean; message: string; feedback: any }>('/api/feedback/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getSummary: (sessionId: string) =>
      request<{
        success: boolean;
        canPublish: boolean;
        isPublished?: boolean;
        totalResponses?: number;
        threshold?: number;
        message?: string;
        summary?: FeedbackSummary;
        responses?: any[];
      }>(`/api/feedback/summary/${sessionId}`),
    getAll: (params?: { sessionId?: string }) => {
      const q = params?.sessionId ? `?sessionId=${encodeURIComponent(params.sessionId)}` : '';
      return request<{
        success: boolean;
        feedbacks: any[];
        metrics: {
          count: number;
          avgContentQuality: string | null;
          avgDelivery: string | null;
          avgDurationSuitability: string | null;
          avgUsefulness: string | null;
          overallAverage: string | null;
        };
      }>(`/api/feedback/list${q}`);
    },
    reopen: (sessionId: string, payload: { hours: number; reason: string }) =>
      request<{ success: boolean; message: string; session: any }>(`/api/feedback/reopen/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },

  tasks: {
    getAll: (params?: { unit?: string; assigneeId?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.unit) q.set('unit', params.unit);
      if (params?.assigneeId) q.set('assigneeId', params.assigneeId);
      if (params?.status) q.set('status', params.status);
      return request<{ success: boolean; tasks: Task[] }>(`/api/tasks?${q.toString()}`);
    },
    getStats: (memberId: string) =>
      request<{ success: boolean; stats: any }>(`/api/tasks/stats/${memberId}`),
    create: (payload: any) =>
      request<{ success: boolean; message: string; task: Task }>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    submitDeliverable: (id: string, payload: { content: string; proofUrl?: string }) =>
      request<{ success: boolean; message: string; task: Task }>(`/api/tasks/${id}/submit-deliverable`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    review: (id: string, payload: { decision: 'completed' | 'needs_revision'; reviewNotes?: string }) =>
      request<{ success: boolean; message: string; task: Task }>(`/api/tasks/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    cancel: (id: string, reason: string) =>
      request<{ success: boolean; message: string; task: Task }>(`/api/tasks/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      })
  },

  evaluations: {
    getAll: (params?: { month?: string; memberId?: string; unit?: string }) => {
      const q = new URLSearchParams();
      if (params?.month) q.set('month', params.month);
      if (params?.memberId) q.set('memberId', params.memberId);
      if (params?.unit) q.set('unit', params.unit);
      return request<{ success: boolean; evaluations: MonthlyEvaluation[] }>(`/api/evaluations?${q.toString()}`);
    },
    save: (payload: { memberId: string; month: string; criteria: any[] }) =>
      request<{ success: boolean; message: string; evaluation: MonthlyEvaluation }>('/api/evaluations', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    approve: (id: string) =>
      request<{ success: boolean; message: string; evaluation: MonthlyEvaluation }>(`/api/evaluations/${id}/approve`, {
        method: 'POST'
      }),
    appeal: (id: string, reason: string) =>
      request<{ success: boolean; message: string; evaluation: MonthlyEvaluation }>(`/api/evaluations/${id}/appeal`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
    resolveAppeal: (id: string, payload: { decision: 'accepted' | 'rejected'; resolutionNotes: string; updatedCriteria?: any[] }) =>
      request<{ success: boolean; message: string; evaluation: MonthlyEvaluation }>(`/api/evaluations/${id}/resolve-appeal`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },

  notifications: {
    getAll: () => request<{ success: boolean; notifications: Notification[]; unreadCount: number }>('/api/notifications'),
    markRead: (id: string) => request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request<{ success: boolean }>('/api/notifications/mark-all-read', { method: 'POST' }),
    runReminderEngine: () => request<{ success: boolean; message: string; generatedCount: number }>('/api/notifications/run-reminder-engine', { method: 'POST' })
  },

  reports: {
    getSummary: () => request<{ success: boolean; metrics: any }>('/api/reports/summary'),
    getExportLogs: () => request<{ success: boolean; exportLogs: any[] }>('/api/reports/export-logs'),
    exportCsv: async (payload: { type: string; format: string; unit?: string; month?: string; sessionId?: string }) => {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      if (currentUserIdHeader) headers.set('x-user-id', currentUserIdHeader);

      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Xuất file thất bại');
      return res.blob();
    }
  },

  audit: {
    getLogs: () => request<{ success: boolean; logs: AuditLog[] }>('/api/audit-logs')
  },

  cms: {
    getApplications: () => request<{ success: boolean; applications: Application[] }>('/api/applications'),
    submitApplication: (payload: any) => request<{ success: boolean; message: string; application: Application }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    convertApplicant: (id: string, payload: { unit: UnitId; position?: string }) =>
      request<{ success: boolean; message: string; member: User }>(`/api/applications/${id}/convert-to-member`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    getSettings: () => request<{ success: boolean; settings: any }>('/api/settings'),
    updateSettings: (payload: any) => request<{ success: boolean; settings: any }>('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
    resetDemo: () => request<{ success: boolean; message: string }>('/api/system/reset-demo', { method: 'POST' }),
    cleanTestData: () => request<{ success: boolean; message: string; data?: any }>('/api/system/clean-test-data', { method: 'POST' }),
    reloadDb: () => request<{ success: boolean; message: string }>('/api/system/reload-db', { method: 'POST' }),
    getServerTime: () => request<{ success: boolean; iso: string; currentTimeVN: string; currentDateVN: string; timestamp: number; timezone: string }>('/api/system/time')
  }
};
