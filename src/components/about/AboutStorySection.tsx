// BK-IC About Page — Section 02: Storytelling & Team Photo Showcase
import React, { useState } from 'react';
import { Sparkles, Users, ZoomIn } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';
import { ImageLightboxModal } from '../common/ImageLightboxModal';

export const AboutStorySection: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section id="story" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="02 • CÂU CHUYỆN HÌNH THÀNH"
        title="Khởi nguồn từ những ý tưởng, phát triển bằng tinh thần sáng tạo"
        subtitle="Hành trình từ những ý tưởng sơ khởi của sinh viên kỹ thuật đến một cộng đồng ươm mầm khởi nghiệp và đổi mới sáng tạo có tổ chức bài bản."
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Narrative Storytelling Paragraphs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-4 text-sm sm:text-base text-[#475467] leading-relaxed">
            <p>
              Trong bối cảnh công nghệ và đổi mới sáng tạo ngày càng đóng vai trò quan trọng đối với sự phát triển của xã hội, việc tạo dựng môi trường để sinh viên chủ động học hỏi, thử nghiệm và phát triển những ý tưởng mới trở nên cần thiết.
            </p>
            <p className="font-semibold text-[#10182D] border-l-3 border-[#1749B5] pl-3 py-1 bg-blue-50/40 rounded-r-xl">
              BK-IC được hình thành với mong muốn góp phần xây dựng môi trường như vậy tại Trường Đại học Bách khoa – Đại học Đà Nẵng.
            </p>
            <p>
              Từ những kết nối ban đầu giữa các sinh viên có chung sự quan tâm đến khởi nghiệp và đổi mới sáng tạo, BK-IC hướng đến hình thành một cộng đồng nơi mỗi thành viên có thể chia sẻ ý tưởng, tiếp cận kiến thức, phát triển năng lực và cùng tham gia giải quyết những vấn đề thực tiễn.
            </p>
            <p>
              Với sinh viên là trung tâm, BK-IC từng bước hướng đến kết nối các nguồn lực trong và ngoài nhà trường, tạo nền tảng cho sự hợp tác giữa học thuật, công nghệ và hoạt động khởi nghiệp.
            </p>
          </div>
        </div>

        {/* Right Column: High-Resolution Team Photograph */}
        <div className="lg:col-span-6 space-y-3">
          <div 
            onClick={() => setIsLightboxOpen(true)}
            className="group relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-3 shadow-lg shadow-blue-950/5 cursor-zoom-in transition-all duration-300 hover:border-[#1749B5] hover:shadow-xl"
            title="Bấm để xem ảnh chi tiết"
          >
            {/* Team Photo Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="/images/bkic/bkic_team_gen1.jpg"
                alt="Tập thể Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên BK-IC GEN 1"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-[#6B9DFF]" />
                <span>BK-IC DUT • GEN 1</span>
              </div>

              {/* Top Right Zoom Prompt */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                <ZoomIn className="h-3 w-3" />
                <span>Xem ảnh chi tiết</span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5 pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#93C5FD] block">
                  ĐỘI NGŨ TIÊN PHONG
                </span>
                <p className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                  Tập thể Ban Chủ nhiệm, Ban Điều hành &amp; Ban Thành viên Bách Khoa Innovation Club
                </p>
              </div>
            </div>

            {/* Bottom Photo Footnote */}
            <div className="px-2 pt-2.5 pb-1 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="h-3.5 w-3.5 text-[#1749B5]" />
                <span>Nhiệm kỳ 2025 – 2026</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">DUT • ĐHĐN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Photo Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src="/images/bkic/bkic_team_gen1.jpg"
        alt="Tập thể Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên BK-IC GEN 1"
        title="Tập thể Ban Chủ nhiệm, Ban Điều hành & Ban Thành viên BK-IC"
        subtitle="Nhiệm kỳ 2025 – 2026 • Đại học Bách khoa – Đại học Đà Nẵng (DUT)"
        meta="GEN 1 ARCHIVE • BK-IC DUT"
      />
    </section>
  );
};
