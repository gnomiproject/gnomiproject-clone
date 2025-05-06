
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Target, AlertCircle } from 'lucide-react';

interface CareOpportunitiesProps {
  reportData: any;
  averageData: any;
  careGapsContent: string;
  className?: string;
}

const CareOpportunities: React.FC<CareOpportunitiesProps> = ({ 
  reportData, 
  averageData, 
  careGapsContent,
  className = ""
}) => {
  // Find the metrics with the largest gaps vs average (potential opportunities)
  const findOpportunities = () => {
    const gaps = [];
    
    // Look for any metric starting with "Gaps_" and compare to average
    for (const key in reportData) {
      if (key.startsWith('Gaps_') && averageData && averageData[key] !== undefined) {
        const value = reportData[key] || 0;
        const avgValue = averageData[key] || 0;
        const diff = value - avgValue;
        
        // If performance is more than 5% below average, consider it an opportunity
        if (diff < -0.05) {
          gaps.push({
            id: key,
            label: formatGapName(key),
            value,
            avgValue,
            diff,
            diffPercent: (diff / avgValue * 100).toFixed(1)
          });
        }
      }
    }
    
    // Sort by largest gap first
    return gaps.sort((a, b) => a.diff - b.diff).slice(0, 5);
  };
  
  const formatGapName = (gapKey: string): string => {
    return gapKey
      .replace('Gaps_', '')
      .replace(/_/g, ' ')
      .replace(' FU ', ' Follow-up ')
      .replace('RX', 'Prescription')
      .replace('ED', 'Emergency Department');
  };
  
  // Parse and format the care gaps content if it's in JSON format
  const formatCareGapsContent = (content: string) => {
    if (!content) return "No care gaps analysis available.";
    
    try {
      // Check if the content is in JSON format
      if (content.trim().startsWith('{')) {
        const gapData = JSON.parse(content);
        
        // Format the structured data into readable text
        return (
          <div className="space-y-4">
            {gapData.overview && (
              <div>
                <h4 className="font-medium mb-2">Overview</h4>
                <p>{gapData.overview}</p>
              </div>
            )}
            
            {gapData.findings && gapData.findings.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Findings</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {gapData.findings.map((finding: string, index: number) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Removed the key_metrics section as requested */}
          </div>
        );
      }
      
      // If not JSON, return as plain text
      return content;
    } catch (e) {
      // If parsing fails, return the original content
      console.error("Error parsing care gaps content:", e);
      return content;
    }
  };
  
  const opportunities = findOpportunities();
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-amber-600" />
          <span>Key Care Opportunities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {opportunities.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Top Improvement Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {opportunities.map(gap => (
                <div 
                  key={gap.id}
                  className="border border-amber-200 bg-amber-50 rounded-md p-3"
                >
                  <h4 className="font-medium text-amber-900">{gap.label}</h4>
                  <div className="flex justify-between mt-2">
                    <div>
                      <div className="text-xs text-gray-500">Current</div>
                      <div className="font-bold">{(gap.value * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Average</div>
                      <div className="font-bold">{(gap.avgValue * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gap</div>
                      <div className="font-bold text-red-600">{gap.diffPercent}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <h3 className="flex items-center text-sm font-medium mb-3">
            <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
            <span>Care Gaps Analysis</span>
          </h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="prose prose-sm max-w-none text-gray-700">
              {formatCareGapsContent(careGapsContent)}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Best Practice</h3>
              <p className="text-sm text-blue-800">
                Consider using targeted outreach programs to close these care gaps. 
                Coordinated reminders, transportation assistance, and incentives can 
                significantly improve compliance with recommended care.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareOpportunities;
