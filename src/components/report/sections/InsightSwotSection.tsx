
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightSwotSectionProps {
  archetype: any;
}

const InsightSwotSection = ({ archetype }: InsightSwotSectionProps) => {
  // Helper function to normalize SWOT data regardless of format
  const normalizeSwotData = (data: any): string[] => {
    if (!data) return [];
    
    // If it's already an array of strings, return it
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return data;
    }
    
    // If it's an array of objects with text property (common format in our DB)
    if (Array.isArray(data) && typeof data[0] === 'object' && data[0]?.text) {
      return data.map(item => item.text || '');
    }
    
    // If it's a JSON string, parse it
    if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
        }
      } catch (e) {
        // If parsing fails, treat as a single string
        return [data];
      }
    }
    
    // For a single string
    if (typeof data === 'string') {
      return [data];
    }
    
    return [];
  };

  // Extract SWOT data with fallback to swot_analysis if available
  const strengths = normalizeSwotData(archetype?.strengths || (archetype?.swot_analysis && archetype?.swot_analysis?.strengths));
  const weaknesses = normalizeSwotData(archetype?.weaknesses || (archetype?.swot_analysis && archetype?.swot_analysis?.weaknesses));
  const opportunities = normalizeSwotData(archetype?.opportunities || (archetype?.swot_analysis && archetype?.swot_analysis?.opportunities));
  const threats = normalizeSwotData(archetype?.threats || (archetype?.swot_analysis && archetype?.swot_analysis?.threats));

  // Debug log
  console.log('InsightSwotSection data:', { 
    hasSwotAnalysis: !!(archetype?.swot_analysis),
    directStrengths: archetype?.strengths ? archetype.strengths.length : 0,
    nestedStrengths: archetype?.swot_analysis?.strengths ? archetype.swot_analysis.strengths.length : 0,
    normalizedStrengths: strengths.length,
    normalizedWeaknesses: weaknesses.length,
    normalizedOpportunities: opportunities.length,
    normalizedThreats: threats.length
  });

  return (
    <Section id="swot-analysis">
      <SectionTitle 
        title={insightReportSchema.swot.title}
        subtitle="Strengths, Weaknesses, Opportunities, and Threats"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Strengths</h3>
          {strengths.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {strengths.map((item: string, index: number) => (
                <li key={`strength-${index}`} className="text-gray-700">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No strengths data available</p>
          )}
        </Card>
        
        <Card className="p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-700 mb-4">Weaknesses</h3>
          {weaknesses.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {weaknesses.map((item: string, index: number) => (
                <li key={`weakness-${index}`} className="text-gray-700">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No weaknesses data available</p>
          )}
        </Card>
        
        <Card className="p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Opportunities</h3>
          {opportunities.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {opportunities.map((item: string, index: number) => (
                <li key={`opportunity-${index}`} className="text-gray-700">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No opportunities data available</p>
          )}
        </Card>
        
        <Card className="p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Threats</h3>
          {threats.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {threats.map((item: string, index: number) => (
                <li key={`threat-${index}`} className="text-gray-700">{item}</li>
              ))}
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
