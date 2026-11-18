// BK-IC Digital Hub — Official Partnership Data & Configurations
// Strictly verified club metrics, real club activities, and 7 official forms of cooperation
import {
  Handshake,
  Users,
  Lightbulb,
  Building,
  Target,
  GraduationCap,
  Briefcase,
  Share2,
  Trophy,
  Rocket,
  CheckCircle2,
  Sparkles,
  Layers,
  Code,
  Mic,
  MessageSquare,
  Compass,
  FileCheck2,
  PackageCheck,
  Cpu
} from 'lucide-react';

export interface PartnershipValueItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  badge: string;
  isPrimary?: boolean;
}

export interface StudentCapabilityGroup {
  id: string;
  category: string;
  title: string;
  description: string;
  skills: string[];
  icon: any;
}

export interface PartnershipOpportunityItem {
  id: string;
  typeKey: string;
  title: string;
  description: string;
  targetAudience: string;
  partnerBenefits: string[];
  icon: any;
  badge: string;
}

export interface PartnershipStatItem {
  id: string;
  numericValue: number;
  suffix: string;
  label: string;
  description: string;
}

export interface PartnershipStoryItem {
  id: string;
  partnerName: string;
  partnerLogo?: string;
  activityTitle: string;
  category: string;
  objective: string;
  outcome: string;
  quote?: string;
  quoteAuthor?: string;
}

export interface PartnershipStepItem {
  step: number;
  title: string;
  description: string;
  detail: string;
}

export interface PartnershipEcosystemGroup {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: any;
  tag: string;
}

export interface PartnershipFAQItem {
  id: string;
  question: string;
  answer: string;
}

// -----------------------------------------------------------------------------
// 1. STATS: Strictly verified data from DB & activities (No synthetic metrics)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_STATS: PartnershipStatItem[] = [
  {
    id: 'members',
    numericValue: 30,
    suffix: '',
    label: 'Thành viên nòng cốt',
    description: 'Bao gồm BCN (3), BĐH (5) và BTV (22) là sinh viên kỹ thuật đang học tập tại các khoa thuộc Trường ĐH Bách khoa – ĐHĐN'
  },
  {
    id: 'teams',
    numericValue: 35,
    suffix: '+',
    label: 'Đội thi kết nối',
    description: 'Thu hút đông đảo sinh viên đam mê công nghệ và kinh doanh từ 6 trường đại học trên địa bàn Đà Nẵng qua BK Shark 2026'
  },
  {
    id: 'students',
    numericValue: 140,
    suffix: '+',
    label: 'Sinh viên tham gia tranh tài',
    description: 'Hơn 140 bạn trẻ kỹ thuật trực tiếp trải qua các buổi tập huấn chuyên sâu và sân khấu tranh biện dự án'
  },
  {
    id: 'activities',
    numericValue: 2,
    suffix: '',
    label: 'Hoạt động đồng tổ chức',
    description: 'BK SHARK 2026 (đồng tổ chức cùng Đoàn trường) và Cuộc thi Sáng tạo CĐS Liên Chiểu 2026 (đồng hành cùng Đoàn phường)'
  }
];

