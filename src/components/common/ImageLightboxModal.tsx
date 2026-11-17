// BK-IC Image Lightbox Modal — High Resolution Visual Inspector
import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, ExternalLink, Sparkles } from 'lucide-react';

export interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  title,
  subtitle,
  meta
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || alt || 'Chi tiết hình ảnh'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Top Floating Actions Bar */}
      <div
        className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono">
          <Sparkles className="h-3.5 w-3.5 text-[#93C5FD]" />
          <span className="text-blue-100 font-semibold">{meta || 'BK-IC ARCHIVE'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition cursor-pointer"
            title={isZoomed ? 'Thu nhỏ' : 'Phóng to'}
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>

          {/* Open Raw Image in New Tab */}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition"
            title="Mở ảnh gốc trong tab mới"
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-rose-500/80 backdrop-blur-md border border-white/20 text-white transition cursor-pointer"
            title="Đóng (ESC)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 max-h-[75vh] flex items-center justify-center bg-slate-900/50 ${
            isZoomed ? 'scale-110 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[72vh] max-w-full w-auto h-auto object-contain select-none"
          />
        </div>

        {/* Bottom Details Caption Bar */}
        {(title || subtitle) && (
          <div className="mt-3 px-5 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-lg border border-white/15 text-center text-white space-y-0.5 max-w-lg shadow-lg">
            {title && (
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-xs text-blue-200 font-medium">
                {subtitle}
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-mono pt-1">
              Nhấn ESC hoặc click ra ngoài để đóng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

