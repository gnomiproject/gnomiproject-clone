
import React, { useEffect } from 'react';
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
  // Add debugging to trace the exact employee count data
  useEffect(() => {
    if (assessmentResult) {
      console.log('[DeepDiveRequestForm] Assessment data check', {
        hasAssessmentResult: true,
        archetypeId,
        primaryArchetype: assessmentResult.primaryArchetype,
        resultTier: assessmentResult.resultTier,
        hasExactData: !!assessmentResult?.exactData,
        exactEmployeeCount: assessmentResult?.exactData?.employeeCount,
        fullAssessmentResult: JSON.stringify(assessmentResult)
      });
      
      // Check if we need to ensure exactData exists
      if (!assessmentResult.exactData) {
        console.warn('[DeepDiveRequestForm] exactData property missing from assessmentResult');
        const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
        if (storedEmployeeCount) {
          console.log('[DeepDiveRequestForm] Found employee count in session storage:', storedEmployeeCount);
          assessmentResult.exactData = {
            employeeCount: Number(storedEmployeeCount)
          };
        }
      }
    } else {
      console.log('[DeepDiveRequestForm] No assessment result data available');
    }
  }, [assessmentResult, archetypeId]);

  return (
    <DeepDiveFormContainer
      archetypeId={archetypeId}
      assessmentResult={assessmentResult}
      assessmentAnswers={assessmentAnswers}
      archetypeData={archetypeData}
    />
  );
};

export default DeepDiveRequestForm;
