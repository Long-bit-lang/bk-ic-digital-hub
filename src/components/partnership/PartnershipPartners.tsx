// BK-IC Digital Hub — Companion Project Incubator Intake Status
// Transparent open intake announcement for new student cohorts & project founders
import React from 'react';
import { Rocket, Sparkles, CheckCircle, Users, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface PartnershipPartnersProps {
  onRequestClick?: () => void;
}

export const PartnershipPartners: React.FC<PartnershipPartnersProps> = ({ onRequestClick }) => {
  return (
    <section className="py-16 md:py-24 bg-white relative" id="incubator-status">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>TRẠNG THÁI TIẾP NHẬN 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Cổng Tiếp nhận &amp; Ươm tạo Dự án Sáng tạo
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            BK-IC đang chính thức mở đơn tiếp nhận các dự án, ý tưởng công nghệ và đề tài nghiên cứu từ sinh viên, nhóm nghiên cứu trẻ Trường ĐH Bách khoa – ĐHĐN để đồng hành và hỗ trợ phát triển.
          </p>
        </div>

        {/* Status Callout & Transparent Notice */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border border-sky-200 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#075985]">
                  Đợt Tuyển chọn Dự án Khoá 2026
                </h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Đang mở tiếp nhận hồ sơ trực tuyến
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono text-left sm:text-right">
              Phi lợi nhuận • 100% Miễn phí
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2">
              <div className="font-bold text-[#075985] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0284C7]" />
                <span>Bảo lưu 100% Bản quyền</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Toàn bộ mã nguồn, tài sản trí tuệ và mô hình kinh doanh hoàn toàn thuộc quyền sở hữu của nhóm tác giả sinh viên.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2">
              <div className="font-bold text-[#075985] flex items-center gap-2">
                <Users className="h-4 w-4 text-[#0284C7]" />
                <span>Đồng hành Linh hoạt</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Hỗ trợ cả dự án cá nhân lẫn nhóm sinh viên đa ngành (CNTT, Điện tử, Cơ khí, Kinh tế, Xây dựng).
              </p>
            </div>
          </div>

          {/* Transparent Notice Note */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lưu ý minh bạch từ Ban Chủ nhiệm: </span>
              <span>
                Hiện tại Câu lạc bộ đang trong giai đoạn tiếp nhận hồ sơ các dự án mới năm 2026 và chưa công bố danh sách dự án bảo trợ dài hạn chính thức nào trên cổng dữ liệu. Khi các dự án hoàn thành quy trình ươm tạo, danh mục sẽ được cập nhật công khai tại Catalogue Dự án.
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Thời gian phản hồi hồ sơ: 3 – 5 ngày làm việc
            </div>

            <button
              type="button"
              onClick={onRequestClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Nộp hồ sơ dự án ngay</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
