// BK-IC Member Portal Dashboard Overview
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { QRScannerModal } from '../../components/qr/QRScannerModal';
import { DynamicQRProjector } from '../../components/qr/DynamicQRProjector';
import { Session } from '../../types';
import { formatAcademicYearDisplay } from '../../utils/academicYear';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Bell, 
  MapPin,
  TrendingUp,
  AlertCircle,
  Maximize2
} from 'lucide-react';

export const PortalDashboardPage: React.FC = () => {
  const { currentUser, sessions, attendance, evaluations } = useApp();
  const [showQR, setShowQR] = useState(false);
  const [projectingSession, setProjectingSession] = useState<Session | null>(null);

  if (!currentUser) return null;

  // Member stats
  const memberAttendance = attendance.filter(a => a.memberId === currentUser.id);
  const totalSessionsCompleted = sessions.filter(s => s.status === 'closed').length;
  const attendedCount = memberAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalSessionsCompleted > 0 
    ? Math.round((attendedCount / totalSessionsCompleted) * 100) 
    : null;

  // Member's evaluation score
  const myEval = evaluations.find(e => e.memberId === currentUser.id && e.status === 'approved');

  // Next upcoming or currently open session
  const activeSession = sessions.find(s => s.status === 'open') || 
                        sessions.find(s => s.status === 'scheduled');

  const isCheckedInActive = activeSession 
    ? memberAttendance.some(a => a.sessionId === activeSession.id) 
    : false;

  // Helper to identify PIC
  const isUserPic = (s: Session) => {
    if (!currentUser) return false;
    return (
      s.personInChargeId === currentUser.id ||
      (s as any).organizerId === currentUser.id ||
      (s as any).responsibleUserId === currentUser.id ||
      (s as any).hostId === currentUser.id
    );
  };

  // Sessions assigned to currentUser as Person In Charge
  const myPicSession = sessions.find(s => isUserPic(s) && s.status !== 'cancelled' && s.status !== 'ended');

  return (
    <div className="space-y-8">
      {/* Personalized Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cổng Thông tin Thành viên BK-IC
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
            Xin chào, {currentUser.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.faculty} · {formatAcademicYearDisplay(currentUser.academicYear, currentUser.classId, currentUser.role)} · {currentUser.position}
          </p>
        </div>

        <button
          onClick={() => setShowQR(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <QrCode className="h-4 w-4" />
          <span>Điểm danh Buổi sinh hoạt</span>
        </button>
      </div>

      {/* PIC Assigned Meeting Alert & Quick Launch */}
      {myPicSession && (
        <div className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Nhiệm vụ: Bạn là Người phụ trách buổi họp này</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {myPicSession.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100 pt-1">
                <span>📅 {myPicSession.date}</span>
                <span>⏰ {myPicSession.startTime} - {myPicSession.endTime}</span>
                <span>📍 {myPicSession.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setProjectingSession(myPicSession)}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-2.5 text-xs font-bold shadow-md hover:bg-blue-50 transition"
              >
                <Maximize2 className="h-4 w-4" />
                <span>Trình chiếu QR Lên Màn Hình</span>
              </button>
              <Link
                to="/portal/sessions"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-800/60 border border-white/20 text-white px-4 py-2.5 text-xs font-semibold hover:bg-blue-800 transition"
              >
                <span>Quản lý trong Lịch họp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Tỷ lệ Chuyên cần</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {attendanceRate !== null ? `${attendanceRate}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalSessionsCompleted > 0 
              ? `Đã tham gia ${attendedCount}/${totalSessionsCompleted} phiên sinh hoạt`
              : 'Chưa có phiên sinh hoạt nào hoàn tất'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Điểm Đánh giá Rèn luyện</span>
            <Award className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-blue-600 tabular-nums">
            {myEval ? `${myEval.totalScore}/10` : 'Chờ tổng kết'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {myEval ? `${myEval.month} · Đã duyệt` : 'Đang tính toán theo chuyên cần & cống hiến'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Ban Sinh hoạt</span>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">
            {currentUser.committee ? currentUser.committee.replace('ban-', 'Ban ').toUpperCase() : 'Chưa phân ban'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Trạng thái thành viên: <span className="text-emerald-600 font-semibold">Chính thức (Active)</span>
          </p>
        </div>
      </div>

      {/* Next Upcoming Session Spotlight */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100/70 px-3 py-1 rounded-full">
            {activeSession?.status === 'open' ? '🔴 Đang diễn ra điểm danh' : 'Phiên sinh hoạt tiếp theo'}
          </span>
          <span className="text-xs text-slate-500">
            {activeSession ? activeSession.date : 'Chưa có lịch mới'}
          </span>
        </div>

        {activeSession ? (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
              {activeSession.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {activeSession.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{activeSession.startTime} - {activeSession.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="truncate">{activeSession.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Ngưỡng tính muộn: <strong className="text-amber-700">{activeSession.lateThresholdTime}</strong></span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200/80">
              {isCheckedInActive ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Bạn đã ghi nhận có mặt tại buổi này!</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowQR(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Quét mã QR tại phòng để điểm danh</span>
                </button>
              )}

              <Link
                to="/portal/sessions"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Xem chi tiết lịch sinh hoạt
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            Hiện chưa có phiên sinh hoạt nào được lên lịch tiếp theo.
          </div>
        )}
      </div>

      {/* Quick shortcuts and Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Lịch sử điểm danh gần đây
            </h3>
            <Link to="/portal/attendance" className="text-xs text-blue-600 font-semibold hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-2.5">
            {memberAttendance.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Chưa có bản ghi điểm danh nào.
              </div>
            ) : (
              memberAttendance.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold text-slate-800 truncate">{rec.sessionTitle}</div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(rec.checkInTime).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                    rec.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rec.status === 'late'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {rec.status === 'present' ? 'Có mặt đúng giờ' : rec.status === 'late' ? 'Đến muộn' : rec.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Club Notice */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Bell className="h-4 w-4 text-blue-600" />
            <span>Thông báo từ Ban Chủ nhiệm</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="font-semibold text-slate-800">
              Quy chế Đánh giá Điểm rèn luyện Học kỳ 2
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Điểm tổng kết bao gồm: <strong>Chuyên cần (4đ)</strong> + <strong>Đóng góp chuyên môn dự án (4đ)</strong> + <strong>Tinh thần trách nhiệm (2đ)</strong>. Thành viên có quyền gửi đơn giải trình vắng mặt có lý do hợp lệ trước 12h ngày diễn ra sinh hoạt.
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <Link to="/portal/evaluations" className="text-blue-600 font-semibold hover:underline">
              Xem bảng điểm cá nhân
            </Link>
            <Link to="/portal/feedback" className="text-slate-500 hover:text-slate-800">
              Gửi ý kiến đóng góp
            </Link>
          </div>
        </div>
      </div>

      {showQR && <QRScannerModal onClose={() => setShowQR(false)} />}
      {projectingSession && (
        <DynamicQRProjector
          session={projectingSession}
          onClose={() => setProjectingSession(null)}
        />
      )}
    </div>
  );
};
