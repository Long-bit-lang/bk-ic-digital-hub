// BK-IC Internal Activities Listing — Minimalist Editorial
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { ActivityCard } from '../../components/editorial/EditorialCards';
import { CTASection } from '../../components/editorial/CTASection';
import { Calendar, Clock, MapPin, Users, ShieldCheck, Filter, Sparkles, Inbox } from 'lucide-react';

export const InternalActivitiesPage: React.FC = () => {
  const { sessions } = useApp();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Filter actual training sessions from app context
  const filteredSessions = sessions.filter((s) => {
    if (filter === 'upcoming') return s.status === 'scheduled' || s.status === 'ongoing' || s.status === 'open';
    if (filter === 'completed') return s.status === 'ended' || s.status === 'closed';
    return true;
  });

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Sinh hoạt nội bộ' }
        ]}
        eyebrow="SINH HOẠT NỘI BỘ • BK-IC DUT"
        title="Lịch sinh hoạt &"
        titleHighlight="Tập huấn định kỳ"
        subtitle="Không gian trao đổi chuyên môn, rèn luyện kỹ năng kỹ thuật, cập nhật tiến độ dự án và gắn kết thành viên giữa Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* Schedule Overview Box */}
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
                <Calendar className="h-3.5 w-3.5" />
                <span>Khung giờ cố định</span>
              </span>
              <h3 className="text-xl font-bold text-[#10182D]">Sinh hoạt định kỳ chiều thứ Ba hàng tuần</h3>
              <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                Thời gian: <strong>17:30 – 19:00</strong> tại Hội trường Smart Campus hoặc Phòng Lab Đổi mới sáng tạo (Khu A, ĐH Bách khoa – ĐHĐN). Điểm danh qua quét mã QR trực tiếp trên cổng thành viên.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-xs font-bold hover:shadow-lg hover:shadow-sky-500/25 transition duration-300 shadow-xs"
              >
                <span>Cổng điểm danh QR</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Filter Bar */}
        <ScrollReveal direction="up" distance={16} delay={0.1} duration={0.5}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'all' ? 'bg-[#0284C7] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({sessions.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'upcoming' ? 'bg-[#0284C7] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sắp diễn ra
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'completed' ? 'bg-[#0284C7] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Đã diễn ra
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session, idx) => (
              <ScrollReveal key={session.id} direction="up" distance={20} delay={idx * 0.08} duration={0.6}>
                <ActivityCard
                  to="#"
                  title={session.title}
                  type={session.category === 'training' ? 'Tập huấn kỹ năng' : 'Sinh hoạt định kỳ'}
                  date={session.date}
                  time={`${session.startTime} - ${session.endTime}`}
                  location={session.location || 'Hội trường Smart Campus, DUT'}
                  speaker={session.personInChargeName || 'Ban Chuyên môn BK-IC'}
                  status={session.status === 'scheduled' || session.status === 'open' ? 'open' : 'closed'}
                  statusLabel={session.status === 'scheduled' || session.status === 'open' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-[#F8FAFC] p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Inbox className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#10182D]">Chưa có buổi sinh hoạt nào trong mục này</h4>
              <p className="text-xs sm:text-sm text-[#5E6573] max-w-md mx-auto">
                Lịch sinh hoạt tiếp theo sẽ được Ban Chủ nhiệm và Ban Điều hành công bố và cập nhật tại đây.
              </p>
            </div>
          </div>
        )}

        {/* CTA Transition */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <CTASection
            eyebrow="THÀNH VIÊN BK-IC"
            title="Theo dõi lịch tập huấn & Điểm danh định kỳ"
            description="Đăng nhập cổng thành viên để xem tiến độ cá nhân, điểm rèn luyện và tài liệu sinh hoạt từng tuần."
            primaryText="Đăng nhập Cổng thành viên"
            primaryTo="/login"
            secondaryText="Về Trang chủ"
            secondaryTo="/"
          />
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
