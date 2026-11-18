// BK-IC Digital Hub — Page Transition Component
// Smooth animated page cross-fade and subtle lift upon top-level page change,
// while keeping nested tab layouts (e.g. /activities tabs) mounted in place without page transition or scroll jump
import React, { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const ACTIVITY_TAB_PATHS = new Set([
  '/activities',
  '/activities/sinh-hoat',
  '/activities/workshop',
  '/activities/cuoc-thi',
  '/activities/du-an',
  '/activities/bk-shark',
  '/activities/tuyen-thanh-vien',
  '/activities/internal',
  '/activities/workshops',
  '/activities/competitions',
  '/activities/companion-projects',
  '/activities/recruitment'
]);

function getPageGroupKey(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (ACTIVITY_TAB_PATHS.has(normalized)) {
    return '/activities-tabs-hub';
  }
  return normalized;
}

export const PageTransition: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();
  const pageGroupKey = getPageGroupKey(location.pathname);
  const prevGroupKeyRef = useRef<string>(pageGroupKey);

  // Ensure scroll is at top only when navigating to a genuinely different page (not when switching tabs inside /activities)
  useEffect(() => {
    const prevGroupKey = prevGroupKeyRef.current;
    prevGroupKeyRef.current = pageGroupKey;

    if (prevGroupKey === '/activities-tabs-hub' && pageGroupKey === '/activities-tabs-hub') {
      return;
    }

    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pageGroupKey, location.hash]);

  if (shouldReduceMotion) {
    return <div className="w-full flex-1 flex flex-col">{outlet}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageGroupKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.14, ease: 'easeIn' } }}
        transition={{
          duration: 0.28,
          ease: [0.16, 1, 0.3, 1] // Snappy, elegant ease-out curve
        }}
        className="w-full flex-1 flex flex-col"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
};
