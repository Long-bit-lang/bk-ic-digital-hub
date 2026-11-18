// BK-IC 404 Not Found Page — Minimalist Editorial
import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeroBanner } from '../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../components/layout/PageContentCanvas';
import { ScrollReveal } from '../components/effects/ScrollReveal';
import { ArrowLeft, Home, Compass, ArrowRight } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/editorial/Buttons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        eyebrow="MÃ LỖI 404 • KHÔNG TÌM THẤY TRANG"
        title="404 – Trang Không Tồn Tại"
        titleHighlight="Hoặc Đã Thay Đổi"
        subtitle="Đường dẫn bạn truy cập có thể đã được di chuyển, cập nhật địa chỉ mới hoặc tạm thời không khả dụng trên hệ sinh thái BK-IC Digital Hub."
        compact={true}
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-3xl text-center">
        <ScrollReveal direction="up" distance={20} duration={0.6}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#10182D] tracking-tight">
              Bạn có thể tiếp tục hành trình khám phá BK-IC
            </h2>
            <p className="text-sm sm:text-base text-[#5E6573] max-w-md mx-auto leading-relaxed">
              Hãy quay về Trang chủ hoặc lựa chọn một trong các phân hệ hoạt động cốt lõi bên dưới.
            </p>

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
            <div className="pt-10 border-t border-slate-200/80 max-w-lg mx-auto">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                ĐIỀU HƯỚNG NHANH
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <Link to="/" className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-100 text-slate-700 font-semibold transition text-center shadow-2xs">
                  Trang chủ
                </Link>
                <Link to="/about" className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-100 text-slate-700 font-semibold transition text-center shadow-2xs">
                  Về chúng tôi
                </Link>
                <Link to="/activities" className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-100 text-slate-700 font-semibold transition text-center shadow-2xs">
                  Hoạt động
                </Link>
                <Link to="/partnership" className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-100 text-slate-700 font-semibold transition text-center shadow-2xs">
                  Hợp tác
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </PageContentCanvas>
    </div>
  );
};
