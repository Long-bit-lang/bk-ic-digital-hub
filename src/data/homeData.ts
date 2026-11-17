// BK-IC Digital Hub — Homepage Content Data Layer
// Strongly-typed data models for News, Competitions, Featured Activities, and Partners

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: 'Sự kiện' | 'Thông báo' | 'Thành tựu' | 'Workshop' | 'Hợp tác';
  publishedAt: string; // Format DD/MM/YYYY
  image: string;
  slug?: string;
  detailUrl: string;
  readTime?: string;
}

export interface CompetitionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  statusLabel: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  detailUrl: string;
  prizePool?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  category: 'Workshop' | 'Networking' | 'Hackathon' | 'Đào tạo' | 'Cộng đồng' | 'Doanh nghiệp' | 'Nội bộ';
  date: string;
  image: string;
  detailUrl: string;
  featured: boolean;
  location?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  category: 'Đơn vị bảo trợ' | 'Đối tác chiến lược' | 'Đối tác đồng hành';
  websiteUrl?: string;
  description?: string;
  displayOrder: number;
  initials?: string;
}

// =============================================================================
// 1. BẢN TIN (NEWS ITEMS)
// =============================================================================
export const HOME_NEWS_DATA: NewsItem[] = [
  {
    id: 'news-01',
    title: 'BK-IC chính thức khởi động chuỗi ươm mầm dự án Khởi nghiệp Đổi mới Sáng tạo 2026',
    description: 'Chương trình bảo trợ kỹ thuật toàn diện, kết nối phòng thí nghiệm nghiên cứu chuyên sâu và hỗ trợ kinh phí chế tạo mẫu thử (prototype) cho sinh viên Bách khoa.',
    category: 'Sự kiện',
    publishedAt: '17/11/2026',
    image: '/images/bkic/bkic_launch.jpg',
    slug: 'khoi-dong-uom-mam-khoi-nghiep-2026',
    detailUrl: '/activities/companion-projects',
    readTime: '4 phút đọc'
  },
  {
    id: 'news-02',
    title: 'Tập huấn kỹ năng Pitching và thẩm định mô hình tài chính cùng chuyên gia doanh nghiệp',
    description: 'Buổi làm việc chuyên đề giúp các nhóm dự án sinh viên hoàn thiện kế hoạch kinh doanh, cấu trúc chi phí và tự tin thuyết trình trước hội đồng đầu tư mạo hiểm.',
    category: 'Workshop',
    publishedAt: '12/11/2026',
    image: '/images/bkic/startup_training.jpg',
    slug: 'tap-huan-pitching-va-mo-hinh-tai-chinh',
    detailUrl: '/activities/workshops',
    readTime: '3 phút đọc'
  },
  {
    id: 'news-03',
    title: 'Vòng chung kết Sân khấu Pitching BK SHARK 2026 ghi nhận 15 dự án công nghệ đột phá',
    description: 'Quy tụ hơn 300 sinh viên tham dự tại hội trường lớn, các giải pháp AI ứng dụng, Embedded IoT và GreenTech đã nhận được cam kết hỗ trợ vốn từ đối tác.',
    category: 'Thành tựu',
    publishedAt: '05/11/2026',
    image: '/images/bkic/bkshark_auditorium.jpg',
    slug: 'chung-ket-bk-shark-2026-ghi-nhan-15-du-an',
    detailUrl: '/activities/bk-shark',
    readTime: '5 phút đọc'
  },
  {
    id: 'news-04',
    title: 'Sinh viên Bách khoa đạt giải cao tại cuộc thi Sáng kiến Đổi mới Sáng tạo Công nghệ Đà Nẵng',
    description: 'Đội thi thuộc Ban Điều hành BK-IC xuất sắc giành giải Nhì toàn thành phố với giải pháp thiết bị quan trắc môi trường thông minh sử dụng năng lượng mặt trời.',
    category: 'Thành tựu',
    publishedAt: '28/10/2026',
    image: '/images/bkic/bkdn_awards.jpg',
    slug: 'sinh-vien-bach-khoa-dat-giai-cao-tai-danang-innovation',
    detailUrl: '/activities/competitions',
    readTime: '3 phút đọc'
  },
  {
    id: 'news-05',
    title: 'Thông báo lịch sinh hoạt chuyên môn định kỳ thứ Ba và tập huấn thành viên Gen 2026',
    description: 'Thời gian cố định từ 17:30 – 19:00 tại Phòng Không gian Sáng tạo, toàn bộ thành viên 3 ban thực hiện điểm danh số hóa qua mã QR động trên BK-IC Digital Hub.',
    category: 'Thông báo',
    publishedAt: '20/10/2026',
    image: '/images/bkic/bkdn_students.jpg',
    slug: 'thong-bao-sinh-hoat-dinh-ky-thu-ba',
    detailUrl: '/activities/internal',
    readTime: '2 phút đọc'
  },
  {
    id: 'news-06',
    title: 'Ký kết thỏa thuận hợp tác đào tạo và ươm tạo công nghệ với mạng lưới Vườn ươm Quốc gia',
    description: 'Mở rộng cơ hội thực tập, tiếp cận cố vấn đầu ngành và mạng lưới quỹ hạt giống cho các bạn trẻ đam mê kỹ thuật và khởi nghiệp công nghệ.',
    category: 'Hợp tác',
    publishedAt: '10/10/2026',
    image: '/images/bkic/bkshark_danangbooth.jpg',
    slug: 'ky-ket-hop-tac-uom-tao-quoc-gia',
    detailUrl: '/partnership',
    readTime: '4 phút đọc'
  }
];