// -----------------------------------------------------------------------------
// 2. STUDENT CAPABILITY DEVELOPMENT (Định hướng phát triển năng lực sinh viên)
// -----------------------------------------------------------------------------
export const STUDENT_CAPABILITY_GROUPS: StudentCapabilityGroup[] = [
  {
    id: 'hard-skills',
    category: 'NĂNG LỰC KỸ THUẬT & PHƯƠNG PHÁP',
    title: 'Nhóm Kỹ Năng Cứng (Hard Skills)',
    description: 'BK-IC định hướng trang bị cho sinh viên phương pháp tư duy có hệ thống để chuyển hóa các vấn đề kỹ thuật thành giải pháp công nghệ cụ thể.',
    icon: Cpu,
    skills: [
      'Tư duy và hình thành ý tưởng khởi nghiệp từ các bài toán thực tiễn',
      'Phương pháp phát triển, sàng lọc và thẩm định tính khả thi của ý tưởng',
      'Cách thức xây dựng nguyên mẫu thử nghiệm (Prototype / MVP)',
      'Tư duy quản trị và lộ trình phát triển dự án khởi nghiệp công nghệ'
    ]
  },
  {
    id: 'soft-skills',
    category: 'NĂNG LỰC GIAO TIẾP & THUYẾT PHỤC',
    title: 'Nhóm Kỹ Năng Mềm (Soft Skills)',
    description: 'Tập trung rèn luyện bản lĩnh trình bày, kỹ năng truyền tải giá trị cốt lõi và khả năng phản biện bảo vệ dự án trước hội đồng chuyên môn.',
    icon: Mic,
    skills: [
      'Kỹ năng Pitching dự án trước hội đồng cố vấn và nhà đầu tư',
      'Kỹ năng thuyết trình mạch lạc, làm chủ sân khấu và thời lượng',
      'Kỹ năng truyền tải và thuyết phục người nghe về tính ứng dụng của giải pháp',
      'Kỹ năng làm nổi bật giá trị cốt lõi và giải quyết phản biện thực tế'
    ]
  }
];

// -----------------------------------------------------------------------------
// 3. WHY PARTNER WITH BK-IC (Lợi ích dành cho đối tác - Trọng tâm: Nhân lực trẻ)
// -----------------------------------------------------------------------------
export const WHY_PARTNER_CARDS: PartnershipValueItem[] = [
  {
    id: 'young-talent',
    title: 'Tiếp cận nguồn nhân lực trẻ Bách khoa',
    description: 'BK-IC tạo không gian kết nối trực tiếp với cộng đồng sinh viên Trường ĐH Bách khoa – ĐHĐN; giúp đối tác mở rộng cơ hội gặp gỡ sinh viên có nền tảng kỹ thuật tốt, tư duy chủ động, đam mê giải quyết vấn đề và tìm kiếm những góc nhìn sáng tạo từ thế hệ kỹ sư trẻ.',
    icon: Users,
    badge: 'GIÁ TRỊ TRỌNG TÂM',
    isPrimary: true
  },
  {
    id: 'expert-knowledge',
    title: 'Kết nối tri thức chuyên môn',
    description: 'Tạo cơ hội phối hợp cùng đội ngũ giảng viên, nhà nghiên cứu và các chuyên gia cố vấn trong khuôn viên trường trong các hoạt động trao đổi tri thức và tọa đàm khoa học.',
    icon: GraduationCap,
    badge: 'KẾT NỐI HỌC THUẬT'
  },
  {
    id: 'real-problems',
    title: 'Thúc đẩy sáng tạo từ bài toán thực tế',
    description: 'Mang đến những đề bài, bài toán kỹ thuật hoặc nhu cầu tự động hóa thực tế của doanh nghiệp để sinh viên cùng nghiên cứu, thử nghiệm những góc nhìn giải pháp mới.',
    icon: Target,
    badge: 'ỨNG DỤNG THỰC TIỄN'
  },
  {
    id: 'academic-branding',
    title: 'Lan tỏa thương hiệu học thuật & tuyển dụng',
    description: 'Gắn kết hình ảnh trách nhiệm xã hội và thương hiệu tuyển dụng của Quý đối tác trong các hoạt động đổi mới sáng tạo, workshop chuyên môn và các cuộc thi sinh viên.',
    icon: Sparkles,
    badge: 'TRÁCH NHIỆM XÃ HỘI'
  }
];

