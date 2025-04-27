
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
  
  // Always fetch local data as a guaranteed fallback
  const localArchetypeData = getArchetypeDetailedById(archetypeId);
  
  // Use local data if remote data is not available
  const displayData = archetypeData || localArchetypeData;
  
  useEffect(() => {
    // Log what we're using to help with debugging
    if (!archetypeData && localArchetypeData) {
      console.log("Using local archetype data as fallback");
    }
    
    // If we have data from either source, make sure we show it
    if (displayData) {
      console.log("Display data is available:", displayData.id);
    } else {
      console.error("No display data available for:", archetypeId);
    }
  }, [archetypeData, localArchetypeData, displayData, archetypeId]);
  
  const handleRetry = () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    toast.info("Reconnecting to database...");
    
    refetch()
      .then(() => {
        toast.success("Connection restored!");
      })
      .catch((err) => {
        console.error("Retry failed:", err);
        toast.error("Connection failed. Using local data.");
      })
      .finally(() => {
        setIsRetrying(false);
      });
  };
  
  // Show loading skeleton during initial load
  if (isLoading && !displayData) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // If we have an error BUT we have local data, skip the error display
  // and just show the local data instead
  if (error && !displayData) {
    return (
      <ArchetypeError 
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={isRetrying}
      />
    );
  }
  
  // If we still don't have any data after trying all sources, show a helpful error
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
  
  // If we get here, we have data to display (either from API or local)
  return (
    <ArchetypeContent 
      archetypeData={displayData}
      archetypeId={archetypeId}
      onRetakeAssessment={onRetakeAssessment}
    />
  );
};

export default DetailedArchetypeReport;
