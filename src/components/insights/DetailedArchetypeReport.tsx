
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import ArchetypeContent from './ArchetypeContent';
import { useGetArchetype } from '@/hooks/useGetArchetype';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { getArchetypeDetailedById } = useArchetypes();
  const { archetypeData: dbArchetypeData } = useGetArchetype(archetypeId);
  
  // Use database data if available, otherwise fallback to local data
  const archetypeData = dbArchetypeData || getArchetypeDetailedById(archetypeId);
  
  return (
    <ArchetypeContent 
      archetypeData={archetypeData}
      archetypeId={archetypeId}
      onRetakeAssessment={onRetakeAssessment}
    />
  );
};

export default DetailedArchetypeReport;
