// BK-IC Digital Hub — Official Companion Projects & Incubation Partnership Data
// Strictly focused on Companion Projects (Dự án đồng hành sinh viên), removing corporate marketing
import {
  Rocket,
  Users,
  Lightbulb,
  Building,
  Target,
  GraduationCap,
  Sparkles,
  Layers,
  Code,
  Mic,
  FileCheck2,
  Cpu,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  Compass,
  Zap,
  Leaf,
  Bot,
  BrainCircuit,
  Boxes,
  HelpCircle
} from 'lucide-react';

export interface CompanionStatItem {
  id: string;
  numericValue: number;
  suffix: string;
  label: string;
  description: string;
}

export interface StudentCapabilityGroup {
  id: string;
  category: string;
  title: string;
  description: string;
  skills: string[];
  icon: any;
}

export interface CompanionBenefitItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: any;
  badge: string;
  isPrimary?: boolean;
}

export interface CompanionCriterionItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  tag: string;
}

export interface CompanionFieldItem {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export interface CompanionStepItem {
  step: number;
  title: string;
  description: string;
  detail: string;
}

export interface CompanionFAQItem {
  id: string;
  question: string;
  answer: string;
}

// -----------------------------------------------------------------------------
// 1. COMPANION STATS (Verified Numbers only - No fake corporate numbers)
// -----------------------------------------------------------------------------
export const COMPANION_PROJECT_STATS: CompanionStatItem[] = [
  {
    id: 'members',
    numericValue: 30,
    suffix: '',
    label: 'Thành viên nòng cốt hỗ trợ',
    description: 'Ban Chủ nhiệm (3), Ban Điều hành (5) và Ban Thành viên (22) sẵn sàng hỗ trợ kỹ thuật, truyền thông và hậu cần cho dự án'
  },
  {
    id: 'teams',
    numericValue: 35,
    suffix: '+',
    label: 'Đội thi đồng hành thực tế',
    description: 'Kinh nghiệm hỗ trợ tập huấn chuyên môn, thẩm định đề tài và đồng hành tranh tài qua mùa giải BK SHARK 2026'
  },
  {
    id: 'fields',
    numericValue: 5,
    suffix: '',
    label: 'Lĩnh vực công nghệ ưu tiên',
    description: 'AI & Phần mềm số, IoT & Tự động hóa, Năng lượng Xanh, Chuyển đổi số địa phương, và Ứng dụng STEAM'
  },
  {
    id: 'free',
    numericValue: 100,
    suffix: '%',
    label: 'Phi lợi nhuận & Vì sinh viên',
    description: 'Mọi hoạt động tư vấn, cố vấn, bảo trợ và kết nối nguồn lực từ BK-IC đều hoàn toàn miễn phí cho sinh viên Bách khoa'
  }
];

// -----------------------------------------------------------------------------
// 2. CAPABILITY ACCELERATION (Định hướng bồi dưỡng năng lực sinh viên)
// -----------------------------------------------------------------------------
export const STUDENT_CAPABILITY_GROUPS: StudentCapabilityGroup[] = [
  {
    id: 'hard-skills',
    category: 'NĂNG LỰC KỸ THUẬT & PHƯƠNG PHÁP',
    title: 'Kỹ Năng Cứng (Hard Skills)',
    description: 'Định hướng phương pháp tư duy có hệ thống để chuyển hóa ý tưởng lý thuyết trong phòng lab thành sản phẩm công nghệ thực tiễn.',
    icon: Cpu,
    skills: [
      'Tư duy và phương pháp xác định bài toán thực tế (Problem-Solution Fit)',
      'Quy trình thiết kế và chế tạo nguyên mẫu thử nghiệm (Prototype / MVP)',
      'Tư duy quản trị lộ trình phát triển và kiểm thử sản phẩm công nghệ',
      'Định hướng ứng dụng công nghệ phù hợp (AI, IoT, Cloud, Vi điều khiển)'
    ]
  },
  {
    id: 'soft-skills',
    category: 'NĂNG LỰC TRÌNH BÀY & THUYẾT PHỤC',
    title: 'Kỹ Năng Mềm (Soft Skills)',
    description: 'Rèn luyện bản lĩnh làm chủ sân khấu, kỹ năng truyền tải giá trị cốt lõi và khả năng bảo vệ dự án trước hội đồng chuyên môn.',
    icon: Mic,
    skills: [
      'Kỹ năng Pitching dự án trước hội đồng cố vấn và nhà đầu tư',
      'Phương pháp thiết kế Pitch Deck chuẩn mực, trực quan và ấn tượng',
      'Kỹ năng truyền tải và thuyết phục người nghe về tính khả thi của giải pháp',
      'Bản lĩnh phản biện khoa học và làm nổi bật giá trị xã hội/thương mại'
    ]
  }
];

// -----------------------------------------------------------------------------
// 3. COMPANION PROJECT BENEFITS (Quyền lợi khi dự án đồng hành cùng BK-IC)
// -----------------------------------------------------------------------------
export const COMPANION_BENEFITS: CompanionBenefitItem[] = [
  {
    id: 'mentoring',
    title: 'Cố vấn Chuyên môn & Thầy cô Hướng dẫn',
    description: 'Dự án được kết nối với các giảng viên giàu chuyên môn tại các khoa thuộc Trường ĐH Bách khoa và các cựu sinh viên doanh nhân, cố vấn khởi nghiệp thực chiến.',
    details: [
      'Góp ý chuyên sâu về kiến trúc giải pháp công nghệ',
      'Định hướng bài toán thị trường và tính ứng dụng thực tế',
      'Hỗ trợ tháo gỡ khó khăn kỹ thuật trong quá trình làm mẫu thử'
    ],
    icon: Lightbulb,
    badge: 'CỐ VẤN CHUYÊN MÔN',
    isPrimary: true
  },
  {
    id: 'workspace',
    title: 'Không gian Sinh hoạt & Hỗ trợ Cơ sở Vật chất',
    description: 'Được ưu tiên sử dụng không gian sinh hoạt và làm việc tại phòng A136 (Khu F, Trường ĐH Bách khoa) để họp nhóm, trao đổi kỹ thuật và thử nghiệm.',
    details: [
      'Không gian làm việc nhóm tiện nghi, có màn hình trình chiếu và bàn làm việc',
      'Môi trường trao đổi học thuật cởi mở cùng các thành viên kỹ thuật khác',
      'Hỗ trợ thủ tục mượn phòng thí nghiệm và trang thiết bị thực hành của trường'
    ],
    icon: Building,
    badge: 'KHÔNG GIAN LÀM VIỆC'
  },
  {
    id: 'pitching',
    title: 'Mài giũa Pitch Deck & Luyện tập Pitching 1-1',
    description: 'Được Ban Chuyên môn BK-IC trực tiếp hỗ trợ rà soát slide thuyết trình, cơ cấu lại nội dung và tổ chức các buổi diễn tập pitching thử trước khi đi thi.',
    details: [
      'Chuẩn hóa cấu trúc Pitch Deck từ 10-12 slide tiêu chuẩn quốc tế',
      'Luyện tập phản xạ trả lời câu hỏi phản biện của hội đồng giám khảo',
      'Tối ưu hóa thời lượng trình bày trong khung 3 - 5 phút'
    ],
    icon: Mic,
    badge: 'HOÀN THIỆN THUYẾT TRÌNH'
  },
  {
    id: 'competition-backing',
    title: 'Bảo trợ Tham gia Các Cuộc thi Lớn',
    description: 'Ưu tiên được BK-IC đề cử, bảo trợ pháp lý và hỗ trợ hồ sơ tham gia Sân khấu Khởi nghiệp BK SHARK, Cuộc thi Đổi mới Sáng tạo Chuyển đổi số và các giải đấu cấp Bộ/Thành phố.',
    details: [
      'Bảo trợ danh nghĩa từ CLB Khởi nghiệp & Đổi mới Sáng tạo trực thuộc Trường',
      'Hỗ trợ hoàn thiện hồ sơ dự thi, video demo và thuyết minh kỹ thuật',
      'Cơ hội tranh tài tại các vòng chung kết lớn có nhà đầu tư và vườn ươm'
    ],
    icon: Rocket,
    badge: 'BẢO TRỢ THI ĐẤU'
  },
  {
    id: 'ecosystem-network',
    title: 'Kết nối Mạng lưới Vườn ươm & Quỹ Hỗ trợ',
    description: 'Các dự án có tiềm năng ứng dụng cao sẽ được BK-IC giới thiệu tới các vườn ươm khởi nghiệp, các quỹ hỗ trợ sinh viên nghiên cứu khoa học để phát triển lâu dài.',
    details: [
      'Giới thiệu tiếp cận hệ sinh thái đổi mới sáng tạo TP. Đà Nẵng',
      'Cơ hội gặp gỡ các nhà đầu tư thiên thần và quỹ ươm tạo hạt giống',
      'Tiền đề để đăng ký tham gia các chương trình ươm tạo chính quy sau tốt nghiệp'
    ],
    icon: Sparkles,
    badge: 'KẾT NỐI HỆ SINH THÁI'
  }
];

// -----------------------------------------------------------------------------
// 4. INTAKE CRITERIA & FOCUS FIELDS (Tiêu chí tuyển chọn & Lĩnh vực ưu tiên)
// -----------------------------------------------------------------------------
export const COMPANION_CRITERIA: CompanionCriterionItem[] = [
  {
    id: 'students-dut',
    title: 'Thành viên là Sinh viên Bách khoa (DUT)',
    description: 'Dự án có ít nhất trưởng nhóm hoặc thành viên nòng cốt đang theo học tại Trường Đại học Bách khoa – ĐHĐN (khuyến khích nhóm đa ngành từ CNTT, Điện tử, Cơ khí, Hóa, Môi trường, Quản lý dự án).',
    icon: GraduationCap,
    tag: 'ĐỐI TƯỢNG'
  },
  {
    id: 'real-problem',
    title: 'Giải quyết Bài toán Cụ thể & Thực tế',
    description: 'Ý tưởng xuất phát từ nhu cầu thực tiễn trong đời sống, quản lý hành chính, chuyển đổi số cộng đồng hoặc giải quyết vấn đề kỹ thuật của doanh nghiệp.',
    icon: Target,
    tag: 'TÍNH ỨNG DỤNG'
  },
  {
    id: 'commitment',
    title: 'Tinh thần Cam kết & Tinh thần Học hỏi',
    description: 'Nhóm tác giả có tinh thần trách nhiệm, chủ động tìm tòi giải pháp, sẵn sàng tiếp thu ý kiến góp ý của hội đồng cố vấn và kiên trì theo đuổi dự án.',
    icon: CheckCircle2,
    tag: 'TINH THẦN ĐỒNG ĐỘI'
  },
  {
    id: 'flexible-stages',
    title: 'Tiếp nhận Mọi Giai đoạn Phát triển',
    description: 'BK-IC sẵn sàng đồng hành từ giai đoạn ý tưởng sơ khai có tính logic, giai đoạn đang thiết kế mẫu thử (PoC), đến giai đoạn đã có sản phẩm chạy thử (MVP).',
    icon: Layers,
    tag: 'GIAI ĐOẠN LINH HOẠT'
  }
];

export const COMPANION_FIELDS: CompanionFieldItem[] = [
  {
    id: 'field-ai-software',
    name: 'Trí tuệ Nhân tạo & Phần mềm Số',
    description: 'Các giải pháp ứng dụng AI, Computer Vision, xử lý ngôn ngữ tự nhiên, ứng dụng Web/App thông minh phục vụ người dùng.',
    icon: BrainCircuit
  },
  {
    id: 'field-iot-robotics',
    name: 'IoT & Tự động hóa – Robotics',
    description: 'Hệ thống nhúng, thiết bị phần cứng thông minh, giải pháp Smart Home/Smart Agriculture, robot và hệ thống giám sát tự động.',
    icon: Bot
  },
  {
    id: 'field-greentech',
    name: 'Công nghệ Xanh & Năng lượng',
    description: 'Các sáng kiến tiết kiệm năng lượng, pin/nguồn sạch, xử lý môi trường, vật liệu thân thiện và kinh tế tuần hoàn.',
    icon: Leaf
  },
  {
    id: 'field-digital-transform',
    name: 'Chuyển đổi số & Cải cách Hành chính',
    description: 'Các nền tảng số hóa quy trình, tiện ích công dân số, giải pháp cho thanh niên và chính quyền số tại địa phương.',
    icon: Zap
  },
  {
    id: 'field-steam-edtech',
    name: 'Giáo dục STEAM & Đời sống Xã hội',
    description: 'Bộ học cụ STEAM, phần mềm hỗ trợ học tập, giải pháp y tế cộng đồng và các sáng kiến có tác động xã hội tích cực.',
    icon: Boxes
  }
];

// -----------------------------------------------------------------------------
// 5. 4-STEP INCUBATION ROADMAP (Quy trình 4 bước đồng hành cùng dự án)
// -----------------------------------------------------------------------------
export const COMPANION_PROCESS_STEPS: CompanionStepItem[] = [
  {
    step: 1,
    title: 'Nộp Hồ sơ Đề xuất Trực tuyến',
    description: 'Đại diện nhóm dự án điền thông tin và đính kèm mô tả ý tưởng hoặc slide giới thiệu qua biểu mẫu trên website.',
    detail: 'Hệ thống tự động ghi nhận, cấp mã tham chiếu hồ sơ và gửi email xác nhận ngay lập tức đến trưởng nhóm.'
  },
  {
    step: 2,
    title: 'Ban Chuyên môn Thẩm định Sơ bộ',
    description: 'Ban Chủ nhiệm và Ban Chuyên môn BK-IC xem xét tính khả thi, bài toán giải quyết và tiềm năng phát triển của đề tài.',
    detail: 'Liên hệ phản hồi nhóm dự án trong vòng vài ngày làm việc để hẹn lịch trao đổi trực tiếp.'
  },
  {
    step: 3,
    title: 'Gặp mặt Trao đổi & Phân công Mentor (Pitch & Match)',
    description: 'Nhóm dự án trình bày trực tiếp (hoặc online) trước Ban Chuyên môn để làm rõ nhu cầu hỗ trợ và mục tiêu giai đoạn.',
    detail: 'Thống nhất kế hoạch đồng hành, phân công mentor hướng dẫn và cấp quyền tiếp cận các tài nguyên hỗ trợ.'
  },
  {
    step: 4,
    title: 'Chính thức Đồng hành & Chinh phục Mục tiêu',
    description: 'Bắt tay vào quá trình ươm tạo: hoàn thiện mẫu thử, rèn luyện kỹ năng pitching và sẵn sàng tham gia các cuộc thi lớn.',
    detail: 'BK-IC luôn theo sát tiến độ, hỗ trợ tháo gỡ khó khăn và đồng hành cùng nhóm đến khi gặt hái kết quả.'
  }
];

// -----------------------------------------------------------------------------
// 6. REAL TRACK RECORD (Minh chứng từ Sân khấu BK SHARK 2026)
// -----------------------------------------------------------------------------
export const COMPANION_TRACK_RECORD = {
  title: 'Minh chứng Năng lực Đồng hành Thực tế — BK SHARK 2026',
  description: 'BK-IC là đơn vị đồng tổ chức Cuộc thi Khởi nghiệp sinh viên BK SHARK 2026 cùng Đoàn Trường ĐH Bách khoa – ĐHĐN. Toàn bộ các đội thi đã được đồng hành đào tạo thực chiến qua 4 buổi training chuyên môn và sân khấu pitching chung kết.',
  highlights: [
    '35 Đội thi với hơn 140 sinh viên từ 6 trường đại học trên địa bàn Đà Nẵng được bồi dưỡng kỹ năng khởi nghiệp',
    'Chuỗi 4 buổi đào tạo chuyên sâu: Thiết kế giải pháp giá trị (TS. Nguyễn Hồng Nguyên), Hoàn thiện MVP, Xây dựng mô hình tài chính, Kỹ năng Pitching đỉnh cao',
    'Vinh danh Top 7 Dự án Công nghệ Xuất sắc tại Vòng Chung kết ngày 16/05/2026: DanangBooth (Quán quân), 4Sight (Á quân), Kizuna Hub (Giải Ba), CarboX.MH, DataStorm, Nexus, WaveX NextGen',
    'Kết nối các dự án tiềm năng với Hội đồng Giám khảo chuyên gia từ Quỹ SHi, Danang Fintech Lab và Sở KH&CN Đà Nẵng'
  ]
};

// -----------------------------------------------------------------------------
// 7. COMPANION PROJECT FAQS (Hỏi đáp dành cho sinh viên & nhóm dự án)
// -----------------------------------------------------------------------------
export const COMPANION_FAQS: CompanionFAQItem[] = [
  {
    id: 'faq-1',
    question: 'Dự án mới chỉ có ý tưởng trên giấy, chưa có sản phẩm mẫu thì có đăng ký được không?',
    answer: 'Hoàn toàn được! BK-IC chào đón các dự án từ giai đoạn ý tưởng sơ khai. Nếu ý tưởng của bạn có tính logic và hướng tới giải quyết một bài toán thực tế cụ thể, Ban Chuyên môn sẽ cùng bạn mài giũa và định hướng các bước tiếp theo để chế tạo mẫu thử (PoC/Prototype).'
  },
  {
    id: 'faq-2',
    question: 'Đăng ký nhận hỗ trợ và đồng hành từ BK-IC có phải đóng phí gì không?',
    answer: 'Không. Toàn bộ hoạt động đồng hành, cố vấn chuyên môn, hỗ trợ luyện tập pitching và kết nối cuộc thi từ CLB Khởi nghiệp & Đổi mới Sáng tạo BK-IC đều hoàn toàn miễn phí (100% phi lợi nhuận) vì mục tiêu phát triển phong trào nghiên cứu, đổi mới sáng tạo trong sinh viên Bách khoa.'
  },
  {
    id: 'faq-3',
    question: 'Tôi chỉ có một mình, chưa có đủ nhóm thì có thể nộp hồ sơ được không?',
    answer: 'Được. Bạn có thể nộp hồ sơ với tư cách cá nhân sáng lập ý tưởng. Khi tham gia sinh hoạt cùng BK-IC, bạn sẽ có cơ hội kết nối với các bạn sinh viên kỹ thuật khác (lập trình viên, thiết kế mạch, cơ khí, kinh tế) để ghép thành một nhóm hoàn chỉnh.'
  },
  {
    id: 'faq-4',
    question: 'Quyền sở hữu trí tuệ của dự án có bị ảnh hưởng khi BK-IC bảo trợ không?',
    answer: 'Không. Toàn bộ quyền sở hữu trí tuệ, mã nguồn, giải pháp kỹ thuật và bản quyền sáng tạo của dự án thuộc 100% về nhóm tác giả. BK-IC đóng vai trò là vườn ươm hỗ trợ sinh viên và không giữ bất kỳ quyền sở hữu thương mại nào đối với ý tưởng của bạn.'
  },
  {
    id: 'faq-5',
    question: 'Sau khi gửi đề xuất qua biểu mẫu, khi nào tôi sẽ nhận được phản hồi?',
    answer: 'Hệ thống sẽ tự động gửi email xác nhận đã tiếp nhận hồ sơ ngay khi bạn nhấn gửi. Sau đó, trong vòng 3 - 5 ngày làm việc, Ban Chuyên môn BK-IC sẽ liên hệ trực tiếp với bạn qua email hoặc số điện thoại để trao đổi sơ bộ và sắp xếp buổi gặp mặt định hướng.'
  },
  {
    id: 'faq-6',
    question: 'Dự án đồng hành có bắt buộc phải tham gia cuộc thi BK Shark không?',
    answer: 'Không bắt buộc, nhưng BK-IC luôn khuyến khích các nhóm tham gia để cọ xát thực tế, hoàn thiện sản phẩm và có cơ hội nhận các giải thưởng giá trị cũng như sự chú ý từ các quỹ đầu tư và vườn ươm lớn.'
  }
];

// -----------------------------------------------------------------------------
// 8. OFFICIAL CONTACT INFO
// -----------------------------------------------------------------------------
export const COMPANION_CONTACT_INFO = {
  unit: 'Ban Chuyên môn & Ươm tạo Dự án • CLB Khởi nghiệp và Đổi mới Sáng tạo BK-IC',
  parent: 'Trường Đại học Bách khoa – Đại học Đà Nẵng',
  location: 'Phòng A136, Trường ĐH Bách khoa – ĐHĐN, 54 Nguyễn Lương Bằng, Q. Liên Chiểu, TP. Đà Nẵng',
  address: 'Phòng A136, Trường ĐH Bách khoa – ĐHĐN, 54 Nguyễn Lương Bằng, Q. Liên Chiểu, TP. Đà Nẵng',
  email: 'bkic.dut@gmail.com',
  website: 'https://bkic.dut.udn.vn',
  fanpageUrl: 'https://www.facebook.com/dut.bkic',
  fanpageName: 'BK-IC - BachKhoa Innovation and Entrepreneurship Club'
};

// -----------------------------------------------------------------------------
// BACKWARD COMPATIBILITY EXPORTS FOR LEGACY TEST HARNESSES
// -----------------------------------------------------------------------------
export const PARTNERSHIP_CONTACT_INFO = COMPANION_CONTACT_INFO;
export const PARTNERSHIP_STATS = COMPANION_PROJECT_STATS;
export const WHY_PARTNER_CARDS = COMPANION_BENEFITS.map(b => ({
  id: b.id,
  title: b.title,
  description: b.description,
  isPrimary: b.id === 'mentorship'
}));
export const PARTNERSHIP_OPPORTUNITIES = COMPANION_FIELDS.map(f => ({
  id: f.id,
  typeKey: f.id,
  title: f.name,
  targetAudience: f.description,
  partnerBenefits: [f.description, 'Đồng hành cố vấn kỹ thuật', 'Bảo lưu 100% bản quyền sáng chế']
}));
export const PARTNERSHIP_STORIES = [
  {
    id: 'story-bkshark',
    category: 'CUỘC THI KHỞI NGHIỆP',
    activityTitle: 'Cuộc thi Khởi nghiệp Sinh viên BK SHARK 2026',
    partnerName: 'Đoàn Trường ĐH Bách khoa – ĐHĐN',
    objective: 'Bồi dưỡng tư duy khởi nghiệp và kỹ năng pitching cho 35 đội thi toàn thành phố.',
    outcome: '35 đội thi với 140 sinh viên hoàn thành xuất sắc chuỗi training và vòng chung kết.',
    quote: 'BK SHARK 2026 là bệ phóng vững chắc để các ý tưởng công nghệ của sinh viên Bách khoa vươn xa.',
    quoteAuthor: 'Ban Tổ chức BK SHARK 2026'
  },
  {
    id: 'story-lienchieu-cds',
    category: 'CHUYỂN ĐỔI SỐ HÀNH CHÍNH',
    activityTitle: 'Cuộc thi Ý tưởng Chuyển đổi số gắn với Cải cách hành chính Liên Chiểu 2026',
    partnerName: 'Đoàn phường Liên Chiểu & LYDINC',
    objective: 'Tư vấn chuyên môn, hoàn thiện prototype và định hướng giải pháp số cho các đội thi.',
    outcome: 'Hỗ trợ các đội thi xây dựng sản phẩm minh họa và bài thuyết trình thực chiến tại chung kết.',
    quote: 'Sự đồng hành của BK-IC đã tiếp thêm động lực lớn cho thanh niên địa phương trong phong trào số hóa.',
    quoteAuthor: 'Đại diện Ban Tổ chức'
  }
];
export const PARTNERSHIP_PROCESS_STEPS = COMPANION_PROCESS_STEPS;
export const PARTNERSHIP_FAQS = COMPANION_FAQS;
export const PARTNERSHIP_ECOSYSTEM_GROUPS: any[] = [];

