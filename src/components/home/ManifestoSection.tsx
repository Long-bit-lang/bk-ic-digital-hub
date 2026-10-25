// SECTION 02 — MANIFESTO TEXT REVEAL (GSAP ScrollTrigger Masked Reveal)
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const lineDividerRef = useRef<HTMLSpanElement | null>(null);
  const badgeRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            line1Ref.current,
            line2Ref.current,
            bodyRef.current,
            lineDividerRef.current,
            badgeRef.current
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        );
        return;
      }

      // Initial state
      gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 105, opacity: 0 });
      gsap.set(bodyRef.current, { opacity: 0, y: 25 });
      gsap.set(lineDividerRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(badgeRef.current, { opacity: 0, x: -10 });

      // ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      })
        .to(
          line1Ref.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8
          },
          '-=0.35'
        )
        .to(
          line2Ref.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8
          },
          '-=0.55'
        )
        .to(
          bodyRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          '-=0.45'
        )
        .to(
          lineDividerRef.current,
          {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.inOut'
          },
          '-=0.3'
        )
        .to(
          badgeRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.5
          },
          '-=0.3'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="border-b border-slate-200/80 bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
          <div className="lg:col-span-8 space-y-6">
            <div
              ref={eyebrowRef}
              className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono"
            >
              Tuyên ngôn sáng tạo
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-[#111318] leading-[1.08] text-balance">
              <span className="block overflow-hidden py-1">
                <span ref={line1Ref} className="block will-change-transform">
                  Không chỉ là một câu lạc bộ.
                </span>
              </span>
              <span className="block overflow-hidden py-1">
                <span ref={line2Ref} className="block text-[#667085] will-change-transform">
                  Đây là nơi ý tưởng bắt đầu.
                </span>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-6 pt-4 lg:pt-0">
            <p
              ref={bodyRef}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
            >
              Chúng mình tin rằng đổi mới sáng tạo không phải là đặc quyền của những đề án vĩ mô, mà khởi nguồn từ một câu hỏi tò mò trong phòng thí nghiệm, một trăn trở từ giảng đường Bách khoa và tinh thần dám bắt tay biến nó thành hiện thực.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-slate-400">
              <span
                ref={lineDividerRef}
                className="h-px w-10 bg-slate-400 will-change-transform inline-block"
              />
              <span ref={badgeRef} className="font-mono">
                BK-IC CREATIVE MANIFESTO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
