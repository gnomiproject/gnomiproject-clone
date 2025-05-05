
import React, { useEffect } from 'react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import GnomeImage from '@/components/common/GnomeImage';
import HomeIntroduction from './HomeIntroduction';
import ArchetypeProfileSection from './ArchetypeProfileSection';
import DemographicsSection from './DemographicsSection';
import UtilizationPatterns from './UtilizationPatterns';
import DiseaseManagement from './DiseaseManagement';
import CareGaps from './CareGaps';
import RiskFactors from './RiskFactors';
import CostAnalysis from './CostAnalysis';
import SwotAnalysis from './SwotAnalysis';
import StrategicRecommendationsSection from './strategic-recommendations/StrategicRecommendationsSection';
import ContactSection from './ContactSection';

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
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Report Data Missing</h2>
          <p>Unable to load report data from level4_report_secure. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
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
        <Section id="debug-info" className="print:hidden">
          <details className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
            <summary className="font-medium cursor-pointer">Debug Information</summary>
            <div className="mt-2 font-mono text-xs space-y-1">
              <p>Data Source: level4_report_secure</p>
              <p>Archetype ID: {archetypeId}</p>
              <p>Archetype Name: {archetypeName}</p>
              <p>Family ID: {archetype?.family_id || archetype?.familyId || 'Not available'}</p>
              <p>Family Name: {familyName}</p>
              <p>Has SWOT Analysis Field: {archetype?.swot_analysis ? 'Yes' : 'No'}</p>
              <p>SWOT Analysis Type: {archetype?.swot_analysis ? typeof archetype.swot_analysis : 'None'}</p>
              <p>Has Individual SWOT Fields: {(archetype?.strengths || archetype?.weaknesses) ? 'Yes' : 'No'}</p>
              <p>User: {userData?.name || 'Not available'}</p>
              <p>Organization: {userData?.organization || 'Not available'}</p>
              <p>Access Token: {userData?.access_token ? `${userData.access_token.substring(0, 5)}...` : 'Not available'}</p>
              <p>Last Accessed: {userData?.last_accessed ? new Date(userData.last_accessed).toLocaleString() : 'Never'}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <GnomeImage type="presentation" showDebug={true} />
            </div>
          </details>
        </Section>
      </ErrorBoundary>
    </div>
  );
};

export default DeepDiveReportContent;
