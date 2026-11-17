// BK-IC About Page — Section 01: Hero Introduction
import React, { useState } from 'react';
import { Building2, ZoomIn } from 'lucide-react';
import { ImageLightboxModal } from '../common/ImageLightboxModal';

export const AboutHeroSection: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section id="intro" className="relative scroll-mt-24 pt-4 pb-10 sm:pb-14 border-b border-slate-200/80">
      {/* Editorial Header Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Typography & Positioning */}
        <div className="lg:col-span-7 space-y-5">
          {/* Institutional Affiliation Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] sm:text-xs font-semibold text-[#1749B5] shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-[#1749B5]" />
              <span>ĐOÀN TN – HỘI SV TRƯỜNG ĐH BÁCH KHOA (DUT)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-[11px] font-mono text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>EST. 2026</span>
            </span>
          </div>

          {/* Main Title & Brand Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#10182D] leading-[1.12]">
              BK-IC – Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo
            </h1>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#1749B5] via-[#245BFA] to-[#0EA5E9] bg-clip-text text-transparent">
              Kết nối ý tưởng – Thúc đẩy sáng tạo – Kiến tạo giá trị.
            </p>
          </div>

          {/* Descriptive Content */}
          <div className="space-y-3.5 text-sm sm:text-base text-[#475467] leading-relaxed">
            <p>
              Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo (BK-IC) là tổ chức sinh viên trực thuộc{' '}
              <strong className="text-[#10182D] font-semibold">
                Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa, Đại học Đà Nẵng
              </strong>.
            </p>
            <p>
              BK-IC hướng đến xây dựng một môi trường thúc đẩy tinh thần khởi nghiệp, tư duy đổi mới sáng tạo và khả năng ứng dụng tri thức vào thực tiễn. Thông qua các hoạt động học thuật, chương trình đào tạo, cuộc thi, dự án và hoạt động kết nối, câu lạc bộ tạo điều kiện để sinh viên khám phá tiềm năng, phát triển ý tưởng và từng bước hiện thực hóa những sáng kiến của mình.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 pt-1 border-t border-slate-200/60">
              Không chỉ là nơi quy tụ những sinh viên có cùng đam mê, BK-IC còn hướng đến phát triển một hệ sinh thái đổi mới sáng tạo trong môi trường đại học, nơi sinh viên có cơ hội kết nối với giảng viên, cựu sinh viên, chuyên gia và doanh nghiệp để cùng chia sẻ tri thức, kinh nghiệm và nguồn lực.
            </p>
          </div>
        </div>

        {/* Right Column: Visual Showcase & Impact Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-3 shadow-lg shadow-blue-950/5">
            {/* Main Featured Photo */}
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="group/heroimg relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 cursor-zoom-in"
              title="Bấm để xem ảnh chi tiết"
            >
              <img
                src="/images/bkic/bkic_launch.jpg"
                alt="Lễ ra mắt Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo BK-IC"
                className="w-full h-full object-cover object-center group-hover/heroimg:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1432]/80 via-transparent to-transparent" />
              
              {/* Zoom hint on hover */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-semibold opacity-0 group-hover/heroimg:opacity-100 transition-opacity border border-white/20">
                <ZoomIn className="h-3 w-3" />
                <span>Xem ảnh chi tiết</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#93C5FD] block">
                  Lễ công bố &amp; Ra mắt chính thức
                </span>
                <span className="text-xs sm:text-sm font-bold leading-tight line-clamp-1">
                  Đoàn Thanh niên – Hội Sinh viên ĐH Bách khoa (DUT)
                </span>
              </div>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100">
              <div className="text-center p-2 rounded-xl bg-blue-50/60">
                <span className="text-base sm:text-lg font-black text-[#1749B5] block font-mono">30</span>
                <span className="text-[10px] font-medium text-slate-500">Thành viên GEN 1</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-indigo-50/60">
                <span className="text-base sm:text-lg font-black text-indigo-700 block font-mono">03</span>
                <span className="text-[10px] font-medium text-slate-500">Ban chuyên trách</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-emerald-50/60">
                <span className="text-base sm:text-lg font-black text-emerald-700 block font-mono">15+</span>
                <span className="text-[10px] font-medium text-slate-500">Đối tác &amp; Vườn ươm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Photo Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src="/images/bkic/bkic_launch.jpg"
        alt="Lễ ra mắt Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo BK-IC"
        title="Lễ công bố & Ra mắt chính thức BK-IC"
        subtitle="Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa, Đại học Đà Nẵng"
        meta="LỄ RA MẮT • BK-IC DUT"
      />
    </section>
  );
};
