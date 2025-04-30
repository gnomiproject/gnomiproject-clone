
import React, { memo } from 'react';
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

// Base component implementation
const ArchetypeProfileBase: React.FC<ArchetypeProfileProps> = ({ archetypeData, reportData }) => {
  // Use archetypeData as primary, fall back to reportData
  const data = archetypeData || reportData;

  // Add debugging
  console.log('[ArchetypeProfile] Rendering with data:', {
    hasData: !!data,
    name: data?.name || data?.archetype_name || 'Unknown',
    hasDescription: !!data?.long_description,
    hasCharacteristics: !!data?.key_characteristics,
    hasOverview: !!data?.archetype_overview
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
  const archetypeColor = data.hexColor || '#6E59A5';
  
  // Extract the archetype ID to create the badge (e.g., "B2" from "B2_Steady_Returns")
  const archetypeId = data.id || data.archetype_id || '';
  const archetypeBadge = archetypeId.includes('_') ? archetypeId.split('_')[0] : archetypeId;
  
  // Get the archetype overview if available
  let archetypeOverview = null;
  if (data.archetype_overview) {
    archetypeOverview = typeof data.archetype_overview === 'string' 
      ? data.archetype_overview 
      : JSON.stringify(data.archetype_overview);
  }
  
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
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold">{displayName}</h3>
            {archetypeBadge && (
              <div 
                className="px-2 py-1 rounded-md text-white text-sm font-bold"
                style={{ backgroundColor: archetypeColor }}
              >
                {archetypeBadge}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h4 className="text-lg font-medium mb-2">Description</h4>
              <p className="text-gray-600">{data.long_description || 'No detailed description available.'}</p>
            </div>
            
            {/* Archetype Overview from level4 table */}
            {archetypeOverview && (
              <div>
                <h4 className="text-lg font-medium mb-2">Archetype Overview</h4>
                <p className="text-gray-600 whitespace-pre-line">{archetypeOverview}</p>
              </div>
            )}
            
            {/* Key Characteristics */}
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
            
            {/* Common Industries */}
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

// Wrap the component with React.memo to prevent unnecessary re-renders
const ArchetypeProfile = memo(ArchetypeProfileBase);

export default ArchetypeProfile;
