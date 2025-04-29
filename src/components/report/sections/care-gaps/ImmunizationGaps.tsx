
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';
import { Shield } from 'lucide-react';

interface ImmunizationGapsProps {
  reportData: any;
  averageData: any;
}

const ImmunizationGaps: React.FC<ImmunizationGapsProps> = ({ reportData, averageData }) => {
  const immunizationMetrics = [
    { id: 'Gaps_Immunization HPV', label: 'HPV Vaccine' },
    { id: 'Gaps_Immunization TDAP', label: 'TDAP Vaccine' },
    { id: 'Gaps_Immunization Meningitis', label: 'Meningitis Vaccine' }
  ];

  const formatValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const hasData = immunizationMetrics.some(metric => reportData[metric.id] !== undefined);

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Immunizations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">Immunization data not available for this population</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-green-600" />
          <span>Immunizations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {immunizationMetrics.map(metric => {
            const value = reportData[metric.id] || 0;
            const avgValue = averageData?.[metric.id] || 0;
            const diffPercent = calculatePercentageDifference(value, avgValue);
            const isHigher = value > avgValue;
            
            // Determine color based on performance
            const bgColor = isHigher ? 'bg-green-50' : value < avgValue * 0.9 ? 'bg-red-50' : 'bg-gray-50';
            const borderColor = isHigher ? 'border-green-200' : value < avgValue * 0.9 ? 'border-red-200' : 'border-gray-200';
            const textColor = isHigher ? 'text-green-700' : value < avgValue * 0.9 ? 'text-red-700' : 'text-gray-700';
            
            return (
              <div 
                key={metric.id} 
                className={`p-4 border rounded-md ${bgColor} ${borderColor}`}
              >
                <h3 className="font-medium">{metric.label}</h3>
                <div className="mt-1 flex justify-between items-baseline">
                  <span className="text-2xl font-bold">{formatValue(value)}</span>
                  <span className={`text-sm ${textColor}`}>
                    {diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}% vs avg
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <div className="h-1.5 flex-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isHigher ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.max(1, Math.min(100, value * 100))}%` }}
                    ></div>
                  </div>
                  <span>100%</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Higher percentages indicate better compliance with immunization recommendations
        </p>
      </CardContent>
    </Card>
  );
};

export default ImmunizationGaps;
