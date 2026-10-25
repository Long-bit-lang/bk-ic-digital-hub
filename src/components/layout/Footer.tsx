// BK-IC Editorial Footer V2 with Official Facebook Fanpage Integration
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { ExternalLink, ShieldCheck, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          {/* Col 1: Identity & Affiliation */}
          <div className="md:col-span-6 space-y-4">
            <Logo showSubtitle={true} />
            <p className="text-sm text-slate-600 max-w-md leading-relaxed font-normal">
              Câu lạc bộ Khởi nghiệp và Đổi mới sáng tạo — Trường Đại học Bách khoa, Đại học Đà Nẵng. Không gian kết nối thế hệ kỹ sư trẻ năng động, ươm tạo giải pháp và hiện thực hóa các dự án đổi mới sáng tạo có ý nghĩa cho cộng đồng.
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>54 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-600">bkic@dut.udn.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Điều hướng
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#245BFA] transition">Về chúng mình</Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-[#245BFA] transition">Hệ sinh thái hoạt động</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#245BFA] transition">Dự án ươm mầm</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#245BFA] transition">Sự kiện & Phiên sinh hoạt</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#245BFA] transition">Thông cáo báo chí</Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-[#245BFA] transition font-semibold text-[#245BFA]">Đăng ký gia nhập BK-IC</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Fanpage & Provenance */}
          <div className="md:col-span-3 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Kênh Thông tin & Fanpage
            </div>

            {/* Official Facebook Link Box */}
            <a
              href="https://www.facebook.com/dut.bkic"
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Fanpage BK-IC Chính thức</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                facebook.com/dut.bkic
              </p>
            </a>

            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Nguồn báo chí: Báo Đà Nẵng (04/04/2026)</span>
              </div>
              <a
                href="https://dut.udn.vn/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition"
              >
                <span>Trường Đại học Bách khoa – ĐHĐN</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} BK-IC · Bách Khoa Innovation Club · DUT. Bảo lưu mọi quyền.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>"Từ ý tưởng đầu tiên, đến những đổi mới tạo nên khác biệt"</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500">Where Ideas Become Impact</span>
          </div>
        </div>
      </div>

      {/* Large subtle typographic motif at the footer bottom */}
      <div className="pointer-events-none select-none absolute -bottom-10 left-1/2 -translate-x-1/2 text-[140px] font-extrabold tracking-tighter text-slate-900/[0.02] whitespace-nowrap">
        BACH KHOA INNOVATION CLUB
      </div>
    </footer>
  );
};
