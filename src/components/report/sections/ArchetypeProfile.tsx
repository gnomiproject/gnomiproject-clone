
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';

export interface ArchetypeProfileProps {
  archetypeData: ArchetypeDetailedData;
}

const ArchetypeProfile: React.FC<ArchetypeProfileProps> = ({ archetypeData }) => {
  return (
    <div className="space-y-6">
      <SectionTitle title="Archetype Profile" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-3">{archetypeData.name || archetypeData.archetype_name}</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Description</h4>
            <p className="text-gray-600">{archetypeData.long_description || 'No detailed description available.'}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Key Characteristics</h4>
            {archetypeData.key_characteristics ? (
              <p className="text-gray-600 whitespace-pre-line">{archetypeData.key_characteristics}</p>
            ) : (
              <p className="text-gray-600">No key characteristics available.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Common Industries</h4>
            <p className="text-gray-600">{archetypeData.industries || 'No industry information available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeProfile;
