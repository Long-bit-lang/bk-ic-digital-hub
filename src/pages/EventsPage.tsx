// BK-IC Events & Workshops Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA]">
            <Calendar className="h-3.5 w-3.5" />
            <span>LỊCH TRÌNH & SỰ KIỆN ĐỔI MỚI SÁNG TẠO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
            Sự kiện & Hội thảo BK-IC
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Khám phá các buổi tọa đàm, ngày hội mở Open Day, và các phiên sinh hoạt chuyên môn định kỳ dành cho sinh viên Bách khoa.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả sự kiện ({events.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${
                filter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sắp diễn ra
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${
                filter === 'finished' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
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
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-sm">
              Không tìm thấy sự kiện phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            filteredEvents.map((evt: any) => {
              const isRegistered = registeredEvents.includes(evt.id);
              return (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-blue-300 hover:shadow-md transition duration-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {evt.eventType}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-600">{evt.date}</span>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full w-fit ${
                      evt.status === 'upcoming' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {evt.status === 'upcoming' ? 'Đang mở đăng ký' : 'Đã diễn ra'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 pt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    {evt.speaker && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{evt.speaker}</span>
                      </div>
                    )}
                  </div>

                  {evt.recapNote && (
                    <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                      <strong>Tổng kết sự kiện:</strong> {evt.recapNote}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Miễn phí vé tham dự cho sinh viên ĐH Bách khoa - ĐHĐN
                    </div>

                    {evt.status === 'upcoming' ? (
                      <button
                        onClick={() => handleRegister(evt.id)}
                        disabled={isRegistered}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isRegistered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-[#245BFA] text-white hover:bg-blue-700 shadow-xs'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Đã đăng ký</span>
                          </>
                        ) : (
                          <>
                            <span>Đăng ký tham dự</span>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
