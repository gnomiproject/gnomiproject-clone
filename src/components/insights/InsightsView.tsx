
import React, { useEffect, useState } from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import UnlockReportModal from './UnlockReportModal';
import UnlockSuccessMessage from './UnlockSuccessMessage';
import { useReportUnlock, UnlockFormData } from '@/hooks/useReportUnlock';
import BetaBadge from '@/components/shared/BetaBadge';
import { useArchetypeData } from './hooks/useArchetypeData';
import { useTabDataAvailability } from './hooks/useTabDataAvailability';
import LoadingState from './components/LoadingState';
import UnlockCallToAction from './components/UnlockCallToAction';
import TabContentRenderer from './components/TabContentRenderer';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: ArchetypeDetailedData;
  assessmentResult?: any;
  assessmentAnswers?: any;
  hideRequestSection?: boolean;
  isPreUnlocked?: boolean;
}

const InsightsView = ({ 
  archetypeId, 
  reportData: initialReportData, 
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false,
  isPreUnlocked = false
}: ArchetypeReportProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize unlock status hook
  const {
    isUnlocked: hookUnlocked,
    isSubmitting,
    showUnlockModal,
    openUnlockModal,
    closeUnlockModal,
    submitUnlockForm,
    submissionError,
    refreshData
  } = useReportUnlock(archetypeId);

  // Combine the pre-unlocked state with the hook state
  const isUnlocked = isPreUnlocked || hookUnlocked;
  
  // Use custom hooks for data management
  const {
    reportData,
    isLoading,
    setIsLoading,
    refetch,
    processedAssessmentResult,
    name,
    shortDescription,
    familyId,
    familyName,
    familyColor
  } = useArchetypeData(archetypeId, initialReportData, assessmentResult, isUnlocked);

  const tabDataAvailability = useTabDataAvailability(reportData);

  // Debug logging
  useEffect(() => {
    console.log("[InsightsView] Unlock status:", { 
      isPreUnlocked, 
      hookUnlocked, 
      combinedUnlocked: isUnlocked 
    });
  }, [isPreUnlocked, hookUnlocked, isUnlocked]);
  
  // Handle data refresh when unlocked
  useEffect(() => {
    if (isUnlocked) {
      console.log("[InsightsView] Report has been unlocked, refreshing data");
      setIsLoading(true);
      
      refreshData(archetypeId)
        .then(success => {
          if (success) {
            console.log("[InsightsView] Successfully refreshed data through hook");
            return;
          }
          
          console.log("[InsightsView] Fallback to standard refetch");
          return refetch();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isUnlocked, archetypeId, refreshData, refetch, setIsLoading]);

  // Handle redirect for removed tabs
  useEffect(() => {
    if (activeTab === 'swot' || activeTab === 'disease-and-care' || activeTab === 'metrics') {
      setActiveTab('overview');
    }
  }, [activeTab]);

  // Handle form submission
  const handleUnlockFormSubmit = async (formData: UnlockFormData) => {
    console.log('[InsightsView] Submitting unlock form with data:', { 
      ...formData, 
      assessmentAnswers: assessmentAnswers ? '[data present]' : '[no data]' 
    });
    return submitUnlockForm(formData);
  };

  // Error state
  if (!reportData) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      {/* Beta Badge - positioned in bottom right corner */}
      <div className="fixed bottom-6 right-6 z-[9999] shadow-lg print:hidden">
        <BetaBadge sticky={true} />
      </div>

      <ArchetypeHeader 
        name={name} 
        description={shortDescription} 
        familyId={familyId}
        familyName={familyName}
        familyColor={familyColor}
        archetypeHexColor={familyColor}
        archetypeId={archetypeId}
        gnomeImage="chart"
      />
      
      <ArchetypeNavTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isUnlocked={isUnlocked}
        onUnlockRequest={openUnlockModal}
        archetypeColor={familyColor}
      />
      
      <div className="p-4 md:p-6">
        {/* Show loading state while refreshing data */}
        {isLoading && <LoadingState />}
      
        {/* Only show success message on overview tab */}
        {activeTab === 'overview' && isUnlocked && !isLoading && (
          <UnlockSuccessMessage archetypeName={name} />
        )}
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <OverviewTab 
              archetypeData={reportData} 
              familyColor={familyColor}
            />
            
            {/* Unlock call-to-action when not unlocked yet */}
            {!isUnlocked && (
              <UnlockCallToAction name={name} onUnlock={openUnlockModal} />
            )}
          </div>
        )}

        {/* Render other tabs using the centralized renderer */}
        {activeTab !== 'overview' && (
          <TabContentRenderer
            activeTab={activeTab}
            reportData={reportData}
            isUnlocked={isUnlocked}
            name={name}
            onUnlock={openUnlockModal}
            {...tabDataAvailability}
          />
        )}
      </div>
      
      <UnlockReportModal
        isOpen={showUnlockModal}
        onClose={closeUnlockModal}
        onSubmit={handleUnlockFormSubmit}
        isSubmitting={isSubmitting}
        archetypeId={archetypeId}
        archetypeName={name}
        employeeCount={processedAssessmentResult?.exactData?.employeeCount}
        assessmentAnswers={assessmentAnswers}
        submissionError={submissionError}
      />
    </div>
  );
};

// Use React.memo with a custom equality function to prevent unnecessary re-renders
export default React.memo(InsightsView, (prevProps, nextProps) => {
  return prevProps.archetypeId === nextProps.archetypeId && 
         prevProps.reportData.id === nextProps.reportData.id &&
         prevProps.hideRequestSection === nextProps.hideRequestSection &&
         prevProps.isPreUnlocked === nextProps.isPreUnlocked;
});
