// SECTION 03 — ABOUT BK-IC IMAGE PARALLAX (GSAP Parallax & Staggered Reveal)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { BKIC_MEDIA_ASSETS } from '../../data/mediaAssets';
import { SafeImage } from '../common/SafeImage';
import { ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageInnerRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set([imageContainerRef.current, textColRef.current?.children || []], {
          opacity: 1,
          y: 0,
          scale: 1
        });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop & Tablet (>= 768px): Parallax on image and scrub
      mm.add('(min-width: 768px)', () => {
        // Initial state
        gsap.set(imageContainerRef.current, { opacity: 0, y: 30 });
        gsap.set(imageInnerRef.current, { scale: 1.08, y: -20 });
        gsap.set(textColRef.current?.children || [], { opacity: 0, y: 30 });

        // Entrance timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          },
          defaults: { ease: 'power3.out' }
        });

        tl.to(imageContainerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9
        }).to(
          textColRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12
          },
          '-=0.6'
        );

        // Parallax scrub on image
        gsap.to(imageInnerRef.current, {
          y: 25,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Mobile (< 768px): Clean simple reveals without heavy scrub parallax
      mm.add('(max-width: 767px)', () => {
        gsap.set(imageContainerRef.current, { opacity: 0, y: 20 });
        gsap.set(textColRef.current?.children || [], { opacity: 0, y: 20 });

        gsap.to([imageContainerRef.current, ...(textColRef.current?.children || [])], {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true
          }
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Authentic Club Photograph with Parallax Wrapper */}
        <div className="lg:col-span-6 relative">
          <div
            ref={imageContainerRef}
            className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg group bg-slate-100"
          >
            <div ref={imageInnerRef} className="will-change-transform">
              <SafeImage
                src={BKIC_MEDIA_ASSETS.bkic_launch.localUrl}
                fallbackSrc={BKIC_MEDIA_ASSETS.bkic_launch.originalUrl}
                alt="Lễ ra mắt Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo - Bách Khoa Innovation Club"
                aspectRatio="aspect-16/10"
                title="Lễ ra mắt BK-IC tại Trường ĐH Bách khoa - ĐHĐN"
                tag="Tư liệu chính thức"
                className="group-hover:scale-102 transition duration-500"
              />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between px-1">
            <span>{BKIC_MEDIA_ASSETS.bkic_launch.caption}</span>
            <span className="font-medium text-blue-600 font-mono">Báo Đà Nẵng · 04/04/2026</span>
          </div>
        </div>

        {/* Right: Editorial Narrative & Affiliation */}
        <div ref={textColRef} className="lg:col-span-6 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono">
            Giới thiệu chung
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            Chúng mình là ai?
          </h2>
          <div className="space-y-4 text-slate-600 text-base leading-relaxed font-normal">
            <p>
              <strong>BK-IC (Bách Khoa Innovation Club)</strong> là cộng đồng sinh viên quan tâm đến khởi nghiệp và đổi mới sáng tạo tại <strong>Trường Đại học Bách khoa, Đại học Đà Nẵng</strong>.
            </p>
            <p>
              Chúng mình hướng tới một không gian nơi những người trẻ có thể kết nối, học hỏi, chia sẻ góc nhìn và cùng nhau từng bước hiện thực hóa ý tưởng qua các dự án công nghệ thực tế.
            </p>
          </div>

          {/* Proof-point Citation Box */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Nguồn báo chí xác thực</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Lễ ra mắt CLB được Báo Đà Nẵng giới thiệu trong bài đăng ngày 04/04/2026 về liên kết và thúc đẩy tinh thần khởi nghiệp đổi mới sáng tạo tại Đà Nẵng.
            </p>
            <a
              href="https://baodanang.vn/thuc-day-lien-ket-trong-khoi-nghiep-3330893.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline pt-0.5"
            >
              <span>Xem bài đăng trên Báo Đà Nẵng điện tử</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#245BFA] hover:text-blue-800 transition group"
            >
              <span>Tìm hiểu thêm về tổ chức & 5 Ban chuyên môn</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
