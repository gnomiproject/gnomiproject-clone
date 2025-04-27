
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { getArchetypeDetailedById } = useArchetypes();
  
  // Always get local data first as a guaranteed source
  const localArchetypeData = getArchetypeDetailedById(archetypeId);
  
  // Try remote data as an enhancement
  const { archetypeData, isLoading, error, refetch } = useGetArchetype(archetypeId);
  
  // Use local data if remote data is not available
  const displayData = archetypeData || localArchetypeData;
  
  // After a brief delay, always show content if we have any data source
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayData) {
        setShowContent(true);
        console.log("Showing archetype content for:", archetypeId);
      }
    }, 1000); // Short delay for stability
    
    return () => clearTimeout(timer);
  }, [displayData, archetypeId]);
  
  useEffect(() => {
    // Log what we're using to help with debugging
    if (displayData) {
      console.log("Display data source:", archetypeData ? "Remote API" : "Local fallback");
      
      if (!archetypeData && localArchetypeData) {
        console.log("Using local archetype data as fallback");
        // Only show toast if we failed to get remote data but have local
        if (error) {
          toast.info("Using local data for your report", { duration: 3000 });
        }
      }
    } else {
      console.error("No display data available for:", archetypeId);
    }
  }, [archetypeData, localArchetypeData, displayData, archetypeId, error]);
  
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
        if (displayData) {
          toast.info("Using local data for your report");
          setShowContent(true);
        } else {
          toast.error("Connection failed. No data available.");
        }
      })
      .finally(() => {
        setIsRetrying(false);
      });
  };
  
  // If we have display data and showContent is true, skip all error/loading states
  if (displayData && showContent) {
    return (
      <ArchetypeContent 
        archetypeData={displayData}
        archetypeId={archetypeId}
        onRetakeAssessment={onRetakeAssessment}
      />
    );
  }
  
  // Still loading and no display data yet
  if (isLoading && !displayData) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // Error and no display data - show error UI
  if (error && !displayData) {
    return (
      <ArchetypeError 
        onRetry={handleRetry}
        onRetakeAssessment={onRetakeAssessment}
        isRetrying={isRetrying}
      />
    );
  }
  
  // If we have display data but showContent is false, show loading state
  if (displayData && !showContent) {
    return <ArchetypeLoadingSkeleton />;
  }
  
  // Fallback error if no data available at all
  return (
    <div className="p-6 border rounded-md bg-red-50 text-center">
      <h3 className="text-xl font-semibold text-red-800 mb-2">Report Data Unavailable</h3>
      <p className="text-red-700 mb-4">
        We couldn't retrieve information for your archetype. Please try again or retake the assessment.
      </p>
      <button 
        onClick={onRetakeAssessment}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
      >
        Retake Assessment
      </button>
    </div>
  );
};

export default DetailedArchetypeReport;
