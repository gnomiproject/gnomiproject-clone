
import React, { useEffect } from 'react';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeHeader from './components/ArchetypeHeader';
import ArchetypeFooter from './components/ArchetypeFooter';
import MetricCard from './metrics/MetricCard';
import MetricBar from './metrics/MetricBar';
import { ensureArray } from '@/utils/array/ensureArray';

interface ArchetypeContentProps {
  archetype: ArchetypeDetailedData;
  archetypeId: ArchetypeId;
}

const ArchetypeContent: React.FC<ArchetypeContentProps> = ({ archetype, archetypeId }) => {
  useEffect(() => {
    console.log('[ArchetypeContent] Rendering with data:', {
      id: archetypeId,
      name: archetype?.name || archetype?.archetype_name,
    });
  }, [archetype, archetypeId]);

  if (!archetype) {
    return <div>Loading archetype data...</div>;
  }

  // Extract name from the appropriate field for display
  const name = archetype?.name || archetype?.archetype_name || 'Unknown Archetype';
  
  // Process characteristics
  const characteristics = ensureArray(archetype?.key_characteristics || []);

  // Set fallbacks for empty data
  const description = archetype?.short_description || 'No description available for this archetype.';
  
  // Get family data
  const familyId = archetype?.family_id || 'unknown';
  const familyName = archetype?.familyName || archetype?.family_name || 'Unknown Family';
  
  // Get color data
  const archetypeHexColor = archetype?.hexColor || archetype?.hex_color || '#3b82f6'; // Default blue if not set
  const familyColor = archetypeHexColor; // Use the same color for now
  
  return (
    <div className="space-y-8">
      <ArchetypeHeader 
        name={name} 
        description={description} 
        familyId={familyId} 
        familyName={familyName}
        familyColor={familyColor}
        archetypeHexColor={archetypeHexColor}
      />
      
      {/* Key Characteristics */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Characteristics</h3>
          
          <ul className="space-y-2">
            {characteristics.length > 0 ? (
              characteristics.map((item: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No key characteristics available</li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Add metrics cards or other content as needed */}
      
      <ArchetypeFooter archetypeHexColor={archetypeHexColor} />
    </div>
  );
};

export default ArchetypeContent;
