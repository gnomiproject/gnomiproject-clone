
import React from 'react';
import { Card } from '@/components/ui/card';

interface InsightsReportContentProps {
  archetype: any; // Temporarily using any while we build out the basic version
}

const InsightsReportContent: React.FC<InsightsReportContentProps> = ({ archetype }) => {
  // Add debug logging to see the data structure
  console.log('InsightsReportContent: Data received:', archetype);

  // Safely extract name from either format (admin or regular)
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  const description = archetype?.short_description || archetype?.description || 'No description available';
  
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
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

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-700">{description}</p>
        </Card>
        
        {archetype?.executive_summary && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
            <p className="text-gray-700">{archetype.executive_summary}</p>
          </Card>
        )}
        
        {archetype?.key_findings && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Key Findings</h2>
            <div className="space-y-4">
              {Array.isArray(archetype.key_findings) ? (
                archetype.key_findings.map((finding: string, index: number) => (
                  <p key={index} className="text-gray-700">{finding}</p>
                ))
              ) : (
                <p className="text-gray-700">Key findings data not available</p>
              )}
            </div>
          </Card>
        )}
        
        {/* Add SWOT Analysis section */}
        {(archetype?.strengths || archetype?.weaknesses || archetype?.opportunities || archetype?.threats) && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">SWOT Analysis</h2>
            
            {archetype?.strengths && archetype.strengths.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-700">Strengths</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {archetype.strengths.map((item: string, index: number) => (
                    <li key={`strength-${index}`} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype?.weaknesses && archetype.weaknesses.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-red-700">Weaknesses</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {archetype.weaknesses.map((item: string, index: number) => (
                    <li key={`weakness-${index}`} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype?.opportunities && archetype.opportunities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-700">Opportunities</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {archetype.opportunities.map((item: string, index: number) => (
                    <li key={`opportunity-${index}`} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {archetype?.threats && archetype.threats.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-orange-700">Threats</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {archetype.threats.map((item: string, index: number) => (
                    <li key={`threat-${index}`} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
        
        {/* Add Strategic Recommendations section */}
        {archetype?.strategic_recommendations && archetype.strategic_recommendations.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Strategic Recommendations</h2>
            <div className="space-y-4">
              {archetype.strategic_recommendations.map((rec: any, index: number) => (
                <div key={`rec-${index}`} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <h3 className="font-bold text-lg">{rec.title || `Recommendation ${rec.recommendation_number || (index + 1)}`}</h3>
                  <p className="mt-2 text-gray-700">{rec.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InsightsReportContent;
