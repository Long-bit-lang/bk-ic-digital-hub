// BK-IC Digital Hub — Horizontal Stacking News Card Component
// Built according to the Phase 02 Stacking Cards architecture from https://clb.dutai.io.vn/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper, Clock, ArrowUpRight } from 'lucide-react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import type { NewsItem } from '../../data/homeData';

export interface NewsCardProps {
  item: NewsItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const CATEGORY_CONFIG: Record<
  NewsItem['category'],
  { accentGradient: string; glowClass: string; badgeClass: string }
> = {
  'Sự kiện': {
    accentGradient: 'from-[#1749B5] via-[#245BFA] to-[#6B9DFF]',
    glowClass: 'bg-blue-500/10',
    badgeClass: 'bg-blue-50 text-[#1749B5] border-blue-200/80'
  },
  'Workshop': {
    accentGradient: 'from-[#4338CA] via-[#6366F1] to-[#818CF8]',
    glowClass: 'bg-indigo-500/10',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
  },
  'Thành tựu': {
    accentGradient: 'from-[#059669] via-[#10B981] to-[#34D399]',
    glowClass: 'bg-emerald-500/10',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  },
  'Thông báo': {
    accentGradient: 'from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]',
    glowClass: 'bg-sky-500/10',
    badgeClass: 'bg-sky-50 text-sky-600 border-sky-200/80'
  },
  'Hợp tác': {
    accentGradient: 'from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]',
    glowClass: 'bg-purple-500/10',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80'
  },
  'Cuộc thi': {
    accentGradient: 'from-[#D97706] via-[#F59E0B] to-[#FCD34D]',
    glowClass: 'bg-amber-500/10',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80'
  },
  'Tin tức CLB': {
    accentGradient: 'from-[#1749B5] via-[#0284C7] to-[#38BDF8]',
    glowClass: 'bg-blue-500/10',
    badgeClass: 'bg-blue-50 text-[#1749B5] border-blue-200/80'
  },
  'Hoạt động CLB': {
    accentGradient: 'from-[#0284C7] via-[#2563EB] to-[#60A5FA]',
    glowClass: 'bg-sky-500/10',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80'
  }
};

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  index,
  total,
  progress,
  range,
  targetScale
}) => {
  const [imageError, setImageError] = useState(false);
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Sự kiện'];
  const isExternal = item.detailUrl.startsWith('http://') || item.detailUrl.startsWith('https://');

  // Smooth scroll-driven scale transformation (exact DUT AI Phase 02 formula)
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      className="sticky top-28 w-full flex items-center justify-center"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(10px + ${24 * index}px)`,
          transformOrigin: 'top center'
        }}
        className={`group w-full rounded-[36px] bg-white/95 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200/90 hover:border-[#38BDF8]/80 hover:shadow-[0_24px_55px_-12px_rgba(56,189,248,0.22)] overflow-hidden relative will-change-transform transition-all duration-300 ease-out ${index > 0
          ? 'shadow-[0_-12px_28px_-6px_rgba(15,23,42,0.12),0_20px_50px_rgba(0,0,0,0.08)]'
          : ''
          }`}
      >
        {/* ===================================================================== */}
        {/* TOP ACCENT BAR & FOLD CREASE (NẾP GẤP SẮC NÉT)                         */}
        {/* ===================================================================== */}
        {/* 1. Vibrant Top Accent Gradient Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.accentGradient}`}
        />

        {/* 2. Crease Highlight Line (Mép phản quang của nếp gấp) */}
        <div className="absolute top-[6px] left-0 right-0 h-[1px] bg-white/90 pointer-events-none" />

        {/* 3. Crease Shadow Ridge (Rãnh chìm của nếp gấp khi bị đè lên) */}
        <div className="absolute top-[7px] left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-300/80 to-transparent pointer-events-none shadow-xs" />

        {/* 4. Ambient Radial Glow Orb */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full ${config.glowClass} blur-3xl pointer-events-none`}
        />

        {/* ===================================================================== */}
        {/* MAIN CARD CONTENT (60% Left Content + 40% Right Rounded Image)       */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          {/* Left Column: ~60% Width (7/12 cols on desktop) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Category Badge + Date */}
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-5">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full border backdrop-blur-md ${config.badgeClass}`}
                >
                  {item.category}
                </span>

                <span className="text-xs font-mono font-semibold text-slate-400">
                  Bản tin
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 ml-auto">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <time dateTime={item.publishedAt}>{item.publishedAt}</time>
                </div>
              </div>

              {/* Title (Supports both external Fanpage URL and internal route) */}
              {isExternal ? (
                <a
                  href={item.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/title block"
                >
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10182D] leading-[1.25] tracking-tight mb-3 sm:mb-4 group-hover/title:text-[#1749B5] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </a>
              ) : (
                <Link to={item.detailUrl} className="group/title block">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10182D] leading-[1.25] tracking-tight mb-3 sm:mb-4 group-hover/title:text-[#1749B5] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6 line-clamp-2 sm:line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Bottom Meta & Action Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="text-slate-400">{item.source || 'Facebook Fanpage BK-IC'}</span>
              </div>

              {isExternal ? (
                <a
                  href={item.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:text-[#245BFA] group/btn transition-colors cursor-pointer"
                >
                  <span>Xem trên Fanpage</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              ) : (
                <Link
                  to={item.detailUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1749B5] hover:text-[#245BFA] group/btn transition-colors cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: ~40% Width (5/12 cols on desktop) */}
          <div className="md:col-span-6 lg:col-span-5 w-full">
            {isExternal ? (
              <a
                href={item.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-[24px] overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 group/img transition-all duration-300"
                tabIndex={-1}
                aria-hidden="true"
              >
                {!imageError ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-400 p-4">
                    <Newspaper className="w-10 h-10 text-[#1749B5]/40 mb-2" />
                    <span className="text-xs font-medium text-slate-500">BK-IC Fanpage</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              </a>
            ) : (
              <Link
                to={item.detailUrl}
                className="block relative w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-[24px] overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 group/img transition-all duration-300"
                tabIndex={-1}
                aria-hidden="true"
              >
                {!imageError ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-400 p-4">
                    <Newspaper className="w-10 h-10 text-[#1749B5]/40 mb-2" />
                    <span className="text-xs font-medium text-slate-500">BK-IC News</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
