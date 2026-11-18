// BK-IC Activities Hub — Minimalist Editorial 6-Category Platform
import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroBanner } from '../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../components/layout/PageContentCanvas';
import { ScrollReveal } from '../components/effects/ScrollReveal';
import { CTASection } from '../components/editorial/CTASection';
import { 
  Calendar, 
  Sparkles, 
  Award, 
  Rocket, 
  Flame, 
  Users, 
  ArrowRight, 
  Clock, 
  MapPin,
  ExternalLink
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const categories = [
    {
      to: '/activities/internal',
      icon: Calendar,
      badge: 'NỘI BỘ',
      title: 'Sinh hoạt nội bộ',
      desc: 'Lịch sinh hoạt cố định chiều thứ Ba hàng tuần (17:30 – 19:00), tập huấn chuyên môn và gắn kết các ban.',
      highlight: 'Điểm danh qua mã QR'
    },
    {
      to: '/activities/workshops',
      icon: Sparkles,
      badge: 'CHUYÊN ĐỀ',
      title: 'Workshop thường niên',
      desc: 'Chuỗi hội thảo công nghệ chuyên sâu với sự tham gia của giảng viên cố vấn và chuyên gia doanh nghiệp.',
      highlight: 'Mở đơn công khai'
    },
    {
      to: '/activities/competitions',
      icon: Award,
      badge: 'HỌC THUẬT',
      title: 'Cuộc thi sáng tạo',
      desc: 'Các sân chơi học thuật và cuộc thi khởi nghiệp đổi mới sáng tạo do BK-IC tổ chức hoặc đồng hành.',
      highlight: 'Tranh tài giải pháp'
    },
    {
      to: '/activities/companion-projects',
      icon: Rocket,
      badge: 'ƯƠM TẠO',
      title: 'Dự án đồng hành',
      desc: 'Danh mục các dự án nghiên cứu phát triển sản phẩm công nghệ do sinh viên Bách khoa thực hiện.',
      highlight: 'Bảo trợ kỹ thuật'
    },
    {
      to: '/activities/bk-shark',
      icon: Flame,
      badge: 'PITCHING',
      title: 'Sân khấu BK Shark',
      desc: 'Sân khấu pitching thường niên nơi các nhóm dự án sinh viên thuyết trình và đón nhận vốn đầu tư hạt giống.',
      highlight: 'Hội đồng chuyên gia'
    },
    {
      to: '/activities/recruitment',
      icon: Users,
      badge: 'NHÂN SỰ',
      title: 'Tuyển thành viên',
      desc: 'Cổng thông tin tuyển quân chính thức cho 3 ban: Ban Chủ nhiệm (BCN), Ban Điều hành (BĐH) và Ban Thành viên (BTV).',
      highlight: 'Đợt tuyển Gen 2026'
    }
  ];

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[{ label: 'Hoạt động' }]}
        eyebrow="HỆ THỐNG PHÂN HỆ HOẠT ĐỘNG • BK-IC DUT"
        title="Đổi mới Sáng tạo &"
        titleHighlight="Kiến tạo Giá trị Thực"
        subtitle="Toàn bộ chuỗi hoạt động của CLB được cấu trúc khoa học thành 6 phân hệ chuyên biệt nhằm hỗ trợ tối đa cho sinh viên từ giai đoạn ý tưởng đến khi phát triển thành dự án khả thi."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* 6 Subcategory Cards Grid with ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <ScrollReveal key={idx} direction="up" distance={20} delay={idx * 0.08} duration={0.6}>
                <Link
                  to={cat.to}
                  className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-sky-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition duration-300 shadow-2xs">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-[#0284C7] transition">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#10182D] group-hover:text-[#0284C7] transition">
                      {cat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400 text-[11px]">{cat.highlight}</span>
                    <span className="text-[#0284C7] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                      <span>Khám phá</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA Transition */}
        <ScrollReveal direction="up" distance={24} duration={0.65}>
          <CTASection
            eyebrow="ĐỒNG HÀNH CÙNG BK-IC"
            title="Bạn là sinh viên có ý tưởng công nghệ hoặc đam mê khởi nghiệp?"
            description="Tham gia các buổi workshop hoặc nộp hồ sơ gia nhập CLB để được ươm mầm và phát triển cùng cộng đồng sinh viên Bách khoa."
            primaryText="Đợt Tuyển thành viên"
            primaryTo="/activities/recruitment"
            secondaryText="Liên hệ hợp tác"
            secondaryTo="/partnership"
          />
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
