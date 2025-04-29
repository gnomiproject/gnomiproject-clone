
import React from 'react';
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
  // Ensure we're passing the complete assessment result that contains exactData
  if (assessmentResult) {
    console.log('DeepDiveRequestForm: Passing data to form', {
      archetypeId,
      hasAssessmentResult: !!assessmentResult,
      hasExactEmployeeCount: !!assessmentResult?.exactData?.employeeCount,
      exactEmployeeCount: assessmentResult?.exactData?.employeeCount
    });
  }

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
