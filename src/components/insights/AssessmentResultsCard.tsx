
import React from 'react';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import DetailedArchetypeReport from '@/components/insights/DetailedArchetypeReport';
import AssessmentResultsHeader from '@/components/insights/AssessmentResultsHeader';
import PremiumReport from '@/components/results/PremiumReport';

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
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12 border">
      {/* Orange top border - using the archetype-specific color */}
      <div className={`h-2 bg-${`archetype-${archetypeData.id}`}`}></div>
      
      <AssessmentResultsHeader 
        archetypeData={archetypeData}
        familyData={familyData}
        onRetakeAssessment={onRetakeAssessment}
      />
      
      {/* Detailed analysis section - now without a toggle button */}
      <div className="border-t">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-left">Detailed Analysis</h2>
          <DetailedArchetypeReport 
            archetypeId={selectedArchetype}
            onRetakeAssessment={onRetakeAssessment}
          />
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
