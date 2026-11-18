// BK-IC Digital Hub — Companion Project Statistics Section
// Count-up animation on viewport entry, strictly verified data, reduced motion compliant
import React, { useState, useEffect, useRef } from 'react';
import { COMPANION_PROJECT_STATS } from '../../data/partnershipData';

export const PartnershipStats: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    COMPANION_PROJECT_STATS.forEach(s => { initial[s.id] = 0; });
    return initial;
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instantly set final counts
      const finalCounts: { [key: string]: number } = {};
      COMPANION_PROJECT_STATS.forEach(s => { finalCounts[s.id] = s.numericValue; });
      setCounts(finalCounts);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate count-up smoothly over 1400ms
          const duration = 1400;
          const startTime = performance.now();

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const updated: { [key: string]: number } = {};
            COMPANION_PROJECT_STATS.forEach(s => {
              updated[s.id] = Math.floor(easeOut * s.numericValue);
            });
            setCounts(updated);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              const finals: { [key: string]: number } = {};
              COMPANION_PROJECT_STATS.forEach(s => { finals[s.id] = s.numericValue; });
              setCounts(finals);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-b from-white via-sky-50/40 to-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {COMPANION_PROJECT_STATS.map((stat) => {
            const currentVal = counts[stat.id] ?? 0;
            const displayFormatted = stat.numericValue < 10 ? `0${currentVal}` : `${currentVal}`;

            return (
              <div
                key={stat.id}
                className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#38BDF8] hover:shadow-md hover:shadow-sky-500/5 transition-all duration-300"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0284C7] tracking-tight tabular-nums font-mono">
                    {displayFormatted}
                  </span>
                  {stat.suffix && (
                    <span className="text-2xl sm:text-3xl font-bold text-[#38BDF8]">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-sm sm:text-base font-bold text-[#10182D]">
                  {stat.label}
                </h3>

                <p className="mt-1 text-xs text-slate-500 leading-relaxed font-normal">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
