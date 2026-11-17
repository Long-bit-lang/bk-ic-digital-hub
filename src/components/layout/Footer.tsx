// BK-IC Deep Cosmic Black Minimalist Editorial Footer (Inspired by Tirtus Behance)
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#060914] via-[#09122C] to-[#04060E] text-slate-300 border-t border-white/10">
      {/* Ambient Gradient Glows */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-4/5 h-48 bg-gradient-to-b from-[#1749B5]/25 via-[#245BFA]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tl from-[#6B9DFF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          {/* Col 1: Identity & Affiliation */}
          <div className="md:col-span-5 space-y-4">
            {/* Official BK-IC Club Logo Emblem & Wordmark */}
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-white/20 bg-white p-1 shadow-lg shadow-blue-500/20 ring-2 ring-white/10">
                <img
                  src="/images/bkic/bkic_logo.jpg"
                  alt="BK-IC Official Logo"
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-bold tracking-tight text-white">
                    BK<span className="text-[#6B9DFF]">-</span>IC
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
                    DUT
                  </span>
                </div>
                <span className="mt-1 text-xs text-slate-400 font-normal">
                  Bách Khoa Innovation Club
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#6B9DFF] uppercase tracking-wider">
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
                <span className="text-slate-200 font-medium">bkic.dut@gmail.com</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <Phone className='h-4 w-4 text-[#6B9DFF] shrink-0' />
                <span className='text-slate-200 font-medium'>0948.942.592</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (Sitemap - Clean list without numbers or sub-items) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Cấu trúc Điều hướng
            </div>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition">Trang chủ</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition">Hoạt động</Link>
              </li>
              <li>
                <Link to="/partnership" className="hover:text-white transition">Hợp tác</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Đăng nhập</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Social Media (Facebook & TikTok) & Provenance */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Mạng xã hội &amp; Xác thực
            </div>

            <div className="space-y-2.5">
              {/* Official Facebook Link Box */}
              <a
                href="https://www.facebook.com/dut.bkic"
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-200 hover:border-[#6B9DFF] hover:bg-white/10"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Fanpage Facebook BK-IC</span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#6B9DFF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-[11px] text-slate-400 pl-6">
                  facebook.com/dut.bkic
                </p>
              </a>

              {/* Official TikTok Link Box */}
              <a
                href="https://www.tiktok.com/@clb.bkic?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-200 hover:border-[#6B9DFF] hover:bg-white/10"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                  <div className="flex items-center gap-2">
                    {/* Official TikTok SVG Icon */}
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.96-4.52V8.78a8.16 8.16 0 0 0 4.81 1.56v-3.5a4.88 4.88 0 0 1-1-.15z" />
                    </svg>
                    <span>Kênh TikTok BK-IC</span>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#6B9DFF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-[11px] text-slate-400 pl-6">
                  @clb.bkic
                </p>
              </a>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Xuất xứ Báo Đà Nẵng (04/04/2026)</span>
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

        {/* Bottom Bar with Behance-style Dot Indicators */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} BK-IC Digital Hub. Nền tảng Quản trị &amp; Kết nối Số hóa.
          </div>

          {/* Subtle dots indicator from Tirtus Behance design */}
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-80" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-30" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-10" />
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
            <span>DUT Ecosystem</span>
            <span>&bull;</span>
            <span>Minimalist Editorial Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
