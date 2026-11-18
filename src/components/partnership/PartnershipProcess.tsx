// BK-IC Digital Hub — 5-Step Partnership Process Timeline
import React from 'react';
import { ArrowRight, Info, Check } from 'lucide-react';
import { PARTNERSHIP_PROCESS_STEPS } from '../../data/partnershipData';

export const PartnershipProcess: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <span>LỘ TRÌNH LÀM VIỆC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Bắt đầu hành trình hợp tác
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Quy trình tiếp nhận và phối hợp được tối ưu hóa để đảm bảo sự minh bạch, nhanh chóng và hiệu quả cao nhất cho cả hai bên.
          </p>
        </div>

        {/* 5-Step Responsive Timeline */}
        <div className="relative">
          {/* Desktop Connecting Line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 -translate-y-6 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 relative z-10">
            {PARTNERSHIP_PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300"
              >
                {/* Step Circle Badge */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-sky-500/20 mb-4 shrink-0">
                  {step.step}
                </div>

                <h3 className="text-base font-bold text-[#10182D] leading-snug">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                <p className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reassurance Callout */}
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-sky-50/80 border border-sky-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
          <Info className="h-5 w-5 text-[#0284C7] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Sau khi tiếp nhận đề xuất, Ban Chủ nhiệm sẽ xem xét và chủ động liên hệ với bạn theo thông tin đã cung cấp trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    </section>
  );
};

