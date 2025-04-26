
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  // Use the specialized hook to get comprehensive archetype data
  const { archetypeData, isLoading, error } = useGetArchetype(archetypeId);
  
  if (isLoading) {
    return <div>Loading archetype data...</div>;
  }
  
  if (error || !archetypeData) {
    // Fallback to the useArchetypes hook if the specialized hook fails
    const { allDetailedArchetypes } = useArchetypes();
    const fallbackArchetypeData = allDetailedArchetypes.find(archetype => archetype.id === archetypeId);
    
    if (!fallbackArchetypeData) {
      return <div>No detailed data available for this archetype.</div>;
    }
    
    // Use the fallback data
    return (
      <div className="text-left">
        <div 
          className="border-t-4"
          style={{ borderColor: fallbackArchetypeData.hexColor || `var(--color-archetype-${archetypeId})` }} 
        >
          <DetailedAnalysisTabs 
            archetypeData={fallbackArchetypeData} 
            onRetakeAssessment={onRetakeAssessment}
          />
        </div>
      </div>
    );
  }
  
  // Use the data from the specialized hook
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
