
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

const ArchetypeReport = ({ 
  archetypeId, 
  reportData, 
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false
}: ArchetypeReportProps) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const familyColor = reportData.hexColor || reportData.color || '#4B5563';
  
  // Enhanced logging for assessment data
  useEffect(() => {
    if (assessmentResult) {
      console.log('[InsightsView] Using assessment result data', {
        hasAssessmentResult: true,
        archetypeId,
        primaryArchetype: assessmentResult.primaryArchetype,
        hasExactData: !!assessmentResult.exactData,
        exactEmployeeCount: assessmentResult?.exactData?.employeeCount,
        fullAssessmentResult: JSON.stringify(assessmentResult)
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ArchetypeHeader 
        name={reportData.name || 'Unknown Archetype'} 
        description={reportData.short_description || ''} 
        familyId={reportData.familyId}
        familyName={reportData.familyName || ''}
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
        {activeTab === 'swot' && <SwotTab archetypeData={reportData} swotData={{
          strengths: reportData.strengths || [],
          weaknesses: reportData.weaknesses || [],
          opportunities: reportData.opportunities || [],
          threats: reportData.threats || []
        }} />}
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

export default ArchetypeReport;
