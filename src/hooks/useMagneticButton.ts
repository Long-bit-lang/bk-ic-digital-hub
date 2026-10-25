// Subtle Magnetic Button Hook for Desktop Pointer Devices
import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapSetup';

interface MagneticOptions {
  maxOffset?: number; // max pixels offset (keep restrained: 4 - 8px)
  speed?: number;
}

export function useMagneticButton<T extends HTMLElement = HTMLButtonElement>(options: MagneticOptions = {}) {
  const { maxOffset = 6, speed = 0.3 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only apply on fine pointer devices (desktop mouse/trackpad), never touch
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: speed, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: speed, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Bound within reasonable offset
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 0.25));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * 0.25));

      xTo(clampedX);
      yTo(clampedY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [maxOffset, speed]);

  return ref;
}
