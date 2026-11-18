// BK-IC Digital Hub — Activities Data Architecture
// Strongly-typed data models and verified content for all 6 Activities Tabs
import { BKIC_MEDIA_ASSETS } from './mediaAssets';

// =============================================================================
// TAB 1: SINH HOẠT NỘI BỘ (INTERNAL ACTIVITIES)
// =============================================================================
export interface RecurringScheduleInfo {
  dayOfWeek: string;
  timeRange: string;
  location: string;
  recurrenceRule: string;
  targetAudience: string;
  description: string;
}

export const RECURRING_TUESDAY_SCHEDULE: RecurringScheduleInfo = {
  dayOfWeek: 'Thứ Ba hàng tuần',
  timeRange: '17:30 – 19:00',
  location: 'Văn phòng BK-IC / Phòng Không gian Sáng tạo, Trường ĐH Bách khoa (DUT)',
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;TIME=17:30-19:00;TZ=Asia/Ho_Chi_Minh',
  targetAudience: 'Toàn thể thành viên chính thức thuộc 3 Ban: BCN, BĐH, BTV',
  description: 'Buổi sinh hoạt chuyên môn định kỳ nhằm cập nhật tiến độ dự án, tập huấn kỹ năng và gắn kết giữa các ban chuyên trách.'
};

export interface SessionTimelineStep {
  step: string;
  title: string;
  time: string;
  desc: string;
}

export const SESSION_TIMELINE_STEPS: SessionTimelineStep[] = [
  {
    step: '01',
    time: '17:30 – 17:45',
    title: 'Đón tiếp & Điểm danh QR Code',
    desc: 'Thành viên quét mã QR động đổi mới mỗi 15 giây trên màn hình máy chiếu qua BK-IC Digital Hub để xác thực hiện diện.'
  },
  {
    step: '02',
    time: '17:45 – 18:25',
    title: 'Nội dung Chuyên môn Chính',
    desc: 'Báo cáo tiến độ các dự án công nghệ, chia sẻ kỹ năng kỹ thuật mới hoặc sinh hoạt chuyên đề theo kế hoạch tháng.'
  },
  {
    step: '03',
    time: '18:25 – 18:45',
    title: 'Thảo luận & Phản biện Ý tưởng',
    desc: 'Không gian mở để các nhóm dự án trình bày vướng mắc kỹ thuật, nhận đóng góp và tư vấn từ các anh chị cố vấn.'
  },
  {
    step: '04',
    time: '18:45 – 19:00',
    title: 'Tổng kết & Đánh giá Phiên họp',
    desc: 'Thống nhất đầu việc tuần tiếp theo, giao nhiệm vụ và mở cổng đánh giá ẩn danh phản hồi chất lượng buổi sinh hoạt.'
  }
];

export interface InternalGalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  category: string;
  date: string;
}

export const INTERNAL_ACTIVITY_GALLERY: InternalGalleryItem[] = [
  {
    id: 'gal-01',
    imageUrl: BKIC_MEDIA_ASSETS.bkic_facebook_user_01.localUrl,
    title: 'Gắn kết và Định hướng Nhiệm kỳ',
    caption: BKIC_MEDIA_ASSETS.bkic_facebook_user_01.caption,
    category: 'Văn hóa CLB',
    date: 'Tháng 10/2026'
  },
  {
    id: 'gal-02',
    imageUrl: BKIC_MEDIA_ASSETS.bkic_facebook_user_02.localUrl,
    title: 'Làm việc Nhóm & Thảo luận Ý tưởng',
    caption: BKIC_MEDIA_ASSETS.bkic_facebook_user_02.caption,
    category: 'Nghiên cứu & Kỹ thuật',
    date: 'Tháng 11/2026'
  },
  {
    id: 'gal-03',
    imageUrl: BKIC_MEDIA_ASSETS.bkic_facebook_user_03.localUrl,
    title: 'Sinh hoạt Chuyên đề & Thử nghiệm Demo',
    caption: BKIC_MEDIA_ASSETS.bkic_facebook_user_03.caption,
    category: 'Học thuật',
    date: 'Tháng 11/2026'
  },
  {
    id: 'gal-04',
    imageUrl: BKIC_MEDIA_ASSETS.bkic_facebook_user_04.localUrl,
    title: 'Tập huấn Kỹ năng Thực chiến',
    caption: BKIC_MEDIA_ASSETS.bkic_facebook_user_04.caption,
    category: 'Tập huấn',
    date: 'Tháng 10/2026'
  },
  {
    id: 'gal-05',
    imageUrl: BKIC_MEDIA_ASSETS.bkic_facebook_user_05.localUrl,
    title: 'Tinh thần Đồng đội BK-IC',
    caption: BKIC_MEDIA_ASSETS.bkic_facebook_user_05.caption,
    category: 'Gắn kết',
    date: 'Tháng 11/2026'
  },
  {
    id: 'gal-06',
    imageUrl: BKIC_MEDIA_ASSETS.startup_training.localUrl,
    title: 'Tập huấn Mô hình Kinh doanh tại Bách khoa',
    caption: BKIC_MEDIA_ASSETS.startup_training.caption,
    category: 'Khởi nghiệp',
    date: 'Tháng 04/2026'
  }
];

