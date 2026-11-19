// BK-IC Digital Hub — Glowing Light Trails (Dải sáng chuyển động dạng sóng)
// Inspired by creative technology video references, adapted to Sky Blue + Ice White palette
import React from 'react';

interface GlowingLightTrailsProps {
  className?: string;
  variant?: 'hero-flow' | 'section-flow' | 'ambient-trails';
  opacity?: number;
}

export const GlowingLightTrails: React.FC<GlowingLightTrailsProps> = React.memo(({
  className = '',
  variant = 'section-flow',
  opacity = 1
}) => {
  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      {/* ===================================================================== */}
      {/* 1. HERO FLOW VARIANT: Dynamic wave trails for hero banner transition  */}
      {/* ===================================================================== */}
      {variant === 'hero-flow' && (
        <div className="relative w-full h-44 sm:h-56 md:h-64">
          <svg
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Primary Sky Blue Trail Gradient */}
              <linearGradient id="heroTrailGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0" />
                <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#075985" stopOpacity="0" />
              </linearGradient>

              {/* Secondary Soft Ice Blue Wave Gradient */}
              <linearGradient id="heroTrailGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#075985" stopOpacity="0" />
                <stop offset="30%" stopColor="#0284C7" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.75" />
                <stop offset="85%" stopColor="#E0F2FE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </linearGradient>

              {/* Soft Ambient Fill Gradient */}
              <linearGradient id="heroWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Ambient Wave Underlay */}
            <path
              d="M0,192 C280,240 540,110 820,180 C1100,250 1280,160 1440,200 L1440,320 L0,320 Z"
              fill="url(#heroWaveFill)"
              className="animate-wave-subtle"
            />

            {/* Soft Halo Layer 1 (GPU-friendly replacement for SVG feGaussianBlur) */}
            <path
              d="M-40,160 C260,260 520,80 840,170 C1120,240 1320,140 1480,180"
              stroke="url(#heroTrailGrad1)"
              strokeWidth="12"
              strokeOpacity="0.22"
              strokeLinecap="round"
              className="animate-trail-flow-1"
            />

            {/* Glowing Light Trail 1: Broad luminous wave */}
            <path
              d="M-40,160 C260,260 520,80 840,170 C1120,240 1320,140 1480,180"
              stroke="url(#heroTrailGrad1)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-trail-flow-1"
            />

            {/* Glowing Light Trail 2: Harmonic Intertwining wave */}
            <path
              d="M-20,210 C320,120 600,280 920,140 C1180,90 1360,220 1460,160"
              stroke="url(#heroTrailGrad2)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-trail-flow-2"
            />

            {/* Core Crisp Beam */}
            <path
              d="M-40,160 C260,260 520,80 840,170 C1120,240 1320,140 1480,180"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeOpacity="0.85"
              strokeDasharray="160 300"
              className="animate-pulse-core"
            />
          </svg>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. SECTION FLOW VARIANT: Floating waves across section backdrops      */}
      {/* ===================================================================== */}
      {variant === 'section-flow' && (
        <div className="relative w-full h-36 sm:h-48 md:h-56">
          <svg
            viewBox="0 0 1440 240"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="secTrailGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
                <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="secTrailGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0" />
                <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="65%" stopColor="#E0F2FE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Trail 1: Flowing Primary Light Trail */}
            <path
              d="M-50,80 C240,190 560,30 860,130 C1140,210 1340,70 1500,120"
              stroke="url(#secTrailGrad1)"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-trail-flow-1"
            />

            {/* Trail 2: Harmonious Undulating Ribbon */}
            <path
              d="M-30,140 C280,60 580,210 900,90 C1180,40 1350,170 1480,100"
              stroke="url(#secTrailGrad2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="220 180"
              className="animate-trail-flow-2"
            />
          </svg>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. AMBIENT TRAILS VARIANT: Full-height subtle wave backdrop           */}
      {/* ===================================================================== */}
      {variant === 'ambient-trails' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <svg
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full opacity-70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ambGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
                <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#0284C7" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#075985" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="ambGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0" />
                <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="80%" stopColor="#0284C7" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Flowing ribbon 1 */}
            <path
              d="M-100,200 C300,50 600,450 1000,220 C1300,80 1500,350 1600,250"
              stroke="url(#ambGrad1)"
              strokeWidth="28"
              strokeLinecap="round"
              className="animate-float-subtle-1"
            />

            {/* Flowing ribbon 2 */}
            <path
              d="M-50,600 C350,750 700,400 1100,580 C1350,700 1500,500 1600,620"
              stroke="url(#ambGrad2)"
              strokeWidth="22"
              strokeLinecap="round"
              className="animate-float-subtle-2"
            />
          </svg>
        </div>
      )}
    </div>
  );
});

