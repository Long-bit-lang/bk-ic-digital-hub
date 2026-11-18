// BK-IC Digital Hub — Partners & Ecosystem Section Component
// Centered Logo Showcase grouped by partnership tiers + Center-aligned Collaboration CTA Card
// Upgraded with ScrollReveal, Glowing Light Trails & Smooth Section Transitions
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Handshake, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';
import { PartnerLogoCard } from './PartnerLogoCard';
import { ScrollReveal } from '../effects/ScrollReveal';
import { GlowingLightTrails } from '../effects/GlowingLightTrails';
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
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Floating Wave Light Trails Backdrop */}
      <div className="absolute top-1/4 -left-20 w-[600px] pointer-events-none -z-10 opacity-50">
        <GlowingLightTrails variant="section-flow" />
      </div>

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-b from-transparent via-[#E0F2FE]/40 to-[#BAE6FD]/30 pointer-events-none -z-10 blur-2xl" />

      {/* Section Header — Center Aligned with ScrollReveal */}
      <ScrollReveal direction="up" distance={20} duration={0.6}>
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#38BDF8] transition-colors group"
              aria-label="Xem toàn bộ mạng lưới đối tác"
            >
              <span>Xem toàn bộ mạng lưới đối tác</span>
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Grouped Logo Showcase — Center Aligned Flex Rows with Staggered ScrollReveal */}
      <div className="mt-6 space-y-12">
        {CATEGORIES.map((category, catIndex) => {
          const categoryPartners = partners
            .filter((p) => p.category === category)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          if (categoryPartners.length === 0) return null;

          return (
            <ScrollReveal
              key={category}
              direction="up"
              distance={24}
              delay={0.1 * catIndex}
              duration={0.6}
              className="space-y-5 text-center"
            >
              {/* Centered Category Heading with Flanking Accent Lines */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-transparent w-12 sm:w-24" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {category}
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-transparent w-12 sm:w-24" />
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
            </ScrollReveal>
          );
        })}
      </div>

      {/* Bottom Collaboration CTA Card — Center Aligned with ScrollReveal */}
      <ScrollReveal direction="scale" distance={10} delay={0.2} duration={0.7} className="mt-16 sm:mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#050814] via-[#0A1432] to-[#0284C7] text-white p-8 sm:p-12 shadow-2xl text-center border border-white/10">
          {/* Glow Streaks & Wave Backdrop */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#38BDF8]/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0284C7]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#BAE6FD] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>HỢP TÁC &amp; ĐỒNG HÀNH</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Cùng BK-IC kiến tạo những giá trị mới
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
              Chúng tôi luôn chào đón các tổ chức, doanh nghiệp, cố vấn và nhà đầu tư cùng chung tay xây dựng hệ sinh thái đổi mới sáng tạo vững mạnh cho sinh viên Bách khoa.
            </p>

            <div className="pt-2">
              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0A1432] text-xs sm:text-sm font-bold hover:bg-gradient-to-r hover:from-[#38BDF8] hover:to-white hover:text-[#0A1432] shadow-xl shadow-black/20 transition-all duration-300 group cursor-pointer"
              >
                <Handshake className="w-4 h-4 text-[#0284C7] group-hover:scale-110 transition-transform" />
                <span>Kết nối hợp tác</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
