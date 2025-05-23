
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculatePercentageDifferenceSync } from '@/utils/reports/metricUtils';
import { User } from 'lucide-react';

interface PediatricCareGapsProps {
  reportData: any;
  averageData: any;
}

const PediatricCareGaps: React.FC<PediatricCareGapsProps> = ({ reportData, averageData }) => {
  const pediatricMetrics = [
    { id: 'Gaps_Wellness Visit Ages 1-2', label: 'Ages 1-2 Wellness' },
    { id: 'Gaps_Wellness Visit Ages 2-7', label: 'Ages 2-7 Wellness' },
    { id: 'Gaps_Wellness Visit Ages 7-12', label: 'Ages 7-12 Wellness' },
    { id: 'Gaps_Wellness Visit Ages 12-20', label: 'Ages 12-20 Wellness' }
  ];

  // For clarity - this is similar to PreventiveCareGaps but with different metrics
  const formatValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const getStatusClass = (value: number, avgValue: number) => {
    const diff = value - avgValue;
    if (diff >= 0.03) return 'text-green-700'; // Better
    if (diff <= -0.03) return 'text-red-700';  // Worse
    return 'text-gray-700';                    // Similar
  };

  const hasData = pediatricMetrics.some(metric => reportData[metric.id] !== undefined);

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-indigo-600" />
            <span>Child & Adolescent Care</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">Pediatric care data not available for this population</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-indigo-600" />
          <span>Child & Adolescent Care</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2 font-medium text-gray-600">Age Group</th>
              <th className="pb-2 font-medium text-gray-600 text-right">Performance</th>
              <th className="pb-2 font-medium text-gray-600 text-right">vs Archetype Avg</th>
            </tr>
          </thead>
          <tbody>
            {pediatricMetrics.map(metric => {
              const value = reportData[metric.id] || 0;
              const avgValue = averageData?.[metric.id] || 0;
              const diffPercent = calculatePercentageDifferenceSync(value, avgValue);
              const statusClass = getStatusClass(value, avgValue);
              
              return (
                <tr key={metric.id} className="border-t border-gray-100">
                  <td className="py-3 font-medium">{metric.label}</td>
                  <td className="py-3 text-right font-bold">{formatValue(value)}</td>
                  <td className={`py-3 text-right ${statusClass}`}>
                    {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-4">
          * Well-child visits are an essential part of preventive pediatric care
        </p>
      </CardContent>
    </Card>
  );
};

export default PediatricCareGaps;
