
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Badge } from '@/components/ui/badge';
import { Info, ArrowRight, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverviewTabProps {
  archetypeData: ArchetypeDetailedData;
}

const OverviewTab = ({ archetypeData }: OverviewTabProps) => {
  const color = archetypeData.hexColor ? 
    { borderColor: archetypeData.hexColor, color: archetypeData.hexColor } : 
    { borderColor: `var(--color-archetype-${archetypeData.id})`, color: `var(--color-archetype-${archetypeData.id})` };

  // Get the family color - using archetype's family ID
  const familyColor = archetypeData.familyId ? 
    { color: `var(--color-family-${archetypeData.familyId})` } : 
    { color: '#888888' };

  // Extract fields from archetype data using the new structure
  const {
    name: archetypeName = archetypeData.name,
    long_description = archetypeData.long_description || archetypeData.standard?.fullDescription || '',
  } = archetypeData;

  // Safely extract key characteristics with proper type checking
  let keyCharacteristics: string[] = [];
  
  if (Array.isArray(archetypeData.key_characteristics)) {
    // If it's already an array, use it directly
    keyCharacteristics = archetypeData.key_characteristics.map(item => String(item));
  } else if (typeof archetypeData.key_characteristics === 'string') {
    // If it's a string, split it
    keyCharacteristics = archetypeData.key_characteristics.split('\n').filter(Boolean);
  } else if (archetypeData.summary?.keyCharacteristics) {
    // Fallback to summary.keyCharacteristics if available
    keyCharacteristics = archetypeData.summary.keyCharacteristics;
  }
  
  // Safely extract industries with proper type checking
  let industries = '';
  
  if (typeof archetypeData.industries === 'string') {
    industries = archetypeData.industries;
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
            <Badge className="mb-2" style={{ color: familyColor.color, backgroundColor: `${familyColor.color}15` }}>
              Family: {familyName}
            </Badge>
            <h2 className="text-2xl font-bold" style={{ color: color.color }}>
              {archetypeName}
            </h2>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 mt-4 md:mt-0"
            style={{ color: color.color, borderColor: color.color }}
          >
            <Info size={16} />
            View Archetype Details
            <ArrowRight size={16} />
          </Button>
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
            {industryList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {industryList.map((industry, index) => (
                  <Badge key={index} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
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
                    <div className="h-2 w-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color.color }}></div>
                    <span>{item}</span>
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
