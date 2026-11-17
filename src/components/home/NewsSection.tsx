// BK-IC Digital Hub — News Section Component
// Scroll-based Stacking Cards with Fold Crease (Inspired by https://clb.dutai.io.vn/ Phase 02)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, ArrowUpRight } from 'lucide-react';
import { useScroll } from 'motion/react';
import { SectionHeading } from '../editorial/SectionHeading';
import { NewsCard } from './NewsCard';
import { HOME_NEWS_DATA, type NewsItem } from '../../data/homeData';

interface NewsSectionProps {
  items?: NewsItem[];
}

/**
 * Parses date string in "DD/MM/YYYY" format to a timestamp for accurate descending sort.
 */
function parseDateToTimestamp(dateStr: string): number {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return 0;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ items = HOME_NEWS_DATA }) => {
  // Sort descending by publishedAt (newest first) and take at most 5 items
  const sortedItems = [...items]
    .sort((a, b) => parseDateToTimestamp(b.publishedAt) - parseDateToTimestamp(a.publishedAt))
    .slice(0, 5);

  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll tracking through the container (exact formula from clb.dutai.io.vn)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section id="news" className="relative pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(36,91,250,0.14),transparent_70%)] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <SectionHeading
          eyebrow="BẢN TIN BK-IC"
          title="Bản tin &amp; Thông báo"
          subtitle="Cập nhật những hoạt động, sự kiện và thông tin mới nhất từ câu lạc bộ BK-IC."
        />
      </div>

      {/* News Cards Stacking Container */}
      <div className="mt-10">
        {sortedItems.length > 0 ? (
          <div ref={containerRef} className="relative w-full">
            <div className="flex flex-col gap-10 sm:gap-12 pb-14 sm:pb-16">
              {sortedItems.map((item, index) => {
                // Target scale dynamically shrinks preceding cards as lower cards stack over them
                const targetScale = 1 - (sortedItems.length - 1 - index) * 0.04;

                return (
                  <NewsCard
                    key={item.id}
                    item={item}
                    index={index}
                    total={sortedItems.length}
                    progress={scrollYProgress}
                    range={[0.15 * index, 1]}
                    targetScale={targetScale}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-white via-white to-blue-50/30 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1749B5] flex items-center justify-center mx-auto">
              <Newspaper className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Chưa có bản tin nào</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hiện tại chưa có bài viết mới. Vui lòng quay lại sau để cập nhật tin tức từ BK-IC!
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      {sortedItems.length > 0 && (
        <div className="mt-4 text-center relative z-20">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-[#1749B5] text-xs sm:text-sm font-bold hover:bg-[#1749B5] hover:text-white hover:border-[#1749B5] shadow-xs hover:shadow-md transition-all duration-300 group"
          >
            <span>Xem tất cả tin tức</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
};
