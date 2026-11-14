// BK-IC Admin Feedback Analytics, Window Management & Identified Response Viewer
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  User,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Unlock,
  Info,
  Calendar,
  Mail,
  X
} from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_REOPEN_REASON = 'Mở lại cổng góp ý để thu thập thêm ý kiến từ thành viên';

function getSessionFeedbackStatusInfo(session: any) {
  if (!session) {
    return {
      isOpen: false,
      label: 'Không xác định',
      badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
      deadline: undefined as string | undefined
    };
  }

  if (session.status === 'cancelled') {
    return {
      isOpen: false,
      label: 'Buổi đã hủy',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      deadline: undefined as string | undefined
    };
  }

  const details = session.feedbackWindowDetails;
  const deadline = details?.deadline || session.feedbackDeadline;
  const deadlineMs = deadline ? new Date(deadline).getTime() : NaN;
  const nowMs = Date.now();

  let isOpen = false;
  let windowReason: string | undefined = details?.reason;

  if (typeof session.isFeedbackOpen === 'boolean') {
    isOpen = session.isFeedbackOpen;
  } else if (typeof details?.isOpen === 'boolean') {
    isOpen = details.isOpen;
  } else if (session.feedbackStatus === 'reopened' && (!Number.isNaN(deadlineMs) ? nowMs <= deadlineMs : true)) {
    isOpen = true;
  } else if (session.feedbackStatus === 'open' && (!Number.isNaN(deadlineMs) ? nowMs <= deadlineMs : true)) {
    isOpen = true;
  } else if (session.status !== 'ended') {
    windowReason = 'not_ended_yet';
  } else {
    windowReason = 'expired';
  }

  if (isOpen) {
    if (session.feedbackStatus === 'reopened') {
      return {
        isOpen: true,
        label: 'Đang mở lại (Admin/BCN)',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        deadline
      };
    }
    return {
      isOpen: true,
      label: 'Đang mở tự động (24h)',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      deadline
    };
  }

  if (windowReason === 'not_ended_yet') {
    return {
      isOpen: false,
      label: `Chưa mở · Tự mở lúc ${session.endTime} (${session.date})`,
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      deadline
    };
  }

  return {
    isOpen: false,
    label: 'Đã đóng (Hết hạn)',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    deadline
  };
}

