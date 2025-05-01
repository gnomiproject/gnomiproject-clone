
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightSwotSectionProps {
  archetype: any;
}

const InsightSwotSection = ({ archetype }: InsightSwotSectionProps) => {
  // Helper function to safely process SWOT data with minimal transformation
  const processSwotData = (data: any): string[] => {
    if (!data) return [];
    
    // If it's already an array, use it directly
    if (Array.isArray(data)) {
      // Map to ensure all items are strings
      return data.map(item => {
        if (typeof item === 'string') return item;
        // Handle case where items might be objects with text property
        if (item && typeof item === 'object' && 'text' in item) return item.text;
        return String(item);
      }).filter(Boolean);
    }
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'text' in item) return item.text;
            return String(item);
          }).filter(Boolean);
        }
      } catch (e) {
        console.error("JSON parsing failed:", e);
      }
    }
    
    // If it's an object with a specific property that contains the array
    if (data && typeof data === 'object') {
      // Check for common patterns in our data
      for (const key of ['entries', 'items', 'points']) {
        if (Array.isArray(data[key])) {
          return data[key].map((item: any) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'text' in item) return item.text;
            return String(item);
          }).filter(Boolean);
        }
      }
    }
    
    // Fallback: if it's a plain string or other format
    return typeof data === 'string' ? [data] : [String(data)];
  };

  // Extract SWOT data directly from the archetype object
  const strengths = processSwotData(archetype?.strengths || archetype?.swot_analysis?.strengths);
  const weaknesses = processSwotData(archetype?.weaknesses || archetype?.swot_analysis?.weaknesses);
  const opportunities = processSwotData(archetype?.opportunities || archetype?.swot_analysis?.opportunities);
  const threats = processSwotData(archetype?.threats || archetype?.swot_analysis?.threats);

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
