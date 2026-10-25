// BK-IC Translucent Apple-Inspired Navigation Bar V2
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  LogIn, 
  Sparkles,
  ChevronDown,
  ArrowRight,
  UserPlus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, currentRole, logout } = useApp();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/about', label: 'Giới thiệu' },
    { to: '/activities', label: 'Hoạt động' },
    { to: '/projects', label: 'Dự án' },
    { to: '/#gallery', label: 'Khoảnh khắc' },
    { to: '/join', label: 'Tham gia' }
  ];

  const handleNavClick = (to: string) => {
    if (to.startsWith('/#')) {
      const el = document.getElementById(to.replace('/#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-xs'
            : 'border-b border-transparent bg-white/60 backdrop-blur-xs'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Zone 2: Desktop Navigation Links (single-line, clean text with animated hover line) */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-slate-600">
            {navLinks.map((link) => {
              if (link.to.startsWith('/#')) {
                return (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={() => handleNavClick(link.to)}
                    className="relative py-1 text-slate-600 hover:text-[#245BFA] transition-colors whitespace-nowrap shrink-0 group"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#245BFA] transition-all duration-200 group-hover:w-full"></span>
                  </a>
                );
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative py-1 whitespace-nowrap shrink-0 transition-colors group ${
                      isActive ? 'font-semibold text-[#245BFA]' : 'text-slate-600 hover:text-[#245BFA]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.label}</span>
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-[#245BFA] transition-all duration-200 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

            {/* Zone 3: Authenticated User & Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] font-medium text-blue-600">
                      {currentRole === 'admin'
                        ? 'Ban Chủ nhiệm (Admin)'
                        : currentRole === 'leader'
                        ? `Trưởng ${currentUser.unit || 'Ban'}`
                        : currentRole === 'member'
                        ? `Thành viên (${currentUser.unit || 'BK-IC'})`
                        : 'Ứng viên chờ duyệt'}
                    </span>
                  </div>

                  {currentRole === 'admin' || currentRole === 'sysadmin' ? (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#245BFA] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-xs"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span className="hidden sm:inline">Bảng Quản trị</span>
                    </Link>
                  ) : currentRole === 'applicant' ? (
                    <Link
                      to="/pending-approval"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 shadow-xs"
                    >
                      <span>Trạng thái hồ sơ</span>
                    </Link>
                  ) : (
                    <Link
                      to="/portal"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#245BFA] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-xs"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Cổng Thành viên</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Đăng xuất khỏi hệ thống"
                  >
                    <LogIn className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition hover:bg-slate-100"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#245BFA] px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Đăng ký tài khoản</span>
                  </Link>
                </div>
              )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-md lg:hidden p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Điều hướng
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-base font-semibold text-slate-800 hover:text-[#245BFA]"
              >
                Trang chủ
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base font-medium text-slate-800 hover:text-[#245BFA]"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.facebook.com/dut.bkic"
                target="_blank"
                rel="noreferrer"
                className="text-base font-medium text-blue-600"
              >
                Fanpage Facebook BK-IC ↗
              </a>
              <Link
                to="/join"
                className="text-base font-bold text-[#245BFA]"
              >
                Ứng tuyển Thành viên
              </Link>
            </div>



            <div className="pt-4">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    Đang đăng nhập: <strong className="text-slate-800">{currentUser.fullName}</strong>
                  </div>
                  {currentRole === 'admin' ? (
                    <Link
                      to="/admin"
                      className="block w-full py-2.5 text-center bg-[#245BFA] text-white rounded-xl text-sm font-semibold"
                    >
                      Mở Bảng Quản trị
                    </Link>
                  ) : (
                    <Link
                      to="/portal"
                      className="block w-full py-2.5 text-center bg-[#245BFA] text-white rounded-xl text-sm font-semibold"
                    >
                      Mở Cổng Thành viên
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full py-2 text-center border border-slate-300 text-slate-700 rounded-xl text-sm"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full py-2.5 text-center bg-slate-900 text-white rounded-xl text-sm font-semibold"
                >
                  Đăng nhập Hệ thống
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
