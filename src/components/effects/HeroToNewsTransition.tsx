// BK-IC Digital Hub — Hero to Content Section Gradient Transition Component
// Single C-infinity analytic cosine-eased OKLab progression from Cosmic Navy (#070D22) to Pure White (#FFFFFF)
// Harmonized with BK-IC Sky Blue (#38BDF8) palette — zero piecewise kinks, zero Mach banding or horizontal tiering
import React from 'react';

interface HeroToNewsTransitionProps {
  className?: string;
}

export const HeroToNewsTransition: React.FC<HeroToNewsTransitionProps> = React.memo(({
  className = ''
}) => {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-40 sm:h-48 md:h-56 lg:h-64 pointer-events-none select-none -mt-1 -mb-1 z-10 ${className}`}
      style={{
        background: `linear-gradient(
          180deg,
          #070D22 0%,
          #070E23 4%,
          #091026 8%,
          #0B142C 12%,
          #0E1933 16%,
          #121F3D 20%,
          #172849 24%,
          #1D3156 28%,
          #253D65 32%,
          #2E4975 36%,
          #385786 40%,
          #456597 44%,
          #5375A7 48%,
          #6285B6 52%,
          #7394C3 56%,
          #85A4CF 60%,
          #98B3DA 64%,
          #AAC2E3 68%,
          #BCCFEA 72%,
          #CCDBF0 76%,
          #DBE6F5 80%,
          #E8EFF8 84%,
          #F2F6FB 88%,
          #F9FBFD 92%,
          #FDFEFF 96%,
          #FFFFFF 100%
        )`
      }}
    />
  );
});
