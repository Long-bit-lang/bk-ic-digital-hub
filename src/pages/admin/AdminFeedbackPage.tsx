// BK-IC Admin Feedback Analytics & Anonymous Response Viewer
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  EyeOff, 
  Calendar, 
  Lightbulb, 
  TrendingUp,
  Filter,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Unlock
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminFeedbackPage: React.FC = () => {
  const { sessions, currentUser, reopenFeedbackWindow } = useApp();
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<{
    count: number;
    avgContentQuality: string | null;
    avgDelivery: string | null;
    avgDurationSuitability: string | null;
    avgUsefulness: string | null;
    overallAverage: string | null;
  }>({
    count: 0,
    avgContentQuality: null,
    avgDelivery: null,
    avgDurationSuitability: null,
    avgUsefulness: null,
    overallAverage: null
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal for Reopening Feedback Window (BN & Admin only)
  const [reopenModal, setReopenModal] = useState<{
    isOpen: boolean;
    sessionId: string;
    sessionTitle: string;
    hours: number;
    reason: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    sessionId: '',
    sessionTitle: '',
    hours: 24,
    reason: '',
    isSubmitting: false,
    error: null
  });

  const isBnOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'sysadmin' || currentUser?.unit === 'BN';

  // Load feedback data from real API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.feedback.getAll(sessionFilter !== 'all' ? { sessionId: sessionFilter } : undefined);
      if (res.success) {
        setFeedbacks(res.feedbacks || []);
        setMetrics(res.metrics || {
          count: 0,
          avgContentQuality: null,
          avgDelivery: null,
          avgDurationSuitability: null,
          avgUsefulness: null,
          overallAverage: null
        });
      } else {
        setError('Không thể tải dữ liệu phản hồi.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối khi tải danh sách phản hồi.');
      setFeedbacks([]);
      setMetrics({
        count: 0,
        avgContentQuality: null,
        avgDelivery: null,
        avgDurationSuitability: null,
        avgUsefulness: null,
        overallAverage: null
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle reopening feedback
  const handleOpenReopenModal = (sessionId: string, sessionTitle: string) => {
    setReopenModal({
      isOpen: true,
      sessionId,
      sessionTitle,
      hours: 24,
      reason: '',
      isSubmitting: false,
      error: null
    });
  };

  const handleConfirmReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenModal.reason.trim()) {
      setReopenModal(prev => ({ ...prev, error: 'Vui lòng cung cấp lý do mở lại biểu mẫu góp ý.' }));
      return;
    }

    setReopenModal(prev => ({ ...prev, isSubmitting: true, error: null }));
    try {
      const res = await reopenFeedbackWindow(reopenModal.sessionId, reopenModal.hours, reopenModal.reason.trim());
      if (res.success) {
        alert(res.message);
        setReopenModal(prev => ({ ...prev, isOpen: false }));
        await loadData();
      } else {
        setReopenModal(prev => ({ ...prev, error: res.message || 'Không thể mở lại thời hạn góp ý.' }));
      }
    } catch (err: any) {
      setReopenModal(prev => ({ ...prev, error: err.message || 'Lỗi kết nối khi mở lại thời hạn.' }));
    } finally {
      setReopenModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const selectedSessionObj = sessionFilter !== 'all' ? sessions.find(s => s.id === sessionFilter) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <span>Tổng hợp Phản hồi Sau Phiên Sinh hoạt</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Đánh giá chất lượng đào tạo và ý kiến đóng góp từ thành viên (Đảm bảo cơ chế bảo mật ẩn danh tuyệt đối).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none max-w-xs truncate"
          >
            <option value="all">Tất cả các phiên sinh hoạt</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.date})</option>
            ))}
          </select>

          <button
            onClick={() => loadData()}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isBnOrAdmin && selectedSessionObj && (
            <button
              onClick={() => handleOpenReopenModal(selectedSessionObj.id, selectedSessionObj.title)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Mở lại góp ý</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregated Score Cards (4 official criteria + overall) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Content Quality */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-xs text-slate-400">Chất lượng nội dung</div>
          <div className="flex items-baseline gap-2 mt-1">
            {metrics.avgContentQuality ? (
              <>
                <span className="text-3xl font-bold font-mono text-blue-400 tabular-nums">
                  {metrics.avgContentQuality}
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-500">Chưa có dữ liệu</span>
            )}
          </div>
          <div className="mt-2 flex text-blue-400 text-sm">
            {metrics.avgContentQuality ? '★'.repeat(Math.round(Number(metrics.avgContentQuality))) : '☆☆☆☆☆'}
          </div>
        </div>

        {/* Card 2: Delivery */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-xs text-slate-400">Khả năng truyền đạt</div>
          <div className="flex items-baseline gap-2 mt-1">
            {metrics.avgDelivery ? (
              <>
                <span className="text-3xl font-bold font-mono text-purple-400 tabular-nums">
                  {metrics.avgDelivery}
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-500">Chưa có dữ liệu</span>
            )}
          </div>
          <div className="mt-2 flex text-purple-400 text-sm">
            {metrics.avgDelivery ? '★'.repeat(Math.round(Number(metrics.avgDelivery))) : '☆☆☆☆☆'}
          </div>
        </div>

        {/* Card 3: Duration Suitability */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-xs text-slate-400">Mức độ phù hợp thời lượng</div>
          <div className="flex items-baseline gap-2 mt-1">
            {metrics.avgDurationSuitability ? (
              <>
                <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                  {metrics.avgDurationSuitability}
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-500">Chưa có dữ liệu</span>
            )}
          </div>
          <div className="mt-2 flex text-emerald-400 text-sm">
            {metrics.avgDurationSuitability ? '★'.repeat(Math.round(Number(metrics.avgDurationSuitability))) : '☆☆☆☆☆'}
          </div>
        </div>

        {/* Card 4: Usefulness */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-xs text-slate-400">Tính hữu ích thực tế</div>
          <div className="flex items-baseline gap-2 mt-1">
            {metrics.avgUsefulness ? (
              <>
                <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
                  {metrics.avgUsefulness}
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-500">Chưa có dữ liệu</span>
            )}
          </div>
          <div className="mt-2 flex text-amber-400 text-sm">
            {metrics.avgUsefulness ? '★'.repeat(Math.round(Number(metrics.avgUsefulness))) : '☆☆☆☆☆'}
          </div>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Danh sách ý kiến đóng góp ({feedbacks.length} phản hồi hợp lệ)</span>
          {metrics.overallAverage && (
            <span className="text-blue-400 normal-case font-bold">
              Điểm trung bình toàn diện: {metrics.overallAverage} / 5.0
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500 text-xs">
            Đang tải dữ liệu phản hồi từ máy chủ...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500 text-xs">
            Chưa có phản hồi nào cho phiên sinh hoạt này.
          </div>
        ) : (
          feedbacks.map((fb: any) => (
            <div
              key={fb.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {fb.sessionTitle}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    Gửi lúc {new Date(fb.submittedAt).toLocaleString('vi-VN')}
                    {fb.updatedAt && (
                      <span className="ml-2 text-slate-500">
                        (Cập nhật lúc {new Date(fb.updatedAt).toLocaleString('vi-VN')})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                    <EyeOff className="h-3 w-3" />
                    <span>Thành viên Ẩn danh (Bảo mật tuyệt đối)</span>
                  </span>
                </div>
              </div>

              {/* Star breakdown across 4 official criteria */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nội dung:</span>
                  <strong className="text-blue-400 font-mono text-sm">{fb.contentQuality}/5★</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Truyền đạt:</span>
                  <strong className="text-purple-400 font-mono text-sm">{fb.delivery}/5★</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Thời lượng:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{fb.durationSuitability}/5★</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hữu ích:</span>
                  <strong className="text-amber-400 font-mono text-sm">{fb.usefulness}/5★</strong>
                </div>
              </div>

              {/* 3 Separate qualitative answers */}
              <div className="space-y-2.5 text-xs">
                {fb.valuableTakeaway && (
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-emerald-400 font-semibold block mb-1">
                      1. Điều tâm đắc nhất / Giá trị thu nhận:
                    </span>
                    <span className="text-slate-200 leading-relaxed block whitespace-pre-wrap">
                      {fb.valuableTakeaway}
                    </span>
                  </div>
                )}

                {fb.improvementSuggestion && (
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-amber-400 font-semibold block mb-1">
                      2. Đề xuất cải thiện cho buổi sau:
                    </span>
                    <span className="text-slate-200 leading-relaxed block whitespace-pre-wrap">
                      {fb.improvementSuggestion}
                    </span>
                  </div>
                )}

                {fb.nextTopicIdea && (
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-blue-400 font-semibold block mb-1">
                      3. Mong muốn chủ đề tiếp theo:
                    </span>
                    <span className="text-slate-200 leading-relaxed block whitespace-pre-wrap">
                      {fb.nextTopicIdea}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reopen Feedback Modal */}
      {reopenModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Mở lại Biểu mẫu Góp ý</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Gia hạn thời gian tiếp nhận phản hồi cho buổi: <strong className="text-slate-200">{reopenModal.sessionTitle}</strong>
              </p>
            </div>

            {reopenModal.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {reopenModal.error}
              </div>
            )}

            <form onSubmit={handleConfirmReopen} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thời gian gia hạn thêm (Giờ) *
                </label>
                <select
                  value={reopenModal.hours}
                  onChange={(e) => setReopenModal(prev => ({ ...prev, hours: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value={12}>12 giờ</option>
                  <option value={24}>24 giờ (1 ngày)</option>
                  <option value={48}>48 giờ (2 ngày)</option>
                  <option value={72}>72 giờ (3 ngày)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lý do mở lại (Bắt buộc lưu vết kiểm toán) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reopenModal.reason}
                  onChange={(e) => setReopenModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ví dụ: Theo đề xuất của Ban Điều hành nhằm thu thập thêm ý kiến của thành viên tham gia buổi workshop..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReopenModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={reopenModal.isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition"
                >
                  {reopenModal.isSubmitting ? 'Đang lưu...' : 'Xác nhận mở lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
