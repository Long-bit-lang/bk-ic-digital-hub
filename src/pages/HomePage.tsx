// BK-IC Digital Hub — Minimalist Editorial & Modern Tech Homepage
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SectionHeading } from '../components/editorial/SectionHeading';
import { Button } from '../components/editorial/Buttons';
import { EditorialCard, ActivityCard, CompetitionCard } from '../components/editorial/EditorialCards';
import { CTASection } from '../components/editorial/CTASection';
import { 
  Rocket, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Users, 
  Award, 
  ExternalLink, 
  Cpu, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { sessions, siteSettings } = useApp();

  // Featured Banner Tabs
  const [activeBannerTab, setActiveBannerTab] = useState<'recruitment' | 'workshop' | 'competition' | 'sports'>('recruitment');

  const banners = {
    recruitment: {
      tag: 'TUYỂN THÀNH VIÊN GEN 2026',
      title: 'Khơi nguồn bản lĩnh sáng tạo cùng BK-IC DUT',
      desc: 'Cơ hội trở thành thành viên chính thức thuộc 3 Ban: Ban Chủ nhiệm, Ban Điều hành, Ban Thành viên. Môi trường tôi luyện kỹ năng, làm đồ án thực tế và kết nối mạng lưới doanh nghiệp công nghệ.',
      ctaText: 'Đăng ký ứng tuyển ngay',
      ctaTo: '/activities/recruitment',
      badge: siteSettings?.recruitmentStatus === 'open' ? 'Đang mở đơn' : 'Đợt tuyển tiếp theo',
      accentColor: 'from-[#1749B5] to-[#10182D]'
    },
    workshop: {
      tag: 'WORKSHOP THƯỜNG NIÊN',
      title: 'Chuỗi Seminar Chuyên sâu: AI ứng dụng & Embedded IoT',
      desc: 'Phiên thảo luận định kỳ thứ Ba hằng tuần cùng các chuyên gia hàng đầu từ Khoa CNTT, Khoa Điện tử - Viễn thông và các kỹ sư cấp cao từ doanh nghiệp đối tác.',
      ctaText: 'Xem lịch & Đăng ký tham gia',
      ctaTo: '/activities/workshops',
      badge: 'Thứ Ba 17:30',
      accentColor: 'from-[#1749B5] to-[#10182D]'
    },
    competition: {
      tag: 'CUỘC THI KHỞI NGHIỆP',
      title: 'BK Innovation Hackathon & Sân khấu Pitching BK Shark',
      desc: 'Đấu trường công nghệ quy mô dành cho sinh viên kỹ thuật. Nơi các đề tài NCKH xuất sắc được ươm tạo, nhận vốn đầu tư thiên thần và thương mại hóa sản phẩm.',
      ctaText: 'Khám phá cuộc thi',
      ctaTo: '/activities/competitions',
      badge: 'Tổng thưởng 100M+',
      accentColor: 'from-[#1749B5] to-[#10182D]'
    },
    sports: {
      tag: 'SINH HOẠT VĂN THỂ MỸ',
      title: 'Giải Bóng đá Thường niên BK-IC Cup & Teambuilding',
      desc: 'Gắn kết tinh thần đồng đội giữa các thế hệ thành viên BCN, BĐH và BTV qua các giải đấu thể thao và hoạt động ngoại khóa giàu năng lượng.',
      ctaText: 'Xem khoảnh khắc nội bộ',
      ctaTo: '/activities/internal',
      badge: 'Nội bộ CLB',
      accentColor: 'from-[#1749B5] to-[#10182D]'
    }
  };

  const currentBanner = banners[activeBannerTab];

  // 4 Core Innovation Tracks
  const tracks = [
    {
      code: 'TRACK 01',
      title: 'Trí tuệ nhân tạo & Cloud',
      desc: 'Nghiên cứu mô hình Edge AI, Computer Vision, Agentic AI và kiến trúc đám mây phục vụ chuyển đổi số.',
      skills: ['TensorFlow', 'PyTorch', 'Google Cloud', 'FastAPI'],
      icon: Cpu
    },
    {
      code: 'TRACK 02',
      title: 'Hệ thống nhúng & IoT',
      desc: 'Thiết kế bo mạch, cảm biến công nghiệp, Smart City và các giải pháp tự động hóa phần cứng.',
      skills: ['STM32', 'ESP32', 'KiCAD', 'MQTT / LoRa'],
      icon: Layers
    },
    {
      code: 'TRACK 03',
      title: 'Công nghệ xanh & CleanTech',
      desc: 'Ứng dụng giải pháp kỹ thuật giải quyết bài toán năng lượng tái tạo, giảm phát thải và kinh tế tuần hoàn.',
      skills: ['Solar Monitoring', 'Battery Analytics', 'ESG Tech'],
      icon: TrendingUp
    },
    {
      code: 'TRACK 04',
      title: 'Ươm tạo Khởi nghiệp & R&D',
      desc: 'Huấn luyện Lean Startup, xác thực mô hình kinh doanh, gọi vốn thiên thần và bảo hộ sở hữu trí tuệ.',
      skills: ['Lean Canvas', 'Pitch Deck', 'IP Patent', 'Venture Capital'],
      icon: Briefcase
    }
  ];

  // News Items
  const newsList = [
    {
      category: 'Thông cáo Báo chí',
      title: 'Ghi nhận từ Báo Đà Nẵng: Thúc đẩy liên kết trong khởi nghiệp cùng BK-IC',
      excerpt: 'Báo Đà Nẵng số ra ngày 04/04/2026 ghi nhận dấu mốc ra mắt chính thức của Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo tại Trường Đại học Bách khoa – ĐHĐN.',
      date: '04/04/2026',
      readTime: '3 phút đọc',
      to: '/news'
    },
    {
      category: 'Sự kiện Nổi bật',
      title: 'Phiên Sinh hoạt Chuyên đề Thứ Ba: Chuẩn hóa Quy trình Quản trị Số hóa',
      excerpt: 'Toàn thể thành viên 3 Ban triển khai thành công hệ thống điểm danh QR động và cổng số hóa nội bộ BK-IC Digital Hub.',
      date: '10/11/2026',
      readTime: '2 phút đọc',
      to: '/activities/internal'
    },
    {
      category: 'Hợp tác Doanh nghiệp',
      title: 'Mở rộng Mạng lưới Cố vấn Kỹ thuật cùng Các Vườn ươm Đổi mới Sáng tạo',
      excerpt: 'Ký kết thỏa thuận hợp tác đào tạo và bảo trợ đề tài tốt nghiệp gắn liền nhu cầu thực tiễn của doanh nghiệp công nghệ tại TP. Đà Nẵng.',
      date: '12/11/2026',
      readTime: '4 phút đọc',
      to: '/partnership'
    }
  ];

  // Competitions
  const competitions = [
    {
      title: 'BK Innovation Hackathon 2026',
      organizer: 'BK-IC & Đoàn Thanh niên DUT',
      deadline: '30/11/2026',
      prize: '50.000.000 VNĐ',
      status: 'open' as const,
      description: 'Cuộc thi sáng tạo giải pháp công nghệ số cho thành phố thông minh. Mở rộng cho sinh viên toàn Đại học Đà Nẵng.'
    },
    {
      title: 'BK Shark — Vòng Pitching Ươm mầm Mùa 3',
      organizer: 'Hội đồng Cố vấn & Doanh nghiệp',
      deadline: '15/12/2026',
      prize: 'Gói bảo trợ 100M+',
      status: 'upcoming' as const,
      description: 'Sân chơi thẩm định ý tưởng khởi nghiệp sinh viên trước các Shark, nhà đầu tư mạo hiểm và quỹ ươm tạo hạt giống.'
    }
  ];

  // Live sessions from AppContext
  const upcomingSessions = (sessions || [])
    .filter(s => s.status === 'scheduled')
    .slice(0, 3);

  // Partners
  const partners = [
    { name: 'Trường Đại học Bách khoa – ĐHĐN (DUT)', label: 'Đơn vị Chủ quản' },
    { name: 'Đoàn Thanh niên – Hội Sinh viên DUT', label: 'Bảo trợ Trực tiếp' },
    { name: 'Trung tâm Hỗ trợ Sinh viên & Quan hệ Doanh nghiệp', label: 'Cố vấn Chiến lược' },
    { name: 'Vườn ươm Doanh nghiệp Đà Nẵng (DNES)', label: 'Đối tác Ươm tạo' },
    { name: 'Mạng lưới Cựu Sinh viên Bách khoa', label: 'Tài trợ & Cố vấn' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#10182D]">
      {/* 1. HERO BANNER — TIN TỨC NỔI BẬT (Editorial Tech Dark Canvas) */}
      <section className="relative overflow-hidden bg-[#10182D] text-white pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-white/10">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#1749B5]/20 blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-[#6B9DFF]/15 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Top Institutional Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#6B9DFF]">
              <Building2 className="h-4 w-4 text-[#6B9DFF]" />
              <span>TRƯỜNG ĐẠI HỌC BÁCH KHOA – ĐẠI HỌC ĐÀ NẴNG</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-400">ĐOÀN THANH NIÊN – HỘI SINH VIÊN</span>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CỔNG THÔNG TIN SỐ HÓA CHÍNH THỨC</span>
            </div>
          </div>

          {/* Banner Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            {[
              { id: 'recruitment', label: '1. Tuyển thành viên' },
              { id: 'workshop', label: '2. Workshop thường niên' },
              { id: 'competition', label: '3. Cuộc thi & BK Shark' },
              { id: 'sports', label: '4. Sự kiện & Văn thể' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveBannerTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeBannerTab === tab.id
                    ? 'bg-[#1749B5] text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hero Banner Main Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#6B9DFF] border border-white/15">
                <Sparkles className="h-3.5 w-3.5 text-[#6B9DFF]" />
                <span>{currentBanner.tag}</span>
                <span className="text-white/40">|</span>
                <span className="text-white">{currentBanner.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                {currentBanner.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                {currentBanner.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  to={currentBanner.ctaTo}
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  {currentBanner.ctaText}
                </Button>

                <Button
                  to="/about"
                  variant="outline-white"
                  size="lg"
                >
                  Tìm hiểu về BK-IC
                </Button>
              </div>
            </div>

            {/* Hero Quick Stat Box */}
            <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 space-y-6">
              <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Tổng quan Hệ sinh thái
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-slate-300">Đơn vị vận hành</span>
                  <strong className="text-sm font-mono text-white">03 Ban Chính thức</strong>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-slate-300">Sinh hoạt định kỳ</span>
                  <strong className="text-sm font-mono text-[#6B9DFF]">Thứ Ba hàng tuần</strong>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-slate-300">Số hóa quản trị</span>
                  <strong className="text-sm font-mono text-emerald-400">100% QR Check-in</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Mạng lưới thành viên</span>
                  <strong className="text-sm font-mono text-white">Đa ngành Bách khoa</strong>
                </div>
              </div>

              <Link
                to="/partnership"
                className="group block rounded-2xl bg-[#1749B5]/30 border border-[#6B9DFF]/30 p-3.5 text-xs text-center font-bold text-[#6B9DFF] hover:bg-[#1749B5] hover:text-white transition"
              >
                <span>Kết nối đối tác & Doanh nghiệp ↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL STATEMENT — BẢN SẮC & SỨ MỆNH */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-[#E2E6EE] pb-20">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1749B5]">
              // 01. VỀ BÁCH KHOA INNOVATION CLUB
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#10182D] leading-tight">
              Nôi ươm mầm tinh thần doanh nhân công nghệ Bách khoa.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[#5E6573] leading-relaxed font-normal">
            <p>
              Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo trực thuộc <strong className="text-[#10182D]">Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa, Đại học Đà Nẵng</strong>. BK-IC hướng đến xây dựng một hệ sinh thái đổi mới sáng tạo thực chiến ngay trong lòng trường đại học.
            </p>
            <p>
              Tại đây, sinh viên kỹ thuật được trang bị tư duy sản phẩm, kết nối cố vấn từ các thầy cô giảng viên, cựu sinh viên và các nhà sáng lập doanh nghiệp để cùng nhau giải quyết những bài toán lớn của xã hội và thị trường.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:text-[#10182D] transition group"
              >
                <span>Xem đầy đủ hồ sơ xuất xứ & cơ cấu 3 Ban</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LĨNH VỰC HOẠT ĐỘNG TRỌNG TÂM (4 Tracks) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="ĐỊNH HƯỚNG CHUYÊN MÔN"
            title="4 Lĩnh vực Công nghệ Tiên phong"
            subtitle="Tập trung phát triển các giải pháp kỹ thuật bám sát thế mạnh đào tạo kỹ sư của Trường ĐH Bách khoa."
          />
          <Link
            to="/activities"
            className="text-xs font-bold text-[#1749B5] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Tất cả chương trình hoạt động</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E2E6EE] bg-white p-6 shadow-xs hover:border-[#6B9DFF] hover:shadow-md transition duration-200 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {t.code}
                    </span>
                    <div className="p-2 rounded-xl bg-[#F5F6F8] text-[#1749B5]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#10182D] leading-snug">
                    {t.title}
                  </h3>

                  <p className="text-xs text-[#5E6573] leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                    Công nghệ thực chiến:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.skills.map((s, i) => (
                      <span key={i} className="text-[10px] font-medium bg-[#F5F6F8] text-slate-700 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOẠT ĐỘNG SẮP DIỄN RA & WORKSHOP THƯỜNG NIÊN */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="LỊCH TRÌNH THỰC TẾ"
            title="Hoạt động & Workshop Sắp diễn ra"
            subtitle="Tham gia các buổi sinh hoạt chuyên môn, cập nhật kiến thức mới cùng cộng đồng BK-IC."
          />
          <Link
            to="/activities/workshops"
            className="text-xs font-bold text-[#1749B5] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Xem lịch workshop thường niên</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <ActivityCard
                key={session.id}
                title={session.title}
                type="Sinh hoạt định kỳ"
                date={session.date}
                time={`${session.startTime} - ${session.endTime}`}
                location={session.location || 'Hội trường Smart Campus, ĐH Bách khoa (DUT)'}
                speaker={session.personInChargeName || 'Ban Chuyên môn BK-IC'}
                status="open"
                statusLabel="Đang mở đăng ký"
                to="/activities/workshops"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard
              title="Seminar: Tối ưu hóa Mô hình Học máy trên Thiết bị Nhúng"
              type="Workshop Công nghệ"
              date="Thứ Ba tuần tới"
              time="17:30 - 19:00"
              location="Phòng Lab Đổi mới sáng tạo, Khu A, ĐH Bách khoa (DUT)"
              speaker="TS. Giảng viên Cố vấn Khoa CNTT"
              status="open"
              statusLabel="Đang nhận đăng ký"
              to="/activities/workshops"
            />
            <ActivityCard
              title="Khóa Huấn luyện: Phương pháp Kiểm chứng Ý tưởng Khởi nghiệp (Lean MVP)"
              type="Bootcamp"
              date="Thứ Ba tuần kế tiếp"
              time="17:30 - 19:30"
              location="Hội trường C, ĐH Bách khoa (DUT)"
              speaker="Chuyên gia Vườn ươm DNES"
              status="open"
              statusLabel="Đang nhận đăng ký"
              to="/activities/workshops"
            />
            <ActivityCard
              title="Phiên Sinh hoạt Toàn thể: Đánh giá Tiến độ Đồ án Sinh viên NCKH"
              type="Sinh hoạt nội bộ"
              date="Thứ Ba hàng tuần"
              time="17:30 - 19:00"
              location="Văn phòng CLB BK-IC (54 Nguyễn Lương Bằng)"
              speaker="Ban Chủ nhiệm & Trưởng Ban"
              status="upcoming"
              statusLabel="Nội bộ CLB"
              to="/activities/internal"
            />
          </div>
        )}
      </section>

      {/* 5. CUỘC THI NỔI BẬT & ĐẤU TRƯỜNG Ý TƯỞNG */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl border border-[#E2E6EE] my-10 shadow-xs">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="ĐẤU TRƯỜNG SÁNG TẠO"
            title="Cuộc thi & Sân khấu BK Shark"
            subtitle="Các sân chơi công nghệ do BK-IC tổ chức hoặc đồng hành phát triển giải pháp thực tiễn."
          />
          <Link
            to="/activities/competitions"
            className="text-xs font-bold text-[#1749B5] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Tất cả cuộc thi & giải thưởng</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {competitions.map((comp, idx) => (
            <CompetitionCard
              key={idx}
              title={comp.title}
              organizer={comp.organizer}
              deadline={comp.deadline}
              prize={comp.prize}
              status={comp.status}
              description={comp.description}
              to="/activities/competitions"
            />
          ))}
        </div>
      </section>

      {/* 6. TIN TỨC VÀ BÀI VIẾT NỔI BẬT (Editorial News) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="TIN TỨC & BÀI BÁO"
            title="Dấu ấn Hoạt động & Truyền thông"
            subtitle="Cập nhật những chuyển động mới nhất của BK-IC trên giảng đường và hệ sinh thái khởi nghiệp."
          />
          <Link
            to="/news"
            className="text-xs font-bold text-[#1749B5] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Xem tất cả tin tức</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((item, idx) => (
            <EditorialCard
              key={idx}
              category={item.category}
              title={item.title}
              excerpt={item.excerpt}
              date={item.date}
              readTime={item.readTime}
              to={item.to}
            />
          ))}
        </div>
      </section>

      {/* 7. ĐỐI TÁC & ĐƠN VỊ ĐỒNG HÀNH */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2E6EE]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            MẠNG LƯỚI ĐỒNG HÀNH
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10182D]">
            Đối tác & Đơn vị Bảo trợ Chiến lược
          </h3>
          <p className="text-xs sm:text-sm text-[#5E6573]">
            Sự hỗ trợ quý báu từ Nhà trường, Quỹ đầu tư và các Doanh nghiệp công nghệ hàng đầu miền Trung.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E2E6EE] bg-white p-5 text-center shadow-xs flex flex-col justify-center items-center space-y-1 hover:border-[#6B9DFF] transition"
            >
              <span className="text-[10px] font-mono font-bold text-[#1749B5] uppercase">
                {p.label}
              </span>
              <strong className="text-xs font-bold text-slate-800 leading-snug">
                {p.name}
              </strong>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/partnership"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:underline"
          >
            <span>Khám phá chính sách hợp tác & tài trợ của BK-IC</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CTASection
          eyebrow="KẾT NỐI VÀ ĐỒNG HÀNH"
          title="Bạn sẵn sàng kiến tạo giải pháp đổi mới sáng tạo cùng sinh viên Bách khoa?"
          description="Dù bạn là doanh nghiệp tìm kiếm nguồn nhân lực kỹ thuật chất lượng, hay sinh viên muốn thử sức với các dự án thực tế, BK-IC luôn sẵn sàng chào đón bạn."
          primaryText="Gửi đề xuất hợp tác"
          primaryTo="/partnership"
          secondaryText="Ứng tuyển thành viên"
          secondaryTo="/activities/recruitment"
        />
      </section>
    </div>
  );
};
