import React, { useEffect, useMemo, useRef } from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import DeepDiveRequestForm from '@/components/results/DeepDiveRequestForm';
import UnlockReportModal from './UnlockReportModal';
import UnlockSuccessMessage from './UnlockSuccessMessage';
import { useReportUnlock } from '@/hooks/useReportUnlock';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const processedRef = useRef(false);
  const swotLoggedRef = useRef(false);
  
  // Initialize unlock status hook
  const {
    isUnlocked,
    isSubmitting,
    showUnlockModal,
    openUnlockModal,
    closeUnlockModal,
    submitUnlockForm
  } = useReportUnlock(archetypeId);
  
  // Process assessment data once with useMemo to prevent redundant processing
  const processedAssessmentResult = useMemo(() => {
    // Skip if we've already processed this result for this archetype
    if (processedRef.current) {
      return assessmentResult;
    }
    
    // Only log once when the component mounts or when assessment data changes
    console.log('[InsightsView] Using assessment result data', {
      hasAssessmentResult: !!assessmentResult,
      archetypeId,
      exactEmployeeCount: assessmentResult?.exactData?.employeeCount
    });
    
    processedRef.current = true;
    
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
    if (reportData?.strengths && !swotLoggedRef.current) {
      console.log('[InsightsView] SWOT data available:', {
        directStrengths: !!reportData.strengths,
        swotAnalysis: !!reportData.swot_analysis,
        enhancedSwot: !!reportData.enhanced?.swot
      });
      swotLoggedRef.current = true;
    }
    
    // Reset refs when archetypeId changes
    return () => {
      processedRef.current = false;
      swotLoggedRef.current = false;
    };
  }, [reportData, archetypeId]);

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
      
      <ArchetypeNavTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isUnlocked={isUnlocked}
        onUnlockRequest={openUnlockModal}
      />
      
      <div className="p-4 md:p-6">
        {/* Show success message if unlocked */}
        {isUnlocked && (
          <UnlockSuccessMessage archetypeName={name} />
        )}
        
        {activeTab === 'overview' && (
          <div>
            <OverviewTab 
              archetypeData={reportData} 
              familyColor={familyColor}
            />
            
            {/* Unlock call-to-action when not unlocked yet */}
            {!isUnlocked && (
              <div className="mt-8 p-4 border border-blue-100 bg-blue-50 rounded-lg flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-blue-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Unlock your complete {name} archetype insights
                  </h3>
                  <p className="text-blue-700 mt-1">
                    Get access to detailed metrics, SWOT analysis, and disease & care patterns by providing a few details.
                  </p>
                </div>
                <Button 
                  onClick={openUnlockModal}
                  className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                >
                  Unlock Full Report
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'metrics' && isUnlocked && <MetricsTab archetypeData={reportData} />}
        {activeTab === 'swot' && isUnlocked && <SwotTab archetypeData={reportData} />}
        {activeTab === 'disease-and-care' && isUnlocked && <DiseaseAndCareTab archetypeData={reportData} />}
        
        {/* Conditionally show a placeholder if not unlocked and not on overview tab */}
        {!isUnlocked && activeTab !== 'overview' && (
          <div className="py-12 px-4 text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">This content is locked</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Unlock access to all detailed insights for your {name} archetype by providing a few details.
            </p>
            <Button 
              onClick={openUnlockModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Unlock Full Report
            </Button>
          </div>
        )}
      </div>

      {/* Only show the request form section if not unlocked and not explicitly hidden */}
      {!isUnlocked && !hideRequestSection && (
        <div className="border-t border-gray-100 mt-6">
          <DeepDiveRequestForm
            archetypeId={archetypeId}
            assessmentResult={processedAssessmentResult}
            assessmentAnswers={assessmentAnswers}
            archetypeData={reportData}
          />
        </div>
      )}
      
      {/* Unlock report modal */}
      <UnlockReportModal
        isOpen={showUnlockModal}
        onClose={closeUnlockModal}
        onSubmit={submitUnlockForm}
        isSubmitting={isSubmitting}
        archetypeId={archetypeId}
        archetypeName={name}
        employeeCount={processedAssessmentResult?.exactData?.employeeCount}
        assessmentAnswers={assessmentAnswers}
      />
    </div>
  );
};

// Use React.memo with a custom equality function to prevent unnecessary re-renders
export default React.memo(InsightsView, (prevProps, nextProps) => {
  return prevProps.archetypeId === nextProps.archetypeId && 
         prevProps.reportData.id === nextProps.reportData.id &&
         prevProps.hideRequestSection === nextProps.hideRequestSection;
});