// =============================================================================
// TAB 2: WORKSHOP THƯỜNG NIÊN (WORKSHOPS DATA)
// =============================================================================
export interface WorkshopItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
  speakerRole: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  summary: string;
  fullDesc?: string;
  coverImage: string;
  registrationOpen: boolean;
  registrationDeadline?: string;
  participantsLimit?: number;
  registeredCount?: number;
  prerequisites?: string[];
  takeaways?: string[];
}

export const WORKSHOPS_DATA: WorkshopItem[] = [
  {
    id: 'ws-01',
    slug: 'tri-tue-nhan-tao-iot-embedded',
    title: 'Ứng dụng AI & Edge Computing trên Thiết bị Nhúng thông minh',
    category: 'AI & Embedded',
    date: 'Thứ Bảy, 12/12/2026',
    time: '08:30 – 11:30',
    location: 'Hội trường Khu F, Trường ĐH Bách khoa (DUT)',
    speaker: 'TS. Nguyễn Văn Hướng',
    speakerRole: 'Giảng viên Khoa Điện tử - Viễn thông, Cố vấn Kỹ thuật BK-IC',
    status: 'upcoming',
    registrationOpen: true,
    registrationDeadline: '2026-12-10T23:59:59',
    participantsLimit: 120,
    registeredCount: 84,
    coverImage: '/images/bkic/startup_training.jpg',
    summary: 'Tìm hiểu quy trình thu thập dữ liệu cảm biến thời gian thực và triển khai mô hình học sâu rút gọn trên bo mạch vi xử lý Edge AI.',
    fullDesc: 'Chuyên đề cung cấp nền tảng kiến trúc phần cứng vi điều khiển hiện đại, kỹ thuật lượng tử hóa mô hình TinyML và demo thực tế quy trình nhận diện tín hiệu cảm biến ngay trên thiết bị biên không cần kết nối đám mây liên tục.',
    prerequisites: [
      'Kiến thức cơ bản về lập trình C/C++ hoặc Python',
      'Quan tâm đến lĩnh vực IoT, phần cứng nhúng hoặc Trí tuệ nhân tạo'
    ],
    takeaways: [
      'Hiểu rõ kiến trúc vi xử lý nhúng hỗ trợ tăng tốc AI biên',
      'Nắm vững phương pháp huấn luyện và nén mô hình nhẹ TinyML',
      'Thực hành kết nối cảm biến và đọc dữ liệu theo thời gian thực',
      'Nhận chứng nhận tham gia từ Ban Chuyên môn BK-IC'
    ]
  },
  {
    id: 'ws-02',
    slug: 'pitching-goi-von-khoi-nghiep',
    title: 'Kỹ năng Pitching & Xây dựng Pitch Deck chuẩn Quốc tế',
    category: 'Khởi nghiệp & Đổi mới',
    date: 'Thứ Năm, 24/12/2026',
    time: '14:00 – 17:00',
    location: 'Phòng Lab Đổi mới sáng tạo, Khu A, DUT',
    speaker: 'ThS. Trần Minh Đức',
    speakerRole: 'Chuyên gia Cố vấn Vườn ươm Doanh nghiệp Đà Nẵng (DNES)',
    status: 'upcoming',
    registrationOpen: true,
    registrationDeadline: '2026-12-22T23:59:59',
    participantsLimit: 80,
    registeredCount: 65,
    coverImage: '/images/bkic/bkshark_auditorium.jpg',
    summary: 'Phương pháp trình bày ý tưởng kinh doanh cô đọng trong 3 phút, làm nổi bật mô hình doanh thu và cấu trúc tài chính cho nhà đầu tư.',
    fullDesc: 'Buổi làm việc thực chiến hướng dẫn các nhóm sinh viên cách kể câu chuyện sản phẩm lôi cuốn, xác định quy mô thị trường (TAM/SAM/SOM), cấu trúc ma trận đối thủ cạnh tranh và làm chủ các câu hỏi chất vấn từ hội đồng giám khảo.',
    prerequisites: [
      'Đang có ý tưởng hoặc dự án khởi nghiệp công nghệ',
      'Mong muốn chuẩn bị hồ sơ tham gia các cuộc thi hoặc gọi vốn hạt giống'
    ],
    takeaways: [
      'Khung sườn 10 slide Pitch Deck tiêu chuẩn quốc tế',
      'Bí quyết kiểm soát thời gian pitching 3 - 5 phút',
      'Cách phân tích unit economics và dự phóng dòng tiền',
      'Cơ hội được góp ý trực tiếp trên slide của đội ngũ mình'
    ]
  },
  {
    id: 'ws-03',
    slug: 'ui-ux-design-system-tech',
    title: 'Xây dựng Design System chuyên nghiệp cho Startup Công nghệ',
    category: 'Design & Product',
    date: 'Thứ Bảy, 28/11/2026',
    time: '14:00 – 16:30',
    location: 'Smart Campus Lab, DUT',
    speaker: 'Lê Hoàng Hải',
    speakerRole: 'Senior Product Designer, Cựu thành viên BK-IC Gen 2024',
    status: 'completed',
    registrationOpen: false,
    participantsLimit: 60,
    registeredCount: 60,
    coverImage: '/images/bkic/bkdn_students.jpg',
    summary: 'Quy chuẩn hóa UI tokens, typography scale, icon sets và quy trình chuyển giao thiết kế sang mã nguồn React & Tailwind CSS.',
    fullDesc: 'Tổng kết phương pháp xây dựng giao diện số đồng nhất, khả năng tái sử dụng component cao và tối ưu trải nghiệm người dùng dành riêng cho các dự án kỹ thuật Bách khoa.',
    takeaways: [
      'Tư duy nguyên tử hóa giao diện Atomic Design',
      'Thiết lập color palette và typography token chuẩn mực',
      'Kinh nghiệm phối hợp nhịp nhàng giữa Designer và Developer'
    ]
  }
];

