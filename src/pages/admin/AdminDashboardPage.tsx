// BK-IC Admin Dashboard Analytics & Overview
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Award, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { 
    users, 
    sessions, 
    attendance, 
    evaluations, 
    applications, 
    auditLogs,
    committees,
    siteSettings 
  } = useApp();

  const userList = Array.isArray(users) ? users : [];
  const sessionList = Array.isArray(sessions) ? sessions : [];
  const attendanceList = Array.isArray(attendance) ? attendance : [];
  const evaluationList = Array.isArray(evaluations) ? evaluations : [];
  const applicationList = Array.isArray(applications) ? applications : [];
  const auditLogList = Array.isArray(auditLogs) ? auditLogs : [];
  const committeeList = Array.isArray(committees) ? committees : [];

  // Metrics calculations from real stored state
  const activeMembers = userList.filter(u => u && u.status === 'active' && u.role !== 'guest' && u.role !== 'applicant');
  const upcomingSessions = sessionList.filter(s => s && (s.status === 'scheduled' || s.status === 'open'));
  const completedSessions = sessionList.filter(s => s && s.status === 'closed');
  
  // Average attendance rate
  const totalCompletedCount = completedSessions.length;
  const presentRecords = attendanceList.filter(a => a && (a.status === 'present' || a.status === 'late')).length;
  const avgAttendanceRate = totalCompletedCount > 0 && activeMembers.length > 0
    ? Math.round((presentRecords / (totalCompletedCount * activeMembers.length)) * 100)
    : 0;

  const pendingEvaluations = evaluationList.filter(e => e && (e.status === 'submitted' || e.status === 'draft')).length;
  const pendingApplications = applicationList.filter(a => a && (a.status === 'pending' || a.status === 'under_review')).length;

  return (
    <div className="space-y-8">
      {/* Top Banner with Demo Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Bảng Điều khiển Quản trị Trung tâm
            </h1>
            {siteSettings.isDemoMode && (
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                DỮ LIỆU THỰC NGHIỆM (DEMO MODE)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tổng quan thời gian thực về nhân sự, chuyên cần và tiến độ ươm mầm dự án tại DUT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/sessions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow-xs"
          >
            <Calendar className="h-4 w-4" />
            <span>Mở Phiên & Chiếu QR</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Section 12.1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Thành viên chính thức</div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {activeMembers.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Đang hoạt động</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Phiên sắp diễn ra</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1 tabular-nums">
            {upcomingSessions.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Trong tháng này</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Phiên đã hoàn tất</div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {completedSessions.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Đã chốt sổ điểm danh</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Tỷ lệ chuyên cần TB</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            {avgAttendanceRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Chỉ số câu lạc bộ</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Đánh giá chờ duyệt</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1 tabular-nums">
            {pendingEvaluations}
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1">Cần BCN phê duyệt</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Đơn ứng tuyển mới</div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1 tabular-nums">
            {pendingApplications}
          </div>
          <div className="text-[10px] text-purple-300/80 mt-1">Chờ chấm phỏng vấn</div>
        </div>
      </div>

      {/* Analytical Charts and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Committee Distribution */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Phân bổ Nhân sự theo các Ban Chuyên trách</span>
            </h3>
            <Link to="/admin/members" className="text-xs text-blue-400 hover:underline">
              Quản lý chi tiết
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {committeeList.map((com) => {
              const count = userList.filter(u => u && (u.committee === com.id || u.unit === com.id)).length;
              const percentage = activeMembers.length > 0 ? Math.round((count / activeMembers.length) * 100) : 0;

              return (
                <div key={com.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{com.name}</span>
                    <span className="font-mono text-slate-400 tabular-nums">{count} thành viên ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Breakdown Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Phân loại Trạng thái Điểm danh</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Có mặt đúng giờ</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">
                {attendanceList.filter(a => a && a.status === 'present').length} lượt
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-300">Đến muộn sau ngưỡng</span>
              </div>
              <span className="font-mono font-bold text-amber-400 tabular-nums">
                {attendanceList.filter(a => a && a.status === 'late').length} lượt
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Vắng có phép được duyệt</span>
              </div>
              <span className="font-mono font-bold text-blue-400 tabular-nums">
                {attendanceList.filter(a => a && a.status === 'excused').length} lượt
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                <span className="text-slate-300">Đơn xin phép chờ duyệt</span>
              </div>
              <span className="font-mono font-bold text-purple-400 tabular-nums">
                {attendanceList.filter(a => a && a.status === 'pending_review').length} đơn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Stream (Section 13 Security & Audit Trail) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Nhật ký Kiểm toán Hệ thống (Audit Trail)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Ghi lại mọi thao tác điểm danh, điều chỉnh thủ công, duyệt đánh giá và kết nạp thành viên.
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogList.slice(0, 8).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{log.action}</span>
                  <span className="text-slate-400 text-[10px]">· bởi {log.actorName} ({log.actorRole})</span>
                </div>
                <div className="text-slate-400 text-[11px]">{log.details}</div>
              </div>
              <div className="shrink-0 font-mono text-[10px] text-slate-500">
                {new Date(log.timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
