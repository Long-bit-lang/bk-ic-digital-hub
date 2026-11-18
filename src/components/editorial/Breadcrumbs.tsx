// BK-IC Minimalist Editorial Breadcrumbs Component
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'light' | 'dark';
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-1.5 text-xs font-medium ${
        isDark ? 'text-slate-300' : 'text-slate-500'
      } ${className}`}
    >
      <Link
        to="/"
        className={`inline-flex items-center gap-1 transition-colors ${
          isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0284C7]'
        }`}
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Trang chủ</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className={`h-3 w-3 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-300'}`} />
            {isLast || !item.to ? (
              <span className={`font-semibold truncate max-w-[200px] sm:max-w-none ${
                isDark ? 'text-white' : 'text-[#10182D]'
              }`}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className={`transition-colors truncate max-w-[150px] sm:max-w-none ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0284C7]'
                }`}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

