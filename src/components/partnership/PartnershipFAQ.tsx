// BK-IC Digital Hub — Companion Project FAQs (Accessible Accordion)
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { COMPANION_FAQS } from '../../data/partnershipData';

export const PartnershipFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(COMPANION_FAQS[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-sky-50/20 to-white relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>GIẢI ĐÁP CHO SINH VIÊN</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight">
            Câu Hỏi Thường Gặp Về Dự Án Đồng Hành
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Giải đáp chi tiết các thắc mắc phổ biến của các bạn sinh viên và nhóm tác giả khi đăng ký nhận đồng hành từ CLB BK-IC.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {COMPANION_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const contentId = `faq-content-${faq.id}`;
            const buttonId = `faq-btn-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#38BDF8] bg-white shadow-md shadow-sky-500/5'
                    : 'border-slate-200/90 bg-white/80 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleAccordion(faq.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleAccordion(faq.id);
                    }
                  }}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${
                    isOpen ? 'text-[#0284C7]' : 'text-[#10182D]'
                  }`}>
                    {faq.question}
                  </span>

                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-sky-50 text-[#0284C7] rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