// =============================================================================
// 2. CUỘC THI (COMPETITIONS DATA)
// =============================================================================
export const HOME_COMPETITIONS_DATA: CompetitionItem[] = [
  {
    id: 'comp-01',
    title: 'BK SHARK 2026 – Đấu trường Khởi nghiệp Sinh viên Bách khoa',
    description: 'Sân chơi pitching thường niên đỉnh cao tìm kiếm và ươm tạo các dự án công nghệ sinh viên có tiềm năng thương mại hóa thực tế.',
    image: '/images/bkic/bkshark_auditorium.jpg',
    status: 'ongoing',
    statusLabel: 'Đang diễn ra',
    startDate: '01/10/2026',
    endDate: '15/12/2026',
    registrationDeadline: '30/11/2026',
    detailUrl: '/activities/bk-shark',
    prizePool: '150.000.000 VNĐ'
  },
  {
    id: 'comp-02',
    title: 'DUT Hackathon – AI & Smart Embedded Systems',
    description: 'Thử thách 48 giờ liên tục lập trình, thiết kế phần cứng IoT và giải quyết bài toán tối ưu năng lượng đô thị thông minh.',
    image: '/images/bkic/startup_training.jpg',
    status: 'upcoming',
    statusLabel: 'Sắp diễn ra',
    startDate: '10/12/2026',
    endDate: '12/12/2026',
    registrationDeadline: '05/12/2026',
    detailUrl: '/activities/competitions',
    prizePool: '80.000.000 VNĐ'
  },
  {
    id: 'comp-03',
    title: 'GreenTech Challenge – Giải pháp Công nghệ Xanh vì Cộng đồng',
    description: 'Cuộc thi sáng chế thiết bị xử lý chất thải, tiết kiệm năng lượng và giảm thiểu phát thải carbon hướng đến Net Zero 2050.',
    image: '/images/bkic/bkshark_ecosim_pitch.jpg',
    status: 'upcoming',
    statusLabel: 'Sắp diễn ra',
    startDate: '15/12/2026',
    endDate: '20/01/2027',
    registrationDeadline: '10/12/2026',
    detailUrl: '/activities/competitions',
    prizePool: '100.000.000 VNĐ'
  },
  {
    id: 'comp-04',
    title: 'FinTech Innovation Sprint – Ý tưởng Công nghệ Tài chính Trẻ',
    description: 'Sân chơi sáng tạo mô hình thanh toán số, quản lý chi tiêu thông minh và nền tảng giao dịch bảo mật dành cho thế hệ sinh viên.',
    image: '/images/bkic/bkshark_danangbooth.jpg',
    status: 'ongoing',
    statusLabel: 'Đang diễn ra',
    startDate: '20/10/2026',
    endDate: '25/11/2026',
    registrationDeadline: '20/11/2026',
    detailUrl: '/activities/competitions',
    prizePool: '60.000.000 VNĐ'
  },
  {
    id: 'comp-05',
    title: 'BK Innovation Awards – Tôn vinh Sáng chế Khoa học Sinh viên',
    description: 'Giải thưởng ghi nhận các đề tài nghiên cứu khoa học xuất sắc nhất có sản phẩm thực nghiệm và bài báo khoa học được công bố.',
    image: '/images/bkic/bkdn_awards.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '01/04/2026',
    endDate: '15/05/2026',
    registrationDeadline: '25/04/2026',
    detailUrl: '/activities/competitions',
    prizePool: '120.000.000 VNĐ'
  },
  {
    id: 'comp-06',
    title: 'Danang Startup Open Cup – Hạng mục Trường Đại học Bách khoa',
    description: 'Giải đấu liên trường kết nối sinh viên kỹ thuật Đà Nẵng với mạng lưới vườn ươm doanh nghiệp và các quỹ tài trợ thiên thần.',
    image: '/images/bkic/bkic_launch.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '15/03/2026',
    endDate: '30/04/2026',
    registrationDeadline: '01/04/2026',
    detailUrl: '/activities/competitions',
    prizePool: '90.000.000 VNĐ'
  }
];

