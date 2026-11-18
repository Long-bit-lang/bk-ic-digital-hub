// BK-IC BK Shark Season Detail Page — Minimalist Editorial
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
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
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'BK Shark', to: '/activities/bk-shark' },
          { label: `Mùa ${seasonData.year}` }
        ]}
        eyebrow={`BK SHARK • MÙA ${seasonData.year} ${seasonData.status === 'active' ? '• ĐANG DIỄN RA' : '• ĐÃ KÝ KẾT'}`}
        title={`Chủ đề: ${seasonData.theme}`}
        subtitle={seasonData.summary}
        compact={true}
        actions={
          <Link
            to="/activities/bk-shark"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh mục BK Shark</span>
          </Link>
        }
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl space-y-10">
        {/* Metadata Area */}
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                <Calendar className="h-4 w-4 text-[#0284C7]" />
                <span>Thời gian tổ chức</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">{seasonData.date}</div>
              <div className="text-xs text-slate-500">Hội trường Smart Campus, DUT</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                <Users className="h-4 w-4 text-[#0284C7]" />
                <span>Dự án Pitching</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">{seasonData.pitchesCount} Dự án tuyển chọn</div>
              <div className="text-xs text-slate-500">Từ hơn 20 hồ sơ nộp về</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                <TrendingUp className="h-4 w-4 text-[#0284C7]" />
                <span>Tổng cam kết vốn</span>
              </div>
              <div className="text-sm font-bold text-[#0284C7]">{seasonData.totalCommitment}</div>
              <div className="text-xs text-slate-500">Vốn ươm tạo &amp; Bảo trợ thiết bị</div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1 hover:border-[#38BDF8] hover:shadow-md transition">
              <div className="flex items-center gap-2 text-xs uppercase text-slate-400 font-semibold">
                <Building2 className="h-4 w-4 text-[#0284C7]" />
                <span>Đơn vị tổ chức</span>
              </div>
              <div className="text-sm font-bold text-[#075985]">BK-IC Digital Hub</div>
              <div className="text-xs text-slate-500">Đoàn TN – Hội SV DUT</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Media Area Placeholder */}
        <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6}>
          <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/50 p-8 sm:p-12 text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs text-[#0284C7] uppercase tracking-wider font-semibold">
              <FileText className="h-4 w-4" />
              <span>Khu vực Hình ảnh Pitching &amp; Khoảnh khắc Ký kết</span>
            </div>
            <div className="max-w-md mx-auto text-xs text-slate-600">
              Khung hiển thị hình ảnh sân khấu pitching thực tế, hội đồng các Shark chất vấn và lễ trao chứng nhận đầu tư hạt giống.
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Area */}
        <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            {/* Section 1: Overview */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#075985]">
                Diễn biến Sân khấu Pitching Mùa {seasonData.year}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Các nhóm sinh viên đã trải qua các phiên chất vấn căng thẳng, làm rõ cấu trúc giá thành sản phẩm, khả năng giải quyết vấn đề thị trường và năng lực cam kết của đội ngũ nhân sự.
              </p>
            </div>

            {/* Section 2: Pitched Projects Showcase Container */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#075985]">
                Danh sách Dự án Pitching Tiêu biểu ({seasonData.year})
              </h3>

              <div className="space-y-3">
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition">
                  <div className="space-y-1">
                    <div className="font-bold text-[#075985] text-base">Hệ thống Giám sát Năng lượng Thông minh (Smart Campus Energy)</div>
                    <div className="text-xs text-slate-500">Lĩnh vực: GreenTech &amp; IoT • Nhóm SV Khoa Điện &amp; CNTT</div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Cam kết đầu tư: 120.000.000 VNĐ
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition">
                  <div className="space-y-1">
                    <div className="font-bold text-[#075985] text-base">Robot Tự hành Kiểm tra Khuyết tật Bề mặt (Inspection AGV)</div>
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
        </ScrollReveal>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
          <Link
            to="/activities/bk-shark"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả các mùa BK Shark</span>
          </Link>
          <Link
            to="/activities/recruitment"
            className="text-xs font-semibold text-[#0284C7] hover:underline"
          >
            Tìm hiểu Tuyển thành viên mới →
          </Link>
        </div>
      </PageContentCanvas>
    </div>
  );
};

export default BKSharkSeasonDetailPage;
