
import React, { useState } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { toast } from 'sonner';
import ArchetypeLoadingSkeleton from './ArchetypeLoadingSkeleton';
import ArchetypeError from './ArchetypeError';
import ArchetypeContent from './ArchetypeContent';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { archetypeData, isLoading, error, refetch } = useGetArchetype(archetypeId);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleRetry = () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    toast.info("Reconnecting to database...");
    
    setTimeout(() => {
      refetch()
        .catch((err) => {
          toast.error("Connection failed. Using local data.");
          console.error("Retry failed:", err);
        })
        .finally(() => {
          toast.success("Connection restored!");
          setIsRetrying(false);
        });
    }, 500);
  };
  
  if (isLoading) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  if (error || !archetypeData) {
    return (
      <ArchetypeError 
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={isRetrying}
      />
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
