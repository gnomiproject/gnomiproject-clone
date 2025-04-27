
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchetypeDetailedData } from '@/types/archetype';
import { insightReportSchema } from '@/schemas/insightReportSchema';
import { useReportValidation } from '@/hooks/reports/useReportValidation';
import { toast } from 'sonner';

interface OverviewTabProps {
  archetypeData: ArchetypeDetailedData;
  familyColor: string;
}

const OverviewTab = ({ archetypeData, familyColor }: OverviewTabProps) => {
  const overviewFields = insightReportSchema.overview.fields;
  
  const {
    isValid,
    validationMessages,
    getSafeValue
  } = useReportValidation(archetypeData, overviewFields);

  // Show validation warnings if any
  React.useEffect(() => {
    if (!isValid && validationMessages.length > 0) {
      toast.warning('Some data may be missing or invalid', {
        description: validationMessages.join(', ')
      });
    }
  }, [isValid, validationMessages]);

  if (!archetypeData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No archetype data available to display.</p>
        </CardContent>
      </Card>
    );
  }

  // Get validated values
  const archetypeName = getSafeValue('archetype_name');
  const familyName = getSafeValue('family_name');
  const description = getSafeValue('long_description');
  const industries = getSafeValue('industries');
  const keyCharacteristics = getSafeValue('key_characteristics');
  const safeColor = familyColor || getSafeValue('hex_color');

  return (
    <Card>
      <CardHeader style={{ borderBottom: `4px solid ${safeColor}` }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <CardTitle className="text-2xl font-bold">{archetypeName}</CardTitle>
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
        
        {Array.isArray(keyCharacteristics) && keyCharacteristics.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
            <ul className="list-disc list-inside space-y-2">
              {keyCharacteristics.map((char, index) => (
                <li key={index} className="text-gray-700">
                  {typeof char === 'string' ? char : 
                   (typeof char === 'object' && char !== null) ? 
                     JSON.stringify(char) : char}
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
