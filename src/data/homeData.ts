// BK-IC Digital Hub — Homepage Content Data Layer
// Strongly-typed data models for News, Competitions, Featured Activities, and Partners

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: 'Sự kiện' | 'Thông báo' | 'Thành tựu' | 'Workshop' | 'Hợp tác' | 'Cuộc thi' | 'Tin tức CLB' | 'Hoạt động CLB';
  publishedAt: string; // Format DD/MM/YYYY
  image: string;
  slug?: string;
  detailUrl: string;
  readTime?: string;
  source?: string;
  sourceUrl?: string;
  verificationNotes?: string;
  status?: 'draft' | 'pending_review' | 'published';
  priority?: 'high' | 'normal' | 'low';
}

export interface CompetitionItem {
  id: string;
  title: string;
  description: string;
  field?: string;
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
// 1. BẢN TIN (HOMEPAGE NEWS DATA — FROM OFFICIAL BK-IC FANPAGE)
// Note: Crawled from https://www.facebook.com/dut.bkic. Status: draft (Pending BCN verification)
// =============================================================================
export const HOME_NEWS_DATA: NewsItem[] = [
  {
    id: 'news-01',
    title: 'Chúc mừng thành viên BK-IC xuất sắc nhận học bổng Nitori',
    description: 'BK-IC chúc mừng Nguyễn Hoàng Long – thành viên CLB nhận Học bổng Quốc tế Nitori. Đây là sự ghi nhận cho những nỗ lực học tập, thành tích và tinh thần cống hiến của thành viên.',
    category: 'Thành tựu',
    publishedAt: '04/11/2026',
    image: '/images/bkic/news_nitori_scholarship.jpg',
    slug: 'chuc-mung-thanh-vien-nhan-hoc-bong-nitori',
    detailUrl: 'https://www.facebook.com/dut.bkic',
    source: 'Facebook Fanpage BK-IC',
    sourceUrl: 'https://www.facebook.com/dut.bkic',
    readTime: '3 phút đọc',
    status: 'draft',
    verificationNotes: 'Cần BCN xác nhận quyền công khai thông tin cá nhân và hình ảnh.',
    priority: 'high'
  },
  {
    id: 'news-02',
    title: 'Phát động cuộc thi Ý tưởng sáng tạo chuyển đổi số thanh niên Liên Chiểu 2026',
    description: 'Ban Chấp hành Đoàn TNCS Hồ Chí Minh phường Liên Chiểu phối hợp cùng BK-IC phát động cuộc thi nhằm khuyến khích thanh niên đề xuất các giải pháp sáng tạo, ứng dụng công nghệ và giải quyết những vấn đề thực tiễn tại địa phương.',
    category: 'Cuộc thi',
    publishedAt: '26/09/2026',
    image: '/images/bkic/news_digital_transformation_lienchieu.jpg',
    slug: 'cuoc-thi-y-tuong-sang-tao-chuyen-doi-so-lien-chieu-2026',
    detailUrl: 'https://www.facebook.com/dut.bkic',
    source: 'Facebook Fanpage BK-IC',
    sourceUrl: 'https://www.facebook.com/dut.bkic',
    readTime: '3 phút đọc',
    status: 'draft',
    verificationNotes: 'Cần BCN xác nhận kết quả và tình trạng tổ chức sau khi cuộc thi kết thúc.',
    priority: 'high'
  },
  {
    id: 'news-03',
    title: 'FIRST MEETING – Khởi động hành trình mới cùng BK-IC!',
    description: 'Bài đăng giới thiệu buổi gặp mặt đầu tiên, mở đầu hành trình hoạt động mới của BK-IC.',
    category: 'Hoạt động CLB',
    publishedAt: '08/09/2026',
    image: '/images/bkic/news_first_meeting.jpg',
    slug: 'first-meeting-khoi-dong-hanh-trinh-moi',
    detailUrl: 'https://www.facebook.com/dut.bkic',
    source: 'Facebook Fanpage BK-IC',
    sourceUrl: 'https://www.facebook.com/dut.bkic',
    readTime: '2 phút đọc',
    status: 'draft',
    verificationNotes: 'Chưa đủ nội dung chi tiết. Cần bổ sung nội dung và hình ảnh gốc trước khi xuất bản.',
    priority: 'low'
  },
  {
    id: 'news-04',
    title: 'BK SHARK 2026 chính thức mở đơn đăng ký',
    description: 'Cuộc thi Khởi nghiệp trong sinh viên – BK SHARK 2026 do Trường Đại học Bách khoa – Đại học Đà Nẵng tổ chức, tạo môi trường để sinh viên phát triển ý tưởng, học hỏi từ chuyên gia và kết nối doanh nghiệp.',
    category: 'Cuộc thi',
    publishedAt: '15/04/2026',
    image: '/images/bkic/news_bkshark_2026_launch.jpg',
    slug: 'bk-shark-2026-chinh-thuc-mo-don-dang-ky',
    detailUrl: 'https://www.facebook.com/dut.bkic',
    source: 'Facebook Fanpage BK-IC',
    sourceUrl: 'https://www.facebook.com/dut.bkic',
    readTime: '4 phút đọc',
    status: 'draft',
    verificationNotes: 'Cần xác nhận vai trò chính thức của BK-IC trong cuộc thi và trạng thái hiện tại của chương trình.',
    priority: 'high'
  },
  {
    id: 'news-05',
    title: 'Ra mắt Câu lạc bộ BK-IC: Kiến tạo bệ phóng cho thế hệ kỹ sư – doanh nhân tương lai',
    description: 'BK-IC chính thức ra mắt, đánh dấu sự khởi đầu của một tổ chức hướng đến thúc đẩy tinh thần khởi nghiệp và đổi mới sáng tạo trong cộng đồng sinh viên.',
    category: 'Tin tức CLB',
    publishedAt: '06/04/2026',
    image: '/images/bkic/news_bkic_launch_ceremony.jpg',
    slug: 'ra-mat-cau-lac-bo-bk-ic',
    detailUrl: 'https://www.facebook.com/dut.bkic',
    source: 'Facebook Fanpage BK-IC',
    sourceUrl: 'https://www.facebook.com/dut.bkic',
    readTime: '3 phút đọc',
    status: 'draft',
    verificationNotes: 'Cần BCN xác nhận nội dung và cách diễn đạt chính thức về sự kiện ra mắt.',
    priority: 'high'
  }
];

// =============================================================================
// 2. CUỘC THI (COMPETITIONS DATA — 2 OFFICIAL COMPETITIONS OF BK-IC)
// Note: Both competitions have successfully completed.
// =============================================================================
export const COMPETITION_STATUS_ORDER: Record<CompetitionItem['status'], number> = {
  ongoing: 0,
  upcoming: 1,
  completed: 2
};

export function sortCompetitions(items: CompetitionItem[]): CompetitionItem[] {
  return [...items].sort((a, b) => {
    return COMPETITION_STATUS_ORDER[a.status] - COMPETITION_STATUS_ORDER[b.status];
  });
}

export const HOME_COMPETITIONS_DATA: CompetitionItem[] = [
  {
    id: 'comp-bkshark-2026',
    title: 'Cuộc thi Khởi nghiệp trong sinh viên – BK SHARK 2026',
    description: 'Sân chơi pitching thường niên đỉnh cao tìm kiếm và ươm tạo các dự án công nghệ sinh viên có tiềm năng thương mại hóa thực tế.',
    field: 'Khởi nghiệp & Đổi mới sáng tạo',
    image: '/images/bkic/news_bkshark_2026_launch.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '15/03/2026',
    endDate: '10/05/2026',
    registrationDeadline: '19/04/2026',
    detailUrl: '/activities/bk-shark'
  },
  {
    id: 'comp-lienchieu-cds-2026',
    title: 'Cuộc thi Ý tưởng sáng tạo chuyển đổi số thanh niên Liên Chiểu 2026',
    description: 'Khuyến khích thanh niên đề xuất các giải pháp sáng tạo, ứng dụng công nghệ và giải quyết những vấn đề thực tiễn tại địa phương.',
    field: 'Chuyển đổi số & Công nghệ ứng dụng',
    image: '/images/bkic/news_digital_transformation_lienchieu.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '25/09/2026',
    endDate: '10/10/2026',
    registrationDeadline: '03/10/2026',
    detailUrl: '/activities/cuoc-thi'
  }
];

// =============================================================================
// 3. HOẠT ĐỘNG NỔI BẬT (FEATURED ACTIVITIES DATA)
// =============================================================================
export const HOME_ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-bkshark-2026',
    title: 'BK SHARK 2026: Sân khấu Pitching Kết nối Đầu tư Công nghệ',
    description: 'Hành trình ươm mầm các ý tưởng kỹ thuật đột phá thành mô hình khởi nghiệp khả thi với sự đồng hành của hội đồng cố vấn và doanh nghiệp công nghệ hàng đầu.',
    category: 'Hackathon',
    date: '10/05/2026',
    image: '/images/bkic/bkshark_auditorium.jpg',
    detailUrl: '/activities/bk-shark',
    featured: true,
    location: 'Hội trường Khu F, Trường ĐH Bách khoa – ĐHĐN'
  },
  {
    id: 'act-sinh-hoat-tuan-7',
    title: 'Recap buổi sinh hoạt câu lạc bộ tuần 7',
    description: 'Buổi sinh hoạt chuyên môn định kỳ tuần 7, đánh giá tiến độ hoạt động các ban chuyên môn và triển khai kế hoạch nghiên cứu, hỗ trợ dự án.',
    category: 'Nội bộ',
    date: '12/11/2026',
    image: '/images/bkic/activity_recap_tuan_7.jpg',
    detailUrl: '/activities/sinh-hoat',
    featured: true,
    location: 'Phòng A136'
  },
  {
    id: 'act-workshop-cds-lienchieu',
    title: 'Workshop hỗ trợ các đội thi ý tưởng sáng tạo chuyển đổi số Liên Chiểu',
    description: 'Buổi tập huấn chuyên đề đồng hành và cố vấn chuyên môn cho các đội thi lọt vào Vòng Chung kết Cuộc thi Ý tưởng sáng tạo chuyển đổi số Liên Chiểu 2026.',
    category: 'Workshop',
    date: '15/10/2026',
    image: '/images/bkic/activity_workshop_cds_lienchieu.jpg',
    detailUrl: '/activities/workshop',
    featured: true,
    location: 'Phòng A136'
  },
  {
    id: 'act-training-bkshark-2026',
    title: 'Training BK Shark 2026: Vòng đào tạo chuyên sâu',
    description: 'Chương trình đào tạo chuyên sâu trang bị kỹ năng hoàn thiện mô hình kinh doanh, công nghệ và kỹ năng thuyết trình gọi vốn cho các đội thi BK Shark 2026.',
    category: 'Đào tạo',
    date: '09/05/2026',
    image: '/images/bkic/activity_training_bkshark_2026.jpg',
    detailUrl: '/activities/bk-shark',
    featured: true,
    location: 'Phòng F310'
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