// -----------------------------------------------------------------------------
// 4. 7 OFFICIAL PARTNERSHIP FORMS (7 Hình thức hợp tác chính thức)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_OPPORTUNITIES: PartnershipOpportunityItem[] = [
  {
    id: 'opp-financial-sponsor',
    typeKey: 'financial_sponsor',
    title: 'Tài trợ tài chính',
    description: 'Đồng hành về nguồn kinh phí nhằm hỗ trợ công tác tổ chức các sự kiện học thuật, chuỗi workshop tập huấn và các cuộc thi sáng tạo của câu lạc bộ.',
    targetAudience: 'Doanh nghiệp, quỹ đầu tư, cựu sinh viên doanh nhân và các tổ chức hỗ trợ.',
    partnerBenefits: [
      'Gắn kết hình ảnh thương hiệu trong các ấn phẩm truyền thông chính thức của chương trình',
      'Đại diện tham dự, phát biểu hoặc trao giải tại các sân khấu sự kiện',
      'Đóng góp thiết thực vào việc tạo sân chơi bổ ích cho thế hệ kỹ sư tương lai'
    ],
    icon: Trophy,
    badge: 'HỖ TRỢ KINH PHÍ'
  },
  {
    id: 'opp-in-kind-sponsor',
    typeKey: 'in_kind_sponsor',
    title: 'Tài trợ hiện vật',
    description: 'Hỗ trợ trang thiết bị kỹ thuật, phần mềm bản quyền, không gian làm việc/lab, học bổng chuyên môn, quà tặng hoặc các nguồn lực thực tế cho sinh viên.',
    targetAudience: 'Doanh nghiệp công nghệ, đơn vị cung cấp giải pháp và các đơn vị giáo dục.',
    partnerBenefits: [
      'Giới thiệu sản phẩm, công cụ công nghệ đến đúng đối tượng sinh viên kỹ thuật',
      'Được vinh danh đơn vị tài trợ hiện vật trên các kênh truyền thông chính thức',
      'Hỗ trợ trực tiếp cho các đội thi và nhóm dự án hoàn thiện sản phẩm'
    ],
    icon: PackageCheck,
    badge: 'TRANG THIẾT BỊ & NGUỒN LỰC'
  },
  {
    id: 'opp-expert-mentoring',
    typeKey: 'expert_mentoring',
    title: 'Cố vấn chuyên môn',
    description: 'Kết nối các chuyên gia, mentor, cựu sinh viên và giảng viên tham gia chia sẻ kinh nghiệm, định hướng dự án và hướng dẫn sinh viên phát triển ý tưởng.',
    targetAudience: 'Chuyên gia công nghệ, nhà sáng lập startup, mentor độc lập và giảng viên.',
    partnerBenefits: [
      'Chia sẻ kinh nghiệm thực tiễn và truyền cảm hứng đổi mới sáng tạo cho sinh viên',
      'Trực tiếp tương tác và phát hiện những bạn trẻ tài năng, có tư duy sắc bén',
      'Mở rộng mạng lưới kết nối cùng hội đồng cố vấn và chuyên gia trong hệ sinh thái'
    ],
    icon: Lightbulb,
    badge: 'CỐ VẤN & MENTORING'
  },
  {
    id: 'opp-business-challenge',
    typeKey: 'business_challenge',
    title: 'Kết nối bài toán doanh nghiệp',
    description: 'Doanh nghiệp đưa ra các đề bài, bài toán kỹ thuật hoặc nhu cầu tự động hóa thực tế để sinh viên cùng nghiên cứu, xây dựng mô hình giải pháp.',
    targetAudience: 'Doanh nghiệp sản xuất, công ty công nghệ và các đơn vị có nhu cầu R&D.',
    partnerBenefits: [
      'Tiếp cận các ý tưởng sáng tạo và góc nhìn giải pháp tươi mới từ sinh viên',
      'Khảo sát các phương án kỹ thuật mẫu (PoC / MVP) với góc nhìn đa chiều',
      'Kết nối trực tiếp nhóm sinh viên có niềm đam mê sâu với lĩnh vực của doanh nghiệp'
    ],
    icon: Target,
    badge: 'BÀI TOÁN THỰC TIỄN'
  },
  {
    id: 'opp-startup-project',
    typeKey: 'startup_project',
    title: 'Hợp tác dự án khởi nghiệp',
    description: 'Phối hợp đồng hành cùng các nhóm ý tưởng và dự án sinh viên tiềm năng trong quá trình hoàn thiện mô hình, chế tạo mẫu thử và định hướng tương lai.',
    targetAudience: 'Vườn ươm doanh nghiệp, nhà đầu tư thiên thần, quỹ khởi nghiệp và doanh nhân.',
    partnerBenefits: [
      'Đồng hành sớm cùng các dự án công nghệ sinh viên tiềm năng từ giai đoạn phôi thai',
      'Góp phần ươm mầm và định hình các sáng kiến công nghệ có giá trị ứng dụng cao',
      'Tạo tiền đề cho các hợp tác chuyển giao hoặc đầu tư sâu hơn trong tương lai'
    ],
    icon: Rocket,
    badge: 'ƯƠM TẠO DỰ ÁN'
  },
  {
    id: 'opp-media-cooperation',
    typeKey: 'media_cooperation',
    title: 'Hợp tác truyền thông',
    description: 'Phối hợp bảo trợ truyền thông, đồng phát động và lan tỏa thông tin các chương trình, cuộc thi đổi mới sáng tạo đến đông đảo bạn trẻ.',
    targetAudience: 'Kênh thông tin công nghệ, trang tin sinh viên, câu lạc bộ và đối tác truyền thông.',
    partnerBenefits: [
      'Mở rộng độ phủ sóng thông tin đến cộng đồng sinh viên Trường ĐH Bách khoa – ĐHĐN',
      'Cùng nhau lan tỏa các thông điệp tích cực về khởi nghiệp và chuyển đổi số',
      'Đặt logo và thông tin đơn vị bảo trợ truyền thông trên các ấn phẩm chính thức'
    ],
    icon: Share2,
    badge: 'LAN TỎA THÔNG ĐIỆP'
  },
  {
    id: 'opp-academic-exchange',
    typeKey: 'academic_exchange',
    title: 'Hợp tác học thuật',
    description: 'Kết nối các viện, trường, khoa chuyên môn và đơn vị nghiên cứu trong các hoạt động trao đổi tri thức, tọa đàm công nghệ và định hướng học thuật.',
    targetAudience: 'Các khoa chuyên ngành thuộc DUT, viện nghiên cứu, trường đại học đối tác.',
    partnerBenefits: [
      'Gắn kết phong trào sinh viên với hoạt động học thuật và nghiên cứu ứng dụng',
      'Phối hợp tổ chức các buổi tọa đàm, seminar chuyên đề cùng giảng viên và sinh viên',
      'Tạo môi trường thực hành phương pháp nghiên cứu và phát triển công nghệ'
    ],
    icon: GraduationCap,
    badge: 'TRAO ĐỔI TRI THỨC'
  }
];

