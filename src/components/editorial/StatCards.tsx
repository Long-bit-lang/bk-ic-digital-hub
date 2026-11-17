// BK-IC Editorial Metric & Stat Cards (Inspired by Tirtus Behance Design)
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AbstractBlueVisual } from './AbstractVisuals';

/**
 * Clean White / Off-white Metric Card (e.g. 37.2% or 200+)
 */
export const BigNumberCard: React.FC<{
  number: string;
  label: string;
  description?: string;
  badge?: string;
  className?: string;
}> = ({ number, label, description, badge, className = '' }) => {
  return (
    <div
      className={`rounded-3xl border border-[#E2E6EE] bg-white p-7 sm:p-9 shadow-xs flex flex-col justify-between space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1749B5] border border-blue-100">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[#10182D]">
          {number}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Signature 10X Gradient Stat Card with Blue Base Fade
 */
export const GradientStatCard: React.FC<{
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}> = ({ number, title, subtitle, className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[#CBD5E1] bg-gradient-to-b from-white via-white to-blue-50/80 p-7 sm:p-9 shadow-xs flex flex-col justify-between min-h-[220px] ${className}`}
    >
      <div className="relative z-10 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </div>

      <div className="relative z-10 space-y-1">
        <div className="text-6xl sm:text-7xl font-bold tracking-tight text-[#10182D]">
          {number}
        </div>
        {subtitle && (
          <div className="text-xs font-semibold text-[#1749B5]">
            {subtitle}
          </div>
        )}
      </div>

      {/* Subtle blue ambient circle at bottom */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#1749B5]/15 blur-2xl pointer-events-none" />
    </div>
  );
};

/**
 * 3 Vertical Pill Cards with Abstract Blue Tech Art & Frosted Glass Badges
 */
export const VisualPillCard: React.FC<{
  stat: string;
  title: string;
  subtitle?: string;
  variant?: 'ribbon' | 'mesh' | 'wave' | 'sphere';
  className?: string;
}> = ({ stat, title, subtitle, variant = 'ribbon', className = '' }) => {
  return (
    <div
      className={`relative group overflow-hidden rounded-3xl border border-slate-200/80 bg-[#0A1128] aspect-[3/4] flex flex-col justify-between p-6 transition duration-300 hover:border-[#6B9DFF] shadow-sm ${className}`}
    >
      {/* 3D Abstract Background */}
      <div className="absolute inset-0">
        <AbstractBlueVisual variant={variant} className="w-full h-full rounded-3xl" />
      </div>

      {/* Top Tag */}
      <div className="relative z-10 flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          BK-IC TECH
        </span>
      </div>

      {/* Bottom Frosted Glass Overlay with Stat */}
      <div className="relative z-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-4 space-y-1 text-white">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {stat}
        </div>
        <div className="text-xs font-semibold text-slate-200 truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-[11px] text-slate-300 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Horizontal Metric Strip (e.g. 200+ | 97% | 10X)
 */
export const HorizontalStatStrip: React.FC<{
  stats: Array<{ number: string; label: string; sub?: string }>;
  className?: string;
}> = ({ stats, className = '' }) => {
  return (
    <div
      className={`rounded-3xl border border-[#E2E6EE] bg-white p-6 sm:p-8 shadow-xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 ${className}`}
    >
      {stats.map((item, idx) => (
        <div
          key={idx}
          className={`space-y-1 ${idx === 0 ? 'sm:pr-8' : idx === stats.length - 1 ? 'pt-4 sm:pt-0 sm:pl-8' : 'py-4 sm:py-0 sm:px-8'}`}
        >
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#10182D]">
            {item.number}
          </div>
          <div className="text-xs font-semibold text-slate-700">
            {item.label}
          </div>
          {item.sub && (
            <div className="text-[11px] text-slate-400">
              {item.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

