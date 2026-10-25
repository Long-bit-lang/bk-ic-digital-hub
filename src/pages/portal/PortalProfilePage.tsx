// BK-IC Member Profile Page
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { extractAcademicYear, formatAcademicYearDisplay } from '../../utils/academicYear';
import { 
  User, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Lock
} from 'lucide-react';

export const PortalProfilePage: React.FC = () => {
  const { currentUser, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    phone: currentUser.phone || '',
    classId: currentUser.classId,
    faculty: currentUser.faculty
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      fullName: formData.fullName,
      phone: formData.phone,
      classId: formData.classId,
      academicYear: extractAcademicYear(formData.classId),
      faculty: formData.faculty
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cổng Thành viên
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hồ sơ Thành viên CLB
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Thông tin học tập và tư cách thành viên chính thức tại BK-IC.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Cập nhật thông tin hồ sơ thành công!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Avatar Lockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#245BFA] to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.fullName}</h2>
              <div className="text-xs text-slate-500 font-mono mt-0.5">MSSV: {currentUser.studentId}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Thành viên chính thức · Đã xác minh</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition w-fit"
          >
            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
          </button>
        </div>

        {/* Details Form / View */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="text-sm font-semibold text-slate-800">{currentUser.fullName}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Mã số sinh viên (Cố định)
              </label>
              <div className="text-sm font-mono font-semibold text-slate-800">{currentUser.studentId}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Email sinh viên
              </label>
              <div className="text-sm font-semibold text-slate-800">{currentUser.email}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Số điện thoại liên hệ
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  placeholder="0901 234 567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="text-sm font-semibold text-slate-800">{currentUser.phone || 'Chưa cập nhật'}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Khoa trực thuộc
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="text-sm font-semibold text-slate-800">{currentUser.faculty}</div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-500">
                  Lớp sinh hoạt
                </label>
                {isEditing && (
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Khóa {extractAcademicYear(formData.classId)}
                  </span>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="VD: 25T_KHDL, 22TDH1..."
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="text-sm font-semibold text-slate-800">{currentUser.classId}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Khóa học
              </label>
              <div className="text-sm font-semibold text-slate-800">
                {formatAcademicYearDisplay(
                  isEditing ? extractAcademicYear(formData.classId) : currentUser.academicYear,
                  isEditing ? formData.classId : currentUser.classId,
                  currentUser.role
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Ban phân công
              </label>
              <div className="text-sm font-semibold text-blue-700">
                {currentUser.committee ? currentUser.committee.replace('ban-', 'Ban ').toUpperCase() : 'Chưa phân ban'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Vị trí đảm nhiệm
              </label>
              <div className="text-sm font-semibold text-slate-800">{currentUser.position}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Ngày gia nhập CLB
              </label>
              <div className="text-sm font-medium text-slate-800">{currentUser.joinDate}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Trạng thái thành viên
              </label>
              <div className="text-sm font-semibold text-emerald-600">Đang hoạt động (Active)</div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Security & Password Change */}
      <ChangePasswordCard />
    </div>
  );
};

const ChangePasswordCard: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không trùng khớp.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.changePassword({ oldPassword, newPassword });
      setIsLoading(false);
      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Đổi mật khẩu thành công!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: res.message || 'Không thể đổi mật khẩu.' });
      }
    } catch (err: any) {
      setIsLoading(false);
      setMessage({ type: 'error', text: err?.message || 'Có lỗi xảy ra khi đổi mật khẩu.' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <KeyRound className="h-5 w-5 text-blue-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Bảo mật & Đổi Mật khẩu</h2>
          <p className="text-xs text-slate-500">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản thành viên.</p>
        </div>
      </div>

      {message && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu hiện tại *</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              required
              placeholder="Nhập mật khẩu đang dùng"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới *</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              required
              placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, thường, số, ký tự đặc biệt"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>{isLoading ? 'Đang cập nhật...' : 'Cập nhật Mật khẩu Mới'}</span>
        </button>
      </form>
    </div>
  );
};
