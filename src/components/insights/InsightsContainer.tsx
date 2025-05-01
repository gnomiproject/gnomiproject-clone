
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
}

const InsightsContainer = ({ 
  archetypeId, 
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers 
}: InsightsContainerProps) => {
  // Always define hooks first regardless of condition
  const renderCountRef = useRef(0);
  const mountedRef = useRef(true);
  const [retrying, setRetrying] = React.useState(false);
  
  // Debug calls to identify load sequence - only log once
  useEffect(() => {
    console.log(`[InsightsContainer] Beginning data fetch for ${archetypeId}`);
    
    return () => {
      mountedRef.current = false;
      console.log(`[InsightsContainer] Unmounting for ${archetypeId}`);
    };
  }, [archetypeId]); // Only run on mount and archetypeId change
  
  // Skip cache here to ensure we get fresh data
  const { 
    archetypeData, 
    isLoading, 
    error, 
    refetch,
    dataSource 
  } = useGetArchetype(archetypeId, false); 
  
  // Enhanced logging for assessment data tracing - using useMemo to prevent redundant processing
  const processedAssessmentResult = useMemo(() => {
    renderCountRef.current += 1;
    
    // Only log on first render or when assessment data changes
    if (renderCountRef.current === 1 || renderCountRef.current % 5 === 0) {
      console.log(`[InsightsContainer] Mount/Render #${renderCountRef.current} for ${archetypeId}`);
    }
    
    // Ensure exactData exists in assessmentResult
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
  if (isLoading) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // Show error state if there's an API error
  if (error || !archetypeData) {
    return (
      <ArchetypeError 
        message="We're having trouble retrieving archetype data. Please try again later or retake the assessment."
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
  
  return (
    <InsightsView 
      archetypeId={archetypeId}
      reportData={safeArchetypeData}
      assessmentResult={processedAssessmentResult}
      assessmentAnswers={assessmentAnswers}
      hideRequestSection={false}
    />
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(InsightsContainer);