// =============================================================================
// TAB 3: CUỘC THI SÁNG TẠO (COMPETITIONS DATA)
// =============================================================================
export interface CompetitionDetailItem {
  id: string;
  slug: string;
  title: string;
  field: string;
  prizePool: string;
  deadline: string;
  deadlineIso: string; // Used for countdown
  teamsCount: string;
  status: 'active' | 'upcoming' | 'completed';
  summary: string;
  organizer: string;
  coverImage: string;
  featured: boolean;
  registrationOpen: boolean;
  timeline: { phase: string; date: string; desc: string }[];
  prizes: { rank: string; reward: string; extra: string }[];
  eligibility: string[];
}

export const COMPETITIONS_DATA: CompetitionDetailItem[] = [
  {
    id: 'comp-maker-2026',
    slug: 'bk-maker-2026',
    title: 'BK Maker Challenge 2026: Sáng tạo Công nghệ Xanh & Thiết bị thông minh',
    field: 'IoT & Phần cứng thông minh',
    prizePool: '120.000.000 VNĐ',
    deadline: '20/12/2026',
    deadlineIso: '2026-12-20T23:59:59',
    teamsCount: '45+ Đội dự thi',
    status: 'active',
    featured: true,
    registrationOpen: true,
    organizer: 'Đoàn Thanh niên – Hội Sinh viên Trường ĐH Bách khoa & BK-IC',
    coverImage: '/images/bkic/bkshark_ecosim_pitch.jpg',
    summary: 'Cuộc thi thiết kế nguyên mẫu phần cứng ứng dụng công nghệ nhúng, năng lượng sạch và tự động hóa trong khuôn viên trường đại học.',
    timeline: [
      { phase: 'Vòng 1: Mở đơn đăng ký & Nộp bản thuyết minh', date: '01/11 – 20/12/2026', desc: 'Các đội nộp hồ sơ mô tả ý tưởng, sơ đồ nguyên lý và video mô phỏng sơ bộ.' },
      { phase: 'Vòng 2: Chế tạo mẫu thử & Thẩm định kỹ thuật', date: '25/12/2026 – 15/01/2027', desc: 'BK-IC hỗ trợ kinh phí linh kiện và cấp quyền truy cập lab chế tạo mẫu Khu A.' },
      { phase: 'Vòng 3: Chung kết & Trình diễn Sản phẩm thực nghiệm', date: '25/01/2027', desc: 'Hội đồng chuyên môn chấm điểm trực tiếp tại Sảnh triển lãm Khu F, DUT.' }
    ],
    prizes: [
      { rank: 'Giải Nhất', reward: '50.000.000 VNĐ', extra: 'Gói bảo trợ ươm tạo tại Vườn ươm DNES + Cúp vô địch' },
      { rank: 'Giải Nhì', reward: '30.000.000 VNĐ', extra: 'Học bổng chuyên môn IoT & AI trị giá 15.000.000 VNĐ' },
      { rank: 'Giải Ba', reward: '20.000.000 VNĐ', extra: 'Kinh phí phát triển tiếp nguyên mẫu phiên bản 2' },
      { rank: '2 Giải Khuyến khích', reward: '10.000.000 VNĐ / giải', extra: 'Giấy khen Hội Sinh viên trường và kỷ niệm chương' }
    ],
    eligibility: [
      'Sinh viên đang theo học tại Trường Đại học Bách khoa – ĐHĐN',
      'Đội thi từ 2 đến 5 thành viên (khuyến khích kết hợp giữa sinh viên Kỹ thuật và Kinh tế)',
      'Sản phẩm dự thi phải là công trình tự thiết kế, không sao chép'
    ]
  },
  {
    id: 'comp-hackathon-2026',
    slug: 'hackathon-innovate-danang-2026',
    title: 'Hackathon Innovate Da Nang: Giải pháp Chuyển đổi số Thành phố Thông minh',
    field: 'AI & Dữ liệu lớn',
    prizePool: '80.000.000 VNĐ',
    deadline: '15/01/2027',
    deadlineIso: '2027-01-15T23:59:59',
    teamsCount: '30+ Đội dự thi',
    status: 'upcoming',
    featured: false,
    registrationOpen: true,
    organizer: 'BK-IC đồng hành cùng Sở TT&TT TP. Đà Nẵng',
    coverImage: '/images/bkic/bkshark_danangbooth.jpg',
    summary: 'Thử thách lập trình 48 giờ liên tục giải quyết các bài toán hạ tầng giao thông, du lịch thông minh và quản lý môi trường đô thị.',
    timeline: [
      { phase: 'Công bố Đề bài & Hướng dẫn Mentor', date: '05/01/2027', desc: 'Hội thảo trực tuyến giải thích bộ dữ liệu mở và tiêu chí chấm điểm.' },
      { phase: '48 Giờ Code Sprint liên tục', date: '20/01 – 22/01/2027', desc: 'Thử thách tập trung tại Không gian Sáng tạo Smart Campus DUT.' },
      { phase: 'Demo Day & Lễ Vinh danh', date: '22/01/2027 (16:00)', desc: 'Pitching 5 phút và công bố các sản phẩm đạt giải.' }
    ],
    prizes: [
      { rank: 'Giải Nhất', reward: '40.000.000 VNĐ', extra: 'Cơ hội thử nghiệm giải pháp tại Trung tâm Điều hành IOC Đà Nẵng' },
      { rank: 'Giải Nhì', reward: '25.000.000 VNĐ', extra: 'Gói tuyển thẳng thực tập tại các doanh nghiệp đối tác' },
      { rank: 'Giải Ba', reward: '15.000.000 VNĐ', extra: 'Bộ quà tặng công nghệ và giấy khen của Ban Tổ chức' }
    ],
    eligibility: [
      'Sinh viên toàn quốc đam mê lập trình, AI và phân tích dữ liệu',
      'Đội thi tối đa 4 thành viên'
    ]
  },
  {
    id: 'comp-seed-2025',
    slug: 'bk-startup-seed-2025',
    title: 'BK Startup Seed 2025: Ươm mầm Ý tưởng Kinh doanh Công nghệ',
    field: 'Khởi nghiệp Công nghệ',
    prizePool: '50.000.000 VNĐ',
    deadline: '10/11/2025',
    deadlineIso: '2025-11-10T23:59:59',
    teamsCount: '24 Đội',
    status: 'completed',
    featured: false,
    registrationOpen: false,
    organizer: 'Ban Chủ nhiệm BK-IC',
    coverImage: '/images/bkic/bkdn_awards.jpg',
    summary: 'Cuộc thi tuyển chọn các dự án tiềm năng bước vào vòng thẩm định vốn hạt giống tại sân khấu BK Shark mùa 2025.',
    timeline: [
      { phase: 'Sơ loại Ý tưởng', date: '10/10/2025', desc: 'Chọn 10 dự án khả thi vào vòng đào tạo chuyên sâu.' },
      { phase: 'Chung kết Mùa giải', date: '10/11/2025', desc: '5 dự án nhận cam kết bảo trợ ươm tạo chính thức.' }
    ],
    prizes: [
      { rank: 'Giải Nhất', reward: '25.000.000 VNĐ', extra: 'Tuyển thẳng vào Sân khấu BK Shark Mùa 2025' }
    ],
    eligibility: [
      'Sinh viên Đại học Bách khoa có ý tưởng dự án khởi nghiệp'
    ]
  }
];

