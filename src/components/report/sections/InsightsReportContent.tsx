
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
      </div>
    </div>
  );
};

export default InsightsReportContent;
