// BK-IC Admin Portal Layout (Linear / Modern Analytics Style)
// Fully optimized for Desktop, Tablet, and Mobile (<768px)
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  QrCode, 
  Award, 
  MessageSquare, 
  FileText, 
  Sliders, 
  Settings, 
  LogOut, 
  ArrowLeft,
  ShieldCheck, 
  Building2,
  ExternalLink,
  Menu,
  X,
  MoreHorizontal,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { getUnitShortName, getUnitFullName } from '../../utils/unitDisplay';

export const AdminLayout: React.FC = () => {
  const { currentUser, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Role verification (Section 7 & 12)
  if (!currentUser || (currentRole !== 'admin' && currentRole !== 'sysadmin' && currentRole !== 'leader')) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
        <div className="max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold">Khu vực Giới hạn Quyền Quản trị</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bạn cần tài khoản thuộc Ban Quản trị (Admin) hoặc BCN (Leader) của BK-IC để truy cập trang này.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700">
              Về trang chủ
            </Link>
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700">
              Chuyển tài khoản Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { to: '/admin', label: 'Tổng quan & Thống kê', icon: LayoutDashboard, end: true },
    { to: '/admin/members', label: 'Quản lý Thành viên', icon: Users },
    { to: '/admin/sessions', label: 'Phiên sinh hoạt & QR', icon: Calendar },
    { to: '/admin/attendance', label: 'Dữ liệu Điểm danh', icon: QrCode },
    { to: '/admin/evaluations', label: 'Đánh giá Rèn luyện', icon: Award },
    { to: '/admin/feedback', label: 'Phản hồi Sinh hoạt', icon: MessageSquare },
    { to: '/admin/applications', label: 'Đơn Tuyển dụng', icon: FileText },
    { to: '/admin/content', label: 'Quản trị Nội dung (CMS)', icon: Sliders },
    { to: '/admin/settings', label: 'Cấu hình Hệ thống', icon: Settings }
  ];

  // Mobile bottom navigation items (Top 4 critical admin tasks + "Thêm" drawer trigger)
  const bottomNavItems = [
    { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { to: '/admin/members', label: 'Thành viên', icon: Users },
    { to: '/admin/sessions', label: 'Phiên SH', icon: Calendar },
    { to: '/admin/attendance', label: 'Điểm danh', icon: QrCode }
  ];

  const isMoreMenuActive = location.pathname.startsWith('/admin/evaluations') ||
                           location.pathname.startsWith('/admin/feedback') ||
                           location.pathname.startsWith('/admin/applications') ||
                           location.pathname.startsWith('/admin/content') ||
                           location.pathname.startsWith('/admin/settings') ||
                           mobileMenuOpen;

  const roleTitle = currentRole === 'admin' || currentUser.role === 'admin'
    ? 'Quản trị viên Cấp cao'
    : getUnitFullName(currentUser.unit);

  const roleBadgeShort = currentRole === 'admin' || currentUser.role === 'admin'
    ? 'Admin'
    : getUnitShortName(currentUser.unit);

  return (
    <div className="min-h-screen md:h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row md:overflow-hidden">
      {/* ========================================================
          MOBILE TOP HEADER (< md)
          Compact dark header with logo, compact admin badge,
          quick portal link, and menu toggle.
      ======================================================== */}
      <header className="md:hidden sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md pt-[env(safe-area-inset-top,0px)]">
        <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo isWhite={true} size="sm" />
          </div>

          {/* Right Actions: Compact Admin Badge + Portal Switch + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Compact Admin Chip */}
            <div
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800/90 border border-slate-700 hover:bg-slate-700/80 transition cursor-pointer max-w-[130px] xs:max-w-[160px] sm:max-w-[190px]"
              title={`${currentUser.fullName} (${roleTitle})`}
            >
              <div className="h-6 w-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[11px] font-bold text-white truncate leading-tight">
                  {currentUser.fullName}
                </div>
                <div className="text-[9px] font-mono font-semibold text-blue-400 truncate leading-none mt-0.5">
                  {roleBadgeShort}
                </div>
              </div>
            </div>

            {/* Quick Switch to Member Portal */}
            <Link
              to="/portal"
              className="h-9 w-9 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 transition shrink-0"
              title="Mở Cổng Thành viên"
              aria-label="Mở Cổng Thành viên"
            >
              <UserCheck className="h-4 w-4" />
            </Link>

            {/* Mobile Drawer Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="h-9 w-9 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition shrink-0"
              title="Menu quản trị"
              aria-label="Mở menu quản trị"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          DESKTOP SIDEBAR (>= md)
          100% Preserved desktop and tablet layout
      ======================================================== */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex-col md:h-screen md:overflow-hidden">
        {/* Brand & Admin Badge */}
        <div className="shrink-0">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Logo isWhite={true} />
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              title="Về Website công khai"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Admin badge */}
          <div className="mx-3 my-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{roleTitle}</span>
            </div>
            <div className="text-xs font-bold text-white truncate mt-1">
              {currentUser.fullName}
            </div>
            <div className="text-[11px] text-slate-400 font-mono truncate">
              {currentUser.email}
            </div>
          </div>
        </div>

        {/* Navigation Links: Scrolls independently if menu is long */}
        <nav className="px-2 py-1 space-y-1 flex-1 overflow-y-auto min-h-0">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions: Always pinned at bottom of sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0 bg-slate-900 z-10">
          <Link
            to="/portal"
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:text-white hover:bg-slate-700 transition"
          >
            <span>Mở Cổng Thành viên</span>
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-red-400 transition rounded-xl hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA
          Starts directly below header on mobile.
          Has bottom padding on mobile so fixed bottom nav doesn't cover content.
      ======================================================== */}
      <main className="flex-1 min-h-0 md:h-screen overflow-y-auto bg-slate-950 md:bg-slate-900/50 p-3 sm:p-6 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* ========================================================
          MOBILE BOTTOM NAVIGATION (< md)
          Fixed bar for 4 core tabs + "Thêm" drawer trigger.
          Touch target >= 44px, safe area padding for iPhone.
      ======================================================== */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Mobile Admin Navigation"
      >
        <div className="grid grid-cols-5 h-14">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 transition relative ${
                    isActive
                      ? 'text-blue-400 font-bold'
                      : 'text-slate-400 font-medium hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    <span className="text-[10px] leading-tight mt-0.5 tracking-tight truncate max-w-[64px]">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute top-0 w-8 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* "Thêm" Button opens the full admin drawer */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              isMoreMenuActive
                ? 'text-blue-400 font-bold'
                : 'text-slate-400 font-medium hover:text-slate-200'
            }`}
            aria-label="Mở rộng menu quản trị"
          >
            <MoreHorizontal className={`h-5 w-5 transition-transform ${mobileMenuOpen ? 'scale-110' : ''}`} />
            <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
              Thêm
            </span>
            {isMoreMenuActive && !mobileMenuOpen && (
              <span className="absolute top-1 right-3 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </nav>

      {/* ========================================================
          MOBILE DRAWER SHEET (< md)
          Clean dark slide-over sheet containing all 9 admin features,
          profile badge, portal switcher, and system settings.
      ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container (Slide from right) */}
          <div className="relative ml-auto w-[85%] max-w-sm bg-slate-900 border-l border-slate-800 text-slate-100 h-full shadow-2xl flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] z-50 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Logo isWhite={true} size="sm" disableLink={true} />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 w-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content inside Drawer */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
              {/* Detailed Admin Badge Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{roleTitle}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    BK-IC DUT
                  </span>
                </div>
                <div className="text-base font-bold text-white truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-xs text-slate-400 font-mono truncate">
                  {currentUser.email}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Mã định danh: {currentUser.memberId || currentUser.studentId}
                </div>
              </div>

              {/* Quick Jump to Member Portal */}
              <Link
                to="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-600/25 transition"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-blue-400" />
                  <span>Chuyển sang Cổng Thành viên</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              {/* Complete Admin Navigation List */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                  Chức năng Quản trị
                </div>
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-800 space-y-2 shrink-0 bg-slate-900/90">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white transition rounded-xl hover:bg-slate-800"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Về Website Công khai</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition rounded-xl hover:bg-red-500/10 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất khỏi hệ thống</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