// -----------------------------------------------------------------------------
// 5. VERIFIED REAL CLUB ACTIVITIES (Năng lực & Kinh nghiệm thực tế đã xác nhận)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_STORIES: PartnershipStoryItem[] = [
  {
    id: 'story-bkshark',
    partnerName: 'Đoàn Thanh niên – Hội Sinh viên Trường ĐH Bách khoa',
    activityTitle: 'Cuộc thi Khởi nghiệp trong Sinh viên – BK SHARK 2026',
    category: 'Đồng tổ chức Sân chơi Khởi nghiệp',
    objective: 'BK-IC là đơn vị đồng tổ chức cuộc thi thường niên nhằm tạo sân chơi thực chiến, hỗ trợ các nhóm sinh viên phát triển ý tưởng kinh doanh công nghệ.',
    outcome: 'Thu hút 35 đội thi với hơn 140 sinh viên từ 6 trường đại học trên địa bàn Đà Nẵng, chuỗi 4 buổi đào tạo chuyên sâu và Sân khấu Chung kết vinh danh Top 7 dự án xuất sắc.',
    quote: 'Sự nhiệt huyết và năng lực công nghệ của các bạn trẻ Bách khoa là minh chứng rõ nét cho tiềm năng đổi mới sáng tạo của sinh viên Đà Nẵng.',
    quoteAuthor: 'Ban Giám khảo Chung kết BK SHARK 2026'
  },
  {
    id: 'story-lienchieu-cds',
    partnerName: 'Đoàn TNCS Hồ Chí Minh Phường Liên Chiểu',
    activityTitle: 'Cuộc thi Ý tưởng Sáng tạo Chuyển đổi số Thanh niên Liên Chiểu 2026',
    category: 'Đồng hành Tổ chức Phong trào Địa phương',
    objective: 'BK-IC đồng hành tổ chức cuộc thi với chủ đề "Thanh niên Liên Chiểu – Sáng tạo vì cuộc sống", hỗ trợ tập huấn và định hướng các dự án công nghệ phục vụ cộng đồng.',
    outcome: 'Đồng hành tập huấn chuyên sâu cho các đội thi về phương pháp phát triển sản phẩm, kỹ năng pitching và hoàn thiện giải pháp chuyển đổi số gắn với cải cách hành chính.'
  }
];

