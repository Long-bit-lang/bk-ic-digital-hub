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
  location: 'Phòng A136, Trường Đại học Bách khoa (DUT)',
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;TIME=17:30-19:00;TZ=Asia/Ho_Chi_Minh',
  targetAudience: 'Toàn thể thành viên chính thức thuộc 3 Ban: BCN, BĐH, BTV',
  description: 'Lịch sinh hoạt định kỳ nhằm tổng kết các hoạt động, triển khai định hướng mới và phân công nhiệm vụ. Buổi sinh hoạt có thể được thông báo hoãn hoặc hủy nếu Ban Chủ nhiệm có thông báo điều chỉnh.'
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
    title: 'Điểm danh',
    desc: 'Thành viên thực hiện điểm danh số hóa (quét mã QR) để xác thực hiện diện và ghi nhận chuyên cần.'
  },
  {
    step: '02',
    time: '17:45 – 18:15',
    title: 'Tổng kết hoạt động trong thời gian vừa qua',
    desc: 'Cùng nhìn lại các đầu việc đã triển khai, đánh giá kết quả đạt được, những điểm hạn chế cần cải thiện và rút kinh nghiệm thực tiễn.'
  },
  {
    step: '03',
    time: '18:15 – 18:45',
    title: 'Giới thiệu hoạt động sắp tới & Định hướng',
    desc: 'Phổ biến các cơ hội học thuật, cuộc thi khởi nghiệp, workshop và định hướng phát triển chiến lược của câu lạc bộ trong giai đoạn tới.'
  },
  {
    step: '04',
    time: '18:45 – 19:00',
    title: 'Đánh giá & Phân việc cho thành viên',
    desc: 'Thống nhất đầu việc trọng tâm cho tuần tiếp theo, giao nhiệm vụ cụ thể cho từng ban chuyên môn và tiếp nhận phản hồi đóng góp.'
  }
];

export interface WeeklySessionRecap {
  weekNumber: number;
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  coverImage: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  cancellationReason?: string;
  summary: string;
  fullContent: string[];
  highlights: string[];
}

