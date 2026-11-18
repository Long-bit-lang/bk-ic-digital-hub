// BK-IC Workshop Registration Modal Component
// Connects to /api/workshops/register with full client validation & error handling
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { api } from '../../services/api';

interface WorkshopRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: string;
  workshopTitle: string;
}

export const WorkshopRegisterModal: React.FC<WorkshopRegisterModalProps> = ({
  isOpen,
  onClose,
  workshopId,
  workshopTitle
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    questionsForSpeaker: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.cms.registerWorkshop({
        workshopId,
        workshopTitle,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        questionsForSpeaker: formData.questionsForSpeaker.trim()
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setErrorMsg(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      questionsForSpeaker: ''
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Đóng modal"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Đăng ký Workshop thành công!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ban Chuyên môn BK-IC đã ghi nhận thông tin tham dự của bạn cho buổi workshop:
                <span className="block font-semibold text-[#075985] mt-1">{workshopTitle}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs text-[#075985] text-left space-y-1">
              <p className="font-semibold">Lưu ý trước buổi học:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Email xác nhận và vé tham dự đã được gửi về: <span className="font-medium text-slate-900">{formData.email}</span></li>
                <li>Vui lòng có mặt trước giờ bắt đầu 15 phút để ổn định vị trí.</li>
              </ul>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 px-5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100 uppercase tracking-wide">
                <Sparkles className="h-3 w-3" />
                <span>Đăng ký tham gia Workshop</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {workshopTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Điền thông tin để Ban Tổ chức chuẩn bị tài liệu và cấp quyền truy cập phòng lab.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@dut.udn.vn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0905 xxx xxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đơn vị / Lớp / Khoa
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 22T_CLC / Khoa Công nghệ Thông tin, DUT"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Câu hỏi dành cho Diễn giả (nếu có)
                </label>
                <textarea
                  rows={2}
                  placeholder="Gửi trước câu hỏi hoặc vấn đề kỹ thuật bạn đang quan tâm..."
                  value={formData.questionsForSpeaker}
                  onChange={(e) => setFormData({ ...formData, questionsForSpeaker: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition disabled:opacity-50 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang gửi đơn...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Xác nhận Đăng ký</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

