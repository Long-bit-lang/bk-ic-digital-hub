// BK-IC Tab 6: Tuyển thành viên (Recruitment Hub)
// Dynamic recruitment status, 3 units overview, 4-round roadmap, FAQ accordion & JoinPage integration
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { ActivityCountdown } from '../../../components/activities/ActivityCountdown';
import { 
  CLUB_UNITS_DATA, 
  RECRUITMENT_ROADMAP_STEPS, 
  RECRUITMENT_FAQS, 
  type ClubUnitDetail 
} from '../../../data/activitiesData';
import { 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ExternalLink, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle,
  Layers
} from 'lucide-react';

export const RecruitmentTab: React.FC = () => {
  const { siteSettings } = useApp();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const todayStr = new Date().toISOString().split('T')[0];
  const isStarted = !siteSettings.recruitmentStartDate || todayStr >= siteSettings.recruitmentStartDate;
  const isExpired = !!siteSettings.recruitmentDeadline && todayStr > siteSettings.recruitmentDeadline;
  const isOpen = siteSettings.recruitmentStatus === 'open' && isStarted && !isExpired;
  const fanpageUrl = siteSettings.recruitmentFanpageUrl || 'https://www.facebook.com/dut.bkic';

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: RECRUITMENT HERO & DYNAMIC STATUS */}
      <ScrollReveal direction="up" distance={20} duration={0.65}>
        <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>CỔNG TUYỂN QUÂN CHÍNH THỨC • BK-IC DUT</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10182D] tracking-tight leading-tight">
                Trở thành một phần của BK-IC
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {siteSettings.recruitmentDescription ||
                  'Gia nhập cộng đồng sinh viên đam mê công nghệ, ươm mầm các ý tưởng khởi nghiệp và cùng nhau kiến tạo những sản phẩm giải quyết bài toán thực tế.'}
              </p>

              {/* Status Banner */}
              <div className="pt-2">
                {isOpen ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Đợt Tuyển Thành Viên Mới Đang Mở Đơn!</span>
                    </div>
                    <p className="text-slate-600">
                      Hạn chót tiếp nhận hồ sơ trực tuyến: <span className="font-semibold text-slate-900">{siteSettings.recruitmentDeadline}</span>
                    </p>
                    {siteSettings.recruitmentDeadline && (
                      <div className="pt-1">
                        <ActivityCountdown
                          deadlineIso={`${siteSettings.recruitmentDeadline}T23:59:59`}
                          compact={true}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>Đợt tuyển thành viên hiện đang đóng</span>
                    </div>
                    <p className="text-slate-500">
                      Đợt tuyển thành viên mới chưa mở hoặc đã kết thúc. Hãy theo dõi Fanpage chính thức của BK-IC để cập nhật thông tin về đợt tuyển tiếp theo!
                    </p>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {isOpen ? (
                  <Link
                    to="/join"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                  >
                    <span>Nộp đơn Ứng tuyển Ngay</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <a
                    href={fanpageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
                  >
                    <span>Theo dõi Fanpage BK-IC</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <Link
                  to="/join"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  <span>Tra cứu trạng thái hồ sơ</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Quick Stats Card */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#10182D]">Quyền lợi Thành viên BK-IC</h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Quyền làm việc tại Không gian Sáng tạo và phòng lab chế tạo Khu A</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Hỗ trợ kinh phí mua sắm linh kiện và vật tư chế tạo mẫu thử (prototype)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Được đào tạo 1-1 cùng giảng viên cố vấn và chuyên gia doanh nghiệp</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Cộng điểm rèn luyện và cơ hội thực tập tại các doanh nghiệp đối tác</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 2: CƠ CẤU 3 BAN CHUYÊN TRÁCH */}
      <ScrollReveal direction="up" distance={20} delay={0.08} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Cơ Cấu Tổ Chức
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Khám phá 3 Ban Chuyên Trách tại BK-IC
            </h3>
            <p className="text-xs text-slate-500">
              Mỗi ban có vai trò, nhiệm vụ và môi trường rèn luyện kỹ năng chuyên biệt phù hợp với thế mạnh của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLUB_UNITS_DATA.map((unit) => (
              <div
                key={unit.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100">
                    {unit.badge}
                  </span>

                  <h4 className="text-lg font-bold text-[#10182D]">
                    {unit.fullName}
                  </h4>

                  <p className="text-xs text-[#5E6573] leading-relaxed">
                    {unit.roleDescription}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 block">Nhiệm vụ chính:</span>
                    {unit.keyResponsibilities.map((resp, ri) => (
                      <div key={ri} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <span className="text-[#0284C7] font-bold">•</span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 block">Kỹ năng phù hợp:</span>
                    <p>{unit.idealSkills.join(', ')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/join"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 text-[#0284C7] font-bold text-xs border border-slate-200 hover:border-sky-200 transition"
                  >
                    <span>Ứng tuyển ban này</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: LỘ TRÌNH 4 VÒNG TUYỂN QUÂN */}
      <ScrollReveal direction="up" distance={20} delay={0.12} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Lộ Trình Tuyển Dụng
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Quy trình Tuyển quân 4 Vòng Chuẩn mực
            </h3>
            <p className="text-xs text-slate-500">
              Công tâm, minh bạch và tạo điều kiện tối đa để ứng viên thể hiện năng lực bản thân.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RECRUITMENT_ROADMAP_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-md transition space-y-3"
              >
                <div className="h-9 w-9 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs border border-sky-100 shadow-2xs">
                  {step.step}
                </div>
                <h4 className="text-sm font-bold text-[#10182D]">
                  {step.title}
                </h4>
                <p className="text-xs text-[#5E6573] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 4: FAQ ACCORDION */}
      <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Giải Đáp Thắc Mắc
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Câu hỏi Thường gặp về Tuyển quân BK-IC
            </h3>
          </div>

          <div className="space-y-3">
            {RECRUITMENT_FAQS.map((faq, idx) => {
              const isOpenItem = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpenItem ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-[#0284C7] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpenItem ? 'rotate-180 text-[#0284C7]' : ''
                      }`}
                    />
                  </button>

                  {isOpenItem && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 5: CTA VÀO QUY TRÌNH JOINPAGE */}
      <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
        <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-r from-sky-50 via-white to-blue-50 p-8 sm:p-10 text-center space-y-4 shadow-xs">
          <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
            Sẵn sàng Đồng hành cùng BK-IC?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Hệ thống nộp đơn và tra cứu hồ sơ chính thức được đồng bộ hoàn toàn qua cổng tuyển quân của CLB.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
            >
              <span>Truy cập Cổng nộp đơn ứng tuyển</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default RecruitmentTab;

