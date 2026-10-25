// BK-IC Member Session Feedback Submission Page
import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  EyeOff, 
  Sparkles,
  AlertCircle,
  Clock,
  Edit3,
  Calendar,
  Lock
} from 'lucide-react';
import { api } from '../../services/api';

export const PortalFeedbackPage: React.FC = () => {
  const { sessions, attendance, currentUser } = useApp();

  // Find all sessions where current user had verified attendance (present or late)
  const attendedSessionIds = new Set(
    attendance
      .filter(a => a.memberId === currentUser?.id && (a.status === 'present' || a.status === 'late'))
      .map(a => a.sessionId)
  );

  // Eligible sessions: ended, not cancelled, and attended
  const eligibleSessions = sessions.filter(s => {
    if (s.status === 'cancelled') return false;
    return attendedSessionIds.has(s.id);
  });

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    eligibleSessions.length > 0 ? eligibleSessions[0].id : (sessions.length > 0 ? sessions[0].id : '')
  );

  // 4 Numerical Criteria (1 to 5 integers)
  const [contentQuality, setContentQuality] = useState<number>(5);
  const [delivery, setDelivery] = useState<number>(5);
  const [durationSuitability, setDurationSuitability] = useState<number>(5);
  const [usefulness, setUsefulness] = useState<number>(5);

  // 3 Separate Qualitative Responses
  const [valuableTakeaway, setValuableTakeaway] = useState<string>('');
  const [improvementSuggestion, setImprovementSuggestion] = useState<string>('');
  const [nextTopicIdea, setNextTopicIdea] = useState<string>('');

  // Status & Remote state
  const [sessionFeedbackStatus, setSessionFeedbackStatus] = useState<{
    isEligible: boolean;
    hasSubmitted: boolean;
    isOpen: boolean;
    canEdit: boolean;
    deadline?: string;
    windowReason?: string;
    message?: string;
  }>({
    isEligible: false,
    hasSubmitted: false,
    isOpen: false,
    canEdit: false
  });

  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load member's feedback status for the selected session
  const loadSessionFeedbackStatus = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    setIsLoadingStatus(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await api.feedback.getMyFeedback(sessionId);
      if (res.success) {
        setSessionFeedbackStatus({
          isEligible: res.isEligible,
          hasSubmitted: res.hasSubmitted,
          isOpen: res.isOpen,
          canEdit: res.canEdit,
          deadline: res.deadline,
          windowReason: res.windowReason,
          message: res.message
        });

        // Pre-fill form if existing feedback is found
        if (res.feedback) {
          setContentQuality(res.feedback.contentQuality || 5);
          setDelivery(res.feedback.delivery || 5);
          setDurationSuitability(res.feedback.durationSuitability || 5);
          setUsefulness(res.feedback.usefulness || 5);
          setValuableTakeaway(res.feedback.valuableTakeaway || res.feedback.feedbackText || '');
          setImprovementSuggestion(res.feedback.improvementSuggestion || '');
          setNextTopicIdea(res.feedback.nextTopicIdea || '');
        } else {
          // Reset fields for new session
          setContentQuality(5);
          setDelivery(5);
          setDurationSuitability(5);
          setUsefulness(5);
          setValuableTakeaway('');
          setImprovementSuggestion('');
          setNextTopicIdea('');
        }
      }
    } catch (err: any) {
      console.warn('Error loading feedback status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      loadSessionFeedbackStatus(selectedSessionId);
    }
  }, [selectedSessionId, loadSessionFeedbackStatus]);

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || isSubmitting) return;

    if (!sessionFeedbackStatus.isOpen) {
      setSubmitError('Biểu mẫu phản hồi của phiên này đã đóng, không thể tiếp nhận đánh giá.');
      return;
    }

    if (!sessionFeedbackStatus.isEligible) {
      setSubmitError('Bạn chưa có ghi nhận tham dự phiên sinh hoạt này, không đủ điều kiện gửi đánh giá.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.feedback.submit({
        sessionId: selectedSession.id,
        contentQuality,
        delivery,
        durationSuitability,
        usefulness,
        valuableTakeaway: valuableTakeaway.trim(),
        improvementSuggestion: improvementSuggestion.trim(),
        nextTopicIdea: nextTopicIdea.trim(),
        isAnonymous: true
      });

      if (res.success) {
        setSubmitSuccess(true);
        // Refresh status
        await loadSessionFeedbackStatus(selectedSession.id);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      } else {
        setSubmitError(res.message || 'Không thể lưu phản hồi. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Lỗi kết nối khi gửi phản hồi. Vui lòng kiểm tra lại mạng và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (label: string, value: number, onChange: (val: number) => void, disabled = false) => {
    return (
      <div className="space-y-2 border-b border-slate-100 pb-4">
        <label className="block text-xs font-semibold text-slate-800">
          {label} *
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(star)}
              className={`p-1 transition ${disabled ? 'cursor-not-allowed opacity-60' : 'text-slate-300 hover:text-amber-400'}`}
            >
              <Star
                className={`h-5 w-5 ${
                  star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 font-mono text-xs font-bold text-slate-600">
            {value} / 5
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cổng Thành viên BK-IC
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <span>Góp ý & Đánh giá Sau Phiên Sinh hoạt</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Thu thập phản hồi bảo mật ẩn danh nhằm nâng cao chất lượng nội dung và phương thức tổ chức.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Session Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Chọn Phiên sinh hoạt / Workshop cần đánh giá *
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
          >
            {sessions.map((s) => {
              const attended = attendedSessionIds.has(s.id);
              return (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.date}) {attended ? '— [Đã tham dự]' : '— [Chưa có điểm danh]'}
                </option>
              );
            })}
          </select>
        </div>

        {/* Dynamic Status Banner */}
        {isLoadingStatus ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <Clock className="h-4 w-4 animate-spin text-slate-400" />
            <span>Đang kiểm tra điều kiện và trạng thái biểu mẫu...</span>
          </div>
        ) : !sessionFeedbackStatus.isEligible ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Chưa đủ điều kiện gửi đánh giá</strong>
              <span>
                Theo quy chế, chỉ thành viên có ghi nhận tham dự (có mặt đúng giờ hoặc đi trễ hợp lệ) mới có thể gửi phiếu đánh giá chất lượng phiên sinh hoạt này.
              </span>
            </div>
          </div>
        ) : !sessionFeedbackStatus.isOpen ? (
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
            <Lock className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Biểu mẫu đã đóng hoặc chưa mở</strong>
              <span>
                {sessionFeedbackStatus.message || 'Phiên sinh hoạt này hiện không tiếp nhận thêm đánh giá. Biểu mẫu chỉ mở tự động trong 24 giờ sau khi kết thúc.'}
              </span>
            </div>
          </div>
        ) : sessionFeedbackStatus.hasSubmitted ? (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <Edit3 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Bạn đã gửi phản hồi cho phiên sinh hoạt này</strong>
              <span>
                Biểu mẫu vẫn đang mở (hạn chót: {sessionFeedbackStatus.deadline ? new Date(sessionFeedbackStatus.deadline).toLocaleString('vi-VN') : '24h sau kết thúc'}). Bạn có thể chỉnh sửa lại phản hồi bên dưới và bấm nút <strong>Cập nhật phản hồi</strong>.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Đủ điều kiện gửi góp ý</strong>
              <span>
                Bạn đã được ghi nhận tham dự. Biểu mẫu mở đến: {sessionFeedbackStatus.deadline ? new Date(sessionFeedbackStatus.deadline).toLocaleString('vi-VN') : '24h sau kết thúc'}.
              </span>
            </div>
          </div>
        )}

        {/* Anonymous Security Explanation Banner */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4 flex items-start gap-3">
          <EyeOff className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-xs text-purple-900 space-y-1">
            <strong className="block font-bold">Cơ chế Bảo mật Ẩn danh (Privacy Protected)</strong>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Phiếu góp ý sử dụng mã liên kết ngẫu nhiên (Decoupled Token) tách rời hoàn toàn khỏi danh tính sinh viên. Ban Chủ nhiệm, Ban Điều hành và Quản trị viên chỉ xem được nội dung góp ý khách quan và điểm trung bình, không thể truy vết người gửi.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {submitSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{sessionFeedbackStatus.hasSubmitted ? 'Đã cập nhật phản hồi của bạn thành công!' : 'Đã gửi phản hồi ẩn danh thành công! Cảm ơn đóng góp của bạn.'}</span>
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 4 Numerical Rating Criteria */}
          {renderStarRating(
            '1. Chất lượng nội dung (Tính thời sự, chiều sâu chuyên môn, giá trị kiến thức)',
            contentQuality,
            setContentQuality,
            !sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible
          )}

          {renderStarRating(
            '2. Khả năng truyền đạt (Rõ ràng, lôi cuốn, phương pháp diễn giải dễ hiểu)',
            delivery,
            setDelivery,
            !sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible
          )}

          {renderStarRating(
            '3. Mức độ phù hợp của thời lượng & công tác tổ chức',
            durationSuitability,
            setDurationSuitability,
            !sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible
          )}

          {renderStarRating(
            '4. Tính hữu ích thực tế đối với mục tiêu học tập và đổi mới sáng tạo',
            usefulness,
            setUsefulness,
            !sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible
          )}

          {/* 3 Separate Qualitative Text Fields */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              5. Điều tâm đắc nhất / Giá trị lớn nhất bạn nhận được từ buổi này?
            </label>
            <textarea
              rows={3}
              disabled={!sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible}
              placeholder="Ví dụ: Bài học thực tế về giải quyết bài toán Unit Economics, kỹ năng viết Business Proposal..."
              value={valuableTakeaway}
              onChange={(e) => setValuableTakeaway(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none leading-relaxed disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              6. Đề xuất cải thiện cho các phiên sinh hoạt tiếp theo?
            </label>
            <textarea
              rows={3}
              disabled={!sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible}
              placeholder="Ví dụ: Tăng thêm thời lượng hỏi đáp (Q&A), gửi trước tài liệu slide 24h để nghiên cứu..."
              value={improvementSuggestion}
              onChange={(e) => setImprovementSuggestion(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none leading-relaxed disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              7. Bạn mong muốn CLB tổ chức chuyên đề gì trong thời gian tới?
            </label>
            <input
              type="text"
              disabled={!sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible}
              placeholder="Ví dụ: Kỹ năng thuyết trình Pitching trước Quỹ đầu tư, Trí tuệ nhân tạo tạo sinh (GenAI)..."
              value={nextTopicIdea}
              onChange={(e) => setNextTopicIdea(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {sessionFeedbackStatus.hasSubmitted ? 'Chế độ: Cập nhật phản hồi đã gửi' : 'Chế độ: Gửi phản hồi lần đầu'}
            </span>

            <button
              type="submit"
              disabled={!sessionFeedbackStatus.isOpen || !sessionFeedbackStatus.isEligible || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#245BFA] px-7 py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span>{isSubmitting ? 'Đang gửi phản hồi...' : sessionFeedbackStatus.hasSubmitted ? 'Cập nhật Phản hồi' : 'Gửi phiếu Đánh giá'}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
