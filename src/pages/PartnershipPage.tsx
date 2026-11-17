// BK-IC Partnership Hub — Minimalist Editorial Platform
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/editorial/SectionHeading';
import { Breadcrumbs } from '../components/editorial/Breadcrumbs';
import { CTASection } from '../components/editorial/CTASection';
import { 
  Building2, 
  Handshake, 
  Briefcase, 
  Rocket, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Layers, 
  FileText,
  Download
} from 'lucide-react';

export const PartnershipPage: React.FC = () => {
  const sections = [
    {
      to: '/partnership/companion-project',
      icon: Rocket,
      badge: 'ƯƠM TẠO DỰ ÁN',
      title: 'Dự án đồng hành',
      desc: 'Bảo trợ và ươm tạo các sản phẩm công nghệ của sinh viên, xem Catalogue dự án 2026 và đăng ký đồng hành.',
      highlight: 'Bao gồm: Thông tin & Đăng ký'
    },
    {
      to: '/partnership/partners',
      icon: Handshake,
      badge: 'HỆ SINH THÁI',
      title: 'Đối tác chiến lược',
      desc: 'Mạng lưới các viện nghiên cứu, trường đại học, vườn ươm khởi nghiệp và đơn vị đồng hành chính thức của BK-IC.',
      highlight: 'Bao gồm: Thông tin & Gửi yêu cầu'
    },
    {
      to: '/partnership/business',
      icon: Briefcase,
      badge: 'DOANH NGHIỆP',
      title: 'Hợp tác doanh nghiệp',
      desc: 'Các gói tài trợ cuộc thi, đặt hàng nghiên cứu phát triển (R&D) và tuyển dụng nhân sự công nghệ chất lượng cao.',
      highlight: 'Bao gồm: Thông tin & Gửi yêu cầu'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Hợp tác' }]} />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="CỔNG KẾT NỐI HỢP TÁC • BK-IC DUT"
            title="Đồng hành Kiến tạo Hệ sinh thái Đổi mới Sáng tạo"
            subtitle="BK-IC là cầu nối tin cậy giữa nguồn tri thức và đam mê công nghệ của sinh viên Bách khoa với nguồn lực thực tiễn, kinh nghiệm thương trường từ các doanh nghiệp và chuyên gia."
          />
        </div>

        {/* 3 Subcategory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Link
                key={idx}
                to={sec.to}
                className="group flex flex-col justify-between rounded-3xl border border-[#E2E6EE] bg-white p-7 shadow-xs hover:border-[#6B9DFF] hover:shadow-lg transition duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-50 text-[#1749B5] group-hover:bg-[#1749B5] group-hover:text-white transition duration-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-[#1749B5] transition">
                      {sec.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#10182D] group-hover:text-[#1749B5] transition">
                    {sec.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 text-[11px]">{sec.highlight}</span>
                  <span className="text-[#1749B5] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Catalogue & Value Proposition Banner */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1749B5]">
              <FileText className="h-3.5 w-3.5" />
              <span>Hồ sơ Năng lực Chính thức</span>
            </span>
            <h3 className="text-2xl font-bold text-[#10182D] tracking-tight">
              Tài liệu Hợp tác &amp; Catalogue Dự án 2026
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              Tài liệu chính thức giới thiệu về tổ chức, các lĩnh vực nghiên cứu trọng điểm, danh mục dự án sinh viên khả thi và quy trình hợp tác bảo trợ cùng BK-IC.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="/documents/BK-IC_Project_Catalogue_2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#10182D] text-white text-xs font-semibold hover:bg-[#1749B5] transition shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Tải Catalogue (PDF)</span>
            </a>
            <Link
              to="/partnership/business"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              <span>Các gói Hợp tác Doanh nghiệp</span>
            </Link>
          </div>
        </div>

        {/* CTA Transition */}
        <CTASection
          eyebrow="KẾT NỐI VỚI CHÚNG TÔI"
          title="Sẵn sàng đồng hành cùng thế hệ tài năng công nghệ Bách khoa?"
          description="Liên hệ trực tiếp với Ban Chủ nhiệm để trao đổi về các cơ hội hợp tác và chương trình phù hợp."
          primaryText="Hợp tác Doanh nghiệp"
          primaryTo="/partnership/business"
          secondaryText="Về Trang chủ"
          secondaryTo="/"
        />
      </div>
    </div>
  );
};
