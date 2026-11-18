// BK-IC Activity Countdown Timer Component
// Live countdown for competition deadlines and registration closing times
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ActivityCountdownProps {
  deadlineIso: string;
  label?: string;
  onExpire?: () => void;
  compact?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const ActivityCountdown: React.FC<ActivityCountdownProps> = ({
  deadlineIso,
  label = 'Thời gian còn lại để nộp hồ sơ',
  onExpire,
  compact = false
}) => {
  const calculateRemaining = (): TimeRemaining => {
    const target = new Date(deadlineIso).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0 || isNaN(target)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isExpired: false };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTime(remaining);
      if (remaining.isExpired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineIso]);

  if (time.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <Clock className="h-3.5 w-3.5" />
        <span>Đã hết hạn đăng ký</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
        <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
        <span>Còn {time.days} ngày {time.hours}h {time.minutes}p</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0284C7]">
        <Clock className="h-4 w-4 animate-pulse text-[#0284C7]" />
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
          <div className="text-base sm:text-lg font-black text-[#075985]">{time.days}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Ngày</div>
        </div>
        <div className="p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
          <div className="text-base sm:text-lg font-black text-[#075985]">{time.hours}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Giờ</div>
        </div>
        <div className="p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
          <div className="text-base sm:text-lg font-black text-[#075985]">{time.minutes}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Phút</div>
        </div>
        <div className="p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
          <div className="text-base sm:text-lg font-black text-[#0284C7]">{time.seconds}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Giây</div>
        </div>
      </div>
    </div>
  );
};

