// BK-IC Digital Hub — 4-Step Companion Project Incubation Roadmap
import React from 'react';
import { ArrowRight, Info, Check, GitCommit, Sparkles } from 'lucide-react';
import { COMPANION_PROCESS_STEPS } from '../../data/partnershipData';

export const PartnershipProcess: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative" id="process">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <GitCommit className="h-3.5 w-3.5" />
            <span>LỘ TRÌNH ƯƠM TẠO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Quy trình 4 Bước Đồng hành Cùng Dự án Sinh viên
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Lộ trình hỗ trợ được thiết kế tinh gọn, bám sát thực tế phát triển kỹ thuật và chuẩn hóa kỹ năng thuyết trình dự án cho sinh viên.
          </p>
        </div>

        {/* 4-Step Responsive Timeline */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {COMPANION_PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 space-y-4"
              >
                <div>
                  {/* Step Circle Badge */}
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-black flex items-center justify-center text-sm shadow-md shadow-sky-500/20 mb-4 shrink-0 font-mono">
                    0{step.step}
                  </div>

                  <h3 className="text-lg font-bold text-[#10182D] leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reassurance Callout */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
          <Info className="h-5 w-5 text-[#0284C7] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-normal">
            Sau khi nhận được hồ sơ dự án qua form trực tuyến, Ban Chuyên môn và Ban Chủ nhiệm BK-IC sẽ tiến hành đánh giá sơ bộ và chủ động liên hệ với trưởng nhóm qua email/điện thoại để xếp lịch trao đổi trực tiếp.
          </p>
        </div>
      </div>
    </section>
  );
};
