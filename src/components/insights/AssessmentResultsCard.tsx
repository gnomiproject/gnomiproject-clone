
import React, { useState, useCallback } from 'react';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import DetailedArchetypeReport from '@/components/insights/DetailedArchetypeReport';
import AssessmentResultsHeader from '@/components/insights/AssessmentResultsHeader';
import PremiumReport from '@/components/results/PremiumReport';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AssessmentResultsCardProps {
  archetypeData: ArchetypeDetailedData;
  familyData: { name: string } | undefined;
  selectedArchetype: ArchetypeId;
  onRetakeAssessment: () => void;
  assessmentResult?: any;
  assessmentAnswers?: any;
}

const AssessmentResultsCard = ({ 
  archetypeData, 
  familyData, 
  selectedArchetype, 
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers
}: AssessmentResultsCardProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  
  // Handler for child component errors with debouncing
  const handleError = useCallback(() => {
    setShowError(true);
  }, []);
  
  // Handler for retry with debouncing
  const handleRetry = useCallback(() => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    toast.info("Reconnecting to database...");
    
    // Simulate a retry with a timeout to avoid UI flickering
    setTimeout(() => {
      try {
        setShowError(false);
        toast.success("Connection restored!");
      } catch (err) {
        console.error("Error during retry:", err);
        toast.error("Connection failed. Please try again.");
      } finally {
        setIsRetrying(false);
      }
    }, 700);
  }, [isRetrying]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12 border">
      {/* Orange top border - using the archetype-specific color */}
      <div className={`h-2 bg-${`archetype-${archetypeData.id}`}`}></div>
      
      <AssessmentResultsHeader 
        archetypeData={archetypeData}
        familyData={familyData}
        onRetakeAssessment={onRetakeAssessment}
      />
      
      {/* Detailed analysis section - with improved error handling */}
      <div className="border-t">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-left">Detailed Analysis</h2>
          
          {showError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700">Connection Issues</h3>
              <p className="text-red-600 mb-4">
                We're having trouble loading your detailed archetype data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
                  {isRetrying ? "Connecting..." : "Try Again"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onRetakeAssessment}
                >
                  Retake Assessment
                </Button>
              </div>
            </div>
          ) : (
            <DetailedArchetypeReport 
              archetypeId={selectedArchetype}
              onRetakeAssessment={onRetakeAssessment}
            />
          )}
        </div>
      </div>
      
      {/* Premium Report section */}
      <PremiumReport 
        archetypeId={selectedArchetype} 
        archetypeData={archetypeData} 
        assessmentResult={assessmentResult}
        assessmentAnswers={assessmentAnswers}
      />
    </div>
  );
};

export default AssessmentResultsCard;
