
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightSwotSectionProps {
  archetype: any;
}

const InsightSwotSection = ({ archetype }: InsightSwotSectionProps) => {
  // Add logging to help debug SWOT data
  useEffect(() => {
    console.log("[InsightSwotSection] Rendering with archetype data:", archetype);
    console.log("[InsightSwotSection] SWOT data fields:", {
      strengths: archetype?.strengths,
      weaknesses: archetype?.weaknesses,
      opportunities: archetype?.opportunities,
      threats: archetype?.threats,
      swot_analysis: archetype?.swot_analysis
    });
  }, [archetype]);

  // Helper function to safely process SWOT data with minimal transformation
  const getSwotData = (data: any): string[] => {
    if (!data) {
      return [];
    }

    console.log("[InsightSwotSection] Processing SWOT data:", {
      dataType: typeof data,
      isArray: Array.isArray(data),
      rawData: data
    });
    
    // If it's already an array, use it directly
    if (Array.isArray(data)) {
      return data.map(item => typeof item === 'string' ? item : String(item));
    }
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
      try {
        const parsed = JSON.parse(data);
        
        if (Array.isArray(parsed)) {
          return parsed.map(item => typeof item === 'string' ? item : String(item));
        } else if (typeof parsed === 'object' && parsed !== null) {
          // Handle case where it's an object with entries/items/points
          for (const key of ['entries', 'items', 'points']) {
            if (Array.isArray(parsed[key])) {
              return parsed[key].map((item: any) => typeof item === 'string' ? item : String(item));
            }
          }
          // If no recognized arrays inside, convert object properties to strings
          return Object.values(parsed).map(val => String(val));
        }
      } catch (e) {
        console.error("[InsightSwotSection] JSON parsing failed:", e);
      }
    }
    
    // If it's an object directly, check for common patterns
    if (data && typeof data === 'object') {
      // Check for common patterns in our data structure
      for (const key of ['entries', 'items', 'points']) {
        if (Array.isArray(data[key])) {
          return data[key].map((item: any) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'text' in item) return item.text;
            return String(item);
          });
        }
      }
      
      // If no recognized arrays found, convert object properties to strings
      return Object.values(data).filter(Boolean).map(val => String(val));
    }
    
    // Fallback: if it's a plain string or other format
    return typeof data === 'string' ? [data] : [String(data)];
  };

  // Check both direct fields and swot_analysis container
  const strengths = getSwotData(archetype?.strengths || archetype?.swot_analysis?.strengths);
  const weaknesses = getSwotData(archetype?.weaknesses || archetype?.swot_analysis?.weaknesses);
  const opportunities = getSwotData(archetype?.opportunities || archetype?.swot_analysis?.opportunities);
  const threats = getSwotData(archetype?.threats || archetype?.swot_analysis?.threats);

  // Log results for debugging
  console.log("[InsightSwotSection] Processed SWOT data:", {
    strengths,
    weaknesses,
    opportunities,
    threats
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
