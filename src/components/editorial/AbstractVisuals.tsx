// BK-IC Minimalist Editorial Abstract Blue Fluid Art Visuals
import React from 'react';

interface AbstractVisualProps {
  className?: string;
  variant?: 'ribbon' | 'mesh' | 'wave' | 'sphere';
}

/**
 * Renders high-fidelity, responsive 3D fluid electric blue abstract artwork
 * inspired by the Tirtus Behance visual identity.
 */
export const AbstractBlueVisual: React.FC<AbstractVisualProps> = ({
  className = 'w-full h-48',
  variant = 'ribbon'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1128] via-[#0E1A40] to-[#142850] ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1749B5_0%,transparent_60%)] opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#6B9DFF_0%,transparent_50%)] opacity-40 mix-blend-screen" />

      {/* SVG Fluid Ribbons / Waves */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen filter drop-shadow-lg"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B9DFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#245BFA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0B132B" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="blueGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#1E40AF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
          </filter>
        </defs>

        {variant === 'ribbon' && (
          <>
            <path
              d="M-50,220 C80,120 180,280 320,140 C380,80 430,120 460,90 L460,320 L-50,320 Z"
              fill="url(#blueGlow1)"
              opacity="0.85"
            />
            <path
              d="M-30,140 C100,260 220,60 360,180 C410,220 440,160 460,140"
              fill="none"
              stroke="url(#blueGlow2)"
              strokeWidth="28"
              strokeLinecap="round"
              className="filter blur-[1px]"
            />
            <circle cx="280" cy="90" r="45" fill="url(#blueGlow2)" opacity="0.6" className="filter blur-md" />
          </>
        )}

        {variant === 'mesh' && (
          <>
            <path
              d="M-20,80 Q140,240 260,110 T440,180 L440,320 L-20,320 Z"
              fill="url(#blueGlow2)"
              opacity="0.75"
            />
            <path
              d="M30,-20 Q180,180 340,70 T440,240"
              fill="none"
              stroke="url(#blueGlow1)"
              strokeWidth="34"
              strokeLinecap="round"
              opacity="0.8"
            />
            <circle cx="120" cy="180" r="60" fill="url(#blueGlow1)" opacity="0.4" className="filter blur-lg" />
          </>
        )}

        {variant === 'wave' && (
          <>
            <path
              d="M-40,150 C90,40 190,260 340,120 C400,60 450,110 480,80 L480,320 L-40,320 Z"
              fill="url(#blueGlow1)"
              opacity="0.9"
            />
            <path
              d="M-10,90 C120,200 240,40 380,160"
              fill="none"
              stroke="url(#blueGlow2)"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </>
        )}

        {variant === 'sphere' && (
          <>
            <circle cx="200" cy="150" r="110" fill="url(#blueGlow1)" className="filter blur-xs" />
            <circle cx="240" cy="120" r="70" fill="url(#blueGlow2)" opacity="0.8" className="filter blur-md" />
            <path
              d="M40,220 C140,120 260,260 380,160"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.7"
            />
          </>
        )}
      </svg>

      {/* Glassmorphic sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/80 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
    </div>
  );
};

/**
 * Horizon light glow bar for dark headers (the subtle blue horizon line in Tirtus)
 */
export const HorizonLightGlow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-[1px] ${className}`}>
      {/* Central light streak */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6B9DFF] to-transparent opacity-60" />
      {/* Diffuse blur aura */}
      <div className="absolute -top-6 left-1/4 right-1/4 h-12 bg-gradient-to-r from-transparent via-[#245BFA]/30 to-transparent blur-xl pointer-events-none" />
    </div>
  );
};

