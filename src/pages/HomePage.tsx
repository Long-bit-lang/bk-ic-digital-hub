// BK-IC Digital Hub — Public Homepage
// Modern Academic, Creative Technology & Innovation Ecosystem Showcase
// Visual Upgrade: Glowing Light Trails, Tech Grid, Floating Particles & Scroll Reveals
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NewsSection } from '../components/home/NewsSection';
import { CompetitionSection } from '../components/home/CompetitionSection';
import { FeaturedActivitiesSection } from '../components/home/FeaturedActivitiesSection';
import { PartnersSection } from '../components/home/PartnersSection';
import { GlowingLightTrails } from '../components/effects/GlowingLightTrails';
import { TechGridParticles } from '../components/effects/TechGridParticles';
import { ScrollReveal } from '../components/effects/ScrollReveal';
import { HeroToNewsTransition } from '../components/effects/HeroToNewsTransition';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* ========================================================================= */}
      {/* 1. HERO / FEATURED BANNER SECTION (Deep Cosmic Gradient + Light Trails)   */}
      {/* ========================================================================= */}
      <section id="hero" className="relative bg-gradient-to-b from-[#050814] via-[#0A1432] to-[#070D22] text-white pt-20 pb-6 sm:pb-8 overflow-hidden">
        {/* Masked Decorative Layer: Smoothly fades out orbs & grid before bottom edge to prevent horizontal clipping line */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.3) 72%, rgba(0,0,0,0) 100%)',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.3) 72%, rgba(0,0,0,0) 100%)'
          }}
        >
          {/* Subtle Tech Grid Pattern in Hero */}
          <TechGridParticles density="subtle" showParticles={true} />

          {/* Ambient Cosmic Radial Orbs & Mesh Lighting (Soft Radial Falloff without CSS blur-3xl GPU overhead) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.38)_0%,rgba(56,189,248,0.14)_40%,transparent_75%)] pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.28)_0%,transparent_70%)] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18)_0%,transparent_70%)] rounded-full pointer-events-none" />

          {/* Dynamic Glowing Wave Light Trails Centered in Banner (no edge interference) */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 pointer-events-none z-10 opacity-60">
            <GlowingLightTrails variant="hero-flow" />
          </div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Eyebrow Tag with subtle gradient glow & ScrollReveal */}
          <ScrollReveal direction="down" distance={16} duration={0.6}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-white/15 to-white/5 border border-white/20 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>BACHKHOA INNOVATION &amp; ENTREPRENEURSHIP CLUB</span>
              </span>
              <span className="text-xs font-mono font-medium text-slate-400 hidden sm:inline">
                DUT • 2026
              </span>
            </div>
          </ScrollReveal>

          {/* Giant Display Headline with Radiant Gradient Text & ScrollReveal */}
          <div className="space-y-6 max-w-5xl">
            <ScrollReveal direction="up" distance={28} delay={0.1} duration={0.7}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.08] text-white">
                Excellence in Innovation,{' '}
                <span className="bg-gradient-to-r from-[#38BDF8] via-[#BAE6FD] to-white bg-clip-text text-transparent block sm:inline">
                  Impact in Technology.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.65}>
              <p className="text-base sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
                Nền tảng số hóa kết nối sinh viên kỹ thuật Bách khoa với ban cố vấn chuyên môn, dự án nghiên cứu ứng dụng và mạng lưới doanh nghiệp khởi nghiệp quốc gia.
              </p>
            </ScrollReveal>
          </div>

          {/* Quick Actions with Gradient Buttons & ScrollReveal */}
          <ScrollReveal direction="up" distance={16} delay={0.3} duration={0.6}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/activities"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-white via-slate-100 to-sky-50 text-[#075985] text-xs sm:text-sm font-bold hover:from-[#38BDF8] hover:to-[#0284C7] hover:text-white transition-all duration-300 shadow-xl shadow-sky-500/10 group"
              >
                <span>Khám phá</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:border-[#38BDF8]/60 hover:bg-[#38BDF8]/10 transition-all duration-200 backdrop-blur-md"
              >
                <span>Dành cho Doanh nghiệp &amp; Đối tác</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Oura-Inspired Seamless Vertical Gradient Transition (Cosmic Navy -> Pure White) */}
      <HeroToNewsTransition />

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT SECTIONS (Sky Blue + Pure White with Tech Grid & Trails)  */}
      {/* ========================================================================= */}
      <div className="relative bg-white -mt-1">
        {/* Subtle Tech Grid Across Content */}
        <TechGridParticles density="subtle" showGrid={true} showParticles={false} />

        {/* Ambient Flowing Light Trails Weaving Throughout */}
        <GlowingLightTrails variant="ambient-trails" opacity={0.45} />

        {/* Soft Ambient Depth Glows with fluid floating animation (Mandatory Sky Blue Palette) */}
        <div className="absolute top-[8%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14)_0%,rgba(56,189,248,0.05)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-1" />
        <div className="absolute top-[32%] -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.12)_0%,rgba(2,132,199,0.04)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-2" />
        <div className="absolute top-[60%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,rgba(56,189,248,0.04)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-3" />
        <div className="absolute bottom-[6%] -right-24 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.14)_0%,rgba(2,132,199,0.05)_40%,transparent_70%)] pointer-events-none z-0 animate-float-orb-4" />

        <div className="relative z-10">
          {/* 2. BẢN TIN (NEWS) SECTION */}
          <NewsSection />

          {/* 3. CUỘC THI (COMPETITIONS) SECTION */}
          <CompetitionSection />

          {/* 4. HOẠT ĐỘNG NỔI BẬT (FEATURED ACTIVITIES) SECTION */}
          <FeaturedActivitiesSection />

          {/* 5. ĐỐI TÁC & HỆ SINH THÁI (PARTNERS & ECOSYSTEM) SECTION */}
          <PartnersSection />
        </div>
      </div>
    </div>
  );
};