export const WEEKLY_INTERNAL_SESSIONS: WeeklySessionRecap[] = [
  {
    weekNumber: 7,
    id: 'tuan-07',
    title: 'Sinh hoạt Tuần 7: Kiện toàn Nhân sự & Kế hoạch Phát triển Mới',
    subtitle: 'Bầu chọn công bố đội ngũ nhân sự mới và mở ra những định hướng phát triển sắp tới',
    date: '12/11/2026',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/activity_recap_tuan_7.jpg',
    status: 'completed',
    summary: 'Tổng kết hoạt động triển khai, tiến hành kiện toàn tổ chức, bầu chọn và công bố đội ngũ nhân sự mới nòng cốt, đồng thời công bố kế hoạch hoạt động giai đoạn tiếp theo.',
    fullContent: [
      'Tiếp nối chuỗi hoạt động sinh hoạt định kỳ, buổi gặp mặt tuần 7 của đại gia đình BK-IC đã diễn ra với nhiều nội dung quan trọng. Đây không chỉ là dịp để CLB cùng nhìn lại những hoạt động trong thời gian vừa qua mà còn đánh dấu bước chuyển mình mới trong công tác tổ chức và định hướng phát triển sắp tới.',
      'Mở đầu buổi sinh hoạt, các thành viên cùng nhau tổng kết lại những hoạt động đã triển khai trong thời gian qua. Những kết quả đạt được, những điểm còn hạn chế và các vấn đề cần cải thiện đều được nhìn nhận, trao đổi nhằm rút ra kinh nghiệm và nâng cao hiệu quả hoạt động của CLB trong thời gian tới.',
      'Một trong những nội dung trọng tâm của buổi họp là công tác kiện toàn CLB. Thông qua quá trình trao đổi và thống nhất, BK-IC đã tiến hành bầu chọn và công bố đội ngũ nhân sự mới, sẵn sàng đảm nhận những vai trò và nhiệm vụ trong chặng đường tiếp theo. Đây sẽ là lực lượng nòng cốt góp phần duy trì hoạt động, phát huy tinh thần đoàn kết và đưa CLB ngày càng phát triển.',
      'Bên cạnh đó, kế hoạch hoạt động trong thời gian tới cũng đã được công bố với nhiều định hướng và mục tiêu mới. Đây là cơ sở để các thành viên chủ động xây dựng kế hoạch triển khai, phối hợp và cùng đóng góp vào những hoạt động chung của BK-IC.'
    ],
    highlights: [
      'Tổng kết, đánh giá hiệu quả và rút kinh nghiệm các hoạt động đã triển khai',
      'Kiện toàn CLB: bầu chọn và công bố đội ngũ nhân sự mới của câu lạc bộ',
      'Công bố định hướng kế hoạch và mục tiêu hoạt động giai đoạn mới'
    ]
  },
  {
    weekNumber: 6,
    id: 'tuan-06',
    title: 'Sinh hoạt Tuần 6: Ra mắt Website BK-IC V1 & Minigame Halloween',
    subtitle: 'Trải nghiệm điểm danh trực tuyến tại chỗ và bùng nổ năng lượng minigame',
    date: '28/10/2025',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/session_tuan_6.png',
    status: 'completed',
    summary: 'Điểm lại đầu việc trọng tâm, hoàn thiện nhận diện đồng phục, ra mắt thử nghiệm tính năng điểm danh số hóa Version 1 Website BK-IC và chuỗi minigame Halloween kịch tính.',
    fullContent: [
      'Khép lại tuần làm việc thứ 6, đại gia đình BK-IC đã có một buổi sinh hoạt định kỳ ngập tràn năng lượng, vừa nghiêm túc nhìn lại chặng đường vừa qua, vừa bùng nổ với những khoảnh khắc gắn kết đầy tiếng cười.',
      'Mở đầu buổi họp, CLB cùng nhau điểm lại các đầu việc trọng tâm đã và đang triển khai. Những mảnh ghép tiếp theo trong bộ nhận diện và đồng phục tiếp tục được hoàn thiện, sẵn sàng cho một diện mạo chỉn chu và đồng bộ nhất. Các thông tin về hoạt động, triển lãm sắp tới cũng được phổ biến để các thành viên chủ động tham gia.',
      'Điểm nhấn trong buổi gặp mặt tuần này chính là màn ra mắt Version 1 của Website BK-IC – một sản phẩm "cây nhà lá vườn" do chính các thành viên tài năng của BK-IC lên ý tưởng và lập trình. Cả CLB đã trực tiếp trải nghiệm tính năng điểm danh trực tuyến ngay tại chỗ, đồng thời cùng nhau đóng góp những góc nhìn thực tế để đội ngũ kỹ thuật tiếp tục tinh chỉnh.',
      'Sau những giờ làm việc tập trung, không khí căn phòng thực sự bùng nổ với chuỗi minigame mang đậm sắc màu Halloween: tìm kiếm "mật mã Halloween" đầy kịch tính, nối tiếp là màn thử thách "xạ thủ dây su" vô cùng gay cấn nhưng cũng rộn rã tiếng cười.'
    ],
    highlights: [
      'Ra mắt Version 1 Website BK-IC và thử nghiệm điểm danh trực tuyến tại chỗ',
      'Hoàn thiện các mảnh ghép bộ nhận diện thương hiệu và đồng phục CLB',
      'Chuỗi minigame Halloween: tìm mật mã và xạ thủ dây su thắt chặt tình đồng đội'
    ]
  },
  {
    weekNumber: 5,
    id: 'tuan-05',
    title: 'Sinh hoạt Tuần 5: Dấu ấn Cuộc thi CĐS Liên Chiểu & Chúc mừng 20/10',
    subtitle: 'Vinh danh thành tích 1 giải Nhì, 2 giải Khuyến khích và lan tỏa yêu thương',
    date: '21/10/2025',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/session_tuan_5.png',
    status: 'completed',
    summary: 'Tổng kết thành tích đáng tự hào tại Cuộc thi Chuyển đổi số Liên Chiểu với 7/17 đội lọt vào vòng trong, hé lộ định hướng hoạt động mới và gửi tặng những bó hoa tươi thắm chúc mừng ngày 20/10.',
    fullContent: [
      'Buổi sinh hoạt của đại gia đình CLB Khởi nghiệp và Đổi mới sáng tạo BKIC đã diễn ra trọn vẹn với thật nhiều niềm vui và cảm xúc tự hào. Mở đầu chương trình, câu lạc bộ cùng nhìn lại những thành tích đáng nhớ tại cuộc thi "Ý tưởng đổi mới sáng tạo phường Liên Chiểu". Thật vinh dự khi BKIC có đến 7 trên 17 đội tham gia và xuất sắc mang về 1 giải Nhì cùng 2 giải Khuyến khích, minh chứng cho sự nhiệt huyết và năng lực sáng tạo không ngừng của các thành viên.',
      'Bên cạnh những dấu ấn đã đạt được, buổi gặp gỡ còn tiếp thêm lửa cho toàn đội ngũ khi hé lộ những định hướng và kế hoạch hoạt động đầy hứa hẹn trong giai đoạn tiếp theo. Rất nhiều sân chơi học thuật, chương trình ươm tạo dự án cùng các cuộc thi quy mô lớn đang được ban chủ nhiệm ấp ủ chuẩn bị chu đáo để sẵn sàng bùng nổ trong thời gian tới.',
      'Khoảnh khắc ngọt ngào và đáng mong chờ nhất chính là những phút lắng đọng ở cuối chương trình. Nhân dịp 20/10, các chàng trai BKIC đã bí mật chuẩn bị những bó hoa rực rỡ cùng lời chúc chân thành, chúc các bạn nữ luôn xinh đẹp, vui vẻ, hạnh phúc và gặt hái thật nhiều thành công.'
    ],
    highlights: [
      'Vinh danh thành tích: 7/17 đội thi, đạt 1 giải Nhì và 2 giải Khuyến khích',
      'Công bố định hướng ươm tạo dự án và các sân chơi học thuật giai đoạn tới',
      'Khoảnh khắc bất ngờ ấm áp chúc mừng ngày Phụ nữ Việt Nam 20/10'
    ]
  },
  {
    weekNumber: 4,
    id: 'tuan-04',
    title: 'Sinh hoạt Tuần 4: Tạm hoãn tập trung hoàn thiện dự án',
    subtitle: 'Ban Chủ nhiệm thông báo tạm hoãn sinh hoạt định kỳ để hỗ trợ đội thi CĐS Liên Chiểu',
    date: '30/09/2025',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/session_tuan_3.png',
    status: 'cancelled',
    cancellationReason: 'Ban Chủ nhiệm thông báo tạm hoãn sinh hoạt định kỳ tuần 4 nhằm tạo điều kiện cho các thành viên và nhóm dự án tập trung hoàn thiện hồ sơ, mô hình sản phẩm dự thi Vòng Sơ loại Cuộc thi Chuyển đổi số Liên Chiểu 2026.',
    summary: 'Buổi sinh hoạt định kỳ tạm hoãn theo thông báo của Ban Chủ nhiệm nhằm hỗ trợ các nhóm dự án hoàn thiện hồ sơ dự thi.',
    fullContent: [
      'Theo thông báo chính thức từ Ban Chủ nhiệm CLB BK-IC, buổi sinh hoạt định kỳ chiều thứ Ba tuần 4 được tạm hoãn.',
      'Thời gian này được ưu tiên dành cho các nhóm thành viên tập trung hoàn thiện bản mô tả ý tưởng, sơ đồ khối kỹ thuật và sản phẩm/mô hình minh họa để nộp hồ sơ tham gia Cuộc thi Ý tưởng sáng tạo chuyển đổi số thanh niên Liên Chiểu năm 2026 (hạn chót ngày 03/10).',
      'Các ban chuyên môn vẫn tiếp tục hỗ trợ trực tuyến và cố vấn kỹ thuật cho từng nhóm.'
    ],
    highlights: [
      'Thông báo tạm hoãn lịch sinh hoạt từ Ban Chủ nhiệm CLB',
      'Hỗ trợ tập trung các đội thi hoàn thiện hồ sơ dự thi đúng hạn'
    ]
  },
  {
    weekNumber: 3,
    id: 'tuan-03',
    title: 'Sinh hoạt Tuần 3: Mini-Workshop Kinh nghiệm Đi thi & Xây dựng CV',
    subtitle: 'Góc nhìn thực chiến từ ba diễn giả: Lê Tú, Thiện Quốc và Thiên Phú',
    date: '23/09/2025',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/session_tuan_3.png',
    status: 'completed',
    summary: 'Điểm lại hoạt động tuần và tổ chức mini-workshop chia sẻ kinh nghiệm đi thi các sân chơi học thuật cùng cách hoàn thiện hồ sơ CV ấn tượng.',
    fullContent: [
      'Buổi sinh hoạt định kỳ tuần này của BKIC đã diễn ra trong không khí vô cùng sôi nổi. Mở đầu chương trình, Ban Chủ nhiệm đã điểm lại những hoạt động nổi bật của tuần trước, đồng thời cập nhật nhanh thông tin về các sân chơi học thuật, các cuộc thi và chuỗi tập huấn khởi nghiệp đổi mới sáng tạo tiềm năng sắp tới để các bạn kịp thời chuẩn bị.',
      'Điểm nhấn quan trọng nhất của buổi gặp mặt chính là mini-workshop xoay quanh kinh nghiệm đi thi và xây dựng CV với sự chia sẻ từ ba gương mặt quen thuộc: Lê Tú, Thiện Quốc và Thiên Phú.',
      'Tại mini-workshop, anh Lê Tú, Thiện Quốc và Thiên Phú đã mang đến những góc nhìn thực chiến toàn diện cho hành trình chinh phục các cuộc thi: từ định vị đề tài phù hợp với từng cấp độ sân chơi và tận dụng mạng lưới kết nối, tiêu chí đánh giá của ban giám khảo, tính khả thi kỹ thuật đến các lưu ý pháp lý quan trọng khi phát triển dự án.',
      'Khép lại phần chia sẻ là phương pháp luận thực tế về khâu nghiên cứu thị trường, tư duy quản trị nhóm linh hoạt, ứng dụng công nghệ hiệu quả và kỹ năng tối ưu bài thuyết trình để truyền tải trọn vẹn giá trị dự án trong thời gian ngắn nhất.'
    ],
    highlights: [
      'Mini-workshop chuyên đề: Kinh nghiệm đi thi & Xây dựng CV ấn tượng',
      'Chia sẻ từ 3 diễn giả khách mời: Lê Tú, Thiện Quốc, Thiên Phú',
      'Kỹ năng định vị đề tài, nghiên cứu thị trường và tối ưu bài thuyết trình gọi vốn'
    ]
  },
  {
    weekNumber: 2,
    id: 'tuan-02',
    title: 'Sinh hoạt Tuần 2: Sàn giao dịch Co-Founder',
    subtitle: 'Review hoạt động tuần và nhập vai tìm kiếm mảnh ghép khởi nghiệp phù hợp',
    date: '16/09/2025',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/session_tuan_2.png',
    status: 'completed',
    summary: 'Cùng nhau review hoạt động tuần, khám phá các cuộc thi khởi nghiệp và tham gia hoạt động trải nghiệm "Sàn giao dịch Co-Founder" kết nối năng lực đội nhóm.',
    fullContent: [
      'Trong buổi sinh hoạt tuần này, các thành viên đã cùng nhau review và cập nhật lại những thông tin nổi bật trong tuần, đồng thời khám phá thêm nhiều cuộc thi và cơ hội mới dành cho sinh viên đam mê khởi nghiệp, đổi mới sáng tạo.',
      'Đặc biệt, không thể thiếu phần hoạt động trải nghiệm "Sàn giao dịch Co-Founder" – nơi các thành viên được nhập vai, kết nối và tìm kiếm những "mảnh ghép" phù hợp cho một đội nhóm khởi nghiệp.',
      'Thông qua trò chơi, chúng mình có cơ hội hiểu rõ hơn về giá trị và thế mạnh riêng của từng thành viên, vai trò của từng vị trí trong một nhóm dự án, tầm quan trọng của việc lựa chọn Co-Founder phù hợp và cách kết hợp năng lực cá nhân để tạo nên một team khởi nghiệp hiệu quả.',
      'Không chỉ cập nhật kiến thức, mỗi buổi sinh hoạt còn là một cơ hội để kết nối – trải nghiệm – học hỏi và cùng nhau phát triển.'
    ],
    highlights: [
      'Review và cập nhật các thông tin cơ hội, giải đấu khởi nghiệp sinh viên',
      'Trải nghiệm thực chiến mô phỏng "Sàn giao dịch Co-Founder"',
      'Nhận diện thế mạnh cá nhân và phương pháp phối hợp liên ngành hiệu quả'
    ]
  },
  {
    weekNumber: 1,
    id: 'tuan-01',
    title: 'First Meeting: Khởi động Hành trình mới cùng BK-IC',
    subtitle: 'Buổi họp nội bộ đầu tiên chào đón những mảnh ghép mới gia nhập ngôi nhà chung',
    date: '08/09/2025',
    location: 'Phòng khách Khu A, Trường ĐH Bách khoa (DUT)',
    coverImage: '/images/bkic/session_tuan_1.png',
    status: 'completed',
    summary: 'Buổi gặp mặt diễn ra trong không khí vui vẻ, cởi mở với sự hiện diện đông đủ của thành viên, đón tiếp thầy Hải (Đại diện Trung tâm Hỗ trợ sinh viên & QHDN) và minigame BINGO-IC.',
    fullContent: [
      'Chiều ngày 08/09/2025, tại phòng khách khu A, CLB Khởi nghiệp và Đổi mới Sáng tạo (BK-IC) đã tổ chức thành công buổi họp nội bộ đầu tiên, chính thức chào đón những mảnh ghép mới gia nhập ngôi nhà chung.',
      'Buổi gặp mặt diễn ra trong không khí vui vẻ, cởi mở với sự hiện diện đông đủ của toàn thể thành viên. Đặc biệt, BK-IC vinh dự được đón tiếp thầy Hải – đại diện Trung tâm Hỗ trợ sinh viên & Quan hệ doanh nghiệp. Tại đây, thầy cùng Ban Chủ nhiệm đã chia sẻ cụ thể về định hướng hoạt động của CLB trong giai đoạn tới, đồng thời lắng nghe tâm tư, kỳ vọng và những đề xuất hỗ trợ thiết thực cho các ý tưởng, dự án đổi mới sáng tạo của các bạn.',
      'Không khí buổi họp thêm phần gắn kết và bùng nổ năng lượng với mini game BINGO-IC. Những từ khóa đậm chất "Khởi nghiệp – Đổi mới – Sáng tạo" không chỉ mang lại tiếng cười mà còn lan tỏa trọn vẹn tinh thần chủ động, bứt phá của BK-IC.',
      'Chân thành cảm ơn các bạn sinh viên đã tin tưởng, lựa chọn BK-IC làm nơi gửi gắm nhiệt huyết và đồng hành phát triển bản thân. Chúc các bạn một năm hoạt động tràn đầy năng lượng, luôn giữ vững ngọn lửa đam mê để cùng nhau biến những ý tưởng táo bạo thành các dự án thực chiến thành công rực rỡ!'
    ],
    highlights: [
      'Đón tiếp Thầy Hải – Đại diện Trung tâm Hỗ trợ sinh viên & Quan hệ doanh nghiệp',
      'Chia sẻ định hướng hoạt động và lắng nghe kỳ vọng của các bạn thành viên',
      'Gắn kết tinh thần đồng đội với minigame BINGO-IC tràn ngập tiếng cười'
    ]
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
    imageUrl: '/images/bkic/session_tuan_1.png',
    title: 'First Meeting: Chào đón Thành viên Mới',
    caption: 'Gặp gỡ nội bộ chào đón tân thành viên và lắng nghe định hướng từ Thầy Hải (Trung tâm Hỗ trợ sinh viên & QHDN)',
    category: 'Văn hóa CLB',
    date: '08/09/2025'
  },
  {
    id: 'gal-02',
    imageUrl: '/images/bkic/session_tuan_2.png',
    title: 'Sinh hoạt Tuần 2: Sàn giao dịch Co-Founder',
    caption: 'Hoạt động trải nghiệm thực chiến kết nối mảnh ghép khởi nghiệp và khám phá các sân chơi công nghệ',
    category: 'Khởi nghiệp',
    date: 'Tháng 09/2025'
  },
  {
    id: 'gal-03',
    imageUrl: '/images/bkic/session_tuan_3.png',
    title: 'Sinh hoạt Tuần 3: Mini-Workshop Kỹ năng Dự thi',
    caption: 'Góc nhìn thực tế từ diễn giả Lê Tú, Thiện Quốc, Thiên Phú về kỹ năng nghiên cứu đề tài và viết CV',
    category: 'Tập huấn',
    date: 'Tháng 10/2025'
  },
  {
    id: 'gal-04',
    imageUrl: '/images/bkic/session_tuan_5.png',
    title: 'Sinh hoạt Tuần 5: Dấu ấn CĐS Liên Chiểu & 20/10',
    caption: 'Vinh danh 7/17 đội thi đạt giải tại Cuộc thi CĐS Liên Chiểu và khoảnh khắc chúc mừng ngày Phụ nữ Việt Nam',
    category: 'Gắn kết',
    date: 'Tháng 10/2025'
  },
  {
    id: 'gal-05',
    imageUrl: '/images/bkic/session_tuan_6.png',
    title: 'Sinh hoạt Tuần 6: Ra mắt Website BK-IC V1',
    caption: 'Trải nghiệm tính năng điểm danh số hóa Version 1 do thành viên tự phát triển và chuỗi minigame Halloween',
    category: 'Công nghệ',
    date: 'Tháng 10/2025'
  },
  {
    id: 'gal-06',
    imageUrl: '/images/bkic/activity_recap_tuan_7.jpg',
    title: 'Sinh hoạt Tuần 7: Kiện toàn Nhân sự Nhiệm kỳ Mới',
    caption: 'Bầu chọn công bố đội ngũ nhân sự mới nòng cốt và triển khai kế hoạch hoạt động giai đoạn tiếp theo',
    category: 'Kiện toàn CLB',
    date: '12/11/2026'
  }
];

