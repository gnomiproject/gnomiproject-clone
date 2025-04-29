
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';
import { useDebug } from '@/components/debug/DebugProvider';
import DataSourceInfo from '@/components/debug/DataSourceInfo';

interface InsightSwotSectionProps {
  archetype: any;
}

const InsightSwotSection = ({ archetype }: InsightSwotSectionProps) => {
  const { showDataSource, showRawValues } = useDebug();
  
  // Helper function to render items with or without debug info
  const renderItem = (item: string, index: number, category: string) => {
    if (showDataSource) {
      return (
        <li key={`${category}-${index}`} className="text-gray-700">
          <DataSourceInfo
            tableName="level3_report_data"
            columnName={category}
            rawValue={item}
            formattedValue={item}
            showRawValues={showRawValues}
          />
        </li>
      );
    }
    
    return <li key={`${category}-${index}`} className="text-gray-700">{item}</li>;
  };

  return (
    <Section id="swot-analysis">
      <SectionTitle 
        title={insightReportSchema.swot.title}
        subtitle="Strengths, Weaknesses, Opportunities, and Threats"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Strengths</h3>
          {Array.isArray(archetype?.strengths) && archetype.strengths.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {archetype.strengths.map((item: string, index: number) => renderItem(item, index, 'strengths'))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No strengths data available</p>
          )}
        </Card>
        
        <Card className="p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-700 mb-4">Weaknesses</h3>
          {Array.isArray(archetype?.weaknesses) && archetype.weaknesses.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {archetype.weaknesses.map((item: string, index: number) => renderItem(item, index, 'weaknesses'))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No weaknesses data available</p>
          )}
        </Card>
        
        <Card className="p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Opportunities</h3>
          {Array.isArray(archetype?.opportunities) && archetype.opportunities.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {archetype.opportunities.map((item: string, index: number) => renderItem(item, index, 'opportunities'))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No opportunities data available</p>
          )}
        </Card>
        
        <Card className="p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Threats</h3>
          {Array.isArray(archetype?.threats) && archetype.threats.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {archetype.threats.map((item: string, index: number) => renderItem(item, index, 'threats'))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No threats data available</p>
          )}
        </Card>
      </div>
    </Section>
  );
};

export default InsightSwotSection;
