// BK-IC About Page — Minimalist Editorial Institutional Showcase
// Integrated Sections: Intro, Story & Team Photo, Vision & Mission, Fields, Core Values, Member Album (GEN 1)
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeroBanner } from '../components/layout/PageHeroBanner';
import { PageContentCanvas } from '../components/layout/PageContentCanvas';
import { AboutHeroSection } from '../components/about/AboutHeroSection';
import { AboutStorySection } from '../components/about/AboutStorySection';
import { AboutVisionMissionSection } from '../components/about/AboutVisionMissionSection';
import { AboutFieldsSection } from '../components/about/AboutFieldsSection';
import { AboutCoreValuesSection } from '../components/about/AboutCoreValuesSection';
import { AboutMemberAlbumSection } from '../components/about/AboutMemberAlbumSection';

export const AboutPage: React.FC = () => {
  const location = useLocation();

  // Support direct hash navigation like /about#album or scroll directly to top
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* 1. Institutional Hero Banner (Cosmic Gradient + Flowing Light Trails) */}
      <PageHeroBanner
        breadcrumbs={[{ label: 'Về chúng tôi' }]}
        eyebrow="TỔ CHỨC KHỞI NGHIỆP TRƯỜNG ĐH BÁCH KHOA • DUT"
        title="Câu lạc bộ Khởi nghiệp &"
        titleHighlight="Đổi mới Sáng tạo"
        subtitle="Môi trường kết nối sinh viên kỹ thuật Bách khoa với ban cố vấn chuyên môn, dự án nghiên cứu ứng dụng và mạng lưới doanh nghiệp khởi nghiệp quốc gia."
      />

      {/* 2. Seamless Pure White Content Canvas with Tech Grid & Trails */}
      <PageContentCanvas>
        {/* Section 01: Giới thiệu BK-IC (Hero Editorial Presentation) */}
        <AboutHeroSection />

        {/* Section 02: Câu chuyện hình thành (Narrative Storytelling & Official Team Photo) */}
        <AboutStorySection />

        {/* Section 03: Tầm nhìn & Sứ mệnh (Dual Sculptural Blocks) */}
        <AboutVisionMissionSection />

        {/* Section 04: Lĩnh vực hoạt động (4 Bento Cards with Visuals & Numbering) */}
        <AboutFieldsSection />

        {/* Section 05: Giá trị cốt lõi (CONNECT - CREATE - IMPACT Typographic Monoliths) */}
        <AboutCoreValuesSection />

        {/* Section 06: Album thành viên câu lạc bộ (GEN 1 Archive: BCN, BĐH, BTV) */}
        <AboutMemberAlbumSection />
      </PageContentCanvas>
    </div>
  );
};

export default AboutPage;
