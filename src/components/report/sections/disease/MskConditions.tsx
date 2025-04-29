
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from '@/utils/formatters';
import { Bone } from 'lucide-react';

interface MskConditionsProps {
  reportData: any;
  averageData: any;
}

const MskConditions = ({ reportData, averageData }: MskConditionsProps) => {
  // Check if we have valid data
  if (!reportData) return null;

  // Define MSK conditions
  const conditions = [
    { id: 'Dise_Back Pain Prevalence', label: 'Back Pain' },
    { id: 'Dise_MSK Prevalence', label: 'All MSK Conditions' },
    { id: 'Dise_Osteoarthritis Prevalence', label: 'Osteoarthritis' },
  ];

  // Format data for the conditions
  const conditionsData = conditions.map(condition => {
    const value = reportData[condition.id] || 0;
    const avgValue = averageData && averageData[condition.id] ? averageData[condition.id] : 0;
    const diff = value - avgValue;
    const diffPercentage = avgValue ? ((value - avgValue) / avgValue) * 100 : 0;
    
    return {
      ...condition,
      value,
      avgValue,
      diff,
      diffPercentage
    };
  });

  // Calculate the average percentage difference
  const averageDiff = conditionsData.reduce((sum, item) => sum + item.diffPercentage, 0) / conditionsData.length;
  
  // Check if this archetype has higher MSK burden
  const hasHigherMskBurden = averageDiff > 10;

  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Bone className="h-5 w-5 text-blue-600" />
          <span>Musculoskeletal & Pain Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Musculoskeletal conditions and pain syndromes are common drivers of healthcare costs, 
            disability claims, and productivity losses. They often present opportunities for 
            targeted interventions and care pathway optimization.
          </p>
          
          {hasHigherMskBurden && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-md">
              <p className="text-sm text-orange-700">
                <strong>Note:</strong> This population has higher than average prevalence of musculoskeletal conditions,
                suggesting potential benefit from ergonomic programs, physical therapy access, and specialized pain management.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conditionsData.map((condition, index) => {
            const diffClass = condition.diff > 0 ? "text-amber-600" : "text-green-600";
            
            return (
              <div key={condition.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-center">{condition.label}</h4>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">{formatPercent(condition.value)}</div>
                  <div className={`text-sm ${diffClass}`}>
                    {condition.diff > 0 ? '+' : ''}{Math.round(condition.diffPercentage)}% vs avg
                  </div>
                </div>
                
                <div className="mt-3 flex justify-center items-center gap-3">
                  <div className="text-xs text-gray-500">Avg: {formatPercent(condition.avgValue)}</div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${condition.diff > 0 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, Math.max(5, (condition.value / Math.max(condition.value, condition.avgValue)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">MSK Impact Analysis</h4>
          <p className="text-sm text-gray-600 mt-2">
            Musculoskeletal conditions often correlate with other health issues and utilization patterns. 
            For this population, MSK conditions show a{' '}
            {Math.abs(averageDiff) < 10 ? 'similar' : averageDiff > 0 ? 'higher' : 'lower'}{' '}
            prevalence compared to benchmarks ({Math.round(Math.abs(averageDiff))}%{' '}
            {averageDiff >= 0 ? 'above' : 'below'}).
          </p>
          
          {reportData['Util_Specialist Visits per 1k Members'] && (
            <p className="text-sm text-gray-600 mt-2">
              This correlates with {reportData['Util_Specialist Visits per 1k Members'] > 
              (averageData?.['Util_Specialist Visits per 1k Members'] || 0) ? 
              'higher' : 'lower'} specialist utilization patterns seen in the utilization section.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MskConditions;
