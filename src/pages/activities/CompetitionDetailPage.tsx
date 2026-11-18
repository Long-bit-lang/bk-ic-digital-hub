// BK-IC Competition Detail Page — Authentic Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { COMPETITIONS_DATA } from '../../data/activitiesData';
import { 
  Trophy, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  BookmarkCheck,
  Building2,
  FileText,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const CompetitionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const found = COMPETITIONS_DATA.find((c) => c.slug === slug);
  const competition = found || COMPETITIONS_DATA[0];

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Cuộc thi', to: '/activities/cuoc-thi' },
          { label: competition.title }
        ]}
        eyebrow={`${competition.field.toUpperCase()} • ĐẤU TRƯỜNG ĐỔI MỚI SÁNG TẠO`}
        title={competition.title}
        subtitle={competition.summary}
        compact={true}
        actions={
          <Link
            to="/activities/cuoc-thi"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh sách Cuộc thi</span>
          </Link>
        }
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl">
        {/* Banner Cover Image & Info Highlights */}
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="space-y-6">
            {/* Visual Cover Banner with Natural Aspect Ratio */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-md">
              <img
                src={competition.coverImage}
                alt={competition.title}
                className="w-full max-h-[460px] object-contain mx-auto"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-sm backdrop-blur-md">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>{competition.field}</span>
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-[#075985] shadow-sm backdrop-blur-md">
                  <span>{competition.prizePool}</span>
                </span>
              </div>
            </div>

            {/* Highlights Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="text-slate-400 font-medium">Giải thưởng</div>
                  <div className="font-bold text-[#075985] text-sm">{competition.prizePool}</div>
                  <div className="text-slate-500 truncate max-w-[200px]">{competition.organizer}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="text-slate-400 font-medium">Hạn nộp hồ sơ</div>
                  <div className="font-bold text-[#10182D] text-sm">{competition.deadline}</div>
                  <div className="text-slate-500 font-medium">
                    {competition.status === 'completed' ? 'Đã hoàn tất trao giải' : 'Đang tiếp nhận hồ sơ'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="text-slate-400 font-medium">Quy mô tham gia</div>
                  <div className="font-bold text-[#10182D] text-sm">{competition.teamsCount}</div>
                  <div className="text-slate-500">Đội thi tranh tài</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base pt-6">
          {/* Section 1: Thể lệ & Lộ trình thực tế */}
          <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0284C7]" />
                <span>Thể lệ &amp; Lộ trình Cuộc thi</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {competition.timeline.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {step.phase}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{step.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Section 2: Cơ cấu giải thưởng */}
          <ScrollReveal direction="up" distance={20} delay={0.15} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#0284C7]" />
                <span>Cơ cấu Giải thưởng</span>
              </h2>
              <div className="space-y-3">
                {competition.prizes.map((p, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border ${
                      idx === 0 
                        ? 'border-sky-200/80 bg-gradient-to-r from-sky-50/80 via-white to-blue-50/40 shadow-xs' 
                        : 'border-slate-200/80 bg-white'
                    } gap-2`}
                  >
                    <div>
                      <strong className="text-[#10182D] font-bold block sm:inline">{p.rank}: </strong>
                      <span className="text-xs sm:text-sm text-slate-600">{p.extra}</span>
                    </div>
                    <span className="text-[#075985] font-black text-sm sm:text-base shrink-0">{p.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Section 3: Điều kiện & Đối tượng dự thi */}
          <ScrollReveal direction="up" distance={20} delay={0.18} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0284C7]" />
                <span>Đối tượng &amp; Điều kiện Tham gia</span>
              </h2>
              <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-3">
                <ul className="space-y-2.5">
                  {competition.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Status Notice */}
          <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
            <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 p-6 sm:p-8 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-[#075985]">
                <BookmarkCheck className="h-5 w-5 text-[#0284C7]" />
                <span>Trạng thái Cuộc thi</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cuộc thi đã kết thúc mùa giải năm 2026. Mọi thông tin về mùa giải tiếp theo sẽ được cập nhật chính thức trên cổng BK-IC Digital Hub và Fanpage Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-8 border-t border-slate-200/80 flex items-center justify-between">
          <Link
            to="/activities/cuoc-thi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Cuộc thi</span>
          </Link>
          <Link
            to="/activities/du-an"
            className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
          >
            Xem Dự án đồng hành →
          </Link>
        </div>
      </PageContentCanvas>
    </div>
  );
};

export default CompetitionDetailPage;
