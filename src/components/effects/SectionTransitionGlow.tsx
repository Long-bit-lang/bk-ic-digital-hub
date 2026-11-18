// BK-IC Digital Hub — Section Transition Glow Divider
// Fluid soft gradient light beam transitioning smoothly between sections
import React from 'react';

interface SectionTransitionGlowProps {
  className?: string;
  glowColor?: string;
  showCenterAccent?: boolean;
}

export const SectionTransitionGlow: React.FC<SectionTransitionGlowProps> = ({
  className = '',
  glowColor = 'rgba(56, 189, 248, 0.25)',
  showCenterAccent = true
}) => {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full py-4 pointer-events-none select-none overflow-hidden ${className}`}
    >
      {/* Central Diffuse Glow Beam */}
      <div
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`
        }}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[700px] h-20 blur-xl pointer-events-none"
      />

      {/* Luminous Razor Divider Line */}
      <div className="relative flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#38BDF8]/45 to-transparent" />

        {/* Subtle Central Geometric Diamond Accent */}
        {showCenterAccent && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <span className="w-2 h-2 rotate-45 rounded-[1px] bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
          </div>
        )}
      </div>
    </div>
  );
};

