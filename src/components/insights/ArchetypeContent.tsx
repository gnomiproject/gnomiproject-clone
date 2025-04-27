
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';

interface ArchetypeContentProps {
  archetypeData: ArchetypeDetailedData;
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const ArchetypeContent = ({ archetypeData, archetypeId, onRetakeAssessment }: ArchetypeContentProps) => {
  return (
    <div className="text-left">
      <div 
        className="border-t-4"
        style={{ borderColor: archetypeData.hexColor || `var(--color-archetype-${archetypeId})` }} 
      >
        <div className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4">{archetypeData.name}</h2>
          <p className="text-gray-600 mb-6">{archetypeData.short_description}</p>
          <div className="mt-8 text-center">
            <Button 
              onClick={onRetakeAssessment}
              variant="outline"
              className="text-sm"
            >
              Want to try again? Retake the assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeContent;
