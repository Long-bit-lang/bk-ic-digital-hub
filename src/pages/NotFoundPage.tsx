// BK-IC 404 Not Found Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass, ArrowRight } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/editorial/Buttons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-transparent flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span>MÃ LỖI: 404 • KHÔNG TÌM THẤY TRANG</span>
        </div>

        {/* Large Typography Heading */}
        <div className="space-y-3">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-[#10182D] tracking-tight">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#10182D] tracking-tight">
            Trang bạn tìm kiếm không tồn tại
          </h2>
          <p className="text-sm sm:text-base text-[#5E6573] max-w-md mx-auto leading-relaxed">
            Đường dẫn có thể đã bị thay đổi, xóa bỏ hoặc tạm thời không khả dụng trên hệ thống BK-IC Digital Hub.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <PrimaryButton to="/" icon={<Home className="h-4 w-4" />}>
            Về Trang chủ
          </PrimaryButton>
          <SecondaryButton to="/activities" icon={<Compass className="h-4 w-4" />}>
            Khám phá Hoạt động
          </SecondaryButton>
        </div>

        {/* Quick Sitemap Links */}
        <div className="pt-10 border-t border-slate-200 max-w-lg mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
            ĐIỀU HƯỚNG NHANH
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Link to="/" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition text-center">
              Trang chủ
            </Link>
            <Link to="/about" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition text-center">
              Về chúng tôi
            </Link>
            <Link to="/activities" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition text-center">
              Hoạt động
            </Link>
            <Link to="/partnership" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition text-center">
              Hợp tác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

