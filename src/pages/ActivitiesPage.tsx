// BK-IC Activities Hub — Minimalist Editorial 6-Category Platform
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/editorial/SectionHeading';
import { Breadcrumbs } from '../components/editorial/Breadcrumbs';
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
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Hoạt động' }]} />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="HỆ THỐNG PHÂN HỆ HOẠT ĐỘNG • BK-IC DUT"
            title="Đổi mới Sáng tạo & Kiến tạo Giá trị Thực"
            subtitle="Toàn bộ chuỗi hoạt động của CLB được cấu trúc khoa học thành 6 phân hệ chuyên biệt nhằm hỗ trợ tối đa cho sinh viên từ giai đoạn ý tưởng đến khi phát triển thành dự án khả thi."
          />
        </div>

        {/* 6 Subcategory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={cat.to}
                className="group flex flex-col justify-between rounded-3xl border border-[#E2E6EE] bg-white p-7 shadow-xs hover:border-[#6B9DFF] hover:shadow-lg transition duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-50 text-[#1749B5] group-hover:bg-[#1749B5] group-hover:text-white transition duration-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-[#1749B5] transition">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#10182D] group-hover:text-[#1749B5] transition">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 text-[11px]">{cat.highlight}</span>
                  <span className="text-[#1749B5] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Khám phá</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Transition */}
        <CTASection
          eyebrow="ĐỒNG HÀNH CÙNG BK-IC"
          title="Bạn là sinh viên có ý tưởng công nghệ hoặc đam mê khởi nghiệp?"
          description="Tham gia các buổi workshop hoặc nộp hồ sơ gia nhập CLB để được ươm mầm và phát triển cùng cộng đồng sinh viên Bách khoa."
          primaryText="Đợt Tuyển thành viên"
          primaryTo="/activities/recruitment"
          secondaryText="Liên hệ hợp tác"
          secondaryTo="/partnership"
        />
      </div>
    </div>
  );
};
