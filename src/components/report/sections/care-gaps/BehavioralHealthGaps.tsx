
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculatePercentageDifferenceSync } from '@/utils/reports/metricUtils';
import { Brain } from 'lucide-react';

interface BehavioralHealthGapsProps {
  reportData: any;
  averageData: any;
  className?: string;
}

const BehavioralHealthGaps: React.FC<BehavioralHealthGapsProps> = ({ 
  reportData, 
  averageData,
  className = ""
}) => {
  const metrics = [
    { id: 'Gaps_Behavioral Health FU Antidepressant Med Man', label: 'Antidepressant Management', 
      description: 'Follow-up after starting antidepressant medication' },
    { id: 'Gaps_Behavioral Health FU ED Visit Mental Illness', label: 'Post-ED Mental Health', 
      description: 'Follow-up after emergency dept visit for mental illness' },
    { id: 'Gaps_Behavioral Health FU Hospitalization Mental Illness', label: 'Post-Hospital Mental Health', 
      description: 'Follow-up after hospitalization for mental illness' },
    { id: 'Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse', label: 'Post-ED Substance Use', 
      description: 'Follow-up after ED visit for alcohol/drug abuse' },
    { id: 'Gaps_Behavioral Health FU High Intensity Care SUD', label: 'Post-Intensive SUD Care', 
      description: 'Follow-up after high-intensity care for substance use' },
    { id: 'Gaps_Behavioral Health FU Care Children ADHDMeds', label: 'ADHD Medication (Children)', 
      description: 'Follow-up care for children prescribed ADHD medication' }
  ];

  const formatValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  // Check if we have any data to display
  const hasData = metrics.some(metric => reportData[metric.id] !== undefined);

  if (!hasData) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Behavioral Health Follow-Up</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">Behavioral health follow-up data not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Behavioral Health Follow-Up</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map(metric => {
            const value = reportData[metric.id] || 0;
            const avgValue = averageData?.[metric.id] || 0;
            const diffPercent = calculatePercentageDifferenceSync(value, avgValue);
            
            // Determine styling based on performance
            const bgColor = value >= avgValue ? 'bg-green-50' : 'bg-red-50';
            const borderColor = value >= avgValue ? 'border-green-200' : 'border-red-200';
            const textColor = value >= avgValue ? 'text-green-700' : 'text-red-700';
            
            return (
              <div 
                key={metric.id}
                className={`p-3 border rounded-md ${bgColor} ${borderColor}`}
              >
                <h3 className="font-medium text-gray-900">{metric.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                <div className="mt-2 flex justify-between items-baseline">
                  <span className="text-xl font-bold">{formatValue(value)}</span>
                  <span className={`text-sm ${textColor}`}>
                    {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}% vs archetype avg
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Higher percentages indicate better follow-up care for behavioral health conditions
        </p>
      </CardContent>
    </Card>
  );
};

export default BehavioralHealthGaps;
