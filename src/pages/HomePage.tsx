// BK-IC Digital Hub — Public Homepage (Minimalist Editorial & Modern Tech with Rich Gradients)
import React from 'react';
import { Link } from 'react-router-dom';
import { HorizonLightGlow } from '../components/editorial/AbstractVisuals';
import { ArrowRight } from 'lucide-react';
import { NewsSection } from '../components/home/NewsSection';
import { CompetitionSection } from '../components/home/CompetitionSection';
import { FeaturedActivitiesSection } from '../components/home/FeaturedActivitiesSection';
import { PartnersSection } from '../components/home/PartnersSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-[#10182D] selection:bg-blue-100 selection:text-[#1749B5] overflow-x-clip">
      {/* ========================================================================= */}
      {/* 1. HERO / FEATURED BANNER SECTION (Deep Cosmic Gradient)                 */}
      {/* ========================================================================= */}
      <section id="hero" className="relative bg-gradient-to-b from-[#050814] via-[#0A1432] to-[#070D22] text-white pt-20 pb-28 sm:pb-36 overflow-hidden">
        {/* Ambient Cosmic Radial Orbs & Mesh Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1749B5]/40 via-[#245BFA]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#1749B5]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-bl from-[#6B9DFF]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#070D22] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Eyebrow Tag with subtle gradient glow */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-white/15 to-white/5 border border-white/20 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6B9DFF] animate-pulse" />
              <span>BACHKHOA INNOVATION &amp; ENTREPRENEURSHIP CLUB</span>
            </span>
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">
              DUT • ĐHĐN • 2026
            </span>
          </div>

          {/* Giant Display Headline with Radiant Gradient Text */}
          <div className="space-y-6 max-w-5xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.08] text-white">
              Excellence in Innovation,{' '}
              <span className="bg-gradient-to-r from-[#6B9DFF] via-[#A8C7FF] to-white bg-clip-text text-transparent block sm:inline">
                Impact in Technology.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              Nền tảng số hóa kết nối sinh viên kỹ thuật Bách khoa với ban cố vấn chuyên môn, dự án nghiên cứu ứng dụng và mạng lưới doanh nghiệp khởi nghiệp quốc gia.
            </p>
          </div>

          {/* Quick Actions with Gradient Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/activities"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-white via-slate-100 to-slate-200 text-[#090E1A] text-xs sm:text-sm font-bold hover:from-[#6B9DFF] hover:to-[#1749B5] hover:text-white transition-all duration-300 shadow-xl shadow-white/10 group"
            >
              <span>Khám phá</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/partnership"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:border-white/40 hover:bg-white/15 transition-all duration-200 backdrop-blur-md"
            >
              <span>Dành cho Doanh nghiệp &amp; Đối tác</span>
            </Link>
          </div>
        </div>

        {/* Horizon Light Glow Streak at the bottom boundary */}
        <div className="absolute bottom-0 inset-x-0">
          <HorizonLightGlow />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT SECTIONS (Animated Shifting Gradient & Floating Glows)   */}
      {/* ========================================================================= */}
      <div className="relative animated-tech-bg">
        {/* Soft Ambient Depth Glows with fluid floating animation */}
        <div className="absolute top-[8%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-1" />
        <div className="absolute top-[32%] -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-2" />
        <div className="absolute top-[60%] -left-40 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.10),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-3" />
        <div className="absolute bottom-[6%] -right-24 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_70%)] pointer-events-none -z-10 blur-3xl animate-float-orb-4" />

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
  );
};
