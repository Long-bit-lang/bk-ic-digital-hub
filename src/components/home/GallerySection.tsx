// SECTION 06 — IMMERSIVE PHOTO GALLERY (GSAP Parallax Columns & Lightbox Transitions)
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/gsapSetup';
import { BKIC_MEDIA_ASSETS, MediaAsset } from '../../data/mediaAssets';
import { SafeImage } from '../common/SafeImage';
import { ExternalLink, ArrowRight, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const col1Ref = useRef<HTMLDivElement | null>(null);
  const col2Ref = useRef<HTMLDivElement | null>(null);
  const col3Ref = useRef<HTMLDivElement | null>(null);

  // Lightbox modal refs
  const lightboxOverlayRef = useRef<HTMLDivElement | null>(null);
  const lightboxContentRef = useRef<HTMLDivElement | null>(null);

  const [activeLightboxAsset, setActiveLightboxAsset] = useState<MediaAsset | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'community' | 'workshops' | 'milestones'>('all');

  const allAssets: MediaAsset[] = [
    BKIC_MEDIA_ASSETS.bkic_facebook_user_01,
    BKIC_MEDIA_ASSETS.bkic_facebook_user_02,
    BKIC_MEDIA_ASSETS.bkic_facebook_user_03,
    BKIC_MEDIA_ASSETS.bkic_facebook_user_04,
    BKIC_MEDIA_ASSETS.bkic_facebook_user_05,
    BKIC_MEDIA_ASSETS.bkic_launch,
    BKIC_MEDIA_ASSETS.bkshark_auditorium,
    BKIC_MEDIA_ASSETS.startup_training,
    BKIC_MEDIA_ASSETS.bkdn_students
  ];

  const filteredAssets = allAssets.filter((asset) => {
    if (galleryFilter === 'all') return true;
    if (galleryFilter === 'community') return asset.id.includes('facebook') && asset.id !== 'bkic_facebook_user_03';
    if (galleryFilter === 'workshops') return asset.id === 'bkic_facebook_user_03' || asset.id === 'startup_training';
    if (galleryFilter === 'milestones') return asset.id === 'bkic_launch' || asset.id === 'bkshark_auditorium' || asset.id === 'bkdn_students';
    return true;
  });

  // Distribute assets into 3 columns
  const col1 = filteredAssets.filter((_, i) => i % 3 === 0);
  const col2 = filteredAssets.filter((_, i) => i % 3 === 1);
  const col3 = filteredAssets.filter((_, i) => i % 3 === 2);

  const handleNextLightbox = useCallback(() => {
    if (!activeLightboxAsset) return;
    const currentIndex = filteredAssets.findIndex((a) => a.id === activeLightboxAsset.id);
    const nextIndex = (currentIndex + 1) % filteredAssets.length;
    setActiveLightboxAsset(filteredAssets[nextIndex]);
  }, [activeLightboxAsset, filteredAssets]);

  const handlePrevLightbox = useCallback(() => {
    if (!activeLightboxAsset) return;
    const currentIndex = filteredAssets.findIndex((a) => a.id === activeLightboxAsset.id);
    const prevIndex = (currentIndex - 1 + filteredAssets.length) % filteredAssets.length;
    setActiveLightboxAsset(filteredAssets[prevIndex]);
  }, [activeLightboxAsset, filteredAssets]);

  // Lock scroll & handle keyboard navigation
  useEffect(() => {
    if (!activeLightboxAsset) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxAsset(null);
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxAsset, handleNextLightbox, handlePrevLightbox]);

  // Animate Lightbox on Open
  useEffect(() => {
    if (activeLightboxAsset && lightboxOverlayRef.current && lightboxContentRef.current) {
      gsap.fromTo(
        lightboxOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        lightboxContentRef.current,
        { scale: 0.94, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [activeLightboxAsset]);

  // GSAP Entrance & Column Parallax
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      // Header entrance
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

      // Desktop Column Parallax (min-width: 1024px)
      mm.add('(min-width: 1024px)', () => {
        // Subtle vertical speed differentiation
        if (col1Ref.current && col2Ref.current && col3Ref.current) {
          gsap.to(col1Ref.current, {
            y: -25,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });

          gsap.to(col2Ref.current, {
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          });

          gsap.to(col3Ref.current, {
            y: -35,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            }
          });
        }
      });
    },
    { scope: sectionRef, dependencies: [galleryFilter] }
  );

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="border-t border-b border-slate-200/80 bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div id="about" className="scroll-mt-24" />
      <div className="mx-auto max-w-6xl">
        {/* Integrated Intro Card (Requirement 1.2: Lồng ghép giới thiệu vào mục Khoảnh khắc) */}
        <div className="mb-16 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-semibold text-[#245BFA] font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>GIỚI THIỆU CHÍNH THỨC VỀ BK-IC</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111318] tracking-tight leading-snug">
                Nơi kết nối đam mê khởi nghiệp & công nghệ tại Bách khoa Đà Nẵng.
              </h2>
              <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <p>
                  <strong>Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo (Bách Khoa Innovation Club — BK-IC)</strong> trực thuộc <strong>Trường Đại học Bách khoa, Đại học Đà Nẵng</strong>. Đây là môi trường kết nối đa chuyên ngành, nơi các bạn sinh viên kỹ thuật cùng học hỏi, thực nghiệm công nghệ và hiện thực hóa các giải pháp hữu ích cho cộng đồng.
                </p>
                <p>
                  CLB định hướng trở thành sân chơi sáng tạo lành mạnh, đồng hành cùng sinh viên qua các buổi sinh hoạt định kỳ, workshop chuyên đề và các dự án ươm tạo thực tế.
                </p>
              </div>

              {/* Provenance badge */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-blue-900 bg-blue-100/80 px-2.5 py-1 rounded-md">
                  Ghi nhận từ Báo Đà Nẵng (04/04/2026)
                </span>
                <a
                  href="https://baodanang.vn/thuc-day-lien-ket-trong-khoi-nghiep-3330893.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  <span>Đọc bài báo gốc</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white group">
                <SafeImage
                  src={BKIC_MEDIA_ASSETS.bkic_launch.localUrl}
                  fallbackSrc={BKIC_MEDIA_ASSETS.bkic_launch.originalUrl}
                  alt="Lễ ra mắt Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo - Bách Khoa Innovation Club"
                  aspectRatio="aspect-16/10"
                  title="Lễ ra mắt BK-IC tại Trường ĐH Bách khoa - ĐHĐN"
                  tag="Tư liệu chính thức"
                  className="group-hover:scale-102 transition duration-500"
                />
                <div className="p-3 text-[11px] text-slate-500 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span>{BKIC_MEDIA_ASSETS.bkic_launch.caption}</span>
                  <span className="font-medium text-blue-600 font-mono">04/04/2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#245BFA] font-mono">
              Khoảnh khắc & Hoạt động thực tế
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
              Những ý tưởng lớn luôn bắt đầu từ những con người.
            </h2>
            <p className="text-sm text-slate-600 font-normal">
              Mỗi cuộc gặp gỡ, mỗi trải nghiệm và mỗi người bạn đều góp phần tạo nên bản sắc sáng tạo tại BK-IC.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://www.facebook.com/dut.bkic"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              <span>Xem trên Facebook Fanpage</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setGalleryFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              galleryFilter === 'all'
                ? 'bg-[#111318] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({allAssets.length})
          </button>
          <button
            onClick={() => setGalleryFilter('community')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              galleryFilter === 'community'
                ? 'bg-[#111318] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sinh hoạt & Gắn kết
          </button>
          <button
            onClick={() => setGalleryFilter('workshops')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              galleryFilter === 'workshops'
                ? 'bg-[#111318] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chuyên đề & Workshop
          </button>
          <button
            onClick={() => setGalleryFilter('milestones')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              galleryFilter === 'milestones'
                ? 'bg-[#111318] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sự kiện & Dấu mốc
          </button>
        </div>

        {/* 3 Columns Parallax Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1 */}
          <div ref={col1Ref} className="space-y-6 will-change-transform">
            {col1.map((asset) => (
              <PhotoCard key={asset.id} asset={asset} onSelect={setActiveLightboxAsset} />
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="space-y-6 will-change-transform">
            {col2.map((asset) => (
              <PhotoCard key={asset.id} asset={asset} onSelect={setActiveLightboxAsset} />
            ))}
          </div>

          {/* Column 3 */}
          <div ref={col3Ref} className="space-y-6 will-change-transform">
            {col3.map((asset) => (
              <PhotoCard key={asset.id} asset={asset} onSelect={setActiveLightboxAsset} />
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            <span>Xem thêm hoạt động sinh hoạt</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* GSAP Fullscreen Lightbox Modal */}
      {activeLightboxAsset && (
        <div
          ref={lightboxOverlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setActiveLightboxAsset(null)}
        >
          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevLightbox();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 p-3 text-white hover:bg-black/90 transition hidden sm:flex cursor-pointer"
            title="Ảnh trước (Phím ←)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextLightbox();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 p-3 text-white hover:bg-black/90 transition hidden sm:flex cursor-pointer"
            title="Ảnh sau (Phím →)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            ref={lightboxContentRef}
            className="relative max-w-4xl w-full rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl border border-slate-800 will-change-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxAsset(null)}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition cursor-pointer"
              title="Đóng (Phím Esc)"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activeLightboxAsset.localUrl}
                alt={activeLightboxAsset.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
                <span>{activeLightboxAsset.source}</span>
                <span className="uppercase text-[10px] bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {activeLightboxAsset.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeLightboxAsset.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeLightboxAsset.caption}
              </p>
              <div className="text-[10px] text-slate-500 pt-1">
                Mẹo: Dùng phím mũi tên ← → trên bàn phím để chuyển ảnh, phím Esc để đóng.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Sub-component for individual card with hover transitions
const PhotoCard: React.FC<{
  asset: MediaAsset;
  onSelect: (a: MediaAsset) => void;
}> = ({ asset, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(asset)}
      className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-xs hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
    >
      <div className="overflow-hidden">
        <SafeImage
          src={asset.localUrl}
          fallbackSrc={asset.originalUrl}
          alt={asset.title}
          aspectRatio={asset.aspect}
          title={asset.title}
          tag={asset.source}
          className="group-hover:scale-104 transition-transform duration-500 ease-out"
        />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">
          {asset.type === 'club_direct' ? 'Tư liệu BK-IC' : 'Khoảnh khắc sinh hoạt'}
        </div>
        <h4 className="text-xs font-bold text-slate-900 truncate">
          {asset.title}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1">
          {asset.caption}
        </p>
      </div>
    </div>
  );
};
