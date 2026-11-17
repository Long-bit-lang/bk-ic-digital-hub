// BK-IC About Page — Minimalist Editorial & Institutional Storytelling
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/editorial/SectionHeading';
import { Breadcrumbs } from '../components/editorial/Breadcrumbs';
import { CTASection } from '../components/editorial/CTASection';
import { 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Compass, 
  Award, 
  Users, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  UserCheck, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Target, 
  Zap, 
  Network,
  Cpu as Microchip,
  Leaf,
  Coins,
  Palette
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const units = [
    {
      code: 'BCN',
      name: 'Ban Chủ nhiệm',
      badgeClass: 'bg-blue-50 text-[#1749B5] border-blue-200',
      icon: Shield,
      role: 'Chủ nhiệm CLB: Phạm Lê Tú',
      desc: 'Cơ quan lãnh đạo cao nhất, chịu trách nhiệm pháp lý và định hướng chiến lược trước Nhà trường.',
      duties: [
        'Chỉ đạo chiến lược dài hạn và ký duyệt các quyết định quan trọng',
        'Phê duyệt kế hoạch ngân sách và phân bổ nguồn lực toàn diện',
        'Đại diện đối ngoại với Nhà trường, Hội đồng Cố vấn & Doanh nghiệp'
      ]
    },
    {
      code: 'BĐH',
      name: 'Ban Điều hành',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Cpu,
      role: 'Trưởng ban: Lê Anh Khoa',
      desc: 'Cơ quan điều hành chuyên môn, chịu trách nhiệm học liệu kỹ thuật, sinh hoạt thứ Ba và ươm tạo dự án.',
      duties: [
        'Tổ chức các buổi sinh hoạt định kỳ thứ Ba và Workshop công nghệ',
        'Bảo trợ và quản lý tiến độ các dự án nghiên cứu khoa học sinh viên',
        'Điều phối diễn giả, cố vấn chuyên môn và tài liệu học tập'
      ]
    },
    {
      code: 'BTV',
      name: 'Ban Thành viên',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: UserCheck,
      role: 'Trưởng ban: Nguyễn Hoàng Long',
      desc: 'Cơ quan nhân sự số hóa, vận hành hệ thống điểm danh QR, kiểm soát chuyên cần và văn hóa nội bộ.',
      duties: [
        'Quản lý hồ sơ định danh số thành viên trên BK-IC Digital Hub',
        'Vận hành hệ thống điểm danh QR động, xử lý vé phạt và khiếu nại',
        'Chăm lo đời sống nội bộ, văn hóa gắn kết và đánh giá rèn luyện'
      ]
    }
  ];

  const tracks = [
    {
      icon: Microchip,
      title: 'AI & Embedded IoT',
      desc: 'Nghiên cứu ứng dụng trí tuệ nhân tạo biên, vi điều khiển thông minh và các hệ thống cảm biến công nghiệp.'
    },
    {
      icon: Leaf,
      title: 'Green Tech & Clean Energy',
      desc: 'Phát triển các giải pháp giám sát năng lượng, xử lý rác thải thông minh và công nghệ giảm phát thải carbon.'
    },
    {
      icon: Coins,
      title: 'FinTech & Digital Economy',
      desc: 'Ứng dụng chuyển đổi số trong tài chính sinh viên, thương mại điện tử phi tập trung và quản lý chi tiêu thông minh.'
    },
    {
      icon: Palette,
      title: 'EdTech & Creative Workspace',
      desc: 'Xây dựng các công cụ hỗ trợ học tập trực quan, số hóa dữ liệu phòng thí nghiệm và không gian sáng tạo mở.'
    }
  ];

  const whyJoinReasons = [
    {
      icon: Zap,
      title: '1. Rèn luyện Kỹ thuật Thực chiến',
      desc: 'Tiếp cận các công nghệ mới (AI, Embedded IoT, Cloud, CleanTech) thông qua các bài toán kỹ thuật từ doanh nghiệp, không dừng lại ở lý thuyết trên giảng đường.'
    },
    {
      icon: Target,
      title: '2. Hiện thực hóa Đề tài NCKH',
      desc: 'Được hỗ trợ cơ sở vật chất tại phòng Lab, máy in 3D, thiết bị đo kiểm và nhận tài trợ kinh phí hoàn thiện mẫu thử (prototype) tham gia các kỳ thi quốc gia.'
    },
    {
      icon: Users,
      title: '3. Kết nối Cố vấn & Doanh nghiệp',
      desc: 'Làm việc trực tiếp cùng các thầy cô giảng viên tâm huyết và các chuyên gia cấp cao từ các tập đoàn công nghệ lớn, mở rộng mạng lưới nghề nghiệp.'
    },
    {
      icon: Award,
      title: '4. Chứng nhận & Điểm Rèn luyện',
      desc: 'Ghi nhận đóng góp chính thức từ Ban Chủ nhiệm, hỗ trợ cộng điểm rèn luyện cấp Trường và cấp Giấy chứng nhận hoàn thành nhiệm kỳ phục vụ xét học bổng.'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#10182D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Về chúng tôi' }]} />

        {/* ========================================================================= */}
        {/* 1. GIỚI THIỆU CLB (#intro)                                                */}
        {/* ========================================================================= */}
        <section id="intro" className="space-y-6 scroll-mt-24">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1749B5]/20 bg-[#1749B5]/10 px-3.5 py-1 text-xs font-semibold text-[#1749B5]">
              <Building2 className="h-3.5 w-3.5" />
              <span>TRƯỜNG ĐẠI HỌC BÁCH KHOA – ĐẠI HỌC ĐÀ NẴNG (DUT)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#10182D] leading-tight">
              Về Bách Khoa Innovation Club (BK-IC)
            </h1>

            <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed font-normal">
              Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo trực thuộc <strong className="text-[#10182D]">Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa, Đại học Đà Nẵng</strong>. Nơi ươm mầm tinh thần doanh nhân công nghệ và kết nối sinh viên kỹ thuật Bách khoa với hệ sinh thái khởi nghiệp quốc gia.
            </p>
          </div>

          {/* Căn cứ xuất xứ Báo Đà Nẵng */}
          <div className="rounded-3xl border border-[#E2E6EE] bg-white p-7 sm:p-10 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1749B5] uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Hồ sơ Xuất xứ &amp; Căn cứ Pháp lý</span>
            </div>

            <h2 className="text-2xl font-bold text-[#10182D]">
              Ghi nhận chính thức từ Báo Đà Nẵng (04/04/2026)
            </h2>

            <p className="text-sm text-[#5E6573] leading-relaxed font-normal">
              Theo bài viết <em className="text-slate-800 font-semibold">"Thúc đẩy liên kết trong khởi nghiệp"</em> xuất bản ngày 04/04/2026 trên Báo Đà Nẵng, Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo - Bách Khoa Innovation Club (BK-IC) chính thức được thành lập nhằm tạo môi trường kết nối đa ngành, chuyển giao công nghệ sinh viên và đóng góp giải pháp đổi mới cho thành phố.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F5F6F8] p-5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Tên tiếng Việt:</span>
                <strong className="text-slate-800">Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tên quốc tế:</span>
                <strong className="text-slate-800">BachKhoa Innovation and Entrepreneurship Club (BK-IC)</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Đơn vị trực thuộc:</span>
                <strong className="text-slate-800">Đoàn Thanh niên – Hội Sinh viên Trường ĐH Bách khoa (DUT)</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Trụ sở hoạt động:</span>
                <strong className="text-slate-800">54 Nguyễn Lương Bằng, Liên Chiểu, TP. Đà Nẵng</strong>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://baodanang.vn/thuc-day-lien-ket-trong-khoi-nghiep-3330893.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1749B5] hover:underline"
              >
                <span>Đọc nguyên văn bài viết trên Báo Đà Nẵng điện tử</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. LĨNH VỰC HOẠT ĐỘNG (#fields)                                          */}
        {/* ========================================================================= */}
        <section id="fields" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <SectionHeading
            eyebrow="LĨNH VỰC HOẠT ĐỘNG"
            title="Các Trụ cột Công nghệ Trọng điểm"
            subtitle="BK-IC tập trung nguồn lực ươm tạo và phát triển các giải pháp giải quyết trực tiếp các bài toán kỹ thuật hiện đại."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tracks.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E2E6EE] bg-white p-7 shadow-xs space-y-3 hover:border-[#6B9DFF] transition"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#1749B5] w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#10182D]">{t.title}</h3>
                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. VÌ SAO GIA NHẬP BK-IC? (#why-join)                                    */}
        {/* ========================================================================= */}
        <section id="why-join" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <SectionHeading
            eyebrow="GIÁ TRỊ CỐT LÕI"
            title="Vì sao nên gia nhập Bách Khoa Innovation Club?"
            subtitle="Một môi trường mở, tôn trọng sáng tạo cá nhân và luôn đồng hành cùng sự trưởng thành của từng thành viên."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyJoinReasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E2E6EE] bg-white p-7 shadow-xs space-y-3 hover:border-[#6B9DFF] transition"
                >
                  <div className="p-2.5 rounded-xl bg-[#F5F6F8] text-[#1749B5] w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#10182D]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TẦM NHÌN VÀ SỨ MỆNH (#vision-mission)                                  */}
        {/* ========================================================================= */}
        <section id="vision-mission" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <SectionHeading
            eyebrow="ĐỊNH HƯỚNG PHÁT TRIỂN"
            title="Tầm nhìn &amp; Sứ mệnh Dài hạn"
            subtitle="Xây dựng nền tảng vững chắc để đưa sản phẩm trí tuệ sinh viên Bách khoa vươn xa."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-[#E2E6EE] bg-white p-8 space-y-4 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1749B5]/10 text-[#1749B5]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#10182D]">Tầm nhìn</h3>
              <p className="text-sm text-[#5E6573] leading-relaxed font-normal">
                Trở thành cộng đồng đổi mới sáng tạo sinh viên hàng đầu miền Trung, nơi mỗi ý tưởng táo bạo của sinh viên Bách khoa được tiếp sức bằng cố vấn chuyên môn, công cụ kỹ thuật và nguồn lực thực tiễn để vươn tầm thị trường.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E2E6EE] bg-white p-8 space-y-4 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#10182D]">Sứ mệnh</h3>
              <p className="text-sm text-[#5E6573] leading-relaxed font-normal">
                Thúc đẩy tư duy khởi nghiệp trong học tập và nghiên cứu; hỗ trợ thương mại hóa đề tài nghiên cứu khoa học; đào tạo thế hệ kỹ sư giàu bản lĩnh, chủ động thích ứng và dẫn dắt cuộc cách mạng chuyển đổi số.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CƠ CẤU TỔ CHỨC (#structure)                                            */}
        {/* ========================================================================= */}
        <section id="structure" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeading
              eyebrow="BỘ MÁY CHÍNH THỨC"
              title="Cơ cấu 3 Ban Vận hành BK-IC"
              subtitle="Cơ cấu tinh gọn gồm đúng 3 ban chức năng đảm bảo tính minh bạch, chuyên môn hóa và phân quyền rõ ràng."
            />
            <span className="text-xs font-semibold text-slate-400">DUT • 2026</span>
          </div>

          {/* Org Tree Overview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-4">
            <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Cơ quan bảo trợ &amp; cố vấn</span>
              <strong className="text-sm text-[#10182D]">Đoàn Thanh niên – Hội Sinh viên ĐH Bách khoa (DUT)</strong>
              <div className="text-xs text-slate-500 mt-0.5">Trung tâm Hỗ trợ sinh viên &amp; Quan hệ doanh nghiệp</div>
            </div>

            <div className="w-0.5 h-6 bg-slate-200 mx-auto"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {units.map((unit) => {
                const Icon = unit.icon;
                return (
                  <div
                    key={unit.code}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6B9DFF] transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${unit.badgeClass}`}>
                          {unit.code}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {unit.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="text-base font-extrabold text-[#10182D]">
                          {unit.name}
                        </h4>
                      </div>

                      <p className="text-xs text-[#5E6573] leading-relaxed">
                        {unit.desc}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          Chức năng chính:
                        </span>
                        <ul className="space-y-1">
                          {unit.duties.map((duty, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#1749B5] shrink-0 mt-0.5" />
                              <span>{duty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Phân quyền độc lập</span>
                      <span className="text-[#1749B5] font-semibold">Chính thức</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <CTASection
          eyebrow="GIA NHẬP BK-IC"
          title="Trở thành một phần của thế hệ sinh viên đổi mới sáng tạo"
          description="Cùng nhau xây dựng sản phẩm, tham gia các giải đấu kỹ thuật và mở rộng cánh cửa sự nghiệp công nghệ."
          primaryText="Ứng tuyển thành viên mới"
          primaryTo="/activities/recruitment"
          secondaryText="Liên hệ hợp tác"
          secondaryTo="/partnership"
        />
      </div>
    </div>
  );
};
