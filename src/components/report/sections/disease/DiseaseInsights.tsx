
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';

interface DiseaseInsightsProps {
  reportData: any;
}

const DiseaseInsights = ({ reportData }: DiseaseInsightsProps) => {
  // Check if we have valid data
  if (!reportData) return null;

  // Get disease prevalence insights from reportData
  const diseaseInsights = reportData.disease_prevalence ? 
    (typeof reportData.disease_prevalence === 'string' ? 
      JSON.parse(reportData.disease_prevalence) : 
      reportData.disease_prevalence) : 
    null;

  // If no insights available, generate some placeholder insights
  const defaultInsights = [
    {
      key: "chronic-disease",
      title: "Chronic Disease Management",
      content: "Consider targeted disease management programs for the conditions with highest prevalence in your population."
    },
    {
      key: "behavioral-health",
      title: "Behavioral Health Integration",
      content: "Integrating behavioral health with physical health services may improve outcomes for both types of conditions."
    },
    {
      key: "msk-programs",
      title: "MSK Care Programs",
      content: "Consider evaluating your MSK care programs and providers based on your population's specific needs."
    }
  ];

  // Use available insights or fallback to default ones
  const insights = (diseaseInsights && Array.isArray(diseaseInsights)) ? 
                  diseaseInsights : defaultInsights;
                  
  // Determine a theme color based on reportData
  const themeColor = reportData.hexColor || reportData.hex_color || "#4B5563";

  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" style={{ color: themeColor }} />
          <span>Key Disease Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Based on your population's disease prevalence patterns, here are key insights and
            recommendations to consider for your healthcare strategy.
          </p>
        </div>
        
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div 
              key={insight.key || `insight-${index}`}
              className="p-4 border-l-4 bg-gray-50 rounded-r-md"
              style={{ borderLeftColor: themeColor }}
            >
              <h4 className="font-medium text-gray-900">{insight.title}</h4>
              <p className="mt-1 text-gray-600">{insight.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border border-dashed border-gray-200 rounded-lg">
          <h4 className="font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span>Analysis Recommendation</span>
          </h4>
          <p className="mt-2 text-sm text-gray-600">
            Consider conducting a detailed claims analysis to identify specific providers and
            facilities treating your highest prevalence conditions. This can help evaluate quality,
            access, and cost-effectiveness of your provider network.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseInsights;