// Past verified achievements in competitions
export const COMPETITION_HALL_OF_FAME = [
  {
    teamName: 'Đội thi BK-GreenEnergy',
    award: 'Giải Nhì Toàn thành phố',
    contest: 'Cuộc thi Sáng kiến Đổi mới Sáng tạo Công nghệ Đà Nẵng 2026',
    project: 'Thiết bị quan trắc môi trường thông minh sử dụng năng lượng mặt trời',
    members: 'Nguyễn Thành Đạt, Lê Thị Thu Hương (Khoa Điện & CNTT)'
  },
  {
    teamName: 'Đội thi EcoSim Tech',
    award: 'Dự án Tiềm năng Nhất',
    contest: 'BK SHARK Mùa 2026',
    project: 'Nền tảng mô phỏng phân luồng giao thông giảm phát thải CO2',
    members: 'Phạm Quang Huy, Trần Đức Toàn (Khoa Cơ khí & CNTT)'
  }
];

// =============================================================================
// TAB 4: DỰ ÁN ĐỒNG HÀNH (INCUBATOR & COMPANION PROJECTS)
// =============================================================================
export interface CompanionProjectItem {
  id: string;
  slug: string;
  title: string;
  field: string;
  stage: 'Ý tưởng' | 'Mẫu thử (Prototype)' | 'MVP' | 'Thử nghiệm thực tế (Pilot Testing)';
  leadName: string;
  faculty: string;
  summary: string;
  year: string;
  coverImage: string;
  techStack: string[];
  metrics?: { label: string; value: string }[];
}

