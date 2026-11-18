// BK-IC Digital Hub — Partnership Stories Section (Verified Real Activities)
import React from 'react';
import { Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { PARTNERSHIP_STORIES } from '../../data/partnershipData';

export const PartnershipStories: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/20 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KẾT QUẢ THỰC TẾ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Dấu ấn từ những kết nối
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Những chương trình và dự án tiêu biểu được ươm tạo từ sự đồng hành trách nhiệm và tâm huyết giữa BK-IC với các chuyên gia và tổ chức.
          </p>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PARTNERSHIP_STORIES.map((story) => (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-2xl bg-white p-7 border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-bold tracking-wider text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-lg">
                  {story.category}
                </span>

                <h3 className="text-lg font-bold text-[#10182D] leading-snug">
                  {story.activityTitle}
                </h3>

                <p className="text-xs font-semibold text-slate-500">
                  Đơn vị đồng hành: <span className="text-[#075985] font-bold">{story.partnerName}</span>
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Mục tiêu: </span>
                    <span>{story.objective}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Kết quả: </span>
                      <span>{story.outcome}</span>
                    </div>
                  </div>
                </div>

                {story.quote && (
                  <div className="pt-2 text-xs italic text-slate-500 flex items-start gap-2 border-t border-slate-100">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

