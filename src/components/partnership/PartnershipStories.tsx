// BK-IC Digital Hub — Verified Companion Project Track Record
// Real historical record: BK Shark 2026 Incubation & Top 7 Finalist Projects
import React from 'react';
import { Award, CheckCircle2, Trophy, Users, Presentation, Sparkles, ExternalLink } from 'lucide-react';
import { COMPANION_TRACK_RECORD } from '../../data/partnershipData';

export const PartnershipStories: React.FC = () => {
  const topProjects = [
    { name: 'DanangBooth', award: 'Quán quân', field: 'Du lịch thông minh & IoT', desc: 'Hệ sinh thái buồng chụp ảnh và quảng bá du lịch Đà Nẵng tích hợp công nghệ số.' },
    { name: '4Sight', award: 'Á quân', field: 'AI & Thị giác máy tính', desc: 'Giải pháp hỗ trợ thị giác nhân tạo ứng dụng AI cho người khiếm thị.' },
    { name: 'Kizuna Hub', award: 'Giải Ba', field: 'EdTech & Chuyển đổi số', desc: 'Nền tảng kết nối du học sinh và trao đổi văn hóa giáo dục đa quốc gia.' },
    { name: 'CarboX.MH', award: 'Top 7', field: 'Công nghệ Xanh & Môi trường', desc: 'Vật liệu hấp thụ carbon hiệu năng cao từ phế phẩm nông nghiệp.' },
    { name: 'DataStorm', award: 'Top 7', field: 'Fintech & Big Data', desc: 'Hệ thống phân tích và dự báo dữ liệu tài chính cho người trẻ.' },
    { name: 'Nexus & WaveX NextGen', award: 'Top 7', field: 'Phần cứng & IoT Tự động hóa', desc: 'Mạch điều khiển thông minh và module năng lượng thế hệ mới.' },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/20 to-white relative" id="track-record">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Award className="h-3.5 w-3.5" />
            <span>KẾT QUẢ ĐÃ XÁC NHẬN</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            {COMPANION_TRACK_RECORD.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {COMPANION_TRACK_RECORD.description}
          </p>
        </div>

        {/* Highlights & Training Outcomes Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100 text-center">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <div className="text-2xl sm:text-3xl font-black text-[#0284C7]">35 Đội thi</div>
              <div className="text-xs text-slate-600 mt-1">140+ sinh viên 6 trường ĐH</div>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <div className="text-2xl sm:text-3xl font-black text-[#075985]">4 Buổi Training</div>
              <div className="text-xs text-slate-600 mt-1">Chuyên gia &amp; Giảng viên đầu ngành</div>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <div className="text-2xl sm:text-3xl font-black text-[#38BDF8]">Top 7 Dự án</div>
              <div className="text-xs text-slate-600 mt-1">Vinh danh Sân khấu Chung kết</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#10182D] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0284C7]" />
              <span>Dấu ấn bồi dưỡng &amp; hỗ trợ chuyên môn thực tế</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPANION_TRACK_RECORD.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Projects Showcase */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>Tiêu biểu các dự án công nghệ trưởng thành từ vườn ươm</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">BK Shark 2026 Cohort</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProjects.map((p, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#38BDF8] hover:shadow-md transition-all space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#075985]">{p.name}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {p.award}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0284C7]">{p.field}</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
