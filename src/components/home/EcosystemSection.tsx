// SECTION 08 — INNOVATION ECOSYSTEM (GSAP Staggered Editorial Cards)
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { BKIC_MEDIA_ASSETS } from '../../data/mediaAssets';
import { SafeImage } from '../common/SafeImage';
import { ExternalLink } from 'lucide-react';

export const EcosystemSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          once: true
        }
      });

      gsap.from(cardsRef.current?.children || [], {
        opacity: 0,
        y: 40,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          once: true
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="border-t border-b border-slate-200/80 bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl space-y-16">
        <div ref={headerRef} className="max-w-2xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono">
            Hệ sinh thái liên kết
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            Từ giảng đường. Đến những ý tưởng lớn.
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Các sự kiện, cuộc thi và ngày hội khoa học công nghệ cấp trường tạo bệ phóng thúc đẩy tinh thần khởi nghiệp đổi mới sáng tạo trong sinh viên Bách khoa.
          </p>
        </div>

        {/* 3 Real Verified Ecosystem Stories */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Story 1: BK-IC Launch */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 flex flex-col justify-between hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80">
                <SafeImage
                  src={BKIC_MEDIA_ASSETS.bkic_launch.localUrl}
                  fallbackSrc={BKIC_MEDIA_ASSETS.bkic_launch.originalUrl}
                  alt="Lễ ra mắt BK-IC"
                  aspectRatio="aspect-16/10"
                  title="Lễ ra mắt BK-IC"
                  className="group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="text-[11px] font-mono text-blue-600 font-semibold">
                BÁO ĐÀ NẴNG · 04/04/2026
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#245BFA] transition">
                Lễ ra mắt BK-IC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo – Bách Khoa Innovation Club được giới thiệu trong bài báo về liên kết và ươm mầm ý tưởng sáng tạo tại Đà Nẵng.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80">
              <a
                href="https://baodanang.vn/thuc-day-lien-ket-trong-khoi-nghiep-3330893.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <span>Nguồn: Báo Đà Nẵng</span>
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </article>

          {/* Story 2: BK SHARK 2026 */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 flex flex-col justify-between hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80">
                <SafeImage
                  src={BKIC_MEDIA_ASSETS.bkshark_auditorium.localUrl}
                  fallbackSrc={BKIC_MEDIA_ASSETS.bkshark_auditorium.originalUrl}
                  alt="Toàn cảnh BK SHARK 2026"
                  aspectRatio="aspect-16/10"
                  title="BK SHARK 2026"
                  className="group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-500 font-semibold">
                SỰ KIỆN CẤP TRƯỜNG · 16/05/2026
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#245BFA] transition">
                Vòng chung kết BK SHARK 2026
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Vòng chung kết cuộc thi Khởi nghiệp sinh viên BK SHARK do Trường Đại học Bách khoa tổ chức quy tụ 7 đội thi xuất sắc từ 35 đội tham dự (hơn 140 sinh viên).
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80">
              <a
                href="https://startupdanang.vn/07-du-an-xuat-sac-tranh-tai-tai-chung-ket-cuoc-thi-bk-shark-2026"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:underline"
              >
                <span>Nguồn: Startup Đà Nẵng</span>
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </article>

          {/* Story 3: Ngày hội BKĐN 2026 */}
          <article className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 flex flex-col justify-between hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80">
                <SafeImage
                  src={BKIC_MEDIA_ASSETS.bkdn_students.localUrl}
                  fallbackSrc={BKIC_MEDIA_ASSETS.bkdn_students.originalUrl}
                  alt="Ngày hội BKĐN 2026"
                  aspectRatio="aspect-16/10"
                  title="BKĐN 2026"
                  className="group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-500 font-semibold">
                NGÀY HỘI TRƯỜNG ĐH BÁCH KHOA
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#245BFA] transition">
                Ngày hội BKĐN 2026
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Không gian trưng bày và kết nối sản phẩm nghiên cứu khoa học, ý tưởng khởi nghiệp và đổi mới sáng tạo giữa sinh viên và doanh nghiệp.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80">
              <a
                href="https://dut.udn.vn/Tintuc/Tintuc/id/11984"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:underline"
              >
                <span>Nguồn: Cổng thông tin DUT</span>
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
