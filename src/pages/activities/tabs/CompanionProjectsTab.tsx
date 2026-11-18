// BK-IC Tab 4: Dự án đồng hành (Incubator & Companion Projects)
// Student project portfolio, partner ecosystem, cooperation models & partnership request modal
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { PartnershipRequestModal } from '../../../components/activities/PartnershipRequestModal';
import { 
  COMPANION_PROJECTS_DATA, 
  PARTNERSHIP_MODELS, 
  type CompanionProjectItem 
} from '../../../data/activitiesData';
import { HOME_PARTNERS_DATA } from '../../../data/homeData';
import { 
  Rocket, 
  Handshake, 
  Layers, 
  Users, 
  ArrowRight, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  Search,
  Sparkles,
  Inbox
} from 'lucide-react';

export const CompanionProjectsTab: React.FC = () => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedPartnerType, setSelectedPartnerType] = useState('program_sponsor');

  const filteredProjects = COMPANION_PROJECTS_DATA.filter((p) => {
    const matchStage = stageFilter === 'all' || p.stage.includes(stageFilter);
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStage && matchSearch;
  });

  const openPartnerModal = (type: string) => {
    setSelectedPartnerType(type);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* SECTION 1: VƯỜN ƯƠM DỰ ÁN SINH VIÊN */}
      <div className="space-y-6">
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Vườn Ươm Công Nghệ BK-IC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#075985] tracking-tight">
                Từ ý tưởng đến giá trị thực tiễn
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
                Danh mục các dự án kỹ thuật do sinh viên Bách khoa nghiên cứu và chế tạo nguyên mẫu dưới sự bảo trợ hạ tầng, kinh phí và cố vấn từ BK-IC.
              </p>
            </div>

            <button
              onClick={() => openPartnerModal('expert_mentoring')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200 font-bold text-xs hover:bg-sky-100 transition shadow-2xs self-start sm:self-auto shrink-0"
            >
              <Handshake className="h-4 w-4" />
              <span>Đề xuất Bảo trợ Dự án</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Filter Bar */}
        <ScrollReveal direction="up" distance={16} delay={0.06} duration={0.5}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setStageFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  stageFilter === 'all'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả giai đoạn
              </button>
              <button
                onClick={() => setStageFilter('Pilot')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  stageFilter === 'Pilot'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Thử nghiệm thực tế (Pilot)
              </button>
              <button
                onClick={() => setStageFilter('MVP')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  stageFilter === 'MVP'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Nguyên mẫu MVP
              </button>
              <button
                onClick={() => setStageFilter('Prototype')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  stageFilter === 'Prototype'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mẫu thử (Prototype)
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm dự án, công nghệ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Category & Stage */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-100">
                      {p.field}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      • {p.stage}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-[#10182D] leading-snug group-hover:text-[#0284C7] transition">
                    <Link to={`/activities/companion-projects/${p.slug}`}>
                      {p.title}
                    </Link>
                  </h4>

                  {/* Summary */}
                  <p className="text-xs text-[#5E6573] leading-relaxed line-clamp-3">
                    {p.summary}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  {p.metrics && (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                      {p.metrics.map((m, i) => (
                        <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">{m.label}</span>
                          <span className="font-bold text-[#075985] text-xs">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Details Link */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 truncate max-w-[170px]" title={p.faculty}>
                    {p.leadName}
                  </span>
                  <Link
                    to={`/activities/companion-projects/${p.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline shrink-0"
                  >
                    <span>Hồ sơ dự án</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
            <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Chưa có dự án nào trong phân loại này</h4>
            <p className="text-xs text-slate-500">
              Hãy chọn lại bộ lọc hoặc liên hệ CLB để được tiếp nhận hồ sơ ươm tạo mới.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: HỆ SINH THÁI ĐỐI TÁC ĐỒNG HÀNH */}
      <ScrollReveal direction="up" distance={20} delay={0.12} duration={0.6}>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                Mạng Lưới Liên Kết
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                Hệ sinh thái Đối tác & Doanh nghiệp Đồng hành
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Kết nối sinh viên trực tiếp với các vườn ươm, tập đoàn công nghệ và cơ quan ban ngành.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {HOME_PARTNERS_DATA.slice(0, 10).map((partner) => (
              <div
                key={partner.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-[#38BDF8] hover:shadow-md transition text-center space-y-2 flex flex-col justify-between"
              >
                <div className="h-10 w-10 mx-auto rounded-xl bg-white shadow-2xs border border-slate-200/70 flex items-center justify-center font-bold text-xs text-[#0284C7]">
                  {partner.initials || 'BK'}
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-slate-800 line-clamp-1">
                    {partner.name}
                  </h5>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">
                    {partner.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: CÁC HÌNH THỨC HỢP TÁC & CTA */}
      <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Mô hình Phối hợp
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Các Hình thức Hợp tác Cùng BK-IC
            </h3>
            <p className="text-xs text-slate-500">
              Linh hoạt đáp ứng mục tiêu phát triển nguồn nhân lực và đổi mới sáng tạo của quý đối tác.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNERSHIP_MODELS.map((model, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:border-[#38BDF8] hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100">
                    {model.badge}
                  </span>
                  <h4 className="text-base font-bold text-[#10182D]">
                    {model.title}
                  </h4>
                  <p className="text-xs text-[#5E6573] leading-relaxed">
                    {model.desc}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 block">Quyền lợi trọng tâm:</span>
                    {model.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openPartnerModal(model.badge.toLowerCase())}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 text-[#0284C7] font-bold text-xs border border-slate-200 hover:border-sky-200 transition text-center"
                  >
                    Đề xuất hợp tác mảng này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Partnership Request Modal */}
      <PartnershipRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultType={selectedPartnerType}
      />
    </div>
  );
};

export default CompanionProjectsTab;

