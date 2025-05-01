
import React, { useRef } from 'react';
import DNAHelix from '../DNAHelix';

interface DNAVisualizationProps {
  selectedArchetypeId: string | null;
  onArchetypeClick: (archetypeId: string) => void;
  selectedFamilyId: 'a' | 'b' | 'c' | null;
  onFamilyClick: (familyId: 'a' | 'b' | 'c') => void;
}

const DNAVisualization: React.FC<DNAVisualizationProps> = ({
  selectedArchetypeId,
  onArchetypeClick,
  selectedFamilyId,
  onFamilyClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-shrink-0">
      <div
        ref={containerRef} 
        className="relative h-[490px] w-[400px] mx-auto"
      >
        <DNAHelix 
          selectedArchetypeId={selectedArchetypeId}
          onStepClick={onArchetypeClick}
          selectedFamilyId={selectedFamilyId}
          onFamilyClick={onFamilyClick}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default DNAVisualization;
