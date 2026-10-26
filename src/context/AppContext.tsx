// BK-IC Digital Hub - Comprehensive App Context Connected to Server-Authoritative Backend
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  UserRole,
  UnitId,
  ClubUnit,
  Application,
  TrainingSession,
  AttendanceRecord,
  AttendanceRequest,
  AttendanceStatus,
  MemberStatus,
  Task,
  MonthlyEvaluation,
  Notification,
  AuditLog,
  SiteSettings,
  FeedbackSummary
} from '../types';
import { api, setApiUserContext, setApiAuthToken } from '../services/api';
import {
  INITIAL_UNITS,
  INITIAL_SITE_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_EVENTS,
  INITIAL_PROVENANCE_ARTICLES
} from '../data/initialData';

interface CheckInResult {
  success: boolean;
  message: string;
  status?: AttendanceStatus;
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole;
  currentUnit: UnitId | null;
  switchUser: (userId: string | null) => Promise<void>;
  quickSwitchRole: (role: UserRole, unit?: UnitId) => Promise<void>;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string; mustChangePassword?: boolean }>;
  register: (payload: any) => Promise<{ success: boolean; message: string; user?: User }>;
  requestTempPassword: (email: string) => Promise<{ success: boolean; message: string; deliveryMethod?: string; emailSentTo?: string }>;
  completeRecoveryPassword: (newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string; user?: User }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; emailSentTo?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string; emailSentTo?: string }>;
  verifyResetToken: (token: string) => Promise<{ success: boolean; valid: boolean; email?: string; fullName?: string; message?: string }>;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  resetMemberPassword: (memberId: string, newPassword?: string) => Promise<{ success: boolean; message: string; resetLink?: string }>;
  sendMemberInvite: (memberId: string) => Promise<{ success: boolean; message: string; inviteLink?: string }>;
  logout: () => void;
  isLoading: boolean;
  serverError: string | null;

  // Units
  units: ClubUnit[];
  committees: ClubUnit[]; // Backwards compatibility

  // Members
  users: User[];
  reloadMembers: () => Promise<void>;
  updateMemberStatus: (memberId: string, newStatus: MemberStatus, effectiveDate: string, reason: string, approvedBy?: string) => Promise<void>;
  updateMemberProfile: (id: string, partial: Partial<User>) => Promise<void>;
  addUser: (userData: any) => Promise<{ success: boolean; message: string; member: User; inviteLink?: string; initialPassword?: string }>;
  updateUser: (id: string, partial: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<{ success: boolean; message: string }>;
  verifyMemberEmail: (id: string) => Promise<{ success: boolean; message: string }>;

  // Training Sessions
  sessions: TrainingSession[];
  reloadSessions: () => Promise<void>;
  createSession: (sessionData: any) => Promise<TrainingSession>;
  updateSession: (id: string, partial: any) => Promise<void>;
  cancelSession: (id: string, reason: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>; // Backwards compatibility
  reopenSessionFeedback: (id: string, reason: string) => Promise<void>;
  generateSessionToken: (sessionId: string) => { token: string; expiresIn: number; intervalSec: number };

  // Attendance
  attendance: AttendanceRecord[];
  attendanceRequests: AttendanceRequest[];
  reloadAttendance: () => Promise<void>;
  checkInQR: (sessionId: string, token: string) => Promise<CheckInResult>;
  checkInSession: (sessionId: string, method: 'qr' | 'manual', token?: string) => Promise<CheckInResult>; // Backwards compatibility
  manualCheckin: (sessionId: string, memberId: string, status: AttendanceStatus, notes?: string) => Promise<void>;
  finalizeSessionAttendance: (sessionId: string) => Promise<void>;
  overrideAttendance: (recordId: string, newStatus: AttendanceStatus, reason: string) => Promise<void>;
  submitAbsenceExplanation: (sessionId: string, reason: string, evidenceUrl?: string) => Promise<void>;
  submitAbsenceRequest: (sessionId: string, reason: string) => Promise<void>; // Backwards compatibility
  submitCorrectionRequest: (sessionId: string, reason: string, evidenceUrl?: string) => Promise<void>;
  decideAttendanceRequest: (id: string, decision: 'approved' | 'rejected', notes?: string, newAttendanceStatus?: AttendanceStatus) => Promise<void>;

  // Tasks
  tasks: Task[];
  reloadTasks: () => Promise<void>;
  createTask: (data: any) => Promise<Task>;
  submitTaskDeliverable: (taskId: string, content: string, proofUrl?: string) => Promise<void>;
  reviewTask: (taskId: string, decision: 'completed' | 'needs_revision', reviewNotes?: string) => Promise<void>;
  cancelTask: (taskId: string, reason: string) => Promise<void>;

  // Monthly Evaluations
  evaluations: MonthlyEvaluation[];
  reloadEvaluations: () => Promise<void>;
  saveEvaluation: (arg1: any, arg2?: any, arg3?: any) => Promise<void>;
  updateEvaluation: (id: string, partial: any) => Promise<void>;
  approveEvaluation: (id: string) => Promise<void>;
  appealEvaluation: (id: string, reason: string) => Promise<void>;
  resolveEvaluationAppeal: (id: string, decision: 'accepted' | 'rejected', resolutionNotes: string, updatedCriteria?: any[]) => Promise<void>;

  // Feedback
  feedback: any[];
  submitFeedback: (data: any) => Promise<any>; // Backwards compatibility
  submitTrainingFeedback: (data: {
    sessionId: string;
    isAnonymous?: boolean;
    contentQuality: number;
    delivery: number;
    durationSuitability: number;
    usefulness: number;
    valuableTakeaway?: string;
    improvementSuggestion?: string;
    nextTopicIdea?: string;
    feedbackText?: string;
  }) => Promise<any>;
  getFeedbackSummary: (sessionId: string) => Promise<{ summary?: FeedbackSummary; responses?: any[]; canPublish?: boolean; message?: string }>;
  getFeedbackList: (sessionId?: string) => Promise<any>;
  reopenFeedbackWindow: (sessionId: string, hours: number, reason: string) => Promise<any>;
  getAttendanceReport: (sessionId: string) => Promise<any>;

  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;
  reloadNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  runReminderEngine: () => Promise<number>;

  // Applications
  applications: Application[];
  reloadApplications: () => Promise<void>;
  submitApplication: (data: any) => Promise<Application>;
  updateApplicationStatus: (id: string, status: any, notes?: string) => Promise<void>;
  convertApplicationToMember: (applicationId: string, unit: UnitId, position?: string) => Promise<User | null>;

  // CMS Content
  projects: any[];
  events: any[];
  articles: any[];
  addProject: (prj: any) => any;
  addEvent: (evt: any) => any;

  // Site Settings & Audit
  siteSettings: SiteSettings;
  updateSiteSettings: (partial: Partial<SiteSettings>) => Promise<void>;
  auditLogs: AuditLog[];
  reloadAuditLogs: () => Promise<void>;
  resetToDefaultData: () => Promise<void>;
  cleanTestData: () => Promise<void>;

  // Authoritative Server Time
  serverTime: { iso: string; currentTimeVN: string; currentDateVN: string } | null;
  refreshServerTime: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [units] = useState<ClubUnit[]>(INITIAL_UNITS);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [evaluations, setEvaluations] = useState<MonthlyEvaluation[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [projects, setProjects] = useState<any[]>(INITIAL_PROJECTS);
  const [events, setEvents] = useState<any[]>(INITIAL_EVENTS);
  const [articles] = useState<any[]>(INITIAL_PROVENANCE_ARTICLES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [serverTime, setServerTime] = useState<{ iso: string; currentTimeVN: string; currentDateVN: string } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [serverError, setServerError] = useState<string | null>(null);

  // Load server time
  const refreshServerTime = useCallback(async () => {
    try {
      const res = await api.cms.getServerTime();
      if (res.success) {
        setServerTime({
          iso: res.iso,
          currentTimeVN: res.currentTimeVN,
          currentDateVN: res.currentDateVN
        });
      }
    } catch {
      // offline or server starting
    }
  }, []);

  // Reload Members
  const reloadMembers = useCallback(async () => {
    try {
      const res = await api.members.getAll();
      if (res?.success && Array.isArray(res.members)) {
        setUsers(res.members);
      }
    } catch (err: any) {
      console.warn('Could not reload members from backend:', err);
    }
  }, []);

  // Reload Sessions
  const reloadSessions = useCallback(async () => {
    try {
      const res = await api.sessions.getAll();
      if (res?.success && Array.isArray(res.sessions)) {
        setSessions(res.sessions);
      }
    } catch (err: any) {
      console.warn('Could not reload sessions from backend:', err);
    }
  }, []);

  // Reload Attendance & Requests
  const reloadAttendance = useCallback(async () => {
    try {
      const resAtt = await api.attendance.getRecords();
      if (resAtt?.success) {
        if (Array.isArray(resAtt.attendance)) {
          setAttendance(resAtt.attendance);
        } else if (Array.isArray((resAtt as any).records)) {
          setAttendance((resAtt as any).records);
        }
      }
      const resReq = await api.attendance.getRequests();
      if (resReq?.success && Array.isArray(resReq.requests)) {
        setAttendanceRequests(resReq.requests);
      }
    } catch (err: any) {
      console.warn('Could not reload attendance from backend:', err);
    }
  }, []);

  // Reload Tasks
  const reloadTasks = useCallback(async () => {
    try {
      const res = await api.tasks.getAll();
      if (res?.success && Array.isArray(res.tasks)) {
        setTasks(res.tasks);
      }
    } catch (err: any) {
      console.warn('Could not reload tasks from backend:', err);
    }
  }, []);

  // Reload Evaluations
  const reloadEvaluations = useCallback(async () => {
    try {
      const res = await api.evaluations.getAll();
      if (res?.success && Array.isArray(res.evaluations)) {
        setEvaluations(res.evaluations);
      }
    } catch (err: any) {
      console.warn('Could not reload evaluations from backend:', err);
    }
  }, []);

  // Reload Notifications
  const reloadNotifications = useCallback(async () => {
    try {
      const res = await api.notifications.getAll();
      if (res?.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadNotificationCount(res.unreadCount || 0);
      }
    } catch (err: any) {
      console.warn('Could not reload notifications from backend:', err);
    }
  }, []);

  // Reload Applications
  const reloadApplications = useCallback(async () => {
    try {
      const res = await api.cms.getApplications();
      if (res?.success && Array.isArray(res.applications)) {
        setApplications(res.applications);
      }
    } catch (err: any) {
      console.warn('Could not reload applications from backend:', err);
    }
  }, []);

  // Reload Audit Logs
  const reloadAuditLogs = useCallback(async () => {
    try {
      const res = await api.audit.getLogs();
      if (res?.success && Array.isArray(res.logs)) {
        setAuditLogs(res.logs);
      }
    } catch (err: any) {
      console.warn('Could not reload audit logs from backend:', err);
    }
  }, []);

  // Sync all data from server
  const syncAllData = useCallback(async () => {
    setIsLoading(true);
    setServerError(null);
    try {
      // 1. Auth check
      try {
        const authRes = await api.auth.getMe();
        if (authRes.success && authRes.user) {
          const userObj: User = {
            ...authRes.user,
            mustChangePassword: authRes.session?.mustChangePassword ?? authRes.user.mustChangePassword,
            isRecoverySession: authRes.session?.isRecoverySession ?? authRes.user.isRecoverySession
          };
          setCurrentUser(userObj);
          setApiUserContext(userObj.id);

          // If in mandatory recovery session, do not call protected business endpoints (avoids 403)
          if (userObj.mustChangePassword || userObj.isRecoverySession) {
            await refreshServerTime();
            return;
          }
        }
      } catch (err: any) {
        if (err.status === 401) {
          setCurrentUser(null);
          setApiAuthToken(null);
          setApiUserContext(null);
          // Return early if not logged in - don't fail, allow unauthenticated access to public data
          await refreshServerTime();
          return;
        }
      }

      await Promise.allSettled([
        reloadMembers(),
        reloadSessions(),
        reloadAttendance(),
        reloadTasks(),
        reloadEvaluations(),
        reloadNotifications(),
        reloadApplications(),
        reloadAuditLogs(),
        refreshServerTime()
      ]);
    } catch (err: any) {
      console.error('Error syncing data with backend:', err);
      setServerError('Đang kết nối tới máy chủ backend...');
    } finally {
      setIsLoading(false);
    }
  }, [
    reloadMembers,
    reloadSessions,
    reloadAttendance,
    reloadTasks,
    reloadEvaluations,
    reloadNotifications,
    reloadApplications,
    reloadAuditLogs,
    refreshServerTime
  ]);

  // Initial load
  useEffect(() => {
    syncAllData();
  }, [syncAllData]);

  // Periodic background polling (every 6s) to ensure real-time attendance lifecycle state transitions
  useEffect(() => {
    const timer = setInterval(() => {
      reloadSessions().catch(() => {});
      refreshServerTime().catch(() => {});
    }, 6000);
    return () => clearInterval(timer);
  }, [reloadSessions, refreshServerTime]);

  // Switch user
  const switchUser = async (userId: string | null) => {
    if (!userId) {
      logout();
      return;
    }
    try {
      const res = await api.auth.switchAccount({ userId });
      if (res.success && res.user) {
        if (res.token) setApiAuthToken(res.token);
        setCurrentUser(res.user);
        setApiUserContext(res.user.id);
        await syncAllData();
      }
    } catch (err: any) {
      console.error('Failed to switch user:', err);
    }
  };

  // Quick switch role / unit (Admin only)
  const quickSwitchRole = async (role: UserRole, unit?: UnitId) => {
    try {
      const res = await api.auth.switchAccount({ role, unit });
      if (res.success && res.user) {
        if (res.token) setApiAuthToken(res.token);
        setCurrentUser(res.user);
        setApiUserContext(res.user.id);
        await syncAllData();
      }
    } catch (err: any) {
      console.error('Failed to quick-switch role:', err);
    }
  };

  // Real Login
  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string; mustChangePassword?: boolean; isRecoverySession?: boolean }> => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success) {
        if (res.token) setApiAuthToken(res.token);
        const userObj: User = {
          ...res.user,
          mustChangePassword: res.mustChangePassword ?? res.user.mustChangePassword,
          isRecoverySession: res.isRecoverySession ?? res.user.isRecoverySession
        };
        setCurrentUser(userObj);
        setApiUserContext(userObj.id);
        if (!userObj.mustChangePassword && !userObj.isRecoverySession) {
          await syncAllData();
        }
        return { 
          success: true, 
          message: res.message, 
          mustChangePassword: userObj.mustChangePassword,
          isRecoverySession: userObj.isRecoverySession
        };
      }
      return { success: false, message: 'Đăng nhập thất bại' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Đăng nhập thất bại' };
    }
  };

  // Real Account Registration
  const register = async (payload: any): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const res = await api.auth.register(payload);
      if (res.success) {
        if (res.token) setApiAuthToken(res.token);
        setCurrentUser(res.user);
        setApiUserContext(res.user.id);
        await syncAllData();
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, message: 'Đăng ký thất bại' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Đăng ký thất bại' };
    }
  };

  // Request Temporary Password (Requirements 2, 3 & 6)
  const requestTempPassword = async (email: string): Promise<{ success: boolean; message: string; deliveryMethod?: string }> => {
    try {
      const res = await api.auth.requestTempPassword(email);
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể gửi mật khẩu tạm thời.' };
    }
  };

  // Complete Recovery Password Change (Requirement 4)
  const completeRecoveryPassword = async (newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const res = await api.auth.completeRecoveryPassword({ newPassword, confirmPassword });
      if (res.success && res.user) {
        if (res.token) setApiAuthToken(res.token);
        setCurrentUser(res.user);
        setApiUserContext(res.user.id);
        await syncAllData();
      }
      return { success: true, message: res.message, user: res.user };
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể đổi mật khẩu mới.' };
    }
  };

  // Forgot Password / Request Reset Email (Requirement B & C)
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; deliveryMethod?: string }> => {
    try {
      const res = await api.auth.forgotPassword(email);
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.' };
    }
  };

  const resetPassword = forgotPassword;

  // Verify Reset Token validity
  const verifyResetToken = async (token: string): Promise<{ success: boolean; valid: boolean; email?: string; fullName?: string; message?: string }> => {
    try {
      const res = await api.auth.verifyResetToken(token);
      return res;
    } catch (err: any) {
      return { success: false, valid: false, message: err.message || 'Liên kết đặt lại mật khẩu không hợp lệ.' };
    }
  };

  // Reset Password using single-use Token
  const resetPasswordWithToken = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.auth.resetPasswordWithToken(token, newPassword);
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể đặt lại mật khẩu.' };
    }
  };

  // Issue password reset / invite email for member by Admin
  const resetMemberPassword = async (memberId: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
    try {
      const res = await api.members.resetPassword(memberId);
      await reloadMembers();
      await reloadAuditLogs();
      return { success: true, message: res.message, resetLink: (res as any).resetLink };
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể gửi liên kết đặt lại mật khẩu' };
    }
  };

  // Send initial setup invitation email to member
  const sendMemberInvite = async (memberId: string): Promise<{ success: boolean; message: string; inviteLink?: string }> => {
    try {
      const res = await api.auth.sendMemberInvite(memberId);
      await reloadMembers();
      return { success: true, message: res.message, inviteLink: res.inviteLink };
    } catch (err: any) {
      return { success: false, message: err.message || 'Không thể gửi thư mời' };
    }
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    setApiAuthToken(null);
    setApiUserContext(null);
    setCurrentUser(null);
  };

  // Update member status
  const updateMemberStatus = async (
    memberId: string,
    newStatus: MemberStatus,
    effectiveDate: string,
    reason: string,
    approvedBy?: string
  ) => {
    const res = await api.members.changeStatus(memberId, {
      newStatus,
      effectiveDate,
      reason,
      approvedBy
    });
    alert(res.message);
    await reloadMembers();
    await reloadTasks();
    await reloadAuditLogs();
  };

  const updateMemberProfile = async (id: string, partial: Partial<User>) => {
    await api.members.updateProfile(id, partial);
    await reloadMembers();
  };

  // Admin directly creates account/member
  const addUser = async (userData: any): Promise<{ success: boolean; message: string; member: User; inviteLink?: string; initialPassword?: string }> => {
    const res = await api.members.create(userData);
    await reloadMembers();
    await reloadAuditLogs();
    return res;
  };

  const updateUser = async (id: string, partial: Partial<User>) => {
    await updateMemberProfile(id, partial);
  };

  const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.members.delete(id);
      await reloadMembers();
      await reloadAuditLogs();
      return { success: true, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Xóa thành viên thất bại' };
    }
  };

  const verifyMemberEmail = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.members.verifyEmail(id);
      await reloadMembers();
      await reloadAuditLogs();
      return { success: true, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Xác thực email thất bại' };
    }
  };

  // Training Sessions
  const createSession = async (sessionData: any): Promise<TrainingSession> => {
    try {
      const payload = {
        ...sessionData,
        personInChargeId: sessionData.personInChargeId || currentUser?.id
      };
      const res = await api.sessions.create(payload);
      alert(res.message);
      await reloadSessions();
      await reloadAuditLogs();
      return res.session;
    } catch (err: any) {
      alert(err.message || 'Không thể tạo buổi training. Vui lòng kiểm tra lại thông tin.');
      throw err;
    }
  };

  const updateSession = async (id: string, partial: any): Promise<void> => {
    try {
      await api.sessions.update(id, partial);
      await reloadSessions();
      await reloadAuditLogs();
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật buổi sinh hoạt.');
      throw err;
    }
  };

  const cancelSession = async (id: string, reason: string) => {
    const res = await api.sessions.cancel(id, reason);
    alert(res.message);
    await reloadSessions();
    await reloadAuditLogs();
  };

  const deleteSession = async (id: string) => {
    await cancelSession(id, 'Hủy phiên sinh hoạt');
  };

  const reopenSessionFeedback = async (id: string, reason: string) => {
    const res = await api.sessions.reopenFeedback(id, reason);
    alert(res.message);
    await reloadSessions();
    await reloadAuditLogs();
  };

  const generateSessionToken = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    const intervalSec = session?.qrIntervalSec || 20;
    const now = Math.floor(Date.now() / 1000);
    const windowSlot = Math.floor(now / intervalSec);
    const expiresIn = intervalSec - (now % intervalSec);
    const token = `BKIC-QR-${sessionId.slice(-6)}-${windowSlot.toString(36).toUpperCase()}-${((windowSlot * 47) % 10000).toString().padStart(4, '0')}`;
    return { token, expiresIn, intervalSec };
  };

  // Attendance
  const checkInQR = async (sessionId: string, token: string): Promise<CheckInResult> => {
    try {
      const res = await api.attendance.checkinQR(sessionId, token);
      await reloadAttendance();
      await reloadAuditLogs();
      return {
        success: true,
        message: res.message,
        status: res.status
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Điểm danh QR thất bại'
      };
    }
  };

  const checkInSession = async (sessionId: string, method: 'qr' | 'manual', token?: string): Promise<CheckInResult> => {
    if (method === 'qr') {
      return checkInQR(sessionId, token || '');
    } else {
      if (currentUser) {
        await manualCheckin(sessionId, currentUser.id, 'present', 'Điểm danh thủ công');
        return { success: true, message: 'Điểm danh thủ công thành công', status: 'present' };
      }
      return { success: false, message: 'Chưa đăng nhập' };
    }
  };

  const submitAbsenceRequest = async (sessionId: string, reason: string) => {
    await submitAbsenceExplanation(sessionId, reason);
  };

  const manualCheckin = async (sessionId: string, memberId: string, status: AttendanceStatus, notes?: string) => {
    const res = await api.attendance.manualCheckin({ sessionId, memberId, status, notes });
    alert(res.message);
    await reloadAttendance();
    await reloadAuditLogs();
  };

  const finalizeSessionAttendance = async (sessionId: string) => {
    const res = await api.attendance.finalizeSession(sessionId);
    alert(res.message);
    await reloadSessions();
    await reloadAttendance();
    await reloadAuditLogs();
  };

  const overrideAttendance = async (recordId: string, newStatus: AttendanceStatus, reason: string) => {
    const res = await api.attendance.overrideRecord(recordId, { newStatus, reason });
    alert(res.message);
    await reloadAttendance();
    await reloadAuditLogs();
  };

  const submitAbsenceExplanation = async (sessionId: string, reason: string, evidenceUrl?: string) => {
    const res = await api.attendance.submitAbsenceExplanation({ sessionId, reason, evidenceUrl });
    alert(res.message);
    await reloadAttendance();
    await reloadNotifications();
    await reloadAuditLogs();
  };

  const submitCorrectionRequest = async (sessionId: string, reason: string, evidenceUrl?: string) => {
    const res = await api.attendance.submitCorrectionRequest({ sessionId, reason, evidenceUrl });
    alert(res.message);
    await reloadAttendance();
    await reloadNotifications();
    await reloadAuditLogs();
  };

  const decideAttendanceRequest = async (
    id: string,
    decision: 'approved' | 'rejected',
    notes?: string,
    newAttendanceStatus?: AttendanceStatus
  ) => {
    const res = await api.attendance.decideRequest(id, { decision, notes, newAttendanceStatus });
    alert(res.message);
    await reloadAttendance();
    await reloadNotifications();
    await reloadAuditLogs();
  };

  // Tasks
  const createTask = async (data: any): Promise<Task> => {
    const res = await api.tasks.create(data);
    alert(res.message);
    await reloadTasks();
    await reloadAuditLogs();
    return res.task;
  };

  const submitTaskDeliverable = async (taskId: string, content: string, proofUrl?: string) => {
    const res = await api.tasks.submitDeliverable(taskId, { content, proofUrl });
    alert(res.message);
    await reloadTasks();
    await reloadNotifications();
    await reloadAuditLogs();
  };

  const reviewTask = async (taskId: string, decision: 'completed' | 'needs_revision', reviewNotes?: string) => {
    const res = await api.tasks.review(taskId, { decision, reviewNotes });
    alert(res.message);
    await reloadTasks();
    await reloadNotifications();
    await reloadAuditLogs();
  };

  const cancelTask = async (taskId: string, reason: string) => {
    const res = await api.tasks.cancel(taskId, reason);
    alert(res.message);
    await reloadTasks();
    await reloadAuditLogs();
  };

  // Evaluations
  const saveEvaluation = async (arg1: any, arg2?: any, arg3?: any) => {
    if (typeof arg1 === 'object') {
      const criteria = [
        { key: 'attendance', name: 'Điểm chuyên cần', score: (arg1.attendanceScore || 4) * 2.5, isApplicable: true, isMissingData: false },
        { key: 'contribution', name: 'Đóng góp dự án', score: (arg1.contributionScore || 3.5) * 2.5, isApplicable: true, isMissingData: false },
        { key: 'responsibility', name: 'Trách nhiệm & Tác phong', score: (arg1.responsibilityScore || 2) * 5, isApplicable: true, isMissingData: false }
      ];
      const month = arg1.month || new Date().toISOString().slice(0, 7);
      const res = await api.evaluations.save({ memberId: arg1.memberId, month, criteria });
      alert(res.message);
    } else {
      const res = await api.evaluations.save({ memberId: arg1, month: arg2, criteria: arg3 });
      alert(res.message);
    }
    await reloadEvaluations();
    await reloadAuditLogs();
  };

  const updateEvaluation = async (id: string, partial: any) => {
    setEvaluations(prev => prev.map(e => e.id === id ? { ...e, ...partial } : e));
    alert('Đã cập nhật phiếu đánh giá');
  };

  const approveEvaluation = async (id: string) => {
    const res = await api.evaluations.approve(id);
    alert(res.message);
    await reloadEvaluations();
    await reloadNotifications();
    await reloadAuditLogs();
  };

  const appealEvaluation = async (id: string, reason: string) => {
    const res = await api.evaluations.appeal(id, reason);
    alert(res.message);
    await reloadEvaluations();
    await reloadAuditLogs();
  };

  const resolveEvaluationAppeal = async (
    id: string,
    decision: 'accepted' | 'rejected',
    resolutionNotes: string,
    updatedCriteria?: any[]
  ) => {
    const res = await api.evaluations.resolveAppeal(id, { decision, resolutionNotes, updatedCriteria });
    alert(res.message);
    await reloadEvaluations();
    await reloadAuditLogs();
  };

  // Feedback
  const submitTrainingFeedback = async (data: {
    sessionId: string;
    isAnonymous?: boolean;
    contentQuality: number;
    delivery: number;
    durationSuitability: number;
    usefulness: number;
    valuableTakeaway?: string;
    improvementSuggestion?: string;
    nextTopicIdea?: string;
    feedbackText?: string;
  }) => {
    const res = await api.feedback.submit(data);
    await reloadSessions();
    await reloadAuditLogs();
    return res;
  };

  const getFeedbackSummary = async (sessionId: string) => {
    return await api.feedback.getSummary(sessionId);
  };

  const getFeedbackList = useCallback(async (sessionId?: string) => {
    try {
      const res = await api.feedback.getAll({ sessionId });
      if (res.success) {
        setFeedback(res.feedbacks);
        return res;
      }
      return { success: false, feedbacks: [], metrics: { count: 0 } };
    } catch (err: any) {
      console.warn('Could not load feedback list:', err);
      return { success: false, feedbacks: [], metrics: { count: 0 }, message: err.message };
    }
  }, []);

  const reopenFeedbackWindow = async (sessionId: string, hours: number, reason: string) => {
    const res = await api.feedback.reopen(sessionId, { hours, reason });
    await reloadSessions();
    await reloadAuditLogs();
    return res;
  };

  const getAttendanceReport = async (sessionId: string) => {
    return await api.attendance.getReport(sessionId);
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    await api.notifications.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadNotificationCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsRead = async () => {
    await api.notifications.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadNotificationCount(0);
  };

  const runReminderEngine = async (): Promise<number> => {
    const res = await api.notifications.runReminderEngine();
    await reloadNotifications();
    return res.generatedCount;
  };

  // Applications
  const submitApplication = async (data: any): Promise<Application> => {
    const res = await api.cms.submitApplication(data);
    alert(res.message);
    await reloadApplications();
    await reloadAuditLogs();
    return res.application;
  };

  const convertApplicationToMember = async (applicationId: string, unit: UnitId, position?: string): Promise<User | null> => {
    const res = await api.cms.convertApplicant(applicationId, { unit, position });
    alert(res.message);
    await reloadApplications();
    await reloadMembers();
    await reloadAuditLogs();
    return res.member;
  };

  const updateApplicationStatus = async (id: string, status: any, notes?: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status, reviewNotes: notes } : a));
  };

  const addProject = (prj: any) => {
    const newPrj = { ...prj, id: `prj-${Date.now()}` };
    setProjects(prev => [newPrj, ...prev]);
    return newPrj;
  };

  const addEvent = (evt: any) => {
    const newEvt = { ...evt, id: `evt-${Date.now()}` };
    setEvents(prev => [newEvt, ...prev]);
    return newEvt;
  };

  // Settings
  const updateSiteSettings = async (partial: Partial<SiteSettings>) => {
    const res = await api.cms.updateSettings(partial);
    setSiteSettings(res.settings);
    alert('Đã cập nhật cấu hình website thành công!');
  };

  const resetToDefaultData = async () => {
    const res = await api.cms.resetDemo();
    alert(res.message);
    await syncAllData();
  };

  const cleanTestData = async () => {
    const res = await api.cms.cleanTestData();
    alert(res.message);
    await syncAllData();
  };

  const currentRole: UserRole = currentUser ? currentUser.role : 'guest';
  const currentUnit: UnitId | null = currentUser?.unit ? currentUser.unit : null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentUnit,
        switchUser,
        quickSwitchRole,
        login,
        register,
        requestTempPassword,
        completeRecoveryPassword,
        forgotPassword,
        resetPassword,
        verifyResetToken,
        resetPasswordWithToken,
        resetMemberPassword,
        sendMemberInvite,
        logout,
        isLoading,
        serverError,

        units,
        committees: units,

        users,
        reloadMembers,
        updateMemberStatus,
        updateMemberProfile,
        addUser,
        updateUser,
        deleteUser,
        verifyMemberEmail,

        sessions,
        reloadSessions,
        createSession,
        updateSession,
        cancelSession,
        deleteSession,
        reopenSessionFeedback,
        generateSessionToken,

        attendance,
        attendanceRequests,
        reloadAttendance,
        checkInQR,
        checkInSession,
        manualCheckin,
        finalizeSessionAttendance,
        overrideAttendance,
        submitAbsenceExplanation,
        submitAbsenceRequest,
        submitCorrectionRequest,
        decideAttendanceRequest,

        tasks,
        reloadTasks,
        createTask,
        submitTaskDeliverable,
        reviewTask,
        cancelTask,

        evaluations,
        reloadEvaluations,
        saveEvaluation,
        updateEvaluation,
        approveEvaluation,
        appealEvaluation,
        resolveEvaluationAppeal,

        feedback,
        submitFeedback: async (data: any) => {
          return await submitTrainingFeedback({
            sessionId: data.sessionId,
            isAnonymous: data.isAnonymous ?? true,
            contentQuality: data.contentQuality,
            delivery: data.delivery ?? data.clarityScore,
            durationSuitability: data.durationSuitability ?? data.organizationScore,
            usefulness: data.usefulness ?? data.usefulnessScore,
            valuableTakeaway: data.valuableTakeaway,
            improvementSuggestion: data.improvementSuggestion,
            nextTopicIdea: data.nextTopicIdea,
            feedbackText: data.feedbackText
          });
        },
        submitTrainingFeedback,
        getFeedbackSummary,
        getFeedbackList,
        reopenFeedbackWindow,
        getAttendanceReport,

        notifications,
        unreadNotificationCount,
        reloadNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        runReminderEngine,

        applications,
        reloadApplications,
        submitApplication,
        updateApplicationStatus,
        convertApplicationToMember,

        projects,
        events,
        articles,
        addProject,
        addEvent,

        siteSettings,
        updateSiteSettings,
        auditLogs,
        reloadAuditLogs,
        resetToDefaultData,
        cleanTestData,

        serverTime,
        refreshServerTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
