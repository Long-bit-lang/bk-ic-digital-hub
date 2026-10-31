// SECTION 05 — ACTIVITY SHOWCASE (GSAP Staggered Reveals & Micro-Interactions)
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { BKIC_MEDIA_ASSETS } from '../../data/mediaAssets';
import { SafeImage } from '../common/SafeImage';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const ActivitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set([headerRef.current, gridRef.current?.children || []], {
          opacity: 1,
          y: 0
        });
        return;
      }

      // Initial state
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
      gsap.set(gridRef.current?.children || [], { opacity: 0, y: 40 });

      // Header entrance
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          once: true
        }
      });

      // Cards staggered entrance
      gsap.to(gridRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
          once: true
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="activities" ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono">
            Không gian phát triển
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            Khám phá. Trải nghiệm. Trưởng thành.
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Bạn không cần có sẵn một startup để bắt đầu. Dù bạn yêu thích công nghệ, kinh doanh, truyền thông hay đơn giản muốn thử nghiệm điều mới.
          </p>
        </div>

        <Link
          to="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245BFA] hover:text-blue-800 transition shrink-0 group"
        >
          <span>Toàn bộ lộ trình hoạt động</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Asymmetric Bento-style Activity Panels with GSAP stagger */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Panel 1: Large Featured (Col 8) */}
        <div className="md:col-span-8 rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="p-8 pb-4">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono">
              01. CHUYÊN ĐỀ CÔNG NGHỆ
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-[#245BFA] transition">
              Innovation Workshops & Design Thinking
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Cùng khám phá tư duy thiết kế (Design Thinking), giải quyết vấn đề thực tế và phương pháp đổi mới sáng tạo ứng dụng công nghệ DeepTech, IoT và AI.
            </p>
          </div>
          <div className="px-8 pb-8 pt-4">
            <div className="rounded-2xl overflow-hidden border border-slate-100">
              <SafeImage
                src={BKIC_MEDIA_ASSETS.bkic_facebook_user_03.localUrl}
                fallbackSrc={BKIC_MEDIA_ASSETS.bkic_facebook_user_03.originalUrl}
                alt="Hoạt động Innovation Workshop tại BK-IC"
                aspectRatio="aspect-16/9"
                title="Workshop Chuyên môn BK-IC"
                tag="Thảo luận chuyên môn"
                className="group-hover:scale-103 transition-transform duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Medium Asymmetric (Col 4) */}
        <div className="md:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
              02. TƯ DUY KHỞI NGHIỆP
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-[#245BFA] transition">
              Startup Mindset & Lean Canvas
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Làm quen với mô hình kinh doanh tinh gọn, xác định giá trị khách hàng, nghiên cứu thị trường và kỹ năng pitching giải pháp.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100">
            <SafeImage
              src={BKIC_MEDIA_ASSETS.startup_training.localUrl}
              fallbackSrc={BKIC_MEDIA_ASSETS.startup_training.originalUrl}
              alt="Tập huấn mô hình kinh doanh tại DUT"
              aspectRatio="aspect-4/3"
              title="Tập huấn Khởi nghiệp"
              tag="Đào tạo chuyên sâu"
              className="group-hover:scale-103 transition-transform duration-500 ease-out"
            />
          </div>
        </div>

        {/* Panel 3: Medium Asymmetric (Col 5) */}
        <div className="md:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider font-mono">
              03. HỢP TÁC DỰ ÁN & PROTOTYPING
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-[#245BFA] transition">
              Project Collaboration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kết nối thành viên đa chuyên môn (Lập trình phần mềm, Phần cứng Điện tử, Cơ khí, Quản lý sản phẩm) để thử nghiệm chế tạo prototype tại phòng Smart Lab.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hỗ trợ không gian Smart Campus</span>
            <ArrowUpRight className="h-4 w-4 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Panel 4: Wide Feature (Col 7) */}
        <div className="md:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider font-mono">
              04. KẾT NỐI MẠNG LƯỚI & CỐ VẤN
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-[#245BFA] transition">
              Community & Networking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
              Giao lưu với sinh viên cùng đam mê, giảng viên cố vấn khoa học từ các Khoa thuộc Trường ĐH Bách khoa, chuyên gia công nghiệp và hệ sinh thái đổi mới sáng tạo Đà Nẵng.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mạng lưới Cố vấn Giảng viên DUT</span>
            <ArrowUpRight className="h-4 w-4 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