export const COMPANION_PROJECTS_DATA: CompanionProjectItem[] = [
  {
    id: 'prj-01',
    slug: 'smart-campus-energy-monitor',
    title: 'Hệ thống Giám sát & Tối ưu Năng lượng Khuôn viên Đại học (Smart Campus Energy)',
    field: 'GreenTech & IoT',
    stage: 'Thử nghiệm thực tế (Pilot Testing)',
    leadName: 'Nhóm nghiên cứu Sinh viên Khoa Điện – Điện tử',
    faculty: 'Khoa Điện & Khoa CNTT, DUT',
    summary: 'Thu thập dữ liệu tiêu thụ điện năng từ hơn 50 phòng học, áp dụng thuật toán dự đoán tải để tự động điều chỉnh hệ thống làm mát.',
    year: '2026',
    coverImage: '/images/bkic/bkshark_ecosim_pitch.jpg',
    techStack: ['ESP32', 'Modbus RTU', 'FastAPI', 'TimescaleDB', 'React'],
    metrics: [
      { label: 'Điểm đo lường', value: '50+ Phòng học' },
      { label: 'Tối ưu dự kiến', value: '18% Điện năng' }
    ]
  },
  {
    id: 'prj-02',
    slug: 'ai-defect-inspection-robot',
    title: 'Robot Tự hành Kiểm tra Khuyết tật Sản phẩm bằng Thị giác máy tính',
    field: 'Robotics & AI',
    stage: 'MVP',
    leadName: 'Nhóm SV Khởi nghiệp Cơ điện tử',
    faculty: 'Khoa Cơ khí & Viện Khoa học Công nghệ',
    summary: 'Giải pháp robot AGV tích hợp camera công nghiệp và mô hình nhận diện khuyết tật bề mặt kim loại với độ chính xác trên 98.5%.',
    year: '2025',
    coverImage: '/images/bkic/startup_training.jpg',
    techStack: ['ROS2', 'YOLOv10', 'NVIDIA Jetson', 'LiDAR 2D', 'SolidWorks'],
    metrics: [
      { label: 'Độ chính xác', value: '98.5%' },
      { label: 'Tốc độ kiểm tra', value: '3s / sản phẩm' }
    ]
  },
  {
    id: 'prj-03',
    slug: 'digital-health-telemedicine',
    title: 'Nền tảng Y tế Số & Hỗ trợ Chẩn đoán Từ xa cho Vùng sâu vùng xa',
    field: 'HealthTech',
    stage: 'Mẫu thử (Prototype)',
    leadName: 'Nhóm SV Kỹ thuật Y sinh & Phần mềm',
    faculty: 'Khoa Công nghệ Thông tin, DUT',
    summary: 'Ứng dụng di động kết nối thiết bị đo nhịp tim/huyết áp giá rẻ qua Bluetooth, truyền dữ liệu bảo mật lên đám mây phục vụ bác sĩ gia đình.',
    year: '2026',
    coverImage: '/images/bkic/bkdn_students.jpg',
    techStack: ['Flutter', 'BLE 5.0', 'Node.js', 'PostgreSQL', 'Docker'],
    metrics: [
      { label: 'Thiết bị hỗ trợ', value: '3 Dòng máy đo' },
      { label: 'Độ trễ truyền', value: '< 1.2s' }
    ]
  }
];

