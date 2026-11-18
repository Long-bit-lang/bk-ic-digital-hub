// BK-IC Digital Hub — Why Partner with BK-IC Section
import React from 'react';
import { WHY_PARTNER_CARDS } from '../../data/partnershipData';
import { Sparkles, Users } from 'lucide-react';

export const WhyPartnerSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>GIÁ TRỊ ĐỒNG HÀNH</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Tại sao Doanh nghiệp &amp; Tổ chức nên Kết nối cùng BK-IC?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Giá trị cốt lõi lớn nhất BK-IC mang lại cho Quý đối tác là cơ hội tiếp cận trực tiếp nguồn nhân lực trẻ, đam mê công nghệ và có tư duy chủ động giải quyết vấn đề từ Trường Đại học Bách khoa – ĐHĐN.
          </p>
        </div>

        {/* 4 Value Cards Grid with Primary Emphasis on Young Talent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
          {WHY_PARTNER_CARDS.map((item) => {
            const Icon = item.icon;
            const isPrimary = item.isPrimary;

            return (
              <div
                key={item.id}
                className={`group relative p-7 sm:p-9 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isPrimary
                    ? 'bg-gradient-to-br from-sky-50/80 via-white to-blue-50/40 border-sky-300/80 shadow-md shadow-sky-500/10 ring-1 ring-sky-300/60'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-2xs ${
                        isPrimary
                          ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                          : 'bg-sky-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span
                      className={`text-[11px] font-bold tracking-wider px-3 py-0.5 rounded-full ${
                        isPrimary
                          ? 'bg-[#0284C7] text-white'
                          : 'text-slate-400 group-hover:text-[#0284C7] bg-slate-50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold transition-colors ${
                      isPrimary ? 'text-[#075985]' : 'text-[#10182D] group-hover:text-[#0284C7]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0284C7]">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Đồng hành cùng sinh viên Bách khoa →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
