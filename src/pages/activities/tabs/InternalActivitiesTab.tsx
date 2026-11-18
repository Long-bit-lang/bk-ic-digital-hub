// BK-IC Tab 1: Sinh hoạt nội bộ (Internal Activities)
// Displays culture, recurring Tuesday sessions, upcoming meetings, meeting timeline & photo album
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { ImageLightboxModal } from '../../../components/common/ImageLightboxModal';
import { 
  RECURRING_TUESDAY_SCHEDULE, 
  SESSION_TIMELINE_STEPS, 
  INTERNAL_ACTIVITY_GALLERY,
  type InternalGalleryItem
} from '../../../data/activitiesData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  ZoomIn
} from 'lucide-react';

export const InternalActivitiesTab: React.FC = () => {
  const { sessions } = useApp();
  const [selectedImage, setSelectedImage] = useState<InternalGalleryItem | null>(null);

  // Filter 3 closest sessions (sorted by date ascending)
  const nowStr = new Date().toISOString().split('T')[0];
  const sortedSessions = [...sessions]
    .filter((s) => s.date >= nowStr || s.status === 'scheduled' || s.status === 'ongoing')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Fallback: If no upcoming session exists, show the most recent sessions
  const displaySessions = sortedSessions.length > 0 
    ? sortedSessions 
    : [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

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
              Các buổi sinh hoạt nội bộ là nhịp đập của BK-IC – nơi các thành viên từ Ban Chủ nhiệm, Ban Điều hành đến Ban Thành viên cùng ngồi lại, chia sẻ tiến độ các dự án công nghệ, trao đổi kiến thức thực tiễn và xây dựng tinh thần đồng đội Bách khoa vững chắc.
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
                Mỗi buổi sinh hoạt áp dụng mã QR động tự đổi mới mỗi 15 giây, tích hợp hệ thống chống điểm danh hộ và cấp quyền phản hồi đánh giá ẩn danh cho từng thành viên.
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
              <span>Đồng bộ tự động từ hệ thống</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
                <Calendar className="h-4 w-4 text-[#0284C7]" />
                <span>Thời gian định kỳ</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">{RECURRING_TUESDAY_SCHEDULE.dayOfWeek}</div>
              <div className="text-xs text-slate-500">{RECURRING_TUESDAY_SCHEDULE.timeRange}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
                <MapPin className="h-4 w-4 text-[#0284C7]" />
                <span>Địa điểm sinh hoạt</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">Phòng Không gian Sáng tạo</div>
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

          <p className="text-xs text-slate-500 leading-relaxed">
            {RECURRING_TUESDAY_SCHEDULE.description}
          </p>
        </div>
      </ScrollReveal>

      {/* SECTION 3: CÁC BUỔI SINH HOẠT SẮP TỚI & TRẠNG THÁI */}
      <ScrollReveal direction="up" distance={20} delay={0.12} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Lịch trình Thực tế
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Các Buổi Sinh hoạt Gần nhất
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Trạng thái được cập nhật trực tiếp theo thời gian thực từ cơ sở dữ liệu CLB.
            </p>
          </div>

          {displaySessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {displaySessions.map((ses) => {
                const isCancelled = ses.status === 'cancelled';
                const isOngoing = ses.status === 'ongoing';
                const isScheduled = ses.status === 'scheduled';

                return (
                  <div
                    key={ses.id}
                    className={`rounded-3xl border p-6 space-y-4 flex flex-col justify-between transition-all duration-300 ${
                      isCancelled
                        ? 'border-rose-200/90 bg-rose-50/40 opacity-90'
                        : isOngoing
                        ? 'border-emerald-300 bg-emerald-50/30 shadow-md ring-2 ring-emerald-400/20'
                        : 'border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-500/5'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Status Badges */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          {ses.date.split('-').reverse().join('/')}
                        </span>
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Đã hủy buổi họp</span>
                          </span>
                        ) : isOngoing ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            <span>Đang diễn ra</span>
                          </span>
                        ) : isScheduled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-200">
                            <span>Sắp diễn ra</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                            <span>Đã kết thúc</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-[#10182D] leading-snug">
                        {ses.title}
                      </h4>

                      {isCancelled && ses.cancellationReason && (
                        <div className="p-2.5 rounded-xl bg-rose-100/70 border border-rose-200 text-xs text-rose-800 space-y-0.5">
                          <span className="font-semibold block">Lý do điều chỉnh:</span>
                          <span>{ses.cancellationReason}</span>
                        </div>
                      )}

                      <p className="text-xs text-[#5E6573] leading-relaxed line-clamp-3">
                        {ses.description || 'Sinh hoạt chuyên môn định kỳ câu lạc bộ.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100/80 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span>{ses.startTime} – {ses.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span className="truncate">{ses.location || 'Văn phòng BK-IC'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
              Hiện tại chưa có lịch sinh hoạt mới được công bố.
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* SECTION 4: QUY TRÌNH MỘT BUỔI SINH HOẠT */}
      <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Trình tự Hoạt động
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Quy trình Một Buổi Sinh hoạt Chuẩn mực
            </h3>
            <p className="text-xs text-slate-500">
              Cấu trúc 90 phút được thiết kế tối ưu giữa công tác hành chính, chuyên môn và giao lưu kết nối.
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

      {/* SECTION 5: ALBUM HOẠT ĐỘNG & GẮN KẾT */}
      <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Khoảnh khắc Thành viên
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Album Hoạt động Sinh hoạt & Gắn kết
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Hình ảnh thực tế từ các buổi sinh hoạt chuyên môn và ngoại khóa của BK-IC.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTERNAL_ACTIVITY_GALLERY.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-xs hover:shadow-xl hover:shadow-sky-500/10 hover:border-[#38BDF8] transition-all duration-300"
              >
                <div className="aspect-16/10 overflow-hidden bg-slate-200">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 sm:p-5 bg-white space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                      {img.category}
                    </span>
                    <span className="text-slate-400">{img.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#10182D] group-hover:text-[#0284C7] transition line-clamp-1">
                    {img.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {img.caption}
                  </p>
                </div>

                <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Image Lightbox Inspector */}
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

