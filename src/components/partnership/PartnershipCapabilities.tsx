// BK-IC Digital Hub — Student Capability Development Section
// Outlines Hard Skills and Soft Skills orientation supported by BK-IC
import React from 'react';
import { STUDENT_CAPABILITY_GROUPS } from '../../data/partnershipData';
import { CheckCircle2, Cpu, Mic, Sparkles, BookOpen } from 'lucide-react';

export const PartnershipCapabilities: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-sky-50/20 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>NỀN TẢNG BỒI DƯỠNG</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10182D] tracking-tight sm:whitespace-nowrap">
            Định hướng Hỗ trợ Phát triển Năng lực Sinh viên
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            BK-IC tập trung vào định hướng hỗ trợ và phát triển hai nhóm năng lực thiết yếu cho sinh viên kỹ thuật Trường Đại học Bách khoa – ĐHĐN; tạo tiền đề vững chắc để các bạn tự tin hiện thực hóa các sáng kiến công nghệ.
          </p>
        </div>

        {/* 2 Capability Cards: Hard Skills & Soft Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STUDENT_CAPABILITY_GROUPS.map((group) => {
            const Icon = group.icon;
            const isHardSkills = group.id === 'hard-skills';

            return (
              <div
                key={group.id}
                className="flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-[#0284C7] bg-sky-50 border border-sky-100 px-3 py-1 rounded-full uppercase">
                      {group.category}
                    </span>

                    <div className="h-11 w-11 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                    {group.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {group.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nội dung trọng tâm định hướng rèn luyện:
                    </p>

                    <ul className="space-y-2.5">
                      {group.skills.map((skill, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                          <span className="leading-snug font-medium">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 italic">
                  * Định hướng bồi dưỡng phong trào sinh viên thông qua các buổi sinh hoạt chuyên môn, workshop và đấu trường khởi nghiệp thực tế.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
