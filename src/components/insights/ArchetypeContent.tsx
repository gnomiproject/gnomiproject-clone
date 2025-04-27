
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useArchetypeMetrics } from '@/hooks/archetype/useArchetypeMetrics';

interface ArchetypeContentProps {
  archetypeData: ArchetypeDetailedData;
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const ArchetypeContent = ({ archetypeData, archetypeId, onRetakeAssessment }: ArchetypeContentProps) => {
  const { getTraitsForArchetype } = useArchetypeMetrics();
  const traits = getTraitsForArchetype(archetypeId);
  
  // Use different sources for key characteristics with proper type handling
  const keyCharacteristics = 
    archetypeData.key_characteristics || 
    archetypeData.standard?.keyCharacteristics ||
    archetypeData.summary?.keyCharacteristics ||
    (traits?.uniqueInsights || []) ||
    [];
  
  // Use different sources for industries
  const industries = archetypeData.industries || 
    "Various industries including healthcare, finance, and technology";
    
  // Use different description sources with fallbacks
  const longDescription = 
    archetypeData.long_description || 
    archetypeData.short_description || 
    (archetypeData.summary?.description) || 
    "This archetype represents organizations with specific healthcare management approaches and characteristics.";
    
  // Get strategy focus with fallback
  const strategyFocus = 
    archetypeData.enhanced?.strategicPriorities?.[0]?.description || 
    "Organizations with this archetype typically focus on optimizing healthcare delivery through strategic initiatives.";
    
  // Get challenges with fallback
  const challenges = 
    archetypeData.enhanced?.swot?.weaknesses?.join(". ") || 
    "Common challenges include managing costs while maintaining quality of care.";
  
  return (
    <div className="text-left space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Strategic Focus Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            {strategyFocus}
          </p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Common Challenges</h3>
            <p className="text-gray-700">{challenges}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={onRetakeAssessment}
          variant="outline"
          className="text-sm"
        >
          Want to try again? Retake the assessment
        </Button>
      </div>
    </div>
  );
};

export default ArchetypeContent;
