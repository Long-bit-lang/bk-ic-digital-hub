import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  LogOut, 
  RefreshCw,
  ShieldCheck,
  UserCheck,
  ArrowRight
} from 'lucide-react';

export const ForceChangePasswordModal: React.FC = () => {
  const { currentUser, completeRecoveryPassword, logout } = useApp();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Policy Checks (P0.3 & Requirement 4)
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isFormValid) {
      setErrorMsg('Vui lòng đảm bảo mật khẩu mới đáp ứng đầy đủ tất cả tiêu chuẩn bảo mật bên dưới.');
      return;
    }

    setIsSubmitting(true);
    const res = await completeRecoveryPassword(newPassword, confirmPassword);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setSuccessMsg('Đổi mật khẩu mới thành công! Hệ thống đã kích hoạt phiên chính thức và đang mở khóa quyền truy cập...');
      
      // Smooth 1.2-second transition then navigate to role-specific dashboard
      setTimeout(() => {
        const targetRole = currentUser?.role || 'member';
        if (targetRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (targetRole === 'applicant') {
          navigate('/pending-approval', { replace: true });
        } else {
          navigate('/portal', { replace: true });
        }
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 my-6">
        
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Logo showSubtitle={false} disableLink={true} isWhite={true} />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4" />
            <span>Phiên Khôi phục Tài khoản Bắt buộc</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Thiết lập Mật khẩu Mới
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Bạn vừa đăng nhập thành công bằng <strong>Mật khẩu tạm thời</strong>. Để đảm bảo an toàn cho dữ liệu câu lạc bộ và tài khoản cá nhân, hệ thống yêu cầu bạn bắt buộc phải thiết lập mật khẩu mới an toàn trước khi tiếp tục.
          </p>
        </div>

        {/* Member Context Box (Displays active account context clearly) */}
        {currentUser && (
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-white font-semibold">{currentUser.fullName}</div>
                <div className="text-[11px] text-slate-400 font-mono">MSSV: {currentUser.studentId || 'Chưa cập nhật'}</div>
              </div>
            </div>
            <div className="text-right sm:border-l sm:border-slate-700 sm:pl-3">
              <div className="font-mono text-cyan-400 text-[11px] truncate">{currentUser.email}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                {currentUser.role === 'admin' ? 'Quản trị viên' : `Thành viên - Ban ${currentUser.unit || 'BK-IC'}`}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-100 text-xs flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-sm text-emerald-300">Hoàn tất đổi mật khẩu!</div>
              <div className="leading-relaxed text-[11px] text-emerald-200">{successMsg}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Mật khẩu mới *</span>
              <span className="text-[11px] font-normal text-slate-400">Không dùng lại mật khẩu tạm thời</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting || isSuccess}
                placeholder="Nhập mật khẩu mới an toàn"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Xác nhận mật khẩu mới *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting || isSuccess}
                placeholder="Nhập lại chính xác mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Policy Real-time Checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-1.5 text-[11px]">
            <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              <span>Tiêu chuẩn bảo mật mật khẩu BK-IC:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-slate-400">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-medium' : ''}`}>
                <span className="text-xs">{hasMinLength ? '✓' : '○'}</span>
                <span>Tối thiểu 8 ký tự</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400 font-medium' : ''}`}>
                <span className="text-xs">{hasUppercase ? '✓' : '○'}</span>
                <span>Chữ hoa (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400 font-medium' : ''}`}>
                <span className="text-xs">{hasLowercase ? '✓' : '○'}</span>
                <span>Chữ thường (a-z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-medium' : ''}`}>
                <span className="text-xs">{hasNumber ? '✓' : '○'}</span>
                <span>Chữ số (0-9)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400 font-medium' : ''}`}>
                <span className="text-xs">{hasSpecial ? '✓' : '○'}</span>
                <span>Ký tự đặc biệt (!@#$)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-400 font-medium' : ''}`}>
                <span className="text-xs">{isMatch ? '✓' : '○'}</span>
                <span>Khớp mật khẩu xác nhận</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isSubmitting || isSuccess}
              className="px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Hủy & Đăng xuất</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid || isSuccess}
              className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Đang lưu mật khẩu mới...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>Đã đổi thành công!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Cập nhật & Mở khóa Hệ thống</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
