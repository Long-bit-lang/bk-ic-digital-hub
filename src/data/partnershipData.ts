// BK-IC Digital Hub — Partnership Data & Configurations
// Strictly verified club metrics, real partners, and official copy
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
  CheckCircle2
} from 'lucide-react';

export interface PartnershipValueItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  badge: string;
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

export interface PartnershipFAQItem {
  id: string;
  question: string;
  answer: string;
}

// -----------------------------------------------------------------------------
// 1. STATS: Strictly verified data from DB, activities & partners
// -----------------------------------------------------------------------------
export const PARTNERSHIP_STATS: PartnershipStatItem[] = [
  {
    id: 'members',
    numericValue: 31,
    suffix: '',
    label: 'Thành viên nòng cốt',
    description: 'Sinh viên kỹ thuật Bách khoa nhiệt huyết thuộc BCN, Chuyên môn, Đối ngoại & Truyền thông'
  },
  {
    id: 'partners',
    numericValue: 10,
    suffix: '+',
    label: 'Đối tác & Đơn vị đồng hành',
    description: 'Đơn vị bảo trợ, viện nghiên cứu, doanh nghiệp công nghệ và vườn ươm khởi nghiệp'
  },
  {
    id: 'competitions',
    numericValue: 6,
    suffix: '',
    label: 'Cuộc thi & Sân chơi sáng tạo',
    description: 'Giải đấu công nghệ, hackathon và vườn ươm BK Shark kết nối sinh viên toàn trường'
  },
  {
    id: 'projects',
    numericValue: 3,
    suffix: '',
    label: 'Dự án ươm tạo đồng hành',
    description: 'Các sáng kiến công nghệ và giải pháp thực tế đang được bảo trợ phát triển'
  }
];

// -----------------------------------------------------------------------------
// 2. WHY PARTNER WITH BK-IC (4 Value Cards)
// -----------------------------------------------------------------------------
export const WHY_PARTNER_CARDS: PartnershipValueItem[] = [
  {
    id: 'young-talent',
    title: 'Tiếp cận nguồn nhân lực trẻ',
    description: 'Kết nối doanh nghiệp với cộng đồng sinh viên Bách khoa Đà Nẵng có định hướng công nghệ, tư duy sáng tạo và mong muốn phát triển năng lực thực tiễn.',
    icon: Users,
    badge: 'NHÂN LỰC CHẤT LƯỢNG CAO'
  },
  {
    id: 'innovation-coop',
    title: 'Đồng hành cùng hoạt động đổi mới sáng tạo',
    description: 'Có cơ hội đồng hành trong các workshop, cuộc thi và chương trình phát triển ý tưởng dành cho sinh viên công nghệ giàu tiềm năng.',
    icon: Rocket,
    badge: 'HỆ SINH THÁI KHỞI NGHIỆP'
  },
  {
    id: 'real-problems',
    title: 'Đặt bài toán thực tiễn',
    description: 'Tạo cơ hội để doanh nghiệp chia sẻ những bài toán thực tế, từ đó kết nối với sinh viên và các nhóm dự án có định hướng giải quyết vấn đề.',
    icon: Target,
    badge: 'ỨNG DỤNG THỰC TẾ'
  },
  {
    id: 'community-knowledge',
    title: 'Kết nối tri thức và trách nhiệm cộng đồng',
    description: 'Phối hợp cùng nhà trường và cộng đồng trong các hoạt động đào tạo, chia sẻ chuyên môn và thúc đẩy tinh thần đổi mới sáng tạo vì sự phát triển chung.',
    icon: GraduationCap,
    badge: 'LAN TỎA TRI THỨC'
  }
];

