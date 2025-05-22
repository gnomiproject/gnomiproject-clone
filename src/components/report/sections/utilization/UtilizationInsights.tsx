
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from 'lucide-react';
import { normalizeArray } from '@/utils/array/arrayUtils';

interface UtilizationInsightsProps {
  reportData: any;
}

const UtilizationInsights = ({
  reportData
}: UtilizationInsightsProps) => {
  // Log available data for debugging
  console.log('[UtilizationInsights] Received data:', {
    hasUtilizationPatterns: !!reportData?.utilization_patterns,
    dataType: typeof reportData?.utilization_patterns,
    snippet: reportData?.utilization_patterns ? reportData.utilization_patterns.substring(0, 50) + '...' : 'N/A'
  });
  
  // Try to parse JSON data if it exists - memoized for better performance
  const parsedInsights = useMemo(() => {
    try {
      if (!reportData || !reportData.utilization_patterns) {
        return null;
      }

      // Handle JSON string format
      if (typeof reportData.utilization_patterns === 'string' && 
          reportData.utilization_patterns.trim().startsWith('{')) {
        const parsed = JSON.parse(reportData.utilization_patterns);
        
        // Clean up the overview text to completely remove field names
        if (parsed?.overview) {
          // Remove "Overview of utilization_patterns for archetype X" completely
          const cleanedOverview = parsed.overview
            .replace(/overview of utilization_patterns for archetype \w+/i, '')
            .replace(/^[:\s\.]+/, '') // Remove leading colons or spaces
            .trim();
            
          return {
            // We'll not show the overview anymore as requested
            findings: parsed.findings || {}
            // We'll intentionally exclude key_metrics as they repeat information
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing utilization insights:', error);
      return null;
    }
  }, [reportData?.utilization_patterns]);

  // Handle case where there are no insights
  if (!reportData?.utilization_patterns) {
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
            {/* Overview section removed as requested */}
            
            {/* Findings section as bullet points */}
            {parsedInsights.findings && Object.keys(parsedInsights.findings).length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Key Findings:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {Object.entries(parsedInsights.findings).map(([key, value]: [string, any], index) => {
                    // Format the key for display by removing numbers and special characters
                    const cleanKey = key
                      .replace(/^\d+[\s:\.]*/, '')
                      .replace(/^[:\s\.]+/, '')
                      .trim();
                    
                    // Don't include the key name in the display to avoid repetition
                    return (
                      <li key={index} className="text-gray-700">
                        {String(value)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {/* Removed Key metrics section as it duplicates information */}
          </div>
        ) : (
          // Fallback to raw string parsing and general information
          <div>
            {typeof reportData.utilization_patterns === 'string' && (
              <div>
                {reportData.utilization_patterns
                  .replace(/overview of utilization_patterns for archetype \w+/i, '')
                  .split('\n')
                  .map((line: string, index: number) => (
                    line.trim() && <p key={index} className="text-gray-700 mb-2">{line.trim()}</p>
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

export default React.memo(UtilizationInsights);
