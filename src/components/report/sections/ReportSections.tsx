
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
  console.log('[ReportSections] Rendering with:', {
    hasReportData: !!reportData,
    hasUserData: !!userData,
    hasAverageData: !!averageData
  });

  return (
    <>
      {/* Introduction Section - ALWAYS RENDER FIRST */}
      <ErrorBoundary>
        <Section id="introduction" className="mb-8 mt-0 bg-white">
          <div className="min-h-[200px]">
            <HomeIntroduction 
              userData={userData}
              archetypeData={reportData}
              averageData={averageData}
            />
          </div>
        </Section>
      </ErrorBoundary>
      
      {/* Archetype Profile Section */}
      <ErrorBoundary>
        <ArchetypeProfileSection archetypeData={reportData} />
      </ErrorBoundary>
      
      {/* Demographics Section */}
      <ErrorBoundary>
        <Section id="demographics">
          <DemographicsSection 
            reportData={reportData} 
            averageData={averageData} 
          />
        </Section>
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
        <Section id="recommendations">
          <StrategicRecommendationsSection
            reportData={reportData}
            averageData={averageData}
          />
        </Section>
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
