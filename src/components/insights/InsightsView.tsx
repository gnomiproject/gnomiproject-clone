
import React, { useEffect } from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import DeepDiveRequestForm from '@/components/results/DeepDiveRequestForm';
import { getGnomeForArchetype } from '@/utils/gnomeImages';

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
  const [activeTab, setActiveTab] = React.useState('overview');
  const familyColor = reportData.hexColor || reportData.color || '#4B5563';
  
  console.log('[InsightsView] Rendering with data:', {
    archetypeId,
    reportDataName: reportData?.name || reportData?.archetype_name,
    hasStrengths: Array.isArray(reportData?.strengths) && reportData.strengths.length > 0,
    strengthsLength: reportData?.strengths ? reportData.strengths.length : 0,
    hasSwotAnalysis: !!reportData?.swot_analysis,
    swotAnalysisStrengths: reportData?.swot_analysis?.strengths ? reportData.swot_analysis.strengths.length : 0
  });
  
  // Enhanced logging for assessment data
  useEffect(() => {
    if (assessmentResult) {
      console.log('[InsightsView] Using assessment result data', {
        hasAssessmentResult: true,
        archetypeId,
        primaryArchetype: assessmentResult.primaryArchetype,
        hasExactData: !!assessmentResult.exactData,
        exactEmployeeCount: assessmentResult?.exactData?.employeeCount
      });
      
      // Ensure exactData exists in the assessment result
      if (!assessmentResult.exactData) {
        const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
        if (storedEmployeeCount) {
          console.log('[InsightsView] Adding exactData from session storage:', storedEmployeeCount);
          assessmentResult.exactData = {
            employeeCount: Number(storedEmployeeCount)
          };
        } else {
          console.log('[InsightsView] No employee count found in session storage, adding empty exactData');
          assessmentResult.exactData = {
            employeeCount: null
          };
        }
      }
    } else {
      console.log('[InsightsView] No assessment result data');
    }
  }, [assessmentResult, archetypeId]);

  // Ensure we have all the required properties
  const name = reportData.name || reportData.archetype_name || 'Unknown Archetype';
  const shortDescription = reportData.short_description || '';
  const familyId = reportData.familyId || reportData.family_id;
  const familyName = reportData.familyName || reportData.family_name || '';

  // Process SWOT data with fallback to swot_analysis object if available
  const swotData = {
    strengths: reportData.strengths || (reportData.swot_analysis?.strengths) || [],
    weaknesses: reportData.weaknesses || (reportData.swot_analysis?.weaknesses) || [],
    opportunities: reportData.opportunities || (reportData.swot_analysis?.opportunities) || [],
    threats: reportData.threats || (reportData.swot_analysis?.threats) || []
  };

  // Debug log SWOT data
  console.log('[InsightsView] Processed SWOT data:', {
    strengths: swotData.strengths?.length || 0,
    weaknesses: swotData.weaknesses?.length || 0,
    opportunities: swotData.opportunities?.length || 0, 
    threats: swotData.threats?.length || 0
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ArchetypeHeader 
        name={name} 
        description={shortDescription} 
        familyId={familyId}
        familyName={familyName}
        familyColor={familyColor}
        archetypeHexColor={familyColor}
        gnomeImage={getGnomeForArchetype(archetypeId)}
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
        {activeTab === 'swot' && <SwotTab archetypeData={reportData} swotData={swotData} hideRequestSection={hideRequestSection} />}
        {activeTab === 'disease-and-care' && <DiseaseAndCareTab archetypeData={reportData} />}
      </div>

      {!hideRequestSection && (
        <div className="border-t border-gray-100 mt-6">
          <DeepDiveRequestForm
            archetypeId={archetypeId}
            assessmentResult={assessmentResult}
            assessmentAnswers={assessmentAnswers}
            archetypeData={reportData}
          />
        </div>
      )}
    </div>
  );
};

export default InsightsView;
