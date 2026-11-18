// BK-IC Digital Hub — Dedicated Companion Project Application Form
// 3-Step Guided Stepper for Student Innovation Projects & Research Teams
import React, { useState } from 'react';
import { 
  Rocket, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  FileText, 
  Link as LinkIcon, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { COMPANION_FIELDS } from '../../data/partnershipData';
import { api } from '../../services/api';

interface FormState {
  // Step 1: Team & Founder Info
  projectName: string;
  representativeName: string;
  facultyAndClass: string;
  email: string;
  phone: string;
  
  // Step 2: Project Details & Support Needs
  techField: string;
  currentStage: string;
  supportNeed: string;
  proposalContent: string;
  attachmentUrl: string;
  
  // Anti-spam honeypot
  hp_website: string;
}

export const PartnershipRequestForm: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormState>({
    projectName: '',
    representativeName: '',
    facultyAndClass: '',
    email: '',
    phone: '',
    techField: COMPANION_FIELDS[0]?.name || 'Trí tuệ Nhân tạo (AI) & Dữ liệu lớn',
    currentStage: 'Ý tưởng sơ khai (Đang xây dựng đề cương)',
    supportNeed: 'Cố vấn chuyên môn kỹ thuật & Hoàn thiện MVP',
    proposalContent: '',
    attachmentUrl: '',
    hp_website: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.projectName.trim() || formData.projectName.trim().length < 2) {
      errs.projectName = 'Vui lòng nhập tên dự án hoặc ý tưởng đề tài (tối thiểu 2 ký tự).';
    }
    if (!formData.representativeName.trim() || formData.representativeName.trim().length < 2) {
      errs.representativeName = 'Vui lòng nhập họ tên người đại diện / trưởng nhóm.';
    }
    if (!formData.facultyAndClass.trim()) {
      errs.facultyAndClass = 'Vui lòng cung cấp thông tin Khoa, Lớp hoặc Trường đang theo học.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Vui lòng nhập địa chỉ email hợp lệ.';
    }
    const phoneRegex = /^[0-9+() -]{9,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Vui lòng nhập số điện thoại hợp lệ (9 - 20 số).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.proposalContent.trim() || formData.proposalContent.trim().length < 20) {
      errs.proposalContent = 'Vui lòng mô tả ngắn gọn bài toán & giải pháp của dự án (tối thiểu 20 ký tự).';
    }
    if (formData.attachmentUrl.trim()) {
      try {
        const parsed = new URL(formData.attachmentUrl.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          errs.attachmentUrl = 'Link phải bắt đầu bằng http:// hoặc https://';
        }
      } catch {
        errs.attachmentUrl = 'Đường dẫn liên kết không hợp lệ.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: document.getElementById('request-form')?.offsetTop || 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: document.getElementById('request-form')?.offsetTop || 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      setStep(1);
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    try {
      const fullContentPayload = `[Lĩnh vực: ${formData.techField}] [Giai đoạn: ${formData.currentStage}] [Nhu cầu hỗ trợ: ${formData.supportNeed}]\n\n${formData.proposalContent.trim()}`;

      const res = await api.cms.submitPartnershipRequest({
        organizationName: formData.projectName.trim(),
        representativeName: formData.representativeName.trim(),
        position: formData.facultyAndClass.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        partnershipType: 'startup_project',
        proposalContent: fullContentPayload,
        attachmentUrl: formData.attachmentUrl.trim() || undefined,
        hp_website: formData.hp_website
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setSubmissionError(res.message || 'Không thể gửi đơn đăng ký. Vui lòng thử lại sau.');
      }
    } catch (err: any) {
      setSubmissionError(err?.message || 'Đã có lỗi xảy ra trong quá trình nộp hồ sơ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      representativeName: '',
      facultyAndClass: '',
      email: '',
      phone: '',
      techField: COMPANION_FIELDS[0]?.name || 'Trí tuệ Nhân tạo (AI) & Dữ liệu lớn',
      currentStage: 'Ý tưởng sơ khai (Đang xây dựng đề cương)',
      supportNeed: 'Cố vấn chuyên môn kỹ thuật & Hoàn thiện MVP',
      proposalContent: '',
      attachmentUrl: '',
      hp_website: ''
    });
    setErrors({});
    setSubmitted(false);
    setStep(1);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/30 to-white relative" id="request-form">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Rocket className="h-3.5 w-3.5" />
            <span>ĐƠN ĐĂNG KÝ ONLINE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Nộp Hồ Sơ Đăng Ký Dự Án Đồng Hành
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Hãy chia sẻ thông tin về ý tưởng hoặc đề tài nghiên cứu của nhóm bạn. Ban Chuyên môn BK-IC sẽ đồng hành hỗ trợ hoàn thiện giải pháp và kết nối nguồn lực.
          </p>
        </div>

        {/* Success Card */}
        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-black text-[#075985]">
                Nộp Hồ Sơ Dự Án Thành Công!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Cảm ơn nhóm tác giả <span className="font-bold text-[#0284C7]">"{formData.projectName}"</span> đã tin tưởng gửi gắm dự án. Ban Chủ nhiệm và Ban Chuyên môn BK-IC sẽ xem xét nội dung và chủ động liên hệ lại qua email hoặc số điện thoại trong 3 – 5 ngày làm việc.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-slate-700 max-w-md mx-auto space-y-1 text-left">
              <div><span className="font-bold text-[#075985]">Người đại diện:</span> {formData.representativeName}</div>
              <div><span className="font-bold text-[#075985]">Khoa / Đơn vị:</span> {formData.facultyAndClass}</div>
              <div><span className="font-bold text-[#075985]">Email:</span> {formData.email}</div>
              <div><span className="font-bold text-[#075985]">Lĩnh vực:</span> {formData.techField}</div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Gửi thêm một dự án khác</span>
            </button>
          </div>
        ) : (
          /* Form Card with Stepper */
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Stepper Progress Bar */}
            <div className="px-6 sm:px-10 py-5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              {[
                { num: 1, label: 'Thông tin Trưởng nhóm' },
                { num: 2, label: 'Ý tưởng & Nhu cầu' },
                { num: 3, label: 'Xác nhận & Nộp' }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    step === s.num
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-bold hidden sm:inline ${
                    step === s.num ? 'text-[#0284C7]' : 'text-slate-500'
                  }`}>
                    {s.label}
                  </span>
                  {idx < 2 && (
                    <div className="w-8 sm:w-16 h-0.5 bg-slate-200 mx-1 sm:mx-2 hidden xs:block" />
                  )}
                </div>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="hp_website"
                value={formData.hp_website}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Error Alert */}
              {submissionError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Không thể nộp hồ sơ: </span>
                    <span>{submissionError}</span>
                  </div>
                </div>
              )}

              {/* STEP 1: FOUNDER & TEAM INFO */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#075985] flex items-center gap-2">
                      <User className="h-4 w-4 text-[#0284C7]" />
                      <span>Bước 1: Thông tin Dự án &amp; Người đại diện</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Cung cấp thông tin cơ bản để Ban Chuyên môn liên hệ trao đổi chi tiết.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Project Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tên Dự án / Đề tài sáng tạo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder="Ví dụ: DanangBooth, Thiết bị giám sát chất lượng nước IoT..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                          errors.projectName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                        }`}
                      />
                      {errors.projectName && (
                        <p className="mt-1 text-xs text-rose-500">{errors.projectName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Representative Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Họ và tên Trưởng nhóm / Đại diện <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleChange}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                            errors.representativeName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                          }`}
                        />
                        {errors.representativeName && (
                          <p className="mt-1 text-xs text-rose-500">{errors.representativeName}</p>
                        )}
                      </div>

                      {/* Faculty / Class */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Khoa / Lớp / Trường <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="facultyAndClass"
                          value={formData.facultyAndClass}
                          onChange={handleChange}
                          placeholder="Ví dụ: Khoa CNTT - Lớp 22T_DT1 (DUT)"
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                            errors.facultyAndClass ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                          }`}
                        />
                        {errors.facultyAndClass && (
                          <p className="mt-1 text-xs text-rose-500">{errors.facultyAndClass}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Địa chỉ Email liên hệ <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tenban@sv.dut.udn.vn"
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                            errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Số điện thoại Zalo <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0905xxxxxx"
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                            errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                    >
                      <span>Tiếp tục Bước 2</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROJECT DETAILS & SUPPORT NEEDS */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#075985] flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[#0284C7]" />
                      <span>Bước 2: Chi tiết Ý tưởng &amp; Nhu cầu Hỗ trợ</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Mô tả bài toán thực tế và những gì bạn cần BK-IC đồng hành nhất.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tech Field */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Lĩnh vực Công nghệ Chính
                        </label>
                        <select
                          name="techField"
                          value={formData.techField}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                        >
                          {COMPANION_FIELDS.map((f) => (
                            <option key={f.id} value={f.name}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Current Stage */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Giai đoạn Dự án Hiện tại
                        </label>
                        <select
                          name="currentStage"
                          value={formData.currentStage}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                        >
                          <option value="Ý tưởng sơ khai (Đang xây dựng đề cương)">Ý tưởng sơ khai (Đang xây dựng đề cương)</option>
                          <option value="Đang làm PoC thử nghiệm tính khả thi">Đang làm PoC thử nghiệm tính khả thi</option>
                          <option value="Đã có sản phẩm mẫu / Prototype">Đã có sản phẩm mẫu / Prototype</option>
                          <option value="Đã có MVP hoàn chỉnh và người dùng thử">Đã có MVP hoàn chỉnh và người dùng thử</option>
                        </select>
                      </div>
                    </div>

                    {/* Support Need */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nhu cầu Mong muốn Nhất từ BK-IC
                      </label>
                      <select
                        name="supportNeed"
                        value={formData.supportNeed}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                      >
                        <option value="Cố vấn chuyên môn kỹ thuật & Hoàn thiện MVP">Cố vấn chuyên môn kỹ thuật & Hoàn thiện MVP</option>
                        <option value="Đào tạo kỹ năng Pitching & Thiết kế Slide Deck">Đào tạo kỹ năng Pitching & Thiết kế Slide Deck</option>
                        <option value="Kết nối Giảng viên / Chuyên gia đầu ngành">Kết nối Giảng viên / Chuyên gia đầu ngành</option>
                        <option value="Tìm kiếm đồng đội ghép nhóm (Lập trình viên, Thiết kế, Kinh tế)">Tìm kiếm đồng đội ghép nhóm (Lập trình viên, Thiết kế, Kinh tế)</option>
                        <option value="Hỗ trợ hồ sơ tham gia các cuộc thi khởi nghiệp lớn">Hỗ trợ hồ sơ tham gia các cuộc thi khởi nghiệp lớn</option>
                      </select>
                    </div>

                    {/* Proposal Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tóm tắt Bài toán &amp; Giải pháp Dự án <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        name="proposalContent"
                        rows={4}
                        value={formData.proposalContent}
                        onChange={handleChange}
                        placeholder="Hãy mô tả ngắn gọn: Dự án giải quyết vấn đề gì? Khách hàng mục tiêu là ai? Giải pháp công nghệ dự kiến sử dụng và điểm mới khác biệt..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                          errors.proposalContent ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.proposalContent ? (
                          <p className="text-xs text-rose-500">{errors.proposalContent}</p>
                        ) : (
                          <p className="text-[11px] text-slate-400">Tối thiểu 20 ký tự.</p>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formData.proposalContent.length}/3000
                        </span>
                      </div>
                    </div>

                    {/* Attachment Link */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Liên kết Slide Deck / Tài liệu / Video Demo (Không bắt buộc)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <LinkIcon className="h-4 w-4" />
                        </div>
                        <input
                          type="url"
                          name="attachmentUrl"
                          value={formData.attachmentUrl}
                          onChange={handleChange}
                          placeholder="https://drive.google.com/... hoặc OneDrive, Github"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                            errors.attachmentUrl ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                          }`}
                        />
                      </div>
                      {errors.attachmentUrl && (
                        <p className="mt-1 text-xs text-rose-500">{errors.attachmentUrl}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-bold transition cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Quay lại</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                    >
                      <span>Xem lại &amp; Xác nhận</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & CONFIRM */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-[#075985] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Bước 3: Xem lại Hồ sơ &amp; Xác nhận Nộp</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Vui lòng kiểm tra lại tính chính xác của các thông tin trước khi gửi về Ban Chuyên môn BK-IC.
                    </p>
                  </div>

                  {/* Review Box */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block text-xs">Tên Dự án:</span>
                        <span className="font-bold text-[#075985]">{formData.projectName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Lĩnh vực:</span>
                        <span className="font-semibold text-slate-800">{formData.techField}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Trưởng nhóm:</span>
                        <span className="font-semibold text-slate-800">{formData.representativeName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Khoa / Lớp:</span>
                        <span className="font-semibold text-slate-800">{formData.facultyAndClass}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Email:</span>
                        <span className="font-mono text-slate-700">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Số điện thoại:</span>
                        <span className="font-mono text-slate-700">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Giai đoạn:</span>
                        <span className="font-semibold text-slate-800">{formData.currentStage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Nhu cầu chính:</span>
                        <span className="font-semibold text-[#0284C7]">{formData.supportNeed}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-xs mb-1">Tóm tắt nội dung &amp; giải pháp:</span>
                      <p className="text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/60 leading-relaxed font-normal text-xs sm:text-sm">
                        {formData.proposalContent}
                      </p>
                    </div>

                    {formData.attachmentUrl && (
                      <div>
                        <span className="text-slate-400 block text-xs mb-1">Tài liệu đính kèm:</span>
                        <a
                          href={formData.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0284C7] hover:underline break-all text-xs font-mono"
                        >
                          {formData.attachmentUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-slate-600 flex items-start gap-2.5">
                    <HelpCircle className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>
                      Hồ sơ đăng ký của bạn là 100% miễn phí. Toàn bộ bản quyền ý tưởng thuộc về bạn và nhóm tác giả.
                    </span>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-bold transition cursor-pointer disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Quay lại sửa</span>
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/25 transition cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang gửi hồ sơ...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4" />
                          <span>Nộp Hồ Sơ Dự Án Ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
