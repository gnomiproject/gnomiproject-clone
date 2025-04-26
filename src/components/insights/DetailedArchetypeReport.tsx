
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  // Get the archetype data from useArchetypes hook
  const { allDetailedArchetypes } = useArchetypes();
  
  // Find the archetype data for the provided ID
  const archetypeData = allDetailedArchetypes.find(archetype => archetype.id === archetypeId);
  
  if (!archetypeData) {
    return <div>No detailed data available for this archetype.</div>;
  }
  
  return (
    <div className="text-left">
      <div 
        className="border-t-4"
        style={{ borderColor: archetypeData.hexColor || `var(--color-archetype-${archetypeId})` }} 
      >
        <DetailedAnalysisTabs 
          archetypeData={archetypeData} 
          onRetakeAssessment={onRetakeAssessment}
        />
      </div>
    </div>
  );
};

export default DetailedArchetypeReport;
