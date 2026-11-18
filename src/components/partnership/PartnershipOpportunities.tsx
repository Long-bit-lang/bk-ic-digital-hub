// BK-IC Digital Hub — Companion Project Intake Criteria & Focus Fields
import React from 'react';
import { ArrowRight, CheckCircle2, Target, Cpu, Sparkles } from 'lucide-react';
import { COMPANION_CRITERIA, COMPANION_FIELDS } from '../../data/partnershipData';

interface PartnershipOpportunitiesProps {
  onSelectType?: (typeKey: string) => void;
  selectedType?: string;
  onRequestClick?: () => void;
}

export const PartnershipOpportunities: React.FC<PartnershipOpportunitiesProps> = ({
  onRequestClick
}) => {
  return (
    <section id="criteria" className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/30 to-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Intake Criteria */}
        <div className="space-y-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
              <Target className="h-3.5 w-3.5" />
              <span>TIÊU CHÍ TIẾP NHẬN</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
              Dự án Nào Phù hợp để Đồng hành Cùng BK-IC?
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Chúng tôi tìm kiếm những nhóm sinh viên có niềm đam mê chế tạo công nghệ, mong muốn giải quyết những vấn đề thực tiễn và sẵn sàng dấn thân trải nghiệm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANION_CRITERIA.map((criterion) => {
              const Icon = criterion.icon;

              return (
                <div
                  key={criterion.id}
                  className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-[#0284C7] bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full uppercase">
                        {criterion.tag}
                      </span>
                      <div className="h-10 w-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#10182D] leading-snug">
                      {criterion.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {criterion.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Đạt tiêu chuẩn</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: 5 Focus Technology Fields */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 border border-sky-200/80 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#0284C7] border border-sky-200 shadow-2xs">
              <Cpu className="h-3.5 w-3.5" />
              <span>LĨNH VỰC CÔNG NGHỆ</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#075985]">
              5 Lĩnh vực Công nghệ Trọng tâm
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              BK-IC ưu tiên hỗ trợ các nhóm dự án sáng tạo thuộc các nhóm lĩnh vực sau, đồng thời luôn sẵn sàng chào đón các ý tưởng đột phá khác:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPANION_FIELDS.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#38BDF8] transition space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#10182D]">
                      {field.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {field.description}
                  </p>
                </div>
              );
            })}

            {/* Other Fields Card */}
            <div className="p-5 rounded-2xl bg-white/70 border border-dashed border-sky-300 flex flex-col justify-center items-center text-center space-y-2">
              <Sparkles className="h-6 w-6 text-[#0284C7]" />
              <h4 className="text-sm font-bold text-[#075985]">Lĩnh vực Đột phá Khác</h4>
              <p className="text-xs text-slate-500">
                Bất kỳ giải pháp công nghệ sáng tạo nào xuất phát từ bài toán thực tế của bạn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
