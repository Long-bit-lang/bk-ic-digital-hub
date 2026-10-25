// BK-IC Digital Hub - Comprehensive TypeScript Type Definitions
// Normalized to 3 Main Units: BN (Ban Chủ nhiệm), BDH (Ban Điều hành), BTV (Ban Thành viên)

export type UnitId = 'BN' | 'BDH' | 'BTV';

// Backwards compatibility aliases
export type CommitteeId = UnitId | string;

export interface ClubUnit {
  id: UnitId | string;
  name: string;
  shortName: string;
  description: string;
  leaderName: string;
}

// Backwards compatibility alias
export type Committee = ClubUnit;

export type UserRole = 'admin' | 'leader' | 'member' | 'applicant' | 'guest' | 'sysadmin';

export type MemberStatus = 'active' | 'paused' | 'left' | 'probation' | 'alumni' | 'suspended';
export type EvaluationStatus = 'draft' | 'submitted' | 'approved' | 'under_appeal' | 'insufficient_data' | 'locked';

export interface StatusHistoryEntry {
  id: string;
  previousStatus: MemberStatus;
  newStatus: MemberStatus;
  effectiveDate: string;
  reason: string; // Only BN and BTV can see private reasons
  approvedBy: string; // BN approval required
  updatedBy: string; // BTV updates
  timestamp: string;
}

export interface UnitHistoryEntry {
  id: string;
  previousUnit: UnitId;
  newUnit: UnitId;
  previousPosition: string;
  newPosition: string;
  effectiveDate: string;
  approvedBy: string;
  timestamp: string;
}

export type AccountStatus = 'active' | 'disabled' | 'pending_verification' | 'pending_setup';

export interface User {
  id: string;
  memberId?: string; // Mã thành viên định danh duy nhất (VD: BKIC-2026-001)
  email: string; // Email sinh viên đã đăng ký
  fullName: string;
  studentId: string; // MSSV
  faculty: string;
  classId: string;
  academicYear: string;
  avatarUrl?: string;
  role: UserRole;
  unit?: UnitId;
  committee?: CommitteeId; // Backwards-compatible alias
  position: string;
  joinDate: string;
  status: MemberStatus;
  statusEffectiveDate?: string;
  phone?: string;
  
  // Account security and verification metadata (Section 2.1)
  accountStatus: AccountStatus; // Trạng thái tài khoản: 'active' | 'disabled' | 'pending_verification' | 'pending_setup'
  emailVerified: boolean; // Trạng thái xác minh email sinh viên
  createdAt: string; // Thời điểm tạo tài khoản
  lastLoginAt?: string; // Lần đăng nhập gần nhất
  passwordHash?: string; // Băm mật khẩu PBKDF2/SHA-512 (không lưu văn bản thuần)
  passwordSalt?: string; // Salt mật khẩu ngẫu nhiên
  resetTokenHash?: string; // Hash token đặt lại mật khẩu
  resetTokenExpiresAt?: string; // Thời hạn hiệu lực của liên kết đặt lại mật khẩu (15 phút)
  verificationTokenHash?: string; // Hash token xác thực email khi đăng ký
  verificationTokenExpiresAt?: string; // Thời hạn hiệu lực của liên kết xác nhận email (24 giờ)

  // Mật khẩu tạm thời an toàn (Temporary Password Security)
  tempPasswordHash?: string; // Băm mật khẩu tạm thời PBKDF2/SHA-512
  tempPasswordSalt?: string; // Salt riêng biệt cho mật khẩu tạm thời
  tempPasswordExpiresAt?: string; // Thời hạn 15 phút
  tempPasswordAttempts?: number; // Đếm số lần nhập sai mật khẩu tạm thời (tối đa 5 lần)
  tempPasswordUsed?: boolean; // Đánh dấu đã qua bước đăng nhập bằng mật khẩu tạm thời
  mustChangePassword?: boolean; // Bắt buộc phải đổi mật khẩu mới trước khi truy cập hệ thống
  isRecoverySession?: boolean; // Đánh dấu phiên đăng nhập khôi phục

  // Deprecated plain password field (kept optional for migration)
  password?: string;
  statusHistory?: StatusHistoryEntry[];
  unitHistory?: UnitHistoryEntry[];
}

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface Application {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  faculty: string;
  classId: string;
  academicYear: string;
  interestTrack: string;
  motivation: string;
  skills: string;
  experience?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewNotes?: string;
  reviewedBy?: string;
}

