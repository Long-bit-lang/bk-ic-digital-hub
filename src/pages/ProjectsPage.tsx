// BK-IC Innovation Projects Showcase Page
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeroBanner } from '../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../components/layout/PageContentCanvas';
import { ScrollReveal } from '../components/effects/ScrollReveal';
import { 
  Rocket, 
  ExternalLink, 
  Github, 
  Layers, 
  Code2, 
  Users, 
  ShieldCheck, 
  Filter,
  Search,
  Sparkles
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = ['all', 'DeepTech & IoT', 'Smart City & Green', 'MedTech & AI'];

  const filteredProjects = projects.filter((p: any) => {
    const matchCategory = selectedCategory === 'all' || p.category.includes(selectedCategory);
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
                        p.techStack.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[{ label: 'Dự án' }]}
        eyebrow="DỰ ÁN ĐỔI MỚI SÁNG TẠO SINH VIÊN • BK-IC DUT"
        title="Dự án & Giải pháp"
        titleHighlight="BK-IC"
        subtitle="Nơi các ý tưởng nghiên cứu khoa học của sinh viên Bách khoa được thử nghiệm, chế tạo thành mẫu thử thực tế và từng bước thương mại hóa."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-6xl">
        {/* Filter Controls */}
        <ScrollReveal direction="up" distance={16} duration={0.5}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả lĩnh vực' : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo công nghệ, tên đề tài..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0284C7] focus:outline-none"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <ScrollReveal direction="up" distance={20} duration={0.6}>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 space-y-3 shadow-xs">
              <div className="text-sm font-semibold text-slate-700">Chưa có dự án đổi mới sáng tạo nào trong hệ thống</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Dữ liệu dự án đang trống và sẵn sàng để bạn đưa các dự án nghiên cứu, sản phẩm công nghệ thực tế lên.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((prj, idx) => (
              <ScrollReveal key={prj.id} direction="up" distance={22} delay={idx * 0.08} duration={0.65}>
                <div
                  className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Visual Header */}
                    <div className={`w-full h-36 rounded-2xl bg-gradient-to-tr ${prj.coverGradient} p-4 flex flex-col justify-between text-white mb-4 relative overflow-hidden shadow-xs`}>
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                          {prj.category}
                        </span>
                        <span className="text-[11px] font-semibold bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                          {prj.status}
                        </span>
                      </div>

                      <div className="z-10">
                        <div className="text-[10px] text-sky-200 font-mono">DUT INNOVATION LAB</div>
                        <div className="text-sm font-bold truncate">{prj.title}</div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition mb-2">
                      {prj.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {prj.fullDesc}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400">Đội ngũ tác giả:</div>
                      <div className="font-semibold text-slate-700">{prj.teamMembers.join(' · ')}</div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400 mb-1.5">Công nghệ áp dụng:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {prj.techStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono bg-sky-50 text-[#0284C7] border border-sky-100 px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Dự án được cố vấn bởi DUT</span>
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Suggest Idea Banner */}
        <ScrollReveal direction="up" distance={20} duration={0.65}>
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-[#050814] via-[#0A1432] to-[#075985] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-sky-950/10">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-bold">
                Bạn có một ý tưởng công nghệ đang ấp ủ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                BK-IC luôn sẵn sàng hỗ trợ bạn tìm kiếm đồng đội bổ trợ chuyên môn (lập trình, cơ khí, kinh tế), kết nối giảng viên hướng dẫn và không gian ươm mầm thực nghiệm.
              </p>
            </div>
            <a
              href="/join"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-white via-slate-100 to-sky-50 text-[#075985] text-xs sm:text-sm font-bold hover:from-[#38BDF8] hover:to-[#0284C7] hover:text-white transition-all duration-300 shadow-xl shadow-sky-500/10 group"
            >
              <Sparkles className="h-4 w-4 text-[#38BDF8] group-hover:text-white transition-colors" />
              <span>Nộp đơn gia nhập BK-IC</span>
            </a>
          </div>
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
