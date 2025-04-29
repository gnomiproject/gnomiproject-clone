
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import AssessmentResultsHeader from './AssessmentResultsHeader';
import InsightsView from './InsightsView';
import ArchetypeError from './ArchetypeError';
import ArchetypeLoadingSkeleton from './ArchetypeLoadingSkeleton';

interface AssessmentResultsCardProps {
  archetypeData: ArchetypeDetailedData;
  familyData: any;
  selectedArchetype: string;
  onRetakeAssessment: () => void;
  assessmentResult?: AssessmentResult | null;
  assessmentAnswers?: any;
  isLoading?: boolean;
}

const AssessmentResultsCard = ({ 
  archetypeData, 
  familyData, 
  selectedArchetype,
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers,
  isLoading = false
}: AssessmentResultsCardProps) => {
  const [error, setError] = useState<string | null>(null);

  // Log the assessment result for debugging
  React.useEffect(() => {
    if (assessmentResult) {
      console.log("AssessmentResultsCard: Using assessment result:", {
        primaryArchetype: assessmentResult.primaryArchetype,
        hasExactData: !!assessmentResult.exactData,
        employeeCount: assessmentResult?.exactData?.employeeCount
      });
    }
  }, [assessmentResult]);

  if (isLoading) {
    return <ArchetypeLoadingSkeleton />;
  }

  if (error) {
    return <ArchetypeError 
      message={error} 
      onRetry={onRetakeAssessment} 
      onRetakeAssessment={onRetakeAssessment} 
    />;
  }

  const renderAssessmentResults = () => {
    if (!archetypeData) {
      return null;
    }

    return (
      <div className="space-y-6">
        <AssessmentResultsHeader 
          archetypeName={archetypeData.name || selectedArchetype} 
          archetypeId={selectedArchetype}
          familyName={familyData?.name || archetypeData.familyName || ''}
          familyColor={archetypeData.hexColor || archetypeData.color || ''} 
          onRetakeAssessment={onRetakeAssessment}
          assessmentResult={assessmentResult}
        />
        <InsightsView
          archetypeId={selectedArchetype as ArchetypeId} 
          reportData={archetypeData}
          assessmentResult={assessmentResult}
          assessmentAnswers={assessmentAnswers}
          hideRequestSection={true}
        />
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      {renderAssessmentResults()}
    </Card>
  );
};

export default AssessmentResultsCard;
