
import React, { useState } from 'react';
import { useArchetypeDetails } from '@/hooks/archetype/useArchetypeDetails';
import { ArchetypeId } from '@/types/archetype';
import InsightsView from './InsightsView';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InsightsContainerProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment?: () => void;
  assessmentResult?: any;
  assessmentAnswers?: any;
  hideRequestSection?: boolean;
  isPreUnlocked?: boolean;
}

const InsightsContainer = ({ 
  archetypeId, 
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers,
  hideRequestSection = false,
  isPreUnlocked = false
}: InsightsContainerProps) => {
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  const { 
    data: archetypeData, 
    isLoading, 
    error, 
    refetch 
  } = useArchetypeDetails(archetypeId);
  
  // Handle error retry
  const handleRetry = async () => {
    setLoadAttempts(prev => prev + 1);
    try {
      toast.promise(refetch(), {
        loading: 'Retrying data load...',
        success: 'Successfully reloaded data',
        error: 'Failed to reload data'
      });
    } catch (err) {
      console.error('Error retrying data load:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-gray-600">Loading insights data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p>Could not load archetype insights data.</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 transition-colors text-red-800 rounded-md"
            >
              Retry {loadAttempts > 0 ? `(${loadAttempts})` : ''}
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!archetypeData) {
    return (
      <Alert className="my-6 bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p>No insights data available for archetype {archetypeId}.</p>
            {onRetakeAssessment && (
              <button 
                onClick={onRetakeAssessment}
                className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 transition-colors text-yellow-800 rounded-md"
              >
                Retake Assessment
              </button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <InsightsView 
      archetypeId={archetypeId} 
      reportData={archetypeData}
      assessmentResult={assessmentResult}
      assessmentAnswers={assessmentAnswers}
      hideRequestSection={hideRequestSection}
      isPreUnlocked={isPreUnlocked}
    />
  );
};

export default InsightsContainer;
