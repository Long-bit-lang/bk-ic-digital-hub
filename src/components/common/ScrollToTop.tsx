// BK-IC Digital Hub — Global Scroll Restoration Component
// Automatically scrolls window to top upon route navigation, while preserving hash anchors
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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

    // Default behavior for all standard route changes: scroll instantly to the top
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

