// BK-IC Workshop Listing — Minimalist Editorial
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { CTASection } from '../../components/editorial/CTASection';
import { Calendar, Clock, MapPin, User, ArrowRight, Sparkles, Inbox, Search } from 'lucide-react';

export interface WorkshopItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  summary: string;
}

// Structured sample workshop listing
export const sampleWorkshops: WorkshopItem[] = [
  {
    slug: 'tri-tue-nhan-tao-iot-embedded',
    title: 'Ứng dụng AI & Edge Computing trên Thiết bị Nhúng thông minh',
    category: 'AI & Embedded',
    date: 'Thứ Bảy, 12/12/2026',
    time: '08:30 – 11:30',
    location: 'Hội trường Khu F, Trường ĐH Bách khoa (DUT)',
    speaker: 'TS. Nguyễn Văn Hướng (Khoa Điện tử - Viễn thông, DUT)',
    status: 'upcoming',
    summary: 'Tìm hiểu quy trình thu thập dữ liệu cảm biến thời gian thực và triển khai mô hình học sâu rút gọn trên bo mạch vi xử lý Edge AI.'
  },
  {
    slug: 'pitching-goi-von-khoi-nghiep',
    title: 'Kỹ năng Pitching & Xây dựng Pitch Deck chuẩn Quốc tế',
    category: 'Khởi nghiệp & Đổi mới',
    date: 'Thứ Năm, 24/12/2026',
    time: '14:00 – 17:00',
    location: 'Phòng Lab Đổi mới sáng tạo, Khu A, DUT',
    speaker: 'Chuyên gia Cố vấn Vườn ươm Doanh nghiệp Đà Nẵng',
    status: 'upcoming',
    summary: 'Phương pháp trình bày ý tưởng kinh doanh cô đọng trong 3 phút, làm nổi bật mô hình doanh thu và cấu trúc tài chính cho nhà đầu tư.'
  },
  {
    slug: 'ui-ux-design-system-tech',
    title: 'Xây dựng Design System chuyên nghiệp cho Startup Công nghệ',
    category: 'Design & Product',
    date: '28/11/2026',
    time: '14:00 – 16:30',
    location: 'Smart Campus Lab, DUT',
    speaker: 'Lead Product Designer (BK-IC Alumni)',
    status: 'completed',
    summary: 'Quy chuẩn hóa UI tokens, typography scale, icon sets và quy trình chuyển giao thiết kế sang mã nguồn React & Tailwind CSS.'
  }
];

export const WorkshopsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkshops = sampleWorkshops.filter((ws) => {
    const matchFilter = filter === 'all' || ws.status === filter;
    const matchSearch = ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Workshop thường niên' }
        ]}
        eyebrow="WORKSHOP THƯỜNG NIÊN • BK-IC DUT"
        title="Chuỗi Hội thảo Công nghệ &"
        titleHighlight="Kỹ năng Khởi nghiệp"
        subtitle="Các buổi chia sẻ chuyên sâu với sự tham gia của giảng viên hướng dẫn, chuyên gia doanh nghiệp và cựu sinh viên khởi nghiệp thành công."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* Search & Filter Bar */}
        <ScrollReveal direction="up" distance={16} duration={0.5}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  filter === 'all' ? 'bg-[#0284C7] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({sampleWorkshops.length})
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

            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm workshop theo từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Listing Grid */}
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((ws, idx) => (
              <ScrollReveal key={ws.slug} direction="up" distance={20} delay={idx * 0.08} duration={0.6}>
                <div
                  className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
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
                        {ws.status === 'upcoming' ? '• Sắp mở đơn' : '• Đã kết thúc'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                      <Link to={`/activities/workshops/${ws.slug}`}>
                        {ws.title}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed line-clamp-3">
                      {ws.summary}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span>{ws.date} ({ws.time})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span className="truncate">{ws.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-[#0284C7] shrink-0" />
                        <span className="truncate">{ws.speaker}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <Link
                      to={`/activities/workshops/${ws.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:text-[#075985] transition group-hover:translate-x-1"
                    >
                      <span>Xem chi tiết nội dung</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
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
              <h4 className="text-base font-bold text-[#10182D]">Không tìm thấy workshop phù hợp</h4>
              <p className="text-xs sm:text-sm text-[#5E6573] max-w-md mx-auto">
                Hãy thử thay đổi tiêu chí lọc hoặc quay lại sau để cập nhật lịch các workshop mới nhất.
              </p>
            </div>
          </div>
        )}

        {/* CTA Transition */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <CTASection
            eyebrow="KẾT NỐI HỌC THUẬT"
            title="Đề xuất chủ đề Workshop hoặc Diễn giả đồng hành"
            description="Doanh nghiệp hoặc chuyên gia mong muốn chia sẻ kinh nghiệm kỹ thuật cùng sinh viên Bách khoa có thể kết nối với Ban Chuyên môn."
            primaryText="Liên hệ Ban Tổ chức"
            primaryTo="/partnership"
            secondaryText="Xem Cuộc thi sáng tạo"
            secondaryTo="/activities/competitions"
          />
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