// -----------------------------------------------------------------------------
// 6. NETWORK ECOSYSTEM GROUPS (Mạng lưới kết nối thay thế logo giả định)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_ECOSYSTEM_GROUPS: PartnershipEcosystemGroup[] = [
  {
    id: 'eco-lecturers',
    name: 'Giảng viên & Nhà khoa học DUT',
    role: 'Cố vấn Chuyên môn & Định hướng Nghiên cứu',
    description: 'Đội ngũ thầy cô giàu kinh nghiệm tại các khoa chuyên môn luôn sẵn sàng đồng hành, góp ý chuyên môn và bảo trợ học thuật cho các sáng kiến sinh viên.',
    icon: GraduationCap,
    tag: 'HỌC THUẬT & NGHIÊN CỨU'
  },
  {
    id: 'eco-faculties',
    name: 'Các Khoa, Phòng ban & Viện thuộc Trường',
    role: 'Bảo trợ Đơn vị & Cơ sở Vật chất',
    description: 'Sự ủng hộ từ Nhà trường, các khoa kỹ thuật và phòng ban chức năng tạo nền tảng vững chắc về phòng học, thiết bị và điều kiện tổ chức hoạt động.',
    icon: Building,
    tag: 'ĐƠN VỊ TRỰC THUỘC'
  },
  {
    id: 'eco-youth-union',
    name: 'Đoàn Thanh niên – Hội Sinh viên',
    role: 'Chỉ đạo Phong trào & Kết nối Sinh viên',
    description: 'Đơn vị bảo trợ chính trị và chỉ đạo trực tiếp, hỗ trợ lan tỏa hoạt động sâu rộng đến toàn thể cộng đồng sinh viên Bách khoa.',
    icon: Users,
    tag: 'PHONG TRÀO THANH NIÊN'
  },
  {
    id: 'eco-enterprises',
    name: 'Doanh nghiệp Công nghệ & Sản xuất',
    role: 'Đối tác Thực tiễn & Đặt hàng Bài toán',
    description: 'Mạng lưới các công ty phần mềm, tự động hóa và doanh nghiệp sản xuất quan tâm đến nguồn nhân lực kỹ sư trẻ và giải pháp đổi mới sáng tạo.',
    icon: Briefcase,
    tag: 'DOANH NGHIỆP'
  },
  {
    id: 'eco-mentors',
    name: 'Chuyên gia, Mentor & Startup Founders',
    role: 'Cố vấn Thực chiến & Phản biện Ý tưởng',
    description: 'Các cựu sinh viên thành đạt, doanh nhân và cố vấn khởi nghiệp nhiệt huyết chia sẻ bài học thương trường và kỹ năng thuyết phục nhà đầu tư.',
    icon: Lightbulb,
    tag: 'MENTOR & KHỞI NGHIỆP'
  },
  {
    id: 'eco-student-clubs',
    name: 'Các Câu lạc bộ Học thuật & Sáng tạo',
    role: 'Mạng lưới Đồng hành & Giao lưu',
    description: 'Kết nối liên kết với các CLB chuyên môn, CLB học thuật trong và ngoài trường nhằm chia sẻ nguồn lực và cùng nhau tổ chức các sân chơi lớn.',
    icon: Layers,
    tag: 'CỘNG ĐỒNG SINH VIÊN'
  },
  {
    id: 'eco-universities',
    name: 'Các Cơ sở Giáo dục & Viện Nghiên cứu',
    role: 'Trao đổi Tri thức & Mở rộng Tương lai',
    description: 'BK-IC duy trì kết nối cởi mở với sinh viên và các đơn vị nghiên cứu thuộc Đại học Đà Nẵng, hướng tới mở rộng giao lưu trong tương lai.',
    icon: Compass,
    tag: 'GIAO LƯU LIÊN KẾT'
  }
];

