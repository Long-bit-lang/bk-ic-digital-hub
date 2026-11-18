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
  level?: string;
  scale?: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  statusLabel: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  detailUrl: string;
  infoUrl?: string;
  externalRegUrl?: string;
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
  organizers?: string;
  outcomes?: string;
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
    title: 'Cuộc thi Khởi nghiệp Sinh viên – BK SHARK 2026',
    description: 'Đấu trường khởi nghiệp quy tụ 35 đội thi (138 sinh viên từ 10 Khoa thuộc DUT và 06 trường ĐH tại Đà Nẵng, 60% dự án có giảng viên hướng dẫn) kèm chuỗi 4 buổi tập huấn thực chiến.',
    field: 'Khởi nghiệp & Đổi mới sáng tạo',
    level: 'Thành Phố',
    scale: '35 đội • 138 sinh viên',
    prizePool: 'Cúp Vô địch & Gói ươm tạo',
    image: '/images/bkic/news_bkshark_2026_launch.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '15/03/2026',
    endDate: '16/05/2026',
    registrationDeadline: '19/04/2026',
    detailUrl: '/activities/competitions/bk-shark-2026',
    infoUrl: 'https://dut.udn.vn/Phong/Taichinh/Tintuc/id/11980'
  },
  {
    id: 'comp-lienchieu-cds-2026',
    title: 'Cuộc thi Ý tưởng sáng tạo chuyển đổi số thanh niên Liên Chiểu 2026',
    description: 'Chủ đề "Thanh niên Liên Chiểu – Sáng tạo vì cuộc sống" do BCH Đoàn phường Liên Chiểu phối hợp cùng CLB BK-IC phát động nhằm thúc đẩy giải pháp số hóa và cải cách hành chính.',
    field: 'Chuyển đổi số & Cải cách hành chính',
    level: 'Cấp Phường',
    scale: 'Cá nhân / Nhóm (tối đa 5 TV)',
    prizePool: 'Giải thưởng & Bằng khen Đoàn TN',
    image: '/images/bkic/news_digital_transformation_lienchieu.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '25/09/2026',
    endDate: '10/10/2026',
    registrationDeadline: '04/10/2026',
    detailUrl: '/activities/competitions/chuyen-doi-so-thanh-nien-lien-chieu-2026',
    infoUrl: 'https://www.facebook.com/share/p/199kjt2v7X/',
    externalRegUrl: 'https://forms.gle/suQiRrkoFpBP4CNx7'
  },
  {
    id: 'comp-avalanche-team1-hackathon-2026',
    title: 'AVALANCHE TEAM1 HACKATHON 2026',
    description: 'Hackathon toàn quốc dành cho sinh viên xây dựng sản phẩm thực tế trên nền tảng blockchain Avalanche với tổng giải thưởng lên đến 3.500 USD cùng 3 workshop kỹ thuật.',
    field: 'Blockchain Avalanche & Web3',
    level: 'Quốc Gia',
    scale: '30+ đội • 7–10 đội vào Chung kết',
    prizePool: '3.500 USD',
    image: '/images/bkic/comp_avalanche_hackathon_2026.png',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '02/11/2026',
    endDate: '30/11/2026',
    registrationDeadline: '02/11/2026',
    detailUrl: '/activities/competitions/avalanche-team1-hackathon-2026',
    infoUrl: 'https://docs.google.com/document/d/1uM479CenH025TwWRBaAZZwV2c88Uxh0vjOM42uhCBaE/edit?tab=t.0#heading=h.w1zqpeqit2ak'
  },
  {
    id: 'comp-steam-quoc-te-2026',
    title: 'Cuộc thi STEAM Quốc tế "Công dân Châu Á Thế hệ mới"',
    description: 'Cuộc thi gồm 6 nội dung về lập trình, robot, AI, sáng tạo nội dung và các dự án STEAM vì cộng đồng nhằm phát triển tư duy công nghệ và giải quyết bài toán xã hội.',
    field: 'Lập trình, Robot, AI & STEAM cộng đồng',
    level: 'Quốc Tế',
    scale: '3 người/nhóm',
    prizePool: 'Giải thưởng & Huy chương Quốc tế',
    image: '/images/bkic/comp_steam_angc_2026.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '15/09/2026',
    endDate: '04/10/2026',
    registrationDeadline: '04/10/2026',
    detailUrl: '/activities/competitions/cuoc-thi-steam-quoc-te-cong-dan-chau-a-the-he-moi-2026',
    infoUrl: 'https://drive.google.com/file/d/19qK0YK5H-TV4pVWMqZRfu7cdRmkEEXXp/view?usp=sharing',
    externalRegUrl: 'https://www.facebook.com/share/p/1LkqMaz89k/'
  },
  {
    id: 'comp-mit-50k-vietnam-2026',
    title: 'MIT $50K VIETNAM: GIAO LƯU TRỰC TUYẾN CÙNG BAN TỔ CHỨC',
    description: 'Buổi giao lưu trực tuyến cùng Ban Tổ chức MIT $50K Vietnam về điều kiện tham gia, hồ sơ và quy trình đánh giá dành cho các dự án khởi nghiệp và nghiên cứu chuyên sâu.',
    field: 'Các dự án khởi nghiệp',
    level: 'Quốc Gia',
    scale: 'Không giới hạn',
    prizePool: 'Quỹ giải thưởng $50,000',
    image: '/images/bkic/comp_mit_50k_vietnam_2026.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '26/09/2026',
    endDate: '26/09/2026',
    registrationDeadline: '26/09/2026',
    detailUrl: '/activities/competitions/mit-50k-vietnam-giao-luu-truc-tuyen-2026',
    infoUrl: 'https://www.facebook.com/share/p/1DHFCaSkLJ/',
    externalRegUrl: 'https://l1nk.dev/0ynhrhv'
  },
  {
    id: 'comp-sang-tao-tre-ai-2026',
    title: 'Cuộc thi Sáng tạo Trẻ Quốc gia về Trí tuệ Nhân tạo 2026',
    description: 'Tuyển chọn 05 đội thi (tối đa 3 thành viên/đội) đại diện Trường ĐH Bách khoa – ĐHĐN tham dự Vòng Khu vực miền Trung (Bảng C) tại Đà Nẵng và Vòng Chung kết Toàn quốc tại Hà Nội.',
    field: 'CNTT, Trí tuệ nhân tạo (AI), KHDL, Điện tử & Tự động hóa',
    level: 'Quốc Gia',
    scale: '3 người/đội (Chọn 05 đội DUT)',
    prizePool: 'Đại diện DUT dự Chung kết Quốc gia',
    image: '/images/bkic/comp_ai_quoc_gia_2026.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '01/09/2026',
    endDate: '21/09/2026',
    registrationDeadline: '21/09/2026',
    detailUrl: '/activities/competitions/cuoc-thi-sang-tao-tre-quoc-gia-ve-tri-tue-nhan-tao-2026',
    infoUrl: 'https://www.facebook.com/share/p/1BVsy8dq1f/',
    externalRegUrl: 'https://docs.google.com/document/d/1277xrIsRtrUwbLIdDLqEUznZhroKICyJ/edit?usp=sharing&ouid=111272308073265472512&rtpof=true&sd=true'
  },
  {
    id: 'comp-next-commerce-2027',
    title: 'Chương trình: NEXT COMMERCE 2027 – TRENDS • TECHNOLOGY • TALENT',
    description: 'Sự kiện về xu hướng E-Commerce kết hợp Công nghệ và AI, mở ra cơ hội mới trong kinh doanh và Marketing tại Nhà hát Trưng Vương, Đà Nẵng.',
    field: 'Kinh doanh, Công nghệ, Marketing & TMĐT',
    level: 'Quốc Gia',
    scale: 'Sinh viên quan tâm',
    prizePool: 'Quà tặng & Học bổng >200 Triệu VNĐ',
    image: '/images/bkic/comp_next_commerce_2027.jpg',
    status: 'completed',
    statusLabel: 'Đã kết thúc',
    startDate: '20/09/2026',
    endDate: '20/09/2026',
    registrationDeadline: '20/09/2026',
    detailUrl: '/activities/competitions/next-commerce-2027-trends-technology-talent',
    infoUrl: 'https://www.facebook.com/share/p/1UMz4YQz7e/',
    externalRegUrl: 'https://forms.gle/DSfpAbA2UDX4den79'
  }
];

