// BK-IC About Page — Section 06: Interactive Hierarchical Organizational Structure
import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Cpu, 
  FolderGit2, 
  Megaphone, 
  Handshake, 
  UserCheck, 
  CheckCircle2, 
  ChevronRight, 
  Users, 
  Sparkles,
  Info
} from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

interface DepartmentDetail {
  code: string;
  name: string;
  roleTitle: string;
  leader: string;
  badgeClass: string;
  accentBorder: string;
  icon: React.ComponentType<{ className?: string }>;
  roleSummary: string;
  duties: string[];
  focusPillars: string[];
}

const DEPARTMENTS: DepartmentDetail[] = [
  {
    code: 'BCN',
    name: 'Ban Chủ nhiệm',
    roleTitle: 'Lãnh đạo Chiến lược & Pháp lý',
    leader: 'Chủ nhiệm CLB: Phạm Lê Tú',
    badgeClass: 'bg-blue-50 text-[#1749B5] border-blue-200',
    accentBorder: 'border-[#1749B5]',
    icon: Shield,
    roleSummary: 'Cơ quan lãnh đạo cao nhất của câu lạc bộ, chịu trách nhiệm pháp lý và định hướng chiến lược trước Đoàn Thanh niên – Hội Sinh viên Nhà trường.',
    duties: [
      'Chỉ đạo chiến lược dài hạn và ký duyệt các quyết định quan trọng của CLB.',
      'Phê duyệt kế hoạch ngân sách và phân bổ nguồn lực vận hành toàn diện.',
      'Đại diện đối ngoại cấp cao với Nhà trường, Hội đồng Cố vấn & Doanh nghiệp đối tác.',
      'Giám sát tiến độ và hiệu quả của tất cả các ban chuyên trách.'
    ],
    focusPillars: ['Chiến lược phát triển', 'Pháp lý & Ngân sách', 'Đối ngoại cấp cao']
  },
  {
    code: 'BĐH',
    name: 'Ban Điều hành',
    roleTitle: 'Điều phối Vận hành Thường nhật',
    leader: 'Trưởng ban: Lê Anh Khoa',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentBorder: 'border-emerald-500',
    icon: Cpu,
    roleSummary: 'Cơ quan quản lý và điều hành các hoạt động chuyên môn thường nhật, chịu trách nhiệm lịch sinh hoạt thứ Ba và các workshop đào tạo kỹ thuật.',
    duties: [
      'Xây dựng kế hoạch và tổ chức các buổi sinh hoạt định kỳ thứ Ba hàng tuần.',
      'Điều phối tài liệu học tập, học liệu kỹ thuật và diễn giả chuyên gia.',
      'Theo dõi tiến độ triển khai các chương trình hành động của CLB.',
      'Cầu nối tác chiến giữa Ban Chủ nhiệm và các nhóm dự án sinh viên.'
    ],
    focusPillars: ['Sinh hoạt thứ Ba', 'Workshop kỹ thuật', 'Điều phối tổng thể']
  },
  {
    code: 'BCM',
    name: 'Ban Chuyên môn & Dự án',
    roleTitle: 'Thẩm định Kỹ thuật & Ươm tạo R&D',
    leader: 'Phụ trách: Bộ phận Chuyên môn & Cố vấn Kỹ thuật',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentBorder: 'border-indigo-500',
    icon: FolderGit2,
    roleSummary: 'Bộ phận chuyên sâu về giải pháp công nghệ, bảo trợ kỹ thuật cho các đề tài nghiên cứu khoa học và phát triển mẫu thử (prototype) sản phẩm.',
    duties: [
      'Thẩm định tính khả thi kỹ thuật và công nghệ của các ý tưởng khởi nghiệp.',
      'Hỗ trợ không gian phòng Lab, thiết bị đo kiểm và máy in 3D hoàn thiện sản phẩm.',
      'Định hướng học thuật cho các nhóm tham gia kỳ thi NCKH cấp Trường và Quốc gia.',
      'Cố vấn trực tiếp các công nghệ then chốt: AI biên, Embedded IoT, CleanTech.'
    ],
    focusPillars: ['Ươm tạo Prototype', 'Thẩm định NCKH', 'Hỗ trợ kỹ thuật Lab']
  },
  {
    code: 'BTT',
    name: 'Ban Truyền thông & Sự kiện',
    roleTitle: 'Lan tỏa Thương hiệu & Tổ chức Sự kiện',
    leader: 'Phụ trách: Trưởng ban Truyền thông & Media Team',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    accentBorder: 'border-rose-500',
    icon: Megaphone,
    roleSummary: 'Đơn vị kiến tạo bản sắc truyền thông của BK-IC, truyền tải tinh thần đổi mới sáng tạo và chịu trách nhiệm tổ chức các sự kiện quy mô lớn.',
    duties: [
      'Sản xuất ấn phẩm hình ảnh, video và quản trị các kênh truyền thông chính thức.',
      'Lập kế hoạch truyền thông cho các giải đấu, workshop và đợt tuyển quân.',
      'Điều phối hậu cần, sân khấu và trải nghiệm người tham gia tại sự kiện.',
      'Lan tỏa câu chuyện thành công của các dự án và thành viên BK-IC.'
    ],
    focusPillars: ['Thương hiệu số', 'Sản xuất Media', 'Hậu cần sự kiện']
  },
  {
    code: 'BĐN',
    name: 'Ban Đối ngoại & Hợp tác',
    roleTitle: 'Mạng lưới Đối tác & Nguồn lực Doanh nghiệp',
    leader: 'Phụ trách: Trưởng ban Đối ngoại & Quan hệ Hợp tác',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    accentBorder: 'border-amber-500',
    icon: Handshake,
    roleSummary: 'Cầu nối chủ động giữa sinh viên Bách khoa với doanh nghiệp công nghệ, vườn ươm khởi nghiệp và mạng lưới chuyên gia trong nước và quốc tế.',
    duties: [
      'Tìm kiếm nguồn tài trợ tài chính và trang thiết bị cho các cuộc thi, dự án.',
      'Xây dựng thoả thuận hợp tác với các vườn ươm, quỹ đầu tư hạt giống.',
      'Mời các chuyên gia, diễn giả và ban giám khảo chất lượng cao.',
      'Mở rộng cơ hội việc làm và thực tập cho thành viên xuất sắc.'
    ],
    focusPillars: ['Tài trợ dự án', 'Mạng lưới vườn ươm', 'Cơ hội nghề nghiệp']
  },
  {
    code: 'BTV',
    name: 'Ban Thành viên',
    roleTitle: 'Quản trị Nhân sự Số hóa & Văn hóa CLB',
    leader: 'Trưởng ban: Nguyễn Hoàng Long',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    accentBorder: 'border-purple-500',
    icon: UserCheck,
    roleSummary: 'Cơ quan nhân sự số hóa, vận hành nền tảng BK-IC Digital Hub, kiểm soát chuyên cần qua QR động và chăm lo đời sống nội bộ.',
    duties: [
      'Quản lý hồ sơ định danh số thành viên trên hệ thống BK-IC Digital Hub.',
      'Vận hành hệ thống điểm danh QR động, xử lý vé phạt và khiếu nại chuyên cần.',
      'Chăm lo đời sống tinh thần, tổ chức hoạt động teambuilding và gắn kết.',
      'Tổng hợp dữ liệu rèn luyện và đề xuất giấy chứng nhận nhiệm kỳ chính thức.'
    ],
    focusPillars: ['Hồ sơ số hóa', 'Điểm danh QR động', 'Văn hóa gắn kết']
  }
];

