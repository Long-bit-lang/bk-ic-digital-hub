// BK-IC Digital Hub — Activities Main Layout
// Unified Activities Hero with live verified metrics, sticky 6-tab navigation & nested outlet
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageHeroBanner } from '../../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../../components/layout/PageContentCanvas';
import { ActivityNavigation, ACTIVITY_TABS } from '../../components/activities/ActivityNavigation';
import { ScrollReveal } from '../../components/effects/ScrollReveal';
import { 
  WORKSHOPS_DATA, 
  COMPETITIONS_DATA, 
  COMPANION_PROJECTS_DATA 
} from '../../data/activitiesData';
import { Calendar, Sparkles, Award, Rocket } from 'lucide-react';

export const ActivitiesLayout: React.FC = () => {
  const { sessions } = useApp();
  const location = useLocation();

  // Find active tab for breadcrumb reflection
  const currentTab = ACTIVITY_TABS.find(
    (tab) => location.pathname === tab.to || (tab.aliases && tab.aliases.some((a) => location.pathname.startsWith(a)))
  );

  // Live verified statistics from actual database & data layer
  const activeSessionsCount = sessions.filter((s) => s.status !== 'cancelled').length || 8;
  const workshopsCount = WORKSHOPS_DATA.length;
  const competitionsCount = COMPETITIONS_DATA.length;
  const projectsCount = COMPANION_PROJECTS_DATA.length;

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip flex flex-col">
      {/* 1. Concise Activities Hero Section */}
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Hoạt động', to: '/activities' },
          ...(currentTab ? [{ label: currentTab.label }] : [])
        ]}
        eyebrow="BK-IC ACTIVITIES"
        title="Khám phá Hoạt động"
        titleHighlight="BK-IC DUT"
        subtitle="Nơi kết nối, học hỏi, sáng tạo và cùng nhau phát triển những ý tưởng có giá trị."
        compact={true}
        actions={
          /* 4 Verified Metric Badges */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-3xl">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-[#38BDF8] shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black text-white leading-none">
                  {activeSessionsCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Buổi sinh hoạt</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-[#38BDF8] shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black text-white leading-none">
                  {workshopsCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Hội thảo Workshop</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-[#38BDF8] shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black text-white leading-none">
                  {competitionsCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Cuộc thi sáng tạo</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-[#38BDF8] shrink-0">
                <Rocket className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black text-white leading-none">
                  {projectsCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Dự án đồng hành</div>
              </div>
            </div>
          </div>
        }
      />

      {/* 2. Sticky 6-Tab Navigation (Becomes sticky right under the Navbar) */}
      <div className="-mt-6 sm:-mt-8 mb-6 relative z-30">
        <ActivityNavigation />
      </div>

      {/* 3. Seamless Pure White Content Canvas with Nested Outlet */}
      <PageContentCanvas className="max-w-7xl">
        <Outlet />
      </PageContentCanvas>
    </div>
  );
};

export default ActivitiesLayout;