// =============================================================================
// TAB 1B: 6 CỘT MỐC HOẠT ĐỘNG & SỰ KIỆN TRỌNG TÂM CỦA CLB BK-IC NĂM 2026
// (Dữ liệu chính thức từ Bảng tổng hợp Hoạt động BK-IC)
// =============================================================================
export interface ClubMilestoneActivity {
  id: string;
  order: number;
  timeframe: string;
  title: string;
  category: 'Thành lập & Pháp lý' | 'Mạng lưới & Đối ngoại' | 'Cuộc thi & Tập huấn' | 'Nhân sự & Tổ chức' | 'Chuyển đổi số Cộng đồng';
  organizersAndPartners: string[];
  actionsTaken: string[];
  outcomesAndValue: string[];
  coverImage: string;
  detailUrl?: string;
}

export const CLUB_MILESTONE_ACTIVITIES: ClubMilestoneActivity[] = [
  {
    id: 'milestone-06-cds-lienchieu',
    order: 6,
    timeframe: 'Cuối tháng 09 – Tháng 10/2026',
    title: 'Cuộc thi "Ý tưởng Sáng tạo Chuyển đổi số gắn với Cải cách hành chính trong Thanh niên trên địa bàn Phường Liên Chiểu năm 2026"',
    category: 'Chuyển đổi số Cộng đồng',
    organizersAndPartners: [
      'Đoàn phường Liên Chiểu',
      'Phòng Văn hóa - Xã hội phường Liên Chiểu',
      'CLB BK-IC (hỗ trợ chuyên môn & vận hành)',
      'Trung tâm Hỗ trợ SV & QHDN (chỉ đạo/bảo trợ)'
    ],
    actionsTaken: [
      'Phối hợp xây dựng thể lệ cuộc thi, timeline triển khai các vòng thi thực tế.',
      'Soạn thảo kịch bản MC, điều phối nhân sự hậu cần, kỹ thuật hỗ trợ các đội thi.',
      'Đẩy mạnh truyền thông số, thu hút các giải pháp số hóa ứng dụng trực tiếp vào dịch vụ hành chính công tại địa phương.'
    ],
    outcomesAndValue: [
      'Đưa chuyên môn đổi mới sáng tạo và công nghệ của sinh viên gắn liền với thực tiễn cơ sở địa phương.',
      'Mở rộng uy tín, mạng lưới ngoại giao của CLB với khối ban ngành Đoàn thể quận/phường.',
      'Lan tỏa tinh thần Chuyển đổi số thanh niên năm 2026.'
    ],
    coverImage: '/images/bkic/news_digital_transformation_lienchieu.jpg',
    detailUrl: '/activities/competitions/chuyen-doi-so-thanh-nien-lien-chieu-2026'
  },
  {
    id: 'milestone-05-tuyen-thanh-vien',
    order: 5,
    timeframe: '21/08/2026 – 07/09/2026',
    title: 'Tuyển thành viên CLB BK-IC (Năm học 2026 – 2027)',
    category: 'Nhân sự & Tổ chức',
    organizersAndPartners: [
      'Ban Chủ nhiệm CLB BK-IC tự tổ chức'
    ],
    actionsTaken: [
      'Mở cổng đăng ký tuyển thành viên từ ngày 21/08/2026.',
      'Xây dựng bộ ấn phẩm truyền thông, bài viết giới thiệu các ban nòng cốt (Truyền thông, Sự kiện, Kỹ thuật - Dự án).',
      'Tổ chức sàng lọc CV và các vòng phỏng vấn chuyên sâu đánh giá tư duy dự án, kỹ năng mềm.'
    ],
    outcomesAndValue: [
      'Thu hút đông đảo ứng viên từ nhiều ngành thế mạnh (KHDL & AI, SH Y Dược, Công nghệ thông tin, Cơ khí...).',
      'Bổ sung lực lượng nhân sự chất lượng cao để kế thừa và vận hành các dự án lớn của CLB.'
    ],
    coverImage: '/images/bkic/news_first_meeting.jpg',
    detailUrl: '/activities/tuyen-thanh-vien'
  },
  {
    id: 'milestone-04-mou-hub-network',
    order: 4,
    timeframe: 'Năm 2026',
    title: 'Ký kết MOU, gia nhập Mạng lưới Khởi nghiệp Đổi mới sáng tạo HUB Network Đà Nẵng',
    category: 'Mạng lưới & Đối ngoại',
    organizersAndPartners: [
      'HUB Network Đà Nẵng phối hợp với CLB Khởi nghiệp và Đổi mới sáng tạo Bách Khoa (BK-IC)'
    ],
    actionsTaken: [
      'Tham gia ký kết Biên bản ghi nhớ hợp tác (MOU), chính thức gia nhập mạng lưới; kết nối với các CLB về khởi nghiệp, công nghệ và đổi mới sáng tạo tại miền Trung.'
    ],
    outcomesAndValue: [
      'Mở rộng quan hệ hợp tác; tạo cơ hội phối hợp tổ chức workshop, cuộc thi, hoạt động học thuật và dự án về AI, Blockchain, startup; góp phần kết nối sinh viên với doanh nghiệp và chuyên gia.'
    ],
    coverImage: '/images/bkic/bkic_launch.jpg',
    detailUrl: '/partnership'
  },
  {
    id: 'milestone-03-bkshark-2026',
    order: 3,
    timeframe: 'Tháng 05/2026',
    title: 'Cuộc thi Khởi nghiệp Sinh viên "BK SHARK 2026" (kèm Chuỗi 4 buổi tập huấn chuyên sâu)',
    category: 'Cuộc thi & Tập huấn',
    organizersAndPartners: [
      'Đơn vị tổ chức: Trường ĐH Bách khoa, Đoàn Thanh niên - Hội Sinh viên, CLB Khởi nghiệp và Đổi mới sáng tạo (BK-IC)',
      'Đơn vị hỗ trợ & phối hợp: Trung tâm Hỗ trợ SV & QHDN (kết nối chuyên gia/gọi vốn), HUB Network Đà Nẵng'
    ],
    actionsTaken: [
      'Phát động cuộc thi và tiếp nhận ý tưởng dự án từ sinh viên; phối hợp Trung tâm kết nối diễn giả, chuyên gia hàng đầu và kêu gọi hỗ trợ/đầu tư.',
      'Buổi 1 (08h00 ngày 09/05 tại F310): "Thiết kế giải pháp giá trị cho khách hàng" – TS. Nguyễn Hồng Nguyên.',
      'Buổi 2 (08h00 ngày 10/05 tại S02.01): "Nền tảng gọi vốn cộng đồng và tiếp cận khách hàng, kỹ năng Pitching và trả lời câu hỏi BGK" – Diễn giả Lê Đức Nguyên (Founder Khói Group / CEO Bánh mì Khói).',
      'Buổi 3 (10h00 ngày 10/05 tại S02.01): "Go to Market" – ThS. Vũ Tuấn Anh (Phó TGĐ Cty TNHH Tái cấu trúc - CĐS, chuyên gia tư vấn AI - STEAM).',
      'Buổi 4 (17h30 ngày 11/05 tại E2.204): "Khởi nghiệp Tinh gọn - Hiểu đúng người dùng, tạo đúng sản phẩm" – TS. Nguyễn Thị Anh Thư.'
    ],
    outcomesAndValue: [
      '35 đội thi chính thức đăng ký với 138 sinh viên tham gia dự thi.',
      '10 Khoa trong toàn trường tham gia; 06 trường trên địa bàn TP. Đà Nẵng cùng góp mặt.',
      '60% dự án có giảng viên hướng dẫn chuyên môn đồng hành.',
      'Khẳng định vị thế và năng lực điều phối sự kiện học thuật chuyên môn cao của CLB BK-IC.'
    ],
    coverImage: '/images/bkic/bkshark_auditorium.jpg',
    detailUrl: '/activities/bk-shark'
  },
  {
    id: 'milestone-02-mang-luoi-dhdn',
    order: 2,
    timeframe: '09/01/2026',
    title: 'Ra mắt Mạng lưới Câu lạc bộ Khởi nghiệp, Đổi mới sáng tạo Đại học Đà Nẵng',
    category: 'Mạng lưới & Đối ngoại',
    organizersAndPartners: [
      'Hội Sinh viên Đại học Đà Nẵng',
      'Các câu lạc bộ sinh viên trực thuộc ĐHĐN'
    ],
    actionsTaken: [
      'Tham gia chương trình ra mắt mạng lưới, kết nối các câu lạc bộ hoạt động trong lĩnh vực khởi nghiệp và đổi mới sáng tạo.'
    ],
    outcomesAndValue: [
      'Tạo cơ hội kết nối giữa các câu lạc bộ, thúc đẩy hợp tác và phát triển hoạt động khởi nghiệp trong sinh viên, ký kết hợp tác với mạng lưới KNĐMST Đại học Đà Nẵng.'
    ],
    coverImage: '/images/bkic/news_bkic_launch_ceremony.jpg',
    detailUrl: '/about'
  },
  {
    id: 'milestone-01-thanh-lap-clb',
    order: 1,
    timeframe: '08/01/2026',
    title: 'Chính thức thành lập Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo BK-IC',
    category: 'Thành lập & Pháp lý',
    organizersAndPartners: [
      'Nhà trường Trường ĐH Bách khoa – ĐHĐN',
      'Trung tâm Hỗ trợ sinh viên & Quan hệ doanh nghiệp (QHDN)'
    ],
    actionsTaken: [
      'Hoàn thiện đề án thành lập, ký quyết định thành lập CLB Khởi nghiệp và Đổi mới sáng tạo (BK-IC).',
      'Kiện toàn bộ máy Ban chủ nhiệm lâm thời và định hướng phát triển.'
    ],
    outcomesAndValue: [
      'Đặt nền móng pháp lý chính thức cho hệ sinh thái khởi nghiệp đổi mới sáng tạo trong sinh viên Bách khoa.',
      'Xác lập cơ chế trực thuộc/đồng hành cùng Trung tâm Hỗ trợ sinh viên & QHDN.'
    ],
    coverImage: '/images/bkic/bkic_launch.jpg',
    detailUrl: '/about'
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
    id: 'ws-cds-lienchieu-2026',
    slug: 'workshop-y-tuong-sang-tao-chuyen-doi-so-lien-chieu-2026',
    title: 'Workshop Hỗ trợ Đội thi: Ý tưởng Sáng tạo Chuyển đổi số Phường Liên Chiểu 2026',
    category: 'Chuyển đổi số',
    date: 'Thứ Năm, 15/10/2026',
    time: '14:00 – 17:00',
    location: 'Phòng A136, Trường ĐH Bách khoa (DUT)',
    speaker: 'TS. Nguyễn Thị Anh Thư',
    speakerRole: 'Giảng viên Khoa Điện tử & AI, ĐH Bách khoa; Chuyên gia STEAM & ĐMST',
    status: 'completed',
    registrationOpen: false,
    coverImage: '/images/bkic/activity_workshop_cds_lienchieu.jpg',
    summary: 'Chia sẻ kinh nghiệm thực chiến, định hướng phát triển ý tưởng, xây dựng sản phẩm minh họa và kỹ năng thuyết trình cho các đội thi Vòng Chung kết.',
    fullDesc: 'Chiều ngày 15/10/2026, tại phòng A136, CLB Khởi nghiệp và Đổi mới Sáng tạo BK-IC đã tổ chức thành công buổi Workshop nhằm hỗ trợ các đội thi thuộc cuộc thi “Ý tưởng sáng tạo chuyển đổi số gắn với cải cách hành chính trong thanh niên trên địa bàn phường Liên Chiểu năm 2026”. Buổi workshop vinh dự đón tiếp TS. Nguyễn Thị Anh Thư cùng PGS.TS. Phạm Văn Tuấn - Viện trưởng Viện Giáo dục và Kỹ thuật - Công nghệ LYDINC.',
    prerequisites: [
      'Các đội thi lọt vào Vòng Chung kết Cuộc thi Ý tưởng sáng tạo chuyển đổi số Liên Chiểu 2026',
      'Thành viên CLB BK-IC quan tâm đến chuyển đổi số và cải cách hành chính địa phương'
    ],
    takeaways: [
      'Kinh nghiệm thực chiến và định hướng phát triển ý tưởng cho các dự án khởi nghiệp',
      'Góp ý, nhận xét chuyên môn sắc bén trực tiếp giúp các đội thi tối ưu hóa dự án',
      'Phương pháp xây dựng sản phẩm minh họa và chuẩn bị phần thuyết trình thuyết phục',
      'Tiếp thêm động lực và hành trang bứt phá tại Vòng Chung kết'
    ]
  },
  {
    id: 'ws-bkshark-training-04',
    slug: 'bk-shark-training-khoi-nghiep-tinh-gon',
    title: 'Training BK Shark 2026 (Buổi 4): Khởi nghiệp Tinh gọn – Hiểu đúng Người dùng, Tạo đúng Sản phẩm',
    category: 'Khởi nghiệp & Đào tạo',
    date: 'Thứ Hai, 11/05/2026',
    time: '17:30 – 20:00',
    location: 'Phòng E2.204, Trường ĐH Bách khoa (DUT)',
    speaker: 'TS. Nguyễn Thị Anh Thư',
    speakerRole: 'Giảng viên Khoa Điện tử & AI, Trường ĐH Bách khoa – ĐHĐN',
    status: 'completed',
    registrationOpen: false,
    coverImage: '/images/bkic/startup_training.jpg',
    summary: 'Buổi tập huấn thứ 4 khép lại chuỗi Training BK SHARK 2026: tiếp cận phương pháp Lean Startup thực chiến, không lãng phí nguồn lực và giải mã kết nối Người dùng – Sản phẩm.',
    fullDesc: 'Vào 17h30 ngày 11/05 tại phòng E2.204, chuỗi Training của BK SHARK 2026 đã chính thức khép lại đầy bùng nổ với chủ đề: "Khởi nghiệp Tinh gọn - Hiểu đúng người dùng, tạo đúng sản phẩm" cùng sự dẫn dắt tâm huyết của TS. Nguyễn Thị Anh Thư. Các đội thi được tiếp cận Lean Startup một cách thực chiến, học cách tối ưu nguồn lực và biến ý tưởng thành vũ khí sắc bén cho sân khấu Pitching.',
    prerequisites: [
      'Các đội thi tham gia Cuộc thi Khởi nghiệp sinh viên BK SHARK 2026',
      'Nhóm dự án cần hoàn thiện mô hình MVP và kiểm chứng khách hàng'
    ],
    takeaways: [
      'Nguyên lý Khởi nghiệp Tinh gọn (Lean Startup) ứng dụng thực tế',
      'Học cách tối ưu và tránh lãng phí nguồn lực trong giai đoạn đầu',
      'Phương pháp "bắt đúng bệnh" của thị trường và thiết kế sản phẩm giải quyết triệt để',
      'Bước rèn giũa cuối cùng hoàn thiện sản phẩm trước những màn Pitching đỉnh cao'
    ]
  },
  {
    id: 'ws-bkshark-training-03',
    slug: 'bk-shark-training-go-to-market',
    title: 'Training BK Shark 2026 (Buổi 3): Chiến lược Go to Market – Đưa Sản phẩm Ra Thị trường',
    category: 'Chiến lược Thị trường',
    date: 'Chủ Nhật, 10/05/2026',
    time: '10:00 – 12:00',
    location: 'Phòng S02.01, Trường ĐH Bách khoa (DUT)',
    speaker: 'ThS. Vũ Tuấn Anh',
    speakerRole: 'Phó TGĐ Cty TNHH Tái cấu trúc - CĐS; Chuyên gia Tư vấn AI - STEAM',
    status: 'completed',
    registrationOpen: false,
    coverImage: '/images/bkic/bkshark_ecosim_pitch.jpg',
    summary: 'Buổi tập huấn thứ 3 thuộc chuỗi Training BK SHARK 2026: xây dựng chiến lược Go-to-Market thực chiến và định vị giải pháp công nghệ trên thị trường.',
    fullDesc: 'Diễn ra vào lúc 10h00 ngày 10/05/2026 tại phòng S02.01, buổi tập huấn chuyên sâu "Go to Market" do ThS. Vũ Tuấn Anh trực tiếp chia sẻ đã giúp 35 đội thi BK SHARK 2026 nắm vững lộ trình thương mại hóa sản phẩm, xác định phân khúc khách hàng tiên phong (Early Adopters) và xây dựng kênh phân phối hiệu quả.',
    prerequisites: [
      'Các đội thi đăng ký tham gia Cuộc thi Khởi nghiệp sinh viên BK SHARK 2026',
      'Nhóm dự án đang xây dựng kế hoạch thương mại hóa và phát triển thị trường'
    ],
    takeaways: [
      'Phương pháp lập kế hoạch Go-to-Market (GTM) cho startup công nghệ sinh viên',
      'Chiến lược thâm nhập thị trường ngách và mở rộng tệp người dùng đầu tiên',
      'Ứng dụng công cụ số và AI trong tối ưu hóa vận hành & tiếp cận khách hàng',
      'Đánh giá tính khả thi thương mại trước thềm Vòng Sơ khảo & Chung kết'
    ]
  },
  {
    id: 'ws-bkshark-training-02',
    slug: 'bk-shark-training-goi-von-va-pitching',
    title: 'Training BK Shark 2026 (Buổi 2): Nền tảng Gọi vốn Cộng đồng, Tiếp cận Khách hàng & Kỹ năng Pitching',
    category: 'Gọi vốn & Pitching',
    date: 'Chủ Nhật, 10/05/2026',
    time: '08:00 – 10:00',
    location: 'Phòng S02.01, Trường ĐH Bách khoa (DUT)',
    speaker: 'Diễn giả Lê Đức Nguyên',
    speakerRole: 'Founder Khói Group / CEO Bánh mì Khói',
    status: 'completed',
    registrationOpen: false,
    coverImage: '/images/bkic/bkshark_auditorium.jpg',
    summary: 'Buổi tập huấn thứ 2 thuộc chuỗi Training BK SHARK 2026: chia sẻ thực chiến về gọi vốn cộng đồng, nghệ thuật thuyết trình Pitching và bản lĩnh trả lời câu hỏi phản biện từ Ban Giám khảo.',
    fullDesc: 'Vào 08h00 sáng ngày 10/05/2026 tại phòng S02.01, diễn giả Lê Đức Nguyên (Founder Khói Group / CEO Bánh mì Khói) đã mang đến những bài học xương máu từ thực tiễn khởi nghiệp, hướng dẫn các đội thi cách xây dựng câu chuyện gọi vốn thuyết phục, làm chủ sân khấu Pitching và xử lý nhạy bén các câu hỏi hóc búa từ Hội đồng Giám khảo.',
    prerequisites: [
      'Các đội thi đăng ký tham gia Cuộc thi Khởi nghiệp sinh viên BK SHARK 2026',
      'Sinh viên quan tâm đến kỹ năng thuyết trình gọi vốn và phát triển thương hiệu'
    ],
    takeaways: [
      'Hiểu rõ cơ chế vận hành của các nền tảng gọi vốn cộng đồng và nhà đầu tư thiên thần',
      'Kỹ năng cấu trúc bài Pitching chạm đúng trọng tâm quan tâm của các Shark',
      'Chiến thuật trả lời câu hỏi phản biện (Q&A) tự tin, sắc bén và có số liệu dẫn chứng',
      'Kinh nghiệm thực tế trong việc tiếp cận khách hàng và xây dựng chuỗi giá trị'
    ]
  },
  {
    id: 'ws-bkshark-training-01',
    slug: 'bk-shark-training-thiet-ke-giai-phap-gia-tri',
    title: 'Training BK Shark 2026 (Buổi 1): Thiết kế Giải pháp Giá trị – Bước đi Đầu tiên Chinh phục Khách hàng',
    category: 'Khởi nghiệp & Đổi mới',
    date: 'Thứ Bảy, 09/05/2026',
    time: '08:00 – 11:30',
    location: 'Phòng F310, Trường ĐH Bách khoa (DUT)',
    speaker: 'TS. Nguyễn Hồng Nguyên',
    speakerRole: 'Chuyên gia Cố vấn Khởi nghiệp Đổi mới Sáng tạo, Trường ĐH Bách khoa – ĐHĐN',
    status: 'completed',
    registrationOpen: false,
    coverImage: '/images/bkic/activity_training_bkshark_2026.jpg',
    summary: 'Trạm dừng chân đầu tiên của chuỗi Training chuyên môn BK SHARK 2026: trang bị tư duy đào sâu vào nỗi đau thị trường và mài giũa ý tưởng thành giải pháp có sức nặng.',
    fullDesc: 'Trạm dừng chân đầu tiên của chuỗi Training chuyên môn BK SHARK 2026 với chủ đề: "Thiết kế giải pháp giá trị cho khách hàng". TS. Nguyễn Hồng Nguyên đã mang đến không gian tràn ngập kiến thức thực chiến, giúp các đội thi trang bị tư duy, đào sâu vào nỗi đau thị trường và mài giũa ý tưởng thô sơ thành những giải pháp thực sự mang lại giá trị vươn xa.',
    prerequisites: [
      'Các đội thi đăng ký tham gia Cuộc thi Khởi nghiệp sinh viên BK SHARK 2026',
      'Sinh viên Bách khoa đam mê sáng tạo và phát triển dự án công nghệ'
    ],
    takeaways: [
      'Tư duy thiết kế giải pháp giá trị (Value Proposition Design)',
      'Học cách đào sâu "nỗi đau" của thị trường và khách hàng mục tiêu',
      'Mài giũa ý tưởng thô sơ thành giải pháp có sức nặng và giá trị cạnh tranh',
      'Trang bị vũ khí tự tin cải thiện dự án trước Hội đồng Giám khảo'
    ]
  }
];

