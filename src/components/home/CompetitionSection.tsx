// BK-IC Digital Hub — Competitions Section Component
// Gallery Carousel with 3 cards (Desktop), 2 cards (Tablet), 1 card (Mobile) with ScrollReveal & Light Trails
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';
import { CompetitionCarousel } from './CompetitionCarousel';
import { ScrollReveal } from '../effects/ScrollReveal';
import { GlowingLightTrails } from '../effects/GlowingLightTrails';
import { HOME_COMPETITIONS_DATA, type CompetitionItem } from '../../data/homeData';

interface CompetitionSectionProps {
  items?: CompetitionItem[];
}

export const CompetitionSection: React.FC<CompetitionSectionProps> = ({
  items = HOME_COMPETITIONS_DATA
}) => {
  return (
    <section
      id="competitions"
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Floating Wave Light Trails Backdrop */}
      <div className="absolute top-1/2 -left-20 w-[600px] pointer-events-none -z-10 opacity-60">
        <GlowingLightTrails variant="section-flow" />
      </div>

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-pulse-glow" />

      {/* Section Header with ScrollReveal */}
      <ScrollReveal direction="up" distance={20} duration={0.6}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 sm:pb-7 border-b border-slate-200/80">
          <SectionHeading
            eyebrow="SÂN CHƠI ĐỔI MỚI SÁNG TẠO"
            title="Cuộc thi Sáng tạo và Khởi Nghiệp"
            subtitle="Các cuộc thi do BK-IC tổ chức, đồng hành hoặc phối hợp với các tổ chức và doanh nghiệp nhằm tìm kiếm và ươm tạo tài năng trẻ."
          />
        </div>
      </ScrollReveal>

      {/* Carousel or Empty State with ScrollReveal */}
      <ScrollReveal direction="up" distance={28} delay={0.15} duration={0.7} className="mt-8">
        {items.length > 0 ? (
          <CompetitionCarousel items={items} />
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/50 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Hiện chưa có cuộc thi nào mở</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Các cuộc thi và giải đấu công nghệ mới sẽ được công bố sớm. Đăng ký nhận tin để không bỏ lỡ cơ hội!
            </p>
          </div>
        )}
      </ScrollReveal>

      {/* Bottom CTA Button with ScrollReveal */}
      {items.length > 0 && (
        <ScrollReveal direction="up" distance={16} delay={0.25} duration={0.5} className="mt-6 sm:mt-8 text-center">
          <Link
            to="/activities/competitions"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-[#0284C7] text-xs sm:text-sm font-bold hover:bg-gradient-to-r hover:from-[#0284C7] hover:to-[#38BDF8] hover:text-white hover:border-transparent shadow-xs hover:shadow-[0_12px_28px_-8px_rgba(56,189,248,0.35)] transition-all duration-300 group"
          >
            <span>Xem tất cả cuộc thi</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      )}
    </section>
  );
};