// =============================================================================
// 3. HOẠT ĐỘNG NỔI BẬT (FEATURED ACTIVITIES DATA)
// =============================================================================
export const HOME_ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-01',
    title: 'BK SHARK 2026: Sân khấu Pitching Kết nối Đầu tư Công nghệ',
    description: 'Hành trình ươm mầm các ý tưởng kỹ thuật đột phá thành mô hình khởi nghiệp khả thi với sự đồng hành của hội đồng cố vấn và doanh nghiệp công nghệ hàng đầu.',
    category: 'Hackathon',
    date: 'Tháng 11/2026',
    image: '/images/bkic/bkshark_auditorium.jpg',
    detailUrl: '/activities/bk-shark',
    featured: true,
    location: 'Hội trường Khu F, Trường ĐH Bách khoa'
  },
  {
    id: 'act-02',
    title: 'Workshop Chuyên sâu: Xây dựng & Định giá Sản phẩm Công nghệ Mẫu (MVP)',
    description: 'Hướng dẫn quy trình từ thiết kế CAD, in 3D mẫu vỏ đến chế tạo bo mạch thử nghiệm và tối ưu trải nghiệm người dùng.',
    category: 'Workshop',
    date: 'Thứ Ba hàng tuần • 17:30',
    image: '/images/bkic/startup_training.jpg',
    detailUrl: '/activities/workshops',
    featured: true,
    location: 'Phòng Lab Không gian Sáng tạo'
  },
  {
    id: 'act-03',
    title: 'Networking & Đối thoại: Gặp gỡ Cựu sinh viên Khởi nghiệp Thành danh',
    description: 'Lắng nghe những bài học thực chiến, cách vượt qua thử thách thương mại hóa công nghệ và tìm kiếm cộng sự đồng hành.',
    category: 'Networking',
    date: '20/11/2026',
    image: '/images/bkic/bkdn_students.jpg',
    detailUrl: '/activities/companion-projects',
    featured: true,
    location: 'Hội trường Không gian Mở'
  },
  {
    id: 'act-04',
    title: 'Chương trình Đào tạo: Thiết kế Hệ thống Nhúng & Ứng dụng Trí tuệ Nhân tạo Biên',
    description: 'Khóa bồi dưỡng kỹ thuật thực hành chuyên sâu do Ban Điều hành tổ chức dành riêng cho thành viên kỹ thuật nòng cốt.',
    category: 'Đào tạo',
    date: 'Tháng 12/2026',
    image: '/images/bkic/bkshark_ecosim_pitch.jpg',
    detailUrl: '/activities/internal',
    featured: true,
    location: 'Lab IoT & Embedded Systems'
  },
  {
    id: 'act-05',
    title: 'Sinh hoạt nội bộ gắn kết & Tổng kết Đợt tuyển quân Gen 2026',
    description: 'Gặp mặt định kỳ giữa Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên nhằm thống nhất kế hoạch nhiệm kỳ mới.',
    category: 'Nội bộ',
    date: '15/10/2026',
    image: '/images/bkic/bkic_facebook_user_01.jpg',
    detailUrl: '/activities/internal',
    featured: false,
    location: 'Phòng họp CLB'
  }
];