// =============================================================================
// TAB 3: CUỘC THI SÁNG TẠO & CHƯƠNG TRÌNH ĐỔI MỚI (COMPETITIONS DATA)
// (Tích hợp đầy đủ dữ liệu từ Bảng tổng hợp Cuộc thi Tháng 9, Tháng 10 & BK Shark)
// =============================================================================
export type CompetitionLevel =
  | 'Cấp Trường'
  | 'Cấp Phường'
  | 'Cấp ĐHĐN'
  | 'Thành Phố'
  | 'Quốc Gia'
  | 'Quốc Tế';

export interface CompetitionDetailItem {
  id: string;
  slug: string;
  title: string;
  field: string;
  level: CompetitionLevel;
  monthTag: 'Tháng 5/2026' | 'Tháng 9/2026' | 'Tháng 10/2026' | 'Tháng 11/2026';
  prizePool: string;
  deadline: string;
  deadlineDetails: string;
  deadlineIso: string; // Used for countdown
  teamsCount: string;
  status: 'active' | 'upcoming' | 'completed';
  summary: string;
  organizer: string;
  coverImage: string;
  featured: boolean;
  isClubOrganized: boolean;
  registrationOpen: boolean;
  infoUrl?: string;
  externalRegUrl?: string;
  timeline: { phase: string; date: string; desc: string }[];
  prizes: { rank: string; reward: string; extra: string }[];
  eligibility: string[];
}

