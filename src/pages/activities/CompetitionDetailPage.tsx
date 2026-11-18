// BK-IC Competition Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { sampleCompetitions } from './CompetitionsPage';
import { 
  Trophy, 
  Calendar, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  BookmarkCheck,
  ShieldAlert,
  Building2,
  FileText
} from 'lucide-react';

export const CompetitionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const found = sampleCompetitions.find((c) => c.slug === slug);
  const competition = found || {
    slug: slug || 'competition-detail',
    title: slug
      ? `Cuộc thi Sáng tạo: ${slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`
      : 'Cuộc thi Sáng tạo Khởi nghiệp BK-IC',
    field: 'Khoa học & Kỹ thuật',
    prizePool: '100.000.000 VNĐ',
    deadline: '31/12/2026',
    teamsCount: '30+ Đội',
    status: 'active' as const,
    summary: 'Đấu trường tranh tài giải pháp sáng tạo công nghệ dành cho sinh viên toàn trường.',
    organizer: 'Đoàn Thanh niên – Hội Sinh viên DUT & BK-IC'
  };

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Cuộc thi', to: '/activities/competitions' },
          { label: competition.title }
        ]}
        eyebrow={`${competition.field.toUpperCase()} • ĐẤU TRƯỜNG CÔNG NGHỆ`}
        title={competition.title}
        subtitle={competition.summary}
        compact={true}
        actions={
          <Link
            to="/activities/competitions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh sách Cuộc thi</span>
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
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Tổng giải thưởng</div>
                <div className="font-bold text-[#075985] text-sm">{competition.prizePool}</div>
                <div className="text-slate-500">Kèm cơ hội ươm tạo</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Hạn nộp hồ sơ</div>
                <div className="font-bold text-[#10182D] text-sm">{competition.deadline}</div>
                <div className="text-emerald-600 font-medium">Đang nhận đơn đăng ký</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 font-medium">Quy mô tham gia</div>
                <div className="font-bold text-[#10182D] text-sm">{competition.teamsCount}</div>
                <div className="text-slate-500">Sinh viên toàn trường</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1: Thể lệ */}
          <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Thể lệ &amp; Lộ trình Cuộc thi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-2">
                  <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                    VÒNG 1
                  </span>
                  <div className="font-bold text-[#10182D]">Ý tưởng &amp; Nộp hồ sơ</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Nộp bản mô tả ý tưởng, tính mới mẻ công nghệ và khả năng giải quyết vấn đề.</p>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-2">
                  <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                    VÒNG 2
                  </span>
                  <div className="font-bold text-[#10182D]">Phát triển Nguyên mẫu (MVP)</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Làm việc cùng ban cố vấn (mentors) để hoàn thiện nguyên mẫu kỹ thuật khả dụng.</p>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-2">
                  <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                    CHUNG KẾT
                  </span>
                  <div className="font-bold text-[#10182D]">Pitching trước Hội đồng</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Thuyết trình sản phẩm thực tế, trả lời phản biện và đón nhận cơ hội ươm tạo.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 2: Cơ cấu giải thưởng */}
          <ScrollReveal direction="up" distance={20} delay={0.15} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Cơ cấu Giải thưởng
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-sky-200/60 bg-sky-50/50">
                  <strong className="text-[#10182D]">01 Giải Nhất (Quán quân):</strong>
                  <span className="text-[#075985] font-bold">50.000.000 VNĐ + Suất vào thẳng Vườn ươm</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                  <strong className="text-[#10182D]">01 Giải Nhì (Á quân):</strong>
                  <span className="text-slate-700 font-bold">25.000.000 VNĐ + Khóa huấn luyện chuyên sâu</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                  <strong className="text-[#10182D]">02 Giải Ba:</strong>
                  <span className="text-slate-700 font-bold">10.000.000 VNĐ/giải</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Registration Notice */}
          <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
            <div className="rounded-3xl border border-[#0284C7]/20 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-6 sm:p-8 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-[#0284C7]">
                <BookmarkCheck className="h-5 w-5" />
                <span>Đăng ký Đội thi</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Form đăng ký dự thi trực tuyến (dành cho cá nhân tìm đội và đội nhóm chính thức) sẽ được mở theo lịch trình chính thức của Ban Tổ chức.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
          <Link
            to="/activities/competitions"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Cuộc thi</span>
          </Link>
          <Link
            to="/activities/companion-projects"
            className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
          >
            Xem Dự án đồng hành →
          </Link>
        </div>
      </PageContentCanvas>
    </div>
  );
};
