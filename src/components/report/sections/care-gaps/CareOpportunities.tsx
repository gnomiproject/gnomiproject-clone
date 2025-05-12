
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Target } from 'lucide-react';

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
    if (!content) return null;
    
    try {
      // Check if the content is in JSON format
      if (content.trim().startsWith('{')) {
        const gapData = JSON.parse(content);
        
        // Return only the findings section without overview
        if (gapData.findings && gapData.findings.length > 0) {
          return (
            <div className="space-y-4">
              <h4 className="font-medium mb-2">Key Findings</h4>
              <ul className="list-disc pl-5 space-y-2">
                {gapData.findings.map((finding: string, index: number) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
          );
        }
      }
      
      // If not JSON, return null to skip this section
      return null;
    } catch (e) {
      // If parsing fails, return null
      console.error("Error parsing care gaps content:", e);
      return null;
    }
  };
  
  const opportunities = findOpportunities();
  const formattedContent = formatCareGapsContent(careGapsContent);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-amber-600" />
          <span>Key Care Opportunities</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {opportunities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Top Improvement Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {opportunities.map(gap => {
                // Create shorter, cleaner labels
                let shortLabel = gap.label
                  .replace('Behavioral Health Follow-up', 'BH Follow-up')
                  .replace('Emergency Department', 'ED')
                  .replace('Children ADHD', 'ADHD')
                  .replace('High Intensity Care SUD', 'SUD Care');
                
                // If still too long, truncate to reasonable length
                if (shortLabel.length > 25) {
                  shortLabel = shortLabel.substring(0, 25) + '...';
                }
                
                return (
                  <div 
                    key={gap.id}
                    className="border border-amber-200 bg-amber-50 rounded-md p-3"
                  >
                    <h4 className="font-medium text-amber-900 mb-2 h-12 flex items-center">
                      {shortLabel}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-500">Current</div>
                        <div className="font-bold text-lg">{(gap.value * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Archetype Avg</div>
                        <div className="font-bold text-lg">{(gap.avgValue * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Gap</div>
                        <div className="font-bold text-lg text-red-600">{gap.diffPercent}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {formattedContent && (
          <div>
            <h3 className="flex items-center text-sm font-medium mb-3">
              <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
              <span>Care Gaps Analysis</span>
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="prose prose-sm max-w-none text-gray-700">
                {formattedContent}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareOpportunities;
