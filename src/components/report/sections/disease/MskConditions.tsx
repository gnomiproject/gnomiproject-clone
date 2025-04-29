
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
        
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 h-60 rounded-lg p-6">
            <div className="grid grid-cols-3 gap-6 h-full">
              {conditionsData.map((condition, index) => {
                const barHeight = `${Math.min(80, condition.value * 200)}%`;
                const avgHeight = `${Math.min(80, condition.avgValue * 200)}%`;
                const diffClass = condition.diff > 0 ? "text-amber-600" : "text-green-600";
                
                return (
                  <div key={condition.id} className="flex flex-col items-center justify-end h-full">
                    <div className="w-full flex justify-center gap-2 mb-2">
                      {/* Your population bar */}
                      <div className="relative w-8">
                        <div 
                          className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm"
                          style={{ height: barHeight }}
                        ></div>
                      </div>
                      
                      {/* Benchmark bar */}
                      <div className="relative w-8">
                        <div 
                          className="absolute bottom-0 w-full bg-gray-300 rounded-t-sm"
                          style={{ height: avgHeight }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-2">
                      <div className="font-medium text-sm">{condition.label}</div>
                      <div className="text-xl font-bold mt-1">{formatPercent(condition.value)}</div>
                      <div className={`text-xs ${diffClass}`}>
                        {condition.diff > 0 ? '+' : ''}{Math.round(condition.diffPercentage)}% vs avg
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-xs text-gray-600">Your Population</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span className="text-xs text-gray-600">Benchmark</span>
            </div>
          </div>
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
