// BK-IC Member Sessions Schedule & Management Page
// Supports both attendee view and Person-in-Charge (PIC) meeting & QR projection controls
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Session } from '../../types';
import { DynamicQRProjector } from '../../components/qr/DynamicQRProjector';
import { api } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  QrCode, 
  AlertCircle, 
  Maximize2, 
  Play, 
  Square, 
  Lock, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Check, 
  Info, 
  X, 
  ExternalLink, 
  ShieldAlert, 
  RotateCw,
  FileText
} from 'lucide-react';

export const PortalSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    sessions, 
    attendance, 
    currentUser, 
    updateSession, 
    finalizeSessionAttendance,
    reloadSessions 
  } = useApp();

  const [projectingSession, setProjectingSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned'>('all');
  const [togglingSessionId, setTogglingSessionId] = useState<string | null>(null);
  const [selectedMeetingDetail, setSelectedMeetingDetail] = useState<Session | null>(null);
  const [isVerifyingQR, setIsVerifyingQR] = useState(false);
  const [verifyingSessionId, setVerifyingSessionId] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<{ title: string; message: string } | null>(null);

  // Sessions assigned to the current user as Person In Charge (PIC)
  const isUserPic = (s: Session) => {
    if (!currentUser) return false;
    return (
      s.personInChargeId === currentUser.id ||
      (s as any).organizerId === currentUser.id ||
      (s as any).responsibleUserId === currentUser.id ||
      (s as any).hostId === currentUser.id
    );
  };

  const isAdminOrBn = currentUser?.role === 'admin' || currentUser?.role === 'sysadmin' || currentUser?.unit === 'BN';
  const myAssignedSessions = sessions.filter(s => isUserPic(s));

  // Handler to open QR projector with server-side permission verification
  const handleOpenProjector = async (session: Session) => {
    setIsVerifyingQR(true);
    setVerifyingSessionId(session.id);
    setPermissionError(null);

    try {
      // Step 1: Pre-verify authorization against backend API
      const res = await api.attendance.getQRToken(session.id);
      if (res && res.success) {
        // Step 2: Launch projector modal
        setProjectingSession(session);
      } else {
        setPermissionError({
          title: 'Không thể mở mã QR điểm danh',
          message: (res as any)?.message || 'Bạn không có quyền mở hoặc trình chiếu mã QR cho meeting này.'
        });
      }
    } catch (err: any) {
      setPermissionError({
        title: 'Từ chối quyền truy cập',
        message: err.message || 'Hệ thống đã từ chối yêu cầu mở mã QR vì bạn không phải người phụ trách meeting này.'
      });
    } finally {
      setIsVerifyingQR(false);
      setVerifyingSessionId(null);
    }
  };

  // Handle toggling attendance gate for assigned session
  const handleToggleGate = async (session: Session) => {
    const isGateOpen = (session.attendanceStatus === 'open' || (session as any).isAttendanceOpen) && session.status !== 'cancelled';
    setTogglingSessionId(session.id);
    try {
      if (isGateOpen) {
        await updateSession(session.id, {
          attendanceStatus: 'closed',
          timeChangeReason: `Người phụ trách ${currentUser?.fullName} đóng cổng điểm danh`
        });
      } else {
        await updateSession(session.id, {
          attendanceStatus: 'open',
          status: 'ongoing',
          timeChangeReason: `Người phụ trách ${currentUser?.fullName} mở cổng điểm danh`
        });
      }
      await reloadSessions();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái cổng điểm danh.');
    } finally {
      setTogglingSessionId(null);
    }
  };

  // Handle finalization for assigned session
  const handleFinalize = async (session: Session) => {
    if (window.confirm(`Xác nhận chốt sổ và khóa điểm danh cho buổi "${session.title}"? Thao tác này sẽ vô hiệu hóa việc điểm danh qua QR.`)) {
      try {
        await finalizeSessionAttendance(session.id);
        await reloadSessions();
      } catch (err: any) {
        alert(err.message || 'Lỗi khi chốt sổ điểm danh');
      }
    }
  };

  const displayedSessions = activeTab === 'assigned' ? myAssignedSessions : sessions;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cổng Thành viên BK-IC
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Lịch Sinh hoạt & Quản lý Meeting
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi lịch họp CLB, xem chi tiết và sử dụng tài khoản cá nhân để trình chiếu mã QR cho meeting bạn phụ trách.
          </p>
        </div>

        {/* Tab Controls: Always visible so user can easily toggle between All and Assigned */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'assigned'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tôi phụ trách ({myAssignedSessions.length})</span>
          </button>
        </div>
      </div>

      {/* PIC Banner when user has assigned meetings */}
      {myAssignedSessions.length > 0 && activeTab === 'all' && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  Bạn được phân công phụ trách {myAssignedSessions.length} buổi meeting / sinh hoạt
                </h3>
                <p className="text-xs text-blue-800/80 mt-0.5">
                  Với tư cách là Người phụ trách được chỉ định, bạn có quyền mở/đóng cổng điểm danh và <strong>trình chiếu mã QR điểm danh</strong> trên màn hình chiếu tại phòng họp.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('assigned')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition shrink-0"
            >
              <span>Xem buổi phụ trách</span>
            </button>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {displayedSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-800">
              {activeTab === 'assigned'
                ? 'Bạn chưa được phân công phụ trách buổi meeting nào'
                : 'Chưa có lịch sinh hoạt nào được lên kế hoạch'}
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {activeTab === 'assigned'
                ? 'Khi Ban Chủ nhiệm hoặc Quản trị viên chỉ định tài khoản của bạn làm Người phụ trách một buổi họp, buổi đó sẽ tự động hiển thị tại đây kèm toàn quyền mở và trình chiếu mã QR điểm danh.'
                : 'Các thông báo lịch họp, sinh hoạt chuyên môn và workshop mới sẽ được cập nhật tại đây.'}
            </p>
            {activeTab === 'assigned' && (
              <button
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <span>Xem tất cả lịch sinh hoạt</span>
              </button>
            )}
          </div>
        ) : (
          displayedSessions.map((s) => {
            const isPic = isUserPic(s);
            const canManage = isPic || isAdminOrBn;
            const myRecord = attendance.find(a => a.sessionId === s.id && a.memberId === currentUser?.id);
            const isGateOpen = (s.attendanceStatus === 'open' || (s as any).isAttendanceOpen) && s.status !== 'cancelled';
            const checkedInCount = attendance.filter(a => a.sessionId === s.id).length;
            const isCurrentlyVerifying = isVerifyingQR && verifyingSessionId === s.id;

            return (
              <div
                key={s.id}
                className={`rounded-2xl border bg-white p-6 shadow-xs space-y-4 transition ${
                  isPic
                    ? 'border-blue-300 ring-2 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Session Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {(s.category || 'WORKSHOP').toUpperCase()}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-slate-700">{s.date}</span>

                    {/* Person In Charge Badge */}
                    {isPic ? (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Người phụ trách (PIC): Bạn</span>
                      </span>
                    ) : s.personInChargeName ? (
                      <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-md">
                        Phụ trách: {s.personInChargeName}
                      </span>
                    ) : null}
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {s.status === 'cancelled' ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Đã hủy
                      </span>
                    ) : s.attendanceStatus === 'finalized' ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        🔒 Đã chốt sổ điểm danh
                      </span>
                    ) : isGateOpen ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        🔴 Cổng điểm danh ĐANG MỞ
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s.status === 'ended' ? 'Cổng điểm danh đã đóng' : 'Cổng điểm danh đang đóng'}
                      </span>
                    )}

                    {canManage && (
                      <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                        {checkedInCount} người đã điểm danh
                      </span>
                    )}

                    {!isPic && myRecord && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ✓ Đã điểm danh
                      </span>
                    )}
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                </div>

                {/* Hiển thị lý do hủy buổi nếu có */}
                {s.status === 'cancelled' && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>Buổi sinh hoạt này đã được Hủy</span>
                    </div>
                    <p className="pl-5 text-rose-800">
                      <strong>Lý do hủy:</strong> {s.cancellationReason || 'Chưa cung cấp lý do'}
                    </p>
                    <p className="pl-5 text-[11px] text-rose-600">
                      Thành viên không bị ghi nhận vắng mặt đối với buổi sinh hoạt đã hủy.
                    </p>
                  </div>
                )}

                {/* Session Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Thời gian phiên: <strong>{s.startTime} - {s.endTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{s.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="truncate">Đối tượng: <strong className="text-slate-800">{s.targetAudience || s.targetParticipants || 'Toàn thể thành viên chính thức'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      Điểm danh: <strong className="text-emerald-700">{s.attendanceOpenTime || (s as any).effectiveAttendanceOpenTime || 'Tự động'} - {s.attendanceCloseTime || (s as any).effectiveAttendanceCloseTime || 'Tự động'}</strong>
                    </span>
                  </div>
                </div>

                {/* Attendee Status View (if member already checked in) */}
                {!isPic && myRecord && (
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 flex items-center justify-between border border-slate-100">
                    <div>
                      Kết quả điểm danh: <strong className="text-emerald-700">{myRecord.status === 'present' ? 'Có mặt đúng giờ' : 'Đến muộn'}</strong>
                      <span className="text-slate-400 ml-2">({new Date(myRecord.checkInTime).toLocaleTimeString('vi-VN')})</span>
                    </div>
                    {myRecord.notes && (
                      <span className="text-[11px] text-slate-500 italic">{myRecord.notes}</span>
                    )}
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Trình chiếu QR lên màn hình lớn / máy chiếu (Dành cho PIC và Admin) */}
                    {canManage && s.status !== 'cancelled' ? (
                      <button
                        onClick={() => handleOpenProjector(s)}
                        disabled={isCurrentlyVerifying}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-sm disabled:opacity-50"
                        title="Mở và trình chiếu mã QR xoay vòng lên máy chiếu hoặc màn hình phòng họp"
                      >
                        {isCurrentlyVerifying ? (
                          <>
                            <RotateCw className="h-4 w-4 animate-spin" />
                            <span>Đang kiểm tra quyền...</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="h-4 w-4" />
                            <span>Mở QR điểm danh</span>
                          </>
                        )}
                      </button>
                    ) : null}

                    {/* Mở / Đóng cổng điểm danh cho PIC */}
                    {canManage && s.status !== 'cancelled' && s.attendanceStatus !== 'finalized' && (
                      <button
                        onClick={() => handleToggleGate(s)}
                        disabled={togglingSessionId === s.id}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                          isGateOpen
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {isGateOpen ? (
                          <>
                            <Square className="h-3.5 w-3.5 fill-current" />
                            <span>{togglingSessionId === s.id ? 'Đang cập nhật...' : 'Đóng cổng'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>{togglingSessionId === s.id ? 'Đang cập nhật...' : 'Mở cổng ngay'}</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Button Xem chi tiết / Quản lý meeting */}
                    <button
                      onClick={() => setSelectedMeetingDetail(s)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition shadow-xs"
                      title="Xem thông tin chi tiết và danh sách điểm danh buổi meeting"
                    >
                      <Info className="h-3.5 w-3.5 text-slate-500" />
                      <span>{canManage ? 'Quản lý điểm danh' : 'Chi tiết meeting'}</span>
                    </button>

                    {/* Button Gửi đơn xin vắng / khiếu nại */}
                    {!isPic && s.status !== 'cancelled' && (
                      <button
                        onClick={() => navigate(`/portal/attendance?action=absence&sessionId=${s.id}`)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition shadow-xs"
                        title="Gửi đơn xin phép vắng mặt hoặc đính chính điểm danh cho buổi này"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>Xin vắng / Khiếu nại</span>
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    {isPic ? (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Bạn phụ trách meeting này</span>
                      </span>
                    ) : (
                      <span>Người phụ trách: {s.personInChargeName || 'Ban Chủ nhiệm'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Meeting Details Modal (Requirement 4.B) */}
      {selectedMeetingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {selectedMeetingDetail.category || 'Meeting'}
                  </span>
                  {isUserPic(selectedMeetingDetail) && (
                    <span className="text-xs font-bold text-white bg-blue-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Bạn là Người phụ trách</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedMeetingDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMeetingDetail(null)}
                className="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Mô tả nội dung buổi sinh hoạt
                </div>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedMeetingDetail.description || 'Chưa có mô tả chi tiết.'}
                </p>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Thời gian diễn ra:</span>
                  <span className="font-semibold text-slate-800">{selectedMeetingDetail.startTime} - {selectedMeetingDetail.endTime} ngày {selectedMeetingDetail.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Địa điểm:</span>
                  <span className="font-semibold text-slate-800">{selectedMeetingDetail.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Đối tượng tham gia:</span>
                  <span className="font-semibold text-blue-700">{selectedMeetingDetail.targetAudience || selectedMeetingDetail.targetParticipants || 'Toàn thể thành viên chính thức'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Người phụ trách (PIC):</span>
                  <span className="font-semibold text-slate-800">{selectedMeetingDetail.personInChargeName || 'Ban Chủ nhiệm'}</span>
                </div>
              </div>

              {/* Attendance Status & Stats */}
              <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950">Trạng thái cổng điểm danh:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    selectedMeetingDetail.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedMeetingDetail.attendanceStatus === 'finalized'
                      ? 'bg-purple-100 text-purple-800'
                      : selectedMeetingDetail.attendanceStatus === 'open'
                      ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedMeetingDetail.status === 'cancelled'
                      ? 'Buổi họp đã hủy'
                      : selectedMeetingDetail.attendanceStatus === 'finalized'
                      ? 'Đã chốt sổ điểm danh'
                      : selectedMeetingDetail.attendanceStatus === 'open'
                      ? '🔴 Cổng đang mở'
                      : 'Cổng đang đóng'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Khung giờ điểm danh tự động:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedMeetingDetail.attendanceOpenTime || 'Tự động'} - {selectedMeetingDetail.attendanceCloseTime || 'Tự động'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Số thành viên đã điểm danh:</span>
                  <span className="font-bold text-blue-700 font-mono">
                    {attendance.filter(a => a.sessionId === selectedMeetingDetail.id).length} lượt
                  </span>
                </div>
              </div>

              {selectedMeetingDetail.status === 'cancelled' && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 space-y-1.5">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>Phiên sinh hoạt này đã được hủy</span>
                  </div>
                  <p className="text-rose-800 pl-5">
                    <strong>Lý do hủy:</strong> {selectedMeetingDetail.cancellationReason || 'Chưa cung cấp lý do'}
                  </p>
                  {selectedMeetingDetail.cancelledBy && (
                    <div className="text-[11px] text-rose-600 pl-5">
                      Người hủy: {selectedMeetingDetail.cancelledBy} {selectedMeetingDetail.cancelledAt ? `· Lúc ${new Date(selectedMeetingDetail.cancelledAt).toLocaleString('vi-VN')}` : ''}
                    </div>
                  )}
                  <p className="text-[11px] text-rose-600 pl-5">
                    Thành viên không bị ghi nhận vắng mặt đối với phiên đã hủy.
                  </p>
                </div>
              )}

              {/* PIC Exclusive Action Section inside Modal */}
              {(isUserPic(selectedMeetingDetail) || isAdminOrBn) && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Quyền tác nghiệp Người phụ trách (PIC)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Nút Mở QR điểm danh */}
                    {selectedMeetingDetail.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          const sess = selectedMeetingDetail;
                          setSelectedMeetingDetail(null);
                          handleOpenProjector(sess);
                        }}
                        disabled={isVerifyingQR}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        <Maximize2 className="h-4 w-4" />
                        <span>Trình chiếu QR Điểm danh</span>
                      </button>
                    )}

                    {/* Mở/Đóng cổng */}
                    {selectedMeetingDetail.status !== 'cancelled' && selectedMeetingDetail.attendanceStatus !== 'finalized' && (
                      <button
                        onClick={async () => {
                          await handleToggleGate(selectedMeetingDetail);
                          setSelectedMeetingDetail(prev => prev ? {
                            ...prev,
                            attendanceStatus: prev.attendanceStatus === 'open' ? 'closed' : 'open'
                          } : null);
                        }}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                          selectedMeetingDetail.attendanceStatus === 'open'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {selectedMeetingDetail.attendanceStatus === 'open' ? (
                          <>
                            <Square className="h-3.5 w-3.5 fill-current" />
                            <span>Đóng cổng điểm danh</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Mở cổng điểm danh ngay</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Chốt sổ */}
                    {selectedMeetingDetail.status !== 'cancelled' && selectedMeetingDetail.attendanceStatus !== 'finalized' && (
                      <button
                        onClick={async () => {
                          await handleFinalize(selectedMeetingDetail);
                          setSelectedMeetingDetail(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition shadow-xs"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Chốt sổ điểm danh</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!isUserPic(selectedMeetingDetail) && selectedMeetingDetail.status !== 'cancelled' && (
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">
                      Không thể tham dự hoặc cần khiếu nại điểm danh?
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Gửi đơn xin phép trước buổi họp hoặc trong vòng 48h để được BCN duyệt có phép.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const sId = selectedMeetingDetail.id;
                      setSelectedMeetingDetail(null);
                      navigate(`/portal/attendance?action=absence&sessionId=${sId}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs shrink-0"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Nộp đơn xin vắng</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedMeetingDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission / Rejection Alert Modal */}
      {permissionError && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-rose-200 p-6 space-y-4 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {permissionError.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {permissionError.message}
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Chỉ Người phụ trách được phân công hoặc Ban Quản trị mới được phép trình chiếu mã QR cho buổi sinh hoạt này.
              </p>
            </div>
            <button
              onClick={() => setPermissionError(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* Dynamic QR Projector Modal */}
      {projectingSession && (
        <DynamicQRProjector
          session={projectingSession}
          onClose={() => setProjectingSession(null)}
        />
      )}
    </div>
  );
};

export default PortalSessionsPage;
