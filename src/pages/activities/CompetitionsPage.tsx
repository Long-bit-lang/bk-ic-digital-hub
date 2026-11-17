// BK-IC Competitions Listing — Minimalist Editorial
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { CTASection } from '../../components/editorial/CTASection';
import { Award, Calendar, Users, Trophy, ArrowRight, Inbox, Search } from 'lucide-react';

export interface CompetitionItem {
  slug: string;
  title: string;
  field: string;
  prizePool: string;
  deadline: string;
  teamsCount: string;
  status: 'active' | 'upcoming' | 'completed';
  summary: string;
  organizer: string;
}

export const sampleCompetitions: CompetitionItem[] = [
  {
    slug: 'bk-maker-2026',
    title: 'BK Maker Challenge 2026: Sáng tạo Công nghệ Xanh & Thiết bị thông minh',
    field: 'IoT & Phần cứng thông minh',
    prizePool: '120.000.000 VNĐ',
    deadline: '20/12/2026',
    teamsCount: '45+ Đội dự thi',
    status: 'active',
    summary: 'Cuộc thi thiết kế nguyên mẫu phần cứng ứng dụng công nghệ nhúng, năng lượng sạch và tự động hóa trong khuôn viên trường đại học.',
    organizer: 'Đoàn TN – Hội SV DUT & BK-IC'
  },
  {
    slug: 'hackathon-innovate-danang-2026',
    title: 'Hackathon Innovate Da Nang: Giải pháp Chuyển đổi số Thành phố Thông minh',
    field: 'AI & Dữ liệu lớn',
    prizePool: '80.000.000 VNĐ',
    deadline: '15/01/2027',
    teamsCount: '30+ Đội dự thi',
    status: 'upcoming',
    summary: 'Thử thách lập trình 48 giờ liên tục giải quyết các bài toán hạ tầng giao thông, du lịch thông minh và quản lý môi trường đô thị.',
    organizer: 'BK-IC đồng hành cùng Sở TT&TT Đà Nẵng'
  },
  {
    slug: 'bk-startup-seed-2025',
    title: 'BK Startup Seed 2025: Ươm mầm Ý tưởng Kinh doanh Công nghệ',
    field: 'Khởi nghiệp Công nghệ',
    prizePool: '50.000.000 VNĐ',
    deadline: '10/11/2025',
    teamsCount: '24 Đội',
    status: 'completed',
    summary: 'Cuộc thi tuyển chọn các dự án tiềm năng bước vào vòng thẩm định vốn hạt giống tại sân khấu BK Shark mùa 2025.',
    organizer: 'Ban Chủ nhiệm BK-IC'
  }
];

export const CompetitionsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompetitions = sampleCompetitions.filter((comp) => {
    const matchFilter = filter === 'all' || comp.status === filter;
    const matchSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hoạt động', to: '/activities' },
            { label: 'Cuộc thi' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="CUỘC THI SÁNG TẠO • BK-IC DUT"
            title="Đấu trường Học thuật & Khởi nghiệp Đổi mới Sáng tạo"
            subtitle="Nơi các nhóm sinh viên thử sức, hiện thực hóa ý tưởng công nghệ thành sản phẩm khả dụng và tranh tài trước hội đồng chuyên môn."
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'all' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả cuộc thi ({sampleCompetitions.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'active' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đang mở đơn
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'completed' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đã kết thúc
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1749B5]"
            />
          </div>
        </div>

        {/* Listing Grid */}
        {filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp) => (
              <div
                key={comp.slug}
                className="group flex flex-col justify-between rounded-3xl border border-[#E2E6EE] bg-white p-6 sm:p-7 shadow-xs hover:border-[#6B9DFF] hover:shadow-md transition duration-300"
              >
                <div className="space-y-4">
                  {/* Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1749B5] border border-blue-100">
                      {comp.field}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        comp.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {comp.status === 'active' ? '• Đang nhận đơn' : '• Đã trao giải'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug group-hover:text-[#1749B5] transition">
                    <Link to={`/activities/competitions/${comp.slug}`}>
                      {comp.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed line-clamp-3">
                    {comp.summary}
                  </p>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 space-y-0.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Tổng giải thưởng</div>
                      <div className="font-bold text-[#10182D] truncate">{comp.prizePool}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 space-y-0.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Hạn đăng ký</div>
                      <div className="font-bold text-[#10182D] truncate">{comp.deadline}</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    to={`/activities/competitions/${comp.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1749B5] hover:text-[#10182D] transition group-hover:translate-x-0.5"
                  >
                    <span>Xem thể lệ &amp; Chi tiết</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-[#F8FAFC] p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Inbox className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#10182D]">Chưa có cuộc thi nào trong danh mục này</h4>
              <p className="text-xs sm:text-sm text-[#5E6573] max-w-md mx-auto">
                Thông tin cuộc thi học thuật và sân chơi sáng tạo tiếp theo sẽ được cập nhật sớm nhất.
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <CTASection
          eyebrow="TÀI TRỢ & ĐỒNG HÀNH"
          title="Doanh nghiệp đồng hành cùng các Cuộc thi Sinh viên"
          description="BK-IC chào đón các doanh nghiệp tài trợ giải thưởng, cung cấp đề bài thực tế hoặc tham gia vào Ban Giám khảo chuyên môn."
          primaryText="Đăng ký Hợp tác Cuộc thi"
          primaryTo="/partnership"
          secondaryText="Xem Sân khấu BK Shark"
          secondaryTo="/activities/bk-shark"
        />
      </div>
    </div>
  );
};

