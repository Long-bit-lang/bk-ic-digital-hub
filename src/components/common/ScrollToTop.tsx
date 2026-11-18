// BK-IC Digital Hub — Global Scroll Restoration Component
// Automatically scrolls window to top upon route navigation, while preserving hash anchors
// and preserving scroll position during in-page tab transitions under /activities
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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

function isActivityTabPath(path: string): boolean {
  const normalized = path.replace(/\/+$/, '') || '/';
  return ACTIVITY_TAB_PATHS.has(normalized);
}

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // If there is an anchor hash (e.g., /about#album), smoothly scroll to that specific element
    if (hash) {
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);

      return () => clearTimeout(timer);
    }

    // When switching between tabs inside /activities, preserve scroll position so it feels like a pure tab transition without page reload/jump
    if (isActivityTabPath(prevPathname) && isActivityTabPath(pathname)) {
      return;
    }

    // Default behavior for all standard page changes: scroll instantly to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Fallback for containers with separate overflow scrolling
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};
