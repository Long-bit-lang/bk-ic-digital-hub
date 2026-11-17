// BK-IC About Page — Section 05: Core Values (CONNECT - CREATE - IMPACT)
import React from 'react';
import { Share2, Sparkles, Rocket, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

interface ValueCardItem {
  id: string;
  num: string;
  keyword: string;
  translation: string;
  lead: string;
  description: string;
  accentGradient: string;
  borderHover: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VALUES: ValueCardItem[] = [
  {
    id: 'connect',
    num: '01',
    keyword: 'CONNECT',
    translation: 'KẾT NỐI',
    lead: 'Cộng hưởng nguồn lực & Chia sẻ tri thức',
    description: 'Đề cao tinh thần hợp tác, chia sẻ tri thức và kết nối con người. Tin rằng những ý tưởng có tiềm năng sẽ phát triển tốt hơn khi được đặt trong một môi trường có sự đồng hành và cộng hưởng nguồn lực.',
    accentGradient: 'from-[#1749B5] via-[#245BFA] to-[#6B9DFF]',
    borderHover: 'hover:border-[#1749B5]',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#1749B5]',
    iconBg: 'bg-[#1749B5] text-white',
    icon: Share2
  },
  {
    id: 'create',
    num: '02',
    keyword: 'CREATE',
    translation: 'SÁNG TẠO',
    lead: 'Tư duy độc lập & Dám nghĩ dám làm',
    description: 'Khuyến khích tư duy độc lập, tinh thần chủ động và sự sẵn sàng thử nghiệm. Mỗi thành viên được khuyến khích không ngừng học hỏi, khám phá và tìm kiếm những cách tiếp cận mới.',
    accentGradient: 'from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]',
    borderHover: 'hover:border-sky-500',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-600',
    iconBg: 'bg-[#0EA5E9] text-white',
    icon: Sparkles
  },
  {
    id: 'impact',
    num: '03',
    keyword: 'IMPACT',
    translation: 'TẠO GIÁ TRỊ',
    lead: 'Chuyển hóa tri thức thành hành động thực tế',
    description: 'Hướng đến việc chuyển hóa kiến thức và ý tưởng thành những kết quả có ý nghĩa. Đề cao tính ứng dụng, trách nhiệm và giá trị thực tiễn trong mỗi hoạt động.',
    accentGradient: 'from-[#4F46E5] via-[#6366F1] to-[#818CF8]',
    borderHover: 'hover:border-indigo-500',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    iconBg: 'bg-[#6366F1] text-white',
    icon: Rocket
  }
];

export const AboutCoreValuesSection: React.FC = () => {
  return (
    <section id="core-values" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="05 • GIÁ TRỊ CỐT LÕI"
        title="Những giá trị định hình BK-IC"
        subtitle="Ba trụ cột văn hóa cốt lõi dẫn dắt mọi định hướng tư duy, sáng tạo và hành động của các thế hệ thành viên Bách khoa."
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {VALUES.map((val) => {
          const Icon = val.icon;
          return (
            <div
              key={val.id}
              className={`group rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-7 sm:p-8 shadow-md shadow-slate-900/5 ${val.borderHover} hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
            >
              {/* Background Big Typographic Index Watermark */}
              <span className="absolute -top-6 -right-3 text-7xl sm:text-8xl font-black font-mono text-slate-100 group-hover:text-blue-50/70 select-none pointer-events-none transition-colors duration-300">
                {val.num}
              </span>

              <div className="space-y-6 relative z-10">
                {/* Header: Icon + Keyword Badge */}
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shadow-blue-900/10 ${val.iconBg}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full ${val.badgeBg} ${val.badgeText}`}>
                    {val.keyword}
                  </span>
                </div>

                {/* Main Titles */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#10182D]">
                    {val.translation}
                  </h3>
                  <p className="text-xs font-bold text-[#1749B5] uppercase tracking-wider">
                    {val.lead}
                  </p>
                </div>

                {/* Philosophy Description */}
                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>

              {/* Bottom Quote Accent */}
              <div className="pt-4 mt-6 border-t border-slate-100 relative z-10 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Văn hóa hành động</span>
                <span className="font-mono text-[#1749B5]">BK-IC DNA</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

