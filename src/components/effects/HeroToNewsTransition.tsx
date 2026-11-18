// BK-IC Digital Hub — Hero to News Section Gradient Transition Component
// Inspired by Apple & Oura Ring's seamless vertical gradient transition
// Pure, continuous, multi-stop vertical gradient from Cosmic Navy (#070D22) to Pure White (#FFFFFF)
// Ultra-smooth, generous vertical height with 25 monotonic smoothstep micro-stops for maximum color glide
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
      className={`relative w-full h-36 sm:h-44 md:h-52 lg:h-60 pointer-events-none select-none -mt-1 -mb-1 z-10 overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(
          180deg,
          #070d22 0%,
          #08112a 4.2%,
          #0a1735 8.3%,
          #0b1a3a 12.5%,
          #0d2148 16.7%,
          #0e244e 20.8%,
          #102a59 25%,
          #113367 29.2%,
          #12366c 33.3%,
          #143f7a 37.5%,
          #16498a 41.7%,
          #164d8f 45.8%,
          #1959a0 50%,
          #1c65b0 54.2%,
          #1d6ab5 58.3%,
          #2378c6 62.5%,
          #2985d4 66.7%,
          #308cd9 70.8%,
          #44a0e4 75%,
          #4fa9e9 79.2%,
          #70bcf0 83.3%,
          #86c8f4 87.5%,
          #b4dff9 91.7%,
          #ddf1fc 95.8%,
          #ffffff 100%
        )`
      }}
    >
      {/* Soft Ambient Depth Bloom to enhance silky optical gradation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_65%,rgba(41,133,212,0.12),transparent_75%)] pointer-events-none" />
    </div>
  );
};