export const COMPETITIONS_DATA: CompetitionDetailItem[] = [
  // 1. BK SHARK 2026 (CLB ĐỒNG TỔ CHỨC)
  {
    id: 'comp-bk-shark-2026',
    slug: 'bk-shark-2026',
    title: 'Cuộc thi Khởi nghiệp Sinh viên "BK SHARK 2026"',
    field: 'Khởi nghiệp Đổi mới Sáng tạo & Công nghệ',
    level: 'Thành Phố',
    monthTag: 'Tháng 5/2026',
    prizePool: 'Cúp Vô địch & Gói ươm tạo',
    deadline: '16/05/2026',
    deadlineDetails: 'Tháng 05/2026 (Chuỗi 4 buổi tập huấn 09/05 – 11/05/2026 & Chung kết 16/05/2026)',
    deadlineIso: '2026-05-16T23:59:59',
    teamsCount: '35 đội thi • 138 sinh viên (10 Khoa, 06 Trường ĐH)',
    status: 'completed',
    featured: true,
    isClubOrganized: true,
    registrationOpen: false,
    organizer: 'Trường ĐH Bách khoa, Đoàn TN - Hội SV & CLB BK-IC (Phối hợp: TT Hỗ trợ SV & QHDN, HUB Network Đà Nẵng)',
    coverImage: '/images/bkic/news_bkshark_2026_launch.jpg',
    infoUrl: 'https://dut.udn.vn/Phong/Taichinh/Tintuc/id/11980',
    summary: 'Đấu trường Khởi nghiệp Sinh viên BK SHARK 2026 quy tụ 35 đội thi với 138 sinh viên từ 10 Khoa trong trường và 06 trường đại học trên địa bàn TP. Đà Nẵng (60% dự án có giảng viên hướng dẫn chuyên môn đồng hành), kèm chuỗi 4 buổi tập huấn thực chiến.',
    timeline: [
      { phase: 'Vòng 1: Phát động & Tiếp nhận ý tưởng dự án', date: 'Tháng 04/2026', desc: 'Tiếp nhận 35 đội thi (138 sinh viên) từ 10 Khoa thuộc DUT và 06 trường đại học tại Đà Nẵng.' },
      { phase: 'Vòng 2: Chuỗi 4 Buổi Tập huấn Chuyên sâu', date: '09/05 – 11/05/2026', desc: 'Buổi 1: TS. Nguyễn Hồng Nguyên (F310); Buổi 2: Diễn giả Lê Đức Nguyên (S02.01); Buổi 3: ThS. Vũ Tuấn Anh (S02.01); Buổi 4: TS. Nguyễn Thị Anh Thư (E2.204).' },
      { phase: 'Vòng 3: Sơ khảo & Thẩm định Chuyên môn', date: '12/05 – 14/05/2026', desc: 'Chấm điểm và lựa chọn Top 7 dự án xuất sắc nhất bước vào Vòng Chung kết.' },
      { phase: 'Vòng 4: Chung kết & Gọi vốn (Grand Finale)', date: '16/05/2026', desc: 'Pitching trực tiếp trước Hội đồng Giám khảo và vinh danh Quán quân DanangBooth, Á quân 4Sight, Giải Ba Kizuna Hub.' }
    ],
    prizes: [
      { rank: 'Giải Nhất (Quán quân – DanangBooth)', reward: 'Cúp Vô địch + Giải thưởng hiện kim', extra: 'Bảo trợ ươm tạo và đại diện tham gia các giải đấu cấp Thành phố & Quốc gia' },
      { rank: 'Giải Nhì (Á quân – 4Sight)', reward: 'Kỷ niệm chương & Giải thưởng hiện kim', extra: 'Kết nối chuyên gia cố vấn công nghệ và doanh nghiệp đồng hành' },
      { rank: 'Giải Ba (Quý quân – Kizuna Hub) & Top 7', reward: 'Giấy chứng nhận & Học bổng ươm tạo', extra: 'Vinh danh CarboX.MH, DataStorm, Nexus, WaveX NextGen' }
    ],
    eligibility: [
      'Sinh viên Trường Đại học Bách khoa – ĐHĐN và các trường đại học trên địa bàn TP. Đà Nẵng',
      'Đội thi từ 2 đến 5 thành viên (60% dự án có giảng viên hướng dẫn chuyên môn đồng hành)',
      'Dự án thuộc lĩnh vực công nghệ, kỹ thuật, chuyển đổi số hoặc mô hình khởi nghiệp sáng tạo'
    ]
  },

  // 2. CUỘC THI CHUYỂN ĐỔI SỐ LIÊN CHIỂU 2026 (CLB PHỐI HỢP TỔ CHỨC - THÁNG 10)
  {
    id: 'comp-cds-lienchieu-2026',
    slug: 'chuyen-doi-so-thanh-nien-lien-chieu-2026',
    title: 'Cuộc thi “Ý tưởng sáng tạo chuyển đổi số thanh niên Liên Chiểu” năm 2026',
    field: 'Chuyển đổi số, Môi trường & Đô thị xanh, Cải cách hành chính, Đời sống cộng đồng',
    level: 'Cấp Phường',
    monthTag: 'Tháng 10/2026',
    prizePool: 'Giải thưởng & Bằng khen Đoàn Thanh niên',
    deadline: '04/10/2026',
    deadlineDetails: '25/09 – 03/10: Đăng ký | Trước 04/10: Nộp hồ sơ & sản phẩm | 10/10/2026: Chung kết & Trao giải',
    deadlineIso: '2026-10-04T23:59:59',
    teamsCount: 'Cá nhân hoặc nhóm (tối đa 05 thành viên)',
    status: 'completed',
    featured: true,
    isClubOrganized: true,
    registrationOpen: false,
    organizer: 'BCH Đoàn TNCS Hồ Chí Minh Phường Liên Chiểu, Phòng Văn hóa - Xã hội & CLB BK-IC (Bảo trợ: TT Hỗ trợ SV & QHDN)',
    coverImage: '/images/bkic/news_digital_transformation_lienchieu.jpg',
    infoUrl: 'https://www.facebook.com/share/p/199kjt2v7X/',
    externalRegUrl: 'https://forms.gle/suQiRrkoFpBP4CNx7',
    summary: 'Với chủ đề "Thanh niên Liên Chiểu – Sáng tạo vì cuộc sống", cuộc thi phát huy vai trò xung kích của tuổi trẻ trong chuyển đổi số, cải cách hành chính và giải quyết các bài toán thực tiễn tại địa phương do Đoàn phường Liên Chiểu phối hợp cùng CLB BK-IC tổ chức.',
    timeline: [
      { phase: 'Giai đoạn 1: Tiếp nhận đăng ký & Hướng dẫn ý tưởng', date: '25/09 – 03/10/2026', desc: 'Tiếp nhận đăng ký và hướng dẫn các đội thi hoàn thiện ý tưởng dự thi.' },
      { phase: 'Giai đoạn 2: Hạn chót nộp hồ sơ & mô hình minh họa', date: 'Trước 04/10/2026', desc: 'Các đội thi nộp hồ sơ ý tưởng và sản phẩm/mô hình minh họa về Ban Tổ chức.' },
      { phase: 'Giai đoạn 3: Thẩm định & Chấm Vòng Sơ loại', date: '05/10 – 06/10/2026', desc: 'Ban Tổ chức tổng hợp, thẩm định và chấm chọn các đội xuất sắc vào Vòng Chung kết.' },
      { phase: 'Giai đoạn 4: Workshop Tập huấn Đội thi Chung kết', date: '07/10 – 15/10/2026', desc: 'Tập huấn chuyên môn cùng TS. Nguyễn Thị Anh Thư và PGS.TS. Phạm Văn Tuấn tại phòng A136.' },
      { phase: 'Giai đoạn 5: Chung kết & Lễ Trao giải', date: '10/10/2026', desc: 'Thuyết trình bảo vệ dự án chuyển đổi số và trao giải cho các đội thi xuất sắc.' }
    ],
    prizes: [
      { rank: 'Giải Nhất', reward: 'Cúp & Giấy khen BCH Đoàn Phường', extra: 'Hỗ trợ kết nối triển khai thực nghiệm giải pháp tại địa phương' },
      { rank: 'Giải Nhì', reward: 'Giấy khen & Hiện kim', extra: 'Đồng hành hoàn thiện sản phẩm ứng dụng số hóa' },
      { rank: 'Giải Ba & Khuyến khích', reward: 'Giấy khen & Phần thưởng', extra: 'Ghi nhận sáng kiến chuyển đổi số phục vụ cộng đồng' }
    ],
    eligibility: [
      'Cá nhân hoặc nhóm dự thi (tối đa không quá 05 thành viên/nhóm)',
      'Đoàn viên thanh niên, sinh viên ĐH Bách khoa và thanh niên trên địa bàn Liên Chiểu',
      'Lĩnh vực: Chuyển đổi số & công nghệ, Môi trường & đô thị xanh, Đời sống & cộng đồng, Học tập - việc làm - khởi nghiệp, Văn hóa - thể thao, Cải cách hành chính'
    ]
  },

  // 3. AVALANCHE TEAM1 HACKATHON 2026 (THÁNG 11) — Ảnh thứ 5
  {
    id: 'comp-avalanche-team1-hackathon-2026',
    slug: 'avalanche-team1-hackathon-2026',
    title: 'AVALANCHE TEAM1 HACKATHON 2026',
    field: 'Blockchain Avalanche & Web3 DApps',
    level: 'Quốc Gia',
    monthTag: 'Tháng 11/2026',
    prizePool: '3.500 USD (~88 Triệu VNĐ)',
    deadline: '30/11/2026',
    deadlineDetails: '02/11 – 30/11/2026 (Khai mạc tại ĐHQG TP.HCM, Chung kết Pitching tại ĐH Tôn Đức Thắng)',
    deadlineIso: '2026-11-30T23:59:59',
    teamsCount: '30+ đội đăng ký • Chọn 7–10 đội vào Chung kết',
    status: 'completed',
    featured: false,
    isClubOrganized: false,
    registrationOpen: false,
    organizer: 'Avalanche Team1 Vietnam (Khai mạc: ĐHQG TP.HCM • Chung kết: ĐH Tôn Đức Thắng)',
    coverImage: '/images/bkic/comp_avalanche_hackathon_2026.png',
    infoUrl: 'https://docs.google.com/document/d/1uM479CenH025TwWRBaAZZwV2c88Uxh0vjOM42uhCBaE/edit?tab=t.0#heading=h.w1zqpeqit2ak',
    summary: 'Hackathon toàn quốc dành cho sinh viên xây dựng các sản phẩm thực tế trên nền tảng blockchain Avalanche với tổng giải thưởng dự kiến lên đến 3.500 USD, kèm 3 buổi workshop (1 offline, 2 online) và 2 buổi Q&A hỗ trợ kỹ thuật.',
    timeline: [
      { phase: 'Khai mạc & Phát động Hackathon', date: '02/11/2026', desc: 'Khai mạc chương trình tại Đại học Quốc gia TP.HCM và mở cổng phát triển sản phẩm.' },
      { phase: 'Chuỗi 3 Workshop & 2 Buổi Q&A Kỹ thuật', date: 'Tháng 11/2026', desc: '1 workshop offline, 2 workshop online và 2 buổi Q&A trực tuyến hỗ trợ các team xây dựng sản phẩm trên Avalanche.' },
      { phase: 'Vòng Chung kết & Pitching Offline', date: '30/11/2026', desc: 'Chọn 7–10 đội xuất sắc vào chung kết pitching trực tiếp tại ĐH Tôn Đức Thắng (3–5 dự án tiềm năng được đồng hành tiếp sau cuộc thi).' }
    ],
    prizes: [
      { rank: 'Tổng giải thưởng toàn mùa', reward: '3.500 USD', extra: 'Trao cho các đội xuất sắc nhất tại Vòng Chung kết ở TP.HCM' },
      { rank: 'Hỗ trợ ươm tạo sau cuộc thi', reward: 'Top 3–5 Dự án tiềm năng', extra: 'Được Team1 tiếp tục đồng hành cố vấn phát triển sản phẩm sau Hackathon' }
    ],
    eligibility: [
      'Sinh viên các trường đại học, cao đẳng trên toàn quốc đam mê công nghệ Blockchain & Web3',
      'Xây dựng các sản phẩm ứng dụng thực tế trên mạng lưới Blockchain Avalanche',
      'Lưu ý: Các đội lọt vào Vòng Chung kết tại TP.HCM tự túc chi phí đi lại và lưu trú'
    ]
  },

  // 4. CUỘC THI STEAM QUỐC TẾ "CÔNG DÂN CHÂU Á THẾ HỆ MỚI" (THÁNG 10) — Ảnh thứ 1
  {
    id: 'comp-steam-quoc-te-cong-dan-chau-a-2026',
    slug: 'cuoc-thi-steam-quoc-te-cong-dan-chau-a-the-he-moi-2026',
    title: 'Cuộc thi STEAM Quốc tế "Công dân Châu Á Thế hệ mới"',
    field: 'Lập trình & Tư duy tính toán, Robot & AI, STEAM sáng tạo vì cộng đồng',
    level: 'Quốc Tế',
    monthTag: 'Tháng 10/2026',
    prizePool: 'Giải thưởng & Huy chương Quốc tế',
    deadline: '04/10/2026',
    deadlineDetails: 'Hạn đăng ký: 04/10/2026',
    deadlineIso: '2026-10-04T23:59:59',
    teamsCount: '3 người/nhóm',
    status: 'completed',
    featured: false,
    isClubOrganized: false,
    registrationOpen: false,
    organizer: 'Ban Tổ chức STEAM Quốc tế Châu Á (ANGC 2026 & LYDINC)',
    coverImage: '/images/bkic/comp_steam_angc_2026.jpg',
    infoUrl: 'https://drive.google.com/file/d/19qK0YK5H-TV4pVWMqZRfu7cdRmkEEXXp/view?usp=sharing',
    externalRegUrl: 'https://www.facebook.com/share/p/1LkqMaz89k/',
    summary: 'Cuộc thi gồm 6 nội dung về lập trình, robot, AI, sáng tạo nội dung và các dự án STEAM vì cộng đồng, nhằm phát triển tư duy sáng tạo, kỹ năng công nghệ và tinh thần giải quyết các vấn đề xã hội.',
    timeline: [
      { phase: 'Hạn cuối đăng ký đội thi', date: '04/10/2026', desc: 'Các đội thi (3 thành viên/nhóm) hoàn tất hồ sơ đăng ký theo 6 nội dung thi đấu.' },
      { phase: 'Vòng Thi đấu & Thuyết trình Dự án STEAM', date: 'Tháng 10/2026', desc: 'Tranh tài ở các bảng Lập trình, Robot & AI, và Dự án STEAM vì cộng đồng.' }
    ],
    prizes: [
      { rank: 'Giải Quốc tế các Bảng thi', reward: 'Huy chương & Chứng nhận Quốc tế', extra: 'Giao lưu học thuật cùng thanh thiếu niên và sinh viên khu vực Châu Á' }
    ],
    eligibility: [
      'Quy mô đội thi: 03 người/nhóm',
      'Lĩnh vực: Lập trình và tư duy tính toán, Robot và trí tuệ nhân tạo, STEM sáng tạo vì cộng đồng'
    ]
  },

  // 5. MIT $50K VIETNAM: GIAO LƯU TRỰC TUYẾN CÙNG BTC (THÁNG 9) — Ảnh thứ 4
  {
    id: 'comp-mit-50k-vietnam-2026',
    slug: 'mit-50k-vietnam-giao-luu-truc-tuyen-2026',
    title: 'MIT $50K VIETNAM: Giao lưu Trực tuyến cùng Ban Tổ chức',
    field: 'Các dự án khởi nghiệp công nghệ & Nghiên cứu chuyên sâu',
    level: 'Quốc Gia',
    monthTag: 'Tháng 9/2026',
    prizePool: 'Giải thưởng MIT $50K Vietnam',
    deadline: '26/09/2026',
    deadlineDetails: '10:00 – 11:00 sáng Thứ Bảy, ngày 26/09/2026 (Trực tuyến)',
    deadlineIso: '2026-09-26T10:00:00',
    teamsCount: 'Không giới hạn',
    status: 'completed',
    featured: false,
    isClubOrganized: false,
    registrationOpen: false,
    organizer: 'Ban Tổ chức MIT $50K Vietnam (Cùng Bà Tạ Thị Thanh Thủy – Giám đốc Quỹ Đinh Thiện Lý)',
    coverImage: '/images/bkic/comp_mit_50k_vietnam_2026.jpg',
    infoUrl: 'https://www.facebook.com/share/p/1DHFCaSkLJ/',
    externalRegUrl: 'https://l1nk.dev/0ynhrhv',
    summary: 'Buổi giao lưu trực tuyến cùng Ban Tổ chức MIT $50K Vietnam dành cho các nhóm dự án, học viên cao học, Nghiên cứu sinh Tiến sĩ và sau Tiến sĩ quan tâm đến điều kiện tham gia, hồ sơ và quy trình đánh giá của cuộc thi.',
    timeline: [
      { phase: 'Phiên Info Session & Q&A Trực tuyến', date: '10:00 – 11:00, 26/09/2026', desc: 'Giải đáp chi tiết về điều kiện tham gia, cách chuẩn bị hồ sơ và tiêu chí chấm chọn của MIT $50K Vietnam.' }
    ],
    prizes: [
      { rank: 'Cơ hội Tranh tài MIT $50K', reward: 'Quỹ giải thưởng $50,000', extra: 'Kết nối trực tiếp với mạng lưới cố vấn quốc tế từ MIT và hệ sinh thái DeepTech' }
    ],
    eligibility: [
      'Các dự án khởi nghiệp, sinh viên, học viên cao học, Nghiên cứu sinh Tiến sĩ và sau Tiến sĩ',
      'Số lượng tham dự: Không giới hạn (Trực tuyến)'
    ]
  },

  // 6. CUỘC THI SÁNG TẠO TRẺ QUỐC GIA VỀ TRÍ TUỆ NHÂN TẠO 2026 (THÁNG 9) — Ảnh thứ 2
  {
    id: 'comp-sang-tao-tre-quoc-gia-ai-2026',
    slug: 'cuoc-thi-sang-tao-tre-quoc-gia-ve-tri-tue-nhan-tao-2026',
    title: 'Cuộc thi Sáng tạo Trẻ Quốc gia về Trí tuệ Nhân tạo 2026',
    field: 'CNTT, Khoa học máy tính, Trí tuệ nhân tạo (AI), Khoa học dữ liệu, Điện – Điện tử, Tự động hóa',
    level: 'Quốc Gia',
    monthTag: 'Tháng 9/2026',
    prizePool: 'Tuyển chọn 05 Đội Đại diện DUT dự Vòng Khu vực & Toàn quốc',
    deadline: '21/09/2026',
    deadlineDetails: '11h00 ngày 21/09/2026 tại Phòng Công tác Sinh viên - Phòng S06.08 (CV. Đới Phương Thanh)',
    deadlineIso: '2026-09-21T11:00:00',
    teamsCount: '03 người/đội (Tuyển chọn 05 đội đại diện Trường)',
    status: 'completed',
    featured: false,
    isClubOrganized: false,
    registrationOpen: false,
    organizer: 'Ban Tổ chức Quốc gia & Trường ĐH Bách khoa – ĐHĐN (Phòng CTSV S06.08)',
    coverImage: '/images/bkic/comp_ai_quoc_gia_2026.jpg',
    infoUrl: 'https://www.facebook.com/share/p/1BVsy8dq1f/',
    externalRegUrl: 'https://docs.google.com/document/d/1277xrIsRtrUwbLIdDLqEUznZhroKICyJ/edit?usp=sharing&ouid=111272308073265472512&rtpof=true&sd=true',
    summary: 'Sân chơi quốc gia dành cho sinh viên đam mê AI biến ý tưởng thành sản phẩm ứng dụng thực tiễn. Trường ĐH Bách khoa – ĐHĐN tuyển chọn 05 đội thi (tối đa 3 thành viên/đội) đại diện Trường tham dự Vòng Khu vực miền Trung (Bảng C tại Đà Nẵng) hướng tới Vòng Chung kết Toàn quốc tại Hà Nội.',
    timeline: [
      { phase: 'Vòng Tuyển chọn Cấp Trường (DUT)', date: 'Hạn nộp: 11h00 ngày 21/09/2026', desc: 'Nộp hồ sơ tại Phòng Công tác Sinh viên (S06.08 - Chuyên viên Đới Phương Thanh) để chọn 05 đội đại diện Trường.' },
      { phase: 'Vòng Khu vực Miền Trung – Bảng C', date: 'Tháng 10/2026 tại Đà Nẵng', desc: '05 đội đại diện Trường ĐH Bách khoa tranh tài tại Vòng Khu vực miền Trung tổ chức ở Đà Nẵng.' },
      { phase: 'Vòng Chung kết Toàn quốc', date: 'Cuối năm 2026 tại Hà Nội', desc: 'Các đội xuất sắc nhất khu vực tham dự Vòng Chung kết Toàn quốc tại Thủ đô Hà Nội.' }
    ],
    prizes: [
      { rank: 'Đại diện Chính thức ĐH Bách khoa (05 Đội)', reward: 'Vé dự Vòng Khu vực Bảng C & Chung kết Hà Nội', extra: 'Giải thưởng Quốc gia về Trí tuệ Nhân tạo trong học tập, nghiên cứu, sản xuất và chuyển đổi số' }
    ],
    eligibility: [
      'Sinh viên Trường Đại học Bách khoa – ĐHĐN (Mỗi đội tối đa 03 thành viên)',
      'Lĩnh vực: Công nghệ thông tin, Khoa học máy tính, Trí tuệ nhân tạo, Khoa học dữ liệu, Điện – Điện tử, Tự động hóa'
    ]
  },

  // 7. NEXT COMMERCE 2027 – TRENDS • TECHNOLOGY • TALENT (THÁNG 9) — Ảnh thứ 3
  {
    id: 'comp-next-commerce-2027',
    slug: 'next-commerce-2027-trends-technology-talent',
    title: 'Chương trình: NEXT COMMERCE 2027 – TRENDS • TECHNOLOGY • TALENT',
    field: 'Kinh doanh, Công nghệ, AI, Marketing và Thương mại điện tử',
    level: 'Quốc Gia',
    monthTag: 'Tháng 9/2026',
    prizePool: 'Quà tặng & Học bổng hơn 200 Triệu VNĐ',
    deadline: '20/09/2026',
    deadlineDetails: '08:00 – 12:00 | Chủ Nhật, ngày 20/09/2026 tại Nhà hát Trưng Vương, Đà Nẵng',
    deadlineIso: '2026-09-20T08:00:00',
    teamsCount: 'Dành cho sinh viên quan tâm',
    status: 'completed',
    featured: false,
    isClubOrganized: false,
    registrationOpen: false,
    organizer: 'Ban Tổ chức NEXT COMMERCE 2027 (JCI Danang, VECOM & Đối tác tại Nhà hát Trưng Vương)',
    coverImage: '/images/bkic/comp_next_commerce_2027.jpg',
    infoUrl: 'https://www.facebook.com/share/p/1UMz4YQz7e/',
    externalRegUrl: 'https://forms.gle/DSfpAbA2UDX4den79',
    summary: 'Sự kiện quy mô lớn về xu hướng E-Commerce kết hợp Công nghệ và AI, mở ra cơ hội mới trong kinh doanh và Marketing. Sinh viên được lắng nghe chuyên gia, kết nối doanh nghiệp và tham gia Panel Discussion để chuẩn bị năng lực nghề nghiệp cho hành trình phía trước.',
    timeline: [
      { phase: 'Sự kiện Chính & Panel Discussion', date: '08:00 – 12:00 | Chủ Nhật, 20/09/2026', desc: 'Diễn ra trực tiếp tại Nhà hát Trưng Vương, TP. Đà Nẵng với sự góp mặt của các chuyên gia công nghệ và thương mại điện tử.' }
    ],
    prizes: [
      { rank: 'Quà tặng & Học bổng Sự kiện', reward: 'Trị giá hơn 200 Triệu Đồng', extra: 'Học bổng khóa học AI, Storytelling, SpeakPro và Networking cùng Doanh nghiệp' }
    ],
    eligibility: [
      'Sinh viên quan tâm đến lĩnh vực Kinh doanh, Công nghệ, AI, Marketing và Thương mại điện tử tại Đà Nẵng'
    ]
  }
];