export const PARTNERSHIP_MODELS = [
  {
    title: 'Tài trợ Chương trình & Cuộc thi',
    badge: 'TÀI TRỢ',
    desc: 'Đồng hành xây dựng thương hiệu tuyển dụng, tiếp cận hàng nghìn sinh viên tài năng và vinh danh trên các ấn phẩm chính thức của Bách khoa.',
    benefits: ['Đặt logo trang trọng trên toàn bộ backdrop, website, mạng xã hội', 'Quyền tham gia Ban Giám khảo chấm thi', 'Gian hàng giới thiệu sản phẩm & tuyển dụng tại sự kiện']
  },
  {
    title: 'Cố vấn Chuyên môn & Mentor',
    badge: 'CHUYÊN GIA',
    desc: 'Các chuyên gia, kỹ sư đầu ngành và cựu sinh viên trực tiếp dẫn dắt, giải đáp bài toán công nghệ thực chiến cho các nhóm dự án sinh viên.',
    benefits: ['Kết nối sâu với các dự án tiềm năng từ giai đoạn sớm', 'Được mời làm diễn giả chính các Workshop công nghệ', 'Giao lưu cùng mạng lưới chuyên gia hệ sinh thái khởi nghiệp']
  },
  {
    title: 'Đặt hàng Bài toán Thực tiễn',
    badge: 'DOANH NGHIỆP',
    desc: 'Doanh nghiệp chuyển giao các bài toán tối ưu kỹ thuật, tự động hóa hoặc phân tích dữ liệu thực tế để sinh viên giải quyết dưới sự hướng dẫn của giảng viên.',
    benefits: ['Giải quyết bài toán R&D với chi phí tối ưu', 'Đánh giá năng lực thực tế của nhân sự tương lai trước khi tuyển dụng', 'Sở hữu quyền thương mại hóa các giải pháp được chuyển giao']
  }
];

// =============================================================================
// TAB 5: BK SHARK (PITCHING STAGE & SEASONS)
// =============================================================================
export interface SharkSeasonItem {
  season: string;
  year: string;
  theme: string;
  pitchesCount: number;
  totalCommitment: string;
  status: 'active' | 'completed';
  summary: string;
  date: string;
  coverImage: string;
  highlights: string[];
}

export const BK_SHARK_SEASONS: SharkSeasonItem[] = [
  {
    season: '2026',
    year: '2026',
    theme: 'DeepTech & Sustainable Innovation',
    pitchesCount: 8,
    totalCommitment: '350.000.000 VNĐ',
    status: 'active',
    summary: 'Mùa giải quy tụ các giải pháp phần cứng thông minh, AI biên và công nghệ năng lượng tái tạo từ sinh viên Bách khoa.',
    date: 'Dự kiến: Tháng 12/2026',
    coverImage: '/images/bkic/bkshark_auditorium.jpg',
    highlights: [
      '8 Dự án xuất sắc nhất lọt vào vòng chung kết pitching trực tiếp',
      'Hội đồng 5 Shark là đại diện các quỹ đầu tư mạo hiểm và doanh nghiệp lớn',
      'Cam kết hỗ trợ không gian làm việc và phòng lab nghiên cứu chuyên sâu'
    ]
  },
  {
    season: '2025',
    year: '2025',
    theme: 'Digital Transformation & Smart City',
    pitchesCount: 10,
    totalCommitment: '280.000.000 VNĐ',
    status: 'completed',
    summary: 'Sân khấu chứng kiến 5 thoả thuận cam kết đầu tư hạt giống và 3 dự án được nhận vào Vườn ươm Doanh nghiệp Đà Nẵng.',
    date: 'Tháng 11/2025',
    coverImage: '/images/bkic/bkshark_danangbooth.jpg',
    highlights: [
      'Dự án kiểm tra khuyết tật AGV nhận cam kết tài trợ 80 triệu VNĐ thiết bị',
      'Dự án DanangBooth nhận giải Ý tưởng sáng tạo chuyển đổi số'
    ]
  },
  {
    season: '2024',
    year: '2024',
    theme: 'AI & Data-driven Solutions',
    pitchesCount: 6,
    totalCommitment: '150.000.000 VNĐ',
    status: 'completed',
    summary: 'Mùa giải khởi đầu cho mô hình pitching thực tế giữa sinh viên Bách khoa và các Shark là cựu sinh viên thành đạt.',
    date: 'Tháng 12/2024',
    coverImage: '/images/bkic/bkic_launch.jpg',
    highlights: [
      'Đặt nền móng cho định dạng pitching 3 phút phản biện 7 phút',
      'Kết nối thành công 2 nhóm sinh viên vào vườn ươm khởi nghiệp'
    ]
  }
];

