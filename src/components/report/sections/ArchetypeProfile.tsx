
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';

export interface ArchetypeProfileProps {
  archetypeData?: ArchetypeDetailedData;
  reportData?: ArchetypeDetailedData;  // Added for backward compatibility
}

const ArchetypeProfile: React.FC<ArchetypeProfileProps> = ({ archetypeData, reportData }) => {
  // Use archetypeData as primary, fall back to reportData
  const data = archetypeData || reportData;

  // Add debugging
  console.log('[ArchetypeProfile] Rendering with data:', {
    hasData: !!data,
    name: data?.name || data?.archetype_name || 'Unknown',
    hasDescription: !!data?.long_description,
    hasCharacteristics: !!data?.key_characteristics
  });

  if (!data) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Archetype Profile" />
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p>No archetype data available.</p>
        </div>
      </div>
    );
  }

  const displayName = data.name || data.archetype_name || 'Unknown Archetype';
  
  return (
    <div className="space-y-6">
      <SectionTitle title="Archetype Profile" />
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-3">{displayName}</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Description</h4>
            <p className="text-gray-600">{data.long_description || 'No detailed description available.'}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Key Characteristics</h4>
            {data.key_characteristics ? (
              <p className="text-gray-600 whitespace-pre-line">{data.key_characteristics}</p>
            ) : (
              <p className="text-gray-600">No key characteristics available.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Common Industries</h4>
            <p className="text-gray-600">{data.industries || 'No industry information available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeProfile;
