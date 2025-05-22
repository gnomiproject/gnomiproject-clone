
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import UnlockReportModal from './UnlockReportModal';
import UnlockSuccessMessage from './UnlockSuccessMessage';
import { useReportUnlock, UnlockFormData } from '@/hooks/useReportUnlock';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArchetypeDetails } from '@/hooks/archetype/useArchetypeDetails';
import { Badge } from '@/components/ui/badge';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: ArchetypeDetailedData;
  assessmentResult?: any;
  assessmentAnswers?: any;
  hideRequestSection?: boolean;
  isPreUnlocked?: boolean; // Added prop to receive unlock status from parent
}

const InsightsView = ({ 
  archetypeId, 
  reportData: initialReportData, 
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false,
  isPreUnlocked = false // Default to false
}: ArchetypeReportProps) => {
  // Always define hooks at the top level
  const [activeTab, setActiveTab] = React.useState('overview');
  const processedRef = useRef(false);
  const swotLoggedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ArchetypeDetailedData>(initialReportData);
  
  // Refetch data capability
  const { data: refreshedData, isLoading: refreshLoading, error: refreshError, refetch } = 
    useArchetypeDetails(archetypeId);
  
  // Initialize unlock status hook - pass isPreUnlocked to override initial state
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
  
  // For debugging
  useEffect(() => {
    console.log("[InsightsView] Unlock status:", { 
      isPreUnlocked, 
      hookUnlocked, 
      combinedUnlocked: isUnlocked 
    });
  }, [isPreUnlocked, hookUnlocked, isUnlocked]);
  
  // Listen for unlock status changes and refresh data when needed
  useEffect(() => {
    if (isUnlocked) {
      console.log("[InsightsView] Report has been unlocked, refreshing data");
      setIsLoading(true);
      
      // First try to refresh data through the hook
      refreshData(archetypeId)
        .then(success => {
          if (success) {
            console.log("[InsightsView] Successfully refreshed data through hook");
            return;
          }
          
          // If that fails, use the standard refetch
          console.log("[InsightsView] Fallback to standard refetch");
          return refetch();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isUnlocked, archetypeId, refreshData, refetch]);
  
  // Update report data when refreshed data is available
  useEffect(() => {
    if (refreshedData && !refreshLoading) {
      console.log("[InsightsView] Received refreshed data", {
        hasSwotData: !!(refreshedData.swot_analysis || refreshedData.strengths),
        isUnlocked
      });
      setReportData(refreshedData);
    }
  }, [refreshedData, refreshLoading, isUnlocked]);
  
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

  // Enhanced logging for data availability
  console.log('[InsightsView] Available data for tab rendering:', {
    hasMetricsData: !!(reportData.distinctive_metrics || reportData.detailed_metrics),
    hasSwotData: !!(reportData.strengths || reportData.swot_analysis),
    hasDiseaseData: !!(reportData["Dise_Heart Disease Prevalence"] || reportData["Dise_Type 2 Diabetes Prevalence"]),
    activeTab,
    isUnlocked
  });

  // Ensure we have all the required properties for rendering
  const name = reportData?.name || reportData?.archetype_name || 'Unknown Archetype';
  const shortDescription = reportData?.short_description || '';
  const familyId = reportData?.familyId || reportData?.family_id;
  const familyName = reportData?.familyName || reportData?.family_name || '';
  // Fix: Use hexColor first, then fall back to color for compatibility with database sources
  const familyColor = reportData?.hexColor || reportData?.color || (reportData as any)?.hex_color || '#4B5563';

  // Debug data availability - better checks for all possible object paths
  const hasMetricsData = !!(
    reportData.distinctive_metrics || 
    reportData.detailed_metrics || 
    (reportData as any).Cost_Medical_Paid_Amount_PEPY
  );
  
  const hasSwotData = !!(reportData.strengths || reportData.swot_analysis);
  
  const hasDiseaseData = !!(
    reportData["Dise_Heart Disease Prevalence"] || 
    reportData["Dise_Type 2 Diabetes Prevalence"] ||
    Object.keys(reportData).some(key => key.toLowerCase().includes('dise_'))
  );

  console.log('[InsightsView] Rendering with data:', { 
    name, 
    familyName, 
    familyId, 
    familyColor, 
    isUnlocked,
    hasMetricsData,
    hasSwotData,
    hasDiseaseData
  });

  // Handle form submission with proper typing
  const handleUnlockFormSubmit = async (formData: UnlockFormData) => {
    console.log('[InsightsView] Submitting unlock form with data:', { 
      ...formData, 
      assessmentAnswers: assessmentAnswers ? '[data present]' : '[no data]' 
    });
    return submitUnlockForm(formData);
  };

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
        {/* Show loading state while refreshing data */}
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center">
            <div className="mr-3 h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="text-blue-800">Loading your unlocked content...</p>
          </div>
        )}
      
        {/* Show success message if unlocked */}
        {isUnlocked && !isLoading && (
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
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                >
                  Unlock Full Report
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'metrics' && (
          <>
            {/* IMPORTANT: Show metrics data regardless of unlock status if data exists */}
            {hasMetricsData ? (
              <MetricsTab archetypeData={reportData} />
            ) : !isUnlocked ? (
              <UnlockPlaceholder name={name} onUnlock={openUnlockModal} />
            ) : (
              <div className="py-12 text-center">
                <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-800 hover:bg-yellow-100">Data Availability</Badge>
                <h3 className="text-xl font-medium text-gray-800">Metrics data is being prepared</h3>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                  Your metrics data is being processed and will be available soon. Please check back later.
                </p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'swot' && (
          <>
            {/* IMPORTANT: Show SWOT data regardless of unlock status if data exists */}
            {hasSwotData ? (
              <SwotTab archetypeData={reportData} />
            ) : !isUnlocked ? (
              <UnlockPlaceholder name={name} onUnlock={openUnlockModal} />
            ) : (
              <div className="py-12 text-center">
                <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-800 hover:bg-yellow-100">Data Availability</Badge>
                <h3 className="text-xl font-medium text-gray-800">SWOT data is being prepared</h3>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                  Your SWOT analysis is being processed and will be available soon. Please check back later.
                </p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'disease-and-care' && (
          <>
            {/* IMPORTANT: Show Disease data regardless of unlock status if data exists */}
            {hasDiseaseData ? (
              <DiseaseAndCareTab archetypeData={reportData} />
            ) : !isUnlocked ? (
              <UnlockPlaceholder name={name} onUnlock={openUnlockModal} />
            ) : (
              <div className="py-12 text-center">
                <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-800 hover:bg-yellow-100">Data Availability</Badge>
                <h3 className="text-xl font-medium text-gray-800">Disease & Care data is being prepared</h3>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                  Your disease and care data is being processed and will be available soon. Please check back later.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Unlock report modal with proper submission handler */}
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

// Placeholder component for locked tabs
const UnlockPlaceholder = ({ name, onUnlock }: { name: string, onUnlock: () => void }) => (
  <div className="py-16 px-4 text-center">
    <div className="relative inline-block mb-6">
      <div className="absolute w-16 h-16 bg-blue-100 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <Lock className="mx-auto h-12 w-12 text-blue-600 relative z-10" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">Premium Content Locked</h3>
    <p className="text-gray-600 max-w-md mx-auto mb-6">
      Unlock access to all detailed insights for your {name} archetype by providing a few details. No credit card required.
    </p>
    <Button 
      onClick={onUnlock}
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
    >
      Unlock Full Report
    </Button>
  </div>
);

// Use React.memo with a custom equality function to prevent unnecessary re-renders
export default React.memo(InsightsView, (prevProps, nextProps) => {
  return prevProps.archetypeId === nextProps.archetypeId && 
         prevProps.reportData.id === nextProps.reportData.id &&
         prevProps.hideRequestSection === nextProps.hideRequestSection &&
         prevProps.isPreUnlocked === nextProps.isPreUnlocked;
});