// -----------------------------------------------------------------------------
// 7. 4-STEP PARTNERSHIP PROCESS (Quy trình phối hợp tinh gọn)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_PROCESS_STEPS: PartnershipStepItem[] = [
  {
    step: 1,
    title: 'Tiếp nhận đề xuất',
    description: 'Đối tác hoặc cá nhân điền thông tin và tóm tắt nội dung mong muốn hợp tác qua biểu mẫu trực tuyến trên website.',
    detail: 'Hệ thống tự động ghi nhận, cấp mã tham chiếu và gửi email xác nhận đã tiếp nhận đến Quý đối tác.'
  },
  {
    step: 2,
    title: 'Trao đổi sơ bộ',
    description: 'Ban Chủ nhiệm CLB BK-IC tiếp nhận thông tin, xem xét tính phù hợp và chủ động liên hệ phản hồi qua email hoặc số điện thoại đại diện.',
    detail: 'Thảo luận về mục tiêu chung, nguồn lực phối hợp và lịch trình hoạt động phù hợp của hai bên.'
  },
  {
    step: 3,
    title: 'Thống nhất nội dung',
    description: 'Hai bên tiến hành làm việc chi tiết về phương án triển khai, phân công trách nhiệm và lập kế hoạch phối hợp cụ thể.',
    detail: 'Báo cáo xin ý kiến Đoàn trường – Hội Sinh viên và tiến hành ký kết biên bản ghi nhớ (nếu có yêu cầu).'
  },
  {
    step: 4,
    title: 'Triển khai & Đánh giá',
    description: 'Phối hợp thực hiện chương trình theo kế hoạch đã thống nhất, đảm bảo giá trị thiết thực cho sinh viên và cộng đồng.',
    detail: 'Tổng kết kết quả đạt được, ghi nhận đóng góp của đối tác và duy trì mối quan hệ hợp tác lâu dài.'
  }
];