export const AboutOrgStructureSection: React.FC = () => {
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('BCN');

  const selectedDept = DEPARTMENTS.find((d) => d.code === selectedDeptCode) || DEPARTMENTS[0];
  const SelectedIcon = selectedDept.icon;

  return (
    <section id="structure" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="06 • CƠ CẤU TỔ CHỨC"
        title="Tổ chức chuyên nghiệp – Vận hành hiệu quả"
        subtitle="BK-IC được tổ chức với Ban Chủ nhiệm và các ban chuyên trách, đảm nhiệm những chức năng khác nhau trong quá trình quản lý, điều phối và triển khai hoạt động của câu lạc bộ. Nhấn vào từng ban để xem chi tiết vai trò và nhiệm vụ."
      />

      <div className="mt-8 space-y-8">
        {/* Hierarchical Structure Visual Diagram */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-sm text-center">
          {/* Level 0: Sponsoring Institution */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <Building2 className="h-4 w-4 text-[#1749B5]" />
            <span>ĐOÀN THANH NIÊN – HỘI SINH VIÊN TRƯỜNG ĐH BÁCH KHOA (DUT)</span>
          </div>

          {/* Vertical Connecting Stem */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-300 to-[#1749B5] mx-auto my-2" />

          {/* Department Selection Pills / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              const isSelected = dept.code === selectedDeptCode;
              return (
                <button
                  key={dept.code}
                  type="button"
                  onClick={() => setSelectedDeptCode(dept.code)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#1749B5] bg-blue-50/70 shadow-sm ring-2 ring-[#1749B5]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${dept.badgeClass}`}>
                      {dept.code}
                    </span>
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#1749B5]' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-[#1749B5]' : 'text-slate-800'}`}>
                      {dept.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                      {dept.roleTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level 3: Members Base Indicator */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-[#1749B5] to-slate-300 mx-auto my-2" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-500">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>Thành viên nòng cốt • Cộng tác viên • Các nhóm dự án khởi nghiệp sinh viên</span>
          </div>
        </div>

        {/* Selected Department Comprehensive Detail Card */}
        <div className="rounded-3xl border border-[#1749B5]/30 bg-gradient-to-br from-white via-blue-50/20 to-white p-6 sm:p-8 shadow-md shadow-blue-950/5 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
            {/* Left Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#1749B5] text-white flex items-center justify-center shadow-md shadow-blue-700/20">
                  <SelectedIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${selectedDept.badgeClass}`}>
                      {selectedDept.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">DUT • Phê duyệt 2026</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#10182D]">
                    {selectedDept.name}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed max-w-2xl font-normal">
                {selectedDept.roleSummary}
              </p>
            </div>

            {/* Right Leader Chip */}
            <div className="shrink-0 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Nhân sự phụ trách
              </span>
              <strong className="text-xs sm:text-sm font-bold text-[#10182D] block">
                {selectedDept.leader}
              </strong>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Nhiệm kỳ hoạt động 2026</span>
              </div>
            </div>
          </div>

          {/* Duties Grid & Focus Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-start">
            {/* Duties List */}
            <div className="md:col-span-8 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#1749B5]" />
                <span>Chức năng và Nhiệm vụ cốt lõi</span>
              </h4>
              <ul className="space-y-2">
                {selectedDept.duties.map((duty, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475467] bg-white p-3 rounded-xl border border-slate-200/80"
                  >
                    <span className="h-5 w-5 rounded-md bg-blue-50 text-[#1749B5] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{duty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Focus Pillars */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#1749B5]" />
                <span>Trọng tâm phụ trách</span>
              </h4>
              <div className="space-y-2">
                {selectedDept.focusPillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-[#10182D] flex items-center justify-between"
                  >
                    <span>{pillar}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

