// BK-IC Digital Hub — Tech Grid & Floating Particles Component
// Academic Engineering & Creative Technology visual identity in Sky Blue & Ice White
import React from 'react';

interface TechGridParticlesProps {
  className?: string;
  showGrid?: boolean;
  showParticles?: boolean;
  density?: 'subtle' | 'medium';
}

// Fixed deterministic particle coordinates to avoid hydration mismatches
const PARTICLES = [
  { id: 1, top: '12%', left: '8%', size: 4, duration: 8, delay: 0, opacity: 0.7 },
  { id: 2, top: '24%', left: '85%', size: 5, duration: 10, delay: 1.5, opacity: 0.8 },
  { id: 3, top: '38%', left: '15%', size: 3, duration: 7, delay: 2, opacity: 0.6 },
  { id: 4, top: '45%', left: '92%', size: 6, duration: 11, delay: 0.5, opacity: 0.75 },
  { id: 5, top: '55%', left: '6%', size: 4, duration: 9, delay: 3, opacity: 0.65 },
  { id: 6, top: '68%', left: '88%', size: 5, duration: 8.5, delay: 1, opacity: 0.7 },
  { id: 7, top: '78%', left: '18%', size: 3, duration: 9.5, delay: 2.5, opacity: 0.55 },
  { id: 8, top: '88%', left: '78%', size: 4, duration: 10.5, delay: 0.8, opacity: 0.7 },
  { id: 9, top: '18%', left: '50%', size: 3, duration: 7.5, delay: 4, opacity: 0.5 },
  { id: 10, top: '62%', left: '42%', size: 4, duration: 12, delay: 1.2, opacity: 0.6 },
  { id: 11, top: '32%', left: '72%', size: 3, duration: 8, delay: 3.5, opacity: 0.6 },
  { id: 12, top: '82%', left: '55%', size: 5, duration: 11.5, delay: 2.2, opacity: 0.65 }
];

// Coordinate crosshair node markers for engineering depth
const NODES = [
  { top: '15%', left: '12%' },
  { top: '28%', left: '82%' },
  { top: '48%', left: '22%' },
  { top: '65%', left: '78%' },
  { top: '82%', left: '16%' }
];

export const TechGridParticles: React.FC<TechGridParticlesProps> = ({
  className = '',
  showGrid = true,
  showParticles = true,
  density = 'subtle'
}) => {
  const gridOpacity = density === 'medium' ? 'opacity-35' : 'opacity-20';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 ${className}`}
    >
      {/* ===================================================================== */}
      {/* 1. ULTRA-SUBTLE ENGINEERING TECH GRID PATTERN                         */}
      {/* ===================================================================== */}
      {showGrid && (
        <div className={`absolute inset-0 w-full h-full ${gridOpacity} transition-opacity`}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* 48px Coordinate Grid Pattern */}
              <pattern
                id="techGridPattern"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
              </pattern>

              {/* Radial Vignette Mask so grid gently dissolves at edges */}
              <radialGradient id="gridMaskGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>

              <mask id="gridVignetteMask">
                <rect width="100%" height="100%" fill="url(#gridMaskGrad)" />
              </mask>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="url(#techGridPattern)"
              mask="url(#gridVignetteMask)"
            />
          </svg>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. ARCHITECTURAL / ENGINEERING PLUS (+) NODES                         */}
      {/* ===================================================================== */}
      {showGrid && (
        <div className="absolute inset-0">
          {NODES.map((node, i) => (
            <div
              key={i}
              style={{ top: node.top, left: node.left }}
              className="absolute font-mono text-[10px] text-[#0284C7] opacity-25 select-none transform -translate-x-1/2 -translate-y-1/2"
            >
              +
            </div>
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. FLOATING LUMINOUS SKY BLUE PARTICLES                               */}
      {/* ===================================================================== */}
      {showParticles && (
        <div className="absolute inset-0">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              style={{
                top: p.top,
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
              className="absolute rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#FFFFFF] shadow-[0_0_8px_#38BDF8] animate-particle-float"
            />
          ))}
        </div>
      )}
    </div>
  );
};