// -----------------------------------------------------------------------------
// 3. 6 PARTNERSHIP OPPORTUNITIES (Canonical Backend Mapping)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_OPPORTUNITIES: PartnershipOpportunityItem[] = [
  {
    id: 'opp-sponsor',
    typeKey: 'sponsor',
    title: 'Tài trợ',
    description: 'Đồng hành về nguồn lực để tổ chức workshop, cuộc thi, chương trình đổi mới sáng tạo và vườn ươm BK Shark.',
    targetAudience: 'Doanh nghiệp, quỹ đầu tư, tổ chức hỗ trợ khởi nghiệp.',
    partnerBenefits: [
      'Hiện diện thương hiệu tại chương trình và ấn phẩm truyền thông phù hợp',
      'Kết nối trực tiếp với cộng đồng sinh viên công nghệ tài năng',
      'Đồng hành thúc đẩy các dự án đổi mới sáng tạo tiềm năng'
    ],
    icon: Trophy,
    badge: 'NGUỒN LỰC PHÁT TRIỂN'
  },
  {
    id: 'opp-expert',
    typeKey: 'expert_mentoring',
    title: 'Đồng hành chuyên môn',
    description: 'Tham gia với vai trò mentor, diễn giả, chuyên gia phản biện hoặc cố vấn kỹ thuật/kinh doanh cho các dự án.',
    targetAudience: 'Chuyên gia, doanh nhân, nhà sáng lập startup, giảng viên.',
    partnerBenefits: [
      'Chia sẻ kinh nghiệm thực tiễn và truyền cảm hứng khởi nghiệp',
      'Kết nối sâu với các nhóm dự án nghiên cứu ứng dụng',
      'Góp phần nâng cao chất lượng nguồn nhân lực trẻ'
    ],
    icon: Lightbulb,
    badge: 'CỐ VẤN & MENTORING'
  },
  {
    id: 'opp-problem',
    typeKey: 'problem_solving',
    title: 'Đặt hàng bài toán',
    description: 'Doanh nghiệp chia sẻ bài toán thực tiễn để sinh viên nghiên cứu và đề xuất giải pháp công nghệ khả thi.',
    targetAudience: 'Doanh nghiệp và tổ chức có nhu cầu R&D và đổi mới sáng tạo.',
    partnerBenefits: [
      'Tiếp cận các ý tưởng sáng tạo và góc nhìn đa chiều từ sinh viên kỹ thuật',
      'Kết nối trực tiếp nhóm sinh viên quan tâm sâu đến lĩnh vực chuyên ngành',
      'Tạo cơ hội phát triển thử nghiệm mẫu (PoC / MVP) với chi phí tối ưu'
    ],
    icon: Target,
    badge: 'R&D ĐỔI MỚI SÁNG TẠO'
  },
  {
    id: 'opp-media',
    typeKey: 'media_coop',
    title: 'Truyền thông',
    description: 'Phối hợp truyền thông, đồng tổ chức chương trình hoặc lan tỏa hoạt động đổi mới sáng tạo đến đông đảo bạn trẻ.',
    targetAudience: 'Cơ quan báo chí, kênh truyền thông công nghệ, cộng đồng và các CLB sinh viên.',
    partnerBenefits: [
      'Mở rộng mạng lưới kết nối và tiếp cận hàng ngàn sinh viên ĐHĐN',
      'Phối hợp lan tỏa các nội dung học thuật, công nghệ và khởi nghiệp ý nghĩa',
      'Cùng xây dựng hình ảnh thương hiệu gắn liền với tinh thần học tập'
    ],
    icon: Share2,
    badge: 'LAN TỎA THƯƠNG HIỆU'
  },
  {
    id: 'opp-academic',
    typeKey: 'academic_partner',
    title: 'Học thuật / Nhà trường',
    description: 'Phối hợp cùng khoa, viện, giảng viên và các đơn vị giáo dục để tổ chức hoạt động học thuật, đào tạo và nghiên cứu.',
    targetAudience: 'Các khoa, viện chuyên ngành, trung tâm nghiên cứu, trường đại học đối tác.',
    partnerBenefits: [
      'Tăng cường liên kết học thuật giữa giảng đường và phong trào sinh viên',
      'Chia sẻ nguồn lực phòng lab, trang thiết bị và chuyên môn khoa học',
      'Phối hợp triển khai các công trình nghiên cứu ứng dụng thực tế'
    ],
    icon: GraduationCap,
    badge: 'HỢP TÁC HỌC THUẬT'
  },
  {
    id: 'opp-recruitment',
    typeKey: 'recruitment_partner',
    title: 'Tuyển dụng / Thực tập',
    description: 'Kết nối doanh nghiệp với sinh viên thông qua cơ hội thực tập, tuyển dụng sớm và định hướng nghề nghiệp kỹ thuật.',
    targetAudience: 'Doanh nghiệp công nghệ, công ty sản xuất và các đơn vị tuyển dụng.',
    partnerBenefits: [
      'Tiếp cận sớm nguồn nhân lực sinh viên có tư duy giải quyết vấn đề tốt',
      'Lan tỏa thông tin tuyển dụng và chương trình thực tập sinh đến đúng đối tượng',
      'Xây dựng kênh kết nối trực tiếp với các tài năng công nghệ Bách khoa'
    ],
    icon: Briefcase,
    badge: 'KẾT NỐI NGHỀ NGHIỆP'
  }
];

