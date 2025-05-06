
import React, { useEffect } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ReportSections from './ReportSections';
import ReportErrorHandler from '../components/ReportErrorHandler';
import ReportDebugInfo from '../components/ReportDebugInfo';

import React from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import HomeIntroduction from '@/components/report/sections/HomeIntroduction';
import ArchetypeProfileSection from '@/components/report/sections/ArchetypeProfileSection';
import DemographicsSection from '@/components/report/sections/DemographicsSection';
import UtilizationPatterns from '@/components/report/sections/UtilizationPatterns';
import DiseaseManagement from '@/components/report/sections/DiseaseManagement';
import CareGaps from '@/components/report/sections/CareGaps';
import RiskFactors from '@/components/report/sections/RiskFactors';
import CostAnalysis from '@/components/report/sections/CostAnalysis';
import SwotAnalysis from '@/components/report/sections/SwotAnalysis';
import StrategicRecommendationsSection from '@/components/report/sections/strategic-recommendations/StrategicRecommendationsSection';
import ContactSection from '@/components/report/sections/ContactSection';

interface ReportSectionsProps {
  reportData: any;
  userData?: any;
  averageData?: any;
}

const ReportSections: React.FC<ReportSectionsProps> = ({
  reportData,
  userData,
  averageData
}) => {
  // Enhanced debug logging to track rendering and data flow
  console.log('[ReportSections] Rendering with data:', { 
    hasUserData: !!userData,
    hasReportData: !!reportData,
    reportDataName: reportData?.name || reportData?.archetype_name,
    reportDataId: reportData?.id || reportData?.archetype_id,
    familyName: reportData?.family_name
  });

  // Force this component to re-render after mount to ensure children render correctly
  useEffect(() => {
    console.log('[ReportSections] Component mounted');
  }, []);

  return (
    <>
      {/* Introduction Section - Making sure it appears first and with explicit section class */}
      <ErrorBoundary>
        <Section id="introduction" className="mb-10">
          <HomeIntroduction 
            userData={userData}
            archetypeData={reportData}
            averageData={averageData}
          />
        </Section>
      </ErrorBoundary>
      
      {/* Archetype Profile Section */}
      <ErrorBoundary>
        <ArchetypeProfileSection archetypeData={reportData} />
      </ErrorBoundary>
      
      {/* Demographics Section */}
      <ErrorBoundary>
        <DemographicsSection 
          reportData={reportData} 
          averageData={averageData} 
        />
      </ErrorBoundary>
      
      {/* Utilization Patterns Section */}
      <ErrorBoundary>
        <Section id="utilization-patterns">
          <UtilizationPatterns reportData={reportData} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Disease Management Section */}
      <ErrorBoundary>
        <Section id="disease-management">
          <DiseaseManagement reportData={reportData} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Care Gaps Section */}
      <ErrorBoundary>
        <Section id="care-gaps">
          <CareGaps reportData={reportData} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Risk Factors Section */}
      <ErrorBoundary>
        <Section id="risk-factors">
          <SectionTitle title="Risk Factors" />
          <RiskFactors reportData={reportData} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Cost Analysis Section */}
      <ErrorBoundary>
        <Section id="cost-analysis">
          <CostAnalysis reportData={reportData} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* SWOT Analysis Section */}
      <ErrorBoundary>
        <Section id="swot-analysis">
          <SwotAnalysis reportData={reportData} />
        </Section>
      </ErrorBoundary>
      
      {/* Strategic Recommendations Section */}
      <ErrorBoundary>
        <StrategicRecommendationsSection
          reportData={reportData}
          averageData={averageData}
        />
      </ErrorBoundary>
      
      {/* About This Report Section */}
      <ErrorBoundary>
        <Section id="about-report">
          <SectionTitle title="About This Report" />
          <ContactSection userData={userData} />
        </Section>
      </ErrorBoundary>
    </>
  );
};

export default ReportSections;
