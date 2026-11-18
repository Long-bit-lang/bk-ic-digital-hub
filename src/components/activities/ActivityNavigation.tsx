// BK-IC Sticky Activity Navigation Component
// 6-Tab sticky navigation with smooth motion indicator, icons & mobile horizontal scroll
import React, { useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Sparkles, 
  Award, 
  Rocket, 
  Flame, 
  Users 
} from 'lucide-react';

export interface ActivityTabItem {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
}

export const ACTIVITY_TABS: ActivityTabItem[] = [
  {
    id: 'sinh-hoat',
    label: 'Sinh hoạt nội bộ',
    to: '/activities/sinh-hoat',
    icon: Calendar,
    aliases: ['/activities/internal']
  },
  {
    id: 'workshop',
    label: 'Workshop',
    to: '/activities/workshop',
    icon: Sparkles,
    aliases: ['/activities/workshops']
  },
  {
    id: 'cuoc-thi',
    label: 'Cuộc thi sáng tạo',
    to: '/activities/cuoc-thi',
    icon: Award,
    aliases: ['/activities/competitions']
  },
  {
    id: 'du-an',
    label: 'Dự án đồng hành',
    to: '/activities/du-an',
    icon: Rocket,
    aliases: ['/activities/companion-projects']
  },
  {
    id: 'bk-shark',
    label: 'BK Shark',
    to: '/activities/bk-shark',
    icon: Flame,
    aliases: []
  },
  {
    id: 'tuyen-thanh-vien',
    label: 'Tuyển thành viên',
    to: '/activities/tuyen-thanh-vien',
    icon: Users,
    aliases: ['/activities/recruitment']
  }
];

export const ActivityNavigation: React.FC = () => {
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll active tab into horizontal view on mobile without triggering vertical page scroll
  useEffect(() => {
    if (activeTabRef.current && navContainerRef.current) {
      const container = navContainerRef.current;
      const element = activeTabRef.current;
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (elementRect.left < containerRect.left || elementRect.right > containerRect.right) {
        const scrollOffset =
          element.offsetLeft - container.clientWidth / 2 + element.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
      }
    }
  }, [location.pathname]);

  const isTabActive = (tab: ActivityTabItem) => {
    if (location.pathname === tab.to) return true;
    if (tab.aliases && tab.aliases.some((alias) => location.pathname.startsWith(alias))) return true;
    return false;
  };

  return (
    <div className="sticky top-16 sm:top-[68px] z-30 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md shadow-sky-950/5 p-1.5">
          <div
            ref={navContainerRef}
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5"
          >
            {ACTIVITY_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = isTabActive(tab);

              return (
                <NavLink
                  key={tab.id}
                  ref={active ? activeTabRef : undefined}
                  to={tab.to}
                  preventScrollReset={true}
                  className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-[#0284C7]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {/* Motion Sliding Pill Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeActivityTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-sky-50 border border-sky-200/80 shadow-2xs -z-10"
                    />
                  )}

                  <Icon className={`h-4 w-4 shrink-0 transition-transform ${active ? 'scale-110 text-[#0284C7]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

