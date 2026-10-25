// BK-IC Digital Hub - Secure Password Reset Page (Requirement B & C)
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../components/brand/Logo';
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  ArrowLeft,
  Clock
} from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { verifyResetToken, resetPasswordWithToken } = useApp();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Policy Real-time Checkers
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && isMatch;

  useEffect(() => {
    let isMounted = true;
    async function checkToken() {
      if (!token) {
        if (isMounted) {
          setIsVerifying(false);
          setIsValidToken(false);
          setTokenError('Không tìm thấy mã xác thực bảo mật trong liên kết.');
        }
        return;
      }

      setIsVerifying(true);
      const res = await verifyResetToken(token);
      if (isMounted) {
        setIsVerifying(false);
        if (res.success && res.valid) {
          setIsValidToken(true);
          setMaskedEmail(res.email || '');
          setRecipientName(res.fullName || '');
        } else {
          setIsValidToken(false);
          setTokenError(
            res.message ||
              'Liên kết đặt lại mật khẩu không hợp lệ, đã hết hạn (quá 15 phút) hoặc đã được sử dụng trước đó.'
          );
        }
      }
    }

    checkToken();
    return () => {
      isMounted = false;
    };
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!isFormValid) {
      setSubmitError('Vui lòng hoàn thiện tất cả yêu cầu bảo mật của mật khẩu bên dưới.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPasswordWithToken(token, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setSubmitError(res.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Logo showSubtitle={true} />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Thiết lập Mật khẩu Mới
        </h1>
        <p className="text-xs text-slate-600">
          Cổng Quản lý Hoạt động & Thành viên CLB Sáng tạo Khởi nghiệp BK-IC
        </p>
      </div>

      {/* Main Container Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 space-y-6">
          
          {/* STATE 1: Verifying Token */}
          {isVerifying && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-slate-500 font-medium">
                Đang xác thực liên kết bảo mật với hệ thống...
              </p>
            </div>
          )}

          {/* STATE 2: Invalid or Expired Token */}
          {!isVerifying && !isValidToken && !isSuccess && (
            <div className="text-center space-y-4 py-4">
              <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  Liên kết không hợp lệ hoặc đã hết hạn
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {tokenError}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] text-left space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Quy định an toàn BK-IC:</span>
                </div>
                <p>
                  Liên kết đặt lại mật khẩu chỉ có thời hạn <strong>15 phút</strong> và bị vô hiệu hóa ngay sau khi sử dụng một lần nhằm bảo vệ tài khoản sinh viên.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 px-4 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại trang Đăng nhập & Yêu cầu lại</span>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: Success Screen */}
          {isSuccess && (
            <div className="text-center space-y-4 py-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  Đặt lại mật khẩu thành công!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mật khẩu mới của bạn đã được cập nhật an toàn vào cơ sở dữ liệu. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới này.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
                >
                  <span>Đăng nhập vào Hệ thống</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: Valid Token, Show Reset Password Form */}
          {!isVerifying && isValidToken && !isSuccess && (
            <div className="space-y-5">
              {/* Account badge */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs">{recipientName || 'Thành viên BK-IC'}</div>
                  <div className="text-[11px] font-mono text-blue-700">{maskedEmail}</div>
                </div>
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
              </div>

              {submitError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu mới *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu mới bảo mật"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Xác nhận mật khẩu mới *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>

                {/* Password Policy Real-time Checklist */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
                  <div className="font-semibold text-slate-700 text-[11px] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-500" />
                    <span>Yêu cầu chính sách mật khẩu hệ thống:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span>Tối thiểu 8 ký tự</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hasUppercase ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span>Chữ cái in hoa (A-Z)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hasLowercase ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span>Chữ cái thường (a-z)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span>Chữ số (0-9)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hasSpecial ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span>Ký tự đặc biệt (!@#$...)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isMatch ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span>Xác nhận khớp</span>
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#245BFA] py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Đang cập nhật mật khẩu...</span>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Xác nhận Đặt Mật khẩu Mới</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
