import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from 'lucide-react';

interface UtilizationInsightsProps {
  reportData: any;
}

const UtilizationInsights = ({
  reportData
}: UtilizationInsightsProps) => {
  // Handle case where there are no insights
  if (!reportData.utilization_patterns) {
    return (
      <Card className="mt-6">
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

  // Format insights into paragraphs
  const insights = typeof reportData.utilization_patterns === 'string' 
    ? reportData.utilization_patterns.split('\n').filter((line: string) => line.trim() !== '')
    : [];

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <ChartPie className="mr-2 h-5 w-5 text-yellow-600" />
          Utilization Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight: string, index: number) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">{insight}</p>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default UtilizationInsights;
