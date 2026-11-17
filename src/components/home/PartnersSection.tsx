// BK-IC Digital Hub — Partners & Ecosystem Section Component
// Centered Logo Showcase grouped by partnership tiers + Center-aligned Collaboration CTA Card
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Handshake, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';
import { PartnerLogoCard } from './PartnerLogoCard';
import { HOME_PARTNERS_DATA, type PartnerItem } from '../../data/homeData';

interface PartnersSectionProps {
  partners?: PartnerItem[];
}

const CATEGORIES: Array<PartnerItem['category']> = [
  'Đơn vị bảo trợ',
  'Đối tác chiến lược',
  'Đối tác đồng hành'
];

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  partners = HOME_PARTNERS_DATA
}) => {
  return (
    <section
      id="partners"
      className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 border-t border-slate-200/80"
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-b from-transparent via-[#C8DCF8]/30 to-[#B8D3F6]/50 pointer-events-none -z-10" />

      {/* Section Header — Center Aligned */}
      <div className="text-center max-w-3xl mx-auto pb-6 sm:pb-8">
        <SectionHeading
          align="center"
          eyebrow="MẠNG LƯỚI ĐỒNG HÀNH"
          title="Đối tác &amp; Hệ sinh thái"
          subtitle="Mạng lưới Nhà trường, Vườn ươm khởi nghiệp, Quỹ đầu tư và Doanh nghiệp công nghệ đồng hành cùng BK-IC."
        />
        <div className="mt-4">
          <Link
            to="/partnership/partners"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:text-[#245BFA] transition-colors group"
            aria-label="Xem toàn bộ mạng lưới đối tác"
          >
            <span>Xem toàn bộ mạng lưới đối tác</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Grouped Logo Showcase — Center Aligned Flex Rows */}
      <div className="mt-6 space-y-12">
        {CATEGORIES.map((category) => {
          const categoryPartners = partners
            .filter((p) => p.category === category)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          if (categoryPartners.length === 0) return null;

          return (
            <div key={category} className="space-y-5 text-center">
              {/* Centered Category Heading with Flanking Accent Lines */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px bg-slate-200 w-10 sm:w-20" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {category}
                </span>
                <div className="h-px bg-slate-200 w-10 sm:w-20" />
              </div>

              {/* Centered Partner Logo Grid/Row */}
              <div className="flex flex-wrap items-stretch justify-center gap-3.5 sm:gap-4.5 max-w-5xl mx-auto">
                {categoryPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[220px] lg:w-[220px] max-w-[240px]"
                  >
                    <PartnerLogoCard partner={partner} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Collaboration CTA Card — Center Aligned */}
      <div className="mt-16 sm:mt-20 relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#050814] via-[#0A1432] to-[#1749B5] text-white p-8 sm:p-12 shadow-2xl text-center">
        {/* Glow Streaks */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#6B9DFF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#1749B5]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#A8C7FF] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HỢP TÁC &amp; ĐỒNG HÀNH</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Cùng BK-IC kiến tạo những giá trị mới
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Chúng tôi luôn chào đón các tổ chức, doanh nghiệp, cố vấn và nhà đầu tư cùng chung tay xây dựng hệ sinh thái đổi mới sáng tạo vững mạnh cho sinh viên Bách khoa.
          </p>

          <div className="pt-2">
            <Link
              to="/partnership"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0A1432] text-xs sm:text-sm font-bold hover:bg-[#6B9DFF] hover:text-white shadow-xl shadow-black/20 transition-all duration-300 group cursor-pointer"
            >
              <Handshake className="w-4 h-4 text-[#1749B5] group-hover:text-white transition-colors" />
              <span>Kết nối hợp tác</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
