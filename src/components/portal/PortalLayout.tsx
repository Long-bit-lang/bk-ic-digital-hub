// BK-IC Member Portal Layout (Clean Linear / Apple Productivity Style)
// Fully optimized for Desktop, Tablet, and Mobile (<768px)
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { QRScannerModal } from '../qr/QRScannerModal';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Calendar, 
  QrCode, 
  Award, 
  MessageSquare, 
  LogOut, 
  ChevronRight,
  ShieldCheck, 
  Home,
  Menu,
  X,
  MoreHorizontal
} from 'lucide-react';

export const PortalLayout: React.FC = () => {
  const { currentUser, currentRole, logout } = useApp();
  const [showQRScanner, setShowQRScanner] = useState(false);
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

  // If user is guest, redirect to login
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-slate-600">Vui lòng đăng nhập để truy cập Cổng Thành viên.</p>
          <Link to="/login" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // If user is applicant, redirect to pending
  if (currentUser.role === 'applicant') {
    navigate('/pending-approval');
    return null;
  }

  const portalNav = [
    { to: '/portal', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { to: '/portal/profile', label: 'Hồ sơ thành viên', icon: UserIcon },
    { to: '/portal/sessions', label: 'Lịch sinh hoạt', icon: Calendar },
    { to: '/portal/attendance', label: 'Điểm danh cá nhân', icon: QrCode },
    { to: '/portal/evaluations', label: 'Đánh giá rèn luyện', icon: Award },
    { to: '/portal/feedback', label: 'Góp ý sau buổi', icon: MessageSquare }
  ];

  // Mobile bottom navigation items (Top 4 essential routes + "Thêm" drawer trigger)
  const bottomNavItems = [
    { to: '/portal', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { to: '/portal/sessions', label: 'Lịch SH', icon: Calendar },
    { to: '/portal/attendance', label: 'Điểm danh', icon: QrCode },
    { to: '/portal/profile', label: 'Hồ sơ', icon: UserIcon }
  ];

  const isMoreMenuActive = location.pathname.startsWith('/portal/evaluations') || 
                           location.pathname.startsWith('/portal/feedback') ||
                           mobileMenuOpen;

  const displayUnit = currentUser.committee 
    ? currentUser.committee.replace('ban-', 'Ban ').toUpperCase() 
    : (currentUser.unit || 'BK-IC MEMBER');

  const canAccessAdmin = currentUser.role === 'admin' || 
                         currentUser.role === 'sysadmin' || 
                         currentUser.role === 'leader' ||
                         currentRole === 'admin' ||
                         currentRole === 'sysadmin' ||
                         currentRole === 'leader';

  return (
    <div className="min-h-screen md:h-screen bg-[#F8FAFC] flex flex-col md:flex-row md:overflow-hidden">
      {/* ========================================================
          MOBILE TOP HEADER (< md)
          Compact, neat, contains branding, mini user badge,
          quick QR check-in and menu toggle.
      ======================================================== */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs pt-[env(safe-area-inset-top,0px)]">
        <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo size="sm" />
          </div>

          {/* Right Area: Compact User Chip + Quick QR + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Compact User Chip */}
            <div 
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-blue-50/80 border border-blue-100 hover:bg-blue-100/70 transition cursor-pointer max-w-[130px] xs:max-w-[160px] sm:max-w-[200px]"
              title={`${currentUser.fullName} (${displayUnit})`}
            >
              <div className="h-6 w-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                  {currentUser.fullName}
                </div>
                <div className="text-[9px] font-mono font-semibold text-blue-700 truncate leading-none mt-0.5">
                  {displayUnit}
                </div>
              </div>
            </div>

            {/* Quick QR Scanner Trigger Button */}
            <button
              onClick={() => setShowQRScanner(true)}
              className="h-9 w-9 rounded-xl bg-[#245BFA] text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition shadow-xs shrink-0"
              title="Quét QR Điểm danh"
              aria-label="Quét QR Điểm danh"
            >
              <QrCode className="h-4 w-4" />
            </button>

            {/* Mobile Menu Drawer Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="h-9 w-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition shrink-0"
              title="Menu điều hướng"
              aria-label="Mở menu điều hướng"
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
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 shrink-0 flex-col md:h-screen md:overflow-hidden">
        {/* Brand & Member Info */}
        <div className="shrink-0">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Logo />
            <Link to="/" className="text-slate-400 hover:text-slate-600" title="Về trang chủ">
              <Home className="h-4 w-4" />
            </Link>
          </div>

          {/* Member Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
              {displayUnit}
            </div>
            <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {currentUser.fullName}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              MSSV: {currentUser.studentId}
            </div>
          </div>

          {/* Quick Check-in Button */}
          <div className="px-4 mb-3">
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#245BFA] text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition"
            >
              <QrCode className="h-4 w-4" />
              <span>Quét QR Điểm danh</span>
            </button>
          </div>
        </div>

        {/* Navigation Items: Scrolls independently if needed */}
        <nav className="px-2 py-1 space-y-1 flex-1 overflow-y-auto min-h-0">
          {portalNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition ${
                    isActive
                      ? 'bg-slate-100 text-[#245BFA] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions: Fixed at bottom of sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2 shrink-0 bg-white z-10">
          {canAccessAdmin && (
            <Link
              to="/admin"
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Bảng Quản trị Admin</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-red-600 transition rounded-xl hover:bg-red-50"
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
      <main className="flex-1 min-h-0 md:h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* ========================================================
          MOBILE BOTTOM NAVIGATION (< md)
          Fixed bar for 4 core tabs + "Thêm" drawer trigger.
          Touch target >= 44px, safe area padding for iPhone.
      ======================================================== */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Mobile Navigation"
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
                      ? 'text-[#245BFA] font-bold'
                      : 'text-slate-500 font-medium hover:text-slate-800'
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
                      <span className="absolute top-0 w-8 h-0.5 bg-[#245BFA] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* "Thêm" Button opens the full drawer */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              isMoreMenuActive
                ? 'text-[#245BFA] font-bold'
                : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
            aria-label="Mở rộng menu"
          >
            <MoreHorizontal className={`h-5 w-5 transition-transform ${mobileMenuOpen ? 'scale-110' : ''}`} />
            <span className="text-[10px] leading-tight mt-0.5 tracking-tight">
              Thêm
            </span>
            {isMoreMenuActive && !mobileMenuOpen && (
              <span className="absolute top-1 right-3 h-2 w-2 bg-[#245BFA] rounded-full" />
            )}
          </button>
        </div>
      </nav>

      {/* ========================================================
          MOBILE DRAWER SHEET (< md)
          Clean slide-over sheet containing all features,
          profile badge, QR trigger, and role-based links.
      ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container (Slide from right) */}
          <div className="relative ml-auto w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] z-50 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Logo size="sm" disableLink={true} />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 w-10 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-95"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content inside Drawer */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
              {/* Detailed Member Profile Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100/70 px-2 py-0.5 rounded-md">
                    {displayUnit}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    BK-IC DUT
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  MSSV: {currentUser.studentId}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {currentUser.faculty} {currentUser.classId ? `· Lớp ${currentUser.classId}` : ''}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {currentUser.email}
                </div>
              </div>

              {/* Prominent Quick QR Check-in inside Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowQRScanner(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#245BFA] text-white text-xs font-bold shadow-xs hover:bg-blue-700 active:scale-98 transition"
              >
                <QrCode className="h-4 w-4" />
                <span>Quét QR Điểm danh Buổi sinh hoạt</span>
              </button>

              {/* Complete Navigation List */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                  Chức năng Cổng Thành viên
                </div>
                {portalNav.map((item) => {
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
                            ? 'bg-blue-50 text-[#245BFA] font-bold border-l-4 border-[#245BFA]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    </NavLink>
                  );
                })}
              </div>

              {/* Admin Portal Link (if privileged) */}
              {canAccessAdmin && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                    Quản trị Hệ thống
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Bảng Quản trị Admin</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-100 space-y-2 shrink-0 bg-slate-50/50">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 transition rounded-xl hover:bg-white"
              >
                <Home className="h-4 w-4" />
                <span>Về Website Công khai</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:text-red-700 transition rounded-xl hover:bg-red-50 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất khỏi hệ thống</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global QR Scanner Modal for Member */}
      {showQRScanner && (
        <QRScannerModal onClose={() => setShowQRScanner(false)} />
      )}
    </div>
  );
};
