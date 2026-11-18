// BK-IC Events & Workshops Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageHeroBanner } from '../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../components/layout/PageContentCanvas';
import { ScrollReveal } from '../components/effects/ScrollReveal';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events } = useApp();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('all');
  const [search, setSearch] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const filteredEvents = events.filter((e: any) => {
    const matchFilter = filter === 'all' || e.status === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                        e.location.toLowerCase().includes(search.toLowerCase()) ||
                        e.eventType.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleRegister = (eventId: string) => {
    if (registeredEvents.includes(eventId)) return;
    setRegisteredEvents(prev => [...prev, eventId]);
    alert('Đăng ký tham dự thành công! Chúng mình đã ghi nhận thông tin và sẽ gửi email nhắc nhở kèm tài liệu chuẩn bị trước sự kiện.');
  };

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[{ label: 'Sự kiện' }]}
        eyebrow="LỊCH TRÌNH & SỰ KIỆN ĐỔI MỚI SÁNG TẠO • BK-IC DUT"
        title="Sự kiện & Hội thảo"
        titleHighlight="BK-IC"
        subtitle="Khám phá các buổi tọa đàm, ngày hội mở Open Day, và các phiên sinh hoạt chuyên môn định kỳ dành cho sinh viên Bách khoa."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl">
        {/* Filter Controls */}
        <ScrollReveal direction="up" distance={16} duration={0.5}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filter === 'all' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả sự kiện ({events.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filter === 'upcoming' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sắp diễn ra
              </button>
              <button
                onClick={() => setFilter('finished')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filter === 'finished' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã kết thúc
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện, địa điểm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0284C7] focus:outline-none"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-400 text-sm">
              Không tìm thấy sự kiện phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            filteredEvents.map((evt: any, idx: number) => {
              const isRegistered = registeredEvents.includes(evt.id);
              return (
                <ScrollReveal key={evt.id} direction="up" distance={20} delay={idx * 0.08} duration={0.6}>
                  <div
                    className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#0284C7] border border-sky-200/60">
                          {evt.eventType}
                        </span>
                        {evt.status === 'upcoming' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Sắp diễn ra
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Đã kết thúc
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Thời lượng: {evt.duration || '120 phút'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {evt.title}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    {/* Metadata items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#0284C7]" />
                        <span>Thời gian: <strong>{evt.date} ({evt.time})</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#0284C7]" />
                        <span>Địa điểm: <strong>{evt.location}</strong></span>
                      </div>
                      {evt.speaker && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <User className="h-4 w-4 text-[#0284C7]" />
                          <span>Diễn giả / Chủ trì: <strong>{evt.speaker}</strong></span>
                        </div>
                      )}
                    </div>

                    {evt.recapNote && (
                      <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                        <strong>Tổng kết sự kiện:</strong> {evt.recapNote}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Miễn phí vé tham dự cho sinh viên ĐH Bách khoa - ĐHĐN
                      </div>

                      {evt.status === 'upcoming' ? (
                        <button
                          onClick={() => handleRegister(evt.id)}
                          disabled={isRegistered}
                          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition duration-300 ${
                            isRegistered
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white hover:shadow-lg hover:shadow-sky-500/25'
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Đã ghi danh</span>
                            </>
                          ) : (
                            <>
                              <span>Đăng ký tham gia</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Sự kiện đã hoàn tất
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })
          )}
        </div>
      </PageContentCanvas>
    </div>
  );
};
