// BK-IC Digital Hub — Partnership Request Form (3-Step Conversion Stepper)
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  FileText, 
  Link as LinkIcon, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  Home
} from 'lucide-react';
import { PARTNERSHIP_OPPORTUNITIES } from '../../data/partnershipData';
import { api } from '../../services/api';

interface PartnershipRequestFormProps {
  initialType?: string;
}

interface FormState {
  // Step 1
  organizationName: string;
  representativeName: string;
  position: string;
  email: string;
  phone: string;
  // Step 2
  partnershipType: string;
  proposalContent: string;
  attachmentUrl: string;
  // Anti-spam honeypot
  hp_website: string;
}

export const PartnershipRequestForm: React.FC<PartnershipRequestFormProps> = ({ initialType }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormState>({
    organizationName: '',
    representativeName: '',
    position: '',
    email: '',
    phone: '',
    partnershipType: initialType || 'sponsor',
    proposalContent: '',
    attachmentUrl: '',
    hp_website: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  // Update selected partnership type if prop changes
  useEffect(() => {
    if (initialType) {
      setFormData(prev => ({ ...prev, partnershipType: initialType }));
    }
  }, [initialType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error on edit
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Vui lòng nhập tên tổ chức hoặc doanh nghiệp.';
    } else if (formData.organizationName.trim().length < 2 || formData.organizationName.trim().length > 200) {
      newErrors.organizationName = 'Tên tổ chức phải từ 2 đến 200 ký tự.';
    }

    if (!formData.representativeName.trim()) {
      newErrors.representativeName = 'Vui lòng nhập họ và tên người đại diện.';
    } else if (formData.representativeName.trim().length < 2 || formData.representativeName.trim().length > 100) {
      newErrors.representativeName = 'Họ và tên người đại diện phải từ 2 đến 100 ký tự.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Địa chỉ email không đúng định dạng.';
    }

    const phoneRegex = /^[0-9+() -]{9,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại phải từ 9 đến 20 ký tự số.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.proposalContent.trim()) {
      newErrors.proposalContent = 'Vui lòng mô tả nội dung đề xuất hợp tác.';
    } else if (formData.proposalContent.trim().length < 20) {
      newErrors.proposalContent = 'Nội dung đề xuất cần tối thiểu 20 ký tự để BK-IC nắm bắt được nhu cầu của Quý đơn vị.';
    } else if (formData.proposalContent.trim().length > 3000) {
      newErrors.proposalContent = 'Nội dung đề xuất không được vượt quá 3000 ký tự.';
    }

    if (formData.attachmentUrl.trim()) {
      try {
        const parsed = new URL(formData.attachmentUrl.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new Error('Invalid protocol');
        }
      } catch {
        newErrors.attachmentUrl = 'Liên kết tài liệu phải bắt đầu bằng http:// hoặc https://';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrev = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.cms.submitPartnershipRequest({
        organizationName: formData.organizationName.trim(),
        representativeName: formData.representativeName.trim(),
        position: formData.position.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        partnershipType: formData.partnershipType,
        proposalContent: formData.proposalContent.trim(),
        attachmentUrl: formData.attachmentUrl.trim(),
        hp_website: formData.hp_website
      });

      if (res.success && res.request) {
        setSubmittedRequest(res.request);
      } else {
        setSubmitError(res.message || 'Gửi đề xuất không thành công. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err: any) {
      console.error('[Partnership Form Error]', err);
      setSubmitError(err.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRequest(null);
    setSubmitError(null);
    setStep(1);
    setFormData({
      organizationName: '',
      representativeName: '',
      position: '',
      email: '',
      phone: '',
      partnershipType: 'sponsor',
      proposalContent: '',
      attachmentUrl: '',
      hp_website: ''
    });
  };

  // Selected Type Label Helper
  const selectedOpportunity = PARTNERSHIP_OPPORTUNITIES.find(o => o.typeKey === formData.partnershipType);

  return (
    <section id="request-form" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Building2 className="h-3.5 w-3.5" />
            <span>KẾT NỐI HỢP TÁC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Cùng chúng tôi bắt đầu kết nối
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Hãy chia sẻ nhu cầu và đề xuất hợp tác. BK-IC sẽ tiếp nhận thông tin và liên hệ với bạn để trao đổi phương án phù hợp.
          </p>
        </div>

        {/* Success State */}
        {submittedRequest ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-sky-50/60 to-white border border-sky-200/90 shadow-xl shadow-sky-500/10 text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#10182D]">
                Gửi đề xuất hợp tác thành công!
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Ban Chủ nhiệm CLB BK-IC đã tiếp nhận đề xuất từ Quý đơn vị. Chúng tôi sẽ nghiên cứu nội dung và phản hồi trong thời gian sớm nhất.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="inline-block px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs font-mono">
              Mã tham chiếu: <span className="font-bold text-[#0284C7]">{submittedRequest.id}</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Gửi thêm đề xuất khác</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:bg-[#0369A1] transition cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Về Trang chủ BK-IC</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 p-6 sm:p-10">
            {/* Stepper Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-lg mx-auto">
                {/* Step 1 Indicator */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= 1 ? 'bg-[#0284C7] text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                  }`}>
                    1
                  </div>
                  <span className={`text-[11px] font-semibold ${step >= 1 ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                    Thông tin tổ chức
                  </span>
                </div>

                <div className={`flex-1 h-0.5 mx-3 transition-colors ${step >= 2 ? 'bg-[#0284C7]' : 'bg-slate-200'}`} />

                {/* Step 2 Indicator */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= 2 ? 'bg-[#0284C7] text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                  }`}>
                    2
                  </div>
                  <span className={`text-[11px] font-semibold ${step >= 2 ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                    Nội dung hợp tác
                  </span>
                </div>

                <div className={`flex-1 h-0.5 mx-3 transition-colors ${step >= 3 ? 'bg-[#0284C7]' : 'bg-slate-200'}`} />

                {/* Step 3 Indicator */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 3 ? 'bg-[#0284C7] text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                  }`}>
                    3
                  </div>
                  <span className={`text-[11px] font-semibold ${step === 3 ? 'text-[#0284C7]' : 'text-slate-400'}`}>
                    Xác nhận &amp; Gửi
                  </span>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-xs sm:text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Không thể gửi đề xuất</p>
                  <p className="mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anti-spam Honeypot (visually hidden, ignore autocomplete) */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="hp_website">Do not fill this</label>
                <input
                  type="text"
                  id="hp_website"
                  name="hp_website"
                  value={formData.hp_website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* STEP 1: Organization Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#10182D] border-b border-slate-100 pb-2">
                    Bước 1: Thông tin Đơn vị &amp; Người đại diện
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên tổ chức / Doanh nghiệp <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Ví dụ: Công ty Công nghệ FPT / Viện Nghiên cứu..."
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 ${
                          errors.organizationName
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                        }`}
                      />
                    </div>
                    {errors.organizationName && (
                      <p className="mt-1 text-xs text-rose-500">{errors.organizationName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Họ và tên người đại diện <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="representativeName"
                          value={formData.representativeName}
                          onChange={handleChange}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 ${
                            errors.representativeName
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                      </div>
                      {errors.representativeName && (
                        <p className="mt-1 text-xs text-rose-500">{errors.representativeName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chức vụ / Bộ phận công tác
                      </label>
                      <div className="relative">
                        <Briefcase className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Ví dụ: Giám đốc R&D / Trưởng phòng Nhân sự"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm transition focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Địa chỉ Email liên hệ <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contact@company.com"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 ${
                            errors.email
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số điện thoại liên hệ <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0912345678"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 ${
                            errors.phone
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:bg-[#0369A1] transition cursor-pointer"
                    >
                      <span>Tiếp tục: Nội dung đề xuất</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Proposal Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-[#10182D] border-b border-slate-100 pb-2">
                    Bước 2: Hình thức &amp; Nội dung Đề xuất
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hình thức hợp tác mong muốn <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm transition focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 bg-white"
                    >
                      {PARTNERSHIP_OPPORTUNITIES.map(opp => (
                        <option key={opp.typeKey} value={opp.typeKey}>
                          {opp.title} — {opp.targetAudience}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chi tiết nội dung đề xuất hợp tác <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Mô tả sơ lược về mục tiêu, định hướng phối hợp, nguồn lực dự kiến hoặc các kỳ vọng từ phía Quý đơn vị.
                    </p>
                    <div className="relative">
                      <textarea
                        rows={5}
                        name="proposalContent"
                        value={formData.proposalContent}
                        onChange={handleChange}
                        placeholder="Ví dụ: Đơn vị chúng tôi mong muốn tài trợ giải thưởng và cử chuyên gia tham gia cố vấn kỹ thuật cho cuộc thi BK Shark..."
                        className={`w-full p-4 rounded-xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 ${
                          errors.proposalContent
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                      <span>{errors.proposalContent ? <span className="text-rose-500">{errors.proposalContent}</span> : 'Tối thiểu 20 ký tự'}</span>
                      <span>{formData.proposalContent.length} / 3000 ký tự</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Liên kết tài liệu đính kèm (nếu có)
                    </label>
                    <div className="relative">
                      <LinkIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        name="attachmentUrl"
                        value={formData.attachmentUrl}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/... hoặc liên kết hồ sơ năng lực"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 ${
                          errors.attachmentUrl
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                        }`}
                      />
                    </div>
                    {errors.attachmentUrl && (
                      <p className="mt-1 text-xs text-rose-500">{errors.attachmentUrl}</p>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Quay lại</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:bg-[#0369A1] transition cursor-pointer"
                    >
                      <span>Xem lại &amp; Xác nhận</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Confirm */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-[#10182D] border-b border-slate-100 pb-2">
                    Bước 3: Xác nhận thông tin đề xuất hợp tác
                  </h3>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <span className="text-slate-400 text-xs block">Tổ chức / Doanh nghiệp</span>
                        <span className="font-bold text-[#10182D]">{formData.organizationName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Người đại diện</span>
                        <span className="font-bold text-[#10182D]">
                          {formData.representativeName} {formData.position ? `(${formData.position})` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Email liên hệ</span>
                        <span className="font-semibold text-slate-800">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Số điện thoại</span>
                        <span className="font-semibold text-slate-800">{formData.phone}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-xs block">Hình thức hợp tác</span>
                      <span className="inline-block mt-0.5 px-2.5 py-1 rounded-md bg-sky-100 text-[#0284C7] font-bold text-xs">
                        {selectedOpportunity?.title || formData.partnershipType}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-xs block">Nội dung đề xuất</span>
                      <p className="mt-1 text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                        {formData.proposalContent}
                      </p>
                    </div>

                    {formData.attachmentUrl && (
                      <div>
                        <span className="text-slate-400 text-xs block">Tài liệu đính kèm</span>
                        <a
                          href={formData.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0284C7] hover:underline break-all inline-flex items-center gap-1 mt-0.5"
                        >
                          <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>{formData.attachmentUrl}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Bằng việc nhấn "Gửi đề xuất hợp tác", Quý đơn vị xác nhận các thông tin trên là chính xác và đồng ý để Ban Chủ nhiệm BK-IC liên hệ theo các phương thức đã cung cấp.
                  </p>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Chỉnh sửa thông tin</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang gửi đề xuất...</span>
                        </>
                      ) : (
                        <>
                          <span>Gửi đề xuất hợp tác</span>
                          <CheckCircle2 className="h-4 w-4" />
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

