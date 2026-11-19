// BK-IC Digital Hub — Reusable Institutional Page Content Canvas
// Provides the signature pure white continuous canvas with subtle tech grid & ambient trails
import React from 'react';
import { TechGridParticles } from '../effects/TechGridParticles';
import { GlowingLightTrails } from '../effects/GlowingLightTrails';

export interface PageContentCanvasProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContentCanvas: React.FC<PageContentCanvasProps> = ({
  children,
  className = '',
  fullWidth = false
}) => {
  return (
    <div className="relative bg-white -mt-1 text-[#334155] selection:bg-sky-100 selection:text-[#0284C7]">
      {/* Subtle Tech Grid Pattern */}
      <TechGridParticles density="subtle" showGrid={true} showParticles={false} />

      {/* Ambient Flowing Light Trails */}
      <GlowingLightTrails variant="ambient-trails" opacity={0.4} />

      {/* Soft Ambient Depth Glows (Radial gradients without expensive CSS blur filter) */}
      <div className="absolute top-[8%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,rgba(56,189,248,0.04)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-1" />
      <div className="absolute top-[35%] -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.10)_0%,rgba(2,132,199,0.03)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-2" />
      <div className="absolute top-[65%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.10)_0%,rgba(56,189,248,0.03)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-3" />

      {/* Main Content Area */}
      <div className={`relative z-10 ${fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-8 sm:py-12 space-y-12 ${className}`}>
        {children}
      </div>
    </div>
  );
};

