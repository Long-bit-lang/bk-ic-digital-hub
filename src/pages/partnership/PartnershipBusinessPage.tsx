// BK-IC Business Partnership Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { CTASection } from '../../components/editorial/CTASection';
import { 
  Briefcase, 
  Target, 
  Users, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Building2,
  BookmarkCheck
} from 'lucide-react';

export const PartnershipBusinessPage: React.FC = () => {
  const models = [
    {
      title: 'Tài trợ Cuộc thi & Workshop',
      desc: 'Đồng hành tài trợ học bổng, giải thưởng cho các giải đấu học thuật (BK Maker, Hackathon) và chuỗi hội thảo chuyên đề.',
      benefit: 'Quảng bá hình ảnh thương hiệu tuyển dụng đến hơn 15.000 sinh viên Bách khoa.'
    },
    {
      title: 'Đặt hàng Nghiên cứu & Phát triển (R&D)',
      desc: 'Doanh nghiệp chuyển giao các bài toán kỹ thuật thực tế để sinh viên và giảng viên cố vấn xây dựng nguyên mẫu thử nghiệm (MVP).',
      benefit: 'Tiết kiệm chi phí R&D giai đoạn sớm, tiếp cận giải pháp sáng tạo mới.'
    },
    {
      title: 'Đồng hành Ươm tạo Dự án',
      desc: 'Cung cấp trang thiết bị phòng lab, tài khoản cloud hoặc vốn hạt giống cho các dự án tiềm năng tại sân khấu BK Shark.',
      benefit: 'Quyền ưu tiên khai thác thương mại và đồng sở hữu giải pháp công nghệ.'
    },
    {
      title: 'Tuyển dụng & Đào tạo Nhân sự Tài năng',
      desc: 'Tổ chức các buổi phỏng vấn tuyển dụng sớm, đặt hàng đào tạo kỹ năng chuyên môn trước khi sinh viên tốt nghiệp.',
      benefit: 'Tuyển dụng đúng nhân sự kỹ thuật có tư duy thực chiến và văn hóa kỷ luật.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hợp tác', to: '/partnership' },
            { label: 'Hợp tác doanh nghiệp' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="HỢP TÁC DOANH NGHIỆP • BK-IC DUT"
            title="Giải pháp Hợp tác Toàn diện cùng Doanh nghiệp Công nghệ"
            subtitle="Cầu nối chiến lược giúp doanh nghiệp tiếp cận nguồn trí tuệ sinh viên Bách khoa, quảng bá thương hiệu tuyển dụng và hiện thực hóa các đề tài R&D đột phá."
          />
        </div>

        {/* SECTION 1: THÔNG TIN (#info) */}
        <section id="info" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1749B5]" />
              <span>1. Thông tin Các Mô hình Hợp tác</span>
            </h2>
            <a
              href="#request"
              className="text-xs font-semibold text-[#1749B5] hover:underline"
            >
              Chuyển đến mục Gửi yêu cầu ↓
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((m, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#E2E6EE] bg-white p-7 shadow-xs space-y-4 hover:border-[#6B9DFF] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1749B5]">
                    MÔ HÌNH 0{idx + 1}
                  </span>
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-[#10182D]">{m.title}</h3>
                <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                  {m.desc}
                </p>
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <strong className="text-[#10182D] block mb-0.5">Giá trị nhận được:</strong>
                  <span className="text-[#1749B5]">{m.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: GỬI YÊU CẦU (#request) */}
        <section id="request" className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1749B5]" />
              <span>2. Gửi Yêu cầu Hợp tác Doanh nghiệp</span>
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
                Khung Tiếp nhận Đề xuất Hợp tác Doanh nghiệp
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-xl mx-auto">
                Khung cấu trúc tiếp nhận thông tin doanh nghiệp, người đại diện và nhu cầu hợp tác cụ thể. Biểu mẫu đăng ký và tải tài liệu đề xuất sẽ được tích hợp trong giai đoạn phát triển tiếp theo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F6F8] space-y-1">
                <strong className="text-[#10182D] block">Đại diện Ban Đối ngoại BK-IC</strong>
                <span className="text-slate-500 block">Email: <code className="font-mono text-[#1749B5]">bkic.dut@gmail.com</code></span>
                <span className="text-slate-500">Phản hồi đề xuất trong vòng 48 giờ làm việc.</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F6F8] space-y-1">
                <strong className="text-[#10182D] block">Văn phòng CLB &amp; Smart Campus Lab</strong>
                <span className="text-slate-500">Khu A, Trường Đại học Bách khoa (DUT), 54 Nguyễn Lương Bằng, Đà Nẵng.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/partnership/companion-project"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1749B5] hover:underline"
              >
                <span>Tìm hiểu thêm về Đồng hành Dự án</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Transition */}
        <CTASection
          eyebrow="TỔNG QUAN HỢP TÁC"
          title="Xây dựng quan hệ hợp tác chiến lược cùng BK-IC Digital Hub"
          description="Khám phá toàn cảnh cơ hội hợp tác và tải tài liệu hồ sơ năng lực chính thức của CLB."
          primaryText="Về Tổng quan Hợp tác"
          primaryTo="/partnership"
          secondaryText="Xem Cuộc thi sáng tạo"
          secondaryTo="/activities/competitions"
        />
      </div>
    </div>
  );
};
