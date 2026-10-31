// SECTION 01 — CINEMATIC HERO INTRODUCTION (GSAP Timeline + Masked Reveals)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { HeroCanvas } from './HeroCanvas';
import { ArrowRight } from 'lucide-react';
import { useMagneticButton } from '../../hooks/useMagneticButton';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement | null>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const proofStripRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const bgGlowRef = useRef<HTMLDivElement | null>(null);

  // Magnetic button on primary CTA
  const primaryBtnRef = useMagneticButton<HTMLButtonElement>({ maxOffset: 6, speed: 0.25 });

  const scrollToManifesto = () => {
    const el = document.getElementById('manifesto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useGSAP(
    () => {
      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Instant visibility without motion
        gsap.set(
          [
            eyebrowRef.current,
            headlineLine1Ref.current,
            headlineLine2Ref.current,
            subtitleRef.current,
            tagRef.current,
            ctaGroupRef.current,
            proofStripRef.current,
            scrollIndicatorRef.current,
            bgGlowRef.current
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Initial state
      gsap.set(bgGlowRef.current, { opacity: 0, scale: 1.08 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 18 });
      gsap.set([headlineLine1Ref.current, headlineLine2Ref.current], {
        yPercent: 120,
        opacity: 0
      });
      gsap.set(subtitleRef.current, { opacity: 0, y: 24 });
      gsap.set(tagRef.current, { opacity: 0, y: 16 });
      gsap.set(ctaGroupRef.current?.children || [], { opacity: 0, y: 20 });
      gsap.set(proofStripRef.current?.children || [], { opacity: 0, y: 15 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 10 });

      // Master Entrance Timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15
      });

      tl.to(bgGlowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: 'power2.out'
      })
        .to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          '-=1.2'
        )
        // Stage 3: Masked line reveals
        .to(
          headlineLine1Ref.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out'
          },
          '-=0.5'
        )
        .to(
          headlineLine2Ref.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out'
          },
          '-=0.72'
        )
        // Stage 4: Subtitle & Tag
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75
          },
          '-=0.55'
        )
        .to(
          tagRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6
          },
          '-=0.5'
        )
        // Stage 5: CTA buttons sequentially
        .to(
          ctaGroupRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12
          },
          '-=0.45'
        )
        .to(
          proofStripRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08
          },
          '-=0.35'
        )
        // Stage 7: Scroll indicator
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6
          },
          '-=0.2'
        );

      // ScrollTrigger exit interaction
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        animation: gsap.to(
          [
            eyebrowRef.current,
            headlineLine1Ref.current?.parentElement,
            headlineLine2Ref.current?.parentElement,
            subtitleRef.current,
            ctaGroupRef.current
          ],
          {
            y: -50,
            opacity: 0.35,
            ease: 'none',
            stagger: 0.04
          }
        )
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white via-[#F8FAFC] to-[#FAFAFA] px-4 pt-16 pb-12 sm:px-6 lg:px-8"
    >
      {/* Soft Radial Ambient Lighting with GSAP target ref */}
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[680px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-100/60 via-indigo-100/30 to-transparent blur-3xl will-change-transform"
      />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      {/* Dynamic Connective Canvas */}
      <HeroCanvas />

      {/* Hero Central Narrative */}
      <div className="relative mx-auto my-auto max-w-5xl text-center z-10 pt-6">
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-blue-200/90 bg-white/95 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#245BFA] shadow-xs backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#245BFA]"></span>
          </span>
          <span className="font-mono text-[11px] sm:text-xs">BACH KHOA INNOVATION CLUB · ĐH ĐÀ NẴNG</span>
        </div>

        {/* Primary Editorial Headline: Masked lines for GSAP reveal */}
        <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] font-extrabold tracking-[-0.035em] text-[#111318] leading-[1.03] text-balance">
          {/* Masked Line 1 */}
          <span className="block overflow-hidden py-1">
            <span ref={headlineLine1Ref} className="block will-change-transform">
              Ý tưởng hôm nay.
            </span>
          </span>
          {/* Masked Line 2 */}
          <span className="block overflow-hidden py-1">
            <span
              ref={headlineLine2Ref}
              className="block bg-gradient-to-r from-[#245BFA] via-[#4C8DFF] to-[#8B84F6] bg-clip-text text-transparent will-change-transform"
            >
              Tương lai ngày mai.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#667085] leading-relaxed font-normal text-balance"
        >
          Nơi những người trẻ Bách khoa gặp gỡ, học hỏi và cùng nhau biến những ý tưởng sáng tạo thành giải pháp mang giá trị thực tiễn.
        </p>

        {/* English Tagline Accent */}
        <div
          ref={tagRef}
          className="mt-3 text-xs font-mono font-medium tracking-widest uppercase text-slate-400"
        >
          — Where Ideas Become Impact —
        </div>

        {/* Primary & Secondary Action CTAs */}
        <div ref={ctaGroupRef} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            ref={primaryBtnRef}
            onClick={scrollToManifesto}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#245BFA] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition duration-200 cursor-pointer"
          >
            <span>Khám phá BK-IC</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            to="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white/90 px-8 py-3.5 text-sm font-semibold text-[#111318] backdrop-blur-sm hover:bg-white hover:border-slate-400 transition duration-200 shadow-xs"
          >
            <span>Trở thành thành viên</span>
          </Link>
        </div>

        {/* Proof Strip Indicators */}
        <div
          ref={proofStripRef}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Cơ cấu 3 Ban: BCN · BĐH · BTV</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Điểm danh QR động minh bạch</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span>Bảo trợ bởi Trường ĐH Bách khoa</span>
          </div>
        </div>
      </div>

      {/* Hero Bottom Strip: Minimal Scroll Indicator & Verified Tagline */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-10 mx-auto w-full max-w-6xl pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] border-t border-slate-200/60 gap-3"
      >
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span>CLB Khởi nghiệp & Đổi mới sáng tạo</span>
          <span aria-hidden="true">·</span>
          <span>Trường ĐH Bách khoa – ĐH Đà Nẵng</span>
        </div>

        <button
          onClick={scrollToManifesto}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <span>Cuộn để khám phá</span>
          <span className="inline-block h-3.5 w-0.5 bg-slate-400 rounded-full animate-bounce" />
        </button>
      </div>
    </section>
  );
};
