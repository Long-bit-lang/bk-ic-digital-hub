// Editorial Section Heading with Minimalist Typography
import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  dark = false,
  className = ''
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`space-y-3 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider ${
            dark
              ? 'bg-[#1749B5]/20 text-[#6B9DFF] border border-[#6B9DFF]/30'
              : 'bg-[#1749B5]/10 text-[#1749B5] border border-[#1749B5]/20'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{eyebrow}</span>
        </div>
      )}

      <h2
        className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
          dark ? 'text-white' : 'text-[#10182D]'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`text-sm sm:text-base leading-relaxed font-normal ${
            dark ? 'text-slate-300' : 'text-[#5E6573]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
