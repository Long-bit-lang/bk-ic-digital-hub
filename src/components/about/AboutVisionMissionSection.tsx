// BK-IC About Page — Section 03: Vision & Mission Dual Sculptural Blocks
import React from 'react';
import { Compass, Target, Lightbulb, TrendingUp, Users, Rocket, Sparkles } from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

const MISSION_PILLARS = [
  {
    icon: Users,
    title: 'Kết nối (Connect)',
    desc: 'Xây dựng mạng lưới liên kết giữa sinh viên, giảng viên, chuyên gia, cựu sinh viên và doanh nghiệp.'
  },
  {
    icon: Rocket,
    title: 'Ươm tạo (Incubate)',
    desc: 'Hỗ trợ phát triển các ý tưởng sáng tạo và dự án khởi nghiệp công nghệ tiềm năng.'
  },
  {
    icon: TrendingUp,
    title: 'Phát triển (Develop)',
    desc: 'Nâng cao năng lực nghiên cứu, tư duy đổi mới và kỹ năng khởi nghiệp cho sinh viên.'
  },
  {
    icon: Sparkles,
    title: 'Lan tỏa (Impact)',
    desc: 'Thúc đẩy các giải pháp công nghệ có tính ứng dụng, tạo ra giá trị bền vững cho cộng đồng.'
  }
];

export const AboutVisionMissionSection: React.FC = () => {
  return (
    <section id="vision-mission" className="relative scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="03 • TẦM NHÌN &amp; SỨ MỆNH"
        title={
          <>
            Định hướng Chiến lược &amp;
            <span className="block">Mục tiêu Cốt lõi</span>
          </>
        }
        subtitle="Kim chỉ nam dẫn lối toàn bộ các chương trình học thuật, ươm tạo dự án và hợp tác phát triển của BK-IC."
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Block 1: TẦM NHÌN (VISION) - Large Left Architectural Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-blue-200/90 bg-gradient-to-b from-white via-blue-50/40 to-white p-7 sm:p-9 shadow-md shadow-blue-950/5 relative overflow-hidden group">
          {/* Subtle Ambient Radial Orb */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div className="space-y-6 relative z-10">
            {/* Header with Icon */}
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 rounded-2xl bg-[#1749B5] text-white flex items-center justify-center shadow-lg shadow-blue-700/20">
                <Compass className="h-7 w-7" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#1749B5] bg-blue-100/70 px-3 py-1 rounded-full uppercase">
                TẦM NHÌN
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10182D] tracking-tight">
                Tầm nhìn – Vision
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-[#1749B5]">
                Hệ sinh thái Đổi mới sáng tạo &amp; Khởi nghiệp học đường
              </p>
            </div>

            {/* Vision Statement */}
            <div className="space-y-3 text-sm sm:text-base text-[#344054] leading-relaxed font-normal">
              <p>
                Trở thành một hệ sinh thái khởi nghiệp và đổi mới sáng tạo năng động trong môi trường đại học, là cầu nối giữa tri thức học thuật và thực tiễn doanh nghiệp.
              </p>
              <p>
                BK-IC hướng đến xây dựng một cộng đồng nơi các ý tưởng sáng tạo được nuôi dưỡng, các nghiên cứu khoa học được phát triển thành giải pháp công nghệ và những dự án tiềm năng có cơ hội vươn xa.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 pt-2 border-t border-blue-100/60">
                Đồng thời, CLB mong muốn góp phần nâng cao năng lực đổi mới sáng tạo, thúc đẩy tinh thần khởi nghiệp và khẳng định vai trò của sinh viên Bách khoa trong việc kiến tạo những giá trị mới cho xã hội.
              </p>
            </div>
          </div>

          {/* Bottom Characteristic Badges */}
          <div className="pt-6 border-t border-blue-100/80 mt-6 relative z-10 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Trọng tâm hướng đến:
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[#1749B5]">
                Tri thức học thuật
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[#1749B5]">
                Thực tiễn doanh nghiệp
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[#1749B5]">
                Giá trị bền vững
              </span>
            </div>
          </div>
        </div>

        {/* Block 2: SỨ MỆNH (MISSION) - 4 Structured Pillars Right Card */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-7 sm:p-9 shadow-md shadow-slate-900/5 flex flex-col justify-between space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 block uppercase">
                  SỨ MỆNH – MISSION
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#10182D]">
                  Kết nối nguồn lực – Đồng hành sáng tạo
                </h3>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-indigo-400 hidden sm:block" />
          </div>

          {/* Mission Lead */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            BK-IC mang sứ mệnh kết nối nguồn lực, khơi dậy tiềm năng và đồng hành cùng sinh viên trên hành trình nghiên cứu, sáng tạo và khởi nghiệp thông qua việc tích hợp đào tạo, nghiên cứu và ứng dụng thực tiễn:
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MISSION_PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2 hover:bg-white hover:border-[#1749B5]/40 hover:shadow-xs transition duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-100/70 text-[#1749B5] flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#10182D] leading-tight">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#475467] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Commitment Note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cam kết đồng hành xuyên suốt hành trình đại học</span>
            <span className="font-semibold text-[#1749B5]">BK-IC DUT</span>
          </div>
        </div>
      </div>
    </section>
  );
};

