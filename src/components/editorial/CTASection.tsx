// Minimalist Editorial CTA Section
import React from 'react';
import { Button } from './Buttons';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryText?: string;
  primaryTo?: string;
  secondaryText?: string;
  secondaryTo?: string;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  eyebrow = 'GIA NHẬP HỆ SINH THÁI BK-IC',
  title,
  description,
  primaryText = 'Gửi yêu cầu hợp tác',
  primaryTo = '/partnership',
  secondaryText = 'Khám phá hoạt động',
  secondaryTo = '/activities',
  className = ''
}) => {
  return (
    <div
      className={`rounded-3xl bg-[#10182D] text-white p-8 sm:p-14 relative overflow-hidden border border-white/10 ${className}`}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#1749B5]/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-[#6B9DFF]/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1749B5]/30 px-3.5 py-1 text-xs font-mono font-bold text-[#6B9DFF] border border-[#6B9DFF]/30">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{eyebrow}</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
          {description}
        </p>

        <div className="pt-3 flex flex-wrap items-center gap-3">
          {primaryText && primaryTo && (
            <Button
              to={primaryTo}
              variant="primary"
              size="md"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              {primaryText}
            </Button>
          )}

          {secondaryText && secondaryTo && (
            <Button
              to={secondaryTo}
              variant="outline-white"
              size="md"
            >
              {secondaryText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