export type SessionStatus = 'draft' | 'scheduled' | 'ongoing' | 'ended' | 'cancelled' | 'open' | 'closed';
export type SessionCategory = 'workshop' | 'training' | 'pitching' | 'general_meeting' | 'project_dev';
export type AttendanceLifecycleStatus = 'closed' | 'open' | 'finalized';

export interface SessionTimeHistory {
  changedBy: string;
  timestamp: string;
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  targetAudience?: string;
  personInChargeId?: string; // Bắt buộc khi tạo qua API
  personInChargeName?: string;
  createdById?: string;
  createdByName?: string;
  unit?: UnitId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  status: SessionStatus;
  attendanceStatus?: AttendanceLifecycleStatus;
  finalizedBy?: string;
  finalizedAt?: string;
  qrIntervalSec?: number;
  qrWindowOpenMinutes?: number; // 15 mins before start
  qrWindowCloseMinutes?: number; // 15 mins after start
  lateThresholdMinutes?: number; // 10 mins after start
  feedbackStatus?: 'closed' | 'open' | 'reopened';
  feedbackDeadline?: string; // ISO string (default: endTime + 24h)
  feedbackReopenedBy?: string;
  feedbackReopenReason?: string;
  feedbackReopenedAt?: string;
  timeHistory?: SessionTimeHistory[];

  // Backwards compatibility & operational properties
  manualGate?: 'open' | 'closed';
  manualGateUntilMs?: number;
  organizerId?: string;
  responsibleUserId?: string;
  hostId?: string;
  organizer?: string;
  targetParticipants?: string;
  attendanceOpenTime?: string;
  attendanceCloseTime?: string;
  lateThresholdTime?: string;
  category?: SessionCategory;
}

// Backwards compatibility alias
export type Session = TrainingSession;

export type AttendanceStatus = 'not_checked_in' | 'present' | 'late' | 'excused' | 'unexcused' | 'pending_review';

export interface AttendanceOverride {
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  editedBy: string;
  timestamp: string;
  reason: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  memberId: string;
  memberName: string;
  studentId: string;
  unit?: UnitId;
  committee?: CommitteeId;
  positionAtTime?: string;
  checkInTime: string;
  status: AttendanceStatus;
  method: 'qr' | 'manual' | 'appeal' | 'request';
  notes?: string;
  verifiedBy?: string;
  overrideHistory?: AttendanceOverride[];
}

export type AttendanceRequestType = 'absence_explanation' | 'correction_request';

export interface AttendanceRequest {
  id: string;
  type: AttendanceRequestType; // absence_explanation (48h) vs correction_request (24h)
  sessionId: string;
  sessionTitle: string;
  memberId: string;
  memberName: string;
  studentId: string;
  reason: string;
  evidenceUrl?: string;
  submittedAt: string;
  isLateSubmission: boolean;
  bnApprovedForReview?: boolean; // When submitted after deadline, BN decides whether to allow review
  status: 'pending' | 'approved' | 'rejected';
  decidedBy?: string;
  decidedAt?: string;
  decisionNotes?: string;
}

export interface TrainingFeedback {
  id: string;
  sessionId: string;
  sessionTitle: string;
  isAnonymous?: boolean;
  contentQuality: number; // 1-5
  delivery: number; // 1-5
  durationSuitability: number; // 1-5
  usefulness: number; // 1-5
  valuableTakeaway?: string;
  improvementSuggestion?: string;
  nextTopicIdea?: string;
  submittedAt: string;
  updatedAt?: string;

  // Backwards compatibility fields
  feedbackText?: string;
  usefulnessScore?: number;
  clarityScore?: number;
  organizationScore?: number;
  averageScore?: number;
  authorTokenHash?: string;
  authorHash?: string;
  memberId?: string;
  memberName?: string;
}

// Alias for compatibility
export type SessionFeedback = TrainingFeedback;

export interface FeedbackSummary {
  sessionId: string;
  sessionTitle: string;
  totalResponses: number;
  totalEligible?: number;
  canPublish: boolean; // Must be >= 5
  isPublished: boolean;
  publishedBy?: string;
  publishedAt?: string;
  avgContentQuality: number;
  avgDelivery: number;
  avgDurationSuitability: number;
  avgUsefulness: number;
  overallAverage: number;
  valuableTakeaways: string[];
  improvementSuggestions: string[];
  nextTopicIdeas: string[];
  sanitizedComments: string[]; // Aggregated fallback
}

export interface AttendanceSessionReport {
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  totalEligible: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  attendanceRate: number; // 0 to 100 percentage
  rateCalculationFormula: string;
}

