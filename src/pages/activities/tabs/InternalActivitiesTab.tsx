// BK-IC Tab 1: Sinh hoạt nội bộ (Internal Activities)
// Displays culture, recurring Tuesday sessions, weekly session logs (Tuần 1 - Tuần 7), meeting workflow & photo album
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../context/AppContext';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { ImageLightboxModal } from '../../../components/common/ImageLightboxModal';
import { 
  RECURRING_TUESDAY_SCHEDULE, 
  SESSION_TIMELINE_STEPS, 
  WEEKLY_INTERNAL_SESSIONS,
  CLUB_MILESTONE_ACTIVITIES,
  type InternalGalleryItem,
  type WeeklySessionRecap,
  type ClubMilestoneActivity
} from '../../../data/activitiesData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  ZoomIn, 
  ChevronRight, 
  BookOpen,
  Building2,
  Award
} from 'lucide-react';

export const InternalActivitiesTab: React.FC = () => {
  const { sessions } = useApp();
  const [selectedImage, setSelectedImage] = useState<InternalGalleryItem | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<WeeklySessionRecap | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<ClubMilestoneActivity | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWeek(null);
        setSelectedMilestone(null);
      }
    };
    if (selectedWeek || selectedMilestone) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedWeek, selectedMilestone]);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: GIỚI THIỆU VĂN HÓA SINH HOẠT */}
      <ScrollReveal direction="up" distance={20} duration={0.6}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-100 uppercase tracking-wide">
              <Users className="h-3.5 w-3.5" />
              <span>Văn hóa & Đời sống Nội bộ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#075985] tracking-tight leading-tight">
              Cùng nhau học hỏi, gắn kết và phát triển
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Các buổi sinh hoạt nội bộ là nhịp đập của BK-IC – nơi các thành viên từ Ban Chủ nhiệm, Ban Điều hành đến Ban Thành viên cùng ngồi lại, tổng kết hoạt động đã qua, chia sẻ kiến thức thực tiễn và triển khai những định hướng bứt phá tiếp theo.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl border border-sky-200/80 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                <QrCode className="h-4 w-4" />
                <span>Số hóa Điểm danh</span>
              </div>
              <h4 className="text-base font-bold text-[#10182D]">Điểm danh QR Code Thời gian thực</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mỗi buổi sinh hoạt áp dụng mã QR động tự đổi mới định kỳ, tích hợp hệ thống điểm danh số hóa Version 1 do chính các thành viên BK-IC nghiên cứu và phát triển.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Bảo mật dữ liệu nhân sự tuyệt đối</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 2: LỊCH SINH HOẠT ĐỊNH KỲ THỨ BA */}
      <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs hover:border-[#38BDF8] transition space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Lịch trình Cố định
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Sinh hoạt Định kỳ Chiều thứ Ba Hàng tuần
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Định kỳ hàng tuần</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
                <Calendar className="h-4 w-4 text-[#0284C7]" />
                <span>Thời gian định kỳ</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">{RECURRING_TUESDAY_SCHEDULE.dayOfWeek}</div>
              <div className="text-xs text-slate-500">Khung giờ: {RECURRING_TUESDAY_SCHEDULE.timeRange}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
                <MapPin className="h-4 w-4 text-[#0284C7]" />
                <span>Địa điểm sinh hoạt</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">Phòng A136</div>
              <div className="text-xs text-slate-500 truncate" title={RECURRING_TUESDAY_SCHEDULE.location}>
                Trường Đại học Bách khoa (DUT)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
                <Users className="h-4 w-4 text-[#0284C7]" />
                <span>Đối tượng tham dự</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">Toàn thể Thành viên</div>
              <div className="text-xs text-slate-500">Ban Chủ nhiệm, BĐH, BTV</div>
            </div>
          </div>

          {/* Cancellation Notice Policy */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Lưu ý điều chỉnh lịch:</span> {RECURRING_TUESDAY_SCHEDULE.description}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: QUY TRÌNH MỘT BUỔI SINH HOẠT CHUẨN */}
      <ScrollReveal direction="up" distance={20} delay={0.12} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Trình tự Hoạt động
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Quy trình Một Buổi Sinh hoạt Chuẩn mực
            </h3>
            <p className="text-xs text-slate-500">
              Quy trình chuẩn gồm 4 bước liền mạch giúp tối ưu hóa thời gian và nâng cao hiệu quả làm việc nhóm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SESSION_TIMELINE_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-md transition space-y-3 h-full flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="h-8 w-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs border border-sky-100">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{step.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#10182D] leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#5E6573] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3.5: 6 CỘT MỐC HOẠT ĐỘNG & SỰ KIỆN TRỌNG TÂM NĂM 2026 (TỪ SHEET HOẠT ĐỘNG CLB) */}
      <ScrollReveal direction="up" distance={20} delay={0.14} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                <span>Hành trình Phát triển &amp; Sự kiện Lớn 2026</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                6 Cột mốc Hoạt động &amp; Sự kiện Trọng tâm của CLB BK-IC
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Bấm vào từng sự kiện để xem đơn vị phối hợp, nội dung triển khai và kết quả đạt được.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLUB_MILESTONE_ACTIVITIES.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone)}
                className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{milestone.timeframe}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {milestone.category}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-extrabold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                    {milestone.title}
                  </h4>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700">Đơn vị chủ trì &amp; Phối hợp: </span>
                        <span className="line-clamp-2">{milestone.organizersAndPartners.join(' • ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="font-bold text-[#075985] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Kết quả &amp; Giá trị thu về:</span>
                    </div>
                    <ul className="space-y-1 pl-1">
                      {milestone.outcomesAndValue.slice(0, 2).map((out, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0284C7]">
                  <span>Xem chi tiết công tác tổ chức &amp; kết quả</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 4: NHẬT KÝ SINH HOẠT TỪNG TUẦN */}
      <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Nhật ký Hoạt động Thực tế
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Nhật ký Sinh hoạt Từng tuần
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Bấm vào từng tuần để xem chi tiết nội dung, hình ảnh và kết quả đạt được.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEEKLY_INTERNAL_SESSIONS.map((week) => {
              const isCancelled = week.status === 'cancelled';

              return (
                <div
                  key={week.id}
                  onClick={() => setSelectedWeek(week)}
                  className={`group cursor-pointer rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isCancelled
                      ? 'border-rose-200 bg-rose-50/30 hover:border-rose-300 hover:shadow-md'
                      : 'border-slate-200/90 bg-white hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {/* Cover Image Thumbnail with Overlay Badge */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={week.coverImage}
                        alt={week.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#075985] shadow-xs backdrop-blur-md">
                          Tuần {week.weekNumber < 10 ? `0${week.weekNumber}` : week.weekNumber}
                        </span>
                        {isCancelled ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs">
                            Tạm hoãn
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                            Đã diễn ra
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#0284C7]" />
                          <span>{week.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 text-[#0284C7]" />
                          <span className="truncate">{week.location}</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-[#10182D] group-hover:text-[#0284C7] transition-colors leading-snug line-clamp-2">
                        {week.title}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {week.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                    <span>Xem nội dung chi tiết</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* MODAL 1: CHI TIẾT NỘI DUNG BUỔI SINH HOẠT THEO TUẦN (EDITORIAL FRAMED READER) */}
      {selectedWeek && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/85 backdrop-blur-md transition-all duration-200 overflow-y-auto"
          onClick={() => setSelectedWeek(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-week-title"
        >
          <div 
            className="relative w-full max-w-4xl my-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Meta Header Bar (No top-right close button, clean aesthetic) */}
            <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-xs">
                  Tuần {selectedWeek.weekNumber < 10 ? `0${selectedWeek.weekNumber}` : selectedWeek.weekNumber}
                </span>
                {selectedWeek.status === 'cancelled' ? (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    Tạm hoãn
                  </span>
                ) : (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Đã diễn ra
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-500">
                  {selectedWeek.date}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {selectedWeek.location}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                BK-IC Digital Hub
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
              {/* Title & Headline Section */}
              <div className="space-y-3">
                <h3 id="modal-week-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#075985] tracking-tight leading-tight">
                  {selectedWeek.title}
                </h3>
                {selectedWeek.subtitle && (
                  <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                    {selectedWeek.subtitle}
                  </p>
                )}

                {/* Meta Badge Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Calendar className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span className="font-semibold">{selectedWeek.date}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Clock className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>17:30 – 19:00</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>{selectedWeek.location}</span>
                  </div>
                </div>
              </div>

              {/* Photo Showcase Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-md group">
                <img
                  src={selectedWeek.coverImage}
                  alt={selectedWeek.title}
                  className="w-full max-h-[440px] sm:max-h-[520px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                />
                
                {/* Floating Zoom Action Pill */}
                <button
                  onClick={() => setSelectedImage({
                    id: selectedWeek.id,
                    imageUrl: selectedWeek.coverImage,
                    title: selectedWeek.title,
                    caption: selectedWeek.summary,
                    category: `Sinh hoạt Tuần ${selectedWeek.weekNumber}`,
                    date: selectedWeek.date
                  })}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-md hover:bg-[#0284C7] transition cursor-pointer shadow-md"
                >
                  <ZoomIn className="h-4 w-4" />
                  <span>Phóng to ảnh</span>
                </button>
              </div>

              {/* Cancellation Alert Box if Canceled */}
              {selectedWeek.status === 'cancelled' && selectedWeek.cancellationReason && (
                <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900 space-y-1.5">
                  <div className="font-bold text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>Thông báo tạm hoãn từ Ban Chủ nhiệm</span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-800 leading-relaxed pl-6">
                    {selectedWeek.cancellationReason}
                  </p>
                </div>
              )}

              {/* Highlights Box */}
              {selectedWeek.highlights.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50 border border-sky-100 shadow-xs space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Nội dung Trọng tâm &amp; Điểm nhấn Buổi sinh hoạt</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedWeek.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Recap Content Frame */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <BookOpen className="h-4 w-4 text-[#0284C7]" />
                  <span>Nội dung Chi tiết &amp; Bài viết Recap</span>
                </div>
                <div className="space-y-4 text-xs sm:text-[15px] text-slate-700 leading-relaxed font-normal border-l-2 border-[#38BDF8] pl-4 sm:pl-5">
                  {selectedWeek.fullContent.map((paragraph, idx) => (
                    <p key={idx} className="text-justify">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 text-center sm:text-left">
                CLB Khởi nghiệp &amp; Đổi mới Sáng tạo BK-IC • Trường ĐH Bách khoa – ĐHĐN
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedWeek(null)}
                  className="px-8 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 1B: CHI TIẾT CỘT MỐC HOẠT ĐỘNG & SỰ KIỆN TRỌNG TÂM 2026 */}
      {selectedMilestone && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/85 backdrop-blur-md transition-all duration-200 overflow-y-auto"
          onClick={() => setSelectedMilestone(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-milestone-title"
        >
          <div
            className="relative w-full max-w-4xl my-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Meta Header Bar */}
            <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-xs">
                  {selectedMilestone.timeframe}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#075985] border border-sky-200">
                  {selectedMilestone.category}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                BK-IC Milestone 2026
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-6 overflow-y-auto">
              <h3 id="modal-milestone-title" className="text-2xl sm:text-3xl font-black text-[#075985] tracking-tight leading-snug">
                {selectedMilestone.title}
              </h3>

              {/* Đơn vị chủ trì & Phối hợp */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  <Building2 className="h-4 w-4" />
                  <span>Đơn vị chủ trì &amp; Phối hợp</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedMilestone.organizersAndPartners.map((org, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{org}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hoạt động đã làm & Tổ chức gì */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 border border-sky-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  <span>Hoạt động đã làm &amp; Nội dung tổ chức</span>
                </div>
                <ul className="space-y-2.5">
                  {selectedMilestone.actionsTaken.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <span className="h-5 w-5 rounded-full bg-[#0284C7]/10 text-[#0284C7] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kết quả & Giá trị thu về được */}
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Kết quả &amp; Giá trị thu về được</span>
                </div>
                <ul className="space-y-2">
                  {selectedMilestone.outcomesAndValue.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 text-center sm:text-left">
                CLB Khởi nghiệp &amp; Đổi mới Sáng tạo BK-IC • Trường ĐH Bách khoa – ĐHĐN
              </span>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-8 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold transition shadow-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: IMAGE LIGHTBOX INSPECTOR */}
      {selectedImage && (
        <ImageLightboxModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          src={selectedImage.imageUrl}
          alt={selectedImage.title}
          title={selectedImage.title}
          subtitle={selectedImage.caption}
          meta={`${selectedImage.category} • ${selectedImage.date}`}
        />
      )}
    </div>
  );
};

export default InternalActivitiesTab;

