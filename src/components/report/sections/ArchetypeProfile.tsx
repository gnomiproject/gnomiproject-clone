
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import GnomePlaceholder from './introduction/GnomePlaceholder';
import { Card } from '@/components/ui/card';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';

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
  const archetypeColor = data.hexColor || data.hex_color || '#6E59A5';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-2/3">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Understanding the characteristics and behaviors of your organization's archetype."
          />
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="h-48 w-48">
            <GnomePlaceholder type="magnifying" />
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div 
          className="h-3"
          style={{ background: archetypeColor }}
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3">{displayName}</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium mb-2">Description</h4>
              <p className="text-gray-600">{data.long_description || 'No detailed description available.'}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Key Characteristics</h4>
              {data.key_characteristics ? (
                <KeyCharacteristicsList 
                  characteristics={data.key_characteristics} 
                  archetypeColor={archetypeColor} 
                />
              ) : (
                <p className="text-gray-600">No key characteristics available.</p>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Common Industries</h4>
              <IndustryComposition industries={data.industries || ''} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArchetypeProfile;