export type TaskStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'pending_review' 
  | 'needs_revision' 
  | 'completed' 
  | 'overdue' 
  | 'cancelled';

export interface SubTask {
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  unit: UnitId;
  status: 'pending' | 'completed';
}

export interface TaskHistoryEntry {
  timestamp: string;
  actorName: string;
  action: string;
  reason?: string;
  oldStatus?: TaskStatus;
  newStatus?: TaskStatus;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  isInterUnit: boolean;
  primaryUnit: UnitId;
  assignedUnit: UnitId;
  assigneeId: string;
  assigneeName: string;
  leadAssigneeId: string; // Overall responsible person
  leadAssigneeName: string;
  deadline: string; // ISO string
  status: TaskStatus;
  subTasks?: SubTask[];
  deliverable?: {
    content: string;
    proofUrl?: string;
    submittedAt: string;
  };
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  history: TaskHistoryEntry[];
}

export interface EvaluationCriterion {
  key: string;
  name: string;
  score: number | null; // 0-10 or null if not applicable / missing
  isApplicable: boolean; // if false, excluded from numerator and denominator
  isMissingData: boolean; // if true, marked as missing data
  notes?: string;
}

export interface EvaluationAppeal {
  reason: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  decidedBy?: string;
  decidedAt?: string;
  resolutionNotes?: string;
}

export interface EvaluationVersionHistory {
  version: number;
  totalScore: number | null;
  updatedAt: string;
  reason: string;
}

export type MonthlyEvaluationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'approved' 
  | 'under_appeal' 
  | 'insufficient_data';

export interface MonthlyEvaluation {
  id: string;
  memberId: string;
  memberName: string;
  studentId: string;
  unit?: UnitId;
  committee?: CommitteeId;
  positionAtTime?: string;
  month?: string; // YYYY-MM
  version?: number;
  status: MonthlyEvaluationStatus;
  criteria?: EvaluationCriterion[];
  totalScore: number | null; // Weighted/arithmetic average of applicable criteria
  evaluatorId: string;
  evaluatorName: string;
  approvedBy?: string;
  approvedAt?: string;
  appeal?: EvaluationAppeal;
  versionHistory?: EvaluationVersionHistory[];

  // Backwards compatibility properties
  semester?: string;
  attendanceScore?: number;
  contributionScore?: number;
  responsibilityScore?: number;
  comments?: string;
  updatedAt?: string;
}

// Backwards compatibility alias
export type EvaluationRecord = MonthlyEvaluation;

export interface Notification {
  id: string;
  recipientId: string;
  recipientEmail: string;
  title: string;
  message: string;
  type: 
    | 'reminder_24h' 
    | 'reminder_3h' 
    | 'overdue' 
    | 'escalation' 
    | 'approval_required' 
    | 'status_change' 
    | 'system';
  referenceType?: 'task' | 'session' | 'attendance' | 'evaluation';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
  emailSent: boolean;
  emailStatus?: 'sent' | 'failed' | 'not_configured';
}

export interface ExportLog {
  id: string;
  exporterId: string;
  exporterName: string;
  exporterRole: string;
  exportType: 'attendance' | 'tasks' | 'evaluations' | 'members' | 'summary';
  format: 'excel' | 'pdf';
  filterSummary: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId?: string;
  actorName: string;
  actorRole: string;
  actorUnit?: UnitId;
  action: string;
  targetType: string;
  targetId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  details: string;
}

export interface InnovationProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  teamMembers: string[];
  status: 'Ý tưởng' | 'Mẫu thử (Prototype)' | 'MVP' | 'Tăng tốc (Accelerating)';
  verifiedStatus: 'verified' | 'published' | 'draft';
  techStack: string[];
  coverGradient: string;
  demoUrl?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  slug: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  status: 'upcoming' | 'ongoing' | 'finished';
  description: string;
  registrationOpen: boolean;
  recapNote?: string;
}

export interface ProvenanceArticle {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  verifiedAt: string;
  verificationStatus: 'verified' | 'published' | 'draft';
  contentType: 'Press Coverage' | 'University Notice' | 'Club Charter' | 'Official Announcement';
  summary: string;
  keyDetails: string[];
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  enabled: boolean;
}

export interface SiteSettings {
  clubName: string;
  clubFullName: string;
  clubVietnameseName: string;
  universityName: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroTagline: string;
  englishTagline: string;
  recruitmentStatus: 'open' | 'closed';
  recruitmentDeadline: string;
  contactEmail: string;
  contactAddress: string;
  isDemoMode: boolean;
  smtpConfig?: SmtpConfig;
}
