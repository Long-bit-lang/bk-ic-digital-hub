// BK-IC Recruitment Overview Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
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
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          { label: 'Tuyển thành viên' }
        ]}
        eyebrow="TUYỂN THÀNH VIÊN • GEN 2026 • DUT"
        title="Gia nhập Thế hệ"
        titleHighlight="Đổi mới Sáng tạo Bách khoa"
        subtitle="Cơ hội trở thành thành viên chính thức của BachKhoa Innovation and Entrepreneurship Club – nơi ươm dưỡng tư duy công nghệ, khả năng lãnh đạo và tinh thần khởi nghiệp thực chiến."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* 4-Step Recruitment Roadmap */}
        <div className="space-y-6">
          <ScrollReveal direction="up" distance={16} duration={0.5}>
            <h3 className="text-2xl font-bold text-[#10182D] tracking-tight">
              Lộ trình Tuyển quân 4 Vòng Chuẩn mực
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" distance={20} delay={0} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <div className="h-9 w-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs shadow-2xs border border-sky-100">
                  01
                </div>
                <h4 className="text-base font-bold text-[#10182D]">Nộp Hồ sơ Ứng tuyển</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Ứng viên điền thông tin cá nhân, định hướng ban nguyện vọng và đính kèm CV hoặc Portfolio sản phẩm.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <div className="h-9 w-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs shadow-2xs border border-sky-100">
                  02
                </div>
                <h4 className="text-base font-bold text-[#10182D]">Phỏng vấn Chuyên môn</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Trao đổi trực tiếp cùng Ban Chủ nhiệm và Trưởng các ban chuyên môn về mục tiêu và kỹ năng thực tế.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <div className="h-9 w-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs shadow-2xs border border-sky-100">
                  03
                </div>
                <h4 className="text-base font-bold text-[#10182D]">Thử việc &amp; Huấn luyện</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Giai đoạn làm quen văn hóa CLB (Onboarding), tham gia buổi tập huấn sinh hoạt thứ Ba và thực hiện miniproject.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.24} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shadow-2xs border border-emerald-100">
                  04
                </div>
                <h4 className="text-base font-bold text-[#10182D]">Kết nạp Chính thức</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Cấp tài khoản định danh trên Cổng thành viên BK-IC Digital Hub và chính thức nhận nhiệm vụ dự án.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* 3 Units Overview */}
        <div className="space-y-6">
          <ScrollReveal direction="up" distance={16} duration={0.5}>
            <h3 className="text-2xl font-bold text-[#10182D] tracking-tight">
              Các Ban Chuyên môn Tuyển dụng
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal direction="up" distance={20} delay={0} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200/60">
                  BCN • BAN CHỦ NHIỆM
                </span>
                <h4 className="text-base font-bold text-[#10182D]">Hoạch định &amp; Đối ngoại</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Chịu trách nhiệm chiến lược phát triển CLB, duy trì mối quan hệ đối tác cùng Đoàn trường, giảng viên cố vấn và doanh nghiệp.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.1} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  BĐH • BAN ĐIỀU HÀNH
                </span>
                <h4 className="text-base font-bold text-[#10182D]">Kỹ thuật &amp; Dự án Đổi mới</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Thực thi các dự án đồng hành, nghiên cứu phát triển công nghệ (AI, IoT, Web/App) và phụ trách kỹ thuật cho các cuộc thi.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
              <div className="p-7 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  BTV • BAN THÀNH VIÊN
                </span>
                <h4 className="text-base font-bold text-[#10182D]">Nhân sự &amp; Hoạt động Nội bộ</h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  Tổ chức các buổi sinh hoạt định kỳ, điều phối hoạt động thành viên, điểm danh thông minh qua mã QR và quản trị văn hóa CLB.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Structural Form Area Notice */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <div className="rounded-3xl border border-[#0284C7]/20 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-8 sm:p-10 space-y-4 text-center max-w-3xl mx-auto shadow-xs">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
              <BookmarkCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-[#10182D]">
                Cổng Đăng ký Trực tuyến Đợt Tuyển quân Tiếp theo
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed max-w-xl mx-auto">
                Hệ thống form ứng tuyển trực tuyến và tải lên CV/Portfolio sẽ được kích hoạt tại đây khi Ban Chủ nhiệm chính thức phát động đợt tuyển sinh viên mới.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0284C7] hover:text-[#075985] hover:underline"
              >
                <span>Tìm hiểu thêm về Cơ cấu tổ chức BK-IC</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Transition */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <CTASection
            eyebrow="TÌM HIỂU HOẠT ĐỘNG"
            title="Khám phá các hoạt động nổi bật của CLB"
            description="Tham gia các buổi workshop thường niên và theo dõi các dự án công nghệ đang trong giai đoạn ươm tạo."
            primaryText="Xem Danh mục Workshop"
            primaryTo="/activities/workshops"
            secondaryText="Về Trang chủ"
            secondaryTo="/"
          />
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
