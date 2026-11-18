// BK-IC News & Provenance Articles Page
import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeroBanner } from '../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../components/layout/PageContentCanvas';
import { ScrollReveal } from '../components/effects/ScrollReveal';
import { 
  Newspaper, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Building2,
  FileText
} from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { articles } = useApp();

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[{ label: 'Tin tức' }]}
        eyebrow="TIN TỨC & BÁO CHÍ • BK-IC DUT"
        title="Thông cáo &"
        titleHighlight="Nguồn xác thực Báo chí"
        subtitle="Toàn bộ các tư liệu, bài báo ghi nhận sự kiện ra mắt và quy chế hoạt động chính thức của Bách Khoa Innovation Club tại Trường Đại học Bách khoa – Đại học Đà Nẵng."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas className="max-w-5xl">
        {/* Provenance Articles List */}
        {articles.length === 0 ? (
          <ScrollReveal direction="up" distance={20} duration={0.6}>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 space-y-3 shadow-xs">
              <div className="text-sm font-semibold text-slate-700">Chưa có bài thông cáo báo chí nào trong hệ thống</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Dữ liệu bài viết đang trống và sẵn sàng để Ban Truyền thông cập nhật các thông cáo, hoạt động và bài báo chính thức về câu lạc bộ.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-8">
            {articles.map((art, idx) => (
              <ScrollReveal key={art.id} direction="up" distance={22} delay={idx * 0.1} duration={0.65}>
                <article
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs hover:border-[#38BDF8] hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md">
                        {art.contentType}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Ngày đăng: {art.publishedAt}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Đã kiểm chứng tính chính danh</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                      {art.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  {/* Key Details from source */}
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-100 p-5 space-y-2.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nội dung cốt lõi trích dẫn:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {art.keyDetails.map((detail: string, dIdx: number) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      Đơn vị phát hành: <strong className="text-slate-800">{art.sourceName}</strong>
                    </div>

                    <a
                      href={art.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#38BDF8] transition-colors group"
                    >
                      <span>Truy cập nguồn phát hành gốc</span>
                      <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </PageContentCanvas>
    </div>
  );
};
