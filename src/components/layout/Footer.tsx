// BK-IC Deep Navy Minimalist Editorial Footer
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { ExternalLink, ShieldCheck, MapPin, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-[#10182D] text-slate-300 border-t border-white/10">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-32 bg-[#1749B5]/15 blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          {/* Col 1: Identity & Affiliation */}
          <div className="md:col-span-5 space-y-4">
            <div className="brightness-0 invert opacity-95">
              <Logo showSubtitle={false} />
            </div>

            <p className="text-xs font-mono font-semibold text-[#6B9DFF] uppercase tracking-wider">
              BachKhoa Innovation and Entrepreneurship Club
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-normal">
              Câu lạc bộ Khởi nghiệp và Đổi mới Sáng tạo trực thuộc Đoàn Thanh niên – Hội Sinh viên Trường Đại học Bách khoa, Đại học Đà Nẵng. Không gian ươm mầm thế hệ kỹ sư công nghệ dám nghĩ, dám làm và kiến tạo giá trị thực tiễn.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#6B9DFF] shrink-0 mt-0.5" />
                <span>54 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#6B9DFF] shrink-0" />
                <span className="font-mono text-slate-200">bkic.dut@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (Sitemap) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Cấu trúc Điều hướng
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition">1. Trang chủ</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">2. Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition">3. Hoạt động</Link>
              </li>
              <li>
                <Link to="/activities/workshops" className="hover:text-white transition pl-3 block text-slate-500">• Workshop thường niên</Link>
              </li>
              <li>
                <Link to="/activities/competitions" className="hover:text-white transition pl-3 block text-slate-500">• Cuộc thi sáng tạo</Link>
              </li>
              <li>
                <Link to="/activities/recruitment" className="hover:text-white transition pl-3 block text-slate-500">• Tuyển thành viên</Link>
              </li>
              <li>
                <Link to="/partnership" className="hover:text-white transition">4. Hợp tác</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">5. Đăng nhập (Member Portal)</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Fanpage & Provenance */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Mạng xã hội & Xác thực
            </div>

            {/* Official Facebook Link Box */}
            <a
              href="https://www.facebook.com/dut.bkic"
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-[#6B9DFF] hover:bg-white/10"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Fanpage BK-IC Chính thức</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#6B9DFF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                facebook.com/dut.bkic
              </p>
            </a>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Ghi nhận báo chí: Báo Đà Nẵng (04/04/2026)</span>
              </div>
              <a
                href="https://dut.udn.vn/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition"
              >
                <span>Trường Đại học Bách khoa – ĐHĐN (DUT)</span>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} BK-IC Digital Hub. Nền tảng Quản trị & Kết nối Số hóa.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>DUT Ecosystem</span>
            <span>•</span>
            <span>Minimalist Editorial Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
