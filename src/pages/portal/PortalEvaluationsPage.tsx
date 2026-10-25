// BK-IC Member Evaluations Result Page
import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle,
  FileText
} from 'lucide-react';

export const PortalEvaluationsPage: React.FC = () => {
  const { currentUser, evaluations } = useApp();

  if (!currentUser) return null;

  // Filter only this member's evaluations (privacy guarantee)
  const myEvaluations = evaluations.filter(e => e.memberId === currentUser.id);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cổng Thành viên
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kết quả Đánh giá Hoạt động & Điểm Rèn luyện
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi điểm số định kỳ được tính toán theo Quy chế quản lý thành viên BK-IC.
        </p>
      </div>

      {/* Explanation of Scoring Policy (Section 10) */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <span>Quy chế Phân bổ Điểm Đánh giá (Thang 10)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4">
            <div className="text-xs text-blue-800 font-semibold">01. Chuyên cần (Attendance)</div>
            <div className="text-2xl font-bold font-mono text-blue-900 mt-1">Tối đa 4.0đ</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Tính tự động dựa trên số buổi có mặt đúng giờ qua mã QR. Trừ điểm đối với đi muộn hoặc vắng không phép.
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4">
            <div className="text-xs text-indigo-800 font-semibold">02. Cống hiến (Contribution)</div>
            <div className="text-2xl font-bold font-mono text-indigo-900 mt-1">Tối đa 4.0đ</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Mức độ đóng góp vào tiến độ dự án kỹ thuật, hỗ trợ tổ chức sự kiện và chia sẻ kiến thức chuyên môn.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
            <div className="text-xs text-emerald-800 font-semibold">03. Trách nhiệm (Responsibility)</div>
            <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">Tối đa 2.0đ</div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Tuân thủ deadline, văn hóa giao tiếp, tinh thần đồng đội và giữ gìn hình ảnh của CLB và DUT.
            </p>
          </div>
        </div>
      </div>

      {/* Evaluations List */}
      <div className="space-y-6">
        {myEvaluations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400 text-xs">
            Học kỳ hiện tại chưa hoàn tất chu kỳ đánh giá hoặc phiếu đánh giá đang ở trạng thái chấm nháp (Draft).
          </div>
        ) : (
          myEvaluations.map((ev) => (
            <div
              key={ev.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    Học kỳ: {ev.semester}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Bảng điểm Đánh giá Hoạt động
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Tổng điểm rèn luyện</div>
                  <div className="text-3xl font-extrabold font-mono text-blue-600 tabular-nums">
                    {ev.totalScore} <span className="text-base text-slate-400 font-normal">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Chuyên cần & Điểm danh</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    {ev.attendanceScore} <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Đóng góp Dự án & Chuyên môn</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    {ev.contributionScore} <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Trách nhiệm & Thái độ</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    {ev.responsibilityScore} <span className="text-xs text-slate-400 font-normal">/ 2.0</span>
                  </div>
                </div>
              </div>

              {/* Evaluator Comments */}
              {ev.comments && (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900">
                    Nhận xét chi tiết từ Người đánh giá ({ev.evaluatorName}):
                  </div>
                  <p className="leading-relaxed text-slate-600">
                    "{ev.comments}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                <div>
                  Người duyệt cuối: <strong className="text-slate-600">{ev.approvedBy || 'Ban Chủ nhiệm CLB'}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Điểm đã khóa chính thức & chuyển về Nhà trường</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
