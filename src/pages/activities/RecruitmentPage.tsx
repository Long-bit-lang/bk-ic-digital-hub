// BK-IC Recruitment Overview Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/editorial/SectionHeading';
import { Breadcrumbs } from '../../components/editorial/Breadcrumbs';
import { CTASection } from '../../components/editorial/CTASection';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Layers,
  Award,
  BookmarkCheck,
  Building2,
  FileText
} from 'lucide-react';

export const RecruitmentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Hoạt động', to: '/activities' },
            { label: 'Tuyển thành viên' }
          ]}
        />

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <SectionHeading
            eyebrow="TUYỂN THÀNH VIÊN • GEN 2026"
            title="Gia nhập Thế hệ Đổi mới Sáng tạo Bách khoa"
            subtitle="Cơ hội trở thành thành viên chính thức của BachKhoa Innovation and Entrepreneurship Club – nơi ươm dưỡng tư duy công nghệ, khả năng lãnh đạo và tinh thần khởi nghiệp thực chiến."
          />
        </div>

        {/* 4-Step Recruitment Roadmap */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#10182D]">
            Lộ trình Tuyển quân 4 Vòng Chuẩn mực
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-[#1749B5] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-base font-bold text-[#10182D]">Nộp Hồ sơ Ứng tuyển</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Ứng viên điền thông tin cá nhân, định hướng ban nguyện vọng và đính kèm CV hoặc Portfolio sản phẩm.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-[#1749B5] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-base font-bold text-[#10182D]">Phỏng vấn Chuyên môn</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Trao đổi trực tiếp cùng Ban Chủ nhiệm và Trưởng các ban chuyên môn về mục tiêu và kỹ năng thực tế.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-[#1749B5] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-base font-bold text-[#10182D]">Thử việc &amp; Huấn luyện</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Giai đoạn làm quen văn hóa CLB (Onboarding), tham gia buổi tập huấn sinh hoạt thứ Ba và thực hiện miniproject.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-[#1749B5] flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h4 className="text-base font-bold text-[#10182D]">Kết nạp Chính thức</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Cấp tài khoản định danh trên Cổng thành viên BK-IC Digital Hub và chính thức nhận nhiệm vụ dự án.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Units Overview */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#10182D]">
            Các Ban Chuyên môn Tuyển dụng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1749B5] border border-blue-200">
                BCN • BAN CHỦ NHIỆM
              </span>
              <h4 className="text-base font-bold text-[#10182D]">Hoạch định &amp; Đối ngoại</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Chịu trách nhiệm chiến lược phát triển CLB, duy trì mối quan hệ đối tác cùng Đoàn trường, giảng viên cố vấn và doanh nghiệp.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                BĐH • BAN ĐIỀU HÀNH
              </span>
              <h4 className="text-base font-bold text-[#10182D]">Kỹ thuật &amp; Dự án Đổi mới</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Thực thi các dự án đồng hành, nghiên cứu phát triển công nghệ (AI, IoT, Web/App) và phụ trách kỹ thuật cho các cuộc thi.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                BTV • BAN THÀNH VIÊN
              </span>
              <h4 className="text-base font-bold text-[#10182D]">Nhân sự &amp; Hoạt động Nội bộ</h4>
              <p className="text-xs text-[#5E6573] leading-relaxed">
                Tổ chức các buổi sinh hoạt định kỳ, điều phối hoạt động thành viên, điểm danh thông minh qua mã QR và quản trị văn hóa CLB.
              </p>
            </div>
          </div>
        </div>

        {/* Structural Form Area Notice (Explicitly no form logic yet, per scope instruction) */}
        <div className="rounded-3xl border border-[#1749B5]/20 bg-blue-50/60 p-8 sm:p-10 space-y-4 text-center max-w-3xl mx-auto">
          <div className="h-10 w-10 rounded-2xl bg-[#1749B5] text-white flex items-center justify-center mx-auto shadow-sm">
            <BookmarkCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#10182D]">
              Cổng Đăng ký Trực tuyến Đợt Tuyển quân Tiếp theo
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-xl mx-auto">
              Hệ thống form ứng tuyển trực tuyến và tải lên CV/Portfolio sẽ được kích hoạt tại đây khi Ban Chủ nhiệm chính thức phát động đợt tuyển sinh viên mới.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1749B5] hover:underline"
            >
              <span>Tìm hiểu thêm về Cơ cấu tổ chức BK-IC</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* CTA Transition */}
        <CTASection
          eyebrow="TÌM HIỂU HOẠT ĐỘNG"
          title="Khám phá các hoạt động nổi bật của CLB"
          description="Tham gia các buổi workshop thường niên và theo dõi các dự án công nghệ đang trong giai đoạn ươm tạo."
          primaryText="Xem Danh mục Workshop"
          primaryTo="/activities/workshops"
          secondaryText="Về Trang chủ"
          secondaryTo="/"
        />
      </div>
    </div>
  );
};
