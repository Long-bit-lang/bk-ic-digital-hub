// BK-IC Digital Hub — Hero to News Section Gradient Transition Component
// Inspired by Oura Ring's seamless vertical gradient color transition
// Pure, continuous, multi-stop vertical gradient from Cosmic Navy (#070D22) to Pure White (#FFFFFF)
// Seamless ribbon transition: zero alpha fringing, zero clipped blur, zero cut lines
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
      className={`relative w-full h-24 sm:h-32 md:h-36 pointer-events-none select-none -mt-1 -mb-1 z-10 ${className}`}
      style={{
        background: `linear-gradient(
          180deg,
          #070D22 0%,
          #081738 12%,
          #0A2454 24%,
          #034882 38%,
          #0284C7 52%,
          #38BDF8 66%,
          #7DD3FC 76%,
          #BAE6FD 85%,
          #E0F2FE 92%,
          #F0F9FF 97%,
          #FFFFFF 100%
        )`
      }}
    />
  );
};
