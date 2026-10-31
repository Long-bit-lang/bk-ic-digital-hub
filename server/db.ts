// Persistent JSON Database Engine for BK-IC Digital Hub
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  User,
  TrainingSession,
  AttendanceRecord,
  AttendanceRequest,
  Task,
  MonthlyEvaluation,
  Notification,
  ExportLog,
  AuditLog,
  Application,
  InnovationProject,
  ClubEvent,
  ProvenanceArticle,
  SiteSettings,
  ClubUnit
} from '../src/types/index.ts';

import { loadCloudData, saveCloudData } from './services/firestoreSync.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DecoupledFeedback {
  id: string;
  sessionId: string;
  sessionTitle: string;
  submissionToken: string; // Cryptographic opaque token for anonymous decoupling
  contentQuality: number; // 1-5
  delivery: number; // 1-5
  durationSuitability: number; // 1-5
  usefulness: number; // 1-5
  valuableTakeaway?: string;
  improvementSuggestion?: string;
  nextTopicIdea?: string;
  submittedAt: string;
  updatedAt?: string;

  // Legacy backwards compatibility fields
  feedbackText?: string;
  isAnonymous?: boolean;
  memberId?: string;
  memberName?: string;
  authorHash?: string;
  usefulnessScore?: number;
  clarityScore?: number;
  organizationScore?: number;
}

export interface FeedbackEligibility {
  id: string;
  sessionId: string;
  memberId: string;
  hasSubmitted: boolean;
  submissionToken?: string; // Token matching DecoupledFeedback.submissionToken without exposing in summary reports
  submittedAt?: string;
  updatedAt?: string;
}

export interface DatabaseSchema {
  units: ClubUnit[];
  users: User[];
  sessions: TrainingSession[];
  attendance: AttendanceRecord[];
  attendanceRecords?: AttendanceRecord[];
  attendanceRequests: AttendanceRequest[];
  feedbackEligibility: FeedbackEligibility[];
  feedbacks: DecoupledFeedback[];
  tasks: Task[];
  evaluations: MonthlyEvaluation[];
  notifications: Notification[];
  exportLogs: ExportLog[];
  auditLogs: AuditLog[];
  applications: Application[];
  projects: InnovationProject[];
  events: ClubEvent[];
  articles: ProvenanceArticle[];
  siteSettings: SiteSettings;
}

// 3 Main Units of BK-IC (Structure)
export const INITIAL_UNITS: ClubUnit[] = [
  {
    id: 'BN',
    name: 'Ban Chủ nhiệm',
    shortName: 'BCN',
    description: 'Quản lý chung và đưa ra quyết định phê duyệt cuối cùng theo thẩm quyền.',
    leaderName: 'Phạm Lê Tú'
  },
  {
    id: 'BDH',
    name: 'Ban Điều hành',
    shortName: 'BĐH',
    description: 'Tổ chức hoạt động, phối hợp giữa các ban và điều phối công việc theo phân quyền.',
    leaderName: 'Lê Anh Khoa'
  },
  {
    id: 'BTV',
    name: 'Ban Thành viên',
    shortName: 'BTV',
    description: 'Quản lý hồ sơ thành viên, theo dõi tình trạng thành viên và thực hiện các nghiệp vụ nhân sự, điểm danh theo quyền được giao.',
    leaderName: 'Nguyễn Hoàng Long'
  }
];

