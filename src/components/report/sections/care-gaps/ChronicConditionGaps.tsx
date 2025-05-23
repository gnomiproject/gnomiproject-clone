
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculatePercentageDifferenceSync } from '@/utils/reports/metricUtils';
import { Activity } from 'lucide-react';

interface ChronicConditionGapsProps {
  reportData: any;
  averageData: any;
}

const ChronicConditionGaps: React.FC<ChronicConditionGapsProps> = ({ reportData, averageData }) => {
  const metrics = [
    { id: 'Gaps_Diabetes Annual Exam', label: 'Diabetes Annual Exam', group: 'Diabetes' },
    { id: 'Gaps_Diabetes HbA1C Test', label: 'Diabetes HbA1C Test', group: 'Diabetes' },
    { id: 'Gaps_Diabetes Retinal Screening', label: 'Diabetes Retinal Screening', group: 'Diabetes' },
    { id: 'Gaps_Diabetes RX Adherence', label: 'Diabetes Rx Adherence', group: 'Diabetes' },
    { id: 'Gaps_Hypertension Annual Exam', label: 'Hypertension Annual Exam', group: 'Hypertension' },
    { id: 'Gaps_Hypertension RX Adherence', label: 'Hypertension Rx Adherence', group: 'Hypertension' },
    { id: 'Gaps_Hyperlipidemia RX Adherence', label: 'Hyperlipidemia Rx Adherence', group: 'Lipids' }
  ];

  const formatValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  // Group metrics by condition for better organization
  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.group]) {
      acc[metric.group] = [];
    }
    acc[metric.group].push(metric);
    return acc;
  }, {} as Record<string, typeof metrics>);
  
  // Check if we have any data to display
  const hasData = metrics.some(metric => reportData[metric.id] !== undefined);

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-red-600" />
            <span>Chronic Condition Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">Chronic condition management data not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-red-600" />
          <span>Chronic Condition Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(groupedMetrics).map(([group, groupMetrics]) => (
          <div key={group} className="mb-5 last:mb-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{group} Care</h3>
            <table className="w-full text-sm">
              <tbody>
                {groupMetrics.map(metric => {
                  const value = reportData[metric.id] || 0;
                  const avgValue = averageData?.[metric.id] || 0;
                  const diffPercent = calculatePercentageDifferenceSync(value, avgValue);
                  
                  // Determine color based on performance
                  const textColor = value >= avgValue ? 'text-green-700' : 'text-red-700';
                  
                  return (
                    <tr key={metric.id} className="border-t border-gray-100">
                      <td className="py-2">{metric.label}</td>
                      <td className="py-2 text-right font-medium">{formatValue(value)}</td>
                      <td className={`py-2 text-right ${textColor}`}>
                        {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        <p className="text-xs text-gray-500 mt-4">
          * Higher percentages indicate better compliance with condition management guidelines
        </p>
      </CardContent>
    </Card>
  );
};

export default ChronicConditionGaps;
