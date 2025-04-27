
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { insightReportSchema } from '@/schemas/insightReportSchema';

interface InsightsReportContentProps {
  archetype: any; // We'll use any for now until we define a more specific type
}

const InsightsReportContent: React.FC<InsightsReportContentProps> = ({ archetype }) => {
  // Add debug logging to see the data structure
  console.log('InsightsReportContent: Data received:', archetype);

  // Safely extract name from either format (admin or regular)
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {name} Insights Report
          </h1>
          <p className="text-gray-500 mt-2">
            Comprehensive analysis and strategic recommendations
          </p>
        </div>
      </div>

      {/* 1. Overview Section */}
      <Section id="overview">
        <SectionTitle 
          title={insightReportSchema.overview.title}
          subtitle="General information about this archetype population"
        />
        <Card className="p-6">
          <p className="text-gray-700">{archetype?.short_description || 'No description available'}</p>
          {archetype?.executive_summary && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
              <p className="text-gray-700">{archetype.executive_summary}</p>
            </div>
          )}
        </Card>
      </Section>
      
      {/* 2. Key Metrics Section */}
      <Section id="key-metrics">
        <SectionTitle 
          title={insightReportSchema.metrics.title}
          subtitle="Important performance indicators for this population"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* We'll render metric cards dynamically based on schema definition */}
          {insightReportSchema.metrics.fields.map((fieldKey) => {
            const value = archetype[fieldKey];
            if (value !== undefined) {
              return (
                <Card key={fieldKey} className="p-4">
                  <p className="text-sm text-gray-500">{fieldKey.replace(/_/g, ' ')}</p>
                  <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                </Card>
              );
            }
            return null;
          })}
        </div>
      </Section>
      
      {/* 3. SWOT Analysis Section */}
      <Section id="swot-analysis">
        <SectionTitle 
          title={insightReportSchema.swot.title}
          subtitle="Strengths, Weaknesses, Opportunities, and Threats"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Strengths</h3>
            {Array.isArray(archetype?.strengths) && archetype.strengths.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {archetype.strengths.map((item: string, index: number) => (
                  <li key={`strength-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No strengths data available</p>
            )}
          </Card>
          
          {/* Weaknesses */}
          <Card className="p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Weaknesses</h3>
            {Array.isArray(archetype?.weaknesses) && archetype.weaknesses.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {archetype.weaknesses.map((item: string, index: number) => (
                  <li key={`weakness-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No weaknesses data available</p>
            )}
          </Card>
          
          {/* Opportunities */}
          <Card className="p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Opportunities</h3>
            {Array.isArray(archetype?.opportunities) && archetype.opportunities.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {archetype.opportunities.map((item: string, index: number) => (
                  <li key={`opportunity-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No opportunities data available</p>
            )}
          </Card>
          
          {/* Threats */}
          <Card className="p-6 border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">Threats</h3>
            {Array.isArray(archetype?.threats) && archetype.threats.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {archetype.threats.map((item: string, index: number) => (
                  <li key={`threat-${index}`} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No threats data available</p>
            )}
          </Card>
        </div>
      </Section>
      
      {/* 4. Disease & Care Management Section */}
      <Section id="disease-care">
        <SectionTitle 
          title={insightReportSchema.diseaseAndCare.title} 
          subtitle="Health conditions and care management insights"
        />
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Disease Prevalence</h3>
              <div className="space-y-3">
                {['Dise_Heart Disease Prevalence', 'Dise_Type 2 Diabetes Prevalence', 
                  'Dise_Mental Health Disorder Prevalence', 'Dise_Substance Use Disorder Prevalence'].map((metric) => {
                  const value = archetype[metric];
                  if (value !== undefined) {
                    return (
                      <div key={metric} className="flex justify-between items-center">
                        <span className="text-gray-700">{metric.replace('Dise_', '').replace('_', ' ')}</span>
                        <span className="font-medium">{(value * 100).toFixed(1)}%</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Care Gaps</h3>
              <div className="space-y-3">
                {['Gaps_Diabetes RX Adherence', 'Gaps_Behavioral Health FU ED Visit Mental Illness',
                  'Gaps_Cancer Screening Breast', 'Gaps_Wellness Visit Adults'].map((metric) => {
                  const value = archetype[metric];
                  if (value !== undefined) {
                    return (
                      <div key={metric} className="flex justify-between items-center">
                        <span className="text-gray-700">{metric.replace('Gaps_', '')}</span>
                        <span className="font-medium">{(value * 100).toFixed(1)}%</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </Card>
      </Section>
      
      {/* 5. Strategic Recommendations Section */}
      <Section id="recommendations">
        <SectionTitle 
          title={insightReportSchema.recommendations.title} 
          subtitle="Actionable insights for population health management"
        />
        <div className="space-y-4">
          {archetype?.strategic_recommendations && Array.isArray(archetype.strategic_recommendations) && 
           archetype.strategic_recommendations.length > 0 ? (
            archetype.strategic_recommendations.map((rec: any, index: number) => (
              <Card key={`rec-${index}`} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 text-blue-800 font-bold h-8 w-8 flex items-center justify-center flex-shrink-0">
                    {rec.recommendation_number || index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{rec.title || `Recommendation ${index + 1}`}</h3>
                    <p className="text-gray-700">{rec.description || "No description available"}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500 italic">No strategic recommendations available</p>
            </Card>
          )}
        </div>
      </Section>
    </div>
  );
};

export default InsightsReportContent;
