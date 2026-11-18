// Editorial Section Heading with Minimalist Typography
import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
  titleClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  dark = false,
  className = '',
  titleClassName = ''
}) => {
  const isCenter = align === 'center';
  const hasCustomMaxWidth = className.includes('max-w-');
  const defaultMaxWidth = isCenter ? 'max-w-3xl' : 'max-w-2xl';

  return (
    <div
      className={`space-y-3 ${isCenter ? 'text-center mx-auto' : ''} ${hasCustomMaxWidth ? '' : defaultMaxWidth} ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
            dark
              ? 'bg-gradient-to-r from-[#1749B5]/30 to-[#245BFA]/20 text-[#6B9DFF] border border-[#6B9DFF]/30 shadow-xs'
              : 'bg-gradient-to-r from-[#1749B5]/10 via-[#245BFA]/10 to-blue-50 text-[#1749B5] border border-[#1749B5]/20 shadow-2xs'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{eyebrow}</span>
        </div>
      )}

      <h2
        className={`font-extrabold tracking-tight leading-tight ${
          titleClassName || 'text-2xl sm:text-4xl lg:text-5xl'
        } ${dark ? 'text-white' : 'text-[#10182D]'}`}
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

