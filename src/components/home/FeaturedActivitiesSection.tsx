// BK-IC Digital Hub — Featured Activities Section Component
// Asymmetric Editorial Grid: 1 Large Lead Feature Card (Left) + 2-3 Stacked Supporting Cards (Right)
// Upgraded with ScrollReveal, Glowing Light Trails & Smooth Section Transitions
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';
import { ActivityCard } from './ActivityCard';
import { ScrollReveal } from '../effects/ScrollReveal';
import { GlowingLightTrails } from '../effects/GlowingLightTrails';
import { HOME_ACTIVITIES_DATA, type ActivityItem } from '../../data/homeData';

interface FeaturedActivitiesSectionProps {
  items?: ActivityItem[];
}

export const FeaturedActivitiesSection: React.FC<FeaturedActivitiesSectionProps> = ({
  items = HOME_ACTIVITIES_DATA
}) => {
  // Filter for featured activities
  const featuredItems = items.filter((act) => act.featured);
  const leadItem = featuredItems[0];
  const supportingItems = featuredItems.slice(1, 4);

  return (
    <section
      id="activities"
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Floating Wave Light Trails Backdrop */}
      <div className="absolute top-1/3 -right-24 w-[650px] pointer-events-none -z-10 opacity-55">
        <GlowingLightTrails variant="section-flow" />
      </div>

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none -z-10 blur-3xl" />

      {/* Section Header with ScrollReveal */}
      <ScrollReveal direction="up" distance={20} duration={0.6}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 sm:pb-7 border-b border-slate-200/80">
          <SectionHeading
            eyebrow="CHƯƠNG TRÌNH &amp; SỰ KIỆN"
            title="Hoạt động Nổi bật"
            subtitle="Các workshop chuyên sâu, buổi sinh hoạt định kỳ và sự kiện kết nối công nghệ tiêu biểu của BK-IC."
          />
          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#38BDF8] transition-colors shrink-0 group"
            aria-label="Xem tất cả hoạt động"
          >
            <span>Xem tất cả hoạt động</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Asymmetric Editorial Grid */}
      <div className="mt-8">
        {featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Lead Feature Card (7 Columns on Large Screens) */}
            {leadItem && (
              <div className="lg:col-span-7">
                <ScrollReveal direction="up" distance={24} delay={0.1} duration={0.65} className="h-full">
                  <ActivityCard item={leadItem} variant="lead" />
                </ScrollReveal>
              </div>
            )}

            {/* Supporting Cards Stack (5 Columns on Large Screens) */}
            {supportingItems.length > 0 && (
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {supportingItems.map((item, idx) => (
                  <ScrollReveal
                    key={item.id}
                    direction="up"
                    distance={20}
                    delay={0.15 + idx * 0.1}
                    duration={0.6}
                  >
                    <ActivityCard item={item} variant="compact" />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-white via-white to-sky-50/40 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Chưa có hoạt động nổi bật</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Lịch trình các sự kiện, workshop và buổi sinh hoạt sắp tới sẽ được cập nhật sớm nhất!
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      {featuredItems.length > 0 && (
        <ScrollReveal direction="up" distance={16} delay={0.25} duration={0.5} className="mt-6 sm:mt-8 text-center">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-[#0284C7] text-xs sm:text-sm font-bold hover:bg-gradient-to-r hover:from-[#0284C7] hover:to-[#38BDF8] hover:text-white hover:border-transparent shadow-xs hover:shadow-[0_12px_28px_-8px_rgba(56,189,248,0.35)] transition-all duration-300 group"
          >
            <span>Khám phá tất cả hoạt động</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      )}
    </section>
  );
};
