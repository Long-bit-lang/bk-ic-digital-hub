// BK-IC Digital Hub — Competition Card Component
// Uniform height, 16:9 image, status badge, and clear metrics
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ArrowRight, Clock, Trophy as TrophyIcon } from 'lucide-react';
import type { CompetitionItem } from '../../data/homeData';

interface CompetitionCardProps {
  item: CompetitionItem;
}

const STATUS_CONFIG: Record<
  CompetitionItem['status'],
  { label: string; bg: string; dot: string }
> = {
  ongoing: {
    label: 'Đang diễn ra',
    bg: 'bg-emerald-600/90 text-white backdrop-blur-xs',
    dot: 'bg-white animate-pulse'
  },
  upcoming: {
    label: 'Sắp diễn ra',
    bg: 'bg-[#1749B5]/90 text-white backdrop-blur-xs',
    dot: 'bg-[#6B9DFF]'
  },
  completed: {
    label: 'Đã kết thúc',
    bg: 'bg-slate-700/85 text-slate-200 backdrop-blur-xs',
    dot: 'bg-slate-400'
  }
};

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG['upcoming'];

  return (
    <article className="h-full flex flex-col rounded-3xl border border-slate-200/90 bg-white hover:border-[#38BDF8] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-12px_rgba(56,189,248,0.22)] transition-all duration-300 ease-out group overflow-hidden">
      {/* 16:9 Aspect Ratio Image Container with Status Badge */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-400 p-4">
            <Trophy className="w-8 h-8 text-[#1749B5]/40 mb-2" />
            <span className="text-xs font-medium text-slate-500">BK-IC Competition</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${statusInfo.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            <span>{item.statusLabel || statusInfo.label}</span>
          </span>
        </div>

        {/* Prize Pool Badge (if available) */}
        {item.prizePool && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-black/60 text-amber-300 backdrop-blur-md border border-amber-300/30">
              <TrophyIcon className="w-3 h-3 text-amber-400" />
              <span>{item.prizePool}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body with Uniform Spacing */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-base sm:text-lg font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors leading-snug line-clamp-2">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 font-normal">
            {item.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* Timeline / Registration Deadline */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Hạn ĐK: {item.registrationDeadline}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{item.startDate}</span>
            </div>
          </div>

          {/* Action Link */}
          <Link
            to={item.detailUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-[#1749B5] text-[#1749B5] group-hover:text-white text-xs font-bold transition-all duration-200 border border-slate-200/80 group-hover:border-[#1749B5]"
            aria-label={`Tìm hiểu thêm cuộc thi: ${item.title}`}
          >
            <span>Tìm hiểu thêm</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

