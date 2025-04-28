
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightOverviewSectionProps {
  archetype: any;
}

const InsightOverviewSection = ({ archetype }: InsightOverviewSectionProps) => {
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  
  // Extract all relevant data from the schema's overview fields
  const shortDescription = archetype?.short_description || '';
  const longDescription = archetype?.long_description || '';
  const industries = archetype?.industries || '';
  
  // Handle key characteristics which might be in different formats
  const keyCharacteristics = archetype?.key_characteristics || [];
  const formattedKeyCharacteristics = Array.isArray(keyCharacteristics) 
    ? keyCharacteristics 
    : typeof keyCharacteristics === 'string'
      ? keyCharacteristics.split('\n').filter(Boolean)
      : [];

  return (
    <Section id="overview">
      <SectionTitle 
        title={insightReportSchema.overview.title}
        subtitle="General information about this archetype population"
      />
      <Card className="p-6 space-y-6">
        {/* Short Description */}
        {shortDescription && (
          <div>
            <p className="text-gray-700">{shortDescription}</p>
          </div>
        )}
        
        {/* Long Description */}
        {longDescription && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Detailed Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{longDescription}</p>
          </div>
        )}
        
        {/* Key Characteristics */}
        {formattedKeyCharacteristics.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {formattedKeyCharacteristics.map((char, index) => (
                <li key={index}>
                  {typeof char === 'string' ? char : JSON.stringify(char)}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Industries */}
        {industries && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Industries</h3>
            <p className="text-gray-700">{industries}</p>
          </div>
        )}
      </Card>
    </Section>
  );
};

export default InsightOverviewSection;
