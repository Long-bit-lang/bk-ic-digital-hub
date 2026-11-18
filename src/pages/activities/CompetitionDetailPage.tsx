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
  FileText,
  ShieldCheck,
  ExternalLink,
  Globe
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
        eyebrow={`${competition.level.toUpperCase()} • ${competition.monthTag.toUpperCase()}`}
        title={competition.title}
        subtitle={competition.summary}
        compact={true}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/activities/cuoc-thi"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Quay lại danh sách Cuộc thi</span>
            </Link>

            {competition.infoUrl && (
              <a
                href={competition.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-xs font-bold text-white transition shadow-sm"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Link thông tin cụ thể</span>
              </a>
            )}

            {competition.externalRegUrl && (
              <a
                href={competition.externalRegUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#075985] hover:bg-sky-50 text-xs font-bold transition shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Link đăng ký / Mẫu hồ sơ</span>
              </a>
            )}
          </div>
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
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-sm backdrop-blur-md">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{competition.level}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/80 text-white shadow-sm backdrop-blur-md">
                  <span>{competition.monthTag}</span>
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-[#075985] shadow-sm backdrop-blur-md">
                  <Trophy className="h-3.5 w-3.5 text-[#0284C7]" />
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
                  <div className="text-slate-400 font-medium">Lĩnh vực &amp; Cấp hoạt động</div>
                  <div className="font-bold text-[#075985] text-sm">{competition.level}</div>
                  <div className="text-slate-600 leading-snug">{competition.field}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="text-slate-400 font-medium">Thông tin thời hạn</div>
                  <div className="font-bold text-[#10182D] text-sm">{competition.deadline}</div>
                  <div className="text-slate-600 leading-snug">{competition.deadlineDetails}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] shrink-0 border border-sky-100">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="text-slate-400 font-medium">Số lượng / Quy mô</div>
                  <div className="font-bold text-[#10182D] text-sm">{competition.teamsCount}</div>
                  <div className="text-slate-500 leading-snug">{competition.organizer}</div>
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
                <span>Thể lệ &amp; Lộ trình Chương trình / Cuộc thi</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {competition.timeline.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
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

          {/* Section 2: Cơ cấu giải thưởng & Quyền lợi */}
          <ScrollReveal direction="up" distance={20} delay={0.15} duration={0.6}>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#0284C7]" />
                <span>Giải thưởng &amp; Giá trị Tham dự</span>
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
                <span>Đối tượng &amp; Lĩnh vực Tham gia</span>
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

          {/* Official Links & Status Notice */}
          <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
            <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-[#075985]">
                <BookmarkCheck className="h-5 w-5 text-[#0284C7]" />
                <span>Liên kết Tài liệu &amp; Kênh Thông tin Chính thức</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có thể truy cập trực tiếp vào đường dẫn thông tin gốc hoặc biểu mẫu đăng ký / mẫu hồ sơ của Ban Tổ chức dưới đây:
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {competition.infoUrl && (
                  <a
                    href={competition.infoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition shadow-xs"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Mở Link thông tin cụ thể</span>
                  </a>
                )}

                {competition.externalRegUrl && (
                  <a
                    href={competition.externalRegUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0284C7] bg-white hover:bg-sky-50 text-[#0284C7] text-xs font-bold transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Mở Link đăng ký / Mẫu hồ sơ</span>
                  </a>
                )}
              </div>
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
