// BK-IC Pending Approval Screen for New Accounts & Applicants
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Logo } from '../../components/brand/Logo';
import { 
  Clock, 
  ShieldAlert, 
  FileCheck, 
  Sparkles, 
  LogOut, 
  ArrowRight,
  Send,
  Mail,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const ResendVerificationButton: React.FC<{ email: string }> = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.auth.resendVerification(email);
      setLoading(false);
      setMsg({ type: 'success', text: res.message || 'Đã gửi lại thư xác nhận thành công!' });
    } catch (err: any) {
      setLoading(false);
      setMsg({ type: 'error', text: err?.message || 'Không thể gửi lại thư xác nhận lúc này.' });
    }
  };

  return (
    <div className="pt-1">
      {msg && (
        <div className={`p-2 rounded-lg text-[11px] mb-2 ${
          msg.type === 'success' ? 'bg-emerald-100/70 text-emerald-800' : 'bg-red-100/70 text-red-800'
        }`}>
          {msg.text}
        </div>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={handleResend}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Đang gửi...</span>
          </>
        ) : (
          <>
            <Mail className="h-3 w-3" />
            <span>Gửi lại Thư xác nhận Email</span>
          </>
        )}
      </button>
    </div>
  );
};

export const PendingApprovalPage: React.FC = () => {
  const { currentUser, logout, applications } = useApp();

  // Find applicant's application record if any
  const myApp = applications.find(
    a => a.email.toLowerCase() === currentUser?.email.toLowerCase() || 
         a.studentId === currentUser?.studentId
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Clock className="h-8 w-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Hồ sơ đang chờ Phê duyệt
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Xin chào <strong className="text-slate-800">{currentUser?.fullName || currentUser?.email}</strong>. Tài khoản của bạn đã được khởi tạo trong hệ thống với vai trò <strong>Ứng viên (Applicant)</strong>.
          </p>
        </div>

        {/* Email Verification Status Notice */}
        <div className={`rounded-2xl border p-4 text-xs text-left space-y-2 ${
          currentUser?.emailVerified
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
            : 'bg-blue-50/70 border-blue-200 text-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>Xác minh Email Sinh viên:</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentUser?.emailVerified
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentUser?.emailVerified ? 'Đã xác minh ✓' : 'Chưa xác minh'}
            </span>
          </div>

          {!currentUser?.emailVerified && (
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Hệ thống đã gửi thư xác nhận kích hoạt tài khoản tới <strong>{currentUser?.email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc Thư rác/Spam) và bấm nút xác nhận.
              </p>
              <ResendVerificationButton email={currentUser?.email || ''} />
            </div>
          )}
        </div>

        {/* Security Rule explanation */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-left text-slate-600 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Chính sách Phân quyền An toàn BK-IC</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-500">
            Theo quy chế của CLB, tài khoản Google liên kết không được tự động cấp quyền thành viên cho đến khi Ban Chủ nhiệm xác nhận phỏng vấn và kết nạp chính thức.
          </p>
        </div>

        {myApp ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900">Tiến độ hồ sơ ứng tuyển:</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                {myApp.status === 'pending' ? 'Chờ duyệt' : myApp.status === 'under_review' ? 'Đang chấm điểm' : myApp.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              Ban ứng tuyển: <strong className="text-slate-800">{myApp.interestTrack}</strong>
            </div>
            <div className="text-[11px] text-slate-600">
              Ngày nộp: <strong className="text-slate-800">{new Date(myApp.submittedAt).toLocaleDateString('vi-VN')}</strong>
            </div>
            {myApp.reviewNotes && (
              <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-blue-200">
                <strong>Ghi chú:</strong> {myApp.reviewNotes}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Bạn chưa nộp đơn đăng ký nguyện vọng? Vui lòng hoàn thành mẫu đơn để Ban Nhân sự lên lịch phỏng vấn.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#245BFA] text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Nộp đơn Đăng ký Thành viên</span>
            </Link>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link to="/" className="text-slate-500 hover:text-slate-800">
            Quay lại trang chủ
          </Link>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};