export const AdminFeedbackPage: React.FC = () => {
  const { sessions, currentUser, reopenFeedbackWindow, reloadSessions } = useApp();
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
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Modal for Reopening Feedback Window (BN & Admin only)
  const [reopenModal, setReopenModal] = useState<{
    isOpen: boolean;
    allowSessionSelect: boolean;
    sessionId: string;
    sessionTitle: string;
    hours: number;
    reason: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    allowSessionSelect: false,
    sessionId: '',
    sessionTitle: '',
    hours: 24,
    reason: DEFAULT_REOPEN_REASON,
    isSubmitting: false,
    error: null
  });

  const isBnOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'sysadmin' || currentUser?.unit === 'BN';

  const [activeTab, setActiveTab] = useState<'feedbacks' | 'compliance'>('feedbacks');
  const [sessionStatusData, setSessionStatusData] = useState<any>(null);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState<boolean>(false);
  const [complianceError, setComplianceError] = useState<string | null>(null);

  const [revokeModal, setRevokeModal] = useState<{
    isOpen: boolean;
    ticketId: string;
    ticketCode: string;
    memberName: string;
    reason: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    ticketId: '',
    ticketCode: '',
    memberName: '',
    reason: 'Đã bổ sung lý do chính đáng được Ban Chủ nhiệm chấp thuận',
    isSubmitting: false,
    error: null
  });

  const nonCancelledSessions = useMemo(() => {
    return [...sessions]
      .filter(s => s.status !== 'cancelled')
      .sort((a, b) => `${b.date} ${b.endTime}`.localeCompare(`${a.date} ${a.endTime}`));
  }, [sessions]);

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

  // Handle opening reopen modal (works both for a specific session or with session picker from 'all')
  const handleOpenReopenModal = (sessionId?: string, sessionTitle?: string, allowSessionSelect = false) => {
    const fallbackSession = nonCancelledSessions.find(s => !getSessionFeedbackStatusInfo(s).isOpen) || nonCancelledSessions[0];
    const targetId = sessionId || fallbackSession?.id || '';
    const targetTitle = sessionTitle || fallbackSession?.title || '';

    setReopenModal({
      isOpen: true,
      allowSessionSelect,
      sessionId: targetId,
      sessionTitle: targetTitle,
      hours: 24,
      reason: DEFAULT_REOPEN_REASON,
      isSubmitting: false,
      error: null
    });
  };

  const handleConfirmReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenModal.sessionId) {
      setReopenModal(prev => ({ ...prev, error: 'Vui lòng chọn buổi sinh hoạt cần mở lại góp ý.' }));
      return;
    }
    if (!reopenModal.reason.trim()) {
      setReopenModal(prev => ({ ...prev, error: 'Vui lòng cung cấp lý do mở lại biểu mẫu góp ý.' }));
      return;
    }

    setReopenModal(prev => ({ ...prev, isSubmitting: true, error: null }));
    try {
      const res = await reopenFeedbackWindow(reopenModal.sessionId, reopenModal.hours, reopenModal.reason.trim());
      if (res.success) {
        setSuccessBanner(res.message);
        setReopenModal(prev => ({ ...prev, isOpen: false }));
        await Promise.all([reloadSessions(), loadData()]);
      } else {
        setReopenModal(prev => ({ ...prev, error: res.message || 'Không thể mở lại thời hạn góp ý.' }));
      }
    } catch (err: any) {
      setReopenModal(prev => ({ ...prev, error: err.message || 'Lỗi kết nối khi mở lại thời hạn.' }));
    } finally {
      setReopenModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const effectiveSessionIdForCompliance = sessionFilter !== 'all'
    ? sessionFilter
    : (nonCancelledSessions.length > 0 ? nonCancelledSessions[0].id : null);

  const loadComplianceData = useCallback(async () => {
    if (!effectiveSessionIdForCompliance) {
      setSessionStatusData(null);
      return;
    }
    setIsLoadingCompliance(true);
    setComplianceError(null);
    try {
      const res = await api.penalties.getSessionStatus(effectiveSessionIdForCompliance);
      if (res.success) {
        setSessionStatusData(res);
      } else {
        setComplianceError('Không thể tải thông tin chấp hành quy chế.');
      }
    } catch (err: any) {
      setComplianceError(err.message || 'Lỗi kết nối khi tải danh sách vé phạt.');
    } finally {
      setIsLoadingCompliance(false);
    }
  }, [effectiveSessionIdForCompliance]);

  useEffect(() => {
    if (activeTab === 'compliance') {
      loadComplianceData();
    }
  }, [activeTab, loadComplianceData]);

  const handleRevokeConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeModal.ticketId || !revokeModal.reason.trim()) return;

    setRevokeModal(prev => ({ ...prev, isSubmitting: true, error: null }));
    try {
      const res = await api.penalties.revoke(revokeModal.ticketId, revokeModal.reason.trim());
      if (res.success) {
        setSuccessBanner(res.message);
        setRevokeModal(prev => ({ ...prev, isOpen: false }));
        await loadComplianceData();
      } else {
        setRevokeModal(prev => ({ ...prev, error: res.message }));
      }
    } catch (err: any) {
      setRevokeModal(prev => ({ ...prev, error: err.message || 'Lỗi khi hủy vé phạt.' }));
    } finally {
      setRevokeModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const selectedSessionObj = sessionFilter !== 'all' ? sessions.find(s => s.id === sessionFilter) : null;
  const displayedSessionsForStatus = selectedSessionObj ? [selectedSessionObj] : nonCancelledSessions;

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
            Đánh giá chất lượng đào tạo và ý kiến đóng góp từ các thành viên (Ghi nhận định danh thành viên & theo dõi chấp hành quy chế).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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
            onClick={() => {
              reloadSessions().catch(() => {});
              loadData();
            }}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isBnOrAdmin && nonCancelledSessions.length > 0 && (
            <button
              onClick={() => {
                if (selectedSessionObj && selectedSessionObj.status !== 'cancelled') {
                  handleOpenReopenModal(selectedSessionObj.id, selectedSessionObj.title, false);
                } else {
                  handleOpenReopenModal(undefined, undefined, true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Mở lại góp ý</span>
            </button>
          )}
        </div>
      </div>

      {successBanner && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-[11px] text-emerald-400 hover:text-emerald-200 font-semibold shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Feedback Window Lifecycle & Reopen Control Panel */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>Trạng thái Cổng Góp ý Sau Buổi</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Tự động mở ngay khi kết thúc buổi · Duy trì 24 giờ
          </span>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-3.5 flex items-start gap-2.5 text-xs text-blue-200">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-slate-300">
            <strong className="text-blue-300">Thời điểm mở tự động:</strong> Form góp ý tự động mở ngay tại mốc <strong>giờ kết thúc buổi sinh hoạt</strong> (<code className="font-mono text-blue-300">endTime</code>) và tiếp nhận đánh giá trong <strong>24 giờ</strong>. Sau khi hết hạn hoặc khi muốn mở sớm/gia hạn thêm, Admin / BCN bấm <strong className="text-white">"Mở lại góp ý"</strong> để mở ngay lập tức.
          </p>
        </div>

        {displayedSessionsForStatus.length === 0 ? (
          <div className="text-xs text-slate-500 py-3 text-center">
            Chưa có phiên sinh hoạt nào khả dụng để cấu hình cổng góp ý.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {displayedSessionsForStatus.map((s) => {
              const statusInfo = getSessionFeedbackStatusInfo(s);
              return (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white truncate">
                        {s.title}
                      </span>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>{s.date} ({s.startTime} - {s.endTime})</span>
                      </span>
                      <span>
                        Mở tự động lúc: <strong className="text-slate-200 font-mono">{s.endTime} {s.date}</strong>
                      </span>
                      {statusInfo.deadline && (
                        <span>
                          Hạn đóng: <strong className="text-slate-200 font-mono">{new Date(statusInfo.deadline).toLocaleString('vi-VN')}</strong>
                        </span>
                      )}
                    </div>
                    {s.feedbackStatus === 'reopened' && s.feedbackReopenedBy && (
                      <div className="text-[11px] text-blue-300/90">
                        Mở lại bởi <strong>{s.feedbackReopenedBy}</strong>
                        {s.feedbackReopenReason ? ` · Lý do: ${s.feedbackReopenReason}` : ''}
                      </div>
                    )}
                  </div>

                  {isBnOrAdmin && s.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleOpenReopenModal(s.id, s.title, false)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition border ${
                        statusInfo.isOpen
                          ? 'bg-slate-800 text-blue-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500'
                      }`}
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      <span>{statusInfo.isOpen ? 'Gia hạn góp ý' : 'Mở lại góp ý'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('feedbacks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'feedbacks'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Ý kiến Đánh giá ({feedbacks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'compliance'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Theo dõi Chuyên cần & Vé phạt</span>
        </button>
      </div>

      {activeTab === 'feedbacks' ? (
        <>
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
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 bg-blue-500/15 border border-blue-500/30 px-3 py-1 rounded-full">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    <span>{fb.memberName || 'Thành viên CLB'}</span>
                    {fb.studentId && <span className="font-mono text-slate-400">({fb.studentId})</span>}
                    {fb.unit && <span className="text-emerald-400 font-bold ml-1">· Ban {fb.unit}</span>}
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
      </>
      ) : (
        /* Compliance & Penalty Tracker Tab */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>Theo dõi Chấp hành Đánh giá Sinh hoạt & Vé phạt Vi phạm</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Quy chế bắt buộc: Thành viên tham dự phải hoàn thành đánh giá trước khi form đóng. Trước đóng 1 ngày (24 giờ), hệ thống gửi email cảnh báo. Nếu hết hạn không gửi sẽ nhận 1 vé phạt.
              </p>
            </div>

            <button
              type="button"
              onClick={loadComplianceData}
              disabled={isLoadingCompliance}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingCompliance ? 'animate-spin' : ''}`} />
              <span>Cập nhật</span>
            </button>
          </div>

          {isLoadingCompliance ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500 text-xs">
              Đang tải danh sách thành viên tham dự và trạng thái vé phạt...
            </div>
          ) : !sessionStatusData ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500 text-xs">
              Vui lòng chọn một phiên sinh hoạt cụ thể để xem danh sách chi tiết.
            </div>
          ) : (
            <div className="space-y-6">
              {/* 4 Summary Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Tổng người dự</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {sessionStatusData.totalAttendees}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-[11px] text-emerald-400 font-semibold uppercase">Đã gửi đánh giá</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {sessionStatusData.submittedCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-[11px] text-amber-400 font-semibold uppercase">Chưa gửi đánh giá</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                    {sessionStatusData.unsubmittedCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-[11px] text-rose-400 font-semibold uppercase">Vé phạt hiệu lực</div>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    {sessionStatusData.penalizedCount}
                  </div>
                </div>
              </div>

              {/* Status info bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>Phiên: <strong className="text-white">{sessionStatusData.sessionTitle}</strong></span>
                  <span>·</span>
                  <span>Form: <strong className={sessionStatusData.feedbackStatus === 'closed' ? 'text-rose-400' : 'text-emerald-400'}>
                    {sessionStatusData.feedbackStatus === 'closed' ? 'Đã đóng' : 'Đang mở'}
                  </strong></span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>Hạn chót: <strong className="font-mono text-slate-200">{sessionStatusData.feedbackDeadline ? new Date(sessionStatusData.feedbackDeadline).toLocaleString('vi-VN') : 'N/A'}</strong></span>
                  {sessionStatusData.warningSentAt && (
                    <span className="text-amber-400">· Cảnh báo 24h: {new Date(sessionStatusData.warningSentAt).toLocaleString('vi-VN')}</span>
                  )}
                </div>
              </div>

              {/* Attendees Compliance Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Thành viên</th>
                      <th className="py-3 px-3">MSSV / Ban</th>
                      <th className="py-3 px-3">Điểm danh</th>
                      <th className="py-3 px-3">Đánh giá sinh hoạt</th>
                      <th className="py-3 px-3">Cảnh báo Email 24h</th>
                      <th className="py-3 px-3">Vé phạt quy chế</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {sessionStatusData.attendees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          Chưa có ghi nhận tham dự nào cho buổi sinh hoạt này.
                        </td>
                      </tr>
                    ) : (
                      sessionStatusData.attendees.map((att: any) => (
                        <tr key={att.memberId} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{att.memberName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{att.memberEmail}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-mono text-slate-300">{att.studentId}</div>
                            {att.unit && (
                              <span className="text-[10px] font-bold text-blue-400">Ban {att.unit}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              att.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {att.attendanceStatus === 'present' ? 'Có mặt' : 'Đi trễ'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {att.hasSubmitted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Đã nộp</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                <AlertCircle className="h-3 w-3" />
                                <span>Chưa nộp</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-400">
                            {att.warningSentAt ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>Đã gửi ({new Date(att.warningSentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})</span>
                              </span>
                            ) : (
                              <span className="text-slate-500">Chưa đến hạn / Đã nộp</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {att.penaltyTicket ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="font-mono text-xs font-bold text-rose-400">
                                    {att.penaltyTicket.ticketCode}
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                    att.penaltyTicket.status === 'active' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                    att.penaltyTicket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                    'bg-slate-700 text-slate-400'
                                  }`}>
                                    {att.penaltyTicket.status === 'active' ? 'Có hiệu lực' : att.penaltyTicket.status === 'resolved' ? 'Đã gỡ' : 'Đã hủy'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 truncate max-w-xs">
                                  {att.penaltyTicket.reason}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500">Không vi phạm</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {att.penaltyTicket && att.penaltyTicket.status === 'active' && isBnOrAdmin && (
                              <button
                                type="button"
                                onClick={() => setRevokeModal({
                                  isOpen: true,
                                  ticketId: att.penaltyTicket.id,
                                  ticketCode: att.penaltyTicket.ticketCode,
                                  memberName: att.memberName,
                                  reason: 'Ban Chủ nhiệm xem xét lý do bất khả kháng hợp lệ',
                                  isSubmitting: false,
                                  error: null
                                })}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-[11px] font-semibold transition"
                              >
                                Hủy vé phạt
                              </button>
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
        </div>
      )}

      {/* Reopen Feedback Modal */}
      {reopenModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Mở lại Biểu mẫu Góp ý</span>
              </h3>
              {!reopenModal.allowSessionSelect && (
                <p className="text-xs text-slate-400 mt-1">
                  Mở và gia hạn tiếp nhận phản hồi cho buổi: <strong className="text-slate-200">{reopenModal.sessionTitle}</strong>
                </p>
              )}
            </div>

            {reopenModal.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {reopenModal.error}
              </div>
            )}

            <form onSubmit={handleConfirmReopen} className="space-y-4">
              {reopenModal.allowSessionSelect && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chọn phiên sinh hoạt cần mở góp ý *
                  </label>
                  <select
                    value={reopenModal.sessionId}
                    onChange={(e) => {
                      const picked = nonCancelledSessions.find(s => s.id === e.target.value);
                      setReopenModal(prev => ({
                        ...prev,
                        sessionId: e.target.value,
                        sessionTitle: picked?.title || ''
                      }));
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {nonCancelledSessions.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.date} · {getSessionFeedbackStatusInfo(s).label})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thời gian mở / gia hạn thêm (Giờ) *
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
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Hạn đóng mới dự kiến: <strong className="text-blue-300 font-mono">{new Date(Date.now() + reopenModal.hours * 3600 * 1000).toLocaleString('vi-VN')}</strong>
                </span>
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
                  {reopenModal.isSubmitting ? 'Đang mở...' : 'Xác nhận mở góp ý'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Penalty Ticket Modal */}
      {revokeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                <span>Hủy Vé Phạt Kỷ Luật</span>
              </h3>
              <button
                type="button"
                onClick={() => setRevokeModal(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Thành viên: <strong className="text-white">{revokeModal.memberName}</strong></div>
              <div>Mã vé phạt: <strong className="font-mono text-rose-400">{revokeModal.ticketCode}</strong></div>
            </div>

            {revokeModal.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {revokeModal.error}
              </div>
            )}

            <form onSubmit={handleRevokeConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lý do hủy / ân xá vé phạt (Bắt buộc) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={revokeModal.reason}
                  onChange={(e) => setRevokeModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Nhập lý do chính đáng chấp thuận miễn trừ vé phạt..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRevokeModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={revokeModal.isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50 transition"
                >
                  {revokeModal.isSubmitting ? 'Đang xử lý...' : 'Xác nhận Hủy vé'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
