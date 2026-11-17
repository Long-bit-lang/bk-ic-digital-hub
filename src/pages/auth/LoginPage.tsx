// BK-IC Digital Hub — Minimalist Editorial & Modern Tech Split-Screen Login
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../components/brand/Logo';
import {
  SavedLoginCredential,
  clearSavedCredentials,
  getRememberCredentialPreference,
  getSavedCredentials,
  removeSavedCredential,
  saveLoginCredential,
  setRememberCredentialPreference
} from '../../utils/savedLoginCredentials';
import { 
  LogIn, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  BookmarkCheck,
  ArrowLeft,
  Layers,
  Award,
  Users
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, forgotPassword, users, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const fromState = (location.state as any)?.from;
  let from = '';
  if (typeof fromState === 'string') {
    from = fromState;
  } else if (fromState && typeof fromState === 'object') {
    from = (fromState.pathname || '') + (fromState.search || '') + (fromState.hash || '');
  }
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('returnUrl') || searchParams.get('redirect') || searchParams.get('from');
  if (redirectParam) {
    from = redirectParam;
  }

  // Auto-redirect if user is already authenticated with a normal session
  useEffect(() => {
    if (currentUser && !currentUser.mustChangePassword && !currentUser.isRecoverySession) {
      const role = currentUser.role || 'member';
      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'applicant') {
        navigate('/pending-approval', { replace: true });
      } else {
        navigate('/portal', { replace: true });
      }
    }
  }, [currentUser, from, navigate]);

  // Login form state + device-local quick-fill credentials
  const [savedCredentials, setSavedCredentials] = useState<SavedLoginCredential[]>(() => getSavedCredentials());
  const [rememberCredentials, setRememberCredentials] = useState<boolean>(() => getRememberCredentialPreference());
  const [loginEmail, setLoginEmail] = useState(() => getSavedCredentials()[0]?.email || '');
  const [loginPassword, setLoginPassword] = useState(() => getSavedCredentials()[0]?.password || '');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Reset / Temporary Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // Help & Guide Modal
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Quick-fill helpers for device-local saved credentials
  const handleQuickFillCredential = (cred: SavedLoginCredential) => {
    setLoginEmail(cred.email);
    setLoginPassword(cred.password);
    setLoginError('');
  };

  const handleRemoveSavedCredential = (email: string) => {
    const remaining = removeSavedCredential(email);
    setSavedCredentials(remaining);
    if (loginEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleClearAllSavedCredentials = () => {
    clearSavedCredentials();
    setSavedCredentials([]);
    setLoginEmail('');
    setLoginPassword('');
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim();
    if (!trimmedEmail) {
      setLoginError('Vui lòng nhập email đăng nhập.');
      return;
    }

    setIsSubmittingLogin(true);
    const res = await login(trimmedEmail, loginPassword);
    setIsSubmittingLogin(false);

    if (res.success) {
      if (res.mustChangePassword) {
        // ForceChangePasswordModal will render on top of application
        return;
      }

      const targetUser = res.user || users.find(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());

      if (rememberCredentials) {
        const updated = saveLoginCredential({
          email: trimmedEmail,
          password: loginPassword,
          fullName: targetUser?.fullName
        });
        setSavedCredentials(updated);
      } else {
        const updated = removeSavedCredential(trimmedEmail);
        setSavedCredentials(updated);
      }

      const role = targetUser?.role || 'member';

      if (from) {
        navigate(from);
      } else if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'applicant') {
        navigate('/pending-approval');
      } else {
        navigate('/portal');
      }
    } else {
      setLoginError(res.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedForgotEmail = forgotEmail.trim();
    if (!trimmedForgotEmail) {
      setForgotMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ email sinh viên đã đăng ký.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedForgotEmail)) {
      setForgotMessage({ type: 'error', text: 'Địa chỉ email không đúng định dạng hợp lệ (ví dụ: ten.ho@dut.udn.vn).' });
      return;
    }

    setIsSubmittingForgot(true);
    setForgotMessage(null);

    const res = await forgotPassword(trimmedForgotEmail);
    setIsSubmittingForgot(false);

    if (res.success) {
      setForgotMessage({ type: 'success', text: res.message });
    } else {
      setForgotMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] flex flex-col lg:flex-row">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: BRAND & INSTITUTIONAL EDITORIAL PANEL (Deep Navy #10182D)     */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-5/12 xl:w-1/2 bg-[#10182D] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Subtle Ambient Lighting Gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1749B5]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#6B9DFF]/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1749B5_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Top Header: Back to Public Site + Logo */}
        <div className="relative z-10 space-y-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại Trang chủ</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[#6B9DFF] text-base tracking-wider">
              BK
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>BK-IC DIGITAL HUB</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#1749B5]/60 text-[#6B9DFF] border border-[#1749B5]">
                  INTERNAL
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Đoàn TN – Hội SV Trường Đại học Bách khoa (DUT)
              </div>
            </div>
          </div>
        </div>

        {/* Center: Editorial Manifesto & Pillar Cards */}
        <div className="relative z-10 py-12 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#6B9DFF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6B9DFF] animate-pulse"></span>
              <span>Cổng Điều hành &amp; Thành viên</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Không gian số kết nối Đổi mới Sáng tạo &amp; Khởi nghiệp.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-lg">
              Nền tảng vận hành tập trung số hóa toàn diện dành riêng cho Thành viên và Ban Điều hành BachKhoa Innovation and Entrepreneurship Club.
            </p>
          </div>

          {/* 3 Pillar Micro-cards */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-[#1749B5]/40 text-[#6B9DFF] shrink-0 mt-0.5">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-xs font-semibold text-white block">Cơ cấu 3 Ban Minh bạch</strong>
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  Phân quyền độc lập giữa Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-[#1749B5]/40 text-[#6B9DFF] shrink-0 mt-0.5">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-xs font-semibold text-white block">Số hóa Sinh hoạt &amp; Dự án</strong>
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  Điểm danh thông minh qua mã QR, quản lý workshop thường niên và dự án đồng hành.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-[#1749B5]/40 text-[#6B9DFF] shrink-0 mt-0.5">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-xs font-semibold text-white block">Hệ sinh thái Bách khoa</strong>
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  Cầu nối giữa sinh viên tài năng, viện nghiên cứu và mạng lưới doanh nghiệp công nghệ.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Institutional Citation */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} BK-IC. Mọi quyền được bảo lưu.</span>
          <span className="font-mono text-slate-500">dut.udn.vn • bkic.dut@gmail.com</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: CLEAN EDITORIAL LOGIN FORM (Off-white / White)              */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-7/12 xl:w-1/2 bg-[#F8FAFC] flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E6EE] shadow-sm">
          
          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1749B5]">
              <Lock className="h-3 w-3" />
              <span>ĐĂNG NHẬP HỆ THỐNG NỘI BỘ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10182D] tracking-tight">
              Cổng Thành viên BK-IC
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6573] leading-relaxed">
              Nhập email sinh viên Bách khoa (<code className="font-mono text-[#1749B5]">@dut.udn.vn</code>) hoặc tài khoản được cấp bởi BCN.
            </p>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1 font-medium">{loginError}</div>
            </div>
          )}

          {/* Saved Credentials Quick-fill (Device-local) */}
          {savedCredentials.length > 0 && (
            <div className="rounded-2xl border border-blue-100 bg-[#F5F6F8] p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10182D]">
                  <BookmarkCheck className="h-3.5 w-3.5 text-[#1749B5]" />
                  <span>Tài khoản đã lưu trên thiết bị</span>
                </div>
                {savedCredentials.length > 1 && (
                  <button
                    type="button"
                    onClick={handleClearAllSavedCredentials}
                    className="text-[11px] font-medium text-slate-400 hover:text-red-600 transition"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {savedCredentials.map((cred) => {
                  const isActiveFill =
                    loginEmail.trim().toLowerCase() === cred.email.toLowerCase() &&
                    loginPassword === cred.password;

                  return (
                    <div
                      key={cred.email.toLowerCase()}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                        isActiveFill
                          ? 'border-[#1749B5] bg-white shadow-xs'
                          : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleQuickFillCredential(cred)}
                        className="flex flex-1 items-center gap-2.5 text-left min-w-0"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#1749B5] text-[10px] font-bold text-white uppercase">
                          {(cred.fullName || cred.email).charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[#10182D] truncate">
                            {cred.fullName || cred.email}
                          </div>
                          {cred.fullName && (
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {cred.email}
                            </div>
                          )}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveSavedCredential(cred.email)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded transition"
                        title="Xóa tài khoản đã lưu"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#10182D] mb-1.5">
                Địa chỉ Email *
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="ten.ho@dut.udn.vn hoặc email cá nhân"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#10182D] placeholder:text-slate-400 focus:border-[#1749B5] focus:ring-2 focus:ring-[#1749B5]/10 focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#10182D]">
                  Mật khẩu *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(loginEmail);
                    setForgotMessage(null);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-medium text-[#1749B5] hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showLoginPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Nhập mật khẩu"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 pr-10 text-xs text-[#10182D] placeholder:text-slate-400 focus:border-[#1749B5] focus:ring-2 focus:ring-[#1749B5]/10 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember credentials checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="remember-credentials"
                type="checkbox"
                checked={rememberCredentials}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRememberCredentials(checked);
                  setRememberCredentialPreference(checked);
                }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1749B5] focus:ring-[#1749B5] cursor-pointer shrink-0"
              />
              <label
                htmlFor="remember-credentials"
                className="text-xs text-[#5E6573] cursor-pointer select-none leading-relaxed"
              >
                <span className="font-medium text-[#10182D]">
                  Lưu tài khoản trên thiết bị này
                </span>
                <span className="block text-[11px] text-slate-400">
                  Chỉ lưu an toàn trên trình duyệt cá nhân để điền nhanh lần sau.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1749B5] py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#1749B5]/20 hover:bg-[#10182D] active:scale-[0.99] transition disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <span>Đang kiểm tra thông tin...</span>
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Public Candidate Info Notice (Explains why no public self-registration) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="rounded-2xl bg-[#F5F6F8] p-4 text-xs text-[#5E6573] space-y-1.5">
              <div className="font-semibold text-[#10182D] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#1749B5]" />
                <span>Quy chế Cấp tài khoản Thành viên</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Hệ thống BK-IC Digital Hub không mở chức năng tự đăng ký công khai. Sinh viên muốn tham gia CLB vui lòng nộp hồ sơ qua trang <strong>Tuyển thành viên</strong> tại phân hệ Hoạt động.
              </p>
              <div className="pt-1">
                <Link
                  to="/activities/recruitment"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1749B5] hover:underline"
                >
                  <span>Nộp đơn ứng tuyển thành viên mới</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Guide Modal Trigger Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1749B5] transition font-medium"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Hướng dẫn đăng nhập &amp; Cơ chế phân quyền</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FORGOT PASSWORD / TEMPORARY PASSWORD                             */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#1749B5]" />
                <h3 className="text-base font-bold text-[#10182D]">Khôi phục Mật khẩu</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#5E6573] leading-relaxed">
              Nhập địa chỉ email sinh viên đã đăng ký (<code className="font-mono text-[#1749B5]">@dut.udn.vn</code>). Hệ thống sẽ tạo một <strong>mật khẩu tạm thời an toàn</strong> có hiệu lực trong <strong>15 phút</strong> (dùng duy nhất 1 lần) và gửi về hộp thư của bạn.
            </p>

            {forgotMessage && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                forgotMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {forgotMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed flex-1">
                  <div className="font-semibold">{forgotMessage.type === 'success' ? 'Yêu cầu khôi phục đã được tiếp nhận' : 'Lỗi yêu cầu'}</div>
                  <div className="text-[11px] mt-0.5">{forgotMessage.text}</div>
                  
                  {forgotMessage.type === 'success' && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail(forgotEmail);
                          setShowForgotModal(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-800 transition"
                      >
                        <span>Quay lại trang Đăng nhập</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email sinh viên đã đăng ký *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ten.ho@dut.udn.vn hoặc email cá nhân"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1749B5] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForgot}
                  className="flex-1 py-2.5 rounded-xl bg-[#1749B5] text-xs font-semibold text-white hover:bg-[#10182D] transition disabled:opacity-50"
                >
                  {isSubmittingForgot ? 'Đang gửi...' : 'Gửi mật khẩu tạm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PERMISSION & MEMBERSHIP GUIDE                                    */}
      {/* ========================================================================= */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#10182D] flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#1749B5]" />
                  <span>Hướng dẫn Tài khoản &amp; Phân quyền BK-IC</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy định định danh dành cho Thành viên và Ban Điều hành CLB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
                <div className="font-bold text-[#1749B5] text-sm flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#1749B5] text-white flex items-center justify-center text-xs">1</span>
                  <span>Dành cho Ứng viên mới</span>
                </div>
                <p className="leading-relaxed">
                  Để đảm bảo chất lượng thành viên và bảo mật cơ sở dữ liệu CLB, BK-IC không mở đăng ký tự do. Bạn có thể nộp đơn gia nhập qua đợt <strong>Tuyển thành viên</strong> thường niên tại mục <em>Hoạt động &gt; Tuyển thành viên</em>.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>Cấp tài khoản chính thức</span>
                </div>
                <p className="leading-relaxed">
                  Khi trúng tuyển hoặc được bổ nhiệm, Ban Chủ nhiệm sẽ trực tiếp cấp tài khoản và gửi email thông báo kèm mật khẩu khởi tạo. Thành viên đăng nhập và đổi mật khẩu trong phiên đầu tiên.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  Cơ chế 4 Cấp phân quyền:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-red-600 block">1. Admin (Ban Chủ nhiệm)</strong>
                    <span>Toàn quyền quản trị nhân sự, phê duyệt hoạt động và báo cáo cấp Trường.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-[#1749B5] block">2. Leader (Trưởng ban)</strong>
                    <span>Điều hành công việc nội bộ từng Ban, phân công nhiệm vụ và đánh giá tháng.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-emerald-600 block">3. Member (Thành viên)</strong>
                    <span>Quét QR điểm danh, nhận nhiệm vụ và tham gia các dự án đổi mới sáng tạo.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-amber-600 block">4. Applicant (Ứng viên)</strong>
                    <span>Hồ sơ đang chờ phê duyệt kết nạp vào CLB.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 bg-[#1749B5] text-white rounded-xl font-semibold text-xs hover:bg-[#10182D] transition"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
