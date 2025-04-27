
import React, { useMemo } from 'react';
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
  const { archetypeData: dbArchetypeData, isLoading } = useGetArchetype(archetypeId);
  
  // Use memoization to prevent redundant calculations
  const archetypeData = useMemo(() => {
    console.log(`DetailedArchetypeReport: Processing data for ${archetypeId}`);
    return dbArchetypeData || getArchetypeDetailedById(archetypeId);
  }, [dbArchetypeData, getArchetypeDetailedById, archetypeId]);
  
  // Skip rendering if loading to prevent flicker
  if (isLoading) {
    return (
      <div className="w-full p-6 rounded-lg bg-white shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <ArchetypeContent 
      archetypeData={archetypeData}
      archetypeId={archetypeId}
      onRetakeAssessment={onRetakeAssessment}
    />
  );
};

export default DetailedArchetypeReport;
