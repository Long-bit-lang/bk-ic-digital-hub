// BK-IC Digital Hub — Reusable Institutional Page Hero Banner
// Unifies all public subpages with the signature Cosmic Deep Tech + Light Wave style of the Homepage
import React from 'react';
import { TechGridParticles } from '../effects/TechGridParticles';
import { GlowingLightTrails } from '../effects/GlowingLightTrails';
import { ScrollReveal } from '../effects/ScrollReveal';
import { HeroToNewsTransition } from '../effects/HeroToNewsTransition';
import { Breadcrumbs, type BreadcrumbItem } from '../editorial/Breadcrumbs';

export interface PageHeroBannerProps {
  eyebrow?: string;
  badge?: React.ReactNode;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  compact?: boolean;
}

export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  eyebrow,
  badge,
  title,
  titleHighlight,
  subtitle,
  breadcrumbs,
  actions,
  children,
  compact = false
}) => {
  return (
    <div className="relative">
      {/* 1. Top Cosmic Banner Header */}
      <section
        className={`relative bg-gradient-to-b from-[#050814] via-[#0A1432] to-[#070D22] text-white overflow-hidden ${
          compact ? 'pt-20 sm:pt-24 pb-5 sm:pb-6' : 'pt-24 sm:pt-28 pb-6 sm:pb-8'
        }`}
      >
        {/* Subtle Tech Grid Pattern */}
        <TechGridParticles density="subtle" showParticles={true} />

        {/* Ambient Cosmic Radial Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0284C7]/35 via-[#38BDF8]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#0284C7]/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-bl from-[#38BDF8]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Glowing Wave Light Trails Centered in Banner */}
        <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 pointer-events-none z-10 opacity-55">
          <GlowingLightTrails variant="hero-flow" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumbs in dark banner mode */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <ScrollReveal direction="down" distance={12} duration={0.5}>
              <Breadcrumbs items={breadcrumbs} variant="dark" />
            </ScrollReveal>
          )}

          {/* Eyebrow Tag / Badge */}
          {(eyebrow || badge) && (
            <ScrollReveal direction="down" distance={16} duration={0.6}>
              <div className="flex flex-wrap items-center gap-3">
                {eyebrow && (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-white/15 to-white/5 border border-white/20 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span>{eyebrow}</span>
                  </span>
                )}
                {badge}
              </div>
            </ScrollReveal>
          )}

          {/* Giant Display Headline with Radiant Sky Blue Gradient */}
          <div className="space-y-4 max-w-4xl">
            <ScrollReveal direction="up" distance={22} delay={0.08} duration={0.65}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
                {title}{' '}
                {titleHighlight && (
                  <span className="bg-gradient-to-r from-[#38BDF8] via-[#BAE6FD] to-white bg-clip-text text-transparent block sm:inline">
                    {titleHighlight}
                  </span>
                )}
              </h1>
            </ScrollReveal>

            {subtitle && (
              <ScrollReveal direction="up" distance={16} delay={0.16} duration={0.6}>
                <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-3xl">
                  {subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>

          {/* Optional actions or custom children */}
          {actions && (
            <ScrollReveal direction="up" distance={14} delay={0.22} duration={0.5}>
              <div className="pt-1">{actions}</div>
            </ScrollReveal>
          )}
          {children}
        </div>
      </section>

      {/* 2. Oura-Inspired Seamless Vertical Gradient Transition (Cosmic Navy -> Pure White) */}
      <HeroToNewsTransition />
    </div>
  );
};

