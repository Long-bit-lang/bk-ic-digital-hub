// GSAP Setup & Central Registration for BK-IC Digital Hub
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Set default config
  gsap.config({
    autoSleep: 60,
    nullTargetWarn: false
  });
}

export { gsap, ScrollTrigger };
