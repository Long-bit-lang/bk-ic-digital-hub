// BK-IC Admin Sessions Management & Dynamic QR Projector Launcher
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Session, SessionCategory, SessionStatus } from '../../types';
import { DynamicQRProjector } from '../../components/qr/DynamicQRProjector';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  Square, 
  X, 
  CheckCircle2, 
  Users,
  Maximize2,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export const AdminSessionsPage: React.FC = () => {
  const { sessions, createSession, updateSession, deleteSession, attendance, users, currentUser } = useApp();

  const sessionList = Array.isArray(sessions) ? sessions : [];
  const attendanceList = Array.isArray(attendance) ? attendance : [];
  const userList = Array.isArray(users) ? users : [];

  // Projector Modal
  const [projectingSession, setProjectingSession] = useState<Session | null>(null);

  // Create/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Real-time ticking Vietnam clock
  const [currentTimeVN, setCurrentTimeVN] = useState(() => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  });

  React.useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTimeVN(new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date()));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const defaultPicId = currentUser?.id || userList[0]?.id || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '17:00',
    location: 'Hội trường C, Trường ĐH Bách khoa - ĐHĐN',
    organizer: 'Ban Chuyên môn & Dự án',
    personInChargeId: defaultPicId,
    targetParticipants: 'Toàn thể thành viên chính thức',
    targetAudience: 'Toàn thể thành viên chính thức',
    attendanceOpenTime: '13:45',
    attendanceCloseTime: '14:30',
    lateThresholdTime: '14:15',
    qrIntervalSec: 20,
    status: 'scheduled' as SessionStatus,
    category: 'workshop' as SessionCategory,
    timeChangeReason: 'Điều chỉnh lịch sinh hoạt & khung giờ điểm danh tự động'
  });

  const handleStartTimeChange = (newStartTime: string) => {
    try {
      const [h, m] = newStartTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        const pad = (n: number) => String(n).padStart(2, '0');
        const startTotalMin = h * 60 + m;
        const openTotalMin = Math.max(0, startTotalMin - 15);
        const lateTotalMin = startTotalMin + 10;
        const closeTotalMin = startTotalMin + 30;

        const openTime = `${pad(Math.floor(openTotalMin / 60) % 24)}:${pad(openTotalMin % 60)}`;
        const lateTime = `${pad(Math.floor(lateTotalMin / 60) % 24)}:${pad(lateTotalMin % 60)}`;
        const closeTime = `${pad(Math.floor(closeTotalMin / 60) % 24)}:${pad(closeTotalMin % 60)}`;

        setFormData(prev => ({
          ...prev,
          startTime: newStartTime,
          attendanceOpenTime: openTime,
          lateThresholdTime: lateTime,
          attendanceCloseTime: closeTime
        }));
        return;
      }
    } catch {}
    setFormData(prev => ({ ...prev, startTime: newStartTime }));
  };

  const applyAttendancePreset = (preset: 'standard' | 'exact' | 'now') => {
    const pad = (n: number) => String(n).padStart(2, '0');
    if (preset === 'now') {
      const nowStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());
      const [h, m] = nowStr.split(':').map(Number);
      const nowMins = h * 60 + m;
      const lateMins = nowMins + 10;
      const closeMins = nowMins + 30;
      setFormData(prev => ({
        ...prev,
        attendanceOpenTime: nowStr,
        lateThresholdTime: `${pad(Math.floor(lateMins / 60) % 24)}:${pad(lateMins % 60)}`,
        attendanceCloseTime: `${pad(Math.floor(closeMins / 60) % 24)}:${pad(closeMins % 60)}`
      }));
      return;
    }

    const [sh, sm] = (formData.startTime || '14:00').split(':').map(Number);
    const startMins = (!isNaN(sh) && !isNaN(sm)) ? sh * 60 + sm : 14 * 60;

    if (preset === 'standard') {
      const openMins = Math.max(0, startMins - 15);
      const lateMins = startMins + 10;
      const closeMins = startMins + 15;
      setFormData(prev => ({
        ...prev,
        attendanceOpenTime: `${pad(Math.floor(openMins / 60) % 24)}:${pad(openMins % 60)}`,
        lateThresholdTime: `${pad(Math.floor(lateMins / 60) % 24)}:${pad(lateMins % 60)}`,
        attendanceCloseTime: `${pad(Math.floor(closeMins / 60) % 24)}:${pad(closeMins % 60)}`
      }));
    } else if (preset === 'exact') {
      const openMins = startMins;
      const lateMins = startMins + 10;
      const closeMins = startMins + 30;
      setFormData(prev => ({
        ...prev,
        attendanceOpenTime: `${pad(Math.floor(openMins / 60) % 24)}:${pad(openMins % 60)}`,
        lateThresholdTime: `${pad(Math.floor(lateMins / 60) % 24)}:${pad(lateMins % 60)}`,
        attendanceCloseTime: `${pad(Math.floor(closeMins / 60) % 24)}:${pad(closeMins % 60)}`
      }));
    }
  };

  const handleOpenAdd = () => {
    setEditingSessionId(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '17:00',
      location: 'Hội trường C, Trường ĐH Bách khoa - ĐHĐN',
      organizer: 'Ban Chuyên môn & Dự án',
      personInChargeId: currentUser?.id || users[0]?.id || '',
      targetParticipants: 'Toàn thể thành viên chính thức',
      targetAudience: 'Toàn thể thành viên chính thức',
      attendanceOpenTime: '13:45',
      attendanceCloseTime: '14:30',
      lateThresholdTime: '14:15',
      qrIntervalSec: 20,
      status: 'scheduled',
      category: 'workshop',
      timeChangeReason: 'Tạo mới phiên sinh hoạt'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Session) => {
    setEditingSessionId(s.id);
    const audience = s.targetAudience || s.targetParticipants || '';
    setFormData({
      title: s.title,
      description: s.description,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location,
      organizer: s.organizer || s.personInChargeName || '',
      personInChargeId: (s as any).personInChargeId || currentUser?.id || users[0]?.id || '',
      targetParticipants: audience,
      targetAudience: audience,
      attendanceOpenTime: s.attendanceOpenTime || (s as any).effectiveAttendanceOpenTime || '13:45',
      attendanceCloseTime: s.attendanceCloseTime || (s as any).effectiveAttendanceCloseTime || '14:30',
      lateThresholdTime: s.lateThresholdTime || (s as any).effectiveLateThresholdTime || '14:15',
      qrIntervalSec: s.qrIntervalSec || 20,
      status: s.status,
      category: s.category || 'workshop',
      timeChangeReason: 'Điều chỉnh lịch sinh hoạt & khung giờ điểm danh tự động'
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    setIsSaving(true);
    try {
      if (editingSessionId) {
        await updateSession(editingSessionId, formData);
      } else {
        await createSession(formData);
      }
      setShowModal(false);
    } catch {
      // Error is handled with alert in AppContext
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (session: Session) => {
    const isGateOpen = session.attendanceStatus === 'open' || (session as any).isAttendanceOpen;
    if (isGateOpen) {
      await updateSession(session.id, {
        attendanceStatus: 'closed',
        timeChangeReason: 'Đóng cổng điểm danh thủ công'
      });
    } else {
      await updateSession(session.id, {
        attendanceStatus: 'open',
        status: 'ongoing',
        timeChangeReason: 'Mở cổng điểm danh thủ công'
      });
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phiên sinh hoạt "${title}"?`)) {
      deleteSession(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Quản lý Phiên Sinh hoạt & Điểm danh QR
            </h1>
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1 rounded-xl text-xs text-slate-300 shadow-xs">
              <Clock className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Giờ hệ thống (VN): <strong className="font-mono text-emerald-400 font-bold">{currentTimeVN}</strong></span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">Auto-Sync</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Khởi tạo buổi họp/workshop, cấu hình giờ tự động mở/đóng cổng điểm danh theo thời gian thực và chiếu mã QR lên máy chiếu.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Phiên Sinh hoạt mới</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-4">
        {sessionList.map((s) => {
          const checkedInCount = attendanceList.filter(a => a && a.sessionId === s.id).length;
          const isGateOpen = (s.attendanceStatus === 'open' || (s as any).isAttendanceOpen) && s.status !== 'cancelled';
          const openTimeDisp = s.attendanceOpenTime || (s as any).effectiveAttendanceOpenTime || 'Tự động';
          const closeTimeDisp = s.attendanceCloseTime || (s as any).effectiveAttendanceCloseTime || 'Tự động';
          const lateTimeDisp = s.lateThresholdTime || (s as any).effectiveLateThresholdTime;

          return (
            <div
              key={s.id}
              className={`bg-slate-900 border rounded-3xl p-6 shadow-xs space-y-4 transition ${
                isGateOpen ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md uppercase">
                    {s.category || 'Workshop'}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="font-semibold text-slate-200 text-xs">{s.date}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Gate Status Badge */}
                  {s.status === 'cancelled' ? (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Đã hủy
                    </span>
                  ) : s.attendanceStatus === 'finalized' ? (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      🔒 Đã chốt sổ điểm danh
                    </span>
                  ) : isGateOpen ? (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      🔴 CỔNG ĐIỂM DANH: ĐANG MỞ
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {s.status === 'ended' ? 'Cổng điểm danh đã đóng' : `Cổng điểm danh đang đóng (Mở lúc ${openTimeDisp})`}
                    </span>
                  )}

                  {/* Session Lifecycle Badge */}
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-400 border border-slate-700/60">
                    {s.status === 'ongoing' ? 'Phiên đang diễn ra' : s.status === 'ended' ? 'Phiên đã kết thúc' : s.status === 'cancelled' ? 'Hủy' : 'Đã lên lịch'}
                  </span>

                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                    {checkedInCount} người đã điểm danh
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                  {s.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Thời gian phiên: <strong className="text-slate-200">{s.startTime} - {s.endTime}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="truncate">{s.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="truncate">
                    Đối tượng: <strong className="text-slate-200">{s.targetAudience || s.targetParticipants || 'Toàn thể thành viên chính thức'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    Điểm danh: <strong className="text-emerald-400 font-mono">{openTimeDisp} - {closeTimeDisp}</strong>
                    {lateTimeDisp && (
                      <span className="text-amber-400 ml-1 font-mono">(Trễ: {lateTimeDisp})</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Trình chiếu QR lên màn hình lớn */}
                  <button
                    onClick={() => setProjectingSession(s)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow-xs"
                    title="Mở màn hình chiếu mã QR xoay vòng lên máy chiếu"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Trình chiếu QR Lên Máy Chiếu</span>
                  </button>

                  {/* Toggle Open/Close Gate */}
                  <button
                    onClick={() => handleToggleStatus(s)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isGateOpen
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isGateOpen ? (
                      <>
                        <Square className="h-3 w-3" />
                        <span>Đóng cổng điểm danh</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span>Mở cổng điểm danh ngay</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                    title="Chỉnh sửa thông tin phiên"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                    title="Xóa phiên"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic QR Projector Modal */}
      {projectingSession && (
        <DynamicQRProjector
          session={projectingSession}
          onClose={() => setProjectingSession(null)}
        />
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingSessionId ? 'Chỉnh sửa Phiên sinh hoạt' : 'Tạo Phiên Sinh hoạt Mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tiêu đề phiên sinh hoạt *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Mô tả nội dung & mục tiêu buổi học *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                    <span>Người phụ trách (Bắt buộc) *</span>
                    <span className="text-[10px] text-blue-400">Chủ trì / Báo cáo viên</span>
                  </label>
                  <select
                    required
                    value={formData.personInChargeId}
                    onChange={(e) => setFormData({ ...formData, personInChargeId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn thành viên phụ trách --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.studentId ? `${u.studentId} - ` : ''}Ban {u.unit || 'BK-IC'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Đối tượng tham gia
                  </label>
                  <input
                    type="text"
                    value={formData.targetParticipants}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      targetParticipants: e.target.value,
                      targetAudience: e.target.value 
                    })}
                    placeholder="Ví dụ: Ban Truyền thông, Ban Điều hành, Toàn thể thành viên..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ngày diễn ra *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Phân loại
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as SessionCategory })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="workshop">Workshop Chuyên môn</option>
                    <option value="training">Tập huấn Kỹ năng</option>
                    <option value="pitching">Pitching Dự án</option>
                    <option value="general_meeting">Sinh hoạt Toàn CLB</option>
                    <option value="project_dev">Sprint Dự án Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Bắt đầu (Giờ)
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kết thúc (Giờ)
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Dedicated Attendance Gate Automation Config Section */}
              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Cổng Điểm Danh Tự Động (Theo giờ hệ thống)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                    Hiện tại: {currentTimeVN}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  💡 Cổng điểm danh sẽ <strong>TỰ ĐỘNG BẬT</strong> khi đồng hồ đạt giờ Mở, và <strong>TỰ ĐỘNG TẮT</strong> khi đạt giờ Đóng. Bạn có thể tự do đặt bất kỳ mốc giờ nào (ví dụ: 22:46 đến 23:15).
                </p>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Gợi ý nhanh:</span>
                  <button
                    type="button"
                    onClick={() => applyAttendancePreset('standard')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition"
                  >
                    Chuẩn CLB (-15p đến +15p)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAttendancePreset('exact')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition"
                  >
                    Mở đúng giờ bắt đầu (+30p)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAttendancePreset('now')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition flex items-center gap-1"
                  >
                    <Zap className="h-3 w-3" />
                    <span>Mở ngay bây giờ ({currentTimeVN.slice(0, 5)})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1 flex items-center justify-between">
                      <span>Giờ Mở điểm danh *</span>
                      <span className="text-[10px] text-slate-400">Tự động bật</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.attendanceOpenTime}
                      onChange={(e) => setFormData({ ...formData, attendanceOpenTime: e.target.value })}
                      className="w-full rounded-xl border border-emerald-500/40 bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-emerald-300 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center justify-between">
                      <span>Mốc tính muộn</span>
                      <span className="text-[10px] text-slate-400">Sau giờ này = Trễ</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.lateThresholdTime}
                      onChange={(e) => setFormData({ ...formData, lateThresholdTime: e.target.value })}
                      className="w-full rounded-xl border border-amber-500/40 bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rose-400 mb-1 flex items-center justify-between">
                      <span>Giờ Đóng điểm danh *</span>
                      <span className="text-[10px] text-slate-400">Tự động tắt</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.attendanceCloseTime}
                      onChange={(e) => setFormData({ ...formData, attendanceCloseTime: e.target.value })}
                      className="w-full rounded-xl border border-rose-500/40 bg-slate-800 px-3 py-2 text-xs font-mono font-semibold text-rose-300 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Địa điểm phòng học / giảng đường
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {editingSessionId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Lý do cập nhật (Lưu vết lịch sử thay đổi)
                  </label>
                  <input
                    type="text"
                    value={formData.timeChangeReason || ''}
                    onChange={(e) => setFormData({ ...formData, timeChangeReason: e.target.value })}
                    placeholder="Ví dụ: Điều chỉnh khung giờ điểm danh tự động cho buổi họp"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving && <Clock className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu phiên sinh hoạt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
