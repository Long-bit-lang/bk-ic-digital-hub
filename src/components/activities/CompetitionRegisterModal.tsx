// BK-IC Competition Registration Modal Component
// Connects to /api/competitions/register with team and individual tracks
import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, Loader2, Send, Users, User } from 'lucide-react';
import { api } from '../../services/api';

interface CompetitionRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
  competitionTitle: string;
}

export const CompetitionRegisterModal: React.FC<CompetitionRegisterModalProps> = ({
  isOpen,
  onClose,
  competitionId,
  competitionTitle
}) => {
  const [regType, setRegType] = useState<'team' | 'individual'>('team');
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    membersCount: 3,
    projectIdeaSummary: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaderName.trim() || !formData.leaderEmail.trim() || !formData.leaderPhone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin liên hệ bắt buộc (*).');
      return;
    }

    if (regType === 'team' && !formData.teamName.trim()) {
      setErrorMsg('Vui lòng nhập tên đội thi của bạn.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.cms.registerCompetition({
        competitionId,
        competitionTitle,
        regType,
        teamName: regType === 'team' ? formData.teamName.trim() : formData.leaderName.trim(),
        leaderName: formData.leaderName.trim(),
        leaderEmail: formData.leaderEmail.trim(),
        leaderPhone: formData.leaderPhone.trim(),
        membersCount: regType === 'team' ? Number(formData.membersCount) : 1,
        projectIdeaSummary: formData.projectIdeaSummary.trim()
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Đăng ký dự thi không thành công. Vui lòng thử lại.');
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
      teamName: '',
      leaderName: '',
      leaderEmail: '',
      leaderPhone: '',
      membersCount: 3,
      projectIdeaSummary: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
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
                Nộp đơn Đăng ký Cuộc thi thành công!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Ban Chuyên môn và Hội đồng Trọng tài BK-IC đã tiếp nhận hồ sơ tham gia cuộc thi:
                <span className="block font-semibold text-[#075985] mt-1">{competitionTitle}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs text-[#075985] text-left space-y-1">
              <p className="font-semibold">Bước tiếp theo cho {regType === 'team' ? 'đội thi' : 'thí sinh'}:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Thông báo xác nhận và tài liệu kỹ thuật đã được gửi về: <span className="font-medium text-slate-900">{formData.leaderEmail}</span></li>
                <li>Ban Tổ chức sẽ liên hệ hỗ trợ cấp kinh phí chế tạo mẫu thử theo tiến độ.</li>
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
                <Award className="h-3 w-3" />
                <span>Hồ sơ Đăng ký Cuộc thi</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {competitionTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Nộp thông tin đội thi và tóm tắt ý tưởng để Ban Tổ chức thẩm định hồ sơ.
              </p>
            </div>

            {/* Registration Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRegType('team')}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl transition ${
                  regType === 'team' ? 'bg-white text-[#075985] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Theo Đội thi</span>
              </button>
              <button
                type="button"
                onClick={() => setRegType('individual')}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl transition ${
                  regType === 'individual' ? 'bg-white text-[#075985] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Cá nhân tìm đội</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              {regType === 'team' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Tên Đội thi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: BK-IoT Innovators"
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Số thành viên
                    </label>
                    <select
                      value={formData.membersCount}
                      onChange={(e) => setFormData({ ...formData, membersCount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                    >
                      <option value={2}>2 Thành viên</option>
                      <option value={3}>3 Thành viên</option>
                      <option value={4}>4 Thành viên</option>
                      <option value={5}>5 Thành viên</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {regType === 'team' ? 'Họ và tên Trưởng nhóm' : 'Họ và tên Thí sinh'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Minh Hoàng"
                  value={formData.leaderName}
                  onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email liên lạc <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="leader@dut.udn.vn"
                    value={formData.leaderEmail}
                    onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
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
                    placeholder="0912 xxx xxx"
                    value={formData.leaderPhone}
                    onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tóm tắt Ý tưởng / Giải pháp Dự thi
                </label>
                <textarea
                  rows={3}
                  placeholder="Nêu vắn tắt bài toán giải quyết, công nghệ dự kiến sử dụng (phần cứng/phần mềm/AI)..."
                  value={formData.projectIdeaSummary}
                  onChange={(e) => setFormData({ ...formData, projectIdeaSummary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-100 transition resize-none"
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
                    <span>Đang nộp hồ sơ...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Xác nhận Nộp hồ sơ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

