
import React, { useState, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { toast } from 'sonner';
import ArchetypeLoadingSkeleton from './ArchetypeLoadingSkeleton';
import ArchetypeError from './ArchetypeError';
import ArchetypeContent from './ArchetypeContent';
import { useArchetypes } from '@/hooks/useArchetypes';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { archetypeData, isLoading, error, refetch } = useGetArchetype(archetypeId);
  const [isRetrying, setIsRetrying] = useState(false);
  const { getArchetypeDetailedById } = useArchetypes();
  
  // Fallback to local data if API request fails
  const localArchetypeData = getArchetypeDetailedById(archetypeId);
  
  // Use local data if remote data is not available
  const displayData = archetypeData || localArchetypeData;
  
  useEffect(() => {
    if (!archetypeData && localArchetypeData) {
      console.log("Using local archetype data as fallback");
    }
  }, [archetypeData, localArchetypeData]);
  
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
  
  if (error && !displayData) {
    return (
      <ArchetypeError 
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={isRetrying}
      />
    );
  }
  
  if (!displayData) {
    return (
      <div className="p-6 border rounded-md bg-red-50 text-center">
        <h3 className="text-xl font-semibold text-red-800 mb-2">Report Data Unavailable</h3>
        <p className="text-red-700 mb-4">
          We couldn't retrieve the detailed information for your archetype.
        </p>
        <button 
          onClick={onRetakeAssessment}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
        >
          Retake Assessment
        </button>
      </div>
    );
  }
  
  return (
    <ArchetypeContent 
      archetypeData={displayData}
      archetypeId={archetypeId}
      onRetakeAssessment={onRetakeAssessment}
    />
  );
};

export default DetailedArchetypeReport;
