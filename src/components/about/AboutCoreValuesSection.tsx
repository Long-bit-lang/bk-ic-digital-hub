// BK-IC About Page — Section 05: Tại sao bạn nên gia nhập BK-IC? (Why Join BK-IC?)
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Rocket, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

interface WhyJoinCardItem {
  id: string;
  num: string;
  title: string;
  englishTitle: string;
  badge: string;
  description: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  icon: React.ComponentType<{ className?: string }>;
  colSpanClass: string;
}

const WHY_JOIN_ITEMS: WhyJoinCardItem[] = [
  {
    id: 'creative-mindset',
    num: '01',
    title: 'Khởi mở tư duy sáng tạo',
    englishTitle: 'Creative Mindset',
    badge: 'TƯ DUY ĐMST',
    description: 'Tiếp cận tư duy khởi nghiệp và phương pháp giải quyết vấn đề sáng tạo. Học cách biến ý tưởng từ con số 0 thành giải pháp có giá trị thực tiễn.',
    iconBg: 'bg-[#1749B5] text-white',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#1749B5]',
    borderHover: 'hover:border-[#1749B5]',
    icon: Sparkles,
    colSpanClass: 'lg:col-span-2'
  },
  {
    id: 'professional-development',
    num: '02',
    title: 'Học hỏi và phát triển chuyên môn',
    englishTitle: 'Professional Development',
    badge: 'CHUYÊN MÔN',
    description: 'Tham gia các chương trình đào tạo, workshop chuyên sâu và buổi chia sẻ từ các chuyên gia, giảng viên và doanh nhân giàu kinh nghiệm.',
    iconBg: 'bg-[#0284C7] text-white',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-[#0284C7]',
    borderHover: 'hover:border-sky-500',
    icon: GraduationCap,
    colSpanClass: 'lg:col-span-2'
  },
  {
    id: 'hands-on-experience',
    num: '03',
    title: 'Trải nghiệm dự án thực tế',
    englishTitle: 'Hands-on Experience',
    badge: 'THỰC CHIẾN DỰ ÁN',
    description: 'Không chỉ dừng lại ở lý thuyết, bạn được trực tiếp tham gia nghiên cứu, phát triển sản phẩm và vận hành các dự án khởi nghiệp tiềm năng.',
    iconBg: 'bg-[#4F46E5] text-white',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    borderHover: 'hover:border-indigo-500',
    icon: Rocket,
    colSpanClass: 'lg:col-span-2'
  },
  {
    id: 'networking-opportunities',
    num: '04',
    title: 'Mở rộng mạng lưới kết nối',
    englishTitle: 'Networking Opportunities',
    badge: 'MẠNG LƯỚI KẾT NỐI',
    description: 'Gặp gỡ những người bạn cùng chí hướng, kết nối với mentor, cựu sinh viên thành công và các doanh nghiệp công nghệ hàng đầu.',
    iconBg: 'bg-[#0EA5E9] text-white',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-[#0284C7]',
    borderHover: 'hover:border-cyan-500',
    icon: Users,
    colSpanClass: 'lg:col-span-3'
  },
  {
    id: 'career-opportunities',
    num: '05',
    title: 'Khám phá cơ hội phát triển',
    englishTitle: 'Career Opportunities',
    badge: 'CƠ HỘI NGHỀ NGHIỆP',
    description: 'Tiếp cận các cơ hội thực tập, việc làm, học bổng và các chương trình hỗ trợ khởi nghiệp từ nhà trường và đối tác.',
    iconBg: 'bg-[#059669] text-white',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-600',
    borderHover: 'hover:border-emerald-500',
    icon: TrendingUp,
    colSpanClass: 'lg:col-span-3'
  }
];

export const AboutCoreValuesSection: React.FC = () => {
  return (
    <section id="why-join" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      {/* Anchor for backward compatibility with #core-values */}
      <span id="core-values" className="absolute -top-24" />

      <SectionHeading
        eyebrow="05 • TẠI SAO BẠN NÊN GIA NHẬP BK-IC? (WHY JOIN BK-IC?)"
        title="Không chỉ tham gia một câu lạc bộ, hãy trở thành người kiến tạo tương lai!"
        subtitle="Gia nhập BK-IC là cơ hội để bạn bước ra khỏi giới hạn của những kiến thức trên giảng đường, khám phá tiềm năng bản thân và trực tiếp tham gia vào hành trình nghiên cứu, đổi mới sáng tạo và phát triển các dự án thực tế."
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 items-stretch">
        {WHY_JOIN_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`group rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-7 sm:p-8 shadow-md shadow-slate-900/5 ${item.borderHover} hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${item.colSpanClass}`}
            >
              {/* Background Big Typographic Index Watermark */}
              <span className="absolute -top-6 -right-3 text-7xl sm:text-8xl font-black font-mono text-slate-100 group-hover:text-blue-50/70 select-none pointer-events-none transition-colors duration-300">
                {item.num}
              </span>

              <div className="space-y-5 relative z-10">
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shadow-blue-900/10 ${item.iconBg}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full ${item.badgeBg} ${item.badgeText}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Main Titles */}
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#10182D] group-hover:text-[#1749B5] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-[#1749B5] font-mono uppercase tracking-wider">
                    {item.englishTitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom Quote Accent */}
              <div className="pt-4 mt-6 border-t border-slate-100 relative z-10 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Trải nghiệm tại BK-IC</span>
                <span className="font-mono text-[#1749B5] font-semibold">{item.num} / 05</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recruitment Callout Banner */}
      <div className="mt-8 rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-bold font-mono tracking-wider text-[#1749B5] uppercase">
            GIA NHẬP THẾ HỆ TIẾP THEO
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-[#10182D]">
            Sẵn sàng để thử thách bản thân và kiến tạo giá trị?
          </h4>
          <p className="text-xs sm:text-sm text-[#475467]">
            Theo dõi đợt tuyển thành viên mới của BK-IC và chuẩn bị hồ sơ ứng tuyển ngay hôm nay.
          </p>
        </div>
        <Link
          to="/activities/tuyen-thanh-vien"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1749B5] hover:bg-[#245BFA] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/10 transition-all hover:shadow-lg hover:shadow-blue-900/20"
        >
          <span>Cổng tuyển thành viên</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};
