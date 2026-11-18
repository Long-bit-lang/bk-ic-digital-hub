// BK-IC Digital Hub — Current Partners Showcase
// Grouped into 3 verified tiers from HOME_PARTNERS_DATA
import React from 'react';
import { ExternalLink, ShieldCheck, Award, Handshake } from 'lucide-react';
import { HOME_PARTNERS_DATA } from '../../data/homeData';

export const PartnershipPartners: React.FC = () => {
  const patronPartners = HOME_PARTNERS_DATA.filter(p => p.category === 'Đơn vị bảo trợ');
  const strategicPartners = HOME_PARTNERS_DATA.filter(p => p.category === 'Đối tác chiến lược');
  const companionPartners = HOME_PARTNERS_DATA.filter(p => p.category === 'Đối tác đồng hành');

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <span>MẠNG LƯỚI HỢP TÁC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Đối tác đồng hành cùng BK-IC
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Sự kết nối và đồng hành từ các đơn vị là nguồn lực quan trọng để BK-IC phát triển những hoạt động đổi mới sáng tạo dành cho sinh viên.
          </p>
        </div>

        {/* 3 Tier Showcases */}
        <div className="space-y-12">
          {/* Tier 1: Đơn vị bảo trợ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="h-5 w-5 text-[#0284C7]" />
              <h3 className="text-base font-bold text-[#10182D] uppercase tracking-wide">
                Đơn vị bảo trợ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patronPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-16 flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-sky-50/50 transition-colors">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#10182D] group-hover:text-[#0284C7] transition-colors flex items-center justify-between gap-1">
                        <span>{partner.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#0284C7]" />
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tier 2: Đối tác chiến lược */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="h-5 w-5 text-[#0284C7]" />
              <h3 className="text-base font-bold text-[#10182D] uppercase tracking-wide">
                Đối tác chiến lược
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {strategicPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-16 flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-sky-50/50 transition-colors">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#10182D] group-hover:text-[#0284C7] transition-colors flex items-center justify-between gap-1">
                        <span>{partner.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#0284C7]" />
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tier 3: Đối tác đồng hành */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Handshake className="h-5 w-5 text-[#0284C7]" />
              <h3 className="text-base font-bold text-[#10182D] uppercase tracking-wide">
                Đối tác đồng hành
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {companionPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-14 flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-sky-50/50 transition-colors">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#10182D] group-hover:text-[#0284C7] transition-colors flex items-center justify-between gap-1">
                        <span>{partner.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#0284C7]" />
                      </h4>
                      <p className="mt-1 text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

