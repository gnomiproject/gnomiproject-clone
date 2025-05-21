
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchetypeDetailedData } from "@/types/archetype";

interface OverviewTabProps {
  archetypeData: ArchetypeDetailedData;
  familyColor: string;
  hideRequestSection?: boolean;
}

const OverviewTab = ({ archetypeData, familyColor, hideRequestSection = false }: OverviewTabProps) => {
  // Get key characteristics with proper type handling and ensure it's an array
  const keyCharacteristics = (() => {
    const kc = archetypeData?.key_characteristics || 
      archetypeData?.standard?.keyCharacteristics ||
      archetypeData?.summary?.keyCharacteristics || 
      [];
    
    // Handle different formats of key_characteristics
    if (Array.isArray(kc)) {
      return kc;
    } else if (typeof kc === 'string') {
      // Use type assertion to tell TypeScript this is definitely a string
      return (kc as string).split('\n').filter(Boolean);
    } else {
      // Return empty array if it's neither an array nor a string
      return [];
    }
  })();
    
  const industries = archetypeData?.industries || 
    "Various industries including healthcare, finance, and technology";
    
  const longDescription = 
    archetypeData?.long_description || 
    archetypeData?.short_description || 
    (archetypeData?.summary?.description) || 
    "This archetype represents organizations with specific healthcare management approaches and characteristics.";
    
  // Ensure we have the family name
  const familyName = archetypeData?.familyName || archetypeData?.family_name || "Healthcare Family";

  // Debug family name extraction
  console.log('[OverviewTab] Family name data:', { 
    fromFamilyName: archetypeData?.familyName,
    fromFamily_name: archetypeData?.family_name,
    finalValue: familyName
  });

  return (
    <Card>
      <CardHeader style={{ borderBottom: `4px solid ${familyColor}` }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              {archetypeData?.name || archetypeData?.id?.toUpperCase() || 'Unknown Archetype'}
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {familyName || "Healthcare Archetype Family"}
            </p>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm" 
            style={{ backgroundColor: `${familyColor}20`, color: familyColor }}>
            Family: {familyName}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-lg text-gray-700">
          {longDescription}
        </p>
        
        {keyCharacteristics.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
            <ul className="list-disc list-inside space-y-2">
              {keyCharacteristics.map((char: any, index: number) => (
                <li key={index} className="text-gray-700">
                  {typeof char === 'string' 
                    ? char 
                    : typeof char === 'object' && char !== null && 'name' in char
                      ? char.name 
                      : JSON.stringify(char)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Common Industries</h3>
          <p className="text-gray-700">{industries}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
