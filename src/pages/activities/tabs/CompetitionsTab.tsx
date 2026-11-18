// BK-IC Tab 3: Cuộc thi sáng tạo (Competitions)
// Featured competition card with countdown, competition grid, live registration & hall of fame
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { ActivityCountdown } from '../../../components/activities/ActivityCountdown';
import { CompetitionRegisterModal } from '../../../components/activities/CompetitionRegisterModal';
import { 
  COMPETITIONS_DATA, 
  COMPETITION_HALL_OF_FAME, 
  type CompetitionDetailItem 
} from '../../../data/activitiesData';
import { 
  Award, 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Inbox,
  Search
} from 'lucide-react';

export const CompetitionsTab: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringComp, setRegisteringComp] = useState<CompetitionDetailItem | null>(null);

  const featuredComp = COMPETITIONS_DATA.find((c) => c.featured) || COMPETITIONS_DATA[0];

  const filteredCompetitions = COMPETITIONS_DATA.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: CUỘC THI NỔI BẬT & COUNTDOWN */}
      {featuredComp && (
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/50 p-6 sm:p-8 lg:p-10 shadow-md shadow-sky-500/5 hover:border-[#38BDF8] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Image Cover & Prize Tag */}
              <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-sm aspect-16/10 lg:aspect-4/3 bg-slate-100">
                <img
                  src={featuredComp.coverImage}
                  alt={featuredComp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-xs">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>CUỘC THI TRỌNG ĐIỂM</span>
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#075985] shadow-xs backdrop-blur-md">
                    <span>Tổng giải: {featuredComp.prizePool}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Title, Countdown & Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-[#075985] font-bold">
                    {featuredComp.field}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    • {featuredComp.teamsCount}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10182D] leading-snug">
                  {featuredComp.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {featuredComp.summary}
                </p>

                {/* Countdown Timer */}
                <div className="pt-1">
                  <ActivityCountdown
                    deadlineIso={featuredComp.deadlineIso}
                    label={`Hạn nộp hồ sơ: ${featuredComp.deadline}`}
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {featuredComp.registrationOpen ? (
                    <button
                      onClick={() => setRegisteringComp(featuredComp)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Đăng ký Đội thi ngay</span>
                    </button>
                  ) : null}

                  <Link
                    to={`/activities/competitions/${featuredComp.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                  >
                    <span>Xem thể lệ & Cơ cấu giải</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* SECTION 2: DANH SÁCH CUỘC THI & BỘ LỌC */}
      <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filter === 'all'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({COMPETITIONS_DATA.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filter === 'active'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Đang diễn ra
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filter === 'upcoming'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sắp mở
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filter === 'completed'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Đã kết thúc
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm cuộc thi, lĩnh vực..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          {filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-100">
                        {comp.field}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          comp.status === 'active'
                            ? 'text-emerald-600'
                            : comp.status === 'upcoming'
                            ? 'text-sky-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {comp.status === 'active'
                          ? '• Đang nhận hồ sơ'
                          : comp.status === 'upcoming'
                          ? '• Sắp mở'
                          : '• Đã trao giải'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                      <Link to={`/activities/competitions/${comp.slug}`}>
                        {comp.title}
                      </Link>
                    </h4>

                    {/* Summary */}
                    <p className="text-xs text-[#5E6573] leading-relaxed line-clamp-3">
                      {comp.summary}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Giải thưởng:</span>
                        <span className="font-bold text-[#0284C7]">{comp.prizePool}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Hạn chót:</span>
                        <span>{comp.deadline}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quy mô:</span>
                        <span>{comp.teamsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/activities/competitions/${comp.slug}`}
                      className="text-xs font-semibold text-[#0284C7] hover:underline"
                    >
                      Thể lệ & Giải thưởng
                    </Link>

                    {comp.registrationOpen ? (
                      <button
                        onClick={() => setRegisteringComp(comp)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                      >
                        <span>Đăng ký</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Đã đóng
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
              <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Không tìm thấy cuộc thi phù hợp</h4>
              <p className="text-xs text-slate-500">
                Hãy thử chọn tiêu chí khác để xem các sân chơi công nghệ khác.
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* SECTION 5: DẤU ẤN CUỘC THI & THÀNH TÍCH (HALL OF FAME) */}
      <ScrollReveal direction="up" distance={20} delay={0.14} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Bảng Vàng Vinh Danh
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Dấu ấn Thành tích Sinh viên Bách khoa
            </h3>
            <p className="text-xs text-slate-500">
              Ghi nhận các dự án và đội thi xuất sắc trưởng thành từ hệ sinh thái đổi mới sáng tạo BK-IC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COMPETITION_HALL_OF_FAME.map((fame, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Trophy className="h-3.5 w-3.5 text-amber-600" />
                    <span>{fame.award}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{fame.teamName}</span>
                </div>

                <h4 className="text-base font-bold text-[#075985]">
                  {fame.project}
                </h4>

                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Cuộc thi:</span> {fame.contest}
                </p>

                <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <span className="font-semibold text-slate-600">Thành viên nòng cốt:</span> {fame.members}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Competition Register Modal */}
      {registeringComp && (
        <CompetitionRegisterModal
          isOpen={!!registeringComp}
          onClose={() => setRegisteringComp(null)}
          competitionId={registeringComp.id}
          competitionTitle={registeringComp.title}
        />
      )}
    </div>
  );
};

export default CompetitionsTab;

