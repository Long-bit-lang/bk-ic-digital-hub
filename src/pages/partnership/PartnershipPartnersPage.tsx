// BK-IC Partner Information Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { CTASection } from '../../components/editorial/CTASection';
import { 
  Building2, 
  Handshake, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const PartnershipPartnersPage: React.FC = () => {
  const partners = [
    {
      name: 'Trường Đại học Bách khoa – ĐHĐN (DUT)',
      role: 'Cơ quan Chủ quản & Bảo trợ Học thuật',
      desc: 'Hỗ trợ không gian Smart Campus Lab, cơ sở vật chất kỹ thuật và kết nối hội đồng giảng viên cố vấn.',
      badge: 'CHỦ QUẢN'
    },
    {
      name: 'Vườn ươm Doanh nghiệp Đà Nẵng (DNES)',
      role: 'Đối tác Ươm tạo & Cố vấn Chiến lược',
      desc: 'Cầu nối đưa các dự án sinh viên xuất sắc bước vào hệ sinh thái khởi nghiệp đổi mới sáng tạo thành phố.',
      badge: 'ƯƠM TẠO'
    },
    {
      name: 'Trung tâm Hỗ trợ Sinh viên & Quan hệ Doanh nghiệp DUT',
      role: 'Đơn vị Phối hợp Quản lý',
      desc: 'Đồng hành trong công tác tổ chức ngày hội việc làm, kết nối học bổng và giới thiệu thực tập.',
      badge: 'ĐỒNG HÀNH'
    },
    {
      name: 'Mạng lưới Cựu Sinh viên BK-IC & Doanh nhân Công nghệ',
      role: 'Hội đồng Cố vấn & Nhà đầu tư Thiên thần',
      desc: 'Chia sẻ kinh nghiệm thực chiến, tài trợ các giải đấu sáng tạo và tham gia làm Shark tại BK Shark.',
      badge: 'CỐ VẤN'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hợp tác', to: '/partnership' },
            { label: 'Đối tác' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="ĐỐI TÁC CHIẾN LƯỢC • BK-IC DUT"
            title="Mạng lưới Đối tác &amp; Hệ sinh thái Đồng hành"
            subtitle="BK-IC tự hào nhận được sự tin tưởng và đồng hành từ các viện nghiên cứu, vườn ươm khởi nghiệp và cộng đồng doanh nghiệp công nghệ hàng đầu."
          />
        </div>

        {/* SECTION 1: THÔNG TIN (#info) */}
        <section id="info" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1749B5]" />
              <span>1. Thông tin Đối tác Đồng hành</span>
            </h2>
            <a
              href="#request"
              className="text-xs font-semibold text-[#1749B5] hover:underline"
            >
              Chuyển đến mục Gửi yêu cầu ↓
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#E2E6EE] bg-white p-7 shadow-xs space-y-4 hover:border-[#6B9DFF] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1749B5] border border-blue-100">
                    {p.badge}
                  </span>
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#10182D]">{p.name}</h3>
                  <div className="text-xs font-semibold text-[#1749B5] mt-0.5">{p.role}</div>
                </div>
                <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: GỬI YÊU CẦU (#request) */}
        <section id="request" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1749B5]" />
              <span>2. Gửi Yêu cầu Hợp tác Đối tác</span>
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
              <Handshake className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#10182D]">
                Khung Đề xuất Hợp tác Đối tác Chiến lược
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-xl mx-auto">
                Khung tiếp nhận thỏa thuận ghi nhớ (MOU), bảo trợ truyền thông và hợp tác chiến lược giữa các tổ chức với BK-IC. Cổng tiếp nhận hồ sơ trực tuyến sẽ được chuẩn hóa trong giai đoạn tiếp theo.
              </p>
            </div>

            {/* Direct Contact Reference */}
            <div className="p-4 rounded-2xl bg-[#F5F6F8] text-xs text-slate-600 max-w-md mx-auto space-y-1 text-left">
              <strong className="text-[#10182D] block">Kênh kết nối trực tiếp Ban Đối ngoại (BCN):</strong>
              <div>• Email: <code className="font-mono text-[#1749B5]">bkic.dut@gmail.com</code></div>
              <div>• Địa chỉ: Văn phòng Đoàn Thanh niên – Hội Sinh viên, Trường ĐH Bách khoa (DUT)</div>
            </div>

            <div className="pt-2">
              <Link
                to="/partnership/business"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1749B5] hover:underline"
              >
                <span>Xem các gói hợp tác dành cho doanh nghiệp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Transition */}
        <CTASection
          eyebrow="ĐỒNG HÀNH DOANH NGHIỆP"
          title="Tạo dựng giá trị bền vững cùng thế hệ kỹ sư Bách khoa"
          description="Khám phá các gói tài trợ, đặt hàng đề tài R&D và tuyển dụng nhân sự công nghệ chất lượng cao."
          primaryText="Xem Hợp tác Doanh nghiệp"
          primaryTo="/partnership/business"
          secondaryText="Về Tổng quan Hợp tác"
          secondaryTo="/partnership"
        />
      </div>
    </div>
  );
};

