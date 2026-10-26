// BK-IC Admin Attendance Data Matrix, Absence Requests Approval & Manual Override Modal
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus, AttendanceRequest } from '../../types';
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
  History,
  FileText,
  Check,
  XCircle,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  User,
  Calendar,
  Filter
} from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const { 
    attendance, 
    sessions, 
    committees, 
    overrideAttendance,
    attendanceRequests,
    decideAttendanceRequest
  } = useApp();

  const [activeTab, setActiveTab] = useState<'records' | 'requests'>('records');

  // Filters for Attendance Records
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Filters for Absence Requests
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('pending');
  const [requestTypeFilter, setRequestTypeFilter] = useState<string>('all');
  const [requestSearch, setRequestSearch] = useState('');

  // Manual Override Modal
  const [overrideTarget, setOverrideTarget] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('present');
  const [overrideReason, setOverrideReason] = useState('');

  // Request Decision Modal
  const [decideTarget, setDecideTarget] = useState<AttendanceRequest | null>(null);
  const [decideAction, setDecideAction] = useState<'approved' | 'rejected'>('approved');
  const [decideNotes, setDecideNotes] = useState('');
  const [decideStatus, setDecideStatus] = useState<AttendanceStatus>('excused');
  const [isSubmittingDecide, setIsSubmittingDecide] = useState(false);

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

  const requestList = Array.isArray(attendanceRequests) ? attendanceRequests : [];
  const pendingRequestsCount = requestList.filter(r => r.status === 'pending').length;

  const filteredRequests = requestList.filter((r) => {
    if (!r) return false;
    const matchStatus = requestStatusFilter === 'all' || r.status === requestStatusFilter;
    const matchType = requestTypeFilter === 'all' || r.type === requestTypeFilter;
    const matchSearch = (r.memberName || '').toLowerCase().includes(requestSearch.toLowerCase()) ||
                        (r.studentId || '').toLowerCase().includes(requestSearch.toLowerCase()) ||
                        (r.sessionTitle || '').toLowerCase().includes(requestSearch.toLowerCase()) ||
                        (r.reason || '').toLowerCase().includes(requestSearch.toLowerCase());
    return matchStatus && matchType && matchSearch;
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

  const handleOpenDecide = (request: AttendanceRequest, action: 'approved' | 'rejected') => {
    setDecideTarget(request);
    setDecideAction(action);
    setDecideNotes('');
    setDecideStatus(request.type === 'correction_request' ? 'present' : 'excused');
  };

  const handleConfirmDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decideTarget) return;

    if (decideAction === 'rejected' && !decideNotes.trim()) {
      alert('Vui lòng nhập lý do từ chối đơn để phản hồi cho thành viên.');
      return;
    }

    try {
      setIsSubmittingDecide(true);
      await decideAttendanceRequest(
        decideTarget.id,
        decideAction,
        decideNotes.trim() || undefined,
        decideAction === 'approved' ? decideStatus : undefined
      );
      setDecideTarget(null);
    } catch (err) {
      console.error('Error deciding request:', err);
    } finally {
      setIsSubmittingDecide(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Mã bản ghi', 'Buổi sinh hoạt', 'Họ tên', 'MSSV', 'Ban', 'Thời gian điểm danh', 'Trạng thái', 'Phương thức', 'Ghi chú'];
    const rows = filteredAttendance.map(a => [
      `"${a.id}"`,
      `"${a.sessionTitle}"`,
      `"${a.memberName}"`,
      `"${a.studentId}"`,
      `"${a.committee || a.unit || ''}"`,
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
            Tổng cộng {attendanceList.length} lượt điểm danh và {pendingRequestsCount} đơn xin vắng / khiếu nại đang chờ xét duyệt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'records' && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>Xuất Báo cáo CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('records')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'records'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <QrCode className="h-4 w-4" />
          <span>Bảng dữ liệu điểm danh ({attendanceList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition relative ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Duyệt Đơn xin vắng & Khiếu nại</span>
          {pendingRequestsCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
              {pendingRequestsCount} chờ duyệt
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ATTENDANCE RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4">
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
                        Không tìm thấy bản ghi điểm danh nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {rec.memberName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {rec.studentId}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                          {rec.sessionTitle}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {new Date(rec.checkInTime).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            rec.status === 'present'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : rec.status === 'late'
                              ? 'bg-amber-500/20 text-amber-400'
                              : rec.status === 'excused'
                              ? 'bg-blue-500/20 text-blue-400'
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
                        <td className="py-3.5 px-4 text-[11px] text-slate-400">
                          {rec.overrideHistory && rec.overrideHistory.length > 0 ? (
                            <span className="flex items-center gap-1 text-amber-400">
                              <History className="h-3 w-3" />
                              <span>Đã điều chỉnh ({rec.overrideHistory.length} lần)</span>
                            </span>
                          ) : (
                            <span className="text-slate-600">Gốc</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
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
        </div>
      )}

      {/* TAB 2: ABSENCE & CORRECTION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Requests Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="pending">Chờ phê duyệt ({pendingRequestsCount})</option>
                <option value="all">Tất cả trạng thái</option>
                <option value="approved">Đã chấp thuận</option>
                <option value="rejected">Đã từ chối</option>
              </select>

              <select
                value={requestTypeFilter}
                onChange={(e) => setRequestTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Tất cả loại đơn</option>
                <option value="absence_explanation">Đơn xin phép vắng mặt (48h)</option>
                <option value="correction_request">Khiếu nại sửa điểm danh (24h)</option>
              </select>
            </div>

            <div className="relative w-full md:w-auto md:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm theo tên, MSSV, nội dung lý do..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center space-y-2">
              <FileText className="h-10 w-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">Không có đơn xin vắng nào phù hợp</div>
              <p className="text-xs text-slate-500">
                {requestStatusFilter === 'pending'
                  ? 'Hiện tại không có đơn nào đang chờ duyệt. Mọi yêu cầu đã được xử lý xong!'
                  : 'Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 hover:border-slate-700 transition shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                        {req.memberName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{req.memberName}</span>
                          <span className="font-mono text-xs text-slate-400">({req.studentId})</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>Buổi họp: <strong className="text-slate-300">{req.sessionTitle}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Type Badge */}
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        req.type === 'absence_explanation'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {req.type === 'absence_explanation' ? 'Đơn xin vắng (48h)' : 'Khiếu nại điểm danh (24h)'}
                      </span>

                      {/* 48h Deadline Badge */}
                      {req.isLateSubmission ? (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Nộp quá hạn 48h</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>Đúng hạn</span>
                        </span>
                      )}

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      }`}>
                        {req.status === 'approved'
                          ? '✓ Đã chấp thuận'
                          : req.status === 'rejected'
                          ? '✕ Đã từ chối'
                          : '⏳ Đang chờ duyệt'}
                      </span>
                    </div>
                  </div>

                  {/* Reason Box */}
                  <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                      <span>Lý do trình bày:</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-200 pl-5 border-l-2 border-blue-500/40">
                      {req.reason}
                    </p>

                    {req.evidenceUrl && (
                      <div className="pt-2 pl-5">
                        <a
                          href={req.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline font-medium text-[11px]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Xem tệp minh chứng đính kèm (Link ngoài)</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Submission and Decision Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
                    <div>
                      Thời điểm nộp: <span className="font-mono text-slate-300">{new Date(req.submittedAt).toLocaleString('vi-VN')}</span>
                      {req.decidedAt && (
                        <span className="ml-3">
                          • Xử lý bởi: <strong className="text-white">{req.decidedBy}</strong> ({new Date(req.decidedAt).toLocaleString('vi-VN')})
                        </span>
                      )}
                      {req.decisionNotes && (
                        <div className="mt-1 text-slate-300 italic">
                          ↳ Lời nhắn: "{req.decisionNotes}"
                        </div>
                      )}
                    </div>

                    {/* Action buttons if Pending */}
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDecide(req, 'approved')}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Chấp thuận</span>
                        </button>

                        <button
                          onClick={() => handleOpenDecide(req, 'rejected')}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition shadow-xs"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Override Dialog */}
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
              <div>Buổi sinh hoạt: <strong className="text-white">{overrideTarget.sessionTitle}</strong></div>
              <div>Thời gian ghi nhận: <span className="font-mono text-slate-400">{new Date(overrideTarget.checkInTime).toLocaleString('vi-VN')}</span></div>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trạng thái mới áp dụng *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="present">Có mặt đúng giờ (Present)</option>
                  <option value="late">Đến muộn (Late)</option>
                  <option value="excused">Vắng có phép (Excused Absence)</option>
                  <option value="unexcused">Vắng không phép (Unexcused Absence)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lý do điều chỉnh (Lưu vết kiểm toán bắt buộc) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="VD: Cập nhật theo đơn xin vắng có phép đã được Ban Chủ nhiệm xác nhận..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Lưu điều chỉnh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decision Modal for Absence & Correction Requests */}
      {decideTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {decideAction === 'approved' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <span>
                  {decideAction === 'approved' ? 'Phê duyệt Đơn xin vắng' : 'Từ chối Đơn xin vắng'}
                </span>
              </h3>
              <button
                onClick={() => setDecideTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-3 text-xs space-y-1">
              <div>Thành viên: <strong className="text-white">{decideTarget.memberName}</strong> ({decideTarget.studentId})</div>
              <div>Buổi sinh hoạt: <strong className="text-white">{decideTarget.sessionTitle}</strong></div>
              <div>Lý do xin vắng: <span className="text-slate-300 italic">"{decideTarget.reason}"</span></div>
              {decideTarget.isLateSubmission && (
                <div className="text-amber-400 font-semibold pt-1">
                  ⚠️ Lưu ý: Đơn này nộp sau 48h. Quyết định duyệt sẽ được ghi nhận là phê duyệt ngoại lệ của BCN.
                </div>
              )}
            </div>

            <form onSubmit={handleConfirmDecision} className="space-y-4">
              {decideAction === 'approved' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Trạng thái điểm danh áp dụng sau khi duyệt *
                  </label>
                  <select
                    value={decideStatus}
                    onChange={(e) => setDecideStatus(e.target.value as AttendanceStatus)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="excused">Vắng có phép (Excused) - Tiêu chuẩn cho đơn xin vắng</option>
                    <option value="present">Có mặt đúng giờ (Present) - Cho khiếu nại sửa điểm danh</option>
                    <option value="late">Đến muộn (Late)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {decideAction === 'approved'
                    ? 'Ghi chú / Lời nhắn phản hồi (Tùy chọn)'
                    : 'Lý do từ chối đơn (Bắt buộc) *'}
                </label>
                <textarea
                  required={decideAction === 'rejected'}
                  rows={3}
                  placeholder={
                    decideAction === 'approved'
                      ? 'VD: Đồng ý lý do học bù theo lịch phòng đào tạo...'
                      : 'VD: Không cung cấp minh chứng hợp lệ, hoặc nộp quá hạn quy định...'
                  }
                  value={decideNotes}
                  onChange={(e) => setDecideNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDecideTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDecide}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition disabled:opacity-50 ${
                    decideAction === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  {decideAction === 'approved' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{isSubmittingDecide ? 'Đang duyệt...' : 'Xác nhận Chấp thuận'}</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3.5 w-3.5" />
                      <span>{isSubmittingDecide ? 'Đang từ chối...' : 'Xác nhận Từ chối'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
