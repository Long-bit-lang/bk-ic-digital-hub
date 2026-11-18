// BK-IC Companion Project Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
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
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Dự án đồng hành', to: '/activities/companion-projects' },
          { label: project.title }
        ]}
        eyebrow={`${project.field.toUpperCase()} • VƯỜN ƯƠM CÔNG NGHỆ`}
        title={project.title}
        subtitle={project.summary}
        compact={true}
        actions={
          <Link
            to="/activities/companion-projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh mục Dự án</span>
          </Link>
        }
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl">
        {/* Project Meta Card */}
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Giai đoạn phát triển</div>
                <div className="font-bold text-[#075985] text-sm">{project.stage}</div>
                <div className="text-slate-500">Năm khởi động: {project.year}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Đội ngũ thực hiện</div>
                <div className="font-bold text-[#10182D] text-sm">{project.leadName}</div>
                <div className="text-slate-500">{project.faculty}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <Target className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Trạng thái bảo trợ</div>
                <div className="font-bold text-emerald-600 text-sm">Ươm tạo chính thức</div>
                <div className="text-slate-500">Hỗ trợ lab &amp; chuyên môn</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Giải pháp &amp; Tính năng cốt lõi
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Dự án tập trung giải quyết bài toán tối ưu hóa quy trình vận hành và tiết kiệm chi phí thông qua việc kết hợp các cảm biến thông minh, bộ điều khiển vi xử lý và nền tảng điện toán đám mây.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-1.5">
                  <div className="font-bold text-[#10182D] flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7]" />
                    <span>Xử lý thời gian thực</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">Thu thập và phân tích dữ liệu với độ trễ thấp dưới 100ms.</p>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-1.5">
                  <div className="font-bold text-[#10182D] flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7]" />
                    <span>Kiến trúc mở rộng</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">Dễ dàng tích hợp với các hệ thống quản trị hiện hữu tại khuôn viên trường.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={20} delay={0.15} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Nhu cầu kết nối &amp; Hợp tác
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nhóm dự án hiện đang mong muốn kết nối với:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                  <span><strong>Cố vấn chuyên môn:</strong> Hướng dẫn kiểm thử độ tin cậy và thương mại hóa sản phẩm.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                  <span><strong>Doanh nghiệp đối tác:</strong> Cung cấp môi trường thử nghiệm thực tế hoặc tài trợ trang thiết bị.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                  <span><strong>Nhà đầu tư thiên thần:</strong> Hỗ trợ vốn hạt giống để hoàn thiện vòng kiểm định tiêu chuẩn.</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
          <Link
            to="/activities/companion-projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Dự án đồng hành</span>
          </Link>
          <Link
            to="/partnership/companion-project"
            className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
          >
            Đăng ký Hợp tác Đồng hành Dự án →
          </Link>
        </div>
      </PageContentCanvas>
    </div>
  );
};
