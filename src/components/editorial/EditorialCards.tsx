// Editorial Cards Collection
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Award, User, Tag } from 'lucide-react';

// 1. Editorial News / Article Card
interface EditorialCardProps {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  to?: string;
  imageUrl?: string;
  badge?: string;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  category,
  title,
  excerpt,
  date,
  readTime = '3 phút đọc',
  to,
  imageUrl,
  badge
}) => {
  const content = (
    <article className="group h-full flex flex-col justify-between rounded-2xl border border-[#E2E6EE] bg-white p-6 sm:p-7 transition-all duration-300 hover:border-[#6B9DFF] hover:shadow-lg">
      <div className="space-y-4">
        {imageUrl && (
          <div className="aspect-16/9 w-full overflow-hidden rounded-xl bg-slate-100">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-[#1749B5] bg-[#1749B5]/10 px-2.5 py-1 rounded-md">
            {category}
          </span>
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <span>{date}</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#10182D] group-hover:text-[#1749B5] transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed line-clamp-3 font-normal">
          {excerpt}
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1749B5]">
        <span>Đọc bài viết</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </article>
  );

  if (to) {
    return <Link to={to} className="block h-full">{content}</Link>;
  }

  return content;
};

// 2. Workshop & Activity Card
interface ActivityCardProps {
  title: string;
  type: string;
  date: string;
  time?: string;
  location?: string;
  speaker?: string;
  status: 'upcoming' | 'open' | 'closed' | 'finished' | 'cancelled';
  statusLabel?: string;
  onRegister?: () => void;
  to?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  type,
  date,
  time,
  location,
  speaker,
  status,
  statusLabel,
  onRegister,
  to
}) => {
  const statusConfig = {
    open: {
      label: statusLabel || 'Đang mở đăng ký',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    upcoming: {
      label: statusLabel || 'Sắp diễn ra',
      classes: 'bg-blue-50 text-[#1749B5] border-blue-200'
    },
    closed: {
      label: statusLabel || 'Đã đóng đăng ký',
      classes: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    finished: {
      label: statusLabel || 'Đã diễn ra',
      classes: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    cancelled: {
      label: statusLabel || 'Đã hủy',
      classes: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  }[status];

  return (
    <div className="rounded-2xl border border-[#E2E6EE] bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-[#6B9DFF] transition-all duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
            {type}
          </span>
          <span
            className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.classes}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#10182D] leading-snug">
          {title}
        </h3>

        <div className="space-y-2 text-xs text-[#5E6573]">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#1749B5] shrink-0" />
            <span>{date} {time && `• ${time}`}</span>
          </div>

          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#1749B5] shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {speaker && (
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#1749B5] shrink-0" />
              <span>Diễn giả: <strong className="text-slate-800">{speaker}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {to ? (
          <Link
            to={to}
            className="text-xs font-semibold text-[#1749B5] hover:underline flex items-center gap-1"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-xs text-slate-400">Xem thể lệ</span>
        )}

        {status === 'open' && onRegister && (
          <button
            onClick={onRegister}
            className="px-4 py-2 rounded-xl bg-[#1749B5] text-white text-xs font-bold hover:bg-[#10182D] transition cursor-pointer"
          >
            Đăng ký tham gia
          </button>
        )}
      </div>
    </div>
  );
};

// 3. Competition Card
interface CompetitionCardProps {
  title: string;
  organizer?: string;
  deadline: string;
  prize?: string;
  status: 'upcoming' | 'open' | 'closed' | 'ongoing' | 'completed';
  description: string;
  onRegister?: () => void;
  to?: string;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({
  title,
  organizer = 'BK-IC & ĐH Bách khoa',
  deadline,
  prize,
  status,
  description,
  onRegister,
  to
}) => {
  const statusLabels = {
    open: { text: 'Đang nhận hồ sơ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    upcoming: { text: 'Sắp mở đăng ký', color: 'bg-blue-50 text-[#1749B5] border-blue-200' },
    closed: { text: 'Đã đóng đơn', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ongoing: { text: 'Đang tranh tài', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    completed: { text: 'Đã vinh danh', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  }[status];

  return (
    <div className="rounded-2xl border border-[#E2E6EE] bg-white p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-[#6B9DFF] transition-all">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-slate-500">
            {organizer}
          </span>
          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusLabels.color}`}>
            {statusLabels.text}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#10182D] leading-snug">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          {prize && (
            <div className="rounded-xl bg-[#F5F6F8] p-3 border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Tổng giải thưởng</span>
              <strong className="text-[#1749B5] text-sm font-extrabold">{prize}</strong>
            </div>
          )}
          <div className="rounded-xl bg-[#F5F6F8] p-3 border border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Hạn nộp hồ sơ</span>
            <strong className="text-slate-800 text-sm font-bold">{deadline}</strong>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        {to ? (
          <Link to={to} className="text-xs font-bold text-[#1749B5] hover:underline flex items-center gap-1">
            <span>Chi tiết thể lệ</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="text-xs text-slate-400 font-mono">BK-IC Innovation</span>
        )}

        {status === 'open' && onRegister && (
          <button
            onClick={onRegister}
            className="px-4 py-2 rounded-xl bg-[#1749B5] text-white text-xs font-bold hover:bg-[#10182D] transition cursor-pointer"
          >
            Đăng ký dự thi
          </button>
        )}
      </div>
    </div>
  );
};

