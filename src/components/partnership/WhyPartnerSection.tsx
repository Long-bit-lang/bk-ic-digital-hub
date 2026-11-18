// BK-IC Digital Hub — Companion Project Benefits Section
import React from 'react';
import { COMPANION_BENEFITS } from '../../data/partnershipData';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const WhyPartnerSection: React.FC = () => {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>QUYỀN LỢI ĐỒNG HÀNH</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Quyền lợi Dự án Nhận được khi Đồng hành cùng BK-IC
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            BK-IC mang đến những bệ phóng thiết thực nhất để giúp các nhóm tác giả tự tin mài giũa sản phẩm, rèn luyện kỹ năng và bảo vệ dự án trước các hội đồng giám khảo.
          </p>
        </div>

        {/* 5 Companion Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COMPANION_BENEFITS.map((item) => {
            const Icon = item.icon;
            const isPrimary = item.isPrimary;

            return (
              <div
                key={item.id}
                className={`group relative p-7 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isPrimary
                    ? 'bg-gradient-to-br from-sky-50/80 via-white to-blue-50/40 border-sky-300/80 shadow-md shadow-sky-500/10 ring-1 ring-sky-300/60 lg:col-span-1'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-2xs ${
                        isPrimary
                          ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                          : 'bg-sky-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        isPrimary
                          ? 'bg-[#0284C7] text-white'
                          : 'text-[#0284C7] bg-sky-50 border border-sky-100'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-lg sm:text-xl font-bold transition-colors ${
                      isPrimary ? 'text-[#075985]' : 'text-[#10182D] group-hover:text-[#0284C7]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                        <span className="leading-snug">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0284C7]">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Bảo trợ &amp; Hỗ trợ toàn diện →
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
