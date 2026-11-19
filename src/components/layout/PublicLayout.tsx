// BK-IC Public Layout with Navbar, Footer, Tech Grid Background & Page Transitions
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TechGridParticles } from '../effects/TechGridParticles';
import { GlowingLightTrails } from '../effects/GlowingLightTrails';
import { PageTransition } from '../effects/PageTransition';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col animated-tech-bg relative overflow-x-clip text-[#334155] selection:bg-sky-100 selection:text-[#0284C7]">
      {/* ========================================================================= */}
      {/* GLOBAL BACKGROUND LAYER (Sky Blue + Pure White + Tech Grid & Wave Trails) */}
      {/* Applied uniformly across all pages except dedicated auth screens          */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Architectural 48px Coordinate Grid & Floating Sky Blue Particles */}
        <TechGridParticles density="subtle" showGrid={true} showParticles={true} className="fixed inset-0" />

        {/* Ambient Flowing Light Trails */}
        <GlowingLightTrails variant="ambient-trails" opacity={0.35} className="fixed inset-0" />

        {/* Soft Ambient Floating Depth Glows (Mandatory Sky Blue + Primary Blue Palette — soft radial gradient without GPU blur-3xl overhead) */}
        <div className="absolute top-[8%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14)_0%,rgba(56,189,248,0.05)_40%,transparent_70%)] animate-float-orb-1" />
        <div className="absolute top-[35%] -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.12)_0%,rgba(2,132,199,0.04)_40%,transparent_70%)] animate-float-orb-2" />
        <div className="absolute top-[65%] -left-36 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,rgba(56,189,248,0.04)_40%,transparent_70%)] animate-float-orb-3" />
        <div className="absolute bottom-[5%] -right-24 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.14)_0%,rgba(2,132,199,0.05)_40%,transparent_70%)] animate-float-orb-4" />
      </div>

      {/* Primary Navigation Bar */}
      <Navbar />

      {/* Main Content Area with Smooth Page Transition Cross-Fade & Lift */}
      <main className="flex-1 relative z-10 flex flex-col">
        <PageTransition />
      </main>

      {/* Institutional Cosmic Footer */}
      <Footer />
    </div>
  );
};
