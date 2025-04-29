
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemographicInsightsProps {
  insights: string | string[];
}

const DemographicInsights: React.FC<DemographicInsightsProps> = ({ insights }) => {
  // Process insights text to create structured content
  const processedInsights = React.useMemo(() => {
    if (!insights) return ["No demographic insights available."];
    
    // Check if insights is already an array
    if (Array.isArray(insights)) {
      return insights;
    }
    
    // If it's a string, split by paragraphs or bullet points
    return insights
      .split(/\n|•/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }, [insights]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Building className="mr-2 h-5 w-5 text-blue-600" />
          Key Demographic Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {processedInsights.length > 0 ? (
          <div className="prose max-w-none">
            {processedInsights.length === 1 && !processedInsights[0].includes("•") ? (
              <p>{processedInsights[0]}</p>
            ) : (
              <ul className="space-y-2">
                {processedInsights.map((insight, index) => (
                  <li key={index} className="text-gray-700">
                    {insight.startsWith('•') ? insight.substring(1).trim() : insight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">No demographic insights available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DemographicInsights;