// Single Master Admin User (Retained for account granting and management)
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    memberId: 'BKIC-BN-ADMIN01',
    email: 'admin.bkic@dut.udn.vn',
    fullName: 'Quản trị viên Hệ thống (Admin)',
    studentId: 'ADMIN-DUT-2026',
    faculty: 'Trường Đại học Bách khoa - ĐHĐN',
    classId: 'Ban Cố vấn & Quản trị',
    academicYear: 'Quản trị viên',
    role: 'admin',
    unit: 'BN',
    committee: 'BN',
    position: 'Admin Kỹ thuật & Quản trị Hệ thống',
    joinDate: '2026-04-04',
    status: 'active',
    statusEffectiveDate: '2026-04-04',
    phone: '',
    accountStatus: 'active',
    emailVerified: true,
    createdAt: '2026-04-04T08:00:00.000Z',
    passwordSalt: '1a3372c4cf347ed4431f05522c326179',
    passwordHash: 'e6b5d48ead8b3b86eb924395a263efc8fa5ffb47a47db926cb2ed1939fb9ee30d1753e0d13c78deae6b9a8e04ddaee583aae386a6296ce1c5c7687f26bfdde74',
    statusHistory: [
      {
        id: 'sh-admin-01',
        previousStatus: 'active',
        newStatus: 'active',
        effectiveDate: '2026-04-04',
        reason: 'Khởi tạo tài khoản Quản trị viên cấp quyền hệ thống',
        approvedBy: 'Hội đồng Nhà trường',
        updatedBy: 'Admin',
        timestamp: '2026-04-04T08:00:00Z'
      }
    ]
  }
];

// Empty datasets ready for real user input
export const INITIAL_SESSIONS: TrainingSession[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_EVALUATIONS: MonthlyEvaluation[] = [];
export const INITIAL_FEEDBACKS: DecoupledFeedback[] = [];
export const INITIAL_FEEDBACK_ELIGIBILITY: FeedbackEligibility[] = [];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  clubName: 'BK-IC',
  clubFullName: 'Bách Khoa Innovation Club',
  clubVietnameseName: 'Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo Trường Đại học Bách khoa – ĐHĐN',
  universityName: 'Trường Đại học Bách khoa – Đại học Đà Nẵng (DUT)',
  heroEyebrow: 'BACH KHOA INNOVATION CLUB · DA NANG',
  heroHeadline: 'Ý tưởng hôm nay. Tương lai ngày mai.',
  heroSubheadline: 'Nơi sinh viên Bách khoa gặp gỡ, học hỏi và cùng nhau biến những ý tưởng sáng tạo thành giải pháp mang giá trị thực tiễn.',
  heroTagline: 'Think. Build. Impact.',
  englishTagline: 'Empowering Student Innovation & Entrepreneurship at Danang University of Science and Technology',
  recruitmentStatus: 'closed',
  recruitmentDeadline: '2026-11-15',
  recruitmentStartDate: '',
  recruitmentFormUrl: '',
  recruitmentFanpageUrl: 'https://www.facebook.com/dut.bkic',
  recruitmentTitle: 'Đợt tuyển thành viên mới',
  recruitmentDescription: 'Gia nhập BK-IC để cùng nhau phát triển các dự án công nghệ, sáng tạo và khởi nghiệp.',
  contactEmail: 'bkic@dut.udn.vn',
  contactAddress: '54 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng',
  isDemoMode: false
};

