// BK-IC Student Companion Project Request Modal Component
// Connects to /api/partnerships/request for student project incubation, mentorship and team building
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Rocket, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { api } from '../../services/api';

interface PartnershipRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const PartnershipRequestModal: React.FC<PartnershipRequestModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expert_mentoring'
}) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    representativeName: '',
    position: '',
    email: '',
    phone: '',
    partnershipType: defaultType,
    proposalContent: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize partnershipType whenever defaultType or modal open state changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        partnershipType: defaultType || 'expert_mentoring'
      }));
    }
  }, [defaultType, isOpen]);

  if (!isOpen) return null;

  const getCategoryTitle = (type: string) => {
    switch (type) {
      case 'expert_mentoring':
        return {
          badge: 'CỐ VẤN KỸ THUẬT & GIẢNG VIÊN HƯỚNG DẪN',
          title: 'Đăng ký Đồng hành Kỹ thuật & Cố vấn Dự án Sinh viên'
        };
      case 'program_sponsor':
        return {
          badge: 'ƯƠM TẠO ĐI THI KHỞI NGHIỆP & CÔNG NGHỆ',
          title: 'Đăng ký Ươm tạo Dự án Tham gia Cuộc thi & BK Shark'
        };
      case 'real_world_problem':
        return {
          badge: 'KẾT NỐI ĐỘI NGŨ ĐA NGÀNH & THỬ NGHIỆM',
          title: 'Đăng ký Ghép nhóm Đa ngành & Phát triển Sản phẩm Mẫu'
        };
      default:
        return {
          badge: 'VƯỜN ƯƠM DỰ ÁN SINH VIÊN BK-IC',
          title: 'Đăng ký Dự án Sinh viên Đồng hành cùng BK-IC'
        };
    }
  };

  const headerInfo = getCategoryTitle(formData.partnershipType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.organizationName.trim() ||
      !formData.representativeName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.proposalContent.trim()
    ) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.cms.submitPartnershipRequest({
        organizationName: formData.organizationName.trim(),
        representativeName: formData.representativeName.trim(),
        position: formData.position.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        partnershipType: formData.partnershipType,
        proposalContent: formData.proposalContent.trim()
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Gửi hồ sơ dự án không thành công. Vui lòng thử lại.');
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
      organizationName: '',
      representativeName: '',
      position: '',
      email: '',
      phone: '',
      partnershipType: defaultType,
      proposalContent: ''
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
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
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
                Gửi Hồ sơ Dự án Sinh viên thành công!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ban Chủ nhiệm &amp; Ban Điều hành CLB BK-IC đã tiếp nhận thông tin dự án:
                <span className="block font-semibold text-[#075985] mt-1">{formData.organizationName}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs text-[#075985] text-left space-y-1">
              <p className="font-semibold">Quy trình đồng hành tiếp theo:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Ban Chuyên môn BK-IC sẽ liên hệ qua email <span className="font-medium text-slate-900">{formData.email}</span> trong vòng 48 giờ.</li>
                <li>Nhóm dự án sẽ được sắp xếp buổi trao đổi định hướng (Office Hours) để đánh giá nhu cầu cố vấn và lộ trình ươm tạo.</li>
              </ul>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 px-5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100 uppercase tracking-wide">
                <Rocket className="h-3 w-3" />
                <span>{headerInfo.badge}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {headerInfo.title}
              </h3>
              <p className="text-xs text-slate-500">
                Dành cho sinh viên và nhóm dự án Trường ĐH Bách khoa – ĐHĐN mong muốn nhận cố vấn chuyên môn, kết nối đội ngũ và ươm tạo sản phẩm cùng BK-IC.
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
                  Tên Dự án / Đề tài Sinh viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hệ thống IoT cảnh báo ngập lụt đô thị thông minh"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Họ và tên Trưởng nhóm (Sinh viên) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên sinh viên đại diện"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Khoa / Lớp / MSSV
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Khoa CNTT - 23T_DT1"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email sinh viên / cá nhân <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@sv1.dut.udn.vn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số điện thoại / Zalo liên hệ <span className="text-rose-500">*</span>
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
                  Hạng mục nhóm dự án cần BK-IC hỗ trợ
                </label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                >
                  <option value="expert_mentoring">Kết nối Giảng viên hướng dẫn &amp; Cố vấn kỹ thuật R&amp;D</option>
                  <option value="program_sponsor">Ươm tạo dự án đi thi BK Shark / SV_STARTUP / Cuộc thi công nghệ</option>
                  <option value="real_world_problem">Ghép nhóm thành viên đa ngành &amp; Hỗ trợ phát triển Prototype/MVP</option>
                  <option value="other">Nhu cầu đồng hành khác dành cho nhóm sinh viên</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả tóm tắt ý tưởng &amp; Nhu cầu hỗ trợ của nhóm <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả ngắn gọn bài toán dự án đang giải quyết, giai đoạn hiện tại (ý tưởng / đang làm mẫu thử) và mong muốn BK-IC hỗ trợ..."
                  value={formData.proposalContent}
                  onChange={(e) => setFormData({ ...formData, proposalContent: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang gửi hồ sơ...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Gửi Đăng ký Dự án</span>
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
