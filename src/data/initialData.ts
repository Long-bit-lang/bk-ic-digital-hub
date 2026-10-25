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
    shortName: 'BN',
    description: 'Chỉ đạo chiến lược, điều hành tổng thể, phê duyệt quyết định nhân sự, đánh giá và đối ngoại cấp cao.',
    leaderName: ''
  },
  {
    id: 'BDH',
    name: 'Ban Điều hành',
    shortName: 'BĐH',
    description: 'Tổ chức các hoạt động chuyên môn, các buổi training, quản lý dự án đổi mới sáng tạo và điều phối liên đơn vị.',
    leaderName: ''
  },
  {
    id: 'BTV',
    name: 'Ban Thành viên',
    shortName: 'BTV',
    description: 'Quản lý hồ sơ nhân sự, ghi nhận điểm danh, cập nhật trạng thái thành viên và hỗ trợ nội bộ.',
    leaderName: ''
  }
];

export const INITIAL_COMMITTEES: Committee[] = [
  {
    id: 'ban-chu-nhiem',
    name: 'Ban Chủ nhiệm',
    shortName: 'BCN',
    description: 'Chỉ đạo chiến lược, điều phối tổng thể và làm cầu nối với Nhà trường, Giảng viên Cố vấn.',
    leaderName: ''
  },
  {
    id: 'ban-chuyen-mon',
    name: 'Ban Chuyên môn & Dự án',
    shortName: 'Chuyên môn',
    description: 'Phát triển giải pháp công nghệ, ươm mầm các dự án khởi nghiệp sinh viên, tổ chức Hackathon.',
    leaderName: ''
  },
  {
    id: 'ban-truyen-thong',
    name: 'Ban Truyền thông & Thương hiệu',
    shortName: 'Truyền thông',
    description: 'Xây dựng hình ảnh, lan tỏa văn hóa đổi mới sáng tạo và quản lý các kênh thông tin câu lạc bộ.',
    leaderName: ''
  },
  {
    id: 'ban-doi-ngoai',
    name: 'Ban Đối ngoại & Kết nối Doanh nghiệp',
    shortName: 'Đối ngoại',
    description: 'Kết nối mạng lưới cựu sinh viên, quỹ đầu tư thiên thần, doanh nghiệp công nghệ và đối tác khởi nghiệp.',
    leaderName: ''
  },
  {
    id: 'ban-nhan-su',
    name: 'Ban Nhân sự & Phát triển Thành viên',
    shortName: 'Nhân sự',
    description: 'Tuyển dụng, điểm danh, tổ chức đào tạo nội bộ, đánh giá rèn luyện và xây dựng tinh thần đồng đội.',
    leaderName: ''
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
  recruitmentStatus: 'open',
  recruitmentDeadline: '2026-11-15',
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
