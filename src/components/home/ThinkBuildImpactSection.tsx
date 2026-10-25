// SECTION 04 — THINK. BUILD. IMPACT. (Signature GSAP Pinned Storytelling Section)
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { Lightbulb, Wrench, Globe2, Sparkles } from 'lucide-react';

export const ThinkBuildImpactSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const bgGlowRef = useRef<HTMLDivElement | null>(null);

  // Chapter cards refs (Desktop pinned slides)
  const slide1Ref = useRef<HTMLDivElement | null>(null);
  const slide2Ref = useRef<HTMLDivElement | null>(null);
  const slide3Ref = useRef<HTMLDivElement | null>(null);

  // Indicators refs
  const progressLineRef = useRef<HTMLDivElement | null>(null);

  const chapters = [
    {
      num: '01',
      tag: 'THINK',
      title: 'Dám nghĩ khác.',
      subtitle: 'Tư duy phản biện & Nhận diện vấn đề thực',
      body: 'Bắt đầu từ việc đặt câu hỏi, nhận diện những trăn trở quanh cuộc sống học tập và tìm kiếm góc nhìn mới vượt qua khuôn khổ lý thuyết bài giảng. Khởi đầu của mọi sự đổi mới luôn là một câu hỏi can đảm.',
      icon: Lightbulb,
      badge: 'Tư duy Khởi nghiệp',
      gradient: 'from-blue-500/25 via-indigo-600/10 to-transparent',
      glowColor: 'rgba(36, 91, 250, 0.35)',
      accentText: 'text-blue-400'
    },
    {
      num: '02',
      tag: 'BUILD',
      title: 'Dám bắt tay làm.',
      subtitle: 'Chế tạo phần cứng, lập trình phần mềm & Thử nghiệm',
      body: 'Không dừng lại ở ý tưởng trên giấy, cùng nhau trau dồi kỹ năng, thiết kế giải pháp kỹ thuật, thử nghiệm nguyên mẫu và hoàn thiện qua phản hồi người dùng. Biến mã nguồn và linh kiện thành sản phẩm chạm tới cuộc sống.',
      icon: Wrench,
      badge: 'Công nghệ & Kỹ thuật',
      gradient: 'from-indigo-500/25 via-purple-600/10 to-transparent',
      glowColor: 'rgba(139, 132, 246, 0.35)',
      accentText: 'text-indigo-400'
    },
    {
      num: '03',
      tag: 'IMPACT',
      title: 'Dám tạo giá trị.',
      subtitle: 'Giải pháp ứng dụng thực tiễn & Lan tỏa cộng đồng',
      body: 'Hướng đến các giải pháp có ích cho sinh viên, nhà trường, doanh nghiệp công nghệ và cộng đồng xã hội tại Đà Nẵng cũng như miền Trung. Khi tri thức Bách khoa giải quyết được vấn đề thực tế, đó là niềm tự hào lớn nhất.',
      icon: Globe2,
      badge: 'Tác động Xã hội',
      gradient: 'from-purple-500/25 via-blue-600/10 to-transparent',
      glowColor: 'rgba(76, 141, 255, 0.35)',
      accentText: 'text-purple-400'
    }
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      // DESKTOP PINNED STORYTELLING (min-width: 1024px)
      mm.add('(min-width: 1024px)', () => {
        // Initial setup for slides
        // Slide 1 active initially
        gsap.set(slide1Ref.current, { opacity: 1, y: 0, scale: 1 });
        // Slide 2 and 3 hidden below
        gsap.set(slide2Ref.current, { opacity: 0, y: 60, scale: 0.96 });
        gsap.set(slide3Ref.current, { opacity: 0, y: 60, scale: 0.96 });
        gsap.set(progressLineRef.current, { scaleY: 0.33, transformOrigin: 'top center' });

        // Master pinned scrub timeline
        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=2200', // Scroll distance for 3 chapters
            pin: pinContainerRef.current,
            scrub: 0.8,
            anticipatePin: 1
          }
        });

        // Step 1 -> Transition to Chapter 02 (BUILD)
        scrubTl
          .to(
            slide1Ref.current,
            {
              opacity: 0,
              y: -50,
              scale: 0.96,
              duration: 1,
              ease: 'power2.inOut'
            },
            'toBuild'
          )
          .to(
            slide2Ref.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power2.inOut'
            },
            'toBuild'
          )
          .to(
            progressLineRef.current,
            {
              scaleY: 0.66,
              duration: 1,
              ease: 'power1.inOut'
            },
            'toBuild'
          )
          .to(
            bgGlowRef.current,
            {
              background: 'radial-gradient(circle at center, rgba(139, 132, 246, 0.3) 0%, transparent 70%)',
              duration: 1
            },
            'toBuild'
          );

        // Step 2 -> Transition to Chapter 03 (IMPACT)
        scrubTl
          .to(
            slide2Ref.current,
            {
              opacity: 0,
              y: -50,
              scale: 0.96,
              duration: 1,
              ease: 'power2.inOut'
            },
            'toImpact'
          )
          .to(
            slide3Ref.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power2.inOut'
            },
            'toImpact'
          )
          .to(
            progressLineRef.current,
            {
              scaleY: 1,
              duration: 1,
              ease: 'power1.inOut'
            },
            'toImpact'
          )
          .to(
            bgGlowRef.current,
            {
              background: 'radial-gradient(circle at center, rgba(36, 91, 250, 0.35) 0%, transparent 70%)',
              duration: 1
            },
            'toImpact'
          );
      });

      // MOBILE & TABLET (< 1024px): Clean Staggered Cards Reveal
      mm.add('(max-width: 1023px)', () => {
        const cards = containerRef.current?.querySelectorAll('.mobile-story-card');
        if (cards && cards.length > 0) {
          gsap.from(cards, {
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              once: true
            }
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0B1020] text-white overflow-hidden selection:bg-blue-500/30"
    >
      {/* Background ambient lighting */}
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-700 bg-[radial-gradient(circle_at_center,_rgba(36,91,250,0.25)_0%,_transparent_70%)]"
      />

      {/* =========================================================================
          DESKTOP PINNED STORY CONTAINER (Hidden on <1024px)
          ========================================================================= */}
      <div
        ref={pinContainerRef}
        className="hidden lg:flex min-h-screen w-full flex-col justify-center px-8 lg:px-16 max-w-7xl mx-auto py-16"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6 mb-12">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRỤ CỘT HÀNH ĐỘNG BK-IC</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Think. Build. Impact.
            </h2>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <div>DUT · BACH KHOA INNOVATION CLUB</div>
            <div className="text-slate-500">Cuộn để theo dõi từng giai đoạn</div>
          </div>
        </div>

        {/* Center Stage: Split Composition (Progress Bar & Story Deck) */}
        <div className="grid grid-cols-12 gap-12 items-center relative min-h-[460px]">
          {/* Col Left: Progress Indicator Timeline (Col 3) */}
          <div className="col-span-3 flex items-center gap-6">
            <div className="relative h-64 w-1 bg-slate-800 rounded-full overflow-hidden shrink-0">
              <div
                ref={progressLineRef}
                className="w-full h-full bg-gradient-to-b from-[#245BFA] via-[#8B84F6] to-[#4C8DFF] rounded-full will-change-transform"
              />
            </div>

            <div className="space-y-10 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-slate-400 font-bold">01 — THINK</div>
                <div className="text-slate-500 text-[11px]">Dám nghĩ khác</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 font-bold">02 — BUILD</div>
                <div className="text-slate-500 text-[11px]">Dám bắt tay làm</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 font-bold">03 — IMPACT</div>
                <div className="text-slate-500 text-[11px]">Dám tạo giá trị</div>
              </div>
            </div>
          </div>

          {/* Col Right: Overlapping Cards Deck (Col 9) */}
          <div className="col-span-9 relative min-h-[420px]">
            {/* SLIDE 01: THINK */}
            <div
              ref={slide1Ref}
              className="absolute inset-0 rounded-[32px] border border-blue-500/50 bg-slate-900/90 p-10 sm:p-14 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden will-change-transform"
            >
              <div className="pointer-events-none absolute -right-20 -bottom-20 text-[260px] font-extrabold text-blue-500/[0.04] select-none leading-none font-mono">
                01
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm font-bold text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    01 — {chapters[0].tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {chapters[0].badge}
                  </span>
                </div>

                <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                  {chapters[0].title}
                </h3>
                <div className="text-lg text-blue-300 font-medium mb-6">
                  {chapters[0].subtitle}
                </div>
                <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {chapters[0].body}
                </p>
              </div>

              <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  <span>Kích hoạt tư duy phản biện & Đặt câu hỏi đúng</span>
                </div>
                <span className="font-mono text-slate-500">Giai đoạn 1 / 3</span>
              </div>
            </div>

            {/* SLIDE 02: BUILD */}
            <div
              ref={slide2Ref}
              className="absolute inset-0 rounded-[32px] border border-indigo-500/50 bg-slate-900/90 p-10 sm:p-14 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden will-change-transform"
            >
              <div className="pointer-events-none absolute -right-20 -bottom-20 text-[260px] font-extrabold text-indigo-500/[0.04] select-none leading-none font-mono">
                02
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    02 — {chapters[1].tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {chapters[1].badge}
                  </span>
                </div>

                <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                  {chapters[1].title}
                </h3>
                <div className="text-lg text-indigo-300 font-medium mb-6">
                  {chapters[1].subtitle}
                </div>
                <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {chapters[1].body}
                </p>
              </div>

              <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-indigo-400" />
                  <span>Chế tạo nguyên mẫu & Hoàn thiện giải pháp kỹ thuật</span>
                </div>
                <span className="font-mono text-slate-500">Giai đoạn 2 / 3</span>
              </div>
            </div>

            {/* SLIDE 03: IMPACT */}
            <div
              ref={slide3Ref}
              className="absolute inset-0 rounded-[32px] border border-purple-500/50 bg-slate-900/90 p-10 sm:p-14 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden will-change-transform"
            >
              <div className="pointer-events-none absolute -right-20 -bottom-20 text-[260px] font-extrabold text-purple-500/[0.04] select-none leading-none font-mono">
                03
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm font-bold text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                    03 — {chapters[2].tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {chapters[2].badge}
                  </span>
                </div>

                <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                  {chapters[2].title}
                </h3>
                <div className="text-lg text-purple-300 font-medium mb-6">
                  {chapters[2].subtitle}
                </div>
                <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {chapters[2].body}
                </p>
              </div>

              <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-purple-400" />
                  <span>Ứng dụng thực tiễn & Đóng góp giá trị xã hội</span>
                </div>
                <span className="font-mono text-slate-500">Giai đoạn 3 / 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET CLEAN VERTICAL LAYOUT (Shown on <1024px)
          ========================================================================= */}
      <div className="lg:hidden py-24 px-4 sm:px-6 max-w-2xl mx-auto space-y-12">
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            TRỤ CỘT HÀNH ĐỘNG
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Think. Build. Impact.
          </h2>
          <p className="text-sm text-slate-400">
            Ba tinh thần. Một hành trình sáng tạo cùng sinh viên Bách khoa.
          </p>
        </div>

        <div className="space-y-6">
          {chapters.map((ch) => (
            <div
              key={ch.num}
              className="mobile-story-card rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${ch.accentText}`}>
                  {ch.num} — {ch.tag}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {ch.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                {ch.title}
              </h3>

              <div className={`text-xs font-medium ${ch.accentText}`}>
                {ch.subtitle}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {ch.body}
              </p>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                DUT · BK-IC
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
