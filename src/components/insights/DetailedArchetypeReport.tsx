
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { getArchetypeEnhanced } = useArchetypes();
  const archetypeData = getArchetypeEnhanced(archetypeId);
  
  if (!archetypeData) {
    return <div>No detailed data available for this archetype.</div>;
  }
  
  return (
    <div className="text-left">
      <DetailedAnalysisTabs 
        archetypeData={archetypeData} 
        onRetakeAssessment={onRetakeAssessment}
      />
    </div>
  );
};

export default DetailedArchetypeReport;
