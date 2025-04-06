
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { cn } from '@/lib/utils';

interface ArchetypeHeaderProps {
  archetypeData: ArchetypeDetailedData;
  familyData: { name: string } | undefined;
}

const ArchetypeHeader = ({ archetypeData, familyData }: ArchetypeHeaderProps) => {
  const color = `archetype-${archetypeData.id}`;
  const familyColor = `family-${archetypeData.familyId}`;

  return (
    <div>
      <div className="text-center mb-6">
        <span className={cn(`inline-block bg-${familyColor}/10 text-${familyColor} rounded-full px-4 py-1 text-sm font-medium`)}>
          family {archetypeData.familyId}: {familyData?.name || ''}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {archetypeData.name} <span className={cn(`inline-block bg-${color}/10 text-${color} border border-${color}/30 rounded-full px-3 py-1 text-sm font-medium align-middle ml-2`)}>{archetypeData.id}</span>
      </h2>

      <p className="text-gray-700 text-lg text-center mb-8">
        {archetypeData.summary.description}
      </p>
    </div>
  );
};

export default ArchetypeHeader;
