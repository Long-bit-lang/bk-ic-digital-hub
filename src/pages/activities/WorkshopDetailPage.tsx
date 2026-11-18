// BK-IC Workshop Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { CTASection } from '../../components/editorial/CTASection';
import { sampleWorkshops } from './WorkshopsPage';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Building2,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

export const WorkshopDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Look up workshop by slug, or generate structured detail
  const found = sampleWorkshops.find((w) => w.slug === slug);
  const workshop = found || {
    slug: slug || 'workshop-detail',
    title: slug
      ? `Hội thảo Chuyên đề: ${slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`
      : 'Hội thảo Chuyên đề Công nghệ BK-IC',
    category: 'Công nghệ & Đổi mới',
    date: 'Thứ Bảy, 12/12/2026',
    time: '08:30 – 11:30',
    location: 'Hội trường Khu F, Trường Đại học Bách khoa (DUT)',
    speaker: 'TS. Giảng viên Cố vấn Khoa Chuyên ngành, DUT',
    status: 'upcoming' as const,
    summary: 'Chuyên đề học thuật kết hợp thực hành định hướng nghiên cứu và phát triển sản phẩm công nghệ.'
  };

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Workshop', to: '/activities/workshops' },
          { label: workshop.title }
        ]}
        eyebrow={`${workshop.category.toUpperCase()} • WORKSHOP CHUYÊN ĐỀ`}
        title={workshop.title}
        subtitle={workshop.summary}
        compact={true}
        actions={
          <Link
            to="/activities/workshops"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh sách Workshop</span>
          </Link>
        }
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl">
        {/* Info Highlights Card */}
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Thời gian tổ chức</div>
                <div className="font-bold text-[#10182D]">{workshop.date}</div>
                <div className="text-slate-500">{workshop.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Địa điểm</div>
                <div className="font-bold text-[#10182D]">{workshop.location}</div>
                <div className="text-slate-500">Đại học Bách khoa – ĐHĐN</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <User className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Diễn giả / Chủ trì</div>
                <div className="font-bold text-[#10182D]">{workshop.speaker}</div>
                <div className="text-slate-500">Ban Cố vấn Chuyên môn</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6}>
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Mục tiêu &amp; Giá trị mang lại
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Buổi workshop hướng đến trang bị cho sinh viên cái nhìn thực tế về quy trình phát triển sản phẩm công nghệ, kết nối tư duy lý thuyết trên giảng đường với nhu cầu ứng dụng thực tiễn tại doanh nghiệp.
              </p>
              <ul className="space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-1" />
                  <span>Nắm vững kiến thức nền tảng và các xu hướng công nghệ nổi bật trong lĩnh vực.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-1" />
                  <span>Hỏi đáp và thảo luận trực tiếp cùng diễn giả và ban cố vấn chuyên môn.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-1" />
                  <span>Cơ hội tham gia vào các nhóm dự án đồng hành do BK-IC bảo trợ.</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} delay={0.15} duration={0.6}>
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Nội dung chương trình dự kiến
              </h2>
              <div className="space-y-3">
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs">
                  <div className="font-bold text-[#10182D]">Phần 1: Khởi động &amp; Báo cáo Tổng quan xu hướng (45 phút)</div>
                  <div className="text-xs text-slate-500 mt-1">Giới thiệu bối cảnh thực tế và các rào cản kỹ thuật thường gặp.</div>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs">
                  <div className="font-bold text-[#10182D]">Phần 2: Trình diễn Demo Kỹ thuật &amp; Case Study (60 phút)</div>
                  <div className="text-xs text-slate-500 mt-1">Phân tích dự án mẫu và cách thức giải quyết bài toán tối ưu.</div>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs">
                  <div className="font-bold text-[#10182D]">Phần 3: Tọa đàm Hỏi đáp (Q&amp;A) &amp; Kết nối giao lưu (30 phút)</div>
                  <div className="text-xs text-slate-500 mt-1">Giao lưu mở cùng sinh viên và chụp ảnh lưu niệm.</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Registration Notice */}
          <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
            <div className="rounded-3xl border border-[#0284C7]/20 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-6 sm:p-8 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-[#0284C7]">
                <BookmarkCheck className="h-5 w-5" />
                <span>Đăng ký tham dự Workshop</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cổng đăng ký tham dự trực tuyến sẽ được kích hoạt theo thông báo chính thức của Ban Tổ chức. Sinh viên có thể theo dõi Fanpage BK-IC để nhận vé mời sớm nhất.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
          <Link
            to="/activities/workshops"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Workshop</span>
          </Link>
          <Link
            to="/activities/competitions"
            className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
          >
            Khám phá Cuộc thi sáng tạo →
          </Link>
        </div>
      </PageContentCanvas>
    </div>
  );
};
