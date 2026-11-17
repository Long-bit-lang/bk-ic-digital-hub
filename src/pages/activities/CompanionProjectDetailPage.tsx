// BK-IC Companion Project Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { sampleProjects } from './CompanionProjectsPage';
import { 
  Rocket, 
  Layers, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  FileText,
  Target,
  Cpu,
  GraduationCap,
  Building2,
  ExternalLink
} from 'lucide-react';

export const CompanionProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const found = sampleProjects.find((p) => p.slug === slug);
  const project = found || {
    slug: slug || 'project-detail',
    title: slug
      ? `Dự án Công nghệ: ${slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`
      : 'Dự án Đổi mới Sáng tạo Sinh viên',
    field: 'Công nghệ & Kỹ thuật',
    stage: 'Ươm tạo giai đoạn 1',
    leadName: 'Nhóm nghiên cứu Sinh viên BK-IC',
    faculty: 'Trường Đại học Bách khoa – ĐHĐN',
    summary: 'Giải pháp ứng dụng công nghệ số và kỹ thuật tiên tiến giải quyết vấn đề thực tiễn.',
    year: '2026'
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: 'Hoạt động', to: '/activities' },
              { label: 'Dự án đồng hành', to: '/activities/companion-projects' },
              { label: project.title }
            ]}
          />
          <Link
            to="/activities/companion-projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh mục Dự án</span>
          </Link>
        </div>

        {/* Title Area */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1749B5] border border-blue-200">
              {project.field}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {project.stage}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Năm khởi tạo: {project.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10182D] tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Metadata Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Users className="h-4 w-4 text-[#1749B5]" />
              <span>Đội ngũ nghiên cứu</span>
            </div>
            <div className="text-sm font-bold text-[#10182D] truncate">{project.leadName}</div>
            <div className="text-xs text-slate-500">Sinh viên Bách khoa</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <GraduationCap className="h-4 w-4 text-[#1749B5]" />
              <span>Khoa / Viện</span>
            </div>
            <div className="text-sm font-bold text-[#10182D] truncate">{project.faculty}</div>
            <div className="text-xs text-slate-500">DUT • Đại học Đà Nẵng</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Rocket className="h-4 w-4 text-[#1749B5]" />
              <span>Giai đoạn</span>
            </div>
            <div className="text-sm font-bold text-[#10182D] truncate">{project.stage}</div>
            <div className="text-xs text-slate-500">Ươm tạo bởi BK-IC</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Building2 className="h-4 w-4 text-[#1749B5]" />
              <span>Bảo trợ chuyên môn</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">BK-IC Digital Hub</div>
            <div className="text-xs text-slate-500">Đoàn TN – Hội SV DUT</div>
          </div>
        </div>

        {/* Optional Media Area Placeholder */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <Cpu className="h-4 w-4" />
            <span>Khu vực Trình diễn Nguyên mẫu &amp; Video Demo</span>
          </div>
          <div className="max-w-md mx-auto text-xs text-slate-500">
            Khung hiển thị hình ảnh phần cứng, sơ đồ kiến trúc hệ thống, giao diện ứng dụng và video thử nghiệm thực địa của dự án.
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Giải pháp &amp; Tính năng cốt lõi
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Dự án tập trung giải quyết bài toán tối ưu hóa quy trình vận hành và tiết kiệm chi phí thông qua việc kết hợp các cảm biến thông minh, bộ điều khiển vi xử lý và nền tảng điện toán đám mây.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-[#10182D] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1749B5]" />
                  <span>Xử lý thời gian thực</span>
                </div>
                <p className="text-xs text-slate-500">Thu thập và phân tích dữ liệu với độ trễ thấp dưới 100ms.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-[#10182D] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1749B5]" />
                  <span>Kiến trúc mở rộng</span>
                </div>
                <p className="text-xs text-slate-500">Dễ dàng tích hợp với các hệ thống quản trị hiện hữu tại khuôn viên trường.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Nhu cầu kết nối &amp; Hợp tác
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Nhóm dự án hiện đang mong muốn kết nối với:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1749B5] mt-2 shrink-0"></span>
                <span><strong>Cố vấn chuyên môn:</strong> Hướng dẫn kiểm thử độ tin cậy và thương mại hóa sản phẩm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1749B5] mt-2 shrink-0"></span>
                <span><strong>Doanh nghiệp đối tác:</strong> Cung cấp môi trường thử nghiệm thực tế hoặc tài trợ trang thiết bị.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1749B5] mt-2 shrink-0"></span>
                <span><strong>Nhà đầu tư thiên thần:</strong> Hỗ trợ vốn hạt giống để hoàn thiện vòng kiểm định tiêu chuẩn.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            to="/activities/companion-projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Dự án đồng hành</span>
          </Link>
          <Link
            to="/partnership/companion-project"
            className="text-xs font-semibold text-[#1749B5] hover:underline"
          >
            Đăng ký Hợp tác Đồng hành Dự án →
          </Link>
        </div>
      </div>
    </div>
  );
};

