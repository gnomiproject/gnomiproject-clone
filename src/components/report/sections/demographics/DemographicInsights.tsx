
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemographicInsightsProps {
  insights: string | string[] | Record<string, any>;
}

const DemographicInsights: React.FC<DemographicInsightsProps> = ({ insights }) => {
  // Process insights text to create structured content
  const processedInsights = React.useMemo(() => {
    if (!insights) return {
      overview: "",
      findings: ["No demographic insights available."]
    };
    
    // Check if insights is already a parsed object with the right structure
    if (typeof insights === 'object' && !Array.isArray(insights)) {
      if (insights.findings) {
        return {
          overview: insights.overview || "",
          findings: Array.isArray(insights.findings) ? insights.findings : []
        };
      }
    }
    
    // Check if insights is already an array
    if (Array.isArray(insights)) {
      return {
        overview: "",
        findings: insights
      };
    }
    
    try {
      // Check if insights is a JSON string
      if (typeof insights === 'string' && (insights.startsWith('{') || insights.startsWith('['))) {
        const parsedJson = JSON.parse(insights);
        
        // Handle structured JSON format with overview and findings
        if (parsedJson.overview || parsedJson.findings) {
          return {
            overview: parsedJson.overview || "",
            findings: Array.isArray(parsedJson.findings) ? parsedJson.findings : []
          };
        }
        
        // If it's a simple array, return it as findings
        if (Array.isArray(parsedJson)) {
          return {
            overview: "",
            findings: parsedJson
          };
        }
        
        // If it's an object with no recognized structure, extract key metrics
        if (parsedJson.key_metrics && Array.isArray(parsedJson.key_metrics)) {
          const metricFindings = parsedJson.key_metrics.map((metric: any) => {
            return `${metric.name}: ${metric.value}${metric.context ? ` (${metric.context})` : ''}`;
          });
          
          return {
            overview: parsedJson.overview || "",
            findings: [
              ...(Array.isArray(parsedJson.findings) ? parsedJson.findings : []),
              ...metricFindings
            ]
          };
        }
        
        return {
          overview: "",
          findings: ["Data format not recognized."]
        };
      }
      
      // If it's a regular string, split by paragraphs or bullet points
      const textItems = typeof insights === 'string' ? 
        insights
          .split(/\n|•/)
          .map(item => item.trim())
          .filter(item => item.length > 0) : 
        ["No demographic insights available."];
      
      return {
        overview: "",
        findings: textItems
      };
    } catch (e) {
      console.error("Error parsing demographic insights:", e);
      
      // If parsing fails, treat as regular text
      const textItems = typeof insights === 'string' ? 
        insights
          .split(/\n|•/)
          .map(item => item.trim())
          .filter(item => item.length > 0) : 
        ["Error parsing demographic insights."];
      
      return {
        overview: "",
        findings: textItems
      };
    }
  }, [insights]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Building className="mr-2 h-5 w-5 text-blue-600" />
          Key Demographic Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {processedInsights.findings && processedInsights.findings.length > 0 ? (
          <div className="prose max-w-none">
            {processedInsights.overview && (
              <p className="mb-3">{processedInsights.overview}</p>
            )}
            {!processedInsights.overview && (
              <p className="mb-3">The demographics of this archetype show several key characteristics:</p>
            )}
            <ul className="list-disc pl-5 space-y-2">
              {processedInsights.findings.map((insight, index) => (
                <li key={index} className="text-gray-700">
                  {insight.startsWith('•') ? insight.substring(1).trim() : insight}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 italic">No demographic insights available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DemographicInsights;
