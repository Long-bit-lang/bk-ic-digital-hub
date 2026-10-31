import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ManifestoSection } from '../components/home/ManifestoSection';
import { GallerySection } from '../components/home/GallerySection';
import { ActivitiesSection } from '../components/home/ActivitiesSection';
import { WeeklySection } from '../components/home/WeeklySection';
import { OrganizationSection } from '../components/home/OrganizationSection';
import { PortalPreviewSection } from '../components/home/PortalPreviewSection';
import { RecruitmentSection } from '../components/home/RecruitmentSection';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#111318] selection:bg-[#DCEBFF] selection:text-[#245BFA]">
      {/* 01: Hero giới thiệu BK-IC */}
      <HeroSection />

      {/* 02: Tuyên ngôn & Tầm nhìn */}
      <ManifestoSection />

      {/* 03: Giới thiệu CLB & Khoảnh khắc hoạt động (Lồng ghép tích hợp) */}
      <GallerySection />

      {/* 04: Các hoạt động nổi bật */}
      <ActivitiesSection />

      {/* 05: Lịch sinh hoạt định kỳ thứ Ba hằng tuần */}
      <WeeklySection />

      {/* 06: Cơ cấu tổ chức gồm 3 ban: BCN, BĐH, BTV */}
      <OrganizationSection />

      {/* 07: Cổng thông tin nội bộ & Điểm danh QR số hóa */}
      <PortalPreviewSection />

      {/* 08: Đợt tuyển thành viên (Đóng / Mở theo quy định) */}
      <RecruitmentSection />
    </div>
  );
};
