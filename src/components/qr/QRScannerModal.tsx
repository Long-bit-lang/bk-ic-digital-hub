// Member QR Check-in & Code Verification Modal
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
  defaultSessionId?: string;
  defaultToken?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ 
  onClose, 
  defaultSessionId, 
  defaultToken 
}) => {
  const { sessions, checkInSession, currentUser } = useApp();
  const openSessions = sessions.filter(s => s.status === 'open');

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    defaultSessionId || (openSessions.length > 0 ? openSessions[0].id : '')
  );
  const [tokenInput, setTokenInput] = useState<string>(defaultToken || '');
  const [result, setResult] = useState<{ success: boolean; message: string; status?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedSessionId) {
      setResult({ success: false, message: 'Vui lòng chọn buổi sinh hoạt cần điểm danh.' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    // Call server/state verification
    try {
      const res = await checkInSession(selectedSessionId, 'qr', tokenInput.trim());
      setResult(res);
      setIsSubmitting(false);

      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // fallback if canvas unavailable
        }
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Lỗi quét QR'
      });
      setIsSubmitting(false);
    }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Điểm danh Phiên sinh hoạt</h3>
              <p className="text-[11px] text-slate-500">Xác thực mã định danh và ghi nhận giờ có mặt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {result && result.success ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {result.status === 'present' ? 'Điểm danh Thành công!' : 'Đã ghi nhận Đến muộn'}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {result.message}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Thành viên:</span>
                  <span className="font-semibold text-slate-800">{currentUser?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã sinh viên:</span>
                  <span className="font-mono text-slate-800">{currentUser?.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian ghi nhận:</span>
                  <span className="font-mono text-slate-800">{new Date().toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Hoàn tất
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheckIn} className="space-y-4">
              {result && !result.success && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Điểm danh không thành công</div>
                    <div className="text-[11px] mt-0.5 leading-relaxed">{result.message}</div>
                  </div>
                </div>
              )}

              {/* Session Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chọn Phiên sinh hoạt đang diễn ra
                </label>
                {openSessions.length === 0 ? (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                    Hiện tại chưa có phiên sinh hoạt nào đang mở cổng điểm danh. Vui lòng liên hệ Ban Chủ nhiệm hoặc chờ đến giờ mở phiên.
                  </div>
                ) : (
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    {openSessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSession && (
                <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khung giờ buổi:</span>
                    <span className="font-medium text-slate-800">{selectedSession.startTime} - {selectedSession.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngưỡng tính muộn:</span>
                    <span className="font-medium text-amber-700 font-mono">{selectedSession.lateThresholdTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Địa điểm:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{selectedSession.location}</span>
                  </div>
                </div>
              )}

              {/* Security Token Input (auto-filled if scanned from URL, or entered manually) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mã xác thực điểm danh (Token từ màn hình máy chiếu)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: BKIC-001-A9F-..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Mã này hiển thị bên dưới mã QR trên màn hình máy chiếu và thay đổi sau mỗi 20 giây để đảm bảo tính hiện diện.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || openSessions.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#245BFA] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Đang xác thực hệ thống...</span>
                ) : (
                  <>
                    <span>Xác nhận Điểm danh</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