// =============================================================================
// 3. HOẠT ĐỘNG NỔI BẬT (FEATURED ACTIVITIES DATA — TỪ BẢNG HOẠT ĐỘNG CLB BK-IC)
// =============================================================================
export const HOME_ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-bkshark-2026',
    title: 'Cuộc thi Khởi nghiệp Sinh viên "BK SHARK 2026" & Chuỗi 4 Buổi Tập huấn Chuyên sâu',
    description: 'Thu hút 35 đội thi (138 sinh viên từ 10 Khoa thuộc DUT và 06 trường ĐH tại Đà Nẵng; 60% dự án có giảng viên hướng dẫn) cùng 4 buổi tập huấn thực chiến về Value Proposition, Gọi vốn & Pitching, Go-to-Market và Lean Startup.',
    category: 'Hackathon',
    date: 'Tháng 05/2026',
    image: '/images/bkic/bkshark_auditorium.jpg',
    detailUrl: '/activities/bk-shark',
    featured: true,
    location: 'Trường ĐH Bách khoa – ĐHĐN (F310, S02.01, E2.204)',
    organizers: 'Trường ĐH Bách khoa, Đoàn TN - Hội SV & CLB BK-IC (Phối hợp: TT Hỗ trợ SV & QHDN, HUB Network Đà Nẵng)',
    outcomes: '35 đội thi • 138 sinh viên • 10 Khoa • 06 Trường ĐH • 60% dự án có giảng viên hướng dẫn'
  },
  {
    id: 'act-cds-lienchieu-2026',
    title: 'Đồng tổ chức Cuộc thi "Ý tưởng Sáng tạo Chuyển đổi số Phường Liên Chiểu 2026"',
    description: 'Phối hợp liên ngành cùng Đoàn phường Liên Chiểu, Phòng Văn hóa - Xã hội và Trung tâm Hỗ trợ SV & QHDN xây dựng thể lệ, điều phối chuyên môn, tổ chức Workshop tập huấn và vận hành các vòng thi.',
    category: 'Cộng đồng',
    date: 'Tháng 09 – 10/2026',
    image: '/images/bkic/activity_workshop_cds_lienchieu.jpg',
    detailUrl: '/activities/competitions/chuyen-doi-so-thanh-nien-lien-chieu-2026',
    featured: true,
    location: 'Phường Liên Chiểu & Phòng A136 (DUT)',
    organizers: 'Đoàn phường Liên Chiểu, Phòng VH-XH, CLB BK-IC & TT Hỗ trợ SV & QHDN',
    outcomes: 'Đưa giải pháp số hóa của sinh viên vào dịch vụ hành chính công địa phương'
  },
  {
    id: 'act-mou-hub-network-2026',
    title: 'Ký kết MOU, Gia nhập Mạng lưới Khởi nghiệp ĐMST HUB Network Đà Nẵng',
    description: 'Chính thức ký kết Biên bản ghi nhớ hợp tác (MOU), gia nhập mạng lưới HUB Network Đà Nẵng; mở rộng cơ hội phối hợp tổ chức workshop, cuộc thi và dự án về AI, Blockchain, Startup tại miền Trung.',
    category: 'Networking',
    date: 'Năm 2026',
    image: '/images/bkic/bkic_launch.jpg',
    detailUrl: '/activities/sinh-hoat',
    featured: true,
    location: 'Thành phố Đà Nẵng',
    organizers: 'HUB Network Đà Nẵng & CLB BK-IC',
    outcomes: 'Kết nối sâu rộng mạng lưới CLB khởi nghiệp, chuyên gia và doanh nghiệp miền Trung'
  },
  {
    id: 'act-tuyen-thanh-vien-2026',
    title: 'Chiến dịch Tuyển Thành viên CLB BK-IC (Năm học 2026 – 2027)',
    description: 'Xây dựng bộ ấn phẩm truyền thông giới thiệu 3 ban nòng cốt, sàng lọc CV và phỏng vấn chuyên sâu, thu hút nhân sự chất lượng cao từ các ngành KHDL & AI, Công nghệ thông tin, Cơ khí, SH Y Dược.',
    category: 'Nội bộ',
    date: '21/08 – 07/09/2026',
    image: '/images/bkic/activity_recap_tuan_7.jpg',
    detailUrl: '/activities/tuyen-thanh-vien',
    featured: true,
    location: 'Trường ĐH Bách khoa – ĐHĐN',
    organizers: 'Ban Chủ nhiệm CLB BK-IC',
    outcomes: 'Kiện toàn lực lượng nhân sự kế thừa chất lượng cao đa chuyên ngành'
  },
  {
    id: 'act-mang-luoi-clb-dhdn-2026',
    title: 'Ra mắt Mạng lưới CLB Khởi nghiệp, Đổi mới sáng tạo Đại học Đà Nẵng',
    description: 'Tham gia chương trình ra mắt và ký kết hợp tác cùng Mạng lưới Khởi nghiệp Đổi mới sáng tạo Đại học Đà Nẵng, thúc đẩy liên kết học thuật giữa các CLB sinh viên trực thuộc ĐHĐN.',
    category: 'Networking',
    date: '09/01/2026',
    image: '/images/bkic/news_bkic_launch_ceremony.jpg',
    detailUrl: '/activities/sinh-hoat',
    featured: false,
    location: 'Đại học Đà Nẵng',
    organizers: 'Hội Sinh viên Đại học Đà Nẵng & Các CLB trực thuộc',
    outcomes: 'Xác lập liên kết chính thức trong Mạng lưới KNĐMST Đại học Đà Nẵng'
  },
  {
    id: 'act-thanh-lap-clb-2026',
    title: 'Chính thức Thành lập Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo BK-IC',
    description: 'Hoàn thiện đề án, ký quyết định thành lập CLB BK-IC và kiện toàn Ban Chủ nhiệm dưới sự bảo trợ của Nhà trường và Trung tâm Hỗ trợ sinh viên & Quan hệ doanh nghiệp.',
    category: 'Nội bộ',
    date: '08/01/2026',
    image: '/images/bkic/bkic_launch.jpg',
    detailUrl: '/about',
    featured: false,
    location: 'Trường ĐH Bách khoa – ĐHĐN',
    organizers: 'Nhà trường / Trung tâm Hỗ trợ sinh viên & QHDN',
    outcomes: 'Đặt nền móng pháp lý chính thức cho hệ sinh thái khởi nghiệp sinh viên Bách khoa'
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

