// Dynamic Rotating QR Code Projector Component for BK-IC Sessions
// Displays server-authoritative rotating QR, live polling attendee stream, counter metrics, gate management, search/filter, and copy link
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Session, AttendanceRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Clock, 
  Users, 
  ShieldCheck, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Search,
  Filter,
  UserCheck,
  Globe,
  Settings,
  PlusCircle,
  AlertTriangle,
  Play,
  Square,
  Lock,
  ShieldAlert,
  QrCode
} from 'lucide-react';

interface DynamicQRProjectorProps {
  session: Session;
  onClose: () => void;
}

export const DynamicQRProjector: React.FC<DynamicQRProjectorProps> = ({ session, onClose }) => {
  const { 
    currentUser, 
    sessions, 
    attendance, 
    users, 
    reloadAttendance, 
    reloadSessions,
    manualCheckin, 
    updateSession, 
    finalizeSessionAttendance 
  } = useApp();

  // Always use the latest live session object from context if updated
  const liveSession = sessions.find(s => s.id === session.id) || session;

  const [tokenData, setTokenData] = useState<{ token: string; expiresIn: number; intervalSec: number }>({
    token: '',
    expiresIn: 20,
    intervalSec: 20
  });
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'late'>('all');
  const [isTogglingGate, setIsTogglingGate] = useState(false);

  // Deployment domain configuration
  const [customDomain, setCustomDomain] = useState<string>(() => {
    return localStorage.getItem('bkic_custom_qr_origin') || '';
  });
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [tempDomain, setTempDomain] = useState(customDomain);

  // Manual Check-in Modal inside Projector
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualMemberId, setManualMemberId] = useState('');
  const [manualStatus, setManualStatus] = useState<'present' | 'late'>('present');
  const [manualNotes, setManualNotes] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Authorization check for Gate / Settings
  const isPic = currentUser?.id === liveSession.personInChargeId;
  const isAdminOrBn = currentUser?.unit === 'BN' || currentUser?.role === 'admin' || currentUser?.role === 'sysadmin';
  const canManageGate = isPic || isAdminOrBn;

  // Determine effective origin for QR URL
  const effectiveOrigin = useMemo(() => {
    if (customDomain.trim()) {
      return customDomain.trim().replace(/\/$/, '');
    }
    return window.location.origin;
  }, [customDomain]);

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Server-authoritative token fetch
  const fetchToken = useCallback(async () => {
    try {
      const res = await api.attendance.getQRToken(session.id);
      if (res.success) {
        setTokenData({
          token: res.token,
          expiresIn: res.expiresIn,
          intervalSec: res.intervalSec || 20
        });
        setAuthError(null);
      } else {
        setAuthError((res as any).message || 'Không thể tạo hoặc hiển thị mã QR.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Bạn không có quyền tạo hoặc hiển thị mã QR điểm danh cho buổi này.');
    } finally {
      setIsLoadingToken(false);
    }
  }, [session.id]);

  // Initial token load
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Token rotation interval (count down each second; re-fetch from server when slot resets)
  useEffect(() => {
    if (authError || isLoadingToken) return;

    const timer = setInterval(() => {
      setTokenData(prev => {
        if (!prev.token) return prev;
        if (prev.expiresIn <= 1) {
          fetchToken();
          return { ...prev, expiresIn: prev.intervalSec };
        }
        return { ...prev, expiresIn: prev.expiresIn - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchToken, authError, isLoadingToken]);

  // Live real-time polling of attendance records and session status every 5s
  useEffect(() => {
    const pollInterval = setInterval(() => {
      reloadAttendance().catch(() => {});
      reloadSessions().catch(() => {});
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [reloadAttendance, reloadSessions]);

  // Filter attendance for this specific session
  const sessionAttendance = useMemo(() => {
    return attendance.filter(a => a.sessionId === liveSession.id);
  }, [attendance, liveSession.id]);

  const presentCount = sessionAttendance.filter(a => a.status === 'present').length;
  const lateCount = sessionAttendance.filter(a => a.status === 'late').length;
  const totalAttended = presentCount + lateCount;

  // Calculate target audience eligible count
  const eligibleUsers = useMemo(() => {
    const audience = (liveSession.targetAudience || liveSession.targetParticipants || '').toLowerCase().trim();
    const isOpenToAll = !audience || [
      'all', 'tất cả', 'toàn thể', 'toàn clb', 'thành viên chính thức', 'toàn thể thành viên chính thức', 'toàn thể thành viên clb'
    ].some(kw => audience.includes(kw));

    return users.filter(u => {
      if (u.status === 'paused' || u.status === 'left' || u.status === 'suspended') return false;
      if (u.role === 'admin' || u.role === 'sysadmin') return true;
      if (isOpenToAll) return true;

      const uUnit = (u.unit || u.committee || '').toLowerCase();
      const unitAliases: Record<string, string[]> = {
        'bn': ['bn', 'ban chủ nhiệm', 'chủ nhiệm'],
        'bdh': ['bdh', 'bđh', 'ban điều hành', 'điều hành', 'chuyên môn', 'kỹ thuật', 'truyền thông', 'dự án'],
        'btv': ['btv', 'ban thành viên', 'thành viên', 'nhân sự', 'hr']
      };

      if (uUnit && audience.includes(uUnit)) return true;
      if (uUnit && unitAliases[uUnit] && unitAliases[uUnit].some(alias => audience.includes(alias))) return true;
      return false;
    });
  }, [users, liveSession.targetAudience, liveSession.targetParticipants]);

  const totalEligible = eligibleUsers.length || 1;
  const attendanceRate = Math.min(100, Math.round((totalAttended / totalEligible) * 100));

  // Gate open/closed state
  const isGateOpen = (liveSession.attendanceStatus === 'open' || (liveSession as any).isAttendanceOpen) && liveSession.status !== 'cancelled';

  // Toggle Gate action for PIC / Admin
  const handleToggleGate = async () => {
    if (!canManageGate) return;
    setIsTogglingGate(true);
    try {
      if (isGateOpen) {
        await updateSession(liveSession.id, {
          attendanceStatus: 'closed',
          timeChangeReason: `Người phụ trách ${currentUser?.fullName} đóng cổng điểm danh từ Projector`
        });
      } else {
        await updateSession(liveSession.id, {
          attendanceStatus: 'open',
          status: 'ongoing',
          timeChangeReason: `Người phụ trách ${currentUser?.fullName} mở cổng điểm danh từ Projector`
        });
      }
      await reloadSessions();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái cổng điểm danh.');
    } finally {
      setIsTogglingGate(false);
    }
  };

  // Finalize Attendance action for PIC / Admin
  const handleFinalizeAttendance = async () => {
    if (!canManageGate) return;
    if (window.confirm(`Xác nhận chốt sổ và khóa danh sách điểm danh cho buổi "${liveSession.title}"? Thao tác này sẽ khóa quyền điểm danh QR.`)) {
      try {
        await finalizeSessionAttendance(liveSession.id);
        await reloadSessions();
      } catch (err: any) {
        alert(err.message || 'Lỗi khi chốt sổ điểm danh');
      }
    }
  };

  // Check-in URL
  const checkinUrl = `${effectiveOrigin}/checkin?sessionId=${liveSession.id}&token=${tokenData.token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkinUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {});
  };

  const handleSaveDomain = () => {
    const cleaned = tempDomain.trim().replace(/\/$/, '');
    setCustomDomain(cleaned);
    if (cleaned) {
      localStorage.setItem('bkic_custom_qr_origin', cleaned);
    } else {
      localStorage.removeItem('bkic_custom_qr_origin');
    }
    setShowDomainInput(false);
  };

  const handleManualCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMemberId) return;
    setManualSubmitting(true);
    try {
      await manualCheckin(
        liveSession.id, 
        manualMemberId, 
        manualStatus, 
        manualNotes || `Điểm danh thủ công tại chỗ bởi ${currentUser?.fullName || 'Người phụ trách'}`
      );
      setShowManualModal(false);
      setManualMemberId('');
      setManualNotes('');
      await reloadAttendance();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi điểm danh thủ công');
    } finally {
      setManualSubmitting(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const progressPercent = tokenData.intervalSec > 0
    ? ((tokenData.intervalSec - tokenData.expiresIn) / tokenData.intervalSec) * 100
    : 0;

  // Filtered attendance list
  const filteredList = useMemo(() => {
    return sessionAttendance.filter(rec => {
      if (filterStatus !== 'all' && rec.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nameMatch = (rec.memberName || '').toLowerCase().includes(q);
        const idMatch = (rec.studentId || '').toLowerCase().includes(q);
        const unitMatch = (rec.unit || '').toLowerCase().includes(q);
        return nameMatch || idMatch || unitMatch;
      }
      return true;
    });
  }, [sessionAttendance, filterStatus, searchTerm]);

  // If unauthorized error returned by server
  if (authError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-6">
        <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-rose-200 p-8 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              Từ chối Quyền Trình chiếu QR
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {authError}
            </p>
            <p className="text-xs text-slate-400">
              Chỉ Người phụ trách meeting được phân công, Ban Chủ nhiệm hoặc Ban Quản trị mới có quyền tạo và mở màn hình chiếu mã QR điểm danh cho phiên này.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition shadow-sm"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isGateOpen ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isGateOpen ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span>Trình chiếu QR Điểm danh Động</span>
                {isGateOpen ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Cổng Đang Mở
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                    Cổng Đã Đóng (Hết Giờ)
                  </span>
                )}
                {isPic && (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Người phụ trách (PIC)
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 truncate max-w-lg">
                {liveSession.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Gate Toggle Button for PIC / Admin */}
            {canManageGate && liveSession.status !== 'cancelled' && liveSession.attendanceStatus !== 'finalized' && (
              <button
                onClick={handleToggleGate}
                disabled={isTogglingGate}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                  isGateOpen
                    ? 'bg-amber-500/15 text-amber-700 border border-amber-300 hover:bg-amber-500/25'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
                title={isGateOpen ? 'Đóng cổng điểm danh' : 'Mở cổng điểm danh'}
              >
                {isGateOpen ? (
                  <>
                    <Square className="h-3 w-3 fill-current" />
                    <span>Đóng cổng</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-current" />
                    <span>Mở cổng ngay</span>
                  </>
                )}
              </button>
            )}

            {/* Finalize Button for PIC / Admin */}
            {canManageGate && liveSession.attendanceStatus !== 'finalized' && liveSession.status !== 'cancelled' && (
              <button
                onClick={handleFinalizeAttendance}
                className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition shadow-xs"
                title="Chốt sổ và khóa danh sách điểm danh"
              >
                <Lock className="h-3 w-3" />
                <span>Chốt sổ</span>
              </button>
            )}

            <button
              onClick={() => setShowDomainInput(!showDomainInput)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition shadow-xs ${
                customDomain
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Cấu hình URL công khai (HTTPS)"
            >
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">{customDomain ? 'URL Tùy chỉnh' : 'Cấu hình Domain'}</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
              title="Sao chép liên kết điểm danh"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{copiedLink ? 'Đã sao chép!' : 'Sao chép link'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-200 transition"
              title="Toàn màn hình máy chiếu"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
              title="Đóng màn hình chiếu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Public Deployment URL Banner & Configuration */}
        {(showDomainInput || (isLocalhost && !customDomain)) && (
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                {isLocalhost && !customDomain
                  ? 'Máy chủ chiếu đang chạy trên localhost. Để camera điện thoại mở được trang điểm danh, hãy nhập Domain HTTPS công khai:'
                  : 'Cấu hình Domain HTTPS mã QR (hỗ trợ điện thoại quét trực tiếp trong hội trường):'}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={tempDomain}
                onChange={(e) => setTempDomain(e.target.value)}
                placeholder="https://ais-pre-...run.app"
                className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={handleSaveDomain}
                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 shrink-0 transition"
              >
                Lưu URL
              </button>
              {customDomain && (
                <button
                  onClick={() => {
                    setCustomDomain('');
                    setTempDomain('');
                    localStorage.removeItem('bkic_custom_qr_origin');
                  }}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-red-600 transition"
                  title="Khôi phục mặc định"
                >
                  Mặc định
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 items-start">
          {/* Left Column: QR Code Display & Instructions */}
          <div className="md:col-span-6 flex flex-col items-center text-center">
            <div className="relative rounded-2xl bg-white p-5 shadow-lg border border-slate-200">
              {isLoadingToken || !tokenData.token ? (
                <div className="h-[280px] w-[280px] flex flex-col items-center justify-center gap-3">
                  <RotateCw className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="text-xs text-slate-500 font-medium">Đang tạo mã QR bảo mật...</span>
                </div>
              ) : (
                <QRCodeSVG
                  value={checkinUrl}
                  size={280}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
              )}

              {/* Dynamic rotation indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
                <RotateCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                <span>Mã xoay vòng sau:</span>
                <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                  {tokenData.expiresIn}s
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${Math.max(0, 100 - progressPercent)}%` }}
                ></div>
              </div>

              {/* Closed Gate Overlay */}
              {!isGateOpen && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center z-10 transition-all">
                  <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-3">
                    <Lock className="h-6 w-6 text-rose-400" />
                  </div>
                  <h4 className="font-bold text-base text-white">Cổng điểm danh đã đóng</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-[240px]">
                    Đã tới giờ đóng cổng ({liveSession.attendanceCloseTime || '14:30'}). Hệ thống đã tự động khóa điểm danh QR.
                  </p>
                  {canManageGate && (
                    <button
                      onClick={handleToggleGate}
                      disabled={isTogglingGate}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Mở lại cổng điểm danh</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Token details */}
            <div className="mt-4 font-mono text-[11px] text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
              Mã bảo mật: <span className="text-slate-800 font-semibold">{tokenData.token || '...'}</span>
            </div>

            <div className="mt-4 text-xs text-slate-700 max-w-sm space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                <QrCode className="h-3.5 w-3.5 text-blue-600" />
                <span>Mở chức năng quét QR trong BK-IC Digital Hub để điểm danh</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Thành viên đăng nhập tài khoản cá nhân và quét mã trên màn hình để hệ thống tự động ghi nhận có mặt.
              </p>
            </div>
          </div>

          {/* Right Column: Live Roster & Metrics */}
          <div className="md:col-span-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-6 md:pt-0">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span>Thống kê điểm danh trực tiếp</span>
                  <span className="text-emerald-600 font-mono text-[11px]">Tự động 5s</span>
                </div>
                {canManageGate && (
                  <button
                    onClick={() => setShowManualModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium border border-blue-200 transition shadow-xs"
                    title="Điểm danh cho thành viên quên điện thoại hoặc hết pin"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
                    <span>Điểm danh tại chỗ</span>
                  </button>
                )}
              </div>

              {/* Metrics Counters */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-3 text-center">
                  <div className="text-[11px] text-blue-700 font-medium">Tổng có mặt</div>
                  <div className="text-2xl font-black text-blue-900 mt-0.5 tabular-nums font-mono">
                    {totalAttended}
                    <span className="text-xs font-normal text-blue-500">/{totalEligible}</span>
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5 font-semibold">
                    {attendanceRate}%
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-3 text-center">
                  <div className="text-[11px] text-emerald-700 font-medium">Đúng giờ</div>
                  <div className="text-2xl font-black text-emerald-900 mt-0.5 tabular-nums font-mono">
                    {presentCount}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                    ≤ 10 phút
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50/80 border border-amber-100 p-3 text-center">
                  <div className="text-[11px] text-amber-700 font-medium">Đến muộn</div>
                  <div className="text-2xl font-black text-amber-900 mt-0.5 tabular-nums font-mono">
                    {lateCount}
                  </div>
                  <div className="text-[10px] text-amber-600 mt-0.5 font-medium">
                    10 - 15 phút
                  </div>
                </div>
              </div>

              {/* Meeting info row */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Thời gian buổi sinh hoạt:</span>
                  <span className="font-semibold text-slate-800">{liveSession.startTime} - {liveSession.endTime} ({liveSession.date})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Người phụ trách (PIC):</span>
                  <span className="font-semibold text-blue-700">{liveSession.personInChargeName || 'Ban Chủ nhiệm'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ngưỡng tính muộn / Đóng QR:</span>
                  <span className="font-medium text-slate-700 font-mono">+10p / +15p sau giờ bắt đầu</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Đối tượng tham gia:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">{liveSession.targetAudience || 'Tất cả thành viên'}</span>
                </div>
              </div>

              {/* Search and Filter for Roster */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên hoặc MSSV..."
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilterStatus('present')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      filterStatus === 'present' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Đúng giờ
                  </button>
                  <button
                    onClick={() => setFilterStatus('late')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      filterStatus === 'late' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Muộn
                  </button>
                </div>
              </div>

              {/* Real-time check-in stream list */}
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {filteredList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    {sessionAttendance.length === 0
                      ? 'Chưa có thành viên nào quét mã. Hãy quét QR trên màn hình!'
                      : 'Không tìm thấy kết quả phù hợp với bộ lọc.'}
                  </div>
                ) : (
                  filteredList.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs border border-slate-100 hover:bg-slate-100/60 transition"
                    >
                      <div className="truncate mr-2">
                        <span className="font-semibold text-slate-800">{rec.memberName}</span>
                        <span className="text-slate-500 ml-1.5 font-mono text-[11px]">{rec.studentId}</span>
                        {rec.unit && (
                          <span className="ml-1.5 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                            {rec.unit}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">
                          {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.status === 'present' ? 'Đúng giờ' : 'Đến muộn'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Thuật toán Opaque Token xoay vòng</span>
              </span>
              <span>BK-IC Digital Hub</span>
            </div>
          </div>
        </div>

        {/* Modal: Điểm danh thủ công tại chỗ cho PIC/BTV */}
        {showManualModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Điểm danh Thủ công tại chỗ</h3>
                </div>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleManualCheckinSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Chọn thành viên tham gia <span className="text-red-500">*</span>:
                  </label>
                  <select
                    value={manualMemberId}
                    onChange={(e) => setManualMemberId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn thành viên --</option>
                    {eligibleUsers
                      .filter(u => !sessionAttendance.some(a => a.memberId === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} - {u.studentId} ({u.unit || 'BDH'})
                        </option>
                      ))}
                  </select>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    (Chỉ hiển thị các thành viên chưa có bản ghi điểm danh buổi này)
                  </span>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Trạng thái điểm danh:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setManualStatus('present')}
                      className={`py-2 px-3 rounded-xl border font-semibold transition ${
                        manualStatus === 'present'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Đúng giờ (Present)
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualStatus('late')}
                      className={`py-2 px-3 rounded-xl border font-semibold transition ${
                        manualStatus === 'late'
                          ? 'border-amber-500 bg-amber-50 text-amber-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Đi trễ (Late)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Ghi chú / Lý do điểm danh thủ công:
                  </label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    placeholder="VD: Không mang điện thoại, điện thoại hết pin..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={manualSubmitting || !manualMemberId}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 transition"
                  >
                    {manualSubmitting ? 'Đang lưu...' : 'Xác nhận Điểm danh'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
