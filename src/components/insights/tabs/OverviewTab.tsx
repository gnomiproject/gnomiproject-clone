
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchetypeDetailedData } from '@/types/archetype';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface OverviewTabProps {
  archetypeData: ArchetypeDetailedData;
  familyColor: string;
}

const OverviewTab = ({ archetypeData, familyColor }: OverviewTabProps) => {
  // Get schema fields for overview section
  const overviewFields = insightReportSchema.overview.fields;

  if (!archetypeData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No archetype data available to display.</p>
        </CardContent>
      </Card>
    );
  }

  // Extract fields based on schema
  const archetypeName = archetypeData[overviewFields.find(f => f === 'archetype_name') || 'name'] || archetypeData.id?.toUpperCase();
  const familyName = archetypeData[overviewFields.find(f => f === 'family_name') || 'familyName'] || "Healthcare Archetype Family";
  const description = archetypeData[overviewFields.find(f => f === 'long_description') || 'long_description'] || 
                     archetypeData.short_description || 
                     archetypeData.summary?.description || 
                     "This archetype represents organizations with specific healthcare management approaches and characteristics.";
  
  // Handle key characteristics with schema awareness
  let keyCharacteristics: string[] = [];
  const keyCharField = overviewFields.find(f => f === 'key_characteristics');
  
  if (keyCharField && archetypeData[keyCharField]) {
    const rawCharacteristics = archetypeData[keyCharField];
    keyCharacteristics = Array.isArray(rawCharacteristics) ? rawCharacteristics :
      typeof rawCharacteristics === 'string' ? rawCharacteristics.split('\n').filter(Boolean) :
      archetypeData.summary?.keyCharacteristics || [];
  }
  
  const industries = archetypeData[overviewFields.find(f => f === 'industries') || 'industries'] || 
    "Various industries including healthcare, finance, and technology";
  
  const safeColor = familyColor || '#6E59A5';

  return (
    <Card>
      <CardHeader style={{ borderBottom: `4px solid ${safeColor}` }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              {archetypeName}
            </CardTitle>
            <p className="text-gray-600 mt-1">{familyName}</p>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm" 
            style={{ backgroundColor: `${safeColor}20`, color: safeColor }}>
            Family: {familyName}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-lg text-gray-700">{description}</p>
        
        {keyCharacteristics.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
            <ul className="list-disc list-inside space-y-2">
              {keyCharacteristics.map((char, index) => (
                <li key={index} className="text-gray-700">
                  {typeof char === 'string' ? char : 
                   (typeof char === 'object' && char !== null && 'name' in char) ? char.name : 
                   JSON.stringify(char)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Common Industries</h3>
          <p className="text-gray-700">{industries}</p>
        </div>
        
        <div className="mt-8 p-4 bg-purple-50 border border-purple-100 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Want more detail?</h3>
          <p className="text-purple-700">Get the full archetype report with comprehensive insights and strategies.</p>
          <Button className="mt-2 bg-purple-700 hover:bg-purple-800" size="sm">
            Request Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
