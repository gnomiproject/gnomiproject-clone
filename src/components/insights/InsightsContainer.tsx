
import React, { useMemo, useRef, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
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
  hideRequestSection?: boolean;
}

const InsightsContainer = ({ 
  archetypeId, 
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false
}: InsightsContainerProps) => {
  // Always define hooks first regardless of condition
  const renderCountRef = useRef(0);
  const mountedRef = useRef(true);
  const processedResultRef = useRef<any>(null);
  const [retrying, setRetrying] = React.useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  
  // Enhanced debugging - log component initialization
  useEffect(() => {
    console.log(`[InsightsContainer] Component mounted for archetype: ${archetypeId}`);
    
    // Mark initial load as complete after a short delay
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setInitialLoadComplete(true);
      }
    }, 500);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      console.log(`[InsightsContainer] Unmounting for ${archetypeId}`);
    };
  }, [archetypeId]);
  
  // Skip cache here to ensure we get fresh data
  const { 
    archetypeData, 
    isLoading, 
    error, 
    refetch,
    dataSource 
  } = useGetArchetype(archetypeId, false); 
  
  // Enhanced logging for assessment data tracing - using useMemo with strict equality check
  const processedAssessmentResult = useMemo(() => {
    // Return cached result if we've already processed this exact assessmentResult
    if (processedResultRef.current && 
        processedResultRef.current.originalId === archetypeId) {
      return processedResultRef.current.result;
    }
    
    renderCountRef.current += 1;
    console.log(`[InsightsContainer] Processing assessment result for ${archetypeId}, render #${renderCountRef.current}`);
    
    try {
      // Ensure exactData exists in assessmentResult
      let processedResult;
      if (assessmentResult && !assessmentResult.exactData) {
        const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
        processedResult = {...assessmentResult};
        processedResult.exactData = {
          employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
        };
      } else {
        processedResult = assessmentResult;
      }
      
      // Cache the processed result
      processedResultRef.current = {
        originalId: archetypeId,
        result: processedResult
      };
      
      return processedResult;
    } catch (err) {
      console.error("[InsightsContainer] Error processing assessment result:", err);
      return assessmentResult; // Return original on error
    }
  }, [assessmentResult, archetypeId]);
  
  // Handle retry logic
  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refetch();
      toast.success("Reconnected successfully");
    } catch (error: any) {
      toast.error(`Could not refresh data: ${error.message}`, {
        description: "No data available"
      });
    } finally {
      setRetrying(false);
    }
  };
  
  // Show loading state
  if (isLoading && !initialLoadComplete) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // Show error state if there's an API error
  if ((error || !archetypeData) && initialLoadComplete) {
    console.error("[InsightsContainer] Error loading archetype data:", error);
    return (
      <ArchetypeError 
        message="We're having trouble retrieving archetype data. Please try again later or retake the assessment."
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={retrying}
      />
    );
  }
  
  // Handle the edge case where archetypeData is still undefined but we're not technically "loading"
  if (!archetypeData) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // Create a default fallback for basic props to prevent null errors
  const safeArchetypeData = {
    ...archetypeData,
    name: archetypeData.name || archetypeData.archetype_name || `Archetype ${archetypeId.toUpperCase()}`,
    hexColor: archetypeData.hexColor || archetypeData.color || '#6E59A5',
    color: archetypeData.color || archetypeData.hexColor || '#6E59A5',
    familyName: archetypeData.familyName || archetypeData.family_name || 'Healthcare Archetype'
  };
  
  // Explicitly pass the hideRequestSection prop
  return (
    <InsightsView 
      archetypeId={archetypeId}
      reportData={safeArchetypeData}
      assessmentResult={processedAssessmentResult}
      assessmentAnswers={assessmentAnswers}
      hideRequestSection={hideRequestSection}
    />
  );
};

// Use React.memo with custom equality function to prevent unnecessary re-renders
export default React.memo(InsightsContainer, (prevProps, nextProps) => {
  return prevProps.archetypeId === nextProps.archetypeId &&
         JSON.stringify(prevProps.assessmentResult) === JSON.stringify(nextProps.assessmentResult);
});
