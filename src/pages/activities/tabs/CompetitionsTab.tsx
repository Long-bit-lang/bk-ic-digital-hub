// BK-IC Tab 3: Cuộc thi sáng tạo (Competitions & Innovation Programs)
// Displays BK-IC flagship competitions, aggregated innovation competitions (Tháng 9 & Tháng 10/2026), filters by month & level, external info/registration links & Hall of Fame
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { ActivityCountdown } from '../../../components/activities/ActivityCountdown';
import { CompetitionRegisterModal } from '../../../components/activities/CompetitionRegisterModal';
import {
  COMPETITIONS_DATA,
  COMPETITION_HALL_OF_FAME,
  type CompetitionDetailItem,
  type CompetitionLevel
} from '../../../data/activitiesData';
import {
  Award,
  Trophy,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Inbox,
  Search,
  ExternalLink,
  FileText,
  Globe,
  Clock
} from 'lucide-react';

const LEVEL_BADGE_STYLES: Record<CompetitionLevel, string> = {
  'Quốc Tế': 'bg-purple-50 text-purple-700 border-purple-200',
  'Quốc Gia': 'bg-rose-50 text-rose-700 border-rose-200',
  'Thành Phố': 'bg-sky-50 text-[#0284C7] border-sky-200',
  'Cấp ĐHĐN': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Cấp Trường': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cấp Phường': 'bg-amber-50 text-amber-700 border-amber-200'
};

