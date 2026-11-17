// BK-IC Internal Activities Listing — Minimalist Editorial
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
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
    <div className="min-h-screen bg-[#FDFDFE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { label: 'Hoạt động', to: '/activities' },
            { label: 'Sinh hoạt nội bộ' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="SINH HOẠT NỘI BỘ • BK-IC DUT"
            title="Lịch sinh hoạt & Tập huấn định kỳ"
            subtitle="Không gian trao đổi chuyên môn, rèn luyện kỹ năng kỹ thuật, cập nhật tiến độ dự án và gắn kết thành viên giữa Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên."
          />
        </div>

        {/* Schedule Overview Box */}
        <div className="rounded-3xl border border-[#E2E6EE] bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1749B5]">
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
              className="px-5 py-2.5 rounded-xl bg-[#10182D] text-white text-xs font-semibold hover:bg-[#1749B5] transition shadow-xs"
            >
              Cổng điểm danh QR
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-[#1749B5] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả các buổi ({sessions.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'upcoming'
                  ? 'bg-[#1749B5] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sắp diễn ra
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'completed'
                  ? 'bg-[#1749B5] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đã kết thúc
            </button>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            DUT • 2026
          </span>
        </div>

        {/* Listing Container */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <ActivityCard
                key={session.id}
                title={session.title}
                type={session.category === 'training' ? 'Tập huấn kỹ năng' : 'Sinh hoạt định kỳ'}
                date={session.date}
                time={`${session.startTime} - ${session.endTime}`}
                location={session.location || 'Hội trường Smart Campus, DUT'}
                speaker={session.personInChargeName || 'Ban Chuyên môn BK-IC'}
                status={session.status === 'scheduled' || session.status === 'open' ? 'open' : 'closed'}
                statusLabel={session.status === 'scheduled' || session.status === 'open' ? 'Sắp diễn ra' : 'Đã kết thúc'}
              />
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
        <CTASection
          eyebrow="THÀNH VIÊN BK-IC"
          title="Theo dõi lịch tập huấn & Điểm danh định kỳ"
          description="Đăng nhập cổng thành viên để xem tiến độ cá nhân, điểm rèn luyện và tài liệu sinh hoạt từng tuần."
          primaryText="Đăng nhập Cổng thành viên"
          primaryTo="/login"
          secondaryText="Về Trang chủ"
          secondaryTo="/"
        />
      </div>
    </div>
  );
};
