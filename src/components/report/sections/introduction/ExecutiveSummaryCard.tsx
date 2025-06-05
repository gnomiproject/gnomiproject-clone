
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  executiveSummary?: string;
  archetypeName: string;
  keyInsights?: string[];
}

const ExecutiveSummaryCard = ({ 
  executiveSummary, 
  archetypeName,
  keyInsights = []
}: ExecutiveSummaryCardProps) => {
  const defaultSummary = `The ${archetypeName} archetype represents organizations with distinct healthcare utilization patterns and cost structures. This analysis provides comprehensive insights into your organization's healthcare landscape, benchmarked against industry standards.`;

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {executiveSummary || defaultSummary}
          </p>
        </div>
        
        {keyInsights.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-gray-900">Key Insights</h4>
            </div>
            <ul className="space-y-2">
              {keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummaryCard;
