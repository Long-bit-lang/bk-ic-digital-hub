// SECTION 04 — OFFICIAL 3-UNIT ORGANIZATIONAL STRUCTURE & GOVERNANCE
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../utils/gsapSetup';
import {
  Users,
  Shield,
  Cpu,
  UserCheck,
  ArrowRight,
  Building2,
  Workflow,
  Network
} from 'lucide-react';

export const OrganizationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const treeRef = useRef<HTMLDivElement | null>(null);
  const workflowRef = useRef<HTMLDivElement | null>(null);

  const workflows = [
    {
      step: '01',
      unit: 'BCN',
      title: 'Định hướng & Phê duyệt',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'BCN duyệt kế hoạch sinh hoạt tuần, phê duyệt ngân sách, cơ sở vật chất hội trường và mời diễn giả/chuyên gia.'
    },
    {
      step: '02',
      unit: 'BĐH',
      title: 'Nội dung & Kỹ thuật',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'BĐH chuẩn bị slide bài giảng, tạo buổi sinh hoạt để cho BTV theo dõi, điều phối phần thảo luận chuyên môn.'
    },
    {
      step: '03',
      unit: 'BTV',
      title: 'Điểm danh & Góp ý',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: 'BTV tham gia các buổi sinh hoạt bằng cách quét mã QR điểm danh, đóng góp về buổi sinh hoạt và góp ý những nội dung cho buổi meeting sau'
    },
    {
      step: '04',
      unit: 'BCN + BĐH',
      title: 'Hậu kiểm & Ghi nhận',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      desc: 'Tổng hợp phản hồi, xử lý đơn phép/vé phạt công khai và ghi nhận điểm rèn luyện chính thức cho từng thành viên.'
    }
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          treeRef.current,
          { opacity: 0, y: 20, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          workflowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="organization"
      ref={sectionRef}
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden border-t border-slate-200/80"
    >
      {/* 01. Section Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA] font-mono">
            <Users className="h-3.5 w-3.5" />
            <span>BỘ MÁY TỔ CHỨC CHÍNH THỨC • BK-IC DUT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            Cơ cấu 3 Ban Vận hành Tinh gọn & Minh bạch.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Mô hình quản trị hiện đại, phân định thẩm quyền rõ ràng và liên kết chặt chẽ giữa Ban Cố vấn,
            Ban Chủ nhiệm, Ban Điều hành và Ban Thành viên nhằm tối ưu nguồn lực và trao quyền tối đa cho từng thành viên.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition shadow-xs group"
          >
            <span>Quy chế CLB chi tiết</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 02. Interactive Visual Org Hierarchy Tree */}
      <div ref={treeRef} className="mb-14 sm:mb-16">
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-white p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
              <Network className="h-3.5 w-3.5" />
              Sơ đồ Quan hệ Quản trị & Điều hành
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Liên kết chặt chẽ từ Cố vấn đến Thực thi
            </h3>
          </div>

          {/* Org Tree Flow */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Level 1: Advisory & University */}
            <div className="max-w-lg mx-auto rounded-2xl border border-slate-300/80 bg-white p-4 text-center shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Building2 className="h-4 w-4 text-[#245BFA]" />
                <span>Trường Đại học Bách khoa – ĐHĐN (DUT)</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Trung tâm Hỗ trợ sinh viên & Quan hệ doanh nghiệp
              </h4>
            </div>

            {/* Tree Branch Connector 1 */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 -my-1"></div>
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* Level 2: Executive Core (BCN) */}
            <div className="max-w-md mx-auto rounded-2xl border-2 border-blue-400 bg-blue-50/50 p-5 text-center shadow-xs relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-full shadow-xs">
                TRUNG TÂM QUẢN TRỊ CHIẾN LƯỢC
              </div>
              <div className="flex items-center justify-center gap-2 text-[#245BFA] font-bold text-base mt-1">
                <Shield className="h-5 w-5" />
                <span>1. Ban Chủ nhiệm (BCN)</span>
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">
                Chủ nhiệm CLB: <span className="text-blue-700">Phạm Lê Tú</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Chỉ đạo định hướng • Đại diện pháp lý • Phê duyệt tối cao về ngân sách & nhân sự
              </p>
            </div>

            {/* Tree Branch Connector 2 (Split to 2 Wings) */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="w-3/4 h-0.5 bg-slate-300 relative">
                <div className="absolute left-0 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              </div>
              <div className="w-3/4 flex justify-between">
                <div className="w-0.5 h-6 bg-slate-300"></div>
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>
            </div>

            {/* Level 3: Operational Wings (BĐH & BTV) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
              {/* BĐH */}
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/30 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    NHÁNH CHUYÊN MÔN
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-600" />
                  <span>2. Ban Điều hành (BĐH)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Thiết kế học liệu kỹ thuật, tổ chức buổi sinh hoạt thứ Ba hằng tuần và ươm tạo các đề tài NCKH, ý tưởng đổi mới sáng tạo.
                </p>
              </div>

              {/* BTV */}
              <div className="rounded-2xl border border-indigo-300 bg-indigo-50/30 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    NHÁNH NỀN TẢNG SỐ
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-600" />
                  <span>3. Ban Thành viên (BTV)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Định danh hồ sơ số, vận hành quét mã QR điểm danh, kiểm soát kỷ luật chuyên cần, vé phạt và chăm sóc đời sống nội bộ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 03. Weekly Collaboration Workflow */}
      <div ref={workflowRef} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs mb-14 sm:mb-20 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Workflow className="h-4 w-4" />
            <span>Quy Trình Phối Hợp Khép Kín</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            Cách 3 Ban Phối Hợp Trong Sinh Hoạt Định Kỳ Thứ Ba
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Quy trình vận hành chuẩn mực giúp các buổi sinh hoạt chuyên môn diễn ra chính xác,
            minh bạch điểm danh và tối đa hóa chất lượng tiếp thu cho từng bạn sinh viên.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.map((wf, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 space-y-3 relative group hover:bg-white hover:border-blue-200 hover:shadow-xs transition">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-blue-500 transition">
                  {wf.step}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${wf.badgeColor}`}>
                  {wf.unit}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {wf.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {wf.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
