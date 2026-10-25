import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Logo } from '../../components/brand/Logo';
import { UnitId, UserRole } from '../../types';
import { 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Mail,
  Clock,
  ExternalLink,
  RefreshCw,
  Lock
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, requestTempPassword, forgotPassword, users, currentUser } = useApp();
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
  React.useEffect(() => {
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

  // Active Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFaculty, setRegFaculty] = useState('Khoa Công nghệ Thông tin');
  const [regClassId, setRegClassId] = useState('24T_CLC');
  const [regAcademicYear, setRegAcademicYear] = useState('K24 (2024-2029)');
  const [regDesiredUnit, setRegDesiredUnit] = useState<UnitId>('BDH');
  const [regMotivation, setRegMotivation] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Reset / Temporary Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // Help & Guide Modal
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Real-time registration password checkers
  const regHasMinLength = regPassword.length >= 8;
  const regHasUppercase = /[A-Z]/.test(regPassword);
  const regHasLowercase = /[a-z]/.test(regPassword);
  const regHasNumber = /[0-9]/.test(regPassword);
  const regHasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(regPassword);
  const regIsMatch = regPassword.length > 0 && regPassword === regConfirmPassword;
  const isRegPasswordValid =
    regHasMinLength && regHasUppercase && regHasLowercase && regHasNumber && regHasSpecial && regIsMatch;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Vui lòng nhập email đăng nhập.');
      return;
    }

    setIsSubmittingLogin(true);
    const res = await login(loginEmail.trim(), loginPassword);
    setIsSubmittingLogin(false);

    if (res.success) {
      if (res.mustChangePassword) {
        // ForceChangePasswordModal will render on top of application
        return;
      }

      // Find role of this email in loaded users
      const targetUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
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

  // Handle Register with password policy compliance
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName.trim() || !regStudentId.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Vui lòng điền đầy đủ các thông tin bắt buộc có dấu (*).');
      return;
    }

    if (!isRegPasswordValid) {
      setRegError('Mật khẩu chưa đáp ứng đầy đủ yêu cầu chính sách bảo mật (tối thiểu 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt).');
      return;
    }

    setIsSubmittingReg(true);
    const res = await register({
      fullName: regFullName.trim(),
      studentId: regStudentId.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      faculty: regFaculty,
      classId: regClassId,
      academicYear: regAcademicYear,
      desiredUnit: regDesiredUnit,
      motivation: regMotivation
    });
    setIsSubmittingReg(false);

    if (res.success) {
      setRegSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/pending-approval');
      }, 1200);
    } else {
      setRegError(res.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    }
  };

  // Handle Forgot Password / Request Temporary Password (Requirements 1, 2 & 3)
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

    const res = await requestTempPassword(forgotEmail.trim());
    setIsSubmittingForgot(false);

    if (res.success) {
      setForgotMessage({ type: 'success', text: res.message });
    } else {
      setForgotMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Logo showSubtitle={true} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cổng Xác thực BK-IC Digital Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Hệ thống Quản lý Hoạt động & Thành viên Câu lạc bộ Sáng tạo Khởi nghiệp Trường ĐH Bách khoa - ĐHĐN
        </p>

        {/* Action button to open Guide */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Hướng dẫn cách tạo tài khoản & Phân quyền</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 space-y-6">
          
          {/* Tab Selector */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Đăng ký tài khoản mới</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {loginError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Địa chỉ Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ten.ho@dut.udn.vn hoặc email cá nhân"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Khuyến khích sử dụng email sinh viên trường ĐH Bách khoa (@dut.udn.vn)
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mật khẩu *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(loginEmail);
                        setForgotMessage(null);
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#245BFA] py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50"
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
            </div>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-800 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-blue-900">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Quy trình Đăng ký Tài khoản Thành viên BK-IC</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Tài khoản sau khi đăng ký sẽ được kích hoạt ngay trong cơ sở dữ liệu hệ thống với vai trò <strong>Ứng viên (Applicant)</strong>. Ban Chủ nhiệm sẽ xem xét hồ sơ và phê duyệt kết nạp vào Ban tương ứng.
                </p>
              </div>

              {regError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên đầy đủ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã số sinh viên (MSSV) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="102240xxx"
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email đăng nhập *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vana.nguyen@dut.udn.vn"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0905123456"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mật khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Tối thiểu 8 ký tự bảo mật"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 pr-9 text-xs text-slate-800 focus:outline-none transition ${
                          regPassword.length > 0
                            ? (isRegPasswordValid ? 'border-emerald-500 focus:border-emerald-500' : 'border-amber-400 focus:border-amber-500')
                            : 'border-slate-300 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Xác nhận mật khẩu *
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs text-slate-800 focus:outline-none transition ${
                        regConfirmPassword.length > 0
                          ? (regIsMatch ? 'border-emerald-500 focus:border-emerald-500' : 'border-red-400 focus:border-red-500')
                          : 'border-slate-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Policy Real-time Checklist */}
                {regPassword.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                    <div className="font-semibold text-slate-700 text-xs">Quy tắc mật khẩu an toàn:</div>
                    <div className="grid grid-cols-2 gap-1.5 text-slate-600">
                      <div className={`flex items-center gap-1.5 ${regHasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {regHasMinLength ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />}
                        <span>Tối thiểu 8 ký tự</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${regHasUppercase && regHasLowercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {regHasUppercase && regHasLowercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />}
                        <span>Chữ hoa (A-Z) & chữ thường (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${regHasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {regHasNumber ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />}
                        <span>Ít nhất 1 chữ số (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${regHasSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {regHasSpecial ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />}
                        <span>Ký tự đặc biệt (!@#$...)</span>
                      </div>
                    </div>
                    {regConfirmPassword.length > 0 && (
                      <div className={`pt-1 border-t border-slate-200 flex items-center gap-1.5 text-xs ${regIsMatch ? 'text-emerald-700 font-semibold' : 'text-red-600'}`}>
                        {regIsMatch ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
                        <span>{regIsMatch ? 'Mật khẩu xác nhận trùng khớp' : 'Mật khẩu xác nhận chưa khớp'}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Khoa đào tạo
                    </label>
                    <select
                      value={regFaculty}
                      onChange={(e) => setRegFaculty(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 bg-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Khoa Công nghệ Thông tin">Khoa Công nghệ Thông tin</option>
                      <option value="Khoa Điện">Khoa Điện</option>
                      <option value="Khoa Điện tử - Viễn thông">Khoa Điện tử - Viễn thông</option>
                      <option value="Khoa Cơ khí">Khoa Cơ khí</option>
                      <option value="Khoa Xây dựng Cầu đường">Khoa Xây dựng Cầu đường</option>
                      <option value="Khoa Hóa">Khoa Hóa</option>
                      <option value="Khoa Quản lý Dự án">Khoa Quản lý Dự án</option>
                      <option value="Chương trình Tiên tiến & CLC">Chương trình Tiên tiến & CLC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lớp sinh hoạt
                    </label>
                    <input
                      type="text"
                      placeholder="24T_CLC, 23DT1..."
                      value={regClassId}
                      onChange={(e) => setRegClassId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ban nguyện vọng tham gia *
                  </label>
                  <select
                    value={regDesiredUnit}
                    onChange={(e) => setRegDesiredUnit(e.target.value as UnitId)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 bg-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="BDH">Ban Điều hành (BDH) - Chuyên môn Kỹ thuật, Dự án ĐMST & Sự kiện</option>
                    <option value="BTV">Ban Thành viên (BTV) - Nhân sự, Đánh giá, Truyền thông & Điểm danh</option>
                    <option value="BN">Ban Chủ nhiệm (BN) - Điều hành chiến lược, Quản trị & Kết nối Cố vấn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nguyện vọng / Mục tiêu khi tham gia CLB
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Chia sẻ lý do và định hướng phát triển của bạn khi gia nhập BK-IC..."
                    value={regMotivation}
                    onChange={(e) => setRegMotivation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {isSubmittingReg ? (
                    <span>Đang khởi tạo tài khoản...</span>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Hoàn tất đăng ký tài khoản</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Footer Back link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition flex items-center gap-1 font-medium">
              <span>← Trở về Trang chủ CLB</span>
            </Link>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Cách tạo tài khoản?
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: FORGOT / TEMPORARY PASSWORD */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <KeyRound className="h-5 w-5 text-blue-600" />
                <span>Quên mật khẩu & Nhận Mật khẩu Tạm thời</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Nhập địa chỉ email sinh viên đã đăng ký (<code className="font-mono text-blue-600">@dut.udn.vn</code>). Hệ thống sẽ tạo một <strong>mật khẩu tạm thời an toàn</strong> có hiệu lực trong <strong>15 phút</strong> (dùng duy nhất 1 lần) và gửi về hộp thư của bạn để đăng nhập và bắt buộc thiết lập mật khẩu mới.
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-800 transition shadow-xs"
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
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Không bao giờ tiết lộ email có tồn tại hay không vì lý do bảo mật.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Quay lại trang đăng nhập
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForgot}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmittingForgot ? 'Đang gửi...' : 'Gửi mật khẩu tạm thời'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPREHENSIVE GUIDE FOR ACCOUNT CREATION & ROLES */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>Hướng dẫn Tạo Tài khoản & Phân quyền BK-IC</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cơ chế vận hành tài khoản thực tế của Câu lạc bộ Sáng tạo Khởi nghiệp BK-IC
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

            <div className="space-y-5 text-xs text-slate-600 max-h-[65vh] overflow-y-auto pr-1">
              
              {/* Method 1 */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Cách 1: Sinh viên tự đăng ký tài khoản trực tuyến</span>
                </div>
                <p className="leading-relaxed">
                  Bất kỳ sinh viên Trường ĐH Bách khoa nào cũng có thể tự tạo tài khoản:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700">
                  <li>Chuyển sang tab <strong>"Đăng ký tài khoản mới"</strong> trên trang Đăng nhập này.</li>
                  <li>Điền chính xác Họ tên, MSSV, Email (ưu tiên @dut.udn.vn), Mật khẩu (tối thiểu 6 ký tự), Số điện thoại, Khoa đào tạo và Ban nguyện vọng muốn tham gia.</li>
                  <li>Nhấn <strong>"Hoàn tất đăng ký tài khoản"</strong>. Hệ thống sẽ tạo tài khoản thực tế và hồ sơ ứng tuyển liên kết.</li>
                  <li>Tài khoản khởi tạo sẽ ở vai trò <strong>Ứng viên (Applicant)</strong>. Ban Chủ nhiệm / Ban Thành viên sẽ liên hệ phỏng vấn và duyệt kết nạp vào CLB.</li>
                </ol>
              </div>

              {/* Method 2 */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>Cách 2: Ban Chủ nhiệm / Admin cấp tài khoản trực tiếp</span>
                </div>
                <p className="leading-relaxed">
                  Dành cho Cán bộ điều hành, Trưởng ban, Ban Cố vấn hoặc Thành viên được kết nạp trực tiếp:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700">
                  <li>Đăng nhập tài khoản Quản trị viên (Email: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">admin.bkic@dut.udn.vn</code> hoặc <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">admin@dut.udn.vn</code>).</li>
                  <li>Truy cập vào <strong>Trang Quản trị Hệ thống</strong> &gt; mục <strong>"Thành viên"</strong>.</li>
                  <li>Nhấn nút <strong>"Cấp tài khoản mới"</strong> ở góc phải.</li>
                  <li>Điền đầy đủ thông tin thành viên, phân công Ban (BN, BDH, BTV), chọn vai trò (Admin / Leader / Member) và thiết lập mật khẩu khởi tạo (mặc định 123456).</li>
                  <li>Nhấn <strong>"Lưu & Cấp tài khoản"</strong>. Thành viên mới có thể dùng email và mật khẩu này để đăng nhập ngay lập tức.</li>
                </ol>
              </div>

              {/* Method 3 */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-purple-900 text-sm">
                  <span className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Cách 3: Phê duyệt từ Đơn Tuyển dụng Thành viên</span>
                </div>
                <p className="leading-relaxed">
                  Khi sinh viên nộp đơn tuyển dụng qua trang <strong>Tuyển quân (/join)</strong> hoặc tự đăng ký:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700">
                  <li>Admin / Ban Tuyển dụng truy cập mục <strong>"Hồ sơ tuyển dụng"</strong> trong Trang Quản trị.</li>
                  <li>Xem thông tin ứng viên, chấm điểm phỏng vấn và nhấn nút <strong>"Phê duyệt & Kết nạp vào CLB"</strong>.</li>
                  <li>Hệ thống tự động nâng cấp vai trò của tài khoản từ <strong>Ứng viên (Applicant)</strong> thành <strong>Thành viên chính thức (Member)</strong> thuộc Ban được chỉ định.</li>
                </ol>
              </div>

              {/* Roles matrix */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 mb-2">Bảng Phân quyền Vai trò BK-IC:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-semibold text-red-600 block">1. Admin (Ban Chủ nhiệm)</span>
                    <span>Toàn quyền quản trị: Cấp/xóa tài khoản, phê duyệt bảo lưu, quản lý buổi đào tạo, tổng hợp đánh giá tháng, xuất báo cáo CSV.</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-semibold text-blue-600 block">2. Leader (Trưởng ban)</span>
                    <span>Quản lý thành viên trong ban, chấm điểm đánh giá tháng, giao nhiệm vụ và giám sát tiến độ hoạt động.</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-semibold text-emerald-600 block">3. Member (Thành viên chính thức)</span>
                    <span>Quét mã QR điểm danh buổi tập huấn, nộp báo cáo nhiệm vụ, gửi phản hồi ẩn danh, xem lịch sử đánh giá cá nhân.</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="font-semibold text-amber-600 block">4. Applicant (Ứng viên)</span>
                    <span>Theo dõi trạng thái xét duyệt hồ sơ, xem quy chế và đợi Ban Chủ nhiệm xác nhận kết nạp.</span>
                  </div>
                </div>
              </div>

              {/* Setup guidelines */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5 text-xs">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>Chính sách bảo mật mật khẩu hệ thống:</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Mật khẩu tài khoản phải có tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt. Thành viên có thể đổi mật khẩu bất kỳ lúc nào hoặc sử dụng tính năng "Quên mật khẩu?" để nhận mật khẩu tạm thời qua email.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs hover:bg-blue-700 transition"
              >
                Đã hiểu, quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
