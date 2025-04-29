
import React from 'react';
import { Section } from '@/components/shared/Section';
import ExecutiveSummary from '../sections/ExecutiveSummary';
import ArchetypeProfile from '../sections/ArchetypeProfile';
import ReportIntroduction from '../sections/ReportIntroduction';
import SwotAnalysis from '../sections/SwotAnalysis';
import DemographicsSection from '../sections/DemographicsSection';
import CostAnalysis from '../sections/CostAnalysis';
import UtilizationPatterns from '../sections/UtilizationPatterns';
import DiseaseManagement from '../sections/DiseaseManagement';
import CareGaps from '../sections/CareGaps';
import RiskFactors from '../sections/RiskFactors';
import StrategicRecommendationsSection from '../sections/strategic-recommendations/StrategicRecommendationsSection';
import ContactSection from '../sections/ContactSection';
import ReportDebugTools from '../ReportDebugTools';

interface ReportBodyProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isDebugMode: boolean;
  showDebugData: boolean;
  showDiagnostics: boolean;
  setShowDebugData: (show: boolean) => void;
  setShowDiagnostics: (show: boolean) => void;
  handleRefreshData: () => void;
  isAdminView: boolean;
  debugInfo?: any;
}

const ReportBody: React.FC<ReportBodyProps> = ({
  reportData,
  userData,
  averageData,
  isDebugMode,
  showDebugData,
  showDiagnostics,
  setShowDebugData,
  setShowDiagnostics,
  handleRefreshData,
  isAdminView,
  debugInfo
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 print:px-8">
      <Section id="introduction">
        <ReportIntroduction userData={userData} />
      </Section>
      
      <Section id="executive-summary">
        <ExecutiveSummary archetypeData={reportData} />
      </Section>
      
      <Section id="archetype-profile">
        <ArchetypeProfile reportData={reportData} />
      </Section>
      
      <Section id="swot-analysis">
        <SwotAnalysis reportData={reportData} />
      </Section>
      
      <Section id="demographics">
        <DemographicsSection reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="cost-analysis">
        <CostAnalysis reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="utilization-patterns">
        <UtilizationPatterns reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="disease-management">
        <DiseaseManagement reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="care-gaps">
        <CareGaps reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="risk-factors">
        <RiskFactors reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="recommendations">
        <StrategicRecommendationsSection reportData={reportData} averageData={averageData} />
      </Section>
      
      <Section id="contact">
        <ContactSection userData={userData} />
      </Section>

      {/* Debug tools for admin and debug mode */}
      {isDebugMode && (
        <Section id="debug" className="print:hidden">
          <ReportDebugTools 
            showDebugData={showDebugData}
            toggleDebugData={() => setShowDebugData(!showDebugData)}
            showDiagnostics={showDiagnostics}
            toggleDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
            onRefreshData={handleRefreshData}
            isAdminView={isAdminView}
            debugInfo={debugInfo}
          />
        </Section>
      )}
    </div>
  );
};

export default ReportBody;
