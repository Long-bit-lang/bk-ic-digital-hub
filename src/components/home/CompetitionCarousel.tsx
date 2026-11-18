// BK-IC Digital Hub — Responsive Competition Carousel Component
// Desktop: 3 cards | Tablet: 2 cards | Mobile: 1 card
// Integrated Center-Flanking Arrow Controls (mũi tên nằm cùng hàng với các thẻ cuộc thi)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CompetitionCard } from './CompetitionCard';
import type { CompetitionItem } from '../../data/homeData';

interface CompetitionCarouselProps {
  items: CompetitionItem[];
}

export const CompetitionCarousel: React.FC<CompetitionCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive visible count tracking
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      const baseVisible = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
      setVisibleCount(Math.min(Math.max(1, items.length), baseVisible));
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  // Ensure index stays in valid bounds when visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch swipe support for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const threshold = 40; // minimum swipe distance
    if (touchDeltaX.current < -threshold) {
      handleNext();
    } else if (touchDeltaX.current > threshold) {
      handlePrev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const showControls = items.length > visibleCount;

  return (
    <div
      ref={containerRef}
      className="relative focus:outline-hidden group/carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Gallery các cuộc thi sáng tạo"
      role="region"
    >
      {/* Relative Track Container with Integrated Center-Flanking Arrow Controls */}
      <div className="relative">
        {/* Left Arrow Button (cùng hàng và căn giữa theo chiều dọc với các thẻ cuộc thi) */}
        {showControls && (
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Cuộc thi trước"
            className={`absolute left-0 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border shadow-md ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none sm:opacity-40 sm:cursor-not-allowed border-slate-200 bg-white/70 text-slate-300 shadow-none'
                : 'opacity-100 bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-700 hover:bg-[#1749B5] hover:text-white hover:border-[#1749B5] shadow-blue-950/10 hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Overflow Hidden Track Container */}
        <div
          className={`overflow-hidden -mx-3 px-1 py-2 ${items.length <= 2 ? 'max-w-4xl mx-auto' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`flex transition-transform duration-500 ease-out will-change-transform ${
              items.length <= 2 ? 'justify-center' : ''
            }`}
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`px-3 shrink-0 ${
                  items.length === 1
                    ? 'w-full max-w-lg mx-auto'
                    : items.length === 2
                      ? 'w-full md:w-1/2'
                      : 'w-full md:w-1/2 lg:w-1/3'
                }`}
                style={{ boxSizing: 'border-box' }}
              >
                <CompetitionCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button (cùng hàng và căn giữa theo chiều dọc với các thẻ cuộc thi) */}
        {showControls && (
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Cuộc thi kế tiếp"
            className={`absolute right-0 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border shadow-md ${
              currentIndex >= maxIndex
                ? 'opacity-0 pointer-events-none sm:opacity-40 sm:cursor-not-allowed border-slate-200 bg-white/70 text-slate-300 shadow-none'
                : 'opacity-100 bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-700 hover:bg-[#1749B5] hover:text-white hover:border-[#1749B5] shadow-blue-950/10 hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Dot Indicators */}
      {showControls && maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-5 sm:mt-6" aria-hidden="true">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Chuyển đến nhóm cuộc thi ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-6 bg-[#1749B5]'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
