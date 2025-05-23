
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculatePercentageDifferenceSync } from '@/utils/reports/metricUtils';
import { Calendar, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PreventiveCareGapsProps {
  reportData: any;
  averageData: any;
}

const PreventiveCareGaps: React.FC<PreventiveCareGapsProps> = ({ reportData, averageData }) => {
  const preventiveMetrics = [
    { id: 'Gaps_Wellness Visit Adults', label: 'Adult Wellness Visits' },
    { id: 'Gaps_Cancer Screening Breast', label: 'Breast Cancer Screening' },
    { id: 'Gaps_Cancer Screening Cervical', label: 'Cervical Cancer Screening' },
    { id: 'Gaps_Cancer Screening Colon', label: 'Colorectal Cancer Screening' }
  ];

  // For care gaps, higher values are generally better
  const getStatusColor = (value: number, avgValue: number) => {
    const diff = value - avgValue;
    if (diff >= 0.05) return 'bg-green-100 border-green-200'; // 5% better than average
    if (diff <= -0.05) return 'bg-red-100 border-red-200';   // 5% worse than average
    return 'bg-gray-100 border-gray-200';                     // Near average
  };

  const formatGapValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatComparison = (value: number | undefined, avgValue: number | undefined): string => {
    if (value === undefined || avgValue === undefined) return '';
    
    const diff = calculatePercentageDifferenceSync(value, avgValue);
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}% vs archetype avg`;
  };

  const getTextColor = (value: number, avgValue: number) => {
    const diff = value - avgValue;
    if (diff >= 0.03) return 'text-green-700'; // Better
    if (diff <= -0.03) return 'text-red-700';  // Worse
    return 'text-gray-700';                    // Similar
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Preventive Care</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>All comparisons are to the archetype average (a weighted average across all healthcare archetypes)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preventiveMetrics.map(metric => {
            const value = reportData[metric.id] || 0;
            const avgValue = averageData?.[metric.id] || 0;
            const statusClass = getStatusColor(value, avgValue);
            const textColorClass = getTextColor(value, avgValue);
            
            return (
              <div 
                key={metric.id}
                className={`p-3 border rounded-md ${statusClass}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.label}</span>
                  <span className="text-sm text-gray-500">Target: 100%</span>
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <span className="text-xl font-bold">{formatGapValue(value)}</span>
                  <span className={`text-sm ${textColorClass}`}>
                    {formatComparison(value, avgValue)}
                  </span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.max(1, Math.min(100, value * 100))}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Higher percentages indicate better compliance with recommended preventive care
        </p>
      </CardContent>
    </Card>
  );
};

export default PreventiveCareGaps;
