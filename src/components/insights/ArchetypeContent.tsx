
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';

interface ArchetypeContentProps {
  archetypeData: ArchetypeDetailedData;
  archetypeId: string;
  onRetakeAssessment: () => void;
}

const ArchetypeContent = ({ archetypeData, archetypeId, onRetakeAssessment }: ArchetypeContentProps) => {
  return (
    <div className="rounded-lg overflow-hidden bg-white">
      <ArchetypeHeader 
        archetypeName={archetypeData.name} 
        hexColor={archetypeData.hexColor} 
        familyName={archetypeData.familyName} 
      />
      <ArchetypeNavTabs 
        archetypeData={archetypeData} 
        archetypeId={archetypeId}
        onRetakeAssessment={onRetakeAssessment}
      />
    </div>
  );
};

export default ArchetypeContent;
