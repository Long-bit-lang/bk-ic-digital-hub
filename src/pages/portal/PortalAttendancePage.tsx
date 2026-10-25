// BK-IC Member Personal Attendance Logs & Absence Request
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { QRScannerModal } from '../../components/qr/QRScannerModal';
import { 
  QrCode, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X,
  Send,
  Plus
} from 'lucide-react';

export const PortalAttendancePage: React.FC = () => {
  const { attendance, currentUser, sessions, submitAbsenceRequest } = useApp();
  const [searchParams] = useSearchParams();

  // QR Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [urlSessionId, setUrlSessionId] = useState<string | undefined>(undefined);
  const [urlToken, setUrlToken] = useState<string | undefined>(undefined);

  // Absence Request Modal
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceSessionId, setAbsenceSessionId] = useState('');
  const [absenceReason, setAbsenceReason] = useState('');
  const [absenceSubmitted, setAbsenceSubmitted] = useState(false);

  // Check URL query params on mount
  useEffect(() => {
    const sId = searchParams.get('sessionId');
    const tok = searchParams.get('token');
    if (sId || tok) {
      setUrlSessionId(sId || undefined);
      setUrlToken(tok || undefined);
      setShowQRModal(true);
    }
  }, [searchParams]);

  if (!currentUser) return null;

  // Filter personal attendance records
  const myAttendance = attendance.filter(a => a.memberId === currentUser.id);
  const presentCount = myAttendance.filter(a => a.status === 'present').length;
  const lateCount = myAttendance.filter(a => a.status === 'late').length;
  const excusedCount = myAttendance.filter(a => a.status === 'excused').length;

  const handleAbsenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!absenceSessionId || !absenceReason.trim()) {
      alert('Vui lòng chọn buổi sinh hoạt và nhập lý do xin vắng.');
      return;
    }

    submitAbsenceRequest(absenceSessionId, absenceReason.trim());
    setAbsenceSubmitted(true);
    setTimeout(() => {
      setAbsenceSubmitted(false);
      setShowAbsenceModal(false);
      setAbsenceReason('');
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cổng Thành viên
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Lịch sử Điểm danh Cá nhân
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận thời gian có mặt thực tế và đơn xin phép vắng buổi sinh hoạt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAbsenceModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span>Đơn xin vắng</span>
          </button>

          <button
            onClick={() => {
              setUrlSessionId(undefined);
              setUrlToken(undefined);
              setShowQRModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#245BFA] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <QrCode className="h-4 w-4" />
            <span>Quét QR mới</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Có mặt đúng giờ</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {presentCount}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Đến muộn</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {lateCount}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Vắng có phép</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
            {excusedCount}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Chi tiết các phiên đã ghi nhận ({myAttendance.length})
          </h3>
          <span className="text-xs text-slate-400">
            Dữ liệu đối chiếu bảo mật thời gian thực
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold">
                <th className="py-3 px-4">Buổi sinh hoạt</th>
                <th className="py-3 px-4">Thời gian quét mã</th>
                <th className="py-3 px-4">Phương thức</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {myAttendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Chưa có bản ghi điểm danh nào được lưu.
                  </td>
                </tr>
              ) : (
                myAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {rec.sessionTitle}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {new Date(rec.checkInTime).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-400">
                      {rec.method}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        rec.status === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.status === 'late'
                          ? 'bg-amber-100 text-amber-800'
                          : rec.status === 'excused'
                          ? 'bg-blue-100 text-blue-800'
                          : rec.status === 'pending_review'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rec.status === 'present'
                          ? 'Có mặt đúng giờ'
                          : rec.status === 'late'
                          ? 'Đến muộn'
                          : rec.status === 'excused'
                          ? 'Vắng có phép'
                          : rec.status === 'pending_review'
                          ? 'Đang chờ BCN duyệt'
                          : 'Vắng không phép'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {rec.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRModal && (
        <QRScannerModal
          defaultSessionId={urlSessionId}
          defaultToken={urlToken}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* Absence Request Modal */}
      {showAbsenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Gửi Đơn xin phép Vắng mặt
              </h3>
              <button
                onClick={() => setShowAbsenceModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {absenceSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Đã gửi đơn xin phép!</h4>
                <p className="text-xs text-slate-500">
                  Ban Chủ nhiệm sẽ xem xét lý do và cập nhật trạng thái "Vắng có phép".
                </p>
              </div>
            ) : (
              <form onSubmit={handleAbsenceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chọn phiên sinh hoạt *
                  </label>
                  <select
                    required
                    value={absenceSessionId}
                    onChange={(e) => setAbsenceSessionId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Chọn buổi sinh hoạt --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lý do xin vắng (Kèm minh chứng nếu có) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Trùng lịch học bù thí nghiệm xưởng, đại diện trường thi đấu, lý do sức khỏe..."
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAbsenceModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#245BFA] text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Gửi đơn
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
