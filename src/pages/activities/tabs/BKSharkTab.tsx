// BK-IC Tab 5: BK Shark Pitching Stage
// Cosmic dark stage hero, 5-stage participant roadmap, mentor council & past seasons
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { GlowingLightTrails } from '../../../components/effects/GlowingLightTrails';
import { TechGridParticles } from '../../../components/effects/TechGridParticles';
import { PartnershipRequestModal } from '../../../components/activities/PartnershipRequestModal';
import { 
  BK_SHARK_SEASONS, 
  SHARK_STAGES_TIMELINE, 
  SHARK_MENTORS, 
  type SharkSeasonItem 
} from '../../../data/activitiesData';
import { 
  Flame, 
  Trophy, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const BKSharkTab: React.FC = () => {
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: BK SHARK HERO STAGE (COSMIC NAVY SPECIAL ACCENT) */}
      <ScrollReveal direction="up" distance={20} duration={0.65}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#050814] via-[#0A1432] to-[#070D22] text-white p-8 sm:p-12 lg:p-16 border border-sky-500/20 shadow-2xl">
          {/* Subtle Tech Grid */}
          <TechGridParticles density="subtle" showParticles={true} />

          {/* Spotlight & Glowing Trails */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#38BDF8]/25 via-[#0284C7]/15 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 pointer-events-none opacity-45">
            <GlowingLightTrails variant="hero-flow" />
          </div>

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-sky-200 backdrop-blur-md shadow-xs">
              <Flame className="h-4 w-4 text-[#38BDF8] animate-pulse" />
              <span>SÂN KHẤU PITCHING & GỌI VỐN ĐỈNH CAO • BK-IC</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white sm:whitespace-nowrap">
              Ý tưởng lớn.{' '}
              <span className="bg-gradient-to-r from-[#38BDF8] via-[#BAE6FD] to-white bg-clip-text text-transparent">
                Sân khấu lớn.
              </span>{' '}
              Cơ hội lớn.
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              BK Shark là sự kiện biểu trưng của BK-IC – nơi những công trình nghiên cứu và dự án sinh viên bước ra ánh sáng, trực tiếp đối thoại, phản biện và thuyết phục hội đồng chuyên gia, cựu sinh viên doanh nhân để đón nhận các gói bảo trợ ươm tạo hạt giống.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/activities/bk-shark/2026"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-bold text-xs hover:opacity-95 transition shadow-lg shadow-sky-500/20"
              >
                <span>Khám phá Mùa giải 2026</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsInvestorModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-slate-200 font-semibold text-xs hover:bg-white/20 hover:text-white transition backdrop-blur-md"
              >
                <span>Đăng ký tham gia Hội đồng Shark / Mentor</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 2: HÀNH TRÌNH THAM GIA PITCHING (5 GIAI ĐOẠN) */}
      <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Lộ Trình Sân Khấu
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Hành trình Từ Giảng đường đến Vòng Pitching
            </h3>
            <p className="text-xs text-slate-500">
              Quy trình 5 bước tuyển chọn và thẩm định chặt chẽ nhằm đảm bảo tính khả thi công nghệ và năng lực đội ngũ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SHARK_STAGES_TIMELINE.map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-md transition space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs border border-sky-100">
                    {item.step}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#10182D] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#5E6573] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: HỘI ĐỒNG CỐ VẤN & CHUYÊN GIA */}
      <ScrollReveal direction="up" distance={20} delay={0.12} duration={0.6}>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Hội Đồng Độc Lập
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Hội đồng Chuyên gia & Cố vấn Đồng hành
              </h3>
            </div>
            <span className="text-xs text-slate-500">Thẩm định học thuật và mô hình kinh doanh</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SHARK_MENTORS.map((m, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 hover:bg-white hover:border-[#38BDF8] hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 text-[#0284C7] font-bold text-sm flex items-center justify-center">
                    {m.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#10182D]">{m.name}</h5>
                    <span className="text-xs text-[#0284C7] font-medium">{m.role}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/70 text-xs space-y-0.5 text-slate-600">
                  <p className="text-[11px] text-slate-400 font-medium">{m.org}</p>
                  <p className="font-semibold text-slate-700">Chuyên môn: {m.field}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 4: CÁC MÙA GIẢI BK SHARK & DỰ ÁN TIÊU BIỂU */}
      <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Lịch Sử Các Mùa Giải
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Danh mục Các Mùa Sân Khấu BK Shark
            </h3>
            <p className="text-xs text-slate-500">
              Khám phá danh sách các đội thi, tổng mức cam kết vốn và dấu ấn của từng mùa giải.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BK_SHARK_SEASONS.map((season) => (
              <div
                key={season.season}
                className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#10182D] text-white">
                      MÙA {season.year}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      • Đã trao giải chung cuộc
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                    <Link to={`/activities/bk-shark/${season.season}`}>
                      Chủ đề: {season.theme}
                    </Link>
                  </h4>

                  <p className="text-xs text-[#5E6573] leading-relaxed">
                    {season.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Quy mô</span>
                      <span className="font-bold text-[#075985] text-xs sm:text-sm">35 Đội thi (140+ SV)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Vòng Chung kết</span>
                      <span className="font-bold text-[#0284C7] text-xs sm:text-sm">Top 7 Đội tranh tài</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{season.date}</span>
                  <Link
                    to={`/activities/bk-shark/${season.season}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    <span>Xem kết quả &amp; Top 7 dự án</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Upcoming Season Card */}
            <div className="group flex flex-col justify-between h-full rounded-3xl border border-dashed border-sky-300 bg-gradient-to-br from-sky-50/50 via-white to-blue-50/30 p-6 sm:p-7 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white">
                    MÙA TIẾP THEO
                  </span>
                  <span className="text-[11px] font-semibold text-[#0284C7] bg-sky-100/70 px-2.5 py-0.5 rounded-full border border-sky-200">
                    • Đang chuẩn bị khởi động
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug">
                  BK SHARK: Đấu trường Khởi nghiệp Sinh viên Bách khoa
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Mùa giải mới hứa hẹn tiếp tục mở rộng quy mô, nâng cao chất lượng các chuỗi huấn luyện chuyên sâu và kết nối các quỹ đầu tư mạo hiểm đồng hành cùng sinh viên.
                </p>

                <div className="p-3.5 rounded-2xl bg-white border border-sky-100 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-[#075985] block">Dành cho Nhà đầu tư &amp; Cố vấn:</span>
                  <p className="text-[11px] text-slate-500">
                    Quý doanh nghiệp và cựu sinh viên quan tâm đồng hành bảo trợ giải thưởng hoặc tham gia Hội đồng Giám khảo có thể gửi đề xuất hợp tác ngay hôm nay.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Dự kiến phát động 2027</span>
                <button
                  onClick={() => setIsInvestorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
                >
                  <span>Đăng ký Đồng hành</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Investor / Mentor Modal */}
      <PartnershipRequestModal
        isOpen={isInvestorModalOpen}
        onClose={() => setIsInvestorModalOpen(false)}
        defaultType="program_sponsor"
      />
    </div>
  );
};

export default BKSharkTab;

