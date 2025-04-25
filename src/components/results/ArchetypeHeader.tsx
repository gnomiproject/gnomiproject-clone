
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
  const familyName = familyData?.name || archetypeData.familyName || '';

  // Use the description from standard or fall back to a default message
  const description = archetypeData.summary?.description || 
                      archetypeData.standard?.overview || 
                      'No detailed description available for this archetype.';

  return (
    <div>
      <div className="text-center mb-6">
        <span className={cn(`inline-block bg-${familyColor}/10 text-${familyColor} rounded-full px-4 py-1 text-sm font-medium`)}>
          family {archetypeData.familyId}: {familyName}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {archetypeData.name} <span className={cn(`inline-block bg-${color}/10 text-${color} border border-${color}/30 rounded-full px-3 py-1 text-sm font-medium align-middle ml-2`)}>{archetypeData.id}</span>
      </h2>

      <p className="text-gray-700 text-lg text-center mb-8">
        {description}
      </p>
    </div>
  );
};

export default ArchetypeHeader;
