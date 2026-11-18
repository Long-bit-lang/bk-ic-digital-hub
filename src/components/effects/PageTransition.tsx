// BK-IC Digital Hub — Page Transition Component
// Smooth animated page cross-fade and subtle lift upon route change
import React, { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export const PageTransition: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();

  // Ensure scroll is at top when new page enters
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  if (shouldReduceMotion) {
    return <div className="w-full flex-1 flex flex-col">{outlet}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
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

