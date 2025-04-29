
import React, { useMemo, useRef, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import InsightsView from './InsightsView';
import ArchetypeLoadingSkeleton from './ArchetypeLoadingSkeleton';
import ArchetypeError from './ArchetypeError';
import { toast } from 'sonner';

interface InsightsContainerProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
  assessmentResult?: any;
  assessmentAnswers?: any;
}

const InsightsContainer = ({ 
  archetypeId, 
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers 
}: InsightsContainerProps) => {
  const { getArchetypeDetailedById } = useArchetypes();
  const renderCountRef = useRef(0);
  const processedRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Debug calls to identify load sequence
  console.log(`[InsightsContainer] Beginning data fetch for ${archetypeId}`);
  
  // Skip cache here to ensure we get fresh data
  const { 
    archetypeData: dbArchetypeData, 
    isLoading, 
    error, 
    refetch,
    dataSource 
  } = useGetArchetype(archetypeId, false); 
  
  const [retrying, setRetrying] = React.useState(false);
  
  // Enhanced logging for assessment data tracing
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`[InsightsContainer] Mount/Render #${renderCountRef.current} for ${archetypeId}`);
    console.log('[InsightsContainer] Assessment data check:', { 
      hasAssessmentResult: !!assessmentResult,
      assessmentResultKeys: assessmentResult ? Object.keys(assessmentResult) : null,
      hasExactData: assessmentResult?.exactData ? 'Yes' : 'No',
      exactEmployeeCount: assessmentResult?.exactData?.employeeCount,
      dataSource: dataSource
    });
    
    // Ensure exactData exists in assessmentResult
    if (assessmentResult && !assessmentResult.exactData) {
      console.log('[InsightsContainer] Adding exactData to assessment result');
      const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
      assessmentResult.exactData = {
        employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
      };
      console.log('[InsightsContainer] Updated assessment result:', assessmentResult);
    }
    
    // Reset flags when archetypeId changes
    if (archetypeId) {
      processedRef.current = false;
    }
    
    return () => {
      mountedRef.current = false;
      console.log(`[InsightsContainer] Unmounting for ${archetypeId}`);
    };
  }, [archetypeId, assessmentResult, dataSource]);
  
  // Handle retry logic
  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refetch();
    } catch (error: any) {
      toast.error(`Failed to refresh archetype data: ${error.message}`);
    } finally {
      setRetrying(false);
    }
  };
  
  // Use memoization with strict dependency tracking to prevent redundant calculations
  const archetypeData = useMemo(() => {
    // Skip processing if already done or component unmounted
    if (processedRef.current || !mountedRef.current) {
      console.log(`[InsightsContainer] Skipping redundant processing for ${archetypeId}`);
      return dbArchetypeData || getArchetypeDetailedById(archetypeId);
    }
    
    // Set processing flag immediately before any operations
    processedRef.current = true;
    console.log(`[InsightsContainer] Processing data for ${archetypeId} (sequence #${renderCountRef.current})`);
    
    // Get data from API or fallback to local data
    const data = dbArchetypeData || getArchetypeDetailedById(archetypeId);
    
    if (data) {
      console.log(`[InsightsContainer] Data found:`, { 
        name: data.name || data.archetype_name,
        id: data.id || data.archetype_id,
        familyId: data.familyId || data.family_id
      });
    } else {
      console.warn(`[InsightsContainer] No data found for archetype ${archetypeId}`);
    }
    
    return data;
  }, [dbArchetypeData, getArchetypeDetailedById, archetypeId]);
  
  // Show loading state
  if (isLoading) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // Show error state if there's an API error
  if (error) {
    return (
      <ArchetypeError 
        message="We couldn't connect to the database to load your archetype data."
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={retrying}
      />
    );
  }
  
  // Show error state if no data is available
  if (!archetypeData) {
    return (
      <ArchetypeError 
        message="No data available for this archetype. Please try retaking the assessment."
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={retrying}
      />
    );
  }
  
  // Create a default fallback for basic props to prevent null errors
  const safeArchetypeData = {
    ...archetypeData,
    name: archetypeData.name || archetypeData.archetype_name || `Archetype ${archetypeId.toUpperCase()}`,
    hexColor: archetypeData.hexColor || archetypeData.color || '#6E59A5',
    color: archetypeData.color || archetypeData.hexColor || '#6E59A5',
    familyName: archetypeData.familyName || archetypeData.family_name || 'Healthcare Archetype'
  };
  
  console.log('[InsightsContainer] Rendering with assessment data:', {
    hasAssessmentResult: !!assessmentResult,
    hasAssessmentAnswers: !!assessmentAnswers,
    exactEmployeeCount: assessmentResult?.exactData?.employeeCount
  });
  
  return (
    <InsightsView 
      archetypeId={archetypeId}
      reportData={safeArchetypeData}
      assessmentResult={assessmentResult}
      assessmentAnswers={assessmentAnswers}
      hideRequestSection={false}
    />
  );
};

export default InsightsContainer;
