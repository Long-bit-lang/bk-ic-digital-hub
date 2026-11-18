// BK-IC Digital Hub — Official Partnership Conversion Platform
// 10 Strategic Sections, Seamless Scroll & State-Managed Conversion Stepper
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartnershipHero } from '../components/partnership/PartnershipHero';
import { PartnershipStats } from '../components/partnership/PartnershipStats';
import { PartnershipCapabilities } from '../components/partnership/PartnershipCapabilities';
import { WhyPartnerSection } from '../components/partnership/WhyPartnerSection';
import { PartnershipOpportunities } from '../components/partnership/PartnershipOpportunities';
import { PartnershipStories } from '../components/partnership/PartnershipStories';
import { PartnershipPartners } from '../components/partnership/PartnershipPartners';
import { PartnershipProcess } from '../components/partnership/PartnershipProcess';
import { PartnershipFAQ } from '../components/partnership/PartnershipFAQ';
import { PartnershipRequestForm } from '../components/partnership/PartnershipRequestForm';
import { PartnershipContact } from '../components/partnership/PartnershipContact';

export const PartnershipPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('financial_sponsor');

  // Map incoming URL query param (e.g., ?type=expert_mentoring or ?type=companion_project)
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      // Map legacy or incoming keys to valid opportunity keys
      if (typeParam === 'companion_project' || typeParam === 'project_coop') {
        setSelectedType('startup_project');
      } else if (typeParam === 'sponsor' || typeParam === 'program_sponsor' || typeParam === 'business_coop') {
        setSelectedType('financial_sponsor');
      } else if (typeParam === 'problem_solving') {
        setSelectedType('business_challenge');
      } else if (typeParam === 'media_coop') {
        setSelectedType('media_cooperation');
      } else if (typeParam === 'academic_partner') {
        setSelectedType('academic_exchange');
      } else {
        setSelectedType(typeParam);
      }
    }
  }, [searchParams]);

  // Smooth scroll helpers
  const scrollToForm = () => {
    const el = document.getElementById('request-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToOpportunities = () => {
    const el = document.getElementById('opportunities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectOpportunity = (typeKey: string) => {
    setSelectedType(typeKey);
    scrollToForm();
  };

  return (
    <div className="min-h-screen bg-white text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* SECTION 1: HERO */}
      <PartnershipHero
        onRequestClick={scrollToForm}
        onExploreClick={scrollToOpportunities}
      />

      {/* SECTION 2: PARTNERSHIP STATISTICS (Verified Metrics) */}
      <PartnershipStats />

      {/* SECTION 3: STUDENT CAPABILITY DEVELOPMENT (Định hướng bồi dưỡng năng lực sinh viên) */}
      <PartnershipCapabilities />

      {/* SECTION 4: WHY PARTNER WITH BK-IC (Trọng tâm: Tiếp cận nguồn nhân lực trẻ) */}
      <WhyPartnerSection />

      {/* SECTION 5: 7 OFFICIAL PARTNERSHIP OPPORTUNITIES */}
      <PartnershipOpportunities
        onSelectType={handleSelectOpportunity}
        selectedType={selectedType}
      />

      {/* SECTION 6: VERIFIED REAL CLUB ACTIVITIES (BK Shark 2026 & Cuộc thi CĐS Liên Chiểu 2026) */}
      <PartnershipStories />

      {/* SECTION 7: NETWORK ECOSYSTEM & INVITATION (Mạng lưới kết nối thay cho logo giả) */}
      <PartnershipPartners onRequestClick={scrollToForm} />

      {/* SECTION 8: 4-STEP PARTNERSHIP PROCESS */}
      <PartnershipProcess />

      {/* SECTION 9: FAQ (7 Accessible Accordion Items) */}
      <PartnershipFAQ />

      {/* SECTION 10: PARTNERSHIP REQUEST FORM (8 Verified Fields) */}
      <PartnershipRequestForm initialType={selectedType} />

      {/* SECTION 11: CONTACT INFORMATION */}
      <PartnershipContact onRequestClick={scrollToForm} />
    </div>
  );
};

export default PartnershipPage;
