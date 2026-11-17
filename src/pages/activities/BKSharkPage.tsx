// BK-IC BK Shark Pitching Stage Overview — Minimalist Editorial
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { CTASection } from '../../components/editorial/CTASection';
import { Flame, Trophy, TrendingUp, Users, ArrowRight, Calendar, Building2, Search, Inbox } from 'lucide-react';

export interface SharkSeasonItem {
  season: string;
  year: string;
  theme: string;
  pitchesCount: number;
  totalCommitment: string;
  status: 'active' | 'completed';
  summary: string;
  date: string;
}

export const sampleSeasons: SharkSeasonItem[] = [
  {
    season: '2026',
    year: '2026',
    theme: 'DeepTech & Sustainable Innovation',
    pitchesCount: 8,
    totalCommitment: '350.000.000 VNĐ',
    status: 'active',
    summary: 'Mùa giải quy tụ các giải pháp phần cứng thông minh, AI biên và công nghệ năng lượng tái tạo từ sinh viên Bách khoa.',
    date: 'Dự kiến: Tháng 12/2026'
  },
  {
    season: '2025',
    year: '2025',
    theme: 'Digital Transformation & Smart City',
    pitchesCount: 10,
    totalCommitment: '280.000.000 VNĐ',
    status: 'completed',
    summary: 'Sân khấu chứng kiến 5 thoả thuận cam kết đầu tư hạt giống và 3 dự án được nhận vào Vườn ươm Doanh nghiệp Đà Nẵng.',
    date: 'Tháng 11/2025'
  },
  {
    season: '2024',
    year: '2024',
    theme: 'AI & Data-driven Solutions',
    pitchesCount: 6,
    totalCommitment: '150.000.000 VNĐ',
    status: 'completed',
    summary: 'Mùa giải khởi đầu cho mô hình pitching thực tế giữa sinh viên Bách khoa và các Shark là cựu sinh viên thành đạt.',
    date: 'Tháng 12/2024'
  }
];

export const BKSharkPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredSeasons = sampleSeasons.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hoạt động', to: '/activities' },
            { label: 'BK Shark' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="SÂN KHẤU PITCHING • BK-IC DUT"
            title="BK Shark: Bệ phóng Khởi nghiệp Công nghệ Bách khoa"
            subtitle="Sân khấu pitching thường niên nơi các nhóm dự án sinh viên thuyết trình giải pháp, chứng minh năng lực thương mại và gọi vốn trước hội đồng chuyên gia, cựu sinh viên và quỹ đầu tư."
          />
        </div>

        {/* Mechanism Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 w-fit">
              <Flame className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-[#10182D]">Pitching Áp lực Cao</h4>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              Mỗi đội có 5 phút thuyết trình và 7 phút trả lời chất vấn trực tiếp từ hội đồng các Shark về mô hình kỹ thuật và tính khả thi tài chính.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#1749B5] w-fit">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-[#10182D]">Cam kết Vốn Thực tế</h4>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              Các Shark trực tiếp đưa ra lời đề nghị đầu tư vốn hạt giống, bảo trợ trang thiết bị lab hoặc thỏa thuận bao tiêu sản phẩm đầu ra.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
              <Building2 className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-[#10182D]">Bảo trợ Vườn ươm</h4>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              Các dự án xuất sắc được nhận vào chương trình ươm tạo chính thức của Trường ĐH Bách khoa và các đối tác vườn ươm khởi nghiệp.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'all' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả các mùa ({sampleSeasons.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'active' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mùa đang diễn ra
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'completed' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lịch sử các mùa trước
            </button>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            DUT • BK-IC Pitching Stage
          </span>
        </div>

        {/* Seasons Grid */}
        {filteredSeasons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeasons.map((season) => (
              <div
                key={season.season}
                className="group flex flex-col justify-between rounded-3xl border border-[#E2E6EE] bg-white p-6 sm:p-7 shadow-xs hover:border-[#6B9DFF] hover:shadow-md transition duration-300"
              >
                <div className="space-y-4">
                  {/* Season Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#10182D] text-white">
                      MÙA {season.year}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        season.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {season.status === 'active' ? '• Mùa hiện tại' : '• Đã hoàn thành'}
                    </span>
                  </div>

                  {/* Title & Theme */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#10182D] group-hover:text-[#1749B5] transition">
                      <Link to={`/activities/bk-shark/${season.season}`}>
                        BK Shark {season.year}
                      </Link>
                    </h3>
                    <div className="text-xs font-medium text-[#1749B5]">
                      Chủ đề: {season.theme}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
                    {season.summary}
                  </p>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 space-y-0.5">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Dự án Pitching</div>
                      <div className="font-bold text-[#10182D]">{season.pitchesCount} Dự án</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 space-y-0.5">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Cam kết vốn</div>
                      <div className="font-bold text-[#1749B5] truncate">{season.totalCommitment}</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    to={`/activities/bk-shark/${season.season}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1749B5] hover:text-[#10182D] transition group-hover:translate-x-0.5"
                  >
                    <span>Xem hồ sơ &amp; Kết quả Mùa {season.year}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-[#F8FAFC] p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-[#10182D]">Chưa có mùa pitching nào trong danh mục này</h4>
          </div>
        )}

        {/* CTA Transition */}
        <CTASection
          eyebrow="THAM GIA HỘI ĐỒNG SHARK"
          title="Đồng hành cùng Sân khấu BK Shark với vai trò Nhà đầu tư"
          description="Cựu sinh viên thành đạt và các quỹ đầu tư mong muốn tiếp cận nguồn ý tưởng công nghệ tiềm năng của sinh viên Bách khoa có thể liên hệ trực tiếp Ban Chủ nhiệm."
          primaryText="Đăng ký Hợp tác Nhà đầu tư"
          primaryTo="/partnership"
          secondaryText="Xem Dự án đồng hành"
          secondaryTo="/activities/companion-projects"
        />
      </div>
    </div>
  );
};
