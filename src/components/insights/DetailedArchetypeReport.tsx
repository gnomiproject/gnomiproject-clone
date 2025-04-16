
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { allDetailedArchetypes } = useArchetypes();
  const archetypeData = allDetailedArchetypes.find(archetype => archetype.id === archetypeId);
  
  if (!archetypeData) {
    return <div>No detailed data available for this archetype.</div>;
  }
  
  // Use the hex color if available, otherwise fall back to the Tailwind class naming convention
  const colorStyle = archetypeData.hexColor 
    ? { borderColor: archetypeData.hexColor } 
    : undefined;
  
  return (
    <div className="text-left">
      <div 
        className={`border-t-4 ${!colorStyle ? `border-archetype-${archetypeId}` : ''}`} 
        style={colorStyle}
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
