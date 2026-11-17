// BK-IC About Page — Section 07: Interactive Ecosystem Hub-and-Spoke & Partnership CTA
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Compass, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Network, 
  Handshake,
  CheckCircle2
} from 'lucide-react';
import { SectionHeading } from '../editorial/SectionHeading';

interface EcosystemNode {
  id: string;
  num: string;
  title: string;
  roleSubtitle: string;
  description: string;
  actionText: string;
  badge: string;
  badgeClass: string;
  accentBg: string;
  accentBorder: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'students',
    num: '01',
    title: 'SINH VIÊN',
    roleSubtitle: 'Trung tâm của hệ sinh thái',
    description: 'Chủ động khám phá, đề xuất ý tưởng, tham gia dự án và phát triển năng lực thông qua các hoạt động của câu lạc bộ.',
    actionText: 'Tham gia và phát triển cùng cộng đồng.',
    badge: 'TRUNG TÂM SÁNG TẠO',
    badgeClass: 'bg-blue-50 text-[#1749B5] border-blue-200',
    accentBg: 'from-blue-500/10 to-transparent',
    accentBorder: 'hover:border-[#1749B5]',
    icon: GraduationCap
  },
  {
    id: 'mentors',
    num: '02',
    title: 'GIẢNG VIÊN & CHUYÊN GIA',
    roleSubtitle: 'Nguồn tri thức và cố vấn',
    description: 'Đồng hành trong việc chia sẻ kiến thức chuyên môn, định hướng phát triển và hỗ trợ sinh viên tiếp cận các vấn đề thực tiễn.',
    actionText: 'Đồng hành chia sẻ tri thức và kinh nghiệm.',
    badge: 'CỐ VẤN HỌC THUẬT',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentBg: 'from-emerald-500/10 to-transparent',
    accentBorder: 'hover:border-emerald-500',
    icon: BookOpen
  },
  {
    id: 'alumni',
    num: '03',
    title: 'CỰU SINH VIÊN',
    roleSubtitle: 'Cầu nối kinh nghiệm',
    description: 'Chia sẻ hành trình phát triển, kinh nghiệm nghề nghiệp và kết nối các thế hệ sinh viên trong cộng đồng.',
    actionText: 'Chia sẻ kinh nghiệm và dẫn dắt thế hệ mới.',
    badge: 'MẠNG LƯỚI TIỀN BỐI',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentBg: 'from-indigo-500/10 to-transparent',
    accentBorder: 'hover:border-indigo-500',
    icon: Compass
  },
  {
    id: 'businesses',
    num: '04',
    title: 'DOANH NGHIỆP & ĐỐI TÁC',
    roleSubtitle: 'Nguồn lực đồng hành',
    description: 'Mở rộng cơ hội giao lưu, hợp tác, tiếp cận môi trường thực tế và phát triển những sáng kiến có khả năng ứng dụng.',
    actionText: 'Kết nối và hợp tác trong các hoạt động, dự án.',
    badge: 'NGUỒN LỰC THỰC TIỄN',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    accentBg: 'from-amber-500/10 to-transparent',
    accentBorder: 'hover:border-amber-500',
    icon: Building2
  }
];

export const AboutEcosystemSection: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('students');

  return (
    <section id="ecosystem" className="relative scroll-mt-24 py-10 sm:py-14">
      <SectionHeading
        eyebrow="07 • HỆ SINH THÁI &amp; KẾT NỐI"
        title="Cùng xây dựng hệ sinh thái đổi mới sáng tạo"
        subtitle="BK-IC hướng đến phát triển môi trường kết nối đa chiều, trong đó mỗi thành phần đều có thể đóng góp tri thức, kinh nghiệm và nguồn lực cho các hoạt động đổi mới sáng tạo."
      />

      <div className="mt-8 space-y-10">
        {/* Hub and Spoke Ecosystem Interactive Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(23,73,181,0.08),transparent_70%)] pointer-events-none -z-10 blur-2xl" />

          {/* Central Hub Emblem (BK-IC Center) */}
          <div className="text-center max-w-md mx-auto mb-10 space-y-3">
            <div className="relative inline-flex items-center justify-center">
              {/* Pulsing ring aura */}
              <div className="absolute inset-0 rounded-full bg-[#1749B5]/20 animate-ping" />
              <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-[#1749B5] via-[#245BFA] to-[#0EA5E9] text-white flex flex-col items-center justify-center shadow-xl shadow-blue-700/25 border-2 border-white">
                <Network className="h-8 w-8 mb-0.5" />
                <span className="text-[10px] font-black font-mono tracking-wider">BK-IC</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-[#10182D]">
                BK-IC Digital Hub
              </h3>
              <p className="text-xs text-[#1749B5] font-semibold uppercase tracking-wider">
                Trung tâm kết nối &amp; Ươm tạo Đổi mới Sáng tạo
              </p>
            </div>
          </div>

          {/* 4 Orbiting Satellite Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {ECOSYSTEM_NODES.map((node) => {
              const Icon = node.icon;
              const isActive = node.id === activeNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  className={`group rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-[#1749B5] bg-blue-50/40 shadow-md ring-2 ring-[#1749B5]/20'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-[#1749B5] text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-[#1749B5] group-hover:text-white transition-colors'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-[#10182D]">
                            {node.title}
                          </h4>
                          <span className="text-xs font-bold text-[#1749B5] block">
                            {node.roleSubtitle}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${node.badgeClass}`}>
                        {node.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                      {node.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{node.actionText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Collaborative Call to Action Banner */}
        <div className="rounded-3xl border border-blue-200/90 bg-gradient-to-br from-[#10182D] via-[#0D1836] to-[#080E24] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Light Streaks */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(107,157,255,0.20),transparent_70%)] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(36,91,250,0.20),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#93C5FD]">
              <Sparkles className="h-3.5 w-3.5 text-[#6B9DFF]" />
              <span>ĐỒNG HÀNH PHÁT TRIỂN</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Cùng BK-IC tạo nên những giá trị mới
              </h3>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
                BK-IC luôn hướng đến việc mở rộng kết nối với các cá nhân, tổ chức và doanh nghiệp có chung sự quan tâm đến khởi nghiệp và đổi mới sáng tạo.
              </p>
            </div>

            {/* 4 Audience Segments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-[#6B9DFF] block uppercase tracking-wider">
                  Sinh viên
                </span>
                <p className="text-xs text-slate-300">
                  Tham gia và phát triển cùng cộng đồng năng động.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                  Giảng viên &amp; Chuyên gia
                </span>
                <p className="text-xs text-slate-300">
                  Đồng hành chia sẻ tri thức và kinh nghiệm thực tiễn.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                  Doanh nghiệp
                </span>
                <p className="text-xs text-slate-300">
                  Kết nối và hợp tác trong các hoạt động, dự án tiềm năng.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-purple-400 block uppercase tracking-wider">
                  Các tổ chức &amp; Vườn ươm
                </span>
                <p className="text-xs text-slate-300">
                  Cùng phát triển những chương trình và sáng kiến ĐMST.
                </p>
              </div>
            </div>

            {/* Final CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0A1432] text-xs sm:text-sm font-bold hover:bg-[#6B9DFF] hover:text-white transition-all duration-300 shadow-lg group"
              >
                <span>Kết nối với BK-IC – Cùng biến ý tưởng thành giá trị thực tiễn</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/activities/recruitment"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition"
              >
                <span>Ứng tuyển gia nhập CLB</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

