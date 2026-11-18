// BK-IC Partner Information Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
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
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hợp tác', to: '/partnership' },
          { label: 'Đối tác' }
        ]}
        eyebrow="ĐỐI TÁC CHIẾN LƯỢC • BK-IC DUT"
        title="Mạng lưới Đối tác &"
        titleHighlight="Hệ sinh thái Đồng hành"
        subtitle="BK-IC tự hào nhận được sự tin tưởng và đồng hành từ các viện nghiên cứu, vườn ươm khởi nghiệp và cộng đồng doanh nghiệp công nghệ hàng đầu."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* SECTION 1: THÔNG TIN (#info) */}
        <section id="info" className="space-y-8 scroll-mt-24">
          <ScrollReveal direction="up" distance={16} duration={0.5}>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                <span>1. Thông tin Đối tác Đồng hành</span>
              </h2>
              <a
                href="#request"
                className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
              >
                Chuyển đến mục Gửi yêu cầu ↓
              </a>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((p, idx) => (
              <ScrollReveal key={idx} direction="up" distance={20} delay={idx * 0.08} duration={0.6}>
                <div
                  className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs space-y-4 hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100">
                        {p.badge}
                      </span>
                      <Building2 className="h-4 w-4 text-[#0284C7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#10182D]">{p.name}</h3>
                      <div className="text-xs font-semibold text-[#0284C7] mt-0.5">{p.role}</div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* SECTION 2: GỬI YÊU CẦU (#request) */}
        <section id="request" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200/80">
          <ScrollReveal direction="up" distance={16} duration={0.5}>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                <span>2. Gửi Yêu cầu Hợp tác Đối tác</span>
              </h2>
              <a
                href="#info"
                className="text-xs font-bold text-slate-500 hover:text-[#0284C7]"
              >
                Lên đầu trang ↑
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} duration={0.65}>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 space-y-6 text-center max-w-3xl mx-auto shadow-xs hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto shadow-2xs border border-sky-100">
                <Handshake className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#10182D]">
                  Khung Đề xuất Hợp tác Đối tác Chiến lược
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-xl mx-auto">
                  Khung tiếp nhận thỏa thuận ghi nhớ (MOU), bảo trợ truyền thông và hợp tác chiến lược giữa các tổ chức với BK-IC. Cổng tiếp nhận hồ sơ trực tuyến sẽ được chuẩn hóa trong giai đoạn tiếp theo.
                </p>
              </div>

              {/* Direct Contact Reference */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600 max-w-md mx-auto space-y-1.5 text-left">
                <strong className="text-[#10182D] block">Kênh kết nối trực tiếp Ban Đối ngoại (BCN):</strong>
                <div>• Email: <code className="font-mono text-[#0284C7] font-semibold">bkic.dut@gmail.com</code></div>
                <div>• Địa chỉ: Văn phòng Đoàn Thanh niên – Hội Sinh viên, Trường ĐH Bách khoa (DUT)</div>
              </div>

              <div className="pt-2">
                <Link
                  to="/partnership/business"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
                >
                  <span>Xem các gói hợp tác dành cho doanh nghiệp</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CTA Transition */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <CTASection
            eyebrow="ĐỒNG HÀNH DOANH NGHIỆP"
            title="Tạo dựng giá trị bền vững cùng thế hệ kỹ sư Bách khoa"
            description="Khám phá các gói tài trợ, đặt hàng đề tài R&D và tuyển dụng nhân sự công nghệ chất lượng cao."
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
