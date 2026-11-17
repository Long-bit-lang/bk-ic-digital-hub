// BK-IC Competition Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { sampleCompetitions } from './CompetitionsPage';
import { 
  Trophy, 
  Calendar, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  BookmarkCheck,
  ShieldAlert,
  Building2,
  FileText
} from 'lucide-react';

export const CompetitionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const found = sampleCompetitions.find((c) => c.slug === slug);
  const competition = found || {
    slug: slug || 'competition-detail',
    title: slug
      ? `Cuộc thi Sáng tạo: ${slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}`
      : 'Cuộc thi Sáng tạo Khởi nghiệp BK-IC',
    field: 'Khoa học & Kỹ thuật',
    prizePool: '100.000.000 VNĐ',
    deadline: '31/12/2026',
    teamsCount: '30+ Đội',
    status: 'active' as const,
    summary: 'Đấu trường tranh tài giải pháp sáng tạo công nghệ dành cho sinh viên toàn trường.',
    organizer: 'Đoàn Thanh niên – Hội Sinh viên DUT & BK-IC'
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: 'Hoạt động', to: '/activities' },
              { label: 'Cuộc thi', to: '/activities/competitions' },
              { label: competition.title }
            ]}
          />
          <Link
            to="/activities/competitions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách Cuộc thi</span>
          </Link>
        </div>

        {/* Title Area */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1749B5] border border-blue-200">
              {competition.field}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                competition.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {competition.status === 'active' ? '• Đang nhận hồ sơ dự thi' : '• Đã kết thúc'}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Mã cuộc thi: <span className="font-mono text-slate-600">{competition.slug}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10182D] tracking-tight leading-tight">
            {competition.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed">
            {competition.summary}
          </p>
        </div>

        {/* Metadata Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Trophy className="h-4 w-4 text-[#1749B5]" />
              <span>Tổng giải thưởng</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">{competition.prizePool}</div>
            <div className="text-xs text-slate-500">Tiền mặt &amp; Vốn ươm tạo</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Calendar className="h-4 w-4 text-[#1749B5]" />
              <span>Hạn nộp hồ sơ</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">{competition.deadline}</div>
            <div className="text-xs text-slate-500">Trước 23:59 cùng ngày</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Users className="h-4 w-4 text-[#1749B5]" />
              <span>Đối tượng dự thi</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">Sinh viên ĐHĐN</div>
            <div className="text-xs text-slate-500">Nhóm từ 2 – 5 thành viên</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Building2 className="h-4 w-4 text-[#1749B5]" />
              <span>Đơn vị tổ chức</span>
            </div>
            <div className="text-sm font-bold text-[#10182D] truncate">{competition.organizer}</div>
            <div className="text-xs text-slate-500">Hội đồng chuyên môn DUT</div>
          </div>
        </div>

        {/* Optional Media Area Placeholder */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <FileText className="h-4 w-4" />
            <span>Khu vực Infographic Thể lệ &amp; Banner Cuộc thi</span>
          </div>
          <div className="max-w-md mx-auto text-xs text-slate-500">
            Khu vực hiển thị infographic thể lệ thi đấu, cơ cấu điểm đánh giá của hội đồng giám khảo và lộ trình các vòng thi.
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1: Thể lệ */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Thể lệ &amp; Lộ trình Cuộc thi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <span className="text-xs font-bold text-[#1749B5]">VÒNG 1</span>
                <div className="font-bold text-[#10182D]">Ý tưởng &amp; Nộp hồ sơ</div>
                <p className="text-xs text-slate-500">Nộp bản mô tả ý tưởng, tính mới mẻ công nghệ và khả năng giải quyết vấn đề.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <span className="text-xs font-bold text-[#1749B5]">VÒNG 2</span>
                <div className="font-bold text-[#10182D]">Phát triển Nguyên mẫu (MVP)</div>
                <p className="text-xs text-slate-500">Làm việc cùng ban cố vấn (mentors) để hoàn thiện nguyên mẫu kỹ thuật khả dụng.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                <span className="text-xs font-bold text-[#1749B5]">CHUNG KẾT</span>
                <div className="font-bold text-[#10182D]">Pitching trước Hội đồng</div>
                <p className="text-xs text-slate-500">Thuyết trình sản phẩm thực tế, trả lời phản biện và đón nhận cơ hội ươm tạo.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Cơ cấu giải thưởng */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Cơ cấu Giải thưởng
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <strong className="text-[#10182D]">01 Giải Nhất (Quán quân):</strong>
                <span className="text-[#1749B5] font-bold">50.000.000 VNĐ + Suất vào thẳng Vườn ươm</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <strong className="text-[#10182D]">01 Giải Nhì (Á quân):</strong>
                <span className="text-slate-700 font-bold">25.000.000 VNĐ + Khóa huấn luyện chuyên sâu</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <strong className="text-[#10182D]">02 Giải Ba:</strong>
                <span className="text-slate-700 font-bold">10.000.000 VNĐ/giải</span>
              </div>
            </div>
          </div>

          {/* Registration Notice Placeholder */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1749B5]">
              <BookmarkCheck className="h-5 w-5" />
              <span>Đăng ký Đội thi</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Form đăng ký dự thi trực tuyến (dành cho cá nhân tìm đội và đội nhóm chính thức) sẽ được mở theo lịch trình chính thức của Ban Tổ chức.
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            to="/activities/competitions"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả Cuộc thi</span>
          </Link>
          <Link
            to="/activities/companion-projects"
            className="text-xs font-semibold text-[#1749B5] hover:underline"
          >
            Xem Dự án đồng hành →
          </Link>
        </div>
      </div>
    </div>
  );
};

