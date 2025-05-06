import React, { useState, useEffect } from 'react';
import { Section } from '@/components/shared/Section';
import ReportDebugTools from '../ReportDebugTools';

// Import section components directly without lazy loading
import ReportIntroduction from '../sections/ReportIntroduction';
import ArchetypeProfile from '../sections/ArchetypeProfile';
import DemographicsSection from '../sections/DemographicsSection';
import UtilizationPatterns from '../sections/UtilizationPatterns';
import DiseaseManagement from '../sections/DiseaseManagement';
import CareGaps from '../sections/CareGaps';
import RiskFactors from '../sections/RiskFactors';
import CostAnalysis from '../sections/CostAnalysis';
import SwotAnalysis from '../sections/SwotAnalysis';
import StrategicRecommendationsSection from '../sections/strategic-recommendations/StrategicRecommendationsSection';
import ContactSection from '../sections/ContactSection';

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
  // Keep track of section errors for error handling
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});

  // Add debug logging
  console.log('[ReportBody] Rendering with data:', {
    hasReportData: !!reportData, 
    hasUserData: !!userData,
    reportDataSample: reportData ? {
      id: reportData.id || reportData.archetype_id,
      name: reportData.name || reportData.archetype_name,
      hasKeyFindings: !!reportData.key_findings
    } : 'No data'
  });

  // Error handling function for section rendering errors
  const handleSectionError = (sectionId: string, error: any) => {
    console.error(`Error rendering section ${sectionId}:`, error);
    setSectionErrors(prev => ({
      ...prev,
      [sectionId]: error?.message || 'Unknown error loading this section'
    }));
  };

  // Verify that reportData is available
  if (!reportData) {
    return (
      <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error Loading Report</h3>
        <p className="text-red-700 mt-2">No report data available. Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 print:px-8">
      {/* Sections in the reordered sequence - all loaded up front */}
      <Section id="introduction">
        <ReportIntroduction 
          userData={userData} 
          reportData={reportData}
          archetypeId={reportData?.archetype_id || reportData?.id}
          archetypeName={reportData?.name || reportData?.archetype_name}
          familyName={reportData?.family_name}
          shortDescription={reportData?.short_description}
        />
      </Section>
      
      <Section id="archetype-profile">
        {sectionErrors['archetype-profile'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['archetype-profile']}</p>
          </div>
        ) : (
          <ArchetypeProfile reportData={reportData} />
        )}
      </Section>
      
      <Section id="demographics">
        {sectionErrors['demographics'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['demographics']}</p>
          </div>
        ) : (
          <DemographicsSection reportData={reportData} averageData={averageData} />
        )}
      </Section>
      
      <Section id="utilization-patterns">
        {sectionErrors['utilization-patterns'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['utilization-patterns']}</p>
          </div>
        ) : (
          <UtilizationPatterns reportData={reportData} averageData={averageData} />
        )}
      </Section>
      
      <Section id="disease-management">
        {sectionErrors['disease-management'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['disease-management']}</p>
          </div>
        ) : (
          <DiseaseManagement reportData={reportData} averageData={averageData} />
        )}
      </Section>
      
      <Section id="care-gaps">
        {sectionErrors['care-gaps'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['care-gaps']}</p>
          </div>
        ) : (
          <CareGaps reportData={reportData} averageData={averageData} />
        )}
      </Section>
      
      <Section id="risk-factors">
        {sectionErrors['risk-factors'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['risk-factors']}</p>
          </div>
        ) : (
          <RiskFactors reportData={reportData} averageData={averageData} />
        )}
      </Section>
      
      <Section id="cost-analysis">
        {sectionErrors['cost-analysis'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['cost-analysis']}</p>
          </div>
        ) : (
          <CostAnalysis reportData={reportData} averageData={averageData} />
        )}
      </Section>

      <Section id="swot-analysis">
        {sectionErrors['swot-analysis'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['swot-analysis']}</p>
          </div>
        ) : (
          <SwotAnalysis reportData={reportData} archetypeData={reportData} />
        )}
      </Section>
      
      <Section id="recommendations">
        {sectionErrors['recommendations'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['recommendations']}</p>
          </div>
        ) : (
          <StrategicRecommendationsSection reportData={reportData} averageData={averageData} />
        )}
      </Section>
      
      <Section id="about-report">
        {sectionErrors['about-report'] ? (
          <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
            <p className="text-red-700 mt-2">{sectionErrors['about-report']}</p>
          </div>
        ) : (
          <ContactSection userData={userData} />
        )}
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

export default React.memo(ReportBody);
