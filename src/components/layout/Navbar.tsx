// BK-IC Minimalist Editorial Navigation Bar
// Scroll-based animated layout:
// - Top State: Floating pill centered at ~76% viewport width
// - Scrolled State: Full-width 100vw edge-to-edge navbar with Logo far left, Login far right, Menu dead-center
import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activitiesDropdown, setActivitiesDropdown] = useState(false);
  const [partnershipDropdown, setPartnershipDropdown] = useState(false);

  const activitiesRef = useRef<HTMLDivElement>(null);
  const partnershipRef = useRef<HTMLDivElement>(null);

  const { currentUser, currentRole, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection with requestAnimationFrame & passive listener for 60fps performance
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      // Threshold 45-50px between Top State and Scrolled State
      setScrolled(window.scrollY > 48);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    // Initial check on mount
    updateScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActivitiesDropdown(false);
    setPartnershipDropdown(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activitiesRef.current && !activitiesRef.current.contains(event.target as Node)) {
        setActivitiesDropdown(false);
      }
      if (partnershipRef.current && !partnershipRef.current.contains(event.target as Node)) {
        setPartnershipDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivitiesDropdown(false);
        setPartnershipDropdown(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 6 Subcategories for Hoạt động (clean labels only, no symbols or descriptions)
  const activitySubItems = [
    { to: '/activities/internal', label: 'Sinh hoạt nội bộ' },
    { to: '/activities/workshops', label: 'Workshop thường niên' },
    { to: '/activities/competitions', label: 'Cuộc thi sáng tạo' },
    { to: '/activities/companion-projects', label: 'Dự án đồng hành' },
    { to: '/activities/bk-shark', label: 'Sân khấu BK Shark' },
    { to: '/activities/recruitment', label: 'Tuyển thành viên mới' }
  ];

  // 4 Subcategories for Hợp tác (clean labels only, no symbols or descriptions)
  const partnershipSubItems = [
    { to: '/partnership', label: 'Tổng quan Hợp tác' },
    { to: '/partnership/companion-project', label: 'Dự án đồng hành & Catalogue' },
    { to: '/partnership/partners', label: 'Đối tác chiến lược' },
    { to: '/partnership/business', label: 'Hợp tác doanh nghiệp' }
  ];

  const isAboutActive = location.pathname === '/about';
  const isActivitiesActive = location.pathname.startsWith('/activities');
  const isPartnershipActive = location.pathname.startsWith('/partnership');
  const isLoginActive = location.pathname === '/login';

  return (
    <>
      {/* Outer Sticky Wrapper:
          - Top State: floating with padding-top pt-3 sm:pt-4
          - Scrolled State: full-bleed pt-0 pb-0 */}
      <header
        className={`sticky top-0 z-50 w-full pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          scrolled ? 'pt-0 pb-0' : 'pt-3 sm:pt-4 pb-2'
        }`}
      >
        {/* Navigation Container:
            - Top State: Floating pill at 76% viewport width (w-[92%] sm:w-[86%] lg:w-[76%] rounded-[32px])
            - Scrolled State: 100vw full-width edge-to-edge bar (w-full rounded-[0px])
            - Reverse animation: Smoothly shrinks back from 100% to 76% and morphs from flat to capsule pill */}
        <div
          className={`mx-auto pointer-events-auto flex h-16 items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            scrolled
              ? 'w-full rounded-[0px] border border-b-[#E2E6EE] border-t-transparent border-x-transparent bg-white/95 backdrop-blur-xl shadow-xs px-6 sm:px-10 lg:px-14'
              : 'w-[92%] sm:w-[86%] lg:w-[76%] rounded-[32px] bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-md shadow-blue-950/5 px-6 sm:px-8 lg:px-10'
          }`}
        >
          {/* ========================================================================= */}
          {/* DESKTOP VIEW (>= 1024px): 3-Column Balanced Grid (1fr auto 1fr)          */}
          {/* ========================================================================= */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] w-full h-full items-center">

            {/* COLUMN 1 (LEFT): Brand Logo placed at the left of the pill */}
            <div className="flex items-center justify-start h-full">
              <div className="shrink-0 flex items-center">
                {/* Logo serves as the return link to Home */}
                <Logo showSubtitle={false} size="lg" />
              </div>
            </div>

            {/* COLUMN 2 (CENTER): Exactly Centered Menu (Về chúng tôi | Hoạt động | Hợp tác) */}
            <nav className="flex items-center justify-center shrink-0 gap-1.5 xl:gap-3 text-[14px] font-medium text-[#20232B] px-2">
              {/* 1. Về chúng tôi */}
              <NavLink
                to="/about"
                className={`group relative px-3.5 py-2 rounded-xl transition-colors duration-200 ${isAboutActive
                    ? 'text-[#1749B5] font-bold'
                    : 'text-slate-600 hover:text-[#1749B5]'
                  }`}
              >
                <span>Về chúng tôi</span>
                {/* Animated Hover & Active Underline (slides out from left) */}
                <span
                  className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-[#1749B5] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isAboutActive
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 origin-left'
                    }`}
                />
              </NavLink>

              {/* 2. Hoạt động (Dropdown) */}
              <div
                ref={activitiesRef}
                className="relative"
                onMouseEnter={() => setActivitiesDropdown(true)}
                onMouseLeave={() => setActivitiesDropdown(false)}
              >
                <button
                  type="button"
                  onClick={() => setActivitiesDropdown(!activitiesDropdown)}
                  className={`group relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors duration-200 cursor-pointer ${isActivitiesActive
                      ? 'text-[#1749B5] font-bold'
                      : 'text-slate-600 hover:text-[#1749B5]'
                    }`}
                >
                  <span>Hoạt động</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${activitiesDropdown ? 'rotate-180 text-[#1749B5]' : 'text-slate-400 group-hover:text-[#1749B5]'
                      }`}
                  />
                  {/* Animated Hover & Active Underline (slides out from left) */}
                  <span
                    className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-[#1749B5] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActivitiesActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 origin-left'
                      }`}
                  />
                </button>

                {/* Activities Dropdown Menu */}
                {activitiesDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl border border-[#E2E6EE] bg-white p-2 shadow-xl shadow-slate-900/10 space-y-0.5">
                      {activitySubItems.map((item) => {
                        const isSubActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setActivitiesDropdown(false)}
                            className={`block rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${isSubActive
                                ? 'bg-[#1749B5] text-white'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#1749B5]'
                              }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Hợp tác (Dropdown) */}
              <div
                ref={partnershipRef}
                className="relative"
                onMouseEnter={() => setPartnershipDropdown(true)}
                onMouseLeave={() => setPartnershipDropdown(false)}
              >
                <button
                  type="button"
                  onClick={() => setPartnershipDropdown(!partnershipDropdown)}
                  className={`group relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors duration-200 cursor-pointer ${isPartnershipActive
                      ? 'text-[#1749B5] font-bold'
                      : 'text-slate-600 hover:text-[#1749B5]'
                    }`}
                >
                  <span>Hợp tác</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${partnershipDropdown ? 'rotate-180 text-[#1749B5]' : 'text-slate-400 group-hover:text-[#1749B5]'
                      }`}
                  />
                  {/* Animated Hover & Active Underline (slides out from left) */}
                  <span
                    className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-[#1749B5] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isPartnershipActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 origin-left'
                      }`}
                  />
                </button>

                {/* Partnership Dropdown Menu */}
                {partnershipDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-2xl border border-[#E2E6EE] bg-white p-2 shadow-xl shadow-slate-900/10 space-y-0.5">
                      {partnershipSubItems.map((item) => {
                        const isSubActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setPartnershipDropdown(false)}
                            className={`block rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${isSubActive
                                ? 'bg-[#1749B5] text-white'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#1749B5]'
                              }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* COLUMN 3 (RIGHT): Auth / Profile Actions placed at the right of the pill */}
            <div className="flex items-center justify-end h-full">
              <div className="shrink-0 flex items-center gap-3">
                {currentUser ? (
                  <div className="flex items-center gap-2.5">
                    <div className="hidden xl:flex flex-col items-end text-right">
                      <span className="text-xs font-bold text-[#10182D] leading-tight">
                        {currentUser.fullName}
                      </span>
                      <span className="text-[10px] text-[#1749B5] font-semibold">
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
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1749B5] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#10182D] shadow-xs"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Bảng Quản trị</span>
                      </Link>
                    ) : (
                      <Link
                        to="/portal"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1749B5] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#10182D] shadow-xs"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Member Portal</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                      title="Đăng xuất khỏi hệ thống"
                    >
                      <LogIn className="h-4 w-4 rotate-180" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition shadow-xs ${isLoginActive
                        ? 'bg-[#1749B5] text-white ring-2 ring-[#1749B5]/30'
                        : 'bg-[#10182D] text-white hover:bg-[#1749B5]'
                      }`}
                  >
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* MOBILE VIEW (< 1024px): Responsive Header                                */}
          {/* ========================================================================= */}
          <div className="flex lg:hidden w-full h-full items-center justify-between">
            {/* Mobile Brand Logo */}
            <div className="shrink-0 flex items-center">
              <Logo showSubtitle={false} size="md" />
            </div>

            {/* Mobile Actions: User status / Login + Hamburger button */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <Link
                  to={currentRole === 'admin' || currentRole === 'sysadmin' ? '/admin' : '/portal'}
                  className="rounded-full p-2 text-[#1749B5] bg-blue-50 hover:bg-blue-100 transition"
                  title="Mở Portal"
                >
                  <UserIcon className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-[#10182D] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1749B5] transition shadow-xs"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER NAVIGATION (Backdrop + Slide Overlay)                        */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 sm:top-20 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="h-full max-w-sm ml-auto bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Điều hướng
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Main Links (Without "Trang chủ" since Logo navigates Home) */}
              <div className="space-y-1.5">
                {/* Về chúng tôi */}
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block p-3 rounded-xl text-sm font-semibold transition ${isAboutActive
                      ? 'bg-[#1749B5]/10 text-[#1749B5] font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  Về chúng tôi
                </Link>

                {/* Hoạt động + Subcategories */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2 space-y-1">
                  <Link
                    to="/activities"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block p-2 rounded-lg text-sm font-semibold transition ${isActivitiesActive
                        ? 'text-[#1749B5] font-bold'
                        : 'text-slate-800 hover:text-[#1749B5]'
                      }`}
                  >
                    Hoạt động
                  </Link>

                  <div className="pl-3 pt-1 space-y-0.5 border-t border-slate-200/60">
                    {activitySubItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-2.5 py-1.5 rounded-lg text-xs transition ${location.pathname === item.to
                            ? 'bg-[#1749B5] text-white font-bold'
                            : 'text-slate-600 hover:text-[#1749B5] hover:bg-white'
                          }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Hợp tác + Subcategories */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2 space-y-1">
                  <Link
                    to="/partnership"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block p-2 rounded-lg text-sm font-semibold transition ${isPartnershipActive
                        ? 'text-[#1749B5] font-bold'
                        : 'text-slate-800 hover:text-[#1749B5]'
                      }`}
                  >
                    Hợp tác
                  </Link>

                  <div className="pl-3 pt-1 space-y-0.5 border-t border-slate-200/60">
                    {partnershipSubItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-2.5 py-1.5 rounded-lg text-xs transition ${location.pathname === item.to
                            ? 'bg-[#1749B5] text-white font-bold'
                            : 'text-slate-600 hover:text-[#1749B5] hover:bg-white'
                          }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Đăng nhập */}
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block p-3 rounded-xl text-sm font-semibold transition ${isLoginActive
                      ? 'bg-[#1749B5]/10 text-[#1749B5] font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  Đăng nhập
                </Link>
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    Đang đăng nhập: <strong className="text-slate-800">{currentUser.fullName}</strong>
                  </div>
                  {currentRole === 'admin' || currentRole === 'sysadmin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 text-center bg-[#1749B5] text-white rounded-xl text-xs font-bold"
                    >
                      Mở Bảng Quản trị
                    </Link>
                  ) : (
                    <Link
                      to="/portal"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 text-center bg-[#1749B5] text-white rounded-xl text-xs font-bold"
                    >
                      Mở Member Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-2 text-center border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-[#10182D] text-white rounded-xl text-xs font-bold hover:bg-[#1749B5] transition shadow-xs"
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
