// BK-IC About Page - Institutional & Authentic University Affiliation
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ExternalLink,
  Users,
  Award,
  Compass,
  ArrowRight,
  BookOpen,
  Building2,
  Shield,
  Cpu,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const units = [
    {
      code: 'BCN',
      name: 'Ban Chủ nhiệm',
      badgeClass: 'bg-blue-50 text-[#245BFA] border-blue-200',
      accentColor: 'text-[#245BFA]',
      icon: Shield,
      desc: 'Cơ quan lãnh đạo cao nhất, chịu trách nhiệm pháp lý và định hướng chiến lược trước Nhà trường.',
      duties: [
        'Chỉ đạo chiến lược dài hạn và ký duyệt các quyết định quan trọng',
        'Phê duyệt kế hoạch ngân sách và phân bổ nguồn lực toàn diện',
        'Đại diện đối ngoại với Nhà trường, Hội đồng Cố vấn & Doanh nghiệp'
      ],
    },
    {
      code: 'BĐH',
      name: 'Ban Điều hành',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'text-emerald-600',
      icon: Cpu,
      desc: 'Cơ quan điều hành chuyên môn, chịu trách nhiệm học liệu kỹ thuật, sinh hoạt thứ Ba và ươm tạo dự án.',
      duties: [
        'Tổ chức các buổi sinh hoạt định kỳ thứ Ba và Workshop công nghệ',
        'Bảo trợ và quản lý tiến độ các dự án nghiên cứu khoa học sinh viên',
        'Điều phối diễn giả, cố vấn chuyên môn và tài liệu học tập'
      ],
    },
    {
      code: 'BTV',
      name: 'Ban Thành viên',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentColor: 'text-indigo-600',
      icon: UserCheck,
      desc: 'Cơ quan nhân sự số hóa, vận hành hệ thống điểm danh QR, kiểm soát chuyên cần và văn hóa nội bộ.',
      duties: [
        'Quản lý hồ sơ định danh số thành viên trên BK-IC Digital Hub',
        'Vận hành hệ thống điểm danh QR động, xử lý vé phạt và khiếu nại',
        'Chăm lo đời sống nội bộ, văn hóa gắn kết và đánh giá rèn luyện'
      ],
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA]">
            <Building2 className="h-3.5 w-3.5" />
            <span>TRƯỜNG ĐẠI HỌC BÁCH KHOA – ĐẠI HỌC ĐÀ NẴNG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101828]">
            Về Bách Khoa Innovation Club (BK-IC)
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo — Nôi ươm mầm tinh thần doanh nhân công nghệ và kết nối sinh viên kỹ thuật Bách khoa Đà Nẵng với hệ sinh thái khởi nghiệp quốc gia.
          </p>
        </div>

        {/* Provenance Box: Báo Đà Nẵng Citation */}
        <div className="rounded-2xl border border-blue-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Hồ sơ Xuất xứ & Xác thực Pháp lý</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Ghi nhận chính thức từ Báo Đà Nẵng (04/04/2026)
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Theo bài viết <em className="text-slate-800">"Thúc đẩy liên kết trong khởi nghiệp"</em> xuất bản ngày 04/04/2026 trên Báo Đà Nẵng, Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo - Bách Khoa Innovation Club (BK-IC) chính thức được ra mắt nhằm tạo môi trường kết nối đa ngành, chuyển giao công nghệ sinh viên và đóng góp giải pháp đổi mới cho thành phố.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
            <div>
              <span className="text-slate-500 block">Tên tiếng Việt:</span>
              <span className="font-semibold text-slate-800">Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tên quốc tế:</span>
              <span className="font-semibold text-slate-800">Bách Khoa Innovation Club (BK-IC)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Đơn vị chủ quản:</span>
              <span className="font-semibold text-slate-800">Trường Đại học Bách khoa – ĐHĐN (DUT)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Trụ sở hoạt động:</span>
              <span className="font-semibold text-slate-800">54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng</span>
            </div>
          </div>

          <a
            href="https://baodanang.vn/thuc-day-lien-ket-trong-khoi-nghiep-3330893.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#245BFA] hover:underline"
          >
            <span>Đọc nguyên văn bài báo trên Báo Đà Nẵng điện tử</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#245BFA]">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tầm nhìn</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Trở thành cộng đồng đổi mới sáng tạo sinh viên hàng đầu miền Trung, nơi mỗi ý tưởng táo bạo của sinh viên Bách khoa được tiếp sức bằng cố vấn chuyên môn, công cụ kỹ thuật và nguồn lực thực tiễn để vươn tầm thị trường.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Sứ mệnh</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Thúc đẩy tư duy khởi nghiệp trong học tập và nghiên cứu; hỗ trợ thương mại hóa đề tài nghiên cứu khoa học; đào tạo thế hệ kỹ sư giàu bản lĩnh, chủ động thích ứng và dẫn dắt cuộc cách mạng chuyển đổi số.
            </p>
          </div>
        </div>

        {/* 3 Units Organizational Structure */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA] mb-2 font-mono">
                <Users className="h-3.5 w-3.5" />
                <span>BỘ MÁY TỔ CHỨC CHÍNH THỨC</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
                Cơ cấu 3 Ban Vận hành BK-IC
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Bộ máy tinh gọn gồm 3 ban chức năng đảm bảo tính minh bạch, chuyên môn hóa và hiệu quả vận hành tối đa.
              </p>
            </div>

            <Link
              to="/#organization"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245BFA] hover:text-blue-800 transition shrink-0"
            >
              <span>Xem sơ đồ cây trực quan trên Trang chủ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 3 Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {units.map((unit) => {
              const Icon = unit.icon;
              return (
                <div
                  key={unit.code}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs space-y-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${unit.badgeClass}`}>
                        {unit.code}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        DUT • 2026
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 text-slate-800">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {unit.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {unit.desc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                        Nhiệm vụ chính:
                      </div>
                      <ul className="space-y-1.5">
                        {unit.duties.map((duty, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{duty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Phân quyền độc lập</span>
                    <span className="text-blue-600 font-semibold">Chính thức</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Mentorship & Values */}
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
              <BookOpen className="h-4 w-4" />
              <span>HỘI ĐỒNG CỐ VẤN KHOA HỌC & KHỞI NGHIỆP</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Chỗ dựa chuyên môn vững chắc từ DUT
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              BK-IC nhận được sự bảo trợ và cố vấn trực tiếp từ các thầy cô giảng viên tâm huyết thuộc các khoa nòng cốt
              (Khoa CNTT, Khoa Điện tử - Viễn thông, Khoa Cơ khí, Khoa Quản lý Dự án...) cùng các chuyên gia ươm tạo khởi nghiệp tại TP. Đà Nẵng.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-6 py-3 text-xs font-bold text-white hover:bg-blue-600 transition shadow-xs"
              >
                <span>Đăng ký tham gia thế hệ thành viên tiếp theo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
