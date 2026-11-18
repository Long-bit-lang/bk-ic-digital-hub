// BK-IC Digital Hub — Partnership Hero Section
import React from 'react';
import { ArrowRight, Sparkles, Building2, ShieldCheck, CheckCircle2, Users } from 'lucide-react';

interface PartnershipHeroProps {
  onRequestClick: () => void;
  onExploreClick: () => void;
}

export const PartnershipHero: React.FC<PartnershipHeroProps> = ({
  onRequestClick,
  onExploreClick
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-[#0284C7] uppercase">
                CỔNG KẾT NỐI HỢP TÁC • BK-IC DUT
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#10182D] tracking-tight leading-[1.15]">
              Cầu nối Đổi mới Sáng tạo &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#0284C7] to-[#38BDF8]">
                Ươm mầm Khởi nghiệp Sinh viên Bách khoa
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo (BK-IC) trực thuộc Trường Đại học Bách khoa – Đại học Đà Nẵng đóng vai trò là cầu nối gắn kết giữa doanh nghiệp, chuyên gia, giảng viên và cộng đồng sinh viên; cùng nhau thúc đẩy tinh thần sáng tạo, hỗ trợ phát triển ý tưởng công nghệ và tạo điều kiện để đối tác tiếp cận nguồn nhân lực trẻ giàu tiềm năng.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onRequestClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-sm font-bold shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Gửi đề xuất hợp tác</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-slate-700 text-sm font-semibold hover:border-sky-300 hover:text-[#0284C7] shadow-2xs hover:shadow-sm transition-all cursor-pointer"
              >
                <span>Khám phá các hình thức hợp tác</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0284C7] shrink-0" />
                <span>Trực thuộc Trường ĐH Bách khoa – ĐHĐN</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#0284C7] shrink-0" />
                <span>Tiếp cận nhân lực trẻ Bách khoa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0" />
                <span>Quy trình phối hợp minh bạch, rõ ràng</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#38BDF8]/20 to-[#0284C7]/20 rounded-3xl blur-xl -z-10" />

              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                <img
                  src="/images/bkic/bkshark_auditorium.jpg"
                  alt="Không gian kết nối BK-IC với các chuyên gia, diễn giả và sinh viên"
                  className="w-full h-72 sm:h-84 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-[11px] font-bold text-[#075985] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#0284C7]" />
                  <span>Cầu nối Học thuật &amp; Thực tiễn</span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                    Hệ sinh thái Bách khoa Đà Nẵng
                  </p>
                  <p className="text-sm font-bold text-white leading-snug mt-0.5">
                    Không gian gặp gỡ, chia sẻ tri thức và bồi dưỡng thế hệ kỹ sư khởi nghiệp tương lai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
