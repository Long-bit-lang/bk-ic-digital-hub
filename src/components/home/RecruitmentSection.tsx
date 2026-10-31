// SECTION 10 — RECRUITMENT FINALE (Configurable Open/Closed State with Web Share & Fanpage Sync)
import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../utils/gsapSetup';
import { Sparkles, ArrowRight, ExternalLink, Share2, Check, Clock, BellRing } from 'lucide-react';
import { useMagneticButton } from '../../hooks/useMagneticButton';
import { useApp } from '../../context/AppContext';

export const RecruitmentSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  const { siteSettings } = useApp();
  const fanpageUrl = siteSettings.recruitmentFanpageUrl || 'https://www.facebook.com/dut.bkic';

  // Compute active status based on configuration and current date
  const todayStr = new Date().toISOString().split('T')[0];
  const isStarted = !siteSettings.recruitmentStartDate || todayStr >= siteSettings.recruitmentStartDate;
  const isExpired = !!siteSettings.recruitmentDeadline && todayStr > siteSettings.recruitmentDeadline;
  const isOpen = siteSettings.recruitmentStatus === 'open' && isStarted && !isExpired;

  // Magnetic button on the primary CTA
  const magneticBtnRef = useMagneticButton<HTMLAnchorElement>({ maxOffset: 8, speed: 0.25 });

  const handleShare = async () => {
    const shareData = {
      title: siteSettings.recruitmentTitle || 'Tuyển thành viên CLB BK-IC (DUT)',
      text: isOpen
        ? 'BK-IC đang mở đợt tuyển thành viên mới! Hãy gia nhập cùng chúng mình để hiện thực hóa các ý tưởng sáng tạo.'
        : 'Theo dõi thông tin tuyển thành viên mới của CLB Khởi nghiệp & Đổi mới sáng tạo BK-IC.',
      url: window.location.origin + '/#recruitment'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed, fallback silently
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

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
    { scope: sectionRef, dependencies: [isOpen] }
  );

  return (
    <section
      id="recruitment"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#0B1020] via-slate-950 to-[#0B1020] text-white py-28 sm:py-36 px-4 sm:px-6 lg:px-8 text-center"
    >
      {/* Soft Radial Ambient Lighting */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(36,91,250,0.22)_0%,_transparent_70%)] will-change-transform"
      />

      <div ref={contentRef} className="relative mx-auto max-w-3xl space-y-6">
        {isOpen ? (
          <>
            {/* Open Recruitment State */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono">ĐANG MỞ ĐỢT TUYỂN THÀNH VIÊN MỚI</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.03em] leading-[1.08] text-balance">
              {siteSettings.recruitmentTitle || 'Ý tưởng tiếp theo có thể bắt đầu từ bạn.'}
            </h2>

            <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {siteSettings.recruitmentDescription ||
                'Không cần một ý tưởng hoàn hảo. Không nhất thiết phải có kinh nghiệm khởi nghiệp. Hãy mang theo sự tò mò, tinh thần chủ động và mong muốn cùng những người bạn mới tạo ra điều khác biệt tại Bách khoa.'}
            </p>

            {siteSettings.recruitmentDeadline && (
              <div className="inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full font-mono">
                <Clock className="h-3.5 w-3.5" />
                <span>Hạn chót nhận hồ sơ: {siteSettings.recruitmentDeadline}</span>
              </div>
            )}

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              {siteSettings.recruitmentFormUrl ? (
                <a
                  ref={magneticBtnRef}
                  href={siteSettings.recruitmentFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#245BFA] px-9 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition group cursor-pointer"
                >
                  <span>Đăng ký ngay</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <a
                  ref={magneticBtnRef}
                  href="/join"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#245BFA] px-9 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition group cursor-pointer"
                >
                  <span>Đăng ký ngay</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              <button
                onClick={handleShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white hover:bg-white/10 transition backdrop-blur-xs cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                <span>{copied ? 'Đã sao chép liên kết!' : 'Chia sẻ cơ hội'}</span>
              </button>

              <a
                href={fanpageUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition backdrop-blur-xs group"
              >
                <span>Theo dõi Fanpage</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Closed Recruitment State (Default per requirements) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-300">
              <BellRing className="h-3.5 w-3.5" />
              <span className="font-mono">THÔNG BÁO TUYỂN THÀNH VIÊN</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.12] text-balance">
              Trở thành thành viên BK-IC
            </h2>

            {/* Exact Required Vietnamese Notice */}
            <div className="mx-auto max-w-2xl rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 backdrop-blur-sm">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                Hiện tại chưa đến thời gian tuyển thành viên mới. Hãy theo dõi Fanpage chính thức của BK-IC để cập nhật thông tin về đợt tuyển tiếp theo!
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                ref={magneticBtnRef}
                href={fanpageUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#245BFA] px-9 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition group cursor-pointer"
              >
                <span>Theo dõi Fanpage chính thức</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white hover:bg-white/10 transition backdrop-blur-xs cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                <span>{copied ? 'Đã sao chép liên kết!' : 'Chia sẻ liên kết'}</span>
              </button>
            </div>
          </>
        )}

        <div className="pt-8 text-xs text-slate-400 font-mono">
          Fanpage chính thức: <a href={fanpageUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{fanpageUrl.replace('https://', '')}</a>
        </div>
      </div>
    </section>
  );
};