export interface CompetitionHallOfFameItem {
  teamName: string;
  award: string;
  contest: string;
  project: string;
  members: string;
}

// Past verified achievements in competitions (Tạm thời để trống theo yêu cầu - chờ data chính thức từ BCN)
export const COMPETITION_HALL_OF_FAME: CompetitionHallOfFameItem[] = [];

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

// Hiện tại CLB chưa bảo trợ dự án chính thức nào, để trống chờ đợt xét duyệt mới
export const COMPANION_PROJECTS_DATA: CompanionProjectItem[] = [];

export interface PartnershipModelItem {
  id: 'program_sponsor' | 'expert_mentoring' | 'real_world_problem' | 'recruitment_internship' | 'other';
  title: string;
  badge: string;
  desc: string;
  benefits: string[];
}

export const PARTNERSHIP_MODELS: PartnershipModelItem[] = [
  {
    id: 'expert_mentoring',
    title: 'Đồng hành Kỹ thuật & Cố vấn Giảng viên',
    badge: 'CỐ VẤN R&D',
    desc: 'Các nhóm dự án sinh viên được kết nối trực tiếp với giảng viên hướng dẫn chuyên môn từ các Khoa của Trường ĐH Bách khoa và mentor kỹ thuật giàu kinh nghiệm.',
    benefits: [
      'Cố vấn 1-1 về kiến trúc giải pháp, AI, IoT và thiết kế phần cứng/phần mềm',
      'Hỗ trợ định hướng đề tài Nghiên cứu Khoa học Sinh viên (NCKH) cấp Khoa & Trường',
      'Tối ưu hóa sản phẩm mẫu (Prototype / MVP) để kiểm chứng thực tế'
    ]
  },
  {
    id: 'program_sponsor',
    title: 'Ươm tạo Đi thi Khởi nghiệp & Đấu trường Công nghệ',
    badge: 'ĐẤU TRƯỜNG',
    desc: 'Đồng hành toàn diện cùng các đội thi sinh viên tham gia BK Shark, SV_STARTUP, Đà Nẵng Innovation Startup và các cuộc thi học thuật quốc gia, quốc tế.',
    benefits: [
      'Huấn luyện kỹ năng xây dựng Pitch Deck, Business Model Canvas và thuyết trình gọi vốn',
      'Tổ chức các phiên Mock Pitching phản biện trực tiếp cùng Hội đồng Chuyên gia',
      'Bảo trợ truyền thông và giới thiệu dự án trên các kênh chính thức của BK-IC'
    ]
  },
  {
    id: 'real_world_problem',
    title: 'Kết nối Đội ngũ Đa ngành & Hạ tầng Thử nghiệm',
    badge: 'ĐỘI NGŨ & LAB',
    desc: 'Hỗ trợ sinh viên ghép nhóm liên ngành (CNTT, Điện – Điện tử, Cơ khí, Kinh tế – Quản lý dự án) và tiếp cận nguồn lực thử nghiệm giải pháp thực tế.',
    benefits: [
      'Tìm kiếm đồng đội (Co-founder) bổ sung mảnh ghép kỹ thuật và phát triển kinh doanh',
      'Hỗ trợ không gian sinh hoạt nhóm, tài liệu học thuật và kết nối vườn ươm đối tác',
      'Cơ hội triển khai thử nghiệm (Pilot) giải pháp ngay tại khuôn viên trường và địa phương'
    ]
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

// =============================================================================
// TAB 5: BK SHARK (PITCHING STAGE & SEASONS)
// =============================================================================
export interface SharkFinalistProject {
  rank?: string;
  name: string;
  projectTitle: string;
  field: string;
  institution: string;
  summary: string;
  award?: string;
  prizeMoney?: string;
}

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
  finalists?: SharkFinalistProject[];
}

export const BK_SHARK_SEASONS: SharkSeasonItem[] = [
  {
    season: '2026',
    year: '2026',
    theme: 'Khởi nghiệp trong Sinh viên – Đổi mới Sáng tạo & Chuyển đổi số',
    pitchesCount: 35,
    totalCommitment: 'Tổng giải thưởng & Suất tiến cử cấp ĐHĐN',
    status: 'completed',
    summary: 'Mùa giải BK SHARK đầu tiên thu hút 35 đội thi với hơn 140 sinh viên từ 6 trường đại học trên địa bàn Đà Nẵng, tranh tài với 7 dự án xuất sắc tại Vòng Chung kết ngày 16/05/2026.',
    date: 'Chung kết: 16/05/2026',
    coverImage: '/images/bkic/news_bkshark_2026_launch.jpg',
    highlights: [
      '35 Đội thi với hơn 140 sinh viên tham gia từ các trường đại học toàn thành phố Đà Nẵng',
      'Chuỗi 4 buổi đào tạo chuyên môn thực chiến cùng các chuyên gia hàng đầu',
      'Top 7 Dự án công nghệ xuất sắc tranh tài tại Vòng Chung kết (16/05/2026)',
      'Dự án DanangBooth xuất sắc giành giải Quán quân BK SHARK 2026'
    ],
    finalists: [
      {
        rank: 'Giải Nhất (Quán quân)',
        name: 'Đội DanangBooth',
        projectTitle: 'DanangBooth: Mô hình kết nối hộ chiếu, photobooth và nền tảng chia sẻ hành trình du lịch số',
        field: 'Chuyển đổi số & Du lịch thông minh',
        institution: 'Trường Đại học Bách khoa – ĐHĐN',
        summary: 'Mô hình kết nối hộ chiếu, photobooth và nền tảng số hoá hành trình trải nghiệm của du khách tại TP. Đà Nẵng, kết hợp chia sẻ khoảnh khắc và quảng bá du lịch địa phương.',
        award: 'Quán quân BK SHARK 2026',
        prizeMoney: '15.000.000 VNĐ + Cúp vô địch & Suất thi đấu cấp ĐHĐN'
      },
      {
        rank: 'Giải Nhì (Á quân)',
        name: 'Đội 4Sight',
        projectTitle: 'Re-Braille Tech: Nền tảng công nghệ tuần hoàn học liệu theo mô hình HaaS, hướng đến tối ưu chi phí và phát triển bền vững theo chuẩn ESG',
        field: 'Công nghệ Giáo dục & Bền vững (ESG)',
        institution: 'Đội thi liên trường Đại học Đà Nẵng',
        summary: 'Hệ thống thiết bị hỗ trợ đọc chữ nổi Braille và tuần hoàn học liệu cho người khiếm thị theo mô hình phần cứng dịch vụ (HaaS).',
        award: 'Giải Nhì BK SHARK 2026',
        prizeMoney: '10.000.000 VNĐ + Giấy khen'
      },
      {
        rank: 'Giải Ba',
        name: 'Đội Kizuna',
        projectTitle: 'Kizuna Hub: Nền tảng chuyển đổi số và hạ tầng ươm tạo khởi nghiệp',
        field: 'Nền tảng Số & Ươm tạo Khởi nghiệp',
        institution: 'Đại học Đà Nẵng',
        summary: 'Nền tảng số kết nối các nhà sáng lập trẻ với chuyên gia cố vấn, nhà đầu tư và hạ tầng ươm tạo dự án khởi nghiệp.',
        award: 'Giải Ba BK SHARK 2026',
        prizeMoney: '8.000.000 VNĐ + Giấy khen'
      },
      {
        rank: 'Top 7 Chung kết',
        name: 'Đội CarboX.MH',
        projectTitle: 'CarboX.MH: Hệ thống tính toán, phân tích và tối ưu hóa phát thải carbon',
        field: 'GreenTech & Quản lý Môi trường',
        institution: 'Trường Đại học Bách khoa – ĐHĐN',
        summary: 'Giải pháp phần mềm và IoT đo lường, kiểm kê và kiến nghị lộ trình giảm thiểu dấu chân carbon cho doanh nghiệp và trường học.'
      },
      {
        rank: 'Top 7 Chung kết',
        name: 'Đội DataStorm',
        projectTitle: 'DataStorm: Nền tảng mô phỏng mạng xã hội sử dụng mô hình đa tác tử (Multi-agent System)',
        field: 'Trí tuệ Nhân tạo & Phân tích Dữ liệu',
        institution: 'Khoa Công nghệ Thông tin, DUT',
        summary: 'Ứng dụng Multi-agent AI để mô phỏng hành vi và xu hướng người dùng trên mạng xã hội phục vụ nghiên cứu và truyền thông.'
      },
      {
        rank: 'Top 7 Chung kết',
        name: 'Đội Nexus',
        projectTitle: 'Nexus: Robot giáo dục thông minh ứng dụng STEM và AI tương tác',
        field: 'Robotics & EdTech',
        institution: 'Trường Đại học Bách khoa – ĐHĐN',
        summary: 'Robot giáo dục hỗ trợ học sinh thực hành lập trình, tự động hóa và tư duy giải quyết vấn đề qua phương pháp STEM.'
      },
      {
        rank: 'Top 7 Chung kết',
        name: 'Đội WaveX NextGen',
        projectTitle: 'WaveX NextGen: Hệ thống kè chắn sóng đa chức năng tích hợp bảo vệ bờ biển và thu hoạch năng lượng sạch',
        field: 'Năng lượng Tái tạo & Kỹ thuật Biển',
        institution: 'Trường Đại học Bách khoa – ĐHĐN',
        summary: 'Giải pháp công trình kè biển thế hệ mới vừa giảm xói lở bờ biển vừa chuyển đổi cơ năng sóng biển thành điện năng sạch.'
      }
    ]
  }
];

export const SHARK_STAGES_TIMELINE = [
  { step: '01', title: 'Phát động & Tiếp nhận Hồ sơ', desc: 'Các đội thi đăng ký trực tuyến qua cổng BK-IC Digital Hub, nộp bản tóm tắt ý tưởng và thành viên.' },
  { step: '02', title: 'Chuỗi Đào tạo Chuyên sâu (4 Buổi)', desc: 'Huấn luyện về Value Proposition, Lean Startup, tài chính và kỹ năng pitching cùng các chuyên gia Bách khoa.' },
  { step: '03', title: 'Vòng Sơ khảo & Thẩm định MVP', desc: 'Ban Giám khảo đánh giá mô hình thực tế, phỏng vấn và lựa chọn Top 7 đội xuất sắc vào Chung kết.' },
  { step: '04', title: 'Sân khấu Chung kết (Pitching)', desc: 'Pitching trực tiếp và trả lời chất vấn phản biện từ các Shark, chuyên gia đầu tư tại Ngày hội BKDN 2026.' },
  { step: '05', title: 'Vinh danh & Kết nối Ươm tạo', desc: 'Trao thưởng giải Nhất, Nhì, Ba, cấp vốn phát triển và tiến cử tham gia Vòng Chung kết cấp ĐHĐN.' }
];

export const SHARK_MENTORS = [
  {
    name: 'TS. Nguyễn Thị Anh Thư',
    role: 'Chuyên gia Cố vấn STEAM & ĐMST',
    org: 'Khoa Điện tử & AI, Trường ĐH Bách khoa – ĐHĐN',
    field: 'Khởi nghiệp Tinh gọn (Lean Startup) & Chuyển đổi số'
  },
  {
    name: 'TS. Nguyễn Hồng Nguyên',
    role: 'Chuyên gia Cố vấn Khởi nghiệp',
    org: 'Trường Đại học Bách khoa – ĐHĐN',
    field: 'Thiết kế Giải pháp Giá trị (Value Proposition)'
  },
  {
    name: 'Hội đồng Giám khảo & Quỹ Đối tác',
    role: 'Ban Giám khảo Vòng Chung kết',
    org: 'Vườn ươm Sông Hàn (SHi) & Danang Fintech Lab',
    field: 'Thẩm định Đầu tư, Mô hình Kinh doanh & Ươm tạo'
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

