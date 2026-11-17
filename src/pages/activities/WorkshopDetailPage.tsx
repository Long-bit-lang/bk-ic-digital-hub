// BK-IC Workshop Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
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
    <div className="min-h-screen bg-[#FDFDFE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: 'Hoạt động', to: '/activities' },
              { label: 'Workshop thường niên', to: '/activities/workshops' },
              { label: workshop.title }
            ]}
          />
          <Link
            to="/activities/workshops"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách Workshop</span>
          </Link>
        </div>

        {/* Title Area */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-50 text-[#1749B5] border border-blue-200">
              {workshop.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                workshop.status === 'upcoming'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {workshop.status === 'upcoming' ? '• Sắp diễn ra' : '• Đã hoàn thành'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Mã: {workshop.slug}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10182D] tracking-tight leading-tight">
            {workshop.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed">
            {workshop.summary}
          </p>
        </div>

        {/* Metadata Card Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
              <Calendar className="h-4 w-4 text-[#1749B5]" />
              <span>Thời gian</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">{workshop.date}</div>
            <div className="text-xs text-slate-500">{workshop.time}</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
              <MapPin className="h-4 w-4 text-[#1749B5]" />
              <span>Địa điểm</span>
            </div>
            <div className="text-sm font-bold text-[#10182D] truncate">{workshop.location}</div>
            <div className="text-xs text-slate-500">Đại học Bách khoa – ĐHĐN</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
              <User className="h-4 w-4 text-[#1749B5]" />
              <span>Diễn giả chính</span>
            </div>
            <div className="text-sm font-bold text-[#10182D] truncate">{workshop.speaker}</div>
            <div className="text-xs text-slate-500">Ban Cố vấn & Chuyên môn</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
              <Building2 className="h-4 w-4 text-[#1749B5]" />
              <span>Đơn vị tổ chức</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">BK-IC Digital Hub</div>
            <div className="text-xs text-slate-500">Đoàn TN – Hội SV DUT</div>
          </div>
        </div>

        {/* Optional Image / Media Area Placeholder */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <FileText className="h-4 w-4" />
            <span>Khu vực Đồ họa &amp; Poster Sự kiện</span>
          </div>
          <div className="max-w-md mx-auto text-xs text-slate-500">
            Khung hình chuẩn 16:9 dành cho Poster truyền thông chính thức, slide tóm tắt chuyên đề và hình ảnh ghi lại từ sự kiện.
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Mục tiêu &amp; Giá trị mang lại
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Buổi workshop hướng đến trang bị cho sinh viên cái nhìn thực tế về quy trình phát triển sản phẩm công nghệ, kết nối tư duy lý thuyết trên giảng đường với nhu cầu ứng dụng thực tiễn tại doanh nghiệp.
            </p>
            <ul className="space-y-2 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1749B5] shrink-0 mt-1" />
                <span>Nắm vững kiến thức nền tảng và các xu hướng công nghệ nổi bật trong lĩnh vực.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1749B5] shrink-0 mt-1" />
                <span>Hỏi đáp và thảo luận trực tiếp cùng diễn giả và ban cố vấn chuyên môn.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1749B5] shrink-0 mt-1" />
                <span>Cơ hội tham gia vào các nhóm dự án đồng hành do BK-IC bảo trợ.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Nội dung chương trình dự kiến
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="font-bold text-[#10182D]">Phần 1: Khởi động &amp; Báo cáo Tổng quan xu hướng (45 phút)</div>
                <div className="text-xs text-slate-500 mt-1">Giới thiệu bối cảnh thực tế và các rào cản kỹ thuật thường gặp.</div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="font-bold text-[#10182D]">Phần 2: Trình diễn Demo Kỹ thuật &amp; Case Study (60 phút)</div>
                <div className="text-xs text-slate-500 mt-1">Phân tích dự án mẫu và cách thức giải quyết bài toán tối ưu.</div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="font-bold text-[#10182D]">Phần 3: Tọa đàm Hỏi đáp (Q&amp;A) &amp; Kết nối giao lưu (30 phút)</div>
                <div className="text-xs text-slate-500 mt-1">Giao lưu mở cùng sinh viên và chụp ảnh lưu niệm.</div>
              </div>
            </div>
          </div>

          {/* Registration Notice Placeholder (Explicitly no form yet) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1749B5]">
              <BookmarkCheck className="h-5 w-5" />
              <span>Đăng ký tham dự Workshop</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cổng đăng ký tham dự trực tuyến sẽ được kích hoạt theo thông báo chính thức của Ban Tổ chức. Sinh viên có thể theo dõi Fanpage BK-IC để nhận vé mời sớm nhất.
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            to="/activities/workshops"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Workshop</span>
          </Link>
          <Link
            to="/activities/competitions"
            className="text-xs font-semibold text-[#1749B5] hover:underline"
          >
            Khám phá Cuộc thi sáng tạo →
          </Link>
        </div>
      </div>
    </div>
  );
};
