
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from 'lucide-react';

interface UtilizationInsightsProps {
  reportData: any;
}

const UtilizationInsights = ({
  reportData
}: UtilizationInsightsProps) => {
  // Try to parse JSON data if it exists
  const parseInsights = () => {
    try {
      if (typeof reportData.utilization_patterns === 'string' && reportData.utilization_patterns.trim().startsWith('{')) {
        const parsedData = JSON.parse(reportData.utilization_patterns);
        
        if (parsedData?.overview) {
          return {
            overview: parsedData.overview,
            findings: parsedData.findings || [],
            metrics: parsedData.key_metrics || []
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing utilization insights:', error);
      return null;
    }
  };

  const parsedInsights = parseInsights();
  
  // Handle case where there are no insights
  if (!reportData.utilization_patterns) {
    return (
      <Card className="mt-4 mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <ChartPie className="mr-2 h-5 w-5 text-yellow-600" />
            Utilization Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-500">No utilization insights available for this archetype.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <ChartPie className="mr-2 h-5 w-5 text-yellow-600" />
          Utilization Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {parsedInsights ? (
          <div className="space-y-4">
            {/* Overview section */}
            {parsedInsights.overview && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">{parsedInsights.overview}</p>
              </div>
            )}
            
            {/* Findings section as bullet points */}
            {parsedInsights.findings && Object.keys(parsedInsights.findings).length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Key Findings:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {Object.entries(parsedInsights.findings).map(([key, value]: [string, any], index) => {
                    // Clean up the key - remove numbers at the beginning if present
                    const cleanKey = key.replace(/^\d+\s*/, '').replace(/([A-Z])/g, ' $1').trim();
                    return (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium">{cleanKey}: </span>
                        {value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {/* Key metrics */}
            {parsedInsights.metrics && parsedInsights.metrics.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Key Metrics:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {parsedInsights.metrics.map((metric: any, index: number) => {
                    // Format consistently with metrics in parentheses
                    const metricText = metric.context ? 
                      `${metric.value} (${metric.context})` : 
                      metric.value;
                      
                    return (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium">{metric.name}: </span>
                        {metricText}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // Fallback to raw string parsing and general information
          <div>
            {typeof reportData.utilization_patterns === 'string' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                {reportData.utilization_patterns.split('\n').map((line: string, index: number) => (
                  <p key={index} className="text-blue-800 mb-2">{line}</p>
                ))}
              </div>
            )}
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">General Utilization Considerations</h3>
              <ul className="list-disc pl-5 space-y-2 text-yellow-700">
                <li>Monitor emergency department utilization to identify opportunities for redirecting care to more appropriate settings</li>
                <li>Examine telehealth adoption rates to assess remote care engagement and digital access barriers</li>
                <li>Review specialist to PCP visit ratios to ensure effective care coordination and appropriate referral patterns</li>
                <li>Analyze high-cost claimant characteristics to develop targeted care management strategies</li>
                <li>Consider plan design adjustments to encourage appropriate utilization of preventive and primary care services</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilizationInsights;
