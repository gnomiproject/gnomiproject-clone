
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetArchetype } from '@/hooks/useGetArchetype';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  // Use the useGetArchetype hook to fetch data directly from Supabase
  const { archetypeData, familyData, isLoading, error } = useGetArchetype(archetypeId);
  
  console.log("DetailedArchetypeReport - archetypeData:", archetypeData);
  console.log("DetailedArchetypeReport - familyData:", familyData);
  console.log("DetailedArchetypeReport - isLoading:", isLoading);
  console.log("DetailedArchetypeReport - error:", error);
  console.log("DetailedArchetypeReport - archetypeId:", archetypeId);
  
  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  
  if (error || !archetypeData) {
    return <div>Error loading archetype data. Please try again later.</div>;
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
