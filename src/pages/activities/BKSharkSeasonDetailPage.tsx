// BK-IC BK Shark Season Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { sampleSeasons } from './BKSharkPage';
import { 
  Flame, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Users, 
  Building2, 
  ArrowLeft, 
  FileText,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const BKSharkSeasonDetailPage: React.FC = () => {
  const { season } = useParams<{ season: string }>();

  const found = sampleSeasons.find((s) => s.season === season);
  const seasonData = found || {
    season: season || '2026',
    year: season || '2026',
    theme: 'Đổi mới Sáng tạo & Khởi nghiệp Công nghệ Bách khoa',
    pitchesCount: 8,
    totalCommitment: '300.000.000 VNĐ',
    status: 'active' as const,
    summary: 'Sân khấu pitching kết nối các nhóm dự án công nghệ sinh viên với hội đồng các nhà đầu tư mạo hiểm.',
    date: `Mùa giải ${season || '2026'}`
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: 'Hoạt động', to: '/activities' },
              { label: 'BK Shark', to: '/activities/bk-shark' },
              { label: `Mùa ${seasonData.year}` }
            ]}
          />
          <Link
            to="/activities/bk-shark"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh mục BK Shark</span>
          </Link>
        </div>

        {/* Title Area */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10182D] text-white">
              BK SHARK • MÙA {seasonData.year}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                seasonData.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {seasonData.status === 'active' ? '• Mùa hiện tại' : '• Đã trao giải & Ký kết'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10182D] tracking-tight leading-tight">
            Chủ đề: {seasonData.theme}
          </h1>

          <p className="text-base sm:text-lg text-[#5E6573] leading-relaxed">
            {seasonData.summary}
          </p>
        </div>

        {/* Metadata Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Calendar className="h-4 w-4 text-[#1749B5]" />
              <span>Thời gian tổ chức</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">{seasonData.date}</div>
            <div className="text-xs text-slate-500">Hội trường Smart Campus, DUT</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Users className="h-4 w-4 text-[#1749B5]" />
              <span>Dự án Pitching</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">{seasonData.pitchesCount} Dự án tuyển chọn</div>
            <div className="text-xs text-slate-500">Từ hơn 20 hồ sơ nộp về</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <TrendingUp className="h-4 w-4 text-[#1749B5]" />
              <span>Tổng cam kết vốn</span>
            </div>
            <div className="text-sm font-bold text-[#1749B5]">{seasonData.totalCommitment}</div>
            <div className="text-xs text-slate-500">Vốn ươm tạo &amp; Bảo trợ trang thiết bị</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
              <Building2 className="h-4 w-4 text-[#1749B5]" />
              <span>Đơn vị tổ chức</span>
            </div>
            <div className="text-sm font-bold text-[#10182D]">BK-IC Digital Hub</div>
            <div className="text-xs text-slate-500">Đoàn TN – Hội SV DUT</div>
          </div>
        </div>

        {/* Optional Media Area Placeholder */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <FileText className="h-4 w-4" />
            <span>Khu vực Hình ảnh Pitching &amp; Khoảnh khắc Ký kết</span>
          </div>
          <div className="max-w-md mx-auto text-xs text-slate-500">
            Khung hiển thị hình ảnh sân khấu pitching thực tế, hội đồng các Shark chất vấn và lễ trao chứng nhận đầu tư hạt giống.
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1: Overview */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Diễn biến Sân khấu Pitching Mùa {seasonData.year}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Các nhóm sinh viên đã trải qua các phiên chất vấn căng thẳng, làm rõ cấu trúc giá thành sản phẩm, khả năng giải quyết vấn đề thị trường và năng lực cam kết của đội ngũ nhân sự.
            </p>
          </div>

          {/* Section 2: Pitched Projects Showcase Container */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#10182D]">
              Danh sách Dự án Pitching Tiêu biểu ({seasonData.year})
            </h3>

            <div className="space-y-3">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-[#10182D] text-base">Hệ thống Giám sát Năng lượng Thông minh (Smart Campus Energy)</div>
                  <div className="text-xs text-slate-500">Lĩnh vực: GreenTech &amp; IoT • Nhóm SV Khoa Điện &amp; CNTT</div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cam kết đầu tư: 120.000.000 VNĐ
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-[#10182D] text-base">Robot Tự hành Kiểm tra Khuyết tật Bề mặt (Inspection AGV)</div>
                  <div className="text-xs text-slate-500">Lĩnh vực: Robotics &amp; AI • Nhóm SV Cơ điện tử &amp; Cơ khí</div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cam kết bảo trợ thiết bị: 80.000.000 VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            to="/activities/bk-shark"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1749B5] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả các mùa BK Shark</span>
          </Link>
          <Link
            to="/activities/recruitment"
            className="text-xs font-semibold text-[#1749B5] hover:underline"
          >
            Tìm hiểu Tuyển thành viên mới →
          </Link>
        </div>
      </div>
    </div>
  );
};

