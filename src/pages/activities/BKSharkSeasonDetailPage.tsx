// BK-IC BK Shark Season Detail Page — Authentic Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { BK_SHARK_SEASONS } from '../../data/activitiesData';
import { 
  Flame, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Users, 
  Building2, 
  ArrowLeft, 
  FileText,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';

export const BKSharkSeasonDetailPage: React.FC = () => {
  const { season } = useParams<{ season: string }>();

  const found = BK_SHARK_SEASONS.find((s) => s.season === season);
  const seasonData = found || BK_SHARK_SEASONS[0];

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'BK Shark', to: '/activities/bk-shark' },
          { label: `Mùa ${seasonData.year}` }
        ]}
        eyebrow={`BK SHARK • MÙA ${seasonData.year} • ĐÃ TRAO GIẢI CHUNG CUỘC`}
        title={`Chủ đề: ${seasonData.theme}`}
        subtitle={seasonData.summary}
        compact={true}
        actions={
          <Link
            to="/activities/bk-shark"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại sân khấu BK Shark</span>
          </Link>
        }
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl space-y-10">
        {/* Banner Cover Image & Metadata Highlights */}
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-md">
              <img
                src={seasonData.coverImage}
                alt={`BK Shark Mùa ${seasonData.year}`}
                className="w-full max-h-[460px] object-contain mx-auto"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-sm backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5" />
                  <span>SÂN KHẤU CHUNG KẾT PITCHING</span>
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-[#075985] shadow-sm backdrop-blur-md">
                  <span>{seasonData.date}</span>
                </span>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
                <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                  <Calendar className="h-4 w-4 text-[#0284C7]" />
                  <span>Thời gian Chung kết</span>
                </div>
                <div className="text-sm font-bold text-[#075985]">{seasonData.date}</div>
                <div className="text-xs text-slate-500">Trường ĐH Bách khoa – ĐHĐN</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
                <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                  <Users className="h-4 w-4 text-[#0284C7]" />
                  <span>Quy mô toàn thành phố</span>
                </div>
                <div className="text-sm font-bold text-[#075985]">35 Đội thi (140+ SV)</div>
                <div className="text-xs text-slate-500">Từ 6 trường đại học tại Đà Nẵng</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
                <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                  <Trophy className="h-4 w-4 text-[#0284C7]" />
                  <span>Vòng Chung kết</span>
                </div>
                <div className="text-sm font-bold text-[#0284C7]">Top 7 Dự án xuất sắc</div>
                <div className="text-xs text-slate-500">Tranh tài trực tiếp trước Ban Giám khảo</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
                <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                  <Building2 className="h-4 w-4 text-[#0284C7]" />
                  <span>Đơn vị tổ chức</span>
                </div>
                <div className="text-sm font-bold text-[#075985]">Đoàn TN – Hội SV &amp; BK-IC</div>
                <div className="text-xs text-slate-500">Trường ĐH Bách khoa – ĐHĐN</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Area */}
        <ScrollReveal direction="up" distance={20} delay={0.15} duration={0.6}>
          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            {/* Section 1: Overview */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#10182D] flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#0284C7]" />
                <span>Diễn biến Sân khấu Chung kết Mùa {seasonData.year}</span>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Diễn ra trong khuôn khổ Ngày hội "Khoa học Công nghệ, Khởi nghiệp và Đổi mới sáng tạo BKDN 2026", Vòng Chung kết BK SHARK 2026 đã chứng kiến màn tranh tài kịch tính của 7 đội thi xuất sắc nhất. Các đội đã tự tin thuyết trình giải pháp, phản biện sắc bén trước Hội đồng Ban Giám khảo gồm các chuyên gia từ Trung tâm Hỗ trợ Khởi nghiệp Đổi mới Sáng tạo Đà Nẵng, Vườn ươm Sông Hàn (SHi) và Danang Fintech Lab.
              </p>
            </div>

            {/* Section 2: Dấu ấn Mùa giải */}
            <div className="p-6 rounded-3xl border border-sky-100 bg-sky-50/50 space-y-3">
              <h3 className="text-sm font-bold text-[#075985] uppercase tracking-wider">
                Dấu ấn Nổi bật Mùa Giải 2026
              </h3>
              <ul className="space-y-2">
                {seasonData.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Pitched Projects Showcase */}
            {seasonData.finalists && seasonData.finalists.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                    Vinh Danh Chung Cuộc
                  </span>
                  <h3 className="text-xl font-bold text-[#10182D]">
                    Top 7 Dự Án Tranh Tài Tại Sân Khấu Chung Kết BK SHARK 2026
                  </h3>
                </div>

                <div className="space-y-4">
                  {seasonData.finalists.map((project, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-3xl border ${
                        idx === 0
                          ? 'border-amber-300 bg-gradient-to-r from-amber-50/80 via-white to-sky-50/40 shadow-sm'
                          : idx === 1
                          ? 'border-slate-300 bg-gradient-to-r from-slate-50 via-white to-sky-50/20 shadow-2xs'
                          : idx === 2
                          ? 'border-orange-200 bg-gradient-to-r from-orange-50/60 via-white to-white shadow-2xs'
                          : 'border-slate-200/80 bg-white shadow-2xs'
                      } space-y-3`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {project.rank && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                idx === 0
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : idx === 1
                                  ? 'bg-slate-200 text-slate-700 border border-slate-300'
                                  : idx === 2
                                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                  : 'bg-sky-50 text-[#0284C7] border border-sky-100'
                              }`}
                            >
                              <Trophy className="h-3.5 w-3.5" />
                              <span>{project.rank}</span>
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-500">
                            {project.institution}
                          </span>
                        </div>

                        {project.prizeMoney && (
                          <span className="text-xs sm:text-sm font-bold text-[#075985]">
                            {project.prizeMoney}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug">
                        {project.projectTitle}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {project.summary}
                      </p>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400">Lĩnh vực:</span>
                        <span className="font-semibold text-[#0284C7]">{project.field}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
          <Link
            to="/activities/bk-shark"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả các mùa BK Shark</span>
          </Link>
          <Link
            to="/activities/tuyen-thanh-vien"
            className="text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
          >
            Tìm hiểu Tuyển thành viên mới →
          </Link>
        </div>
      </PageContentCanvas>
    </div>
  );
};

export default BKSharkSeasonDetailPage;
