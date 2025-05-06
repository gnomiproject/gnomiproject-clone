
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from '@/utils/formatters';

interface CostAnalysisInsightsProps {
  costAnalysis: string | object;
}

const CostAnalysisInsights = ({ costAnalysis }: CostAnalysisInsightsProps) => {
  // Parse and format the cost analysis insights if it's in JSON format
  const formattedCostAnalysis = React.useMemo(() => {
    try {
      // Check if the text appears to be a JSON string
      if (costAnalysis && typeof costAnalysis === 'string' && (costAnalysis.startsWith('{') || costAnalysis.startsWith('['))) {
        const parsedData = JSON.parse(costAnalysis);
        
        // Process the parsed data to create a readable format
        if (parsedData.overview) {
          const overview = parsedData.overview;
          const findings = parsedData.findings || [];
          const keyMetrics = parsedData.key_metrics || [];
          
          return (
            <div className="space-y-4">
              <p>{overview}</p>
              
              {findings.length > 0 && (
                <div>
                  <h4 className="font-medium my-2">Key Findings:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {findings.map((finding: string, index: number) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {keyMetrics.length > 0 && (
                <div>
                  <h4 className="font-medium my-2">Key Cost Metrics:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {keyMetrics.map((metric: any, index: number) => (
                      <li key={index}>
                        <strong>{metric.name}:</strong> {formatNumber(metric.value, 'currency')} 
                        {metric.context && <span className="text-gray-600"> ({metric.context})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }
      }
    } catch (e) {
      console.error("Error parsing cost analysis data:", e);
    }
    
    // If not JSON or parsing fails, just return the text as is, splitting by periods and newlines for better formatting
    const textContent = typeof costAnalysis === 'string' ? costAnalysis : 'No cost analysis available';
    return (
      <div className="space-y-2">
        {textContent.split(/\.\s+|[\n\r]+/).filter(Boolean).map((paragraph: string, index: number) => (
          <p key={index}>{paragraph.trim()}{!paragraph.trim().endsWith('.') ? '.' : ''}</p>
        ))}
      </div>
    );
  }, [costAnalysis]);

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
          Cost Analysis Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {formattedCostAnalysis}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostAnalysisInsights;
