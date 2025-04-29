
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
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

interface DeepDiveReportContentProps {
  archetype: ArchetypeDetailedData;
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

  return (
    <div className="container mx-auto p-6">
      {/* New Home Introduction Section */}
      <HomeIntroduction 
        userData={userData} 
        archetypeData={archetype} 
        averageData={averageData} 
      />
      
      {/* Original Report Introduction */}
      <ReportIntroduction 
        archetypeName={archetypeName} 
        archetypeId={archetypeId} 
        userData={userData}
        isAdminView={false}
      />
      
      <Section id="executive-summary">
        <ExecutiveSummary 
          archetypeData={archetype}
        />
      </Section>
      
      <Section id="archetype-profile">
        <ArchetypeProfile 
          archetypeData={archetype}
        />
      </Section>
      
      <Section id="swot-analysis">
        <SwotAnalysis 
          archetypeData={archetype}
        />
      </Section>
      
      <Section id="demographics">
        <DemographicsSection 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="utilization">
        <UtilizationPatterns 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="risk-factors">
        <RiskFactors 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="cost-analysis">
        <CostAnalysis 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="care-gaps">
        <CareGaps 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="disease-management">
        <DiseaseManagement 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="metrics-analysis">
        <MetricsAnalysis 
          reportData={archetype}
          averageData={processedAverageData}
        />
      </Section>
      
      <Section id="recommendations">
        <StrategicRecommendations 
          reportData={archetype}
        />
      </Section>
      
      <Section id="contact">
        <ContactSection userData={userData} />
      </Section>
    </div>
  );
};

export default DeepDiveReportContent;
