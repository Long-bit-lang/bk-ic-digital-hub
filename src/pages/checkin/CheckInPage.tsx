// BK-IC Digital Hub - Dedicated Real-world QR Meeting Check-In Page
// Supports 6 Mobile UX States:
// State A: Not logged in
// State B: Processing check-in
// State C: Check-in Success (On-time or Late)
// State D: Already checked in previously
// State E: Ineligible account / unit mismatch
// State F: QR Window closed, Token expired, or Cancelled meeting

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { TrainingSession, AttendanceRecord, AttendanceStatus } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  UserCheck, 
  LogIn, 
  ArrowLeft, 
  RotateCw, 
  Building2, 
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../../components/brand/Logo';

type CheckinUiState = 'loading_info' | 'not_logged_in' | 'processing' | 'success' | 'already_checked_in' | 'ineligible' | 'error';

export const CheckInPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const routeParams = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const sessionId = routeParams.sessionId || searchParams.get('sessionId') || '';
  const token = searchParams.get('token') || '';

  const [session, setSession] = useState<TrainingSession | null>(null);
  const [qrWindow, setQrWindow] = useState<any>(null);
  const [uiState, setUiState] = useState<CheckinUiState>('loading_info');
  const [errorMessage, setErrorMessage] = useState('');
  const [resultRecord, setResultRecord] = useState<AttendanceRecord | null>(null);
  const [resultStatus, setResultStatus] = useState<AttendanceStatus>('present');
  const [statusText, setStatusText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [hasAttempted, setHasAttempted] = useState(false);

  // Load meeting information
  const fetchSessionInfo = useCallback(async () => {
    if (!sessionId) {
      setUiState('error');
      setErrorMessage('Không tìm thấy mã buổi meeting trong liên kết QR. Vui lòng quét lại.');
      return;
    }

    try {
      const res = await api.attendance.getSessionInfo(sessionId);
      if (res.success && res.session) {
        setSession(res.session);
        setQrWindow(res.qrWindow);

        // If session is cancelled
        if (res.session.status === 'cancelled') {
          setUiState('error');
          setErrorMessage('Buổi meeting này đã bị hủy. Hệ thống không tiếp nhận điểm danh.');
          return;
        }

        // If attendance list finalized
        if (res.session.attendanceStatus === 'finalized') {
          setUiState('error');
          setErrorMessage('Danh sách điểm danh của buổi meeting này đã được chốt và khóa. Vui lòng liên hệ Người phụ trách hoặc Ban Thành viên.');
          return;
        }

        // Check if QR window is completely closed
        if (res.qrWindow && !res.qrWindow.isOpen && res.qrWindow.isAfterWindow) {
          setUiState('error');
          setErrorMessage('Cửa sổ điểm danh QR đã đóng (quá giờ đóng cổng quy định). Vui lòng liên hệ Người phụ trách để điểm danh thủ công tại chỗ.');
          return;
        }

        if (res.qrWindow && !res.qrWindow.isOpen && res.qrWindow.isBeforeWindow) {
          setUiState('error');
          setErrorMessage('Cửa sổ điểm danh QR chưa mở (chỉ mở trước giờ bắt đầu 15 phút). Vui lòng quét lại khi đến giờ.');
          return;
        }

        // If gate was closed automatically or manually
        if (res.session.attendanceStatus === 'closed') {
          setUiState('error');
          setErrorMessage('Cổng điểm danh của phiên sinh hoạt này hiện đang đóng. Vui lòng liên hệ Người phụ trách hoặc Ban Thành viên.');
          return;
        }

        // Session is open and valid; now determine authentication state
        if (!currentUser) {
          setUiState('not_logged_in');
        } else {
          // User is authenticated, proceed to check-in execution
          executeCheckin(sessionId, token);
        }
      } else {
        setUiState('error');
        setErrorMessage('Không tìm thấy dữ liệu buổi meeting tương ứng.');
      }
    } catch (err: any) {
      setUiState('error');
      setErrorMessage(err.message || 'Lỗi khi tải thông tin buổi meeting.');
    }
  }, [sessionId, token, currentUser]);

  // Execute check-in
  const executeCheckin = async (sid: string, qrToken?: string) => {
    if (!currentUser) {
      setUiState('not_logged_in');
      return;
    }

    // Pre-check user account status
    if (currentUser.accountStatus && currentUser.accountStatus !== 'active') {
      setUiState('ineligible');
      setErrorMessage('Tài khoản của bạn chưa được kích hoạt hoặc đang bị tạm khóa. Vui lòng liên hệ Ban Thành viên.');
      return;
    }

    if (currentUser.status === 'paused' || currentUser.status === 'left' || currentUser.status === 'suspended') {
      const statusLabel = currentUser.status === 'paused' ? 'Bảo lưu' : currentUser.status === 'suspended' ? 'Đình chỉ sinh hoạt' : 'Đã rời CLB';
      setUiState('ineligible');
      setErrorMessage(`Tài khoản của bạn đang ở trạng thái "${statusLabel}". Bạn không đủ điều kiện tham gia điểm danh buổi này.`);
      return;
    }

    if (currentUser.role === 'guest' || currentUser.role === 'applicant') {
      setUiState('ineligible');
      setErrorMessage('Tài khoản của bạn chưa được kết nạp thành viên chính thức của BK-IC Hub để điểm danh.');
      return;
    }

    setUiState('processing');
    setHasAttempted(true);

    try {
      const res = await api.attendance.checkinQR(sid, qrToken);
      if (res.success) {
        setFeedbackMessage(res.message);
        if (res.record) {
          setResultRecord(res.record);
          setResultStatus(res.record.status);
          setStatusText(res.record.status === 'present' ? 'Có mặt đúng giờ' : 'Đi trễ');
        }

        if (res.alreadyCheckedIn) {
          // State D: Already Checked In
          setUiState('already_checked_in');
        } else {
          // State C: Success
          setUiState('success');
        }
      } else {
        setUiState('error');
        setErrorMessage(res.message || 'Điểm danh không thành công.');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('dành riêng cho') || msg.includes('không thể tham gia') || msg.includes('Bảo lưu') || msg.includes('Đã rời CLB')) {
        setUiState('ineligible');
        setErrorMessage(msg);
      } else {
        setUiState('error');
        setErrorMessage(msg || 'Lỗi khi gửi yêu cầu điểm danh.');
      }
    }
  };

  useEffect(() => {
    fetchSessionInfo();
  }, [fetchSessionInfo]);

  // Navigate to login preserving return URL
  const handleGoToLogin = () => {
    const fullReturnUrl = window.location.pathname + window.location.search;
    navigate('/login', {
      state: { from: fullReturnUrl }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Mobile Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-blue-500" />
            <span className="font-bold text-sm tracking-wide text-white">BK-IC HUB</span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-slate-200 truncate max-w-[110px]">
                  {currentUser.fullName}
                </span>
              </div>
            ) : (
              <button
                onClick={handleGoToLogin}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
              >
                <LogIn className="h-3.5 w-3.5" />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* Loading Information State */}
        {uiState === 'loading_info' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-center shadow-xl backdrop-blur-sm">
            <RotateCw className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white">Đang tải thông tin buổi meeting...</h2>
            <p className="text-sm text-slate-400 mt-1">Hệ thống đang kiểm tra tính hợp lệ của mã QR</p>
          </div>
        )}

        {/* STATE A: NOT LOGGED IN */}
        {uiState === 'not_logged_in' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/20">
                <UserCheck className="h-7 w-7" />
              </div>
              <span className="inline-block text-[11px] font-semibold tracking-wider text-blue-400 uppercase bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/40 mb-2">
                Trạng thái: Yêu cầu đăng nhập
              </span>
              <h1 className="text-xl font-bold text-white">Điểm danh Buổi Meeting</h1>
              <p className="text-xs text-slate-400 mt-1">
                Quét QR thành công. Vui lòng đăng nhập tài khoản sinh viên BK-IC để xác thực danh tính.
              </p>
            </div>

            {/* Meeting Card Preview */}
            {session && (
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                <div className="font-semibold text-sm text-blue-200 border-b border-slate-800 pb-2">
                  {session.title}
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{session.date} • {session.startTime} - {session.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{session.location}</span>
                  </div>
                  {session.personInChargeName && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Phụ trách: {session.personInChargeName}</span>
                    </div>
                  )}
                  {session.targetAudience && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Đối tượng: {session.targetAudience}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleGoToLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 px-4 shadow-lg shadow-blue-600/30 transition transform active:scale-98 text-sm"
              >
                <LogIn className="h-4 w-4" />
                Đăng nhập để điểm danh
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Chưa có tài khoản hoặc chưa là thành viên?{' '}
                  <Link to="/join" className="text-blue-400 hover:underline font-medium">
                    Đăng ký ứng tuyển
                  </Link>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Nếu gặp sự cố, vui lòng liên hệ Ban Thành viên để được hỗ trợ.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATE B: PROCESSING */}
        {uiState === 'processing' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl space-y-5">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <ShieldCheck className="h-7 w-7 text-blue-400 absolute" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Đang xử lý điểm danh...</h2>
              <p className="text-xs text-slate-400 mt-1">
                Đang xác thực danh tính từ phiên đăng nhập an toàn của bạn
              </p>
            </div>
            {currentUser && (
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-xs text-left space-y-1">
                <div className="text-slate-400">Tài khoản: <span className="font-semibold text-slate-200">{currentUser.fullName}</span></div>
                <div className="text-slate-400">MSSV: <span className="font-mono text-slate-200">{currentUser.studentId}</span></div>
                <div className="text-slate-400">Email: <span className="font-mono text-slate-300">{currentUser.email}</span></div>
              </div>
            )}
          </div>
        )}

        {/* STATE C: CHECK-IN SUCCESS */}
        {uiState === 'success' && (
          <div className="bg-slate-800/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h1 className="text-2xl font-black text-white">Điểm Danh Thành Công!</h1>
              <p className="text-xs text-emerald-300 mt-1 font-medium">
                Hệ thống đã ghi nhận sự có mặt của bạn vào cơ sở dữ liệu CLB.
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                resultStatus === 'present'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                <span className={`h-2 w-2 rounded-full ${resultStatus === 'present' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {resultStatus === 'present' ? 'Có mặt đúng giờ' : 'Đến muộn (Sau mốc 10 phút)'}
              </span>
            </div>

            {/* Attendance Details Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                Thông tin xác nhận
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Thành viên:</span>
                  <span className="font-semibold text-slate-200">{resultRecord?.memberName || currentUser?.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MSSV:</span>
                  <span className="font-mono font-medium text-slate-200">{resultRecord?.studentId || currentUser?.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Đơn vị/Ban:</span>
                  <span className="font-medium text-slate-200">{resultRecord?.unit || currentUser?.unit || 'Thành viên'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phương thức:</span>
                  <span className="font-medium text-blue-400">QR xoay vòng bảo mật</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[11px]">Buổi meeting:</span>
                <span className="font-medium text-blue-200 block truncate">{session?.title}</span>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {session?.date} • {session?.startTime} - {session?.endTime} • {session?.location}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Thời gian ghi nhận:</span>
                <span className="font-mono text-emerald-300 font-semibold">
                  {resultRecord?.checkInTime ? new Date(resultRecord.checkInTime).toLocaleTimeString('vi-VN') : new Date().toLocaleTimeString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate('/portal/attendance')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 text-xs shadow-md transition"
              >
                Xem lịch sử điểm danh cá nhân
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/portal')}
                className="w-full rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 text-xs transition"
              >
                Về Trang tổng quan (Portal)
              </button>
            </div>
          </div>
        )}

        {/* STATE D: ALREADY CHECKED IN */}
        {uiState === 'already_checked_in' && (
          <div className="bg-slate-800/95 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/30">
                <ShieldCheck className="h-9 w-9" />
              </div>
              <h1 className="text-xl font-bold text-white">Đã Điểm Danh Trước Đó</h1>
              <p className="text-xs text-blue-300 mt-1 font-medium">
                {feedbackMessage || 'Bạn đã hoàn tất điểm danh cho buổi meeting này.'}
              </p>
            </div>

            {/* Note banner */}
            <div className="rounded-xl bg-blue-950/60 border border-blue-800/60 p-3.5 text-xs text-blue-200 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Chống trùng lặp điểm danh:</p>
                <p className="text-blue-300/90 text-[11px] mt-0.5">
                  Mỗi thành viên chỉ được ghi nhận đúng một lần. Hệ thống giữ nguyên bản ghi điểm danh ban đầu và không tạo thêm dữ liệu mới.
                </p>
              </div>
            </div>

            {/* Attendance Details Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                Bản ghi hiện hữu
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Thành viên:</span>
                  <span className="font-semibold text-slate-200">{resultRecord?.memberName || currentUser?.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">MSSV:</span>
                  <span className="font-mono font-medium text-slate-200">{resultRecord?.studentId || currentUser?.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Trạng thái:</span>
                  <span className={`font-semibold ${resultStatus === 'present' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {statusText || (resultStatus === 'present' ? 'Có mặt đúng giờ' : 'Đi trễ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Đơn vị:</span>
                  <span className="font-medium text-slate-200">{resultRecord?.unit || currentUser?.unit || 'Thành viên'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[11px]">Buổi meeting:</span>
                <span className="font-medium text-slate-200 block truncate">{session?.title}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate('/portal/attendance')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 text-xs shadow-md transition"
              >
                Xem chi tiết lịch sử điểm danh
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/portal')}
                className="w-full rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 text-xs transition"
              >
                Về Trang tổng quan (Portal)
              </button>
            </div>
          </div>
        )}

        {/* STATE E: INELIGIBLE */}
        {uiState === 'ineligible' && (
          <div className="bg-slate-800/95 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/30">
                <AlertTriangle className="h-9 w-9" />
              </div>
              <h1 className="text-xl font-bold text-white">Không Đủ Điều Kiện Điểm Danh</h1>
              <p className="text-xs text-amber-300 mt-2 leading-relaxed">
                {errorMessage || 'Tài khoản của bạn hiện không thuộc danh sách đối tượng được điểm danh buổi này.'}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">Hướng dẫn xử lý:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Kiểm tra lại tài khoản bạn đang đăng nhập có phải email sinh viên đã đăng ký trong BK-IC Hub không.</li>
                <li>Nếu buổi meeting dành riêng cho ban/bộ phận khác, bạn không thể điểm danh buổi này.</li>
                <li>Nếu bạn đã chuyển ban hoặc cần bảo lưu/phục hồi sinh hoạt, vui lòng liên hệ Ban Thành viên (BTV).</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  logout();
                  handleGoToLogin();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 px-4 text-xs shadow-md transition"
              >
                <LogIn className="h-4 w-4" />
                Đăng nhập tài khoản khác
              </button>

              <button
                onClick={() => navigate('/portal')}
                className="w-full rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 text-xs transition"
              >
                Về Trang tổng quan
              </button>
            </div>
          </div>
        )}

        {/* STATE F: ERROR / EXPIRED */}
        {uiState === 'error' && (
          <div className="bg-slate-800/95 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 text-red-400 mb-3 border border-red-500/30">
                <XCircle className="h-9 w-9" />
              </div>
              <h1 className="text-xl font-bold text-white">Không Thể Điểm Danh</h1>
              <p className="text-xs text-red-300 mt-2 leading-relaxed">
                {errorMessage || 'Yêu cầu điểm danh không hợp lệ hoặc đã quá hạn.'}
              </p>
            </div>

            {/* Error Guidance */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">Gợi ý khắc phục:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Nếu mã QR đã xoay vòng, hãy quét mã mới nhất đang hiển thị trên màn hình máy chiếu.</li>
                <li>Nếu quá 15 phút sau giờ bắt đầu, cửa sổ QR đã đóng. Hãy báo Người phụ trách buổi hoặc Ban Thành viên để điểm danh thủ công.</li>
                <li>Kiểm tra lại kết nối mạng 4G/Wifi trên điện thoại.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setUiState('loading_info');
                  fetchSessionInfo();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 text-xs shadow-md transition"
              >
                <RotateCw className="h-4 w-4" />
                Thử lại
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 text-xs transition"
              >
                Về Trang chủ
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-3 text-center text-[11px] text-slate-500">
        BK-IC Digital Hub &bull; Điểm danh Meeting QR Thời gian thực
      </footer>
    </div>
  );
};