export const CompetitionsTab: React.FC = () => {
  const [groupFilter, setGroupFilter] = useState<'all' | 'club' | 'thang-9' | 'thang-10-11'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringComp, setRegisteringComp] = useState<CompetitionDetailItem | null>(null);

  const featuredComp = COMPETITIONS_DATA.find((c) => c.featured) || COMPETITIONS_DATA[0];

  const filteredCompetitions = COMPETITIONS_DATA.filter((c) => {
    const matchGroup =
      groupFilter === 'all' ||
      (groupFilter === 'club' && c.isClubOrganized) ||
      (groupFilter === 'thang-9' && c.monthTag === 'Tháng 9/2026') ||
      (groupFilter === 'thang-10-11' && (c.monthTag === 'Tháng 10/2026' || c.monthTag === 'Tháng 11/2026'));

    const matchLevel =
      levelFilter === 'all' ||
      (levelFilter === 'local'
        ? ['Cấp ĐHĐN', 'Cấp Trường', 'Cấp Phường'].includes(c.level)
        : c.level === levelFilter);

    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.field.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.organizer.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q);

    return matchGroup && matchLevel && matchSearch;
  });

  const clubCount = COMPETITIONS_DATA.filter((c) => c.isClubOrganized).length;
  const thang9Count = COMPETITIONS_DATA.filter((c) => c.monthTag === 'Tháng 9/2026').length;
  const thang10Count = COMPETITIONS_DATA.filter(
    (c) => c.monthTag === 'Tháng 10/2026' || c.monthTag === 'Tháng 11/2026'
  ).length;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: CUỘC THI TRỌNG ĐIỂM DO CLB BK-IC TỔ CHỨC & ĐỒNG HÀNH */}
      {featuredComp && (
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/50 p-6 sm:p-8 lg:p-10 shadow-md shadow-sky-500/5 hover:border-[#38BDF8] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Image Cover, Prize Tag & Registration Deadline */}
              <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-sm aspect-16/10 lg:aspect-4/3 bg-slate-100">
                <img
                  src={featuredComp.coverImage}
                  alt={featuredComp.title}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-xs">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>CUỘC THI TRỌNG ĐIỂM BK-IC</span>
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#075985] shadow-xs">
                    {featuredComp.level}
                  </span>
                </div>
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-700 shadow-xs backdrop-blur-md">
                    <Calendar className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>{featuredComp.monthTag}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7]/95 text-white shadow-xs backdrop-blur-md">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{featuredComp.prizePool}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Title, Field & Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    • {featuredComp.status === 'completed' ? 'Đã kết thúc' : featuredComp.status === 'active' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    • {featuredComp.teamsCount}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10182D] leading-snug">
                  {featuredComp.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {featuredComp.summary}
                </p>

                <div className="text-xs sm:text-sm font-semibold text-[#0284C7] flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-normal">Lĩnh vực:</span>
                  <span className="text-slate-700 font-bold">{featuredComp.field}</span>
                </div>

                {/* Countdown Timer hoặc Thông báo kết thúc */}
                <div className="pt-1">
                  {featuredComp.status === 'completed' ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Mùa giải 2026 đã tổ chức thành công tốt đẹp (60% dự án có giảng viên hướng dẫn)</span>
                    </div>
                  ) : (
                    <ActivityCountdown
                      deadlineIso={featuredComp.deadlineIso}
                      label={`Hạn nộp hồ sơ: ${featuredComp.deadline}`}
                    />
                  )}
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
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                  >
                    <span>Xem thể lệ &amp; Kết quả</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {featuredComp.infoUrl && (
                    <a
                      href={featuredComp.infoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:border-[#0284C7] hover:text-[#0284C7] transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Bài viết chính thức</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* SECTION 2: CỔNG TỔNG HỢP CUỘC THI & CHƯƠNG TRÌNH SÁNG TẠO (THÁNG 9, THÁNG 10 & TOÀN NĂM) */}
      <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
        <div className="space-y-6">
          {/* Section Title */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cổng Cơ hội Học thuật &amp; Khởi nghiệp 2026</span>
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10182D]">
              Danh mục Chương trình &amp; Cuộc thi Đổi mới Sáng tạo
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Tổng hợp các cuộc thi do BK-IC trực tiếp đồng tổ chức cùng các sân chơi công nghệ, AI, STEAM và khởi nghiệp cấp Trường, Thành phố, Quốc gia và Quốc tế dành cho sinh viên Bách khoa.
            </p>
          </div>

          {/* Filter Bar: Group Tabs + Level Pills + Search */}
          <div className="space-y-3 border-b border-slate-200/80 pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Group / Month Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <button
                  onClick={() => setGroupFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    groupFilter === 'all'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({COMPETITIONS_DATA.length})
                </button>
                <button
                  onClick={() => setGroupFilter('club')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    groupFilter === 'club'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  CLB Đồng tổ chức ({clubCount})
                </button>
                <button
                  onClick={() => setGroupFilter('thang-9')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    groupFilter === 'thang-9'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Đợt Tháng 9 ({thang9Count})
                </button>
                <button
                  onClick={() => setGroupFilter('thang-10-11')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    groupFilter === 'thang-10-11'
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Đợt Tháng 10 – 11 ({thang10Count})
                </button>
              </div>

              {/* Search Input */}
              <div className="relative max-w-xs w-full">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm tên cuộc thi, AI, STEAM, cấp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            {/* Secondary Filter: Cấp Hoạt Động */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">Cấp hoạt động:</span>
              {[
                { key: 'all', label: 'Tất cả cấp' },
                { key: 'Quốc Tế', label: 'Quốc Tế' },
                { key: 'Quốc Gia', label: 'Quốc Gia' },
                { key: 'Thành Phố', label: 'Thành Phố' },
                { key: 'local', label: 'Cấp ĐHĐN / Trường / Phường' }
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  onClick={() => setLevelFilter(lvl.key)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition ${
                    levelFilter === lvl.key
                      ? 'bg-sky-50 text-[#0284C7] border-[#38BDF8] font-bold'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Competition Cards Grid */}
          {filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Cover Image with Status, Level & Deadline Badges */}
                    <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 shadow-2xs group/img">
                      <img
                        src={comp.coverImage}
                        alt={comp.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

                      {/* Top Badges: Month & Club Organized / Level */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-xs">
                            {comp.monthTag}
                          </span>
                          {comp.isClubOrganized && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0284C7] text-white shadow-xs">
                              BK-IC Tổ chức
                            </span>
                          )}
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${
                            LEVEL_BADGE_STYLES[comp.level] || 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <Globe className="h-3 w-3" />
                          <span>{comp.level}</span>
                        </span>
                      </div>

                      {/* Bottom Badges: Hạn & Giải thưởng */}
                      <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-700 shadow-xs backdrop-blur-md">
                          <Calendar className="h-3 w-3 text-[#0284C7]" />
                          <span>Hạn: {comp.deadline}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0284C7]/95 text-white shadow-xs backdrop-blur-md truncate max-w-[58%]">
                          <Trophy className="h-3 w-3 shrink-0" />
                          <span className="truncate">{comp.prizePool}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                      <Link to={`/activities/competitions/${comp.slug}`}>
                        {comp.title}
                      </Link>
                    </h4>

                    {/* Lĩnh vực */}
                    <div className="text-xs text-[#0284C7] font-semibold flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 font-normal">Lĩnh vực:</span>
                      <span className="text-[#075985] font-bold bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                        {comp.field}
                      </span>
                    </div>

                    {/* Sơ bộ về cuộc thi / chương trình */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {comp.summary}
                    </p>

                    {/* Metadata Box: Thời hạn chi tiết & Số lượng */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700">Thông tin thời hạn: </span>
                          <span>{comp.deadlineDetails}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700">Số lượng / Quy mô: </span>
                          <span className="font-medium text-slate-800">{comp.teamsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer: Link thông tin cụ thể, Link đăng ký, Chi tiết */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={`/activities/competitions/${comp.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
                    >
                      <span>Xem thể lệ &amp; Chi tiết</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                      {comp.infoUrl && (
                        <a
                          href={comp.infoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] text-[11px] font-semibold border border-slate-200/80 transition"
                          title="Mở link thông tin cụ thể"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Thông tin cụ thể</span>
                        </a>
                      )}

                      {comp.externalRegUrl && (
                        <a
                          href={comp.externalRegUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white text-[11px] font-bold border border-sky-200 transition"
                          title="Mở link đăng ký / mẫu hồ sơ"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Link đăng ký / Hồ sơ</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
              <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Không tìm thấy cuộc thi hoặc chương trình phù hợp</h4>
              <p className="text-xs text-slate-500">
                Hãy thử chọn đợt tháng hoặc cấp hoạt động khác để xem toàn bộ danh sách.
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* SECTION 3: DẤU ẤN CUỘC THI & THÀNH TÍCH (HALL OF FAME) */}
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

          {COMPETITION_HALL_OF_FAME.length > 0 ? (
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
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-8 sm:p-12 text-center space-y-3">
              <div className="p-3 bg-white w-fit mx-auto rounded-2xl shadow-xs border border-slate-200">
                <Trophy className="h-6 w-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Dữ liệu Bảng vàng Thành tích đang được cập nhật</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Thông tin vinh danh các đội thi xuất sắc, dự án đạt giải tại các đấu trường khởi nghiệp và đổi mới sáng tạo sẽ được Ban Tổ chức công bố chính thức tại đây.
              </p>
            </div>
          )}
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
