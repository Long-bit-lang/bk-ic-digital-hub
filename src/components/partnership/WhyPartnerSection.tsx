// BK-IC Digital Hub — Why Partner with BK-IC Section
import React from 'react';
import { WHY_PARTNER_CARDS } from '../../data/partnershipData';

export const WhyPartnerSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <span>LỢI ÍCH HỢP TÁC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Giá trị từ sự kết nối
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            BK-IC hướng đến xây dựng cầu nối giữa môi trường đại học và hệ sinh thái đổi mới sáng tạo, tạo điều kiện để các nguồn lực cùng tham gia phát triển ý tưởng và giải quyết những bài toán thực tiễn.
          </p>
        </div>

        {/* 4 Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
          {WHY_PARTNER_CARDS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-sky-50 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-2xs">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-[#0284C7] transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#10182D] group-hover:text-[#0284C7] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0284C7]">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Đồng hành kiến tạo giá trị →
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

