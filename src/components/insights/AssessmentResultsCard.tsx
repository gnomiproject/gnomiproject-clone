
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeReport from '@/components/insights/ArchetypeReport';
import AssessmentResultsHeader from '@/components/insights/AssessmentResultsHeader';
import DetailedAnalysisTrigger from '@/components/insights/DetailedAnalysisTrigger';

interface AssessmentResultsCardProps {
  archetypeData: ArchetypeDetailedData;
  familyData: { name: string } | undefined;
  selectedArchetype: string;
  onRetakeAssessment: () => void;
}

const AssessmentResultsCard = ({ 
  archetypeData, 
  familyData, 
  selectedArchetype, 
  onRetakeAssessment 
}: AssessmentResultsCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12 border">
      {/* Orange top border - using the archetype-specific color */}
      <div className={`h-2 bg-${`archetype-${archetypeData.id}`}`}></div>
      
      <AssessmentResultsHeader 
        archetypeData={archetypeData}
        familyData={familyData}
        onRetakeAssessment={onRetakeAssessment}
      />
      
      {/* Detailed analysis section - now with a more prominent toggle button */}
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <DetailedAnalysisTrigger 
          isOpen={isOpen} 
          archetypeColor={`archetype-${archetypeData.id}`} 
        />
        
        <CollapsibleContent>
          <div className="border-t">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-8">Detailed Analysis</h2>
              <ArchetypeReport archetypeId={selectedArchetype} />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AssessmentResultsCard;
