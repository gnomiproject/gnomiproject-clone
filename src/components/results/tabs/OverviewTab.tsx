import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Badge } from '@/components/ui/badge';
import { Building, Users } from 'lucide-react';

interface OverviewTabProps {
  archetypeData: ArchetypeDetailedData;
}

const OverviewTab = ({ archetypeData }: OverviewTabProps) => {
  const color = archetypeData.hexColor ? 
    archetypeData.hexColor : 
    `var(--color-archetype-${archetypeData.id})`;

  // Get the family color - using archetype's family ID
  const familyColor = archetypeData.familyId ? 
    `var(--color-family-${archetypeData.familyId})` : 
    '#888888';
  
  // Extract fields from archetype data using the new structure
  const {
    name: archetypeName = archetypeData.name,
    long_description = archetypeData.long_description || archetypeData.standard?.fullDescription || '',
  } = archetypeData;

  // Safely extract key characteristics with proper type checking
  let keyCharacteristics: string[] = [];
  
  if (Array.isArray(archetypeData.key_characteristics)) {
    keyCharacteristics = archetypeData.key_characteristics.map(item => String(item));
  } else if (typeof archetypeData.key_characteristics === 'string') {
    const keyCharStr = archetypeData.key_characteristics as string;
    keyCharacteristics = keyCharStr.split('\n').filter(Boolean);
  } else if (archetypeData.summary?.keyCharacteristics) {
    keyCharacteristics = archetypeData.summary.keyCharacteristics;
  }
  
  // Instead of formatting as array, just clean up the string
  let industries = '';
  if (typeof archetypeData.industries === 'string') {
    industries = archetypeData.industries
      .replace(/['"]/g, '')  // Remove quotes
      .replace(/,\s*/g, ', ') // Clean up comma spacing
      .trim();
  }
  
  // Get family name with proper fallback
  const familyName = archetypeData.family_name || archetypeData.familyName || '';

  // Format industries as array safely
  const industryList = industries ? 
    industries.split(',').map(i => i.trim().replace(/^"?|"?$/g, '')) : 
    [];
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div>
            <Badge 
              className="mb-2" 
              style={{ 
                backgroundColor: `${familyColor}15`,
                color: '#333' // Dark text for better readability
              }}
            >
              Family: {familyName}
            </Badge>
            <h2 
              className="text-2xl font-bold px-4 py-2 rounded-lg" 
              style={{ backgroundColor: `${color}15` }}
            >
              {archetypeName}
            </h2>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Archetype Description</h3>
          <p className="text-gray-700">
            {long_description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Building className="mr-2 h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Common Industries</h3>
            </div>
            {industries ? (
              <p className="text-gray-700">{industries}</p>
            ) : (
              <p className="text-gray-500 italic">No industry data available</p>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="mr-2 h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Key Characteristics</h3>
            </div>
            {keyCharacteristics.length > 0 ? (
              <ul className="space-y-2">
                {keyCharacteristics.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div 
                      className="h-2 w-2 rounded-full mt-2 flex-shrink-0" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No key characteristics available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
