
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Card } from '@/components/ui/card';

interface ArchetypeIdentityCardProps {
  archetype: ArchetypeDetailedData;
  archetypeBadge?: string;
}

const ArchetypeIdentityCard: React.FC<ArchetypeIdentityCardProps> = ({ archetype, archetypeBadge }) => {
  const familyName = archetype.familyName || archetype.family_name || '';
  const archetypeName = archetype.name || archetype.archetype_name || 'Unknown Archetype';
  const archetypeColor = archetype.hexColor || '#6E59A5';
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-3"
        style={{ background: archetypeColor }}
      />
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold">{archetypeName}</h3>
            {archetypeBadge && (
              <div 
                className="px-2 py-1 rounded-md text-white text-sm font-bold"
                style={{ backgroundColor: archetypeColor }}
              >
                {archetypeBadge}
              </div>
            )}
          </div>
          
          <div 
            className="py-1 px-3 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: archetypeColor }}
          >
            {familyName || 'Archetype'} Family
          </div>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <h4 className="text-lg font-medium mb-2">Description</h4>
          <p className="text-gray-700">{archetype.long_description || 'No detailed description available.'}</p>
        </div>
      </div>
    </Card>
  );
};

export default ArchetypeIdentityCard;
