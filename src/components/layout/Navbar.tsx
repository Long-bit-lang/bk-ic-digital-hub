// BK-IC Minimalist Editorial Navigation Bar (5 Primary Sections)
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { getUnitShortName } from '../../utils/unitDisplay';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  LogIn, 
  ChevronDown,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activitiesDropdown, setActivitiesDropdown] = useState(false);
  const [partnershipDropdown, setPartnershipDropdown] = useState(false);

  const { currentUser, currentRole, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActivitiesDropdown(false);
    setPartnershipDropdown(false);
  }, [location.pathname]);

  const activitySubItems = [
    { to: '/activities/internal', label: 'Sinh hoạt nội bộ' },
    { to: '/activities/workshops', label: 'Workshop thường niên' },
    { to: '/activities/competitions', label: 'Cuộc thi sáng tạo' },
    { to: '/activities/companion-projects', label: 'Dự án đồng hành' },
    { to: '/activities/bk-shark', label: 'Sân khấu BK Shark' },
    { to: '/activities/recruitment', label: 'Tuyển thành viên mới' }
  ];

  const partnershipSubItems = [
    { to: '/partnership', label: 'Tổng quan Hợp tác' },
    { to: '/partnership/companion-project', label: 'Dự án đồng hành & Catalogue' },
    { to: '/partnership/partners', label: 'Đối tác chiến lược' },
    { to: '/partnership/business', label: 'Hợp tác doanh nghiệp' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#E2E6EE] bg-white/95 backdrop-blur-md shadow-xs'
            : 'border-b border-transparent bg-white/80 backdrop-blur-xs'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Zone 2: 5 Main Navigation Items */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#20232B]">
            {/* 1. Trang chủ */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-1 transition-colors group ${
                  isActive && location.pathname === '/' ? 'font-bold text-[#1749B5]' : 'text-slate-600 hover:text-[#1749B5]'
                }`
              }
            >
              <span>Trang chủ</span>
            </NavLink>

            {/* 2. Về chúng tôi */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative py-1 transition-colors group ${
                  isActive ? 'font-bold text-[#1749B5]' : 'text-slate-600 hover:text-[#1749B5]'
                }`
              }
            >
              <span>Về chúng tôi</span>
            </NavLink>

            {/* 3. Hoạt động (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setActivitiesDropdown(true)}
              onMouseLeave={() => setActivitiesDropdown(false)}
            >
              <NavLink
                to="/activities"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 py-1 transition-colors group ${
                    isActive ? 'font-bold text-[#1749B5]' : 'text-slate-600 hover:text-[#1749B5]'
                  }`
                }
              >
                <span>Hoạt động</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activitiesDropdown ? 'rotate-180' : ''}`} />
              </NavLink>

              {activitiesDropdown && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="rounded-2xl border border-[#E2E6EE] bg-white p-2 shadow-xl">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Danh mục Hoạt động
                    </div>
                    {activitySubItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#F5F6F8] hover:text-[#1749B5] transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Hợp tác (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setPartnershipDropdown(true)}
              onMouseLeave={() => setPartnershipDropdown(false)}
            >
              <NavLink
                to="/partnership"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 py-1 transition-colors group ${
                    isActive || location.pathname.startsWith('/partnership') || location.pathname === '/contact'
                      ? 'font-bold text-[#1749B5]'
                      : 'text-slate-600 hover:text-[#1749B5]'
                  }`
                }
              >
                <span>Hợp tác</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${partnershipDropdown ? 'rotate-180' : ''}`} />
              </NavLink>

              {partnershipDropdown && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="rounded-2xl border border-[#E2E6EE] bg-white p-2 shadow-xl">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Kênh Đối tác & Doanh nghiệp
                    </div>
                    {partnershipSubItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#F5F6F8] hover:text-[#1749B5] transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Authenticated User & 5. Đăng nhập */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-[#10182D] leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] font-mono text-[#1749B5]">
                    {currentRole === 'admin'
                      ? 'BCN (Admin)'
                      : currentRole === 'leader'
                      ? `Trưởng ${getUnitShortName(currentUser.unit)}`
                      : currentRole === 'member'
                      ? `Thành viên (${getUnitShortName(currentUser.unit)})`
                      : 'Ứng viên'}
                  </span>
                </div>

                {currentRole === 'admin' || currentRole === 'sysadmin' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1749B5] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#10182D] shadow-xs"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Bảng Quản trị</span>
                  </Link>
                ) : (
                  <Link
                    to="/portal"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1749B5] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#10182D] shadow-xs"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Member Portal</span>
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
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#10182D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1749B5] shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Đăng nhập</span>
              </Link>
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
        <div className="fixed inset-0 top-16 z-40 bg-white/98 backdrop-blur-md lg:hidden p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-6">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Điều hướng chính
            </div>

            <div className="flex flex-col space-y-3 text-base font-semibold">
              <Link to="/" className="text-slate-800 hover:text-[#1749B5] py-1">
                1. Trang chủ
              </Link>
              <Link to="/about" className="text-slate-800 hover:text-[#1749B5] py-1">
                2. Về chúng tôi
              </Link>

              <div className="py-1">
                <Link to="/activities" className="text-slate-800 hover:text-[#1749B5] block">
                  3. Hoạt động
                </Link>
                <div className="pl-4 pt-2 space-y-2 border-l-2 border-slate-100 mt-1">
                  {activitySubItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block text-xs font-medium text-slate-600 hover:text-[#1749B5]"
                    >
                      • {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="py-1">
                <Link to="/partnership" className="text-slate-800 hover:text-[#1749B5] block">
                  4. Hợp tác
                </Link>
                <div className="pl-4 pt-2 space-y-2 border-l-2 border-slate-100 mt-1">
                  {partnershipSubItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block text-xs font-medium text-slate-600 hover:text-[#1749B5]"
                    >
                      • {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/login" className="text-slate-800 hover:text-[#1749B5] py-1">
                5. Cổng Thành viên (Đăng nhập)
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    Đang đăng nhập: <strong className="text-slate-800">{currentUser.fullName}</strong>
                  </div>
                  {currentRole === 'admin' ? (
                    <Link
                      to="/admin"
                      className="block w-full py-2.5 text-center bg-[#1749B5] text-white rounded-xl text-sm font-semibold"
                    >
                      Mở Bảng Quản trị
                    </Link>
                  ) : (
                    <Link
                      to="/portal"
                      className="block w-full py-2.5 text-center bg-[#1749B5] text-white rounded-xl text-sm font-semibold"
                    >
                      Mở Member Portal
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
                  className="block w-full py-2.5 text-center bg-[#10182D] text-white rounded-xl text-sm font-semibold"
                >
                  Đăng nhập Thành viên BK-IC
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
