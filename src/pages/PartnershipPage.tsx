// BK-IC Digital Hub — Official Companion Project Platform
// Dedicated Incubator & Project Support for DUT Student Innovators & Research Teams
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Handle URL hashes on mount or hash change
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Smooth scroll helpers
  const scrollToForm = () => {
    const el = document.getElementById('request-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCriteria = () => {
    const el = document.getElementById('criteria');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#334155] selection:bg-sky-100 selection:text-[#0284C7] overflow-x-clip">
      {/* SECTION 1: HERO */}
      <PartnershipHero
        onRequestClick={scrollToForm}
        onExploreClick={scrollToCriteria}
      />

      {/* SECTION 2: VERIFIED STATS */}
      <PartnershipStats />

      {/* SECTION 3: 5 COMPANION VALUES & BENEFITS */}
      <WhyPartnerSection />

      {/* SECTION 4: STUDENT CAPABILITY DEVELOPMENT (Hard & Soft Skills) */}
      <PartnershipCapabilities />

      {/* SECTION 5: INTAKE CRITERIA & 5 TECH FOCUS FIELDS */}
      <PartnershipOpportunities onRequestClick={scrollToForm} />

      {/* SECTION 6: REAL TRACK RECORD (BK SHARK 2026 & TOP 7 PROJECTS) */}
      <PartnershipStories />

      {/* SECTION 7: INCUBATOR INTAKE STATUS & OPEN CALL */}
      <PartnershipPartners onRequestClick={scrollToForm} />

      {/* SECTION 8: 4-STEP INCUBATION ROADMAP */}
      <PartnershipProcess />

      {/* SECTION 9: FAQS FOR STUDENT FOUNDERS */}
      <PartnershipFAQ />

      {/* SECTION 10: DEDICATED PROJECT APPLICATION FORM */}
      <PartnershipRequestForm />

      {/* SECTION 11: OFFICIAL CONTACT INFORMATION */}
      <PartnershipContact onRequestClick={scrollToForm} />
    </div>
  );
};

export default PartnershipPage;
