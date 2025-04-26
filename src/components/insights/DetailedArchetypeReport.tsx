
import React, { useState, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  // Use the useGetArchetype hook to fetch data directly from Supabase
  const { archetypeData, familyData, isLoading, error, refetch } = useGetArchetype(archetypeId);
  const [retryCount, setRetryCount] = useState(0);
  
  // Log component state for debugging
  useEffect(() => {
    console.log("DetailedArchetypeReport - archetypeData:", archetypeData);
    console.log("DetailedArchetypeReport - familyData:", familyData);
    console.log("DetailedArchetypeReport - isLoading:", isLoading);
    console.log("DetailedArchetypeReport - error:", error ? error.message : "No error");
    console.log("DetailedArchetypeReport - archetypeId:", archetypeId);
  }, [archetypeData, familyData, isLoading, error, archetypeId]);
  
  // Handle refresh when retry button is clicked
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  
  if (error || !archetypeData) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-xl font-semibold text-red-700">Connection Error</h3>
            <p className="text-red-600 mb-4">
              We couldn't connect to the database to load your archetype data.
            </p>
          </div>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={retryCount > 0 ? "animate-spin" : ""} />
              Retry Connection
            </Button>
            
            <Button 
              onClick={onRetakeAssessment}
              variant="secondary"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
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
