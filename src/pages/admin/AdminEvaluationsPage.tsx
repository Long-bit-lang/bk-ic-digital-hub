// BK-IC Admin Member Evaluations & Scoring Management
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvaluationRecord, EvaluationStatus, CommitteeId } from '../../types';
import { 
  Award, 
  Search, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Edit3, 
  X, 
  Save, 
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const AdminEvaluationsPage: React.FC = () => {
  const { evaluations, users, committees, saveEvaluation, updateEvaluation, approveEvaluation, currentUser } = useApp();

  const [semesterFilter, setSemesterFilter] = useState('2025-2026-HK2');
  const [committeeFilter, setCommitteeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingEvalId, setEditingEvalId] = useState<string | null>(null);

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [attendanceScore, setAttendanceScore] = useState(4.0);
  const [contributionScore, setContributionScore] = useState(3.5);
  const [responsibilityScore, setResponsibilityScore] = useState(2.0);
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState<EvaluationStatus>('submitted');

  const activeMembers = users.filter(u => u.role !== 'guest' && u.role !== 'applicant');

  const filteredEvaluations = evaluations.filter((ev) => {
    const matchSemester = semesterFilter === 'all' || ev.semester === semesterFilter;
    const matchCommittee = committeeFilter === 'all' || ev.committee === committeeFilter;
    const matchSearch = ev.memberName.toLowerCase().includes(search.toLowerCase()) ||
                        ev.studentId.toLowerCase().includes(search.toLowerCase());
    return matchSemester && matchCommittee && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingEvalId(null);
    setSelectedMemberId(activeMembers.length > 0 ? activeMembers[0].id : '');
    setAttendanceScore(4.0);
    setContributionScore(3.5);
    setResponsibilityScore(2.0);
    setComments('');
    setStatus('submitted');
    setShowModal(true);
  };

  const handleOpenEdit = (ev: EvaluationRecord) => {
    setEditingEvalId(ev.id);
    setSelectedMemberId(ev.memberId);
    setAttendanceScore(ev.attendanceScore ?? 4.0);
    setContributionScore(ev.contributionScore ?? 3.5);
    setResponsibilityScore(ev.responsibilityScore ?? 2.0);
    setComments(ev.comments ?? '');
    setStatus((ev.status as EvaluationStatus) || 'submitted');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const member = users.find(u => u.id === selectedMemberId);
    if (!member) return;

    if (editingEvalId) {
      updateEvaluation(editingEvalId, {
        attendanceScore,
        contributionScore,
        responsibilityScore,
        comments,
        status
      });
    } else {
      saveEvaluation({
        memberId: member.id,
        memberName: member.fullName,
        studentId: member.studentId,
        committee: member.committee || 'ban-chuyen-mon',
        semester: semesterFilter === 'all' ? '2025-2026-HK2' : semesterFilter,
        attendanceScore,
        contributionScore,
        responsibilityScore,
        totalScore: Math.min(10, Math.round((attendanceScore + contributionScore + responsibilityScore) * 10) / 10),
        comments,
        evaluatorId: currentUser?.id || 'admin',
        evaluatorName: currentUser?.fullName || 'Hội đồng Cố vấn',
        status
      });
    }

    setShowModal(false);
  };

  const dynamicTotal = Math.min(10, Math.round((Number(attendanceScore) + Number(contributionScore) + Number(responsibilityScore)) * 10) / 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản trị Đánh giá & Xếp loại Rèn luyện Thành viên
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quy chế chấm điểm 3 tiêu chí: Chuyên cần (4đ) + Cống hiến (4đ) + Trách nhiệm (2đ).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Phiếu Đánh giá mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="2025-2026-HK2">Học kỳ 2 (2025-2026)</option>
            <option value="2026-2027-HK1">Học kỳ 1 (2026-2027)</option>
            <option value="all">Tất cả học kỳ</option>
          </select>

          <select
            value={committeeFilter}
            onChange={(e) => setCommitteeFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả các ban</option>
            {committees.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[260px]">
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

      {/* Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Thành viên & MSSV</th>
                <th className="py-3.5 px-4">Ban</th>
                <th className="py-3.5 px-4">Chuyên cần (4đ)</th>
                <th className="py-3.5 px-4">Cống hiến (4đ)</th>
                <th className="py-3.5 px-4">Trách nhiệm (2đ)</th>
                <th className="py-3.5 px-4">Tổng điểm</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Chưa có phiếu đánh giá nào trong học kỳ này.
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{ev.memberName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{ev.studentId}</div>
                    </td>
                    <td className="py-3 px-4 text-blue-400 font-medium">
                      {ev.committee ? ev.committee.replace('ban-', 'Ban ').toUpperCase() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                      {ev.attendanceScore}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                      {ev.contributionScore}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                      {ev.responsibilityScore}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold font-mono text-blue-400 tabular-nums">
                        {ev.totalScore}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        ev.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ev.status === 'under_appeal'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : ev.status === 'insufficient_data'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ev.status === 'approved' ? '✓ Đã duyệt chính thức' : ev.status === 'under_appeal' ? 'Đang khiếu nại' : ev.status === 'insufficient_data' ? 'Chưa đủ dữ liệu' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {ev.status !== 'approved' && (
                        <button
                          onClick={() => approveEvaluation(ev.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition text-[11px] font-semibold"
                        >
                          Duyệt
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" />
                <span>{editingEvalId ? 'Chỉnh sửa Phiếu Đánh giá' : 'Tạo Phiếu Đánh giá Thành viên'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Chọn Thành viên cần đánh giá *
                </label>
                <select
                  disabled={!!editingEvalId}
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {activeMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.studentId}) - {m.committee}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Score Controls */}
              <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700/60 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">1. Điểm Chuyên cần (Tối đa 4.0đ)</span>
                    <span className="font-mono font-bold text-blue-400">{attendanceScore} / 4.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.1"
                    value={attendanceScore}
                    onChange={(e) => setAttendanceScore(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">2. Điểm Cống hiến Dự án (Tối đa 4.0đ)</span>
                    <span className="font-mono font-bold text-blue-400">{contributionScore} / 4.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.1"
                    value={contributionScore}
                    onChange={(e) => setContributionScore(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">3. Điểm Trách nhiệm & Kỷ luật (Tối đa 2.0đ)</span>
                    <span className="font-mono font-bold text-blue-400">{responsibilityScore} / 2.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={responsibilityScore}
                    onChange={(e) => setResponsibilityScore(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Tổng điểm kết luận:</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    {dynamicTotal} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nhận xét & Ghi chú của Cố vấn / Trưởng ban
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi nhận nỗ lực kỹ thuật, tính chủ động hoặc những điểm cần khắc phục..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-xs"
                >
                  Lưu phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
