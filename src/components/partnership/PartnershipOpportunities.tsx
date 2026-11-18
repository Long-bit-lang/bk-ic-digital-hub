// BK-IC Digital Hub — Partnership Opportunities Section (6 Strategic Categories)
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PARTNERSHIP_OPPORTUNITIES } from '../../data/partnershipData';

interface PartnershipOpportunitiesProps {
  onSelectType: (typeKey: string) => void;
  selectedType?: string;
}

export const PartnershipOpportunities: React.FC<PartnershipOpportunitiesProps> = ({
  onSelectType,
  selectedType
}) => {
  return (
    <section id="opportunities" className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/30 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <span>HÌNH THỨC HỢP TÁC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Tìm kiếm hình thức hợp tác phù hợp
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Mỗi đối tác có thế mạnh và mục tiêu riêng. BK-IC sẵn sàng trao đổi để xây dựng phương án đồng hành phù hợp với nhu cầu của từng đơn vị.
          </p>
        </div>

        {/* 6 Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PARTNERSHIP_OPPORTUNITIES.map((opp) => {
            const Icon = opp.icon;
            const isCurrentSelected = selectedType === opp.typeKey;

            return (
              <div
                key={opp.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-white p-7 border transition-all duration-300 ${
                  isCurrentSelected
                    ? 'border-[#0284C7] ring-2 ring-sky-400/30 shadow-lg shadow-sky-500/10 -translate-y-1'
                    : 'border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider text-slate-400">
                      {opp.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#10182D]">
                    {opp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Target Audience */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Đối tượng: </span>
                    <span>{opp.targetAudience}</span>
                  </div>

                  {/* Partner Benefits */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                      Giá trị đối tác nhận được:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {opp.partnerBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                          <span className="leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Select Button */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectType(opp.typeKey)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isCurrentSelected
                        ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/20'
                        : 'bg-sky-50 text-[#0284C7] hover:bg-[#0284C7] hover:text-white'
                    }`}
                  >
                    <span>{isCurrentSelected ? 'Đã chọn hình thức này' : 'Chọn hình thức này'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

