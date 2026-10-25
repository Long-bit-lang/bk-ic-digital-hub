// BK-IC Admin Attendance Data Matrix & Manual Override Modal
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { 
  QrCode, 
  Search, 
  Download, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  History 
} from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const { attendance, sessions, committees, overrideAttendance } = useApp();

  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Manual Override Modal
  const [overrideTarget, setOverrideTarget] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('present');
  const [overrideReason, setOverrideReason] = useState('');

  const attendanceList = Array.isArray(attendance) ? attendance : [];
  const filteredAttendance = attendanceList.filter((a) => {
    if (!a) return false;
    const matchSession = sessionFilter === 'all' || a.sessionId === sessionFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSearch = (a.memberName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.studentId || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.sessionTitle || '').toLowerCase().includes(search.toLowerCase());
    return matchSession && matchStatus && matchSearch;
  });

  const handleOpenOverride = (rec: AttendanceRecord) => {
    setOverrideTarget(rec);
    setNewStatus(rec.status);
    setOverrideReason('');
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideTarget || !overrideReason.trim()) {
      alert('Vui lòng nhập lý do điều chỉnh kết quả điểm danh.');
      return;
    }

    overrideAttendance(overrideTarget.id, newStatus, overrideReason.trim());
    setOverrideTarget(null);
  };

  const handleExportCSV = () => {
    const headers = ['Mã bản ghi', 'Buổi sinh hoạt', 'Họ tên', 'MSSV', 'Ban', 'Thời gian điểm danh', 'Trạng thái', 'Phương thức', 'Ghi chú'];
    const rows = filteredAttendance.map(a => [
      `"${a.id}"`,
      `"${a.sessionTitle}"`,
      `"${a.memberName}"`,
      `"${a.studentId}"`,
      `"${a.committee}"`,
      `"${new Date(a.checkInTime).toLocaleString('vi-VN')}"`,
      `"${a.status}"`,
      `"${a.method}"`,
      `"${a.notes || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `du_lieu_diem_danh_bkic_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản trị & Đối soát Dữ liệu Điểm danh
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng {attendance.length} lượt điểm danh lưu trong hệ thống. Hỗ trợ điều chỉnh thủ công có lưu vết (Audit Trail).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
        >
          <Download className="h-4 w-4" />
          <span>Xuất Báo cáo CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none max-w-xs truncate"
          >
            <option value="all">Tất cả các phiên sinh hoạt</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.date})</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="present">Có mặt đúng giờ</option>
            <option value="late">Đến muộn</option>
            <option value="excused">Vắng có phép</option>
            <option value="pending_review">Chờ duyệt đơn vắng</option>
            <option value="unexcused">Vắng không phép</option>
          </select>
        </div>

        <div className="relative w-full md:w-auto md:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên thành viên, MSSV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Thành viên</th>
                <th className="py-3.5 px-4">MSSV</th>
                <th className="py-3.5 px-4">Buổi sinh hoạt</th>
                <th className="py-3.5 px-4">Thời gian quét</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Lịch sử điều chỉnh</th>
                <th className="py-3.5 px-4 text-right">Điều chỉnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Không tìm thấy bản ghi điểm danh nào.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      {rec.memberName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {rec.studentId}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {rec.sessionTitle}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(rec.checkInTime).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        rec.status === 'present'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : rec.status === 'late'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : rec.status === 'excused'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : rec.status === 'pending_review'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 animate-pulse'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {rec.status === 'present'
                          ? 'Có mặt đúng giờ'
                          : rec.status === 'late'
                          ? 'Đến muộn'
                          : rec.status === 'excused'
                          ? 'Vắng có phép'
                          : rec.status === 'pending_review'
                          ? 'Chờ duyệt đơn'
                          : 'Vắng không phép'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {rec.overrideHistory && rec.overrideHistory.length > 0 ? (
                        <span className="flex items-center gap-1 text-amber-400">
                          <History className="h-3 w-3" />
                          <span>Đã điều chỉnh ({rec.overrideHistory.length} lần)</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">Gốc</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenOverride(rec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Dialog (Section 9.4) */}
      {overrideTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Điều chỉnh Kết quả Điểm danh Thủ công</span>
              </h3>
              <button
                onClick={() => setOverrideTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-3 text-xs space-y-1">
              <div>Thành viên: <strong className="text-white">{overrideTarget.memberName}</strong> ({overrideTarget.studentId})</div>
              <div>Buổi: <span className="text-slate-300">{overrideTarget.sessionTitle}</span></div>
              <div>Trạng thái hiện tại: <strong className="text-amber-400">{overrideTarget.status}</strong></div>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Trạng thái mới *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="present">Có mặt đúng giờ (Present)</option>
                  <option value="late">Đến muộn sau ngưỡng (Late)</option>
                  <option value="excused">Vắng có phép (Excused Absence)</option>
                  <option value="unexcused">Vắng không phép (Unexcused)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Lý do điều chỉnh (Bắt buộc theo chuẩn Audit) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ví dụ: Đã duyệt đơn xin phép vắng do lịch học trùng xưởng cơ khí; hoặc đã ký danh sách điểm danh giấy tại chỗ..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOverrideTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-xs"
                >
                  Lưu & Ghi nhận Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
