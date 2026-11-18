// BK-IC Digital Hub — Verified Real Club Activities
// Strictly verified real events: BK Shark 2026 & Cuộc thi CĐS Liên Chiểu 2026
import React from 'react';
import { Quote, Sparkles, CheckCircle2, Award, Calendar } from 'lucide-react';
import { PARTNERSHIP_STORIES } from '../../data/partnershipData';

export const PartnershipStories: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/20 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Award className="h-3.5 w-3.5" />
            <span>KINH NGHIỆM ĐÃ XÁC NHẬN</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Các Hoạt động Trọng tâm BK-IC Đã Đồng Tổ chức
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Minh chứng năng lực triển khai thực tế thông qua các chương trình đổi mới sáng tạo và chuyển đổi số được BK-IC đồng hành tổ chức cùng các tổ chức và đơn vị uy tín.
          </p>
        </div>

        {/* 2 Verified Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PARTNERSHIP_STORIES.map((story) => (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-6"
            >
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-bold tracking-wider text-[#0284C7] bg-sky-50 border border-sky-100 px-3 py-1 rounded-full uppercase">
                  {story.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-[#10182D] leading-snug">
                  {story.activityTitle}
                </h3>

                <p className="text-xs font-semibold text-slate-500">
                  Đơn vị đồng hành: <span className="text-[#075985] font-bold">{story.partnerName}</span>
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Vai trò &amp; Mục tiêu: </span>
                    <span className="leading-relaxed">{story.objective}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#075985]">Kết quả đạt được: </span>
                      <span className="leading-relaxed">{story.outcome}</span>
                    </div>
                  </div>
                </div>

                {story.quote && (
                  <div className="pt-3 text-xs italic text-slate-500 flex items-start gap-2.5 border-t border-slate-100">
                    <Quote className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p>"{story.quote}"</p>
                      {story.quoteAuthor && (
                        <p className="mt-1 font-semibold text-[11px] not-italic text-slate-400">
                          — {story.quoteAuthor}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                <span>Hoạt động thực tế đã diễn ra</span>
                <span className="inline-flex items-center gap-1 text-slate-400 font-normal">
                  Năm 2026
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