// =============================================================================
// 4. ĐỐI TÁC & HỆ SINH THÁI (PARTNERS DATA)
// =============================================================================
export const HOME_PARTNERS_DATA: PartnerItem[] = [
  // Nhóm 1: Đơn vị bảo trợ
  {
    id: 'partner-01',
    name: 'Trường Đại học Bách khoa – ĐHĐN',
    logo: '/images/bkic/dut_emblem.jpg',
    category: 'Đơn vị bảo trợ',
    websiteUrl: 'https://dut.udn.vn',
    description: 'Cơ quan chủ quản bảo trợ pháp lý và học thuật cao nhất của BK-IC',
    displayOrder: 1,
    initials: 'DUT'
  },
  {
    id: 'partner-02',
    name: 'Đoàn Thanh niên – Hội Sinh viên Trường ĐH Bách khoa',
    logo: '/images/bkic/bkic_logo.jpg',
    category: 'Đơn vị bảo trợ',
    websiteUrl: 'https://dut.udn.vn',
    description: 'Đơn vị định hướng phong trào rèn luyện và bảo trợ thanh niên đổi mới sáng tạo',
    displayOrder: 2,
    initials: 'ĐTN'
  },
  {
    id: 'partner-03',
    name: 'Trung tâm Hỗ trợ Khởi nghiệp Đổi mới Sáng tạo Đà Nẵng',
    logo: '/images/bkic/bkshark_danangbooth.jpg',
    category: 'Đơn vị bảo trợ',
    websiteUrl: 'https://startupdanang.vn',
    description: 'Đơn vị đầu mối hệ sinh thái khởi nghiệp đổi mới sáng tạo thành phố Đà Nẵng',
    displayOrder: 3,
    initials: 'DNST'
  },

  // Nhóm 2: Đối tác chiến lược
  {
    id: 'partner-04',
    name: 'Sở Khoa học & Công nghệ TP. Đà Nẵng',
    logo: '/images/bkic/dut_emblem.jpg',
    category: 'Đối tác chiến lược',
    websiteUrl: 'https://dost.danang.gov.vn',
    description: 'Bảo trợ các đề tài nghiên cứu chuyển giao công nghệ sinh viên',
    displayOrder: 4,
    initials: 'DOST'
  },
  {
    id: 'partner-05',
    name: 'Vườn ươm Doanh nghiệp Đà Nẵng (DNES)',
    logo: '/images/bkic/bkshark_auditorium.jpg',
    category: 'Đối tác chiến lược',
    websiteUrl: 'https://dnes.vn',
    description: 'Mạng lưới ươm tạo hạt giống và hỗ trợ không gian làm việc sáng tạo',
    displayOrder: 5,
    initials: 'DNES'
  },
  {
    id: 'partner-06',
    name: 'Hiệp hội Doanh nghiệp Khởi nghiệp Đổi mới Sáng tạo',
    logo: '/images/bkic/startup_training.jpg',
    category: 'Đối tác chiến lược',
    websiteUrl: 'https://startupdanang.vn',
    description: 'Kết nối mạng lưới cố vấn chuyên môn và các nhà sáng lập khởi nghiệp',
    displayOrder: 6,
    initials: 'VSIE'
  },

  // Nhóm 3: Đối tác đồng hành
  {
    id: 'partner-07',
    name: 'FPT Software Miền Trung',
    logo: '/images/bkic/bkdn_students.jpg',
    category: 'Đối tác đồng hành',
    websiteUrl: 'https://fptsoftware.com',
    description: 'Tài trợ các hội thảo công nghệ AI và tiếp nhận thực tập sinh viên',
    displayOrder: 7,
    initials: 'FPT'
  },
  {
    id: 'partner-08',
    name: 'Enouvo IT Solutions & Coworking',
    logo: '/images/bkic/bkshark_ecosim_pitch.jpg',
    category: 'Đối tác đồng hành',
    websiteUrl: 'https://enouvo.com',
    description: 'Hỗ trợ không gian sáng tạo và cố vấn phát triển sản phẩm số',
    displayOrder: 8,
    initials: 'ENV'
  },
  {
    id: 'partner-09',
    name: 'Sun* Danang R&D Lab',
    logo: '/images/bkic/bkdn_awards.jpg',
    category: 'Đối tác đồng hành',
    websiteUrl: 'https://sun-asterisk.vn',
    description: 'Đồng hành trong các giải đấu Hackathon và ươm tạo kỹ sư công nghệ',
    displayOrder: 9,
    initials: 'SUN'
  },
  {
    id: 'partner-10',
    name: 'Viettel Telecom Đà Nẵng',
    logo: '/images/bkic/bkic_launch.jpg',
    category: 'Đối tác đồng hành',
    websiteUrl: 'https://viettel.vn',
    description: 'Hợp tác nghiên cứu ứng dụng hạ tầng IoT và giải pháp viễn thông',
    displayOrder: 10,
    initials: 'VTL'
  }
];

