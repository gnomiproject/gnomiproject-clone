
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  executiveSummary?: string;
  archetypeName: string;
  archetypeColor?: string;
}

const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  executiveSummary,
  archetypeName,
  archetypeColor = '#6E59A5'
}) => {
  const defaultSummary = `The ${archetypeName} archetype represents organizations with distinct healthcare utilization patterns and cost structures. This analysis provides comprehensive insights into your organization's healthcare landscape, benchmarked against industry standards and peer organizations with similar characteristics.`;

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-l-4" 
          style={{ borderLeftColor: archetypeColor }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5" style={{ color: archetypeColor }} />
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed text-base">
            {executiveSummary || defaultSummary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummaryCard;
