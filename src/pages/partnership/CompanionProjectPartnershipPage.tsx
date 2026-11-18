// BK-IC Companion Project Partnership Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { CTASection } from '../../components/editorial/CTASection';
import { 
  Rocket, 
  FileText, 
  Download, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ExternalLink,
  Building2,
  BookmarkCheck
} from 'lucide-react';

export const CompanionProjectPartnershipPage: React.FC = () => {
  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hợp tác', to: '/partnership' },
          { label: 'Dự án đồng hành' }
        ]}
        eyebrow="HỢP TÁC DỰ ÁN • BK-IC DUT"
        title="Đồng hành cùng Dự án"
        titleHighlight="Công nghệ Sinh viên"
        subtitle="Cơ chế kết nối doanh nghiệp, cựu sinh viên và các nhà tài trợ với các nhóm nghiên cứu công nghệ trẻ tại Trường ĐH Bách khoa – ĐHĐN."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* SECTION 1: THÔNG TIN (#info) */}
        <section id="info" className="space-y-8 scroll-mt-24">
          <ScrollReveal direction="up" distance={16} duration={0.5}>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                <span>1. Thông tin Bảo trợ &amp; Catalogue Dự án</span>
              </h2>
              <a
                href="#register"
                className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
              >
                Chuyển đến mục Đăng ký ↓
              </a>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <ScrollReveal direction="up" distance={20} duration={0.6} className="lg:col-span-7">
              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Chương trình <strong>Dự án Đồng hành (Companion Projects)</strong> của BK-IC được xây dựng nhằm thu hẹp khoảng cách giữa kết quả nghiên cứu trong phòng thí nghiệm trường đại học với nhu cầu thương mại hóa thực tế của thị trường.
                </p>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Khi đồng hành cùng dự án sinh viên, doanh nghiệp đối tác sẽ nhận được:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Quyền ưu tiên tiếp cận và thương mại hóa các sáng chế, mẫu thử công nghệ độc quyền.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Xây dựng nguồn nhân sự kỹ thuật tài năng ngay từ khi còn ngồi trên ghế nhà trường.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Gia tăng uy tín thương hiệu tuyển dụng trong cộng đồng hơn 15.000 sinh viên Bách khoa.</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Catalogue Download Card */}
            <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6} className="lg:col-span-5">
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
                  <FileText className="h-4 w-4" />
                  <span>Catalogue Dự án 2026</span>
                </div>
                <h3 className="text-lg font-bold text-[#10182D]">
                  Tài liệu Tổng hợp Danh mục Dự án
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tải bản giới thiệu chi tiết về 12 dự án tiêu biểu giai đoạn 2025–2026 kèm thông số kỹ thuật, mô hình kinh doanh và lộ trình phát triển.
                </p>
                <div className="pt-2">
                  <a
                    href="/documents/BK-IC_Project_Catalogue_2026.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-xs font-bold hover:shadow-lg hover:shadow-sky-500/25 transition duration-300"
                  >
                    <Download className="h-4 w-4" />
                    <span>Tải Catalogue (PDF)</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION 2: ĐĂNG KÝ (#register) */}
        <section id="register" className="space-y-6 scroll-mt-24 pt-6">
          <ScrollReveal direction="up" distance={16} duration={0.5}>
            <div className="border-b border-slate-200/80 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                <span>2. Đăng ký Đồng hành cùng Dự án</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={0.65}>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 space-y-6 text-center max-w-3xl mx-auto shadow-xs hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto shadow-2xs border border-sky-100">
                <BookmarkCheck className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#10182D]">
                  Khung Tiếp nhận Đăng ký Đồng hành &amp; Bảo trợ
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-xl mx-auto">
                  Khung cấu trúc tiếp nhận đăng ký đồng hành dành cho doanh nghiệp, cố vấn và quỹ đầu tư. Biểu mẫu đăng ký trực tuyến chính thức sẽ được kích hoạt trong giai đoạn tiếp theo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <strong className="text-[#10182D] block">1. Chọn dự án quan tâm</strong>
                  <span className="text-slate-500">Tra cứu danh mục dự án theo lĩnh vực AI, IoT, Robotics hoặc GreenTech.</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <strong className="text-[#10182D] block">2. Đề xuất hình thức hỗ trợ</strong>
                  <span className="text-slate-500">Bảo trợ thiết bị, hướng dẫn chuyên môn hoặc tài trợ tài chính.</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <strong className="text-[#10182D] block">3. Ký kết thỏa thuận hợp tác</strong>
                  <span className="text-slate-500">Ban Chủ nhiệm BK-IC và nhà trường hỗ trợ hoàn tất thủ tục pháp lý.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/activities/companion-projects"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
                >
                  <span>Xem danh mục các dự án đang trong vườn ươm</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CTA Transition */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <CTASection
            eyebrow="HỢP TÁC DOANH NGHIỆP"
            title="Kết nối đa dạng các hình thức hợp tác với Trường ĐH Bách khoa"
            description="Tìm hiểu thêm về mạng lưới đối tác chiến lược và các gói hợp tác doanh nghiệp của BK-IC."
            primaryText="Xem Hợp tác Doanh nghiệp"
            primaryTo="/partnership/business"
            secondaryText="Về Tổng quan Hợp tác"
            secondaryTo="/partnership"
          />
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
