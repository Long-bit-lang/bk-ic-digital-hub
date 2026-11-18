// BK-IC Tab 2: Workshop thường niên (Workshops)
// Featured workshop, search & filter grid, live registration modal & archive
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { WorkshopRegisterModal } from '../../../components/activities/WorkshopRegisterModal';
import { WORKSHOPS_DATA, type WorkshopItem } from '../../../data/activitiesData';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  FileText, 
  Download, 
  ExternalLink,
  Inbox
} from 'lucide-react';

export const WorkshopsTab: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringWorkshop, setRegisteringWorkshop] = useState<WorkshopItem | null>(null);

  const featuredWorkshop = WORKSHOPS_DATA[0];

  const filteredWorkshops = WORKSHOPS_DATA.filter((ws) => {
    const matchFilter = filter === 'all' || ws.status === filter;
    const matchSearch =
      ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: WORKSHOP NỔI BẬT (FEATURED ASYMMETRIC CARD) */}
      {featuredWorkshop && (
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/50 via-white to-blue-50/40 p-6 sm:p-8 lg:p-10 shadow-md shadow-sky-500/5 hover:border-[#38BDF8] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Image Cover */}
              <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-sm aspect-16/10 lg:aspect-4/3 bg-slate-100">
                <img
                  src={featuredWorkshop.coverImage}
                  alt={featuredWorkshop.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>WORKSHOP NỔI BẬT</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Information & Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-[#075985] font-bold">
                    {featuredWorkshop.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    • Mở đơn tham dự miễn phí
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10182D] leading-snug">
                  {featuredWorkshop.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {featuredWorkshop.fullDesc || featuredWorkshop.summary}
                </p>

                {/* Metadata Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#0284C7] shrink-0" />
                    <span>{featuredWorkshop.date} ({featuredWorkshop.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#0284C7] shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{featuredWorkshop.speaker}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-[#0284C7] shrink-0" />
                    <span className="truncate">{featuredWorkshop.location}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  {featuredWorkshop.status === 'upcoming' && featuredWorkshop.registrationOpen ? (
                    <button
                      onClick={() => setRegisteringWorkshop(featuredWorkshop)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                    >
                      <span>Đăng ký tham gia ngay</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Sự kiện đã diễn ra</span>
                    </span>
                  )}

                  <Link
                    to={`/activities/workshops/${featuredWorkshop.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                  >
                    <span>Xem chi tiết nội dung</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* SECTION 2: DANH SÁCH WORKSHOP VÀ BỘ LỌC */}
      <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'all'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({WORKSHOPS_DATA.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'upcoming'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sắp diễn ra
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'completed'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Đã diễn ra
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm theo chủ đề, diễn giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          {filteredWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((ws) => (
                <div
                  key={ws.id}
                  className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-100">
                        {ws.category}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          ws.status === 'upcoming' ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {ws.status === 'upcoming' ? '• Sắp diễn ra' : '• Đã diễn ra'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                      <Link to={`/activities/workshops/${ws.slug}`}>
                        {ws.title}
                      </Link>
                    </h4>

                    {/* Summary */}
                    <p className="text-xs text-[#5E6573] leading-relaxed line-clamp-3">
                      {ws.summary}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span>{ws.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span className="truncate">{ws.speaker}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span className="truncate">{ws.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/activities/workshops/${ws.slug}`}
                      className="text-xs font-semibold text-[#0284C7] hover:underline"
                    >
                      Chi tiết
                    </Link>

                    {ws.status === 'upcoming' && ws.registrationOpen ? (
                      <button
                        onClick={() => setRegisteringWorkshop(ws)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                      >
                        <span>Đăng ký</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Đã diễn ra
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
              <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Không tìm thấy workshop phù hợp</h4>
              <p className="text-xs text-slate-500">
                Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang chế độ xem tất cả.
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* SECTION 4: TÀI LIỆU & KHO LƯU TRỮ HỌC LIỆU */}
      <ScrollReveal direction="up" distance={20} delay={0.14} duration={0.6}>
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Kho Lưu trữ Dữ liệu & Học liệu
              </span>
              <h4 className="text-lg font-bold text-[#10182D]">
                Slide Bài giảng & Video Ghi hình Workshop
              </h4>
            </div>
            <span className="text-xs text-slate-500">Dành riêng cho cộng đồng sinh viên DUT</span>
          </div>

          {/* Trạng thái tạm thời để trống */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 sm:p-12 text-center space-y-3">
            <div className="p-3 bg-sky-50 text-[#0284C7] w-fit mx-auto rounded-2xl shadow-2xs border border-sky-100">
              <Download className="h-6 w-6 text-[#0284C7]" />
            </div>
            <h5 className="text-sm font-bold text-slate-700">Kho lưu trữ tài liệu đang được hoàn thiện</h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Tài liệu bài giảng, slide chuyên đề và video ghi hình các buổi workshop đang được Ban Chuyên môn tổng hợp và sẽ sớm cập nhật tại đây.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Workshop Registration Modal */}
      {registeringWorkshop && (
        <WorkshopRegisterModal
          isOpen={!!registeringWorkshop}
          onClose={() => setRegisteringWorkshop(null)}
          workshopId={registeringWorkshop.id}
          workshopTitle={registeringWorkshop.title}
        />
      )}
    </div>
  );
};

export default WorkshopsTab;

