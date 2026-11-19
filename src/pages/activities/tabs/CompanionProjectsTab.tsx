// BK-IC Tab 4: Dự án đồng hành (Incubator & Companion Projects for Students)
// Student-centric project incubation, mentorship, multi-disciplinary team building & project submission
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../../components/effects/ScrollReveal';
import { PartnershipRequestModal } from '../../../components/activities/PartnershipRequestModal';
import {
  COMPANION_PROJECTS_DATA,
  PARTNERSHIP_MODELS
} from '../../../data/activitiesData';
import {
  COMPANION_FIELDS,
  PARTNERSHIP_PROCESS_STEPS
} from '../../../data/partnershipData';
import {
  Rocket,
  Handshake,
  Users,
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  Inbox,
  Cpu,
  GraduationCap,
  Lightbulb
} from 'lucide-react';

export const CompanionProjectsTab: React.FC = () => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedPartnerType, setSelectedPartnerType] = useState('expert_mentoring');

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
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#0284C7] tracking-wider">
                <GraduationCap className="h-4 w-4" />
                <span>Vườn Ươm Dự Án Sinh Viên BK-IC</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#075985] tracking-tight">
                Đồng hành cùng Sinh viên Từ Ý tưởng đến Sản phẩm Thực tiễn
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
                Không gian ươm tạo dành riêng cho các cá nhân và nhóm sinh viên Bách khoa có ý tưởng công nghệ, đề tài Nghiên cứu Khoa học hoặc dự án khởi nghiệp muốn nhận sự cố vấn từ giảng viên, ghép nhóm đa ngành và bứt phá tại các cuộc thi lớn.
              </p>
            </div>

            <button
              onClick={() => openPartnerModal('expert_mentoring')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <Rocket className="h-4 w-4" />
              <span>Đăng ký Dự án Sinh viên</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Project Grid or Student-Centric Open Call */}
        {COMPANION_PROJECTS_DATA.length > 0 ? (
          <>
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
                  Hãy chọn lại bộ lọc hoặc gửi hồ sơ dự án sinh viên của bạn để BK-IC đồng hành ươm tạo.
                </p>
              </div>
            )}
          </>
        ) : (
          <ScrollReveal direction="up" distance={16} delay={0.06} duration={0.5}>
            <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50 p-7 sm:p-10 shadow-xs space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sky-200 text-xs font-bold text-[#0284C7] shadow-2xs">
                    <Sparkles className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>ĐỢT TIẾP NHẬN DỰ ÁN ĐỒNG HÀNH NĂM HỌC 2026 – 2027</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#10182D] leading-snug">
                    Bạn là Sinh viên đang ấp ủ Ý tưởng Công nghệ, Đề tài NCKH hay Dự án Khởi nghiệp?
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Hiện tại CLB BK-IC đang mở đợt tiếp nhận mới cho toàn bộ sinh viên các Khoa trong Trường ĐH Bách khoa – ĐHĐN. Dù dự án của bạn mới ở giai đoạn <strong className="text-slate-800">ý tưởng sơ khởi</strong>, <strong className="text-slate-800">đồ án môn học / NCKH</strong> hay đã có <strong className="text-slate-800">sản phẩm mẫu (Prototype/MVP)</strong>, BK-IC luôn sẵn sàng đồng hành cùng nhóm bạn để hoàn thiện công nghệ và bước ra các sân chơi lớn.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                      <span className="text-xs font-bold text-[#075985] block">01 • Kết nối Mentor &amp; Giảng viên</span>
                      <span className="text-[11px] text-slate-500 block leading-snug">
                        Định hướng chuyên môn kỹ thuật và thẩm định mô hình khả thi.
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                      <span className="text-xs font-bold text-[#075985] block">02 • Ghép nhóm Liên ngành</span>
                      <span className="text-[11px] text-slate-500 block leading-snug">
                        Kết nối thành viên từ các khoa CNTT, Điện, Cơ khí, Quản lý dự án.
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                      <span className="text-xs font-bold text-[#075985] block">03 • Bệ phóng Đi thi Lớn</span>
                      <span className="text-[11px] text-slate-500 block leading-snug">
                        Huấn luyện Pitch Deck chinh phục BK Shark, SV_STARTUP &amp; Quốc tế.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-4">
                  <div className="p-3.5 bg-sky-50 text-[#0284C7] rounded-2xl border border-sky-100">
                    <Rocket className="h-8 w-8 text-[#0284C7]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#10182D]">
                      Đăng ký Ươm tạo Dự án Sinh viên
                    </h4>
                    <p className="text-xs text-slate-500">
                      Dành cho cá nhân hoặc nhóm sinh viên (1 – 5 thành viên) muốn nhận hỗ trợ từ BK-IC.
                    </p>
                  </div>
                  <div className="w-full space-y-2">
                    <button
                      onClick={() => openPartnerModal('expert_mentoring')}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition shadow-xs cursor-pointer"
                    >
                      <Handshake className="h-4 w-4" />
                      <span>Nộp Đề xuất Dự án ngay</span>
                    </button>
                    <Link
                      to="/partnership"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-[#0284C7] hover:text-[#0284C7] font-semibold text-xs transition"
                    >
                      <span>Xem chi tiết Chương trình Đồng hành</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* SECTION 2: 3 CHƯƠNG TRÌNH ĐỒNG HÀNH & HỖ TRỢ SINH VIÊN */}
      <ScrollReveal direction="up" distance={20} delay={0.12} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Quyền Lợi Dành Cho Nhóm Sinh Viên
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              3 Gói Đồng hành &amp; Hỗ trợ Dự án Sinh viên Cùng BK-IC
            </h3>
            <p className="text-xs text-slate-500">
              Thiết kế sát với nhu cầu thực tế của sinh viên kỹ thuật Bách khoa trên hành trình phát triển sản phẩm và khởi nghiệp.
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
                    <span className="font-semibold text-slate-700 block">Hỗ trợ trực tiếp cho nhóm sinh viên:</span>
                    {model.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openPartnerModal(model.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 text-[#0284C7] font-bold text-xs border border-slate-200 hover:border-sky-200 transition text-center cursor-pointer"
                  >
                    Đăng ký nhận hỗ trợ hạng mục này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: 5 LĨNH VỰC ĐỀ TÀI SINH VIÊN ĐƯỢC ƯU TIÊN ƯƠM TẠO */}
      <ScrollReveal direction="up" distance={20} delay={0.16} duration={0.6}>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                <span>Định Hướng Đề Tài Sinh Viên</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
                5 Lĩnh vực Công nghệ Trọng tâm Khuyến khích Sinh viên Đăng ký
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Phù hợp với thế mạnh đào tạo của các Khoa tại Trường ĐH Bách khoa – ĐHĐN.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANION_FIELDS.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.id}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-[#38BDF8] hover:shadow-sm transition space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#10182D] leading-snug">
                      {field.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {field.description}
                  </p>
                </div>
              );
            })}

            <div className="p-5 rounded-2xl border border-dashed border-sky-300 bg-sky-50/30 flex flex-col justify-center items-center text-center space-y-2">
              <Lightbulb className="h-6 w-6 text-[#0284C7]" />
              <h4 className="text-sm font-bold text-[#075985]">Ý tưởng Sáng tạo Liên ngành Khác</h4>
              <p className="text-xs text-slate-500">
                Mọi giải pháp công nghệ mới xuất phát từ bài toán học tập, đời sống sinh viên và cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 4: LỘ TRÌNH 4 BƯỚC ĐỒNG HÀNH CÙNG NHÓM DỰ ÁN SINH VIÊN */}
      <ScrollReveal direction="up" distance={20} delay={0.2} duration={0.6}>
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[#0284C7] tracking-wider">
              Quy Trình Tiếp Nhận Đơn Giản
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#10182D]">
              Lộ trình 4 Bước Đồng hành Cùng Nhóm Dự án Sinh viên
            </h3>
            <p className="text-xs text-slate-500">
              Từ lúc gửi ý tưởng đến khi hoàn thiện sản phẩm mẫu và bước lên sân khấu Pitching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNERSHIP_PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:border-[#38BDF8] hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-[#0284C7] border border-sky-100">
                      BƯỚC 0{step.step}
                    </span>
                    <div className="h-8 w-8 rounded-xl bg-slate-50 text-[#0284C7] flex items-center justify-center">
                      <Rocket className="h-4 w-4" />
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#10182D]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Student Companion Project Request Modal */}
      <PartnershipRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultType={selectedPartnerType}
      />
    </div>
  );
};

export default CompanionProjectsTab;
