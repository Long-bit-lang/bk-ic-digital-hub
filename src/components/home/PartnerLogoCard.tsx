// BK-IC Digital Hub — Partner Logo Card Component
// Minimalist Logo Showcase with grayscale-to-color hover and fallback avatar
import React, { useState } from 'react';
import { ExternalLink, Building2 } from 'lucide-react';
import type { PartnerItem } from '../../data/homeData';

interface PartnerLogoCardProps {
  partner: PartnerItem;
}

export const PartnerLogoCard: React.FC<PartnerLogoCardProps> = ({ partner }) => {
  const [imageError, setImageError] = useState(false);

  const CardContent = (
    <div className="h-full w-full rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:border-[#1749B5]/40 hover:shadow-md transition-all duration-300 group relative">
      {/* External indicator icon on hover */}
      {partner.websiteUrl && (
        <span
          className="absolute top-2.5 right-2.5 text-slate-300 group-hover:text-[#1749B5] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      )}

      {/* Logo or Fallback Monogram */}
      <div className="h-12 sm:h-14 w-full flex items-center justify-center overflow-hidden">
        {!imageError ? (
          <img
            src={partner.logo}
            alt={`Logo ${partner.name}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="max-h-10 sm:max-h-12 max-w-[130px] sm:max-w-[150px] w-auto object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-[#1749B5] flex items-center justify-center font-bold text-xs shadow-2xs">
            {partner.initials || partner.name.slice(0, 3).toUpperCase()}
          </div>
        )}
      </div>

      {/* Partner Name */}
      <div className="mt-3 w-full">
        <p className="text-xs font-semibold text-slate-700 group-hover:text-[#1749B5] transition-colors line-clamp-1">
          {partner.name}
        </p>
        {partner.description && (
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {partner.description}
          </p>
        )}
      </div>
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1749B5] rounded-2xl"
        title={`${partner.name} (mở trang web)`}
      >
        {CardContent}
      </a>
    );
  }

  return <div>{CardContent}</div>;
};

