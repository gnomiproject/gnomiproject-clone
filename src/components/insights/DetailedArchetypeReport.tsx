
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
}

const DetailedArchetypeReport = ({ archetypeId }: DetailedArchetypeReportProps) => {
  const { getArchetypeEnhanced } = useArchetypes();
  const archetypeData = getArchetypeEnhanced(archetypeId);
  
  if (!archetypeData) {
    return <div>No detailed data available for this archetype.</div>;
  }
  
  return (
    <div className="text-left">
      <DetailedAnalysisTabs archetypeData={archetypeData} />
    </div>
  );
};

export default DetailedArchetypeReport;
