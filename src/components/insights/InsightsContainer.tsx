
import React, { useState, useEffect } from 'react';
import InsightsView from './InsightsView';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypeLoader } from '@/hooks/useArchetypeLoader';
import { useArchetypeDetails } from '@/hooks/archetype/useArchetypeDetails';
import ArchetypeLoadingSkeleton from './ArchetypeLoadingSkeleton';
import ArchetypeError from './ArchetypeError';
import RetakeAssessmentLink from './RetakeAssessmentLink';

interface InsightsContainerProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment?: () => void;
  assessmentResult?: any;
  assessmentAnswers?: any;
  hideRequestSection?: boolean;
}

const InsightsContainer: React.FC<InsightsContainerProps> = ({
  archetypeId,
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false
}) => {
  const { isLoading, data: reportData, error } = useArchetypeDetails(archetypeId);
  const [showDebugData, setShowDebugData] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { refreshArchetypeData } = useArchetypeLoader();

  // Toggle functions
  const toggleDebugData = () => setShowDebugData(prev => !prev);
  const toggleDiagnostics = () => setShowDiagnostics(prev => !prev);

  if (isLoading) {
    return <ArchetypeLoadingSkeleton />;
  }

  if (error || !reportData) {
    return (
      <ArchetypeError 
        error={error} 
        archetypeId={archetypeId}
        onRetake={onRetakeAssessment}
      />
    );
  }

  return (
    <div className="space-y-4">
      {onRetakeAssessment && (
        <RetakeAssessmentLink onRetakeAssessment={onRetakeAssessment} />
      )}
      
      <InsightsView 
        archetypeId={archetypeId}
        reportData={reportData}
        assessmentResult={assessmentResult}
        assessmentAnswers={assessmentAnswers}
        hideRequestSection={hideRequestSection}
      />
    </div>
  );
};

export default InsightsContainer;
