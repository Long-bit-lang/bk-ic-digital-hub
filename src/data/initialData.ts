// Initial Verified Data & Store for BK-IC Digital Hub
import {
  Committee,
  ClubUnit,
  User,
  Application,
  Session,
  AttendanceRecord,
  EvaluationRecord,
  SessionFeedback,
  InnovationProject,
  ClubEvent,
  ProvenanceArticle,
  SiteSettings,
  AuditLog
} from '../types';

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

export const INITIAL_COMMITTEES: Committee[] = [
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
    accountStatus: 'active',
    emailVerified: true,
    createdAt: '2026-04-04T00:00:00.000Z',
    lastLoginAt: '2026-04-04T08:00:00.000Z',
    phone: ''
  }
];

export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_SESSIONS: Session[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_EVALUATIONS: EvaluationRecord[] = [];
export const INITIAL_FEEDBACKS: SessionFeedback[] = [];
export const INITIAL_PROJECTS: InnovationProject[] = [];
export const INITIAL_EVENTS: ClubEvent[] = [];
export const INITIAL_PROVENANCE_ARTICLES: ProvenanceArticle[] = [];

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

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
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
];
