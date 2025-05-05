
import React, { useEffect } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import GnomeImage from '@/components/common/GnomeImage';
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
import ReportErrorHandler from '@/components/report/components/ReportErrorHandler';
import ReportDebugInfo from '@/components/report/components/ReportDebugInfo';

interface DeepDiveReportContentProps {
  archetype: any;
  userData?: any;
  averageData?: any;
}

const DeepDiveReportContent = ({ 
  archetype, 
  userData,
  averageData
}: DeepDiveReportContentProps) => {
  // Store these values once to avoid unnecessary recalculations
  const archetypeName = archetype?.name || archetype?.archetype_name || 'Unknown';
  const archetypeId = archetype?.id || archetype?.archetype_id || '';
  const familyName = archetype?.family_name || 'Unknown Family';
  const shortDescription = archetype?.short_description || '';
  
  // Debug logging
  useEffect(() => {
    console.log('[DeepDiveReportContent] Processing archetype data from level4_report_secure:', {
      id: archetypeId,
      name: archetypeName,
      familyId: archetype?.family_id || archetype?.familyId,
      familyName,
      shortDescription: shortDescription ? shortDescription.substring(0, 50) + '...' : 'None',
      hasSwotAnalysisField: !!archetype?.swot_analysis,
      swotAnalysisType: archetype?.swot_analysis ? typeof archetype.swot_analysis : 'None',
      hasStrengthsField: !!archetype?.strengths,
      hasWeaknessesField: !!archetype?.weaknesses,
      userData: userData ? {
        name: userData.name,
        organization: userData.organization,
        accessToken: userData.access_token ? `${userData.access_token.substring(0, 5)}...` : 'None',
        lastAccessed: userData.last_accessed
      } : 'No user data'
    });
  }, [archetype, archetypeId, archetypeName, familyName, shortDescription, userData]);

  // Make a safe copy of the data to avoid mutation issues
  const safeArchetype = {...archetype};
  
  // If no archetype data, show error
  if (!archetype) {
    return <ReportErrorHandler 
      archetypeName={archetypeName} 
      onRetry={() => window.location.reload()} 
    />;
  }
  
  // Log key findings for Archetype Insights
  console.log('[DeepDiveReportContent] Key Findings for Insights Card:', {
    keyFindings: archetype?.key_findings || 'None found',
    keyFindingsCount: archetype?.key_findings?.length || 0,
    recommendations: archetype?.strategic_recommendations?.length || 0
  });
  
  // Ensure we're passing the complete archetype data to all components
  // Sections arranged in the new requested order
  return (
    <div className="container mx-auto p-6">
      {/* Introduction Section */}
      <ErrorBoundary>
        <HomeIntroduction 
          userData={userData}
          archetypeData={safeArchetype}
          averageData={averageData}
        />
      </ErrorBoundary>
      
      {/* Archetype Profile Section */}
      <ErrorBoundary>
        <ArchetypeProfileSection archetypeData={safeArchetype} />
      </ErrorBoundary>
      
      {/* Demographics Section */}
      <ErrorBoundary>
        <DemographicsSection 
          reportData={safeArchetype} 
          averageData={averageData} 
        />
      </ErrorBoundary>
      
      {/* Utilization Patterns Section */}
      <ErrorBoundary>
        <Section id="utilization-patterns">
          <SectionTitle title="Utilization Patterns" />
          <UtilizationPatterns reportData={safeArchetype} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Disease Management Section */}
      <ErrorBoundary>
        <Section id="disease-management">
          <SectionTitle title="Disease Management" />
          <DiseaseManagement reportData={safeArchetype} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Care Gaps Section */}
      <ErrorBoundary>
        <Section id="care-gaps">
          <SectionTitle title="Care Gaps" />
          <CareGaps reportData={safeArchetype} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Risk Factors Section */}
      <ErrorBoundary>
        <Section id="risk-factors">
          <SectionTitle title="Risk Factors" />
          <RiskFactors reportData={safeArchetype} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* Cost Analysis Section */}
      <ErrorBoundary>
        <Section id="cost-analysis">
          <SectionTitle title="Cost Analysis" />
          <CostAnalysis reportData={safeArchetype} averageData={averageData} />
        </Section>
      </ErrorBoundary>
      
      {/* SWOT Analysis Section - Using data from level4_report_secure only */}
      <ErrorBoundary>
        <Section id="swot-analysis">
          <SwotAnalysis reportData={safeArchetype} />
        </Section>
      </ErrorBoundary>
      
      {/* Strategic Recommendations Section */}
      <ErrorBoundary>
        <StrategicRecommendationsSection
          reportData={safeArchetype}
          averageData={averageData}
        />
      </ErrorBoundary>
      
      {/* About This Report Section (renamed from Contact Section) */}
      <ErrorBoundary>
        <Section id="about-report">
          <SectionTitle title="About This Report" />
          <ContactSection userData={userData} />
        </Section>
      </ErrorBoundary>
      
      {/* Debug information - shown in a less prominent way */}
      <ErrorBoundary>
        <ReportDebugInfo 
          archetypeId={archetypeId}
          archetypeName={archetypeName}
          familyName={familyName}
          familyId={archetype?.family_id || archetype?.familyId}
          swotAnalysis={archetype?.swot_analysis}
          strengths={archetype?.strengths}
          weaknesses={archetype?.weaknesses}
          userData={userData}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReportContent;
