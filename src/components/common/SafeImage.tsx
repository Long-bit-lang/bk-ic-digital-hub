// BK-IC Safe Resilient Image Component with Zero Broken Images Guarantee
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  focalPoint?: string;
  title?: string;
  tag?: string;
  priority?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-16/9',
  focalPoint = 'center center',
  title,
  tag,
  priority = false
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasFailed(true);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${aspectRatio} ${containerClassName}`}
    >
      {!hasFailed ? (
        <>
          <img
            src={currentSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={handleError}
            onLoad={() => setIsLoaded(true)}
            style={{ objectPosition: focalPoint }}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
          />
          {!isLoaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-200/80" />
          )}
        </>
      ) : (
        /* Styled Fallback Editorial Container */
        <div className="flex h-full w-full flex-col justify-end bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950 p-6 text-white">
          <div className="space-y-1.5">
            {tag && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                {tag}
              </span>
            )}
            <div className="text-sm font-bold text-white line-clamp-2">
              {title || alt}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>BK-IC · Đổi mới Sáng tạo DUT</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
