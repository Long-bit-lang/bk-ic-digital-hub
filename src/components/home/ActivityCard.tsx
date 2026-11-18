// BK-IC Digital Hub — Featured Activities Cards
// Asymmetric Editorial Layout: Lead Feature Card + Compact Supporting Card
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { ActivityItem } from '../../data/homeData';

interface ActivityCardProps {
  item: ActivityItem;
  variant?: 'lead' | 'compact';
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ item, variant = 'compact' }) => {
  const [imageError, setImageError] = useState(false);

  if (variant === 'lead') {
    return (
      <article className="h-full min-h-[420px] sm:min-h-[480px] rounded-3xl overflow-hidden relative group border border-slate-200/90 shadow-md hover:shadow-[0_25px_60px_-15px_rgba(56,189,248,0.30)] hover:border-[#38BDF8] hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col justify-end p-6 sm:p-8 lg:p-10 text-white">
        {/* Background Image with Zoom */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1432] to-[#1749B5] text-slate-400 p-8">
              <ImageIcon className="w-12 h-12 text-white/30 mb-2" />
              <span className="text-sm font-medium text-slate-300">BK-IC Featured Activity</span>
            </div>
          )}

          {/* Deep Gradient Overlays for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#0A1432]/75 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent to-[#050814]/40 pointer-events-none" />
        </div>

        {/* Content Floating Over Image */}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#245BFA] text-white shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Tiêu điểm</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-slate-100">
              <span>{item.category}</span>
            </span>

            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              <span>{item.date}</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight group-hover:text-[#A8C7FF] transition-colors duration-200">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed line-clamp-3 font-normal max-w-xl">
            {item.description}
          </p>

          {item.outcomes && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-200 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="line-clamp-1">{item.outcomes}</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            {item.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#6B9DFF] shrink-0" />
                <span className="line-clamp-1">{item.location}</span>
              </div>
            )}

            <Link
              to={item.detailUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0A1432] text-xs font-bold hover:bg-[#6B9DFF] hover:text-white transition-all duration-300 shadow-md group/btn"
              aria-label={`Khám phá hoạt động tiêu điểm: ${item.title}`}
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Supporting / Compact Variant (used for side items in asymmetric grid)
  return (
    <article className="group rounded-3xl border border-slate-200/90 bg-white hover:border-[#38BDF8] hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgba(56,189,248,0.20)] transition-all duration-300 ease-out overflow-hidden flex flex-col sm:flex-row items-stretch">
      <Link
        to={item.detailUrl}
        className="flex flex-col sm:flex-row items-stretch w-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1749B5] rounded-3xl"
        aria-label={`Chi tiết hoạt động: ${item.title}`}
      >
        {/* Thumbnail Image */}
        <div className="sm:w-40 sm:min-w-40 h-40 sm:h-auto relative overflow-hidden bg-slate-100 shrink-0">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-slate-400 p-2">
              <ImageIcon className="w-6 h-6 text-[#1749B5]/40" />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1749B5] border border-blue-200/70">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{item.date}</span>
              </div>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h4>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
            {item.location && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 line-clamp-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1749B5] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto">
              <span>Chi tiết</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