// Database Storage Manager
class DatabaseManager {
  private data: DatabaseSchema | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } else {
        // Clean up any stale temporary files from previous unexpected halts
        try {
          const files = fs.readdirSync(DATA_DIR);
          for (const f of files) {
            if (f.endsWith('.tmp')) {
              try { fs.unlinkSync(path.join(DATA_DIR, f)); } catch {}
            }
          }
        } catch {}
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure units and users are non-empty
        if (!this.data || !Array.isArray(this.data.users) || this.data.users.length === 0) {
          const restored = this.restoreFromLatestBackup();
          if (!restored) {
            this.resetToDefaults();
          }
        } else {
          this.normalizeData(this.data);
          // Normalize emailVerified for active accounts with established password
          for (const u of this.data.users) {
            if (u.accountStatus === 'active' && u.passwordHash && !u.emailVerified) {
              u.emailVerified = true;
            }
          }
        }
      } else {
        const restored = this.restoreFromLatestBackup();
        if (!restored) {
          this.resetToDefaults();
        }
      }
    } catch (err) {
      console.error('Error initializing database, attempting to recover from backup:', err);
      const restored = this.restoreFromLatestBackup();
      if (!restored) {
        this.resetToDefaults();
      }
    }
  }

  private normalizeData(data: any): void {
    if (!data) return;
    data.units = Array.isArray(data.units) ? data.units : INITIAL_UNITS;
    data.users = Array.isArray(data.users) ? data.users : [];
    data.sessions = Array.isArray(data.sessions) ? data.sessions : [];
    
    // Support both attendance and attendanceRecords keys
    if (!Array.isArray(data.attendance)) {
      data.attendance = Array.isArray(data.attendanceRecords) ? data.attendanceRecords : [];
    }
    data.attendanceRecords = data.attendance;
    
    data.attendanceRequests = Array.isArray(data.attendanceRequests) ? data.attendanceRequests : [];
    data.feedbackEligibility = Array.isArray(data.feedbackEligibility) ? data.feedbackEligibility : [];
    data.feedbacks = Array.isArray(data.feedbacks) ? data.feedbacks : [];
    data.tasks = Array.isArray(data.tasks) ? data.tasks : [];
    data.evaluations = Array.isArray(data.evaluations) ? data.evaluations : [];
    data.notifications = Array.isArray(data.notifications) ? data.notifications : [];
    data.exportLogs = Array.isArray(data.exportLogs) ? data.exportLogs : [];
    data.auditLogs = Array.isArray(data.auditLogs) ? data.auditLogs : [];
    data.applications = Array.isArray(data.applications) ? data.applications : [];
    data.projects = Array.isArray(data.projects) ? data.projects : [];
    data.events = Array.isArray(data.events) ? data.events : [];
    data.articles = Array.isArray(data.articles) ? data.articles : [];
    data.siteSettings = data.siteSettings || INITIAL_SITE_SETTINGS;
  }

  private isWriting = false;
  private pendingWrite = false;

  public get(): DatabaseSchema {
    if (!this.data) {
      this.init();
    }
    return this.data!;
  }

  public async syncWithCloud(): Promise<void> {
    if (!this.data) {
      this.init();
    }
    const synced = await loadCloudData(this.data!);
    this.data = synced;
    this.normalizeData(this.data);
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_FILE, serialized, 'utf-8');
    } catch (err) {
      console.error('[DatabaseManager] Failed to cache cloud data locally:', err);
    }
  }

  public save(): void {
    if (!this.data) return;
    if (this.isWriting) {
      this.pendingWrite = true;
      return;
    }

    this.isWriting = true;
    let tempFile: string | null = null;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const serialized = JSON.stringify(this.data, null, 2);
      tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
      fs.writeFileSync(tempFile, serialized, 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
      tempFile = null;
      
      // Auto-create rotating backup periodically (at most once every 10 minutes)
      this.maybeCreatePeriodicBackup();

      // Asynchronously synchronize with Google Cloud Firestore
      saveCloudData(this.data);
    } catch (err) {
      console.error('Failed to persist database to file:', err);
      if (tempFile) {
        try {
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch {}
      }
    } finally {
      this.isWriting = false;
      if (this.pendingWrite) {
        this.pendingWrite = false;
        this.save();
      }
    }
  }

  private lastBackupTime = Date.now();

  private maybeCreatePeriodicBackup(): void {
    const now = Date.now();
    if (now - this.lastBackupTime > 10 * 60 * 1000) {
      this.lastBackupTime = now;
      this.createBackup();
    }
  }

  public createBackup(): string | null {
    try {
      if (!fs.existsSync(DB_FILE)) return null;
      const backupDir = path.join(DATA_DIR, 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `db.backup.${timestamp}.json`);
      fs.copyFileSync(DB_FILE, backupPath);

      // Keep only 5 most recent backups
      const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('db.backup.') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      if (files.length > 5) {
        for (const oldFile of files.slice(5)) {
          try {
            fs.unlinkSync(path.join(backupDir, oldFile));
          } catch {}
        }
      }

      return backupPath;
    } catch (err) {
      console.error('[DatabaseManager] Failed to create backup:', err);
      return null;
    }
  }

  public restoreFromLatestBackup(): boolean {
    try {
      const backupDir = path.join(DATA_DIR, 'backups');
      if (!fs.existsSync(backupDir)) return false;
      const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('db.backup.') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (files.length > 0) {
        const latest = path.join(backupDir, files[0]);
        console.log(`[DatabaseManager] Recovering database from latest backup: ${latest}`);
        const raw = fs.readFileSync(latest, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          this.normalizeData(parsed);
          this.data = parsed;
          this.save();
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('[DatabaseManager] Failed to restore from backup:', err);
      return false;
    }
  }

  public reload(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          this.normalizeData(parsed);
          this.data = parsed;
          console.log('[DatabaseManager] Database reloaded successfully from disk.');
        }
      }
    } catch (err) {
      console.error('[DatabaseManager] Failed to reload database from disk:', err);
    }
  }

  public cleanSyntheticTestData(): { removedUsers: number; removedSessions: number } {
    if (!this.data) this.init();
    const data = this.data!;

    const initialUsersCount = data.users.length;
    const initialSessionsCount = data.sessions.length;

    // Keep ONLY master admin
    data.users = (data.users || []).filter((u: any) => u.id === 'usr-admin' || u.role === 'admin');

    // Reset sessions and all session-related collections
    data.sessions = [];
    data.attendance = [];
    data.attendanceRecords = [];
    data.attendanceRequests = [];
    data.feedbackEligibility = [];
    data.feedbacks = [];
    data.tasks = [];
    data.evaluations = [];
    data.notifications = [];
    data.applications = [];
    data.exportLogs = [];
    data.projects = [];
    data.events = [];
    data.articles = [];

    // Ensure 3 units structure
    data.units = INITIAL_UNITS;

    // Clean audit logs
    data.auditLogs = [
      {
        id: `audit-clean-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'usr-admin',
        actorName: 'Quản trị viên Hệ thống (Admin)',
        actorRole: 'admin',
        actorUnit: 'BN',
        action: 'Dọn dẹp toàn bộ dữ liệu giả lập',
        targetType: 'System',
        targetId: 'BKIC-Hub-Clean',
        details: 'Đã xóa toàn bộ tài khoản thử nghiệm và buổi họp giả lập. Hệ thống sẵn sàng vận hành chính thức.'
      }
    ];

    this.save();
    console.log(`[DatabaseManager] Cleaned synthetic test data: removed ${initialUsersCount - data.users.length} users, ${initialSessionsCount} sessions.`);
    return {
      removedUsers: initialUsersCount - data.users.length,
      removedSessions: initialSessionsCount - data.sessions.length
    };
  }

  public resetToDefaults(): DatabaseSchema {
    this.data = {
      units: INITIAL_UNITS,
      users: INITIAL_USERS,
      sessions: [],
      attendance: [],
      attendanceRequests: [],
      feedbackEligibility: [],
      feedbacks: [],
      tasks: [],
      evaluations: [],
      notifications: [],
      exportLogs: [],
      auditLogs: [
        {
          id: 'audit-init-01',
          timestamp: '2026-04-04T08:00:00.000Z',
          actorId: 'usr-admin',
          actorName: 'Quản trị viên Hệ thống (Admin)',
          actorRole: 'admin',
          actorUnit: 'BN',
          action: 'Khởi tạo hệ thống quản trị',
          targetType: 'System',
          targetId: 'BKIC-Hub-v2',
          details: 'Hệ thống sẵn sàng vận hành chính thức cho Câu lạc bộ Sáng tạo Khởi nghiệp BK-IC Trường ĐH Bách khoa - ĐHĐN.'
        }
      ],
      applications: [],
      projects: [],
      events: [],
      articles: [],
      siteSettings: INITIAL_SITE_SETTINGS
    };
    this.save();
    return this.data;
  }
}

export const db = new DatabaseManager();
