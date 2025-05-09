
import React, { useMemo, useRef } from 'react';
import { ArchetypeId } from '@/types/archetype';
import DeepDiveFormContainer from './deep-dive-form/DeepDiveFormContainer';

interface DeepDiveRequestFormProps {
  archetypeId: ArchetypeId;
  assessmentResult?: any;
  assessmentAnswers?: any;
  archetypeData?: any;
}

const DeepDiveRequestForm = ({ 
  archetypeId, 
  assessmentResult,
  assessmentAnswers,
  archetypeData 
}: DeepDiveRequestFormProps) => {
  // Use a ref to track if we've already processed this exact assessment result
  const processedDataRef = useRef<{id: string, result: any} | null>(null);
  
  // Use useMemo to process assessment result only once for the same input
  const processedAssessmentResult = useMemo(() => {
    // If we've already processed this exact result and archetypeId, return the cached value
    if (processedDataRef.current?.id === archetypeId) {
      return processedDataRef.current.result;
    }
    
    // Only log once when processing a new result
    console.log('[DeepDiveRequestForm] Assessment data check', {
      hasAssessmentResult: !!assessmentResult,
      archetypeId,
      hasExactData: !!assessmentResult?.exactData
    });
    
    // Clone and modify the assessment result if needed
    let result;
    if (assessmentResult && !assessmentResult.exactData) {
      const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
      result = {...assessmentResult};
      result.exactData = {
        employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
      };
    } else {
      result = assessmentResult;
    }
    
    // Cache the processed result
    processedDataRef.current = {
      id: archetypeId,
      result
    };
    
    return result;
  }, [assessmentResult, archetypeId]);

  return (
    <DeepDiveFormContainer
      archetypeId={archetypeId}
      assessmentResult={processedAssessmentResult}
      assessmentAnswers={assessmentAnswers}
      archetypeData={archetypeData}
    />
  );
};

// Use React.memo with a custom equality function to prevent unnecessary re-renders
export default React.memo(DeepDiveRequestForm, (prevProps, nextProps) => {
  return prevProps.archetypeId === nextProps.archetypeId &&
         JSON.stringify(prevProps.assessmentResult?.exactData) === JSON.stringify(nextProps.assessmentResult?.exactData);
});
