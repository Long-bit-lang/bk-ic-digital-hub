import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../components/brand/Logo';
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Mail, Home } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { currentUser, reloadMembers } = useApp();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Thiếu mã xác thực trong liên kết. Vui lòng kiểm tra lại liên kết được gửi trong email của bạn.');
      return;
    }

    let isMounted = true;
    api.auth
      .verifyEmail(token)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Xác nhận địa chỉ email thành công!');
          if (reloadMembers) {
            reloadMembers();
          }
        } else {
          setStatus('error');
          setMessage(res.message || 'Không thể xác thực email. Liên kết có thể đã hết hạn hoặc không hợp lệ.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setStatus('error');
        setMessage(err?.message || 'Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.');
      });

    return () => {
      isMounted = false;
    };
  }, [token, reloadMembers]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setResendMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ email sinh viên.' });
      return;
    }

    setIsResending(true);
    setResendMessage(null);
    try {
      const res = await api.auth.resendVerification(resendEmail.trim());
      setIsResending(false);
      setResendMessage({
        type: 'success',
        text: res.message || 'Nếu email đã được đăng ký, thư xác nhận mới đã được phát hành.'
      });
    } catch (err: any) {
      setIsResending(false);
      setResendMessage({
        type: 'error',
        text: err?.message || 'Không thể gửi lại email xác nhận vào lúc này.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50/40 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 space-y-6 text-center">
        <div className="flex justify-center mb-2">
          <Logo showSubtitle={false} />
        </div>

        {status === 'verifying' && (
          <div className="py-8 space-y-4">
            <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Đang xác thực địa chỉ email...</h2>
            <p className="text-xs text-slate-500">
              Vui lòng đợi giây lát trong khi hệ thống kiểm tra và kích hoạt tài khoản của bạn.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Xác thực Email Thành công!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>

            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-left">
              <strong>Tài khoản đã sẵn sàng:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-emerald-700">
                <li>Đã xác thực quyền sở hữu email sinh viên</li>
                <li>Hồ sơ ứng viên đã được ghi nhận trong danh sách tuyển sinh viên CLB BK-IC</li>
                <li>Bạn có thể đăng nhập để theo dõi lịch phỏng vấn và hoạt động</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to={currentUser ? '/portal' : '/login'}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
              >
                <span>{currentUser ? 'Vào Cổng thông tin thành viên' : 'Đăng nhập vào Hệ thống'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="h-16 w-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200 shadow-sm">
              <AlertCircle className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Xác thực Không thành công</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>

            {/* Resend Form */}
            <div className="pt-2 border-t border-slate-100 text-left space-y-3">
              <span className="text-xs font-semibold text-slate-800 block">
                Yêu cầu gửi lại thư xác nhận mới:
              </span>

              {resendMessage && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    resendMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {resendMessage.text}
                </div>
              )}

              <form onSubmit={handleResend} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Nhập email sinh viên của bạn"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition disabled:opacity-50"
                >
                  {isResending ? (
                    <span>Đang gửi lại...</span>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>Gửi lại Thư xác nhận</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </Link>
          <Link to="/login" className="hover:text-blue-600 transition font-medium">
            Đăng nhập / Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};