export const SHARK_STAGES_TIMELINE = [
  { step: '01', title: 'Nộp Hồ sơ Ý tưởng & Video Demo', desc: 'Đăng ký dự án trực tuyến qua cổng BK-IC Digital Hub, nộp tài liệu tóm tắt Executive Summary.' },
  { step: '02', title: 'Thẩm định Kỹ thuật & Sơ loại', desc: 'Ban Cố vấn đánh giá tính khả thi kỹ thuật, năng lực thực thi và tiềm năng thị trường của giải pháp.' },
  { step: '03', title: 'Huấn luyện Pitching Chuyên sâu', desc: 'Các nhóm được đào tạo 1-1 cùng mentor về cấu trúc Slide Deck, kỹ năng thuyết trình và định giá dự án.' },
  { step: '04', title: 'Trình bày trước Hội đồng Shark', desc: 'Sân khấu trực tiếp tại Hội trường lớn: 3 phút pitching giải pháp, 7 phút chất vấn từ các nhà đầu tư.' },
  { step: '05', title: 'Ký kết & Hỗ trợ Ươm tạo Vốn', desc: 'Trao chứng nhận cam kết vốn hạt giống, bảo trợ trang thiết bị và kết nối vào chương trình ươm tạo.' }
];

export const SHARK_MENTORS = [
  {
    name: 'TS. Nguyễn Văn Hướng',
    role: 'Cố vấn Trưởng Kỹ thuật',
    org: 'Khoa Điện tử - Viễn thông, DUT',
    field: 'Embedded Systems & AI Biên'
  },
  {
    name: 'ThS. Trần Minh Đức',
    role: 'Cố vấn Mô hình Kinh doanh',
    org: 'Vườn ươm Doanh nghiệp Đà Nẵng (DNES)',
    field: 'Thẩm định Tài chính & Khởi nghiệp'
  },
  {
    name: 'Lê Anh Khoa',
    role: 'Trưởng Ban Điều hành',
    org: 'BK-IC Digital Hub',
    field: 'Điều phối Dự án & Ươm mầm Sinh viên'
  }
];

// =============================================================================
// TAB 6: TUYỂN THÀNH VIÊN (RECRUITMENT OVERVIEW & FAQ)
// =============================================================================
export interface ClubUnitDetail {
  id: 'BN' | 'BDH' | 'BTV';
  name: string;
  fullName: string;
  badge: string;
  roleDescription: string;
  keyResponsibilities: string[];
  idealSkills: string[];
  growthOpportunities: string[];
}

export const CLUB_UNITS_DATA: ClubUnitDetail[] = [
  {
    id: 'BN',
    name: 'Ban Chủ nhiệm',
    fullName: 'Ban Chủ nhiệm (BCN)',
    badge: 'LÃNH ĐẠO & ĐỊNH HƯỚNG',
    roleDescription: 'Cơ quan đại diện cao nhất của CLB, chịu trách nhiệm hoạch định chiến lược phát triển, bảo trợ pháp lý và đối ngoại cùng Đoàn Thanh niên – Hội Sinh viên Trường ĐH Bách khoa.',
    keyResponsibilities: [
      'Quyết định định hướng hoạt động chiến lược và kế hoạch ngân sách hàng năm',
      'Đại diện làm việc cùng Ban Giám hiệu, các Khoa chuyên ngành và Sở ban ngành',
      'Ký kết thỏa thuận hợp tác với doanh nghiệp, nhà tài trợ và quỹ đầu tư'
    ],
    idealSkills: ['Tư duy lãnh đạo & quản trị tổ chức', 'Kỹ năng đàm phán & đối ngoại', 'Tầm nhìn chiến lược'],
    growthOpportunities: ['Rèn luyện kỹ năng lãnh đạo thực chiến', 'Mở rộng mạng lưới quan hệ doanh nghiệp cấp cao']
  },
  {
    id: 'BDH',
    name: 'Ban Điều hành',
    fullName: 'Ban Điều hành (BĐH)',
    badge: 'TỔ CHỨC & CHUYÊN MÔN',
    roleDescription: 'Đầu mối trực tiếp tổ chức các chương trình công nghệ, điều phối workshop, giải đấu Hackathon và quản lý tiến độ các dự án nghiên cứu phát triển.',
    keyResponsibilities: [
      'Lên kế hoạch và triển khai các buổi sinh hoạt chuyên môn thứ Ba hàng tuần',
      'Tổ chức chuỗi workshop, giải đấu BK Maker Challenge và sân khấu BK Shark',
      'Hỗ trợ kỹ thuật, không gian lab và linh kiện cho các nhóm dự án sinh viên'
    ],
    idealSkills: ['Năng lực kỹ thuật (Lập trình, Phần cứng, AI, Thiết kế)', 'Kỹ năng quản lý dự án (Agile/Scrum)', 'Giải quyết vấn đề'],
    growthOpportunities: ['Thực hành quản lý sản phẩm thực tế', 'Tiếp cận công nghệ mới và phòng lab Bách khoa']
  },
  {
    id: 'BTV',
    name: 'Ban Thành viên',
    fullName: 'Ban Thành viên (BTV)',
    badge: 'NHÂN SỰ & VĂN HÓA',
    roleDescription: 'Trực tiếp phụ trách công tác tuyển chọn, quản lý hồ sơ nhân sự, theo dõi điểm danh số hóa qua QR code và xây dựng văn hóa gắn kết nội bộ.',
    keyResponsibilities: [
      'Vận hành quy trình tuyển dụng thành viên mới hàng năm qua BK-IC Digital Hub',
      'Quản trị cơ sở dữ liệu thành viên, theo dõi chuyên cần và đánh giá định kỳ',
      'Tổ chức các hoạt động teambuilding, gắn kết và truyền thông nội bộ'
    ],
    idealSkills: ['Kỹ năng giao tiếp & lắng nghe', 'Quản trị nhân sự & dữ liệu', 'Tổ chức sự kiện văn hóa'],
    growthOpportunities: ['Thành thạo quy trình quản trị nhân lực hiện đại', 'Phát triển kỹ năng thấu hiểu và kết nối con người']
  }
];

