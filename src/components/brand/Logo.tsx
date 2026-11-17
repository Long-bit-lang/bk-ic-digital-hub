// BK-IC Official Brand Logo Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  isWhite?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disableLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showSubtitle = false, 
  isWhite = false,
  size = 'md',
  disableLink = false
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9.5 w-9.5',
    lg: 'h-11 sm:h-12 w-11 sm:w-12',
    xl: 'h-13 sm:h-14 w-13 sm:w-14'
  };

  const isLarge = size === 'lg' || size === 'xl';

  const content = (
    <>
      {/* Official BK-IC Emblem / Logo Icon */}
      <div 
        className={`relative flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-slate-200/80 bg-white p-0.5 shadow-xs transition-transform duration-300 group-hover:scale-105 ${
          isWhite ? 'ring-2 ring-white/20' : ''
        }`}
      >
        {!imageError ? (
          <img
            src="/images/bkic/bkic_logo.jpg"
            alt="BK-IC Official Logo"
            className="h-full w-full object-contain rounded-xl"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr from-[#245BFA] to-[#8B84F6] text-white font-black text-xs font-mono">
            IC
          </div>
        )}
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${isLarge ? 'text-xl sm:text-2xl font-black' : 'text-lg font-extrabold'} tracking-tight ${isWhite ? 'text-white' : 'text-[#101828]'}`}>
            BK<span className="text-[#245BFA]">-</span>IC
          </span>
          <span className={`${isLarge ? 'text-[11px]' : 'text-[10px]'} font-bold font-mono tracking-wider px-1.5 py-0.5 rounded-md ${
            isWhite ? 'bg-white/10 text-slate-300' : 'bg-blue-50 text-[#1749B5] border border-blue-200/60'
          }`}>
            DUT
          </span>
        </div>
        {showSubtitle && (
          <span className={`mt-0.5 text-[11px] font-normal leading-tight ${isWhite ? 'text-slate-300' : 'text-slate-500'}`}>
            Bách Khoa Innovation Club
          </span>
        )}
      </div>
    </>
  );

  if (disableLink) {
    return (
      <div className={`group inline-flex items-center gap-3 select-none ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <Link 
      to="/" 
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      {content}
    </Link>
  );
};

