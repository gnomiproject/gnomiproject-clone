
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import AssessmentResultsHeader from './AssessmentResultsHeader';
import ArchetypeReport from './ArchetypeReport';
import ArchetypeError from './ArchetypeError';
import ArchetypeLoadingSkeleton from './ArchetypeLoadingSkeleton';

interface AssessmentResultsCardProps {
  archetypeData: ArchetypeDetailedData;
  familyData: any;
  selectedArchetype: string;
  onRetakeAssessment: () => void;
  assessmentResult?: AssessmentResult | null;
  assessmentAnswers?: any;
}

const AssessmentResultsCard = ({ 
  archetypeData, 
  familyData, 
  selectedArchetype,
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers
}: AssessmentResultsCardProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
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
        <ArchetypeReport 
          archetypeId={selectedArchetype as ArchetypeId} 
          reportData={archetypeData}
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