export const RECRUITMENT_ROADMAP_STEPS = [
  { step: '01', title: 'Nộp Hồ sơ Ứng tuyển Trực tuyến', desc: 'Ứng viên điền đơn đăng ký qua cổng BK-IC Digital Hub, lựa chọn ban nguyện vọng và trình bày động lực tham gia.' },
  { step: '02', title: 'Sàng lọc Hồ sơ & Phỏng vấn', desc: 'Ban Tuyển dụng trao đổi trực tiếp để hiểu rõ năng khiếu, mục tiêu phát triển và mức độ cam kết của ứng viên.' },
  { step: '03', title: 'Thử việc & Onboarding Miniproject', desc: 'Ứng viên tham gia các buổi sinh hoạt thứ Ba, làm quen văn hóa và cùng đồng đội thực hiện 1 miniproject nhỏ.' },
  { step: '04', title: 'Công nhận Thành viên Chính thức', desc: 'Hội đồng BCN ký quyết định kết nạp, cấp mã định danh thành viên BKIC và phân công ban chuyên trách.' }
];

export const RECRUITMENT_FAQS = [
  {
    q: 'Sinh viên năm mấy có thể đăng ký tham gia BK-IC?',
    a: 'Tất cả sinh viên đang theo học tại Trường Đại học Bách khoa – ĐHĐN từ năm nhất (K24) đến các năm cuối đều được chào đón. BK-IC đặc biệt khuyến khích các bạn năm nhất có tinh thần tò mò, ham học hỏi.'
  },
  {
    q: 'Nếu chưa có kinh nghiệm lập trình hoặc phần cứng thì có ứng tuyển được không?',
    a: 'Hoàn toàn được! BK-IC tìm kiếm tinh thần chủ động, trách nhiệm và đam mê học hỏi. CLB có lộ trình đào tạo nội bộ từ cơ bản đến nâng cao và bạn có thể lựa chọn mảng Nhân sự (BTV), Tổ chức (BĐH) hoặc Chuyên môn.'
  },
  {
    q: 'Tôi có thể đăng ký nguyện vọng nhiều ban cùng lúc không?',
    a: 'Trong đơn đăng ký, bạn có thể chọn Ban nguyện vọng chính và Ban nguyện vọng bổ sung. Ban Tuyển dụng sẽ cân nhắc năng lực và phỏng vấn để xếp vị trí phù hợp nhất với bạn.'
  },
  {
    q: 'Thời gian sinh hoạt cố định của CLB là khi nào?',
    a: 'CLB tổ chức sinh hoạt định kỳ vào chiều thứ Ba hàng tuần (17:30 – 19:00). Ngoài ra, các nhóm dự án sẽ chủ động sắp xếp thời gian làm việc linh hoạt theo tiến độ.'
  },
  {
    q: 'Gia nhập BK-IC sinh viên nhận được những quyền lợi gì?',
    a: 'Thành viên được cấp quyền truy cập lab Không gian Sáng tạo, bảo trợ linh kiện chế tạo mẫu thử, ưu tiên tham gia workshop với chuyên gia, cộng điểm rèn luyện và cơ hội thực tập tại các doanh nghiệp đối tác.'
  }
];

