
import React from 'react';
import InsightOverviewSection from './InsightOverviewSection';
import InsightMetricsSection from './InsightMetricsSection';
import InsightSwotSection from './InsightSwotSection';
import InsightCareSection from './InsightCareSection';
import { Section } from '@/components/shared/Section';
import ReportIntroduction from './ReportIntroduction';
import ExecutiveSummary from './ExecutiveSummary';
import ArchetypeProfile from './ArchetypeProfile';
import SwotAnalysis from './SwotAnalysis';
import DemographicsSection from './DemographicsSection';
import UtilizationPatterns from './UtilizationPatterns';
import RiskFactors from './RiskFactors';
import CostAnalysis from './CostAnalysis';
import CareGaps from './CareGaps';
import DiseaseManagement from './DiseaseManagement';
import MetricsAnalysis from './MetricsAnalysis';
import StrategicRecommendations from './StrategicRecommendations';
import ContactSection from './ContactSection';
import HomeIntroduction from './HomeIntroduction';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

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
  const archetypeName = archetype.name || archetype.archetype_name || '';
  const archetypeId = archetype.id || '';
  
  // Process data for use in components
  const processedUserData = userData || {};
  const processedAverageData = averageData || {};
  
  // Ensure all required arrays exist to prevent map function errors
  const ensureArray = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // If parsing fails, return string as single item array
        return [data];
      }
    }
    return [];
  };
  
  // Process archetype data to ensure all required properties exist and are in the right format
  const processedArchetype = {
    ...archetype,
    strengths: ensureArray(archetype.strengths),
    weaknesses: ensureArray(archetype.weaknesses),
    opportunities: ensureArray(archetype.opportunities),
    threats: ensureArray(archetype.threats),
    strategic_recommendations: ensureArray(archetype.strategic_recommendations),
  };
  
  console.log('[DeepDiveReportContent] Rendering with archetype data:', {
    id: archetypeId,
    name: archetypeName,
    hasStrengths: Array.isArray(processedArchetype.strengths) && processedArchetype.strengths.length > 0,
    hasRecommendations: Array.isArray(processedArchetype.strategic_recommendations) && processedArchetype.strategic_recommendations.length > 0,
    recommendationsType: typeof archetype.strategic_recommendations,
    processedRecommendationsType: typeof processedArchetype.strategic_recommendations
  });

  return (
    <div className="container mx-auto p-6">
      {/* New Home Introduction Section */}
      <ErrorBoundary>
        <HomeIntroduction 
          userData={userData} 
          archetypeData={processedArchetype} 
          averageData={averageData} 
        />
      </ErrorBoundary>
      
      {/* Original Report Introduction */}
      <ErrorBoundary>
        <ReportIntroduction 
          archetypeName={archetypeName} 
          archetypeId={archetypeId} 
          userData={userData}
          isAdminView={false}
        />
      </ErrorBoundary>
      
      <Section id="executive-summary">
        <ErrorBoundary>
          <ExecutiveSummary 
            archetypeData={processedArchetype}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="archetype-profile">
        <ErrorBoundary>
          <ArchetypeProfile 
            archetypeData={processedArchetype}
            reportData={processedArchetype} // Supporting both prop patterns
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="swot-analysis">
        <ErrorBoundary>
          <SwotAnalysis 
            reportData={processedArchetype}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="demographics">
        <ErrorBoundary>
          <DemographicsSection 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="utilization">
        <ErrorBoundary>
          <UtilizationPatterns 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="risk-factors">
        <ErrorBoundary>
          <RiskFactors 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="cost-analysis">
        <ErrorBoundary>
          <CostAnalysis 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="care-gaps">
        <ErrorBoundary>
          <CareGaps 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="disease-management">
        <ErrorBoundary>
          <DiseaseManagement 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="metrics-analysis">
        <ErrorBoundary>
          <MetricsAnalysis 
            reportData={processedArchetype}
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="recommendations">
        <ErrorBoundary>
          <StrategicRecommendations 
            reportData={processedArchetype}
            archetypeData={processedArchetype} // Supporting both prop patterns
            averageData={processedAverageData}
          />
        </ErrorBoundary>
      </Section>
      
      <Section id="contact">
        <ErrorBoundary>
          <ContactSection userData={userData || {}} />
        </ErrorBoundary>
      </Section>
    </div>
  );
};

export default DeepDiveReportContent;
