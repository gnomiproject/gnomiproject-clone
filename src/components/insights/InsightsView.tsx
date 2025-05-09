
import React, { useEffect, useMemo } from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import DeepDiveRequestForm from '@/components/results/DeepDiveRequestForm';
import { getImageUrl } from '@/utils/imageService';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: ArchetypeDetailedData;
  assessmentResult?: any;
  assessmentAnswers?: any;
  hideRequestSection?: boolean;
}

const InsightsView = ({ 
  archetypeId, 
  reportData, 
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false
}: ArchetypeReportProps) => {
  // Always define hooks at the top level
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Process assessment data once with useMemo to prevent redundant processing
  const processedAssessmentResult = useMemo(() => {
    // Only log once when the component mounts or when assessment data changes
    console.log('[InsightsView] Using assessment result data', {
      hasAssessmentResult: !!assessmentResult,
      archetypeId,
      exactEmployeeCount: assessmentResult?.exactData?.employeeCount
    });
    
    // If assessment data exists but exactData doesn't, add it
    if (assessmentResult && !assessmentResult.exactData) {
      const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
      const result = {...assessmentResult};
      result.exactData = {
        employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
      };
      return result;
    }
    return assessmentResult;
  }, [assessmentResult, archetypeId]);

  // Log SWOT data only once on mount or if reportData changes
  useEffect(() => {
    if (reportData?.strengths) {
      console.log('[InsightsView] SWOT data available:', {
        directStrengths: !!reportData.strengths,
        swotAnalysis: !!reportData.swot_analysis,
        enhancedSwot: !!reportData.enhanced?.swot
      });
    }
  }, [reportData]);

  // Error check - if reportData is null or undefined, show an error message
  if (!reportData) {
    // Return a minimal error state to avoid cascading failures
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Data Loading Issue</h3>
        <p className="text-gray-600 mb-4">
          We're having trouble loading archetype data for {archetypeId}.
        </p>
        <p className="text-sm text-gray-500">
          This could be due to a network connection issue or temporary service disruption.
        </p>
      </div>
    );
  }

  // Ensure we have all the required properties for rendering
  const name = reportData?.name || reportData?.archetype_name || 'Unknown Archetype';
  const shortDescription = reportData?.short_description || '';
  const familyId = reportData?.familyId || reportData?.family_id;
  const familyName = reportData?.familyName || reportData?.family_name || '';
  // Fix: Use hexColor first, then fall back to hex_color for compatibility with database sources
  const familyColor = reportData?.hexColor || reportData?.color || (reportData as any)?.hex_color || '#4B5563';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ArchetypeHeader 
        name={name} 
        description={shortDescription} 
        familyId={familyId}
        familyName={familyName}
        familyColor={familyColor}
        archetypeHexColor={familyColor}
        gnomeImage="chart"
      />
      
      <ArchetypeNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-4 md:p-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            archetypeData={reportData} 
            familyColor={familyColor}
          />
        )}
        {activeTab === 'metrics' && <MetricsTab archetypeData={reportData} />}
        {activeTab === 'swot' && <SwotTab archetypeData={reportData} />}
        {activeTab === 'disease-and-care' && <DiseaseAndCareTab archetypeData={reportData} />}
      </div>

      {!hideRequestSection && (
        <div className="border-t border-gray-100 mt-6">
          <DeepDiveRequestForm
            archetypeId={archetypeId}
            assessmentResult={processedAssessmentResult}
            assessmentAnswers={assessmentAnswers}
            archetypeData={reportData}
          />
        </div>
      )}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(InsightsView);
