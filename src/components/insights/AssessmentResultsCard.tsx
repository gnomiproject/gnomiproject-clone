
import React, { useState } from 'react';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import DetailedArchetypeReport from '@/components/insights/DetailedArchetypeReport';
import AssessmentResultsHeader from '@/components/insights/AssessmentResultsHeader';
import PremiumReport from '@/components/results/PremiumReport';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssessmentResultsCardProps {
  archetypeData: ArchetypeDetailedData;
  familyData: { name: string } | undefined;
  selectedArchetype: ArchetypeId;
  onRetakeAssessment: () => void;
}

const AssessmentResultsCard = ({ 
  archetypeData, 
  familyData, 
  selectedArchetype, 
  onRetakeAssessment 
}: AssessmentResultsCardProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  
  // Handler for child component errors
  const handleError = () => {
    setShowError(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12 border">
      {/* Orange top border - using the archetype-specific color */}
      <div className={`h-2 bg-${`archetype-${archetypeData.id}`}`}></div>
      
      <AssessmentResultsHeader 
        archetypeData={archetypeData}
        familyData={familyData}
        onRetakeAssessment={onRetakeAssessment}
      />
      
      {/* Detailed analysis section - now with error handling */}
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
              <Button 
                onClick={() => setShowError(false)}
                className="mx-auto"
              >
                Try Again
              </Button>
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
      />
    </div>
  );
};

export default AssessmentResultsCard;
