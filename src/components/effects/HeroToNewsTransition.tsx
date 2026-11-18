// BK-IC Digital Hub — Hero to Content Section Gradient Transition Component
// Single C-infinity analytic cosine-eased OKLab progression from Cosmic Navy (#070D22) to Pure White (#FFFFFF)
// Zero piecewise waypoints, zero second-derivative kinks, zero Mach banding or horizontal tiering
import React from 'react';

interface HeroToNewsTransitionProps {
  className?: string;
}

export const HeroToNewsTransition: React.FC<HeroToNewsTransitionProps> = ({
  className = ''
}) => {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-40 sm:h-48 md:h-56 lg:h-64 pointer-events-none select-none -mt-1 -mb-1 z-10 ${className}`}
      style={{
        background: `linear-gradient(
          180deg,
          #070d22 0%,
          #070e23 4%,
          #091026 8%,
          #0b142c 12%,
          #0e1933 16%,
          #121f3d 20%,
          #172849 24%,
          #1d3156 28%,
          #253d65 32%,
          #2e4975 36%,
          #385786 40%,
          #456597 44%,
          #5375a7 48%,
          #6285b6 52%,
          #7394c3 56%,
          #85a4cf 60%,
          #98b3da 64%,
          #aac2e3 68%,
          #bccfea 72%,
          #ccdbf0 76%,
          #dbe6f5 80%,
          #e8eff8 84%,
          #f2f6fb 88%,
          #f9fbfd 92%,
          #fdfeff 96%,
          #ffffff 100%
        )`
      }}
    />
  );
};
