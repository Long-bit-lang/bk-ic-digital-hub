// BK-IC Digital Hub - Public Landing Page (Apple-Level Minimalism × GSAP Cinematic Storytelling)
import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ManifestoSection } from '../components/home/ManifestoSection';
import { AboutSection } from '../components/home/AboutSection';
import { ThinkBuildImpactSection } from '../components/home/ThinkBuildImpactSection';
import { ActivitiesSection } from '../components/home/ActivitiesSection';
import { GallerySection } from '../components/home/GallerySection';
import { WeeklySection } from '../components/home/WeeklySection';
import { EcosystemSection } from '../components/home/EcosystemSection';
import { PortalPreviewSection } from '../components/home/PortalPreviewSection';
import { RecruitmentSection } from '../components/home/RecruitmentSection';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#111318] selection:bg-[#DCEBFF] selection:text-[#245BFA]">
      {/* 01: Cinematic Hero Introduction (GSAP Timeline + Masked Reveals) */}
      <HeroSection />

      {/* 02: Editorial Manifesto (GSAP ScrollTrigger Masked Text Reveal) */}
      <ManifestoSection />

      {/* 03: About BK-IC ("Chúng mình là ai?") (GSAP Parallax Image & Verified Provenance) */}
      <AboutSection />

      {/* 04: Think. Build. Impact. (Signature GSAP Pinned Storytelling Section) */}
      <ThinkBuildImpactSection />

      {/* 05: Activity Showcase (GSAP Staggered Bento Reveals & Micro-Interactions) */}
      <ActivitiesSection />

      {/* 06: Immersive Photo Gallery (GSAP Parallax Columns & Animated Lightbox) */}
      <GallerySection />

      {/* 07: Weekly Activities (GSAP Coordinated Reveal) */}
      <WeeklySection />

      {/* 08: Innovation Ecosystem (GSAP Staggered Editorial Cards) */}
      <EcosystemSection />

      {/* 09: Member Portal Preview (GSAP Floating Product Scale & Live Interactive QR Demo) */}
      <PortalPreviewSection />

      {/* 10: Recruitment Finale (GSAP Cinematic Climax & Magnetic CTA) */}
      <RecruitmentSection />
    </div>
  );
};
