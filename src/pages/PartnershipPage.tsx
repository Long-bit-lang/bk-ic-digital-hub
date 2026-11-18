// BK-IC Digital Hub — Official Partnership Conversion Platform
// 10 Strategic Sections, Seamless Scroll & State-Managed Conversion Stepper
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartnershipHero } from '../components/partnership/PartnershipHero';
import { PartnershipStats } from '../components/partnership/PartnershipStats';
import { WhyPartnerSection } from '../components/partnership/WhyPartnerSection';
import { PartnershipOpportunities } from '../components/partnership/PartnershipOpportunities';
import { PartnershipPartners } from '../components/partnership/PartnershipPartners';
import { PartnershipStories } from '../components/partnership/PartnershipStories';
import { PartnershipProcess } from '../components/partnership/PartnershipProcess';
import { PartnershipFAQ } from '../components/partnership/PartnershipFAQ';
import { PartnershipRequestForm } from '../components/partnership/PartnershipRequestForm';
import { PartnershipContact } from '../components/partnership/PartnershipContact';

export const PartnershipPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('sponsor');

  // Map incoming URL query param (e.g., ?type=expert_mentoring or ?type=companion_project)
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      // Map legacy or incoming keys to valid opportunity keys
      if (typeParam === 'companion_project' || typeParam === 'project_coop') {
        setSelectedType('expert_mentoring');
      } else if (typeParam === 'business_coop') {
        setSelectedType('sponsor');
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

      {/* SECTION 2: PARTNERSHIP STATISTICS */}
      <PartnershipStats />

      {/* SECTION 3: WHY PARTNER WITH BK-IC */}
      <WhyPartnerSection />

      {/* SECTION 4: PARTNERSHIP OPPORTUNITIES (6 Cards) */}
      <PartnershipOpportunities
        onSelectType={handleSelectOpportunity}
        selectedType={selectedType}
      />

      {/* SECTION 5: CURRENT PARTNERS (3 Tiers from HOME_PARTNERS_DATA) */}
      <PartnershipPartners />

      {/* SECTION 6: PARTNERSHIP STORIES (Verified Real Activities) */}
      <PartnershipStories />

      {/* SECTION 7: PARTNERSHIP PROCESS (5 Steps) */}
      <PartnershipProcess />

      {/* SECTION 8: FAQ (7 Accessible Accordion Items) */}
      <PartnershipFAQ />

      {/* SECTION 9: PARTNERSHIP REQUEST FORM (3-Step Conversion Stepper) */}
      <PartnershipRequestForm initialType={selectedType} />

      {/* SECTION 10: CONTACT INFORMATION */}
      <PartnershipContact onRequestClick={scrollToForm} />
    </div>
  );
};
