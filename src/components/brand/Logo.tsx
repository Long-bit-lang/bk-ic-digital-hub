// BK-IC Official Brand Logo Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  isWhite?: boolean;
  size?: 'sm' | 'md' | 'lg';
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
    md: 'h-9 w-9',
    lg: 'h-11 w-11'
  };

  const content = (
    <>
      {/* Official BK-IC Emblem / Logo Icon */}
      <div 
        className={`relative flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-xl overflow-hidden border border-slate-200/80 bg-white p-0.5 shadow-xs transition-transform duration-300 group-hover:scale-105 ${
          isWhite ? 'ring-2 ring-white/20' : ''
        }`}
      >
        {!imageError ? (
          <img
            src="/images/bkic/bkic_logo.jpg"
            alt="BK-IC Official Logo"
            className="h-full w-full object-contain rounded-[9px]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-gradient-to-tr from-[#245BFA] to-[#8B84F6] text-white font-black text-xs font-mono">
            IC
          </div>
        )}
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-lg font-extrabold tracking-tight ${isWhite ? 'text-white' : 'text-[#101828]'}`}>
            BK<span className="text-[#245BFA]">-</span>IC
          </span>
          <span className={`text-[10px] font-semibold tracking-wider font-mono ${isWhite ? 'text-slate-400' : 'text-slate-400'}`}>
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

