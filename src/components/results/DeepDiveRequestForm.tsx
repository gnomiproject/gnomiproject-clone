
import React, { useMemo } from 'react';
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
  // Use useMemo to process assessment result only once
  const processedAssessmentResult = useMemo(() => {
    // Only log once
    console.log('[DeepDiveRequestForm] Assessment data check', {
      hasAssessmentResult: !!assessmentResult,
      archetypeId,
      hasExactData: !!assessmentResult?.exactData
    });
    
    // Clone and modify the assessment result if needed
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

  return (
    <DeepDiveFormContainer
      archetypeId={archetypeId}
      assessmentResult={processedAssessmentResult}
      assessmentAnswers={assessmentAnswers}
      archetypeData={archetypeData}
    />
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(DeepDiveRequestForm);
