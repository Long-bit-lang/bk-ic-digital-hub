// SECTION 07 — WEEKLY ACTIVITIES (GSAP Coordinated Scroll Reveal)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { BKIC_MEDIA_ASSETS } from '../../data/mediaAssets';
import { SafeImage } from '../common/SafeImage';
import { Calendar, ArrowRight } from 'lucide-react';

export const WeeklySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const imageColRef = useRef<HTMLDivElement | null>(null);

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

      tl.from(textColRef.current?.children || [], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12
      }).from(
        imageColRef.current,
        {
          opacity: 0,
          scale: 0.96,
          y: 20,
          duration: 0.9
        },
        '-=0.6'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div ref={textColRef} className="lg:col-span-6 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono">
            Nhịp sinh hoạt thường nhật
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            Mỗi tuần một cuộc gặp.
            <br />
            Mỗi lần thêm một bước tiến.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Các buổi sinh hoạt định kỳ là không gian để thành viên gặp gỡ, chia sẻ kiến thức, cùng thảo luận một chủ đề chuyên môn và gắn kết đồng đội. Thành viên có thể theo dõi lịch trên cổng nội bộ, điểm danh QR động và gửi góp ý để Ban Chủ nhiệm liên tục cải thiện chất lượng chương trình.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#245BFA] px-6 py-3 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs group"
            >
              <Calendar className="h-4 w-4" />
              <span>Xem lịch sinh hoạt sắp tới</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div ref={imageColRef} className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-md group">
            <SafeImage
              src={BKIC_MEDIA_ASSETS.bkic_facebook_user_05.localUrl}
              fallbackSrc={BKIC_MEDIA_ASSETS.bkic_facebook_user_05.originalUrl}
              alt="Đồng đội sinh viên BK-IC"
              aspectRatio="aspect-4/3"
              title="Sinh hoạt định kỳ BK-IC"
              tag="Gắn kết đồng đội"
              className="group-hover:scale-102 transition duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
