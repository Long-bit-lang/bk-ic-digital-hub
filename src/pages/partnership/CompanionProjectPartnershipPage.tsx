// BK-IC Companion Project Partnership Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
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
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hợp tác', to: '/partnership' },
            { label: 'Dự án đồng hành' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="HỢP TÁC DỰ ÁN • BK-IC DUT"
            title="Đồng hành cùng Dự án Công nghệ Sinh viên"
            subtitle="Cơ chế kết nối doanh nghiệp, cựu sinh viên và các nhà tài trợ với các nhóm nghiên cứu công nghệ trẻ tại Trường ĐH Bách khoa – ĐHĐN."
          />
        </div>

        {/* SECTION 1: THÔNG TIN (#info) */}
        <section id="info" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1749B5]" />
              <span>1. Thông tin Bảo trợ &amp; Catalogue Dự án</span>
            </h2>
            <a
              href="#register"
              className="text-xs font-semibold text-[#1749B5] hover:underline"
            >
              Chuyển đến mục Đăng ký ↓
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                Chương trình <strong>Dự án Đồng hành (Companion Projects)</strong> của BK-IC được xây dựng nhằm thu hẹp khoảng cách giữa kết quả nghiên cứu trong phòng thí nghiệm trường đại học với nhu cầu thương mại hóa thực tế của thị trường.
              </p>
              <p className="text-slate-600 text-xs sm:text-sm">
                Khi đồng hành cùng dự án sinh viên, doanh nghiệp đối tác sẽ nhận được:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1749B5] shrink-0 mt-0.5" />
                  <span>Quyền ưu tiên tiếp cận và thương mại hóa kết quả nghiên cứu/sở hữu trí tuệ của dự án.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1749B5] shrink-0 mt-0.5" />
                  <span>Đặt hàng bài toán R&amp;D thực tế để nhóm sinh viên tài năng và giảng viên cố vấn giải quyết.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1749B5] shrink-0 mt-0.5" />
                  <span>Tiếp cận sớm nguồn nhân lực kỹ sư chất lượng cao ngay từ khi còn trên giảng đường.</span>
                </li>
              </ul>
            </div>

            {/* Catalogue PDF Box */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-xs space-y-4">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-[#1749B5] flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#10182D]">Catalogue Dự án Sinh viên 2026</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Tài liệu tổng hợp thông số kỹ thuật, mô hình giải pháp và lộ trình phát triển của các dự án công nghệ đang trong giai đoạn ươm tạo tại BK-IC.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="/documents/BK-IC_Project_Catalogue_2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#10182D] text-white text-xs font-semibold hover:bg-[#1749B5] transition"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải Catalogue Dự án (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ĐĂNG KÝ (#register) */}
        <section id="register" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1749B5]" />
              <span>2. Đăng ký Đồng hành Dự án</span>
            </h2>
            <a
              href="#info"
              className="text-xs font-semibold text-slate-500 hover:text-[#1749B5]"
            >
              Lên đầu trang ↑
            </a>
          </div>

          {/* Clean Structural Section Placeholder (No business submission logic yet) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 space-y-6 text-center max-w-3xl mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#1749B5] flex items-center justify-center mx-auto">
              <BookmarkCheck className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#10182D]">
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
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1749B5] hover:underline"
              >
                <span>Xem danh mục các dự án đang trong vườn ươm</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Transition */}
        <CTASection
          eyebrow="HỢP TÁC DOANH NGHIỆP"
          title="Kết nối đa dạng các hình thức hợp tác với Trường ĐH Bách khoa"
          description="Tìm hiểu thêm về mạng lưới đối tác chiến lược và các gói hợp tác doanh nghiệp của BK-IC."
          primaryText="Xem Hợp tác Doanh nghiệp"
          primaryTo="/partnership/business"
          secondaryText="Về Tổng quan Hợp tác"
          secondaryTo="/partnership"
        />
      </div>
    </div>
  );
};