// -----------------------------------------------------------------------------
// 8. 7 FAQS (Hỏi đáp hợp tác)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_FAQS: PartnershipFAQItem[] = [
  {
    id: 'faq-1',
    question: 'Những đơn vị, cá nhân nào có thể gửi đề xuất hợp tác cùng BK-IC?',
    answer: 'BK-IC hoan nghênh và sẵn sàng kết nối cùng các doanh nghiệp, nhà tài trợ, chuyên gia, mentor, cựu sinh viên, giảng viên, tổ chức giáo dục cũng như các bạn sinh viên, cá nhân có ý tưởng đổi mới sáng tạo mong muốn đồng hành cùng câu lạc bộ.'
  },
  {
    id: 'faq-2',
    question: 'BK-IC hiện có những hình thức hợp tác chính thức nào?',
    answer: 'BK-IC hiện có 7 hình thức hợp tác chính thức: (1) Tài trợ tài chính; (2) Tài trợ hiện vật; (3) Cố vấn chuyên môn; (4) Kết nối bài toán doanh nghiệp; (5) Hợp tác dự án khởi nghiệp; (6) Hợp tác truyền thông; (7) Hợp tác học thuật.'
  },
  {
    id: 'faq-3',
    question: 'Doanh nghiệp có thể đặt đề bài thực tế cho sinh viên Bách khoa không?',
    answer: 'Có. BK-IC rất khuyến khích các bài toán kỹ thuật hoặc vận hành từ doanh nghiệp. Câu lạc bộ sẽ hỗ trợ đưa bài toán vào các cuộc thi sáng tạo, các buổi sinh hoạt chuyên môn hoặc kết nối trực tiếp với các nhóm sinh viên có chuyên ngành phù hợp để cùng nghiên cứu giải pháp.'
  },
  {
    id: 'faq-4',
    question: 'Quy trình tiếp nhận và phản hồi đề xuất diễn ra như thế nào?',
    answer: 'Sau khi Quý đơn vị gửi đề xuất qua biểu mẫu trực tuyến, Ban Chủ nhiệm BK-IC sẽ tiếp nhận, đối chiếu kế hoạch hoạt động của câu lạc bộ và chủ động liên hệ phản hồi lại theo số điện thoại hoặc email đại diện để trao đổi phương án phối hợp chi tiết.'
  },
  {
    id: 'faq-5',
    question: 'BK-IC có thể hỗ trợ doanh nghiệp tiếp cận nguồn nhân lực sinh viên như thế nào?',
    answer: 'BK-IC là cầu nối giúp doanh nghiệp tiếp cận nguồn nhân lực trẻ giàu tiềm năng từ Trường ĐH Bách khoa – ĐHĐN thông qua các buổi workshop chuyên môn, ngày hội hướng nghiệp, các cuộc thi sáng tạo công nghệ và kênh truyền thông sinh viên chính thức của CLB.'
  },
  {
    id: 'faq-6',
    question: 'Các thỏa thuận hợp tác có cần ký kết văn bản chính thức không?',
    answer: 'Tùy theo quy mô và tính chất chương trình, BK-IC sẽ báo cáo Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa để xây dựng Biên bản ghi nhớ (MOU) hoặc kế hoạch phối hợp nhằm đảm bảo tính minh bạch và đúng quy định của Nhà trường.'
  },
  {
    id: 'faq-7',
    question: 'Tôi có thể gửi kèm tài liệu đề xuất hoặc hồ sơ năng lực không?',
    answer: 'Được. Trong biểu mẫu đề xuất hợp tác trực tuyến, Quý đơn vị có thể điền đường dẫn tài liệu đính kèm (như liên kết Google Drive, OneDrive hoặc trang giới thiệu) để Ban Chủ nhiệm tiện theo dõi thông tin đầy đủ nhất.'
  }
];

// -----------------------------------------------------------------------------
// 9. OFFICIAL CONTACT INFO (Thông tin liên hệ chính thức đã xác thực)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_CONTACT_INFO = {
  organization: 'Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo (BK-IC)',
  parent: 'Trường Đại học Bách khoa – Đại học Đà Nẵng',
  address: 'Phòng A136, Trường Đại học Bách khoa – ĐHĐN, 54 Nguyễn Lương Bằng, Q. Liên Chiểu, TP. Đà Nẵng',
  email: 'bkic.dut@gmail.com',
  fanpageUrl: 'https://www.facebook.com/dut.bkic',
  fanpageName: 'BK-IC - BachKhoa Innovation and Entrepreneurship Club',
  website: 'https://bkic.dut.udn.vn'
};
