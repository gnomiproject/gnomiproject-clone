
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import ArchetypeContent from './ArchetypeContent';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { getArchetypeDetailedById } = useArchetypes();
  const archetypeData = getArchetypeDetailedById(archetypeId);
  
  return (
    <ArchetypeContent 
      archetypeData={archetypeData}
      archetypeId={archetypeId}
      onRetakeAssessment={onRetakeAssessment}
    />
  );
};

export default DetailedArchetypeReport;