// -----------------------------------------------------------------------------
// 4. VERIFIED PARTNERSHIP STORIES (Real Club Activities)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_STORIES: PartnershipStoryItem[] = [
  {
    id: 'story-bkshark',
    partnerName: 'Hội đồng Cố vấn & Doanh nhân Khởi nghiệp',
    activityTitle: 'Chương trình Ươm tạo BK SHARK 2026',
    category: 'Cố vấn chuyên môn & Phản biện',
    objective: 'Kết nối các nhóm sinh viên có ý tưởng công nghệ với các chuyên gia, nhà đầu tư để hoàn thiện mô hình kinh doanh và giải pháp kỹ thuật.',
    outcome: 'Quy tụ hơn 10 chuyên gia tham gia cố vấn và phản biện trực tiếp cho các dự án sinh viên triển vọng.',
    quote: 'Tinh thần chủ động và khả năng nắm bắt công nghệ của sinh viên Bách khoa là nền tảng rất tốt để biến ý tưởng thành sản phẩm thực tế.',
    quoteAuthor: 'Hội đồng Cố vấn BK Shark'
  },
  {
    id: 'story-dnes',
    partnerName: 'Vườn ươm Doanh nghiệp Đà Nẵng (DNES)',
    activityTitle: 'Mạng lưới Ươm tạo & Hỗ trợ Khởi nghiệp',
    category: 'Đối tác chiến lược hệ sinh thái',
    objective: 'Hỗ trợ không gian kết nối, tài liệu đào tạo khởi nghiệp đổi mới sáng tạo và cơ hội tham gia các sự kiện trong hệ sinh thái thành phố.',
    outcome: 'Đồng hành tổ chức các buổi đào tạo phương pháp Lean Canvas và hoàn thiện kỹ năng pitching cho các nhóm sinh viên BK-IC.'
  },
  {
    id: 'story-greenenergy',
    partnerName: 'Dự án Sinh thái Xanh & Năng lượng',
    activityTitle: 'Ươm tạo Giải pháp Năng lượng Sạch GreenEnergy',
    category: 'Dự án đồng hành công nghệ',
    objective: 'Nghiên cứu ứng dụng IoT và cảm biến nhằm tối ưu hóa tiêu thụ năng lượng trong các tòa nhà và khuôn viên trường học.',
    outcome: 'Hoàn thiện bản mẫu thử nghiệm (PoC) đầu tiên và đang tiếp tục nhận bảo trợ kỹ thuật từ các cố vấn chuyên môn.'
  }
];

// -----------------------------------------------------------------------------
// 5. 5-STEP PARTNERSHIP PROCESS
// -----------------------------------------------------------------------------
export const PARTNERSHIP_PROCESS_STEPS: PartnershipStepItem[] = [
  {
    step: 1,
    title: 'Gửi đề xuất hợp tác',
    description: 'Đối tác điền thông tin và chia sẻ nhu cầu, định hướng hợp tác qua form trực tuyến trên website.',
    detail: 'Thông tin được tiếp nhận bảo mật và chuyển tiếp trực tiếp đến Ban Đối ngoại BK-IC.'
  },
  {
    step: 2,
    title: 'Ban Chủ nhiệm tiếp nhận',
    description: 'Ban Chủ nhiệm và Ban Đối ngoại xem xét tính khả thi và mức độ phù hợp của nội dung đề xuất.',
    detail: 'Kiểm tra nguồn lực, lịch trình hoạt động và phân công đầu mối phụ trách trao đổi.'
  },
  {
    step: 3,
    title: 'Trao đổi nhu cầu & phương án',
    description: 'Hai bên gặp mặt trực tiếp hoặc trao đổi trực tuyến để làm rõ mục tiêu, phạm vi và quyền lợi.',
    detail: 'Thảo luận kế hoạch phối hợp, phân công trách nhiệm và thống nhất lộ trình triển khai.'
  },
  {
    step: 4,
    title: 'Thống nhất & Triển khai',
    description: 'Ký kết thỏa thuận (nếu có) và bắt đầu triển khai các hạng mục công việc theo kế hoạch đã cam kết.',
    detail: 'Phối hợp nhịp nhàng giữa BCN, các ban chuyên môn và đại diện Quý đối tác.'
  },
  {
    step: 5,
    title: 'Tổng kết & Đánh giá kết quả',
    description: 'Báo cáo tổng kết chương trình, đo lường các giá trị đạt được và duy trì mối quan hệ hợp tác lâu dài.',
    detail: 'Ghi nhận đóng góp của đối tác và đề xuất hướng mở rộng cho các giai đoạn tiếp theo.'
  }
];

