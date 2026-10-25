// BK-IC Admin Applications Pipeline & Member Onboarding
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus, CommitteeId, UnitId } from '../../types';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  UserPlus, 
  Download, 
  X, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const { applications, updateApplicationStatus, convertApplicationToMember, committees } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Review & Convert Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [assignedCommittee, setAssignedCommittee] = useState<UnitId>('BDH');
  const [convertSuccess, setConvertSuccess] = useState(false);

  const appList = Array.isArray(applications) ? applications : [];
  const filteredApps = appList.filter((a) => {
    if (!a) return false;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchTrack = trackFilter === 'all' || a.interestTrack === trackFilter;
    const matchSearch = (a.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.studentId || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.email || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTrack && matchSearch;
  });

  const handleOpenReview = (app: Application) => {
    setSelectedApp(app);
    setReviewNotes(app.reviewNotes || '');
    setConvertSuccess(false);

    // Auto guess unit based on track
    if (app.interestTrack.includes('Tech') || app.interestTrack.includes('Chuyên môn')) setAssignedCommittee('BDH');
    else if (app.interestTrack.includes('Media') || app.interestTrack.includes('Truyền thông')) setAssignedCommittee('BDH');
    else if (app.interestTrack.includes('Nhân sự') || app.interestTrack.includes('HR')) setAssignedCommittee('BTV');
    else setAssignedCommittee('BDH');
  };

  const handleUpdateStatus = (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, newStatus, reviewNotes);
    setSelectedApp(null);
  };

  const handleConvertMember = async () => {
    if (!selectedApp) return;
    const newMember = await convertApplicationToMember(selectedApp.id, assignedCommittee);
    if (newMember) {
      setConvertSuccess(true);
      setTimeout(() => {
        setSelectedApp(null);
      }, 1500);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Mã đơn', 'Họ tên', 'MSSV', 'Email', 'SĐT', 'Khoa', 'Lớp', 'Mảng ứng tuyển', 'Trạng thái', 'Ngày nộp'];
    const rows = filteredApps.map(a => [
      `"${a.id}"`,
      `"${a.fullName}"`,
      `"${a.studentId}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.faculty}"`,
      `"${a.classId}"`,
      `"${a.interestTrack}"`,
      `"${a.status}"`,
      `"${new Date(a.submittedAt).toLocaleDateString('vi-VN')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `don_ung_tuyen_bkic_${new Date().toISOString().split('T')[0]}.csv`);
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
            Quản trị Tuyển dụng & Kết nạp Thành viên (Gen 2026)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quy trình sàng lọc hồ sơ, xếp lịch phỏng vấn và chuyển đổi trực tiếp thành viên trúng tuyển vào các ban.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
        >
          <Download className="h-4 w-4" />
          <span>Xuất Danh sách Ứng viên</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái hồ sơ</option>
            <option value="pending">Chờ xét duyệt (Pending)</option>
            <option value="under_review">Đang phỏng vấn (Under Review)</option>
            <option value="approved">Đã trúng tuyển (Approved)</option>
            <option value="rejected">Chưa phù hợp (Rejected)</option>
          </select>

          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả mảng ứng tuyển</option>
            <option value="Tech & Innovation">Tech & DeepTech</option>
            <option value="Startup & Business Model">Mô hình Kinh doanh</option>
            <option value="Media & Community">Truyền thông & Thương hiệu</option>
            <option value="External Relations">Đối ngoại Doanh nghiệp</option>
          </select>
        </div>

        <div className="relative w-full md:w-auto md:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên ứng viên, MSSV, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Ứng viên & MSSV</th>
                <th className="py-3.5 px-4">Khoa & Khóa</th>
                <th className="py-3.5 px-4">Mảng ứng tuyển</th>
                <th className="py-3.5 px-4">Ngày nộp</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Xem & Phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Không tìm thấy hồ sơ ứng tuyển nào.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{app.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{app.studentId} · {app.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{app.faculty}</div>
                      <div className="text-[11px] text-slate-400">{app.classId} ({app.academicYear})</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-400">
                      {app.interestTrack}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(app.submittedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'under_review'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : app.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {app.status === 'approved'
                          ? '✓ Đã kết nạp'
                          : app.status === 'under_review'
                          ? 'Đang phỏng vấn'
                          : app.status === 'rejected'
                          ? 'Từ chối'
                          : 'Chờ xét'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white transition font-medium"
                      >
                        <span>Chi tiết</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Onboard Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-[11px] font-mono text-slate-400">HỒ SƠ {selectedApp.id}</div>
                <h3 className="text-lg font-bold text-white">{selectedApp.fullName}</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {convertSuccess ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Đã kết nạp thành công!</h4>
                <p className="text-xs text-slate-400">
                  Ứng viên đã được chuyển đổi thành Thành viên chính thức trong danh bạ CLB.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">MSSV:</span>
                    <span className="font-mono text-white font-semibold">{selectedApp.studentId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="text-white">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Điện thoại / Zalo:</span>
                    <span className="text-white">{selectedApp.phone || 'Chưa cung cấp'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Khoa & Lớp:</span>
                    <span className="text-white">{selectedApp.faculty} ({selectedApp.classId})</span>
                  </div>
                </div>

                {/* Motivation & Skills */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <strong className="text-blue-400 block mb-1">Động lực ứng tuyển:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedApp.motivation}</p>
                  </div>

                  {selectedApp.skills && (
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      <strong className="text-slate-300 block mb-1">Kỹ năng / Kinh nghiệm:</strong>
                      <p className="text-slate-400 leading-relaxed">{selectedApp.skills}</p>
                    </div>
                  )}

                  {selectedApp.portfolioUrl && (
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between">
                      <span className="text-slate-400">Link CV / Portfolio:</span>
                      <a
                        href={selectedApp.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>{selectedApp.portfolioUrl}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Review Notes Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ghi chú của Hội đồng Phỏng vấn
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ghi lại ấn tượng phỏng vấn, định hướng phân công..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* One-Click Member Conversion Box (Section 6) */}
                <div className="rounded-2xl bg-blue-950/40 border border-blue-500/30 p-4 space-y-3">
                  <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>Duyệt & Kết nạp trực tiếp vào Ban Chuyên trách</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select
                      value={assignedCommittee}
                      onChange={(e) => setAssignedCommittee(e.target.value as UnitId)}
                      className="rounded-xl border border-blue-500/40 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none flex-1"
                    >
                      {committees.map(c => (
                        <option key={c.id} value={c.id}>Phân công vào: {c.name}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleConvertMember}
                      className="px-5 py-2 rounded-xl bg-[#245BFA] text-white text-xs font-bold hover:bg-blue-600 transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Kết nạp Thành viên</span>
                    </button>
                  </div>
                </div>

                {/* Status Quick Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus('under_review')}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                    >
                      Chuyển sang "Đang phỏng vấn"
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('rejected')}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Từ chối
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
