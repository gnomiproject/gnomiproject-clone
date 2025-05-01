
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
import { toast } from 'sonner';

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

  // Add debugging for SWOT data
  useEffect(() => {
    console.log('[InsightsView] Report data received:', {
      archetypeId: reportData?.id || reportData?.archetype_id || 'unknown',
      hasReportData: !!reportData,
      hasStrengths: !!reportData?.strengths,
      strengthsType: reportData?.strengths ? typeof reportData.strengths : 'undefined',
      hasWeaknesses: !!reportData?.weaknesses,
      hasOpportunities: !!reportData?.opportunities,
      hasThreats: !!reportData?.threats
    });
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

  // For debugging SWOT data issues
  useEffect(() => {
    console.log('[InsightsView] SWOT data availability check:', {
      directStrengths: reportData.strengths ? 'Available' : 'Not available',
      swotAnalysis: reportData.swot_analysis ? 'Available' : 'Not available',
      enhancedSwot: reportData.enhanced?.swot ? 'Available' : 'Not available',
    });
  }, [reportData]);

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
        {activeTab === 'swot' && <SwotTab archetypeData={reportData} />}
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