// -----------------------------------------------------------------------------
// 6. 7 FAQS (Accessible Accordion)
// -----------------------------------------------------------------------------
export const PARTNERSHIP_FAQS: PartnershipFAQItem[] = [
  {
    id: 'faq-1',
    question: 'Những đơn vị nào có thể hợp tác với BK-IC?',
    answer: 'BK-IC chào đón sự hợp tác từ các doanh nghiệp công nghệ, tập đoàn kinh tế, viện nghiên cứu, trường đại học, vườn ươm, quỹ đầu tư, chuyên gia cố vấn độc lập và các câu lạc bộ, cộng đồng sinh viên có chung mong muốn thúc đẩy tinh thần đổi mới sáng tạo và hỗ trợ thế hệ trẻ.'
  },
  {
    id: 'faq-2',
    question: 'BK-IC hiện có những hình thức hợp tác nào?',
    answer: 'Hiện tại, BK-IC triển khai 6 nhóm hình thức hợp tác chính: (1) Tài trợ sự kiện, workshop và cuộc thi; (2) Đồng hành chuyên môn, cố vấn và phản biện dự án; (3) Doanh nghiệp đặt hàng bài toán thực tế; (4) Phối hợp truyền thông và lan tỏa nội dung; (5) Hợp tác học thuật với khoa, viện và nhà trường; (6) Kết nối cơ hội thực tập và tuyển dụng cho sinh viên.'
  },
  {
    id: 'faq-3',
    question: 'Có cần phải có thỏa thuận hoặc hợp đồng không?',
    answer: 'Tùy thuộc vào quy mô và tính chất hợp tác (như tài trợ lớn, dự án ươm tạo dài hạn hay sự kiện đơn lẻ), BK-IC sẽ phối hợp cùng Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa để xây dựng Biên bản ghi nhớ hợp tác (MOU) hoặc văn bản xác nhận nhằm đảm bảo tính minh bạch, đúng quy định của Nhà trường.'
  },
  {
    id: 'faq-4',
    question: 'Chi phí hợp tác được xác định như thế nào?',
    answer: 'Chi phí và nguồn lực được thảo luận dựa trên nhu cầu thực tế và kế hoạch chi tiết của từng chương trình. Là câu lạc bộ học thuật trực thuộc Đoàn – Hội sinh viên, BK-IC hoạt động theo tôn chỉ phi lợi nhuận, mọi nguồn lực hỗ trợ đều được sử dụng minh bạch và trực tiếp phục vụ cho việc tổ chức hoạt động của sinh viên.'
  },
  {
    id: 'faq-5',
    question: 'Doanh nghiệp có thể đề xuất bài toán cho sinh viên không?',
    answer: 'Hoàn toàn được. BK-IC rất khuyến khích các doanh nghiệp chia sẻ bài toán công nghệ hoặc vận hành thực tế. Câu lạc bộ sẽ hỗ trợ đưa bài toán vào các sân chơi học thuật, hackathon hoặc kết nối trực tiếp với các nhóm sinh viên có chuyên môn phù hợp để nghiên cứu giải pháp khả thi.'
  },
  {
    id: 'faq-6',
    question: 'Có thể mời thành viên BK-IC tham gia hoạt động của doanh nghiệp không?',
    answer: 'Có. Ban Chủ nhiệm luôn sẵn sàng phối hợp kết nối khi doanh nghiệp tổ chức các chương trình Company Tour, Tech Talk, hội thảo chuyên đề hoặc ngày hội hướng nghiệp phù hợp với định hướng phát triển của sinh viên kỹ thuật.'
  },
  {
    id: 'faq-7',
    question: 'Sau khi gửi đề xuất, tôi sẽ được liên hệ như thế nào?',
    answer: 'Sau khi tiếp nhận đề xuất qua hệ thống, Ban Đối ngoại và Ban Chủ nhiệm BK-IC sẽ xem xét nội dung và chủ động liên hệ lại với Quý đơn vị theo số điện thoại hoặc email đã cung cấp trong thời gian sớm nhất để hẹn lịch trao đổi phương án phối hợp chi tiết.'
  }
];

// -----------------------------------------------------------------------------
// 7. OFFICIAL CONTACT INFO
// -----------------------------------------------------------------------------
export const PARTNERSHIP_CONTACT_INFO = {
  organization: 'Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo (BK-IC)',
  parent: 'Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa, Đại học Đà Nẵng',
  address: 'Khu F, Trường Đại học Bách khoa – ĐHĐN, 54 Nguyễn Lương Bằng, Q. Liên Chiểu, TP. Đà Nẵng',
  email: 'bkic.dut@gmail.com',
  fanpageUrl: 'https://www.facebook.com/bkic.dut',
  fanpageName: 'BK-IC - CLB Khởi nghiệp & ĐMST Bách khoa Đà Nẵng',
  website: 'https://bkic.dut.udn.vn'
};

