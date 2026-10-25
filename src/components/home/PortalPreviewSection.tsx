// SECTION 09 — MEMBER PORTAL PREVIEW (GSAP Floating Product Scale & Interactive Live QR)
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, Check, ArrowRight, ArrowUpRight } from 'lucide-react';

export const PortalPreviewSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  // Interactive OS Simulator Tab
  const [osTab, setOsTab] = useState<'qr' | 'progress' | 'sessions'>('qr');

  // Live rotating QR code demo state
  const [qrCountdown, setQrCountdown] = useState<number>(15);
  const [demoQrCode, setDemoQrCode] = useState<string>('BKIC-LIVE-8291');

  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          const randomCode = `BKIC-LIVE-${Math.floor(1000 + Math.random() * 9000)}`;
          setDemoQrCode(randomCode);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

      tl.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8
      })
        .from(
          previewFrameRef.current,
          {
            opacity: 0,
            scale: 0.94,
            y: 40,
            duration: 1,
            ease: 'power2.out'
          },
          '-=0.5'
        )
        .from(
          ctaRef.current?.children || [],
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1
          },
          '-=0.4'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono">
          Dành cho thành viên BK-IC
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
          Một hành trình.
          <br />
          Được ghi nhận qua từng trải nghiệm.
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed font-normal">
          Không chỉ tham gia hoạt động, mỗi thành viên còn có thể theo dõi lịch sinh hoạt, điểm danh bằng QR xoay thời gian thực, xem lịch sử tham gia và sổ theo dõi rèn luyện minh bạch.
        </p>
      </div>

      {/* Studio Display / MacBook Silhouette Preview with GSAP scale */}
      <div
        ref={previewFrameRef}
        className="rounded-[32px] border border-slate-300/80 bg-slate-900 p-3 sm:p-5 shadow-2xl overflow-hidden max-w-5xl mx-auto will-change-transform"
      >
        {/* Mock Window Top Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>hub.bkic.dut.udn.vn/portal</span>
          </div>
          {/* Interactive Mock Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg text-[10px]">
            <button
              onClick={() => setOsTab('qr')}
              className={`px-2 py-0.5 rounded font-mono transition cursor-pointer ${
                osTab === 'qr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              QR Động
            </button>
            <button
              onClick={() => setOsTab('progress')}
              className={`px-2 py-0.5 rounded font-mono transition cursor-pointer ${
                osTab === 'progress' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sổ rèn luyện
            </button>
            <button
              onClick={() => setOsTab('sessions')}
              className={`px-2 py-0.5 rounded font-mono transition cursor-pointer ${
                osTab === 'sessions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lịch tuần
            </button>
          </div>
        </div>

        {/* Mock Member Dashboard Screen */}
        <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 space-y-6 text-[#111318]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <div className="text-[11px] font-semibold uppercase text-blue-600 font-mono">
                CỔNG THÀNH VIÊN BK-IC
              </div>
              <div className="text-xl font-bold text-slate-900">
                Trần Thị Bích Ngọc (K23 · Điện tử Viễn thông)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Check className="h-3 w-3" />
                Thành viên Chính thức
              </span>
            </div>
          </div>

          {/* TAB 1: QR CODE DEMO */}
          {osTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs mb-3">
                  <QRCodeSVG value={demoQrCode} size={150} level="M" />
                </div>
                <div className="font-mono text-sm font-bold text-slate-800 tracking-wider">
                  {demoQrCode}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 font-medium">
                  <Clock className="h-3.5 w-3.5 animate-spin" />
                  <span>Làm mới sau: <strong>{qrCountdown}s</strong></span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Chống chụp lại hoặc gian lận điểm danh
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-blue-600 uppercase font-mono">Cơ chế điểm danh bảo mật</div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">Mã QR xoay vòng liên tục</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Mỗi buổi sinh hoạt, Ban Chủ nhiệm chiếu màn hình QR trên máy chiếu. Mã QR tự động thay đổi sau mỗi 15-30 giây, ngăn chặn việc chụp gửi mã từ xa và đảm bảo tính hiện diện thực tế.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Tốc độ quét xác thực</div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">&lt; 0.5 giây</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Ghi nhận chuyên cần</div>
                    <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">Tức thì (Real-time)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESS DEMO */}
          {osTab === 'progress' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500">Tỷ lệ Chuyên cần</div>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">100%</div>
                <div className="text-[11px] text-slate-400 mt-1">5/5 buổi sinh hoạt đã tham dự</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500">Điểm Đánh giá Rèn luyện</div>
                <div className="text-2xl font-bold font-mono text-blue-600 mt-1">9.8 / 10</div>
                <div className="text-[11px] text-slate-400 mt-1">Xếp loại: Xuất sắc (HK2 2025-2026)</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500">Ban Chuyên môn</div>
                <div className="text-base font-bold text-slate-900 mt-1">IoT & Embedded</div>
                <div className="text-[11px] text-slate-400 mt-1">Đề tài: Giám sát môi trường DUT</div>
              </div>
            </div>
          )}

          {/* TAB 3: SESSIONS DEMO */}
          {osTab === 'sessions' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    Chủ nhật này
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Workshop: Thiết kế mạch nhúng & Kết nối vi điều khiển ESP32
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span>08:30 - 11:00</span>
                    <span>Phòng Smart Lab C102</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
                  Đã đăng ký tham gia
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={ctaRef} className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/login"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111318] px-8 py-3.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm group"
        >
          <span>Đăng nhập Cổng Thành viên</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition group"
        >
          <span>Cổng Quản trị Ban Chủ nhiệm</span>
          <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
