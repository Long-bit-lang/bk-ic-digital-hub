// BK-IC Member Personal Attendance Logs, Absence Request & Correction Appeals
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { QRScannerModal } from '../../components/qr/QRScannerModal';
import { AttendanceRequestType } from '../../types';
import { 
  QrCode, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X,
  Send,
  Plus,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  History,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Check,
  ChevronRight
} from 'lucide-react';

export const PortalAttendancePage: React.FC = () => {
  const { 
    attendance, 
    currentUser, 
    sessions, 
    attendanceRequests,
    submitAbsenceExplanation,
    submitCorrectionRequest,
    reloadAttendance
  } = useApp();
  
  const [searchParams] = useSearchParams();

  // Tab State: 'records' (Bảng điểm danh) | 'requests' (Đơn xin vắng & Khiếu nại)
  const [activeTab, setActiveTab] = useState<'records' | 'requests'>('records');

  // QR Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [urlSessionId, setUrlSessionId] = useState<string | undefined>(undefined);
  const [urlToken, setUrlToken] = useState<string | undefined>(undefined);

  // Absence & Appeal Request Modal
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [requestType, setRequestType] = useState<AttendanceRequestType>('absence_explanation');
  const [absenceSessionId, setAbsenceSessionId] = useState('');
  const [absenceReason, setAbsenceReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [absenceSubmitted, setAbsenceSubmitted] = useState(false);

  // Check URL query params on mount
  useEffect(() => {
    const sId = searchParams.get('sessionId');
    const tok = searchParams.get('token');
    const action = searchParams.get('action');

    if (action === 'absence') {
      if (sId) setAbsenceSessionId(sId);
      setShowAbsenceModal(true);
      setActiveTab('requests');
    } else if (sId || tok) {
      setUrlSessionId(sId || undefined);
      setUrlToken(tok || undefined);
      setShowQRModal(true);
    }
  }, [searchParams]);

  if (!currentUser) return null;

  // Filter personal attendance records
  const myAttendance = (attendance || []).filter(a => a.memberId === currentUser.id);
  const presentCount = myAttendance.filter(a => a.status === 'present').length;
  const lateCount = myAttendance.filter(a => a.status === 'late').length;
  const excusedCount = myAttendance.filter(a => a.status === 'excused').length;

  // Filter personal requests
  const myRequests = (attendanceRequests || []).filter(r => r.memberId === currentUser.id);
  const pendingRequestsCount = myRequests.filter(r => r.status === 'pending').length;

  const handleAbsenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!absenceSessionId || !absenceReason.trim()) {
      alert('Vui lòng chọn phiên sinh hoạt và nhập lý do cụ thể.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (requestType === 'absence_explanation') {
        await submitAbsenceExplanation(
          absenceSessionId,
          absenceReason.trim(),
          evidenceUrl.trim() || undefined
        );
      } else {
        await submitCorrectionRequest(
          absenceSessionId,
          absenceReason.trim(),
          evidenceUrl.trim() || undefined
        );
      }
      setAbsenceSubmitted(true);
      await reloadAttendance();
      setTimeout(() => {
        setAbsenceSubmitted(false);
        setShowAbsenceModal(false);
        setAbsenceReason('');
        setEvidenceUrl('');
        setActiveTab('requests');
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi đơn yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cổng Thành viên BK-IC
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Điểm danh & Đơn xin vắng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận thời gian có mặt thực tế, quét QR điểm danh và theo dõi kết quả xét duyệt đơn xin vắng/khiếu nại.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setRequestType('absence_explanation');
              setShowAbsenceModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Gửi đơn xin vắng</span>
          </button>

          <button
            onClick={() => {
              setUrlSessionId(undefined);
              setUrlToken(undefined);
              setShowQRModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#245BFA] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <QrCode className="h-4 w-4" />
            <span>Quét QR điểm danh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Có mặt đúng giờ</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {presentCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đạt chuẩn chuyên cần</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Đến muộn</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {lateCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sau thời điểm mở cổng</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Vắng có phép</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
            {excusedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đơn đã được chấp thuận</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Đơn đã nộp</span>
            {pendingRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {pendingRequestsCount} chờ duyệt
              </span>
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-slate-800 mt-1 tabular-nums">
            {myRequests.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tổng số đơn vắng & khiếu nại</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'records'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="h-4 w-4" />
          <span>Lịch sử Điểm danh ({myAttendance.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Đơn xin vắng & Khiếu nại ({myRequests.length})</span>
          {pendingRequestsCount > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Attendance Table */}
      {activeTab === 'records' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Chi tiết các phiên sinh hoạt đã ghi nhận ({myAttendance.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dữ liệu đối chiếu bảo mật thời gian thực và đồng bộ với sổ điểm danh CLB
              </p>
            </div>
            <button
              onClick={() => {
                setRequestType('absence_explanation');
                setShowAbsenceModal(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>+ Gửi đơn vắng cho buổi chưa có tên</span>
            </button>
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
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Chưa có bản ghi điểm danh nào được lưu.
                    </td>
                  </tr>
                ) : (
                  myAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {rec.sessionTitle}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {new Date(rec.checkInTime).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-mono text-slate-400">
                        {rec.method}
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {rec.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {rec.status === 'late' || rec.status === 'unexcused' ? (
                          <button
                            onClick={() => {
                              setRequestType('correction_request');
                              setAbsenceSessionId(rec.sessionId);
                              setShowAbsenceModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                            title="Gửi khiếu nại đính chính kết quả nếu hệ thống ghi nhận chưa chính xác"
                          >
                            <span>Khiếu nại</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Requests Table & List */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Danh sách Đơn xin vắng & Khiếu nại của bạn ({myRequests.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Các đơn giải trình vắng mặt (48h) và khiếu nại sửa điểm danh (24h) gửi đến Người phụ trách & BCN
                </p>
              </div>

              <button
                onClick={() => {
                  setRequestType('absence_explanation');
                  setShowAbsenceModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo đơn mới</span>
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                <div className="text-sm font-bold text-slate-800">
                  Bạn chưa gửi đơn xin vắng hoặc khiếu nại nào
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Khi có việc bận đột xuất, lịch học bù trùng lịch sinh hoạt hoặc phát hiện điểm danh nhầm lẫn, hãy tạo đơn tại đây để được Người phụ trách và Ban Chủ nhiệm hỗ trợ.
                </p>
                <button
                  onClick={() => {
                    setRequestType('absence_explanation');
                    setShowAbsenceModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tạo đơn xin vắng ngay</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-5 hover:bg-slate-50/50 transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Type badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.type === 'absence_explanation'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {req.type === 'absence_explanation' ? 'Đơn xin phép vắng mặt' : 'Khiếu nại / Sửa điểm danh'}
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className="text-sm font-bold text-slate-900">
                          {req.sessionTitle}
                        </span>

                        {/* Late tag */}
                        {req.isLateSubmission ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Nộp quá hạn (Chờ BCN duyệt ngoại lệ)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            Đúng thời hạn
                          </span>
                        )}
                      </div>

                      {/* Status badge */}
                      <div>
                        {req.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Đang chờ BCN duyệt</span>
                          </span>
                        ) : req.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Đã chấp thuận</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <X className="h-3.5 w-3.5" />
                            <span>Bị từ chối</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reason block */}
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-1.5 border border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500">
                        Lý do thành viên cung cấp:
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap text-slate-800">
                        "{req.reason}"
                      </p>
                    </div>

                    {/* Evidence & Decision Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3 pt-1">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span>
                          Gửi lúc: <strong className="text-slate-700">{new Date(req.submittedAt).toLocaleString('vi-VN')}</strong>
                        </span>

                        {req.evidenceUrl ? (
                          <a
                            href={req.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Xem tài liệu / minh chứng đính kèm</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">Không có minh chứng đính kèm</span>
                        )}
                      </div>

                      {/* Review details */}
                      {req.status !== 'pending' && (
                        <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 space-y-0.5">
                          <div>
                            <span className="font-semibold text-slate-700">
                              {req.status === 'approved' ? '✓ Người duyệt:' : '✕ Người từ chối:'}
                            </span>{' '}
                            {req.decidedBy || 'Ban Chủ nhiệm'}
                            {req.decidedAt && (
                              <span className="text-slate-400 ml-1">
                                ({new Date(req.decidedAt).toLocaleString('vi-VN')})
                              </span>
                            )}
                          </div>
                          {req.decisionNotes && (
                            <div className="text-[11px] text-slate-600 italic">
                              Phản hồi: "{req.decisionNotes}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRModal && (
        <QRScannerModal
          defaultSessionId={urlSessionId}
          defaultToken={urlToken}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* Absence & Appeal Request Modal */}
      {showAbsenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Gửi Đơn xin vắng / Khiếu nại điểm danh
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hệ thống sẽ chuyển trực tiếp tới Người phụ trách meeting và Ban Chủ nhiệm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAbsenceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {absenceSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Gửi đơn thành công!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Đơn đã được lưu vào hệ thống. Người phụ trách hoặc Ban Chủ nhiệm sẽ xem xét và phản hồi trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAbsenceSubmit} className="space-y-4">
                {/* Request Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loại yêu cầu *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestType('absence_explanation')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        requestType === 'absence_explanation'
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                        <span>Xin phép vắng</span>
                        {requestType === 'absence_explanation' && <Check className="h-3.5 w-3.5 text-blue-600" />}
                      </div>
                      <span className="text-[10px] text-blue-700/80 mt-1">
                        Trước hoặc trong 48h sau phiên
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequestType('correction_request')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        requestType === 'correction_request'
                          ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-purple-900 flex items-center justify-between">
                        <span>Khiếu nại / Sửa kết quả</span>
                        {requestType === 'correction_request' && <Check className="h-3.5 w-3.5 text-purple-600" />}
                      </div>
                      <span className="text-[10px] text-purple-700/80 mt-1">
                        Trong 24h nếu quét lỗi hoặc nhầm
                      </span>
                    </button>
                  </div>
                </div>

                {/* Session Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chọn buổi sinh hoạt cần xin phép *
                  </label>
                  <select
                    required
                    value={absenceSessionId}
                    onChange={(e) => setAbsenceSessionId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Chọn buổi sinh hoạt trong danh sách --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.date} · {s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reason Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {requestType === 'absence_explanation'
                      ? 'Lý do xin vắng mặt *'
                      : 'Lý do khiếu nại / đính chính kết quả *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={
                      requestType === 'absence_explanation'
                        ? 'Trùng lịch thi/thí nghiệm học bù tại trường, đại diện tham gia phong trào, lý do sức khỏe hoặc công việc gia đình đột xuất...'
                        : 'Mô tả chi tiết: có mặt lúc mấy giờ, lý do camera quét mã không nhận diện, hoặc đã có mặt nhưng bị ghi vắng...'
                    }
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Evidence URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link minh chứng đính kèm (Tùy chọn)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... (link hình ảnh, thời khóa biểu, giấy phép...)"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Dán đường dẫn ảnh chụp lịch thi, đơn xin phép hoặc tài liệu công khai để BCN kiểm tra nhanh hơn.
                  </p>
                </div>

                {/* Policy alert */}
                <div className="rounded-xl bg-blue-50/60 p-3 text-[11px] text-blue-900 border border-blue-100 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Quy định xét duyệt:</strong> Đơn xin phép vắng nộp trước hoặc trong vòng 48h sau buổi sinh hoạt. Sau khi được duyệt, trạng thái điểm danh sẽ tự động chuyển sang <strong>Vắng có phép</strong> và không ảnh hưởng đến điểm thi đua chuyên cần.
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAbsenceModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#245BFA] text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đơn đến BCN'}</span>
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
