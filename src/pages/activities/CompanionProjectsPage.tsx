// BK-IC Companion Projects Listing — Minimalist Editorial
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { CTASection } from '../../components/editorial/CTASection';
import { Rocket, Layers, Users, ArrowRight, Inbox, Search } from 'lucide-react';

export interface ProjectItem {
  slug: string;
  title: string;
  field: string;
  stage: string;
  leadName: string;
  faculty: string;
  summary: string;
  year: string;
}

export const sampleProjects: ProjectItem[] = [
  {
    slug: 'smart-campus-energy-monitor',
    title: 'Hệ thống Giám sát & Tối ưu Năng lượng Khuôn viên Đại học (Smart Campus Energy)',
    field: 'GreenTech & IoT',
    stage: 'Thử nghiệm thực tế (Pilot Testing)',
    leadName: 'Nhóm nghiên cứu Sinh viên Khoa Điện – Điện tử',
    faculty: 'Khoa Điện & Khoa CNTT, DUT',
    summary: 'Thu thập dữ liệu tiêu thụ điện năng từ hơn 50 phòng học, áp dụng thuật toán dự đoán tải để tự động điều chỉnh hệ thống làm mát.',
    year: '2026'
  },
  {
    slug: 'ai-defect-inspection-robot',
    title: 'Robot Tự hành Kiểm tra Khuyết tật Sản phẩm bằng Thị giác máy tính',
    field: 'Robotics & AI',
    stage: 'Nguyên mẫu khả dụng (MVP)',
    leadName: 'Nhóm SV Khởi nghiệp Cơ điện tử',
    faculty: 'Khoa Cơ khí & Viện Khoa học Công nghệ',
    summary: 'Giải pháp robot AGV tích hợp camera công nghiệp và mô hình nhận diện khuyết tật bề mặt kim loại với độ chính xác trên 98.5%.',
    year: '2025'
  },
  {
    slug: 'digital-health-telemedicine',
    title: 'Nền tảng Y tế Số & Hỗ trợ Chẩn đoán Từ xa cho Vùng sâu vùng xa',
    field: 'HealthTech',
    stage: 'Ươm tạo giai đoạn 1',
    leadName: 'Nhóm SV Kỹ thuật Y sinh & Phần mềm',
    faculty: 'Khoa Công nghệ Thông tin, DUT',
    summary: 'Ứng dụng di động kết nối thiết bị đo nhịp tim/huyết áp giá rẻ qua Bluetooth, truyền dữ liệu bảo mật lên đám mây phục vụ bác sĩ gia đình.',
    year: '2026'
  }
];

export const CompanionProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pilot' | 'mvp'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = sampleProjects.filter((p) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'pilot' && p.stage.includes('Pilot')) ||
      (filter === 'mvp' && p.stage.includes('MVP'));
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hoạt động', to: '/activities' },
            { label: 'Dự án đồng hành' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="DỰ ÁN ĐỒNG HÀNH • BK-IC DUT"
            title="Vườn ươm Sản phẩm Công nghệ Sinh viên"
            subtitle="Danh mục các dự án nghiên cứu ứng dụng và khởi nghiệp do sinh viên Trường ĐH Bách khoa phát triển, được BK-IC đồng hành bảo trợ và ươm tạo."
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
              Tất cả ({sampleProjects.length})
            </button>
            <button
              onClick={() => setFilter('pilot')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'pilot' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Thử nghiệm thực tế
            </button>
            <button
              onClick={() => setFilter('mvp')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'mvp' ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nguyên mẫu (MVP)
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm dự án theo tên, lĩnh vực..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1749B5]"
            />
          </div>
        </div>

        {/* Listing Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.slug}
                className="group flex flex-col justify-between rounded-3xl border border-[#E2E6EE] bg-white p-6 sm:p-7 shadow-xs hover:border-[#6B9DFF] hover:shadow-md transition duration-300"
              >
                <div className="space-y-4">
                  {/* Field & Stage */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1749B5] border border-blue-100">
                      {proj.field}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      Năm: {proj.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug group-hover:text-[#1749B5] transition">
                    <Link to={`/activities/companion-projects/${proj.slug}`}>
                      {proj.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed line-clamp-3">
                    {proj.summary}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium">Giai đoạn:</span>
                      <strong className="text-slate-800">{proj.stage}</strong>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium">Đội ngũ:</span>
                      <span className="truncate">{proj.leadName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    to={`/activities/companion-projects/${proj.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1749B5] hover:text-[#10182D] transition group-hover:translate-x-0.5"
                  >
                    <span>Xem thông tin dự án</span>
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
              <h4 className="text-base font-bold text-[#10182D]">Chưa có dự án nào trong mục này</h4>
              <p className="text-xs sm:text-sm text-[#5E6573] max-w-md mx-auto">
                Hồ sơ các dự án được chọn lọc vào vườn ươm sẽ được hiển thị công khai tại đây.
              </p>
            </div>
          </div>
        )}

        {/* CTA Transition */}
        <CTASection
          eyebrow="ĐỒNG HÀNH DỰ ÁN"
          title="Tài trợ hoặc Đầu tư vào các Dự án Sinh viên"
          description="Doanh nghiệp hoặc cựu sinh viên có thể xem Catalogue dự án chi tiết và tham gia bảo trợ nguồn lực kỹ thuật."
          primaryText="Xem Catalogue Dự án"
          primaryTo="/partnership/companion-project"
          secondaryText="Sân khấu BK Shark"
          secondaryTo="/activities/bk-shark"
        />
      </div>
    </div>
  );
};

