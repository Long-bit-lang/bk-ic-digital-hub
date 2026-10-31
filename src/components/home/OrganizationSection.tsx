// SECTION 04 — OFFICIAL 3-UNIT ORGANIZATIONAL STRUCTURE
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../utils/gsapSetup';
import { Users, Shield, Cpu, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OrganizationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const units = [
    {
      code: 'BCN',
      name: 'Ban Chủ nhiệm',
      fullName: '1. Ban Chủ nhiệm (BCN)',
      leader: 'Phạm Lê Tú',
      color: 'blue',
      badgeClass: 'bg-blue-50 text-[#245BFA] border-blue-200',
      icon: Shield,
      desc: 'Quản lý chung và đưa ra quyết định phê duyệt cuối cùng theo thẩm quyền.',
      duties: [
        'Chỉ đạo chiến lược & định hướng phát triển câu lạc bộ',
        'Phê duyệt cuối cùng các quyết định nhân sự, đánh giá rèn luyện',
        'Cầu nối cấp cao với Nhà trường và Hội đồng Giảng viên Cố vấn'
      ]
    },
    {
      code: 'BĐH',
      name: 'Ban Điều hành',
      fullName: '2. Ban Điều hành (BĐH)',
      leader: 'Lê Anh Khoa',
      color: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Cpu,
      desc: 'Tổ chức hoạt động, phối hợp giữa các ban và điều phối công việc theo phân quyền.',
      duties: [
        'Tổ chức các buổi sinh hoạt định kỳ, workshop và seminar công nghệ',
        'Quản lý tiến độ các dự án nghiên cứu, sản phẩm đổi mới sáng tạo',
        'Điều phối công việc chuyên môn và liên kết nguồn lực hỗ trợ'
      ]
    },
    {
      code: 'BTV',
      name: 'Ban Thành viên',
      fullName: '3. Ban Thành viên (BTV)',
      leader: 'Nguyễn Hoàng Long',
      color: 'indigo',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: UserCheck,
      desc: 'Quản lý hồ sơ thành viên, theo dõi tình trạng thành viên và thực hiện các nghiệp vụ nhân sự, điểm danh theo quyền được giao.',
      duties: [
        'Quản lý hồ sơ, thông tin sinh viên và mã định danh thành viên',
        'Theo dõi tình trạng hoạt động, nghỉ phép và giải quyết đơn khiếu nại',
        'Vận hành hệ thống điểm danh QR số hóa và hỗ trợ đời sống nội bộ'
      ]
    }
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      });

      tl.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8
      }).from(
        cardsRef.current?.children || [],
        {
          opacity: 0,
          y: 35,
          duration: 0.8,
          stagger: 0.15
        },
        '-=0.5'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="organization"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden border-t border-slate-200/80"
    >
      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#245BFA] font-mono">
            <Users className="h-3.5 w-3.5" />
            <span>CƠ CẤU TỔ CHỨC CHÍNH THỨC</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            Bộ máy 3 Ban tinh gọn & minh bạch.
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            BK-IC vận hành với đúng 3 ban chức năng rõ ràng, phân định thẩm quyền và kết nối chặt chẽ để hỗ trợ tối đa cho từng thành viên.
          </p>
        </div>

        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245BFA] hover:text-blue-800 transition shrink-0 group"
        >
          <span>Xem chi tiết quy chế CLB</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 3 Unit Cards */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {units.map((unit) => {
          const Icon = unit.icon;
          return (
            <div
              key={unit.code}
              className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${unit.badgeClass}`}>
                    {unit.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Trưởng ban: {unit.leader}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#245BFA] transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#245BFA] transition">
                      {unit.fullName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    {unit.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Chức năng chính:
                  </div>
                  <ul className="space-y-2">
                    {unit.duties.map((duty, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Mã ban: {unit.code}</span>
                <span className="text-blue-600 font-semibold">Chính thức</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
