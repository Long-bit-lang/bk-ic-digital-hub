// SECTION 10 — RECRUITMENT FINALE (Cinematic Climax with GSAP Reveal & Magnetic CTA)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { useMagneticButton } from '../../hooks/useMagneticButton';

export const RecruitmentSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  // Magnetic button on the primary recruitment CTA
  const magneticBtnRef = useMagneticButton<HTMLAnchorElement>({ maxOffset: 8, speed: 0.25 });

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      });

      tl.from(glowRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1.4,
        ease: 'power2.out'
      }).from(
        contentRef.current?.children || [],
        {
          opacity: 0,
          y: 35,
          duration: 0.8,
          stagger: 0.12
        },
        '-=1.0'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#0B1020] via-slate-950 to-[#0B1020] text-white py-28 sm:py-36 px-4 sm:px-6 lg:px-8 text-center"
    >
      {/* Soft Radial Ambient Lighting */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(36,91,250,0.22)_0%,_transparent_70%)] will-change-transform"
      />

      <div ref={contentRef} className="relative mx-auto max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-mono">MỞ ĐƠN TUYỂN THÀNH VIÊN GEN 2026</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.03em] leading-[1.08] text-balance">
          Ý tưởng tiếp theo
          <br />
          có thể bắt đầu từ bạn.
        </h2>

        <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Không cần một ý tưởng hoàn hảo. Không nhất thiết phải có kinh nghiệm khởi nghiệp. Hãy mang theo sự tò mò, tinh thần chủ động và mong muốn cùng những người bạn mới tạo ra điều khác biệt tại Bách khoa.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            ref={magneticBtnRef}
            to="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#245BFA] px-9 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition group cursor-pointer"
          >
            <span>Gia nhập BK-IC</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://www.facebook.com/dut.bkic"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition backdrop-blur-xs group"
          >
            <span>Theo dõi Fanpage Facebook</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="pt-8 text-xs text-slate-400 font-mono">
          Fanpage chính thức: <a href="https://www.facebook.com/dut.bkic" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">facebook.com/dut.bkic</a>
        </div>
      </div>
    </section>
  );
};
