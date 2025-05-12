
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from '@/utils/formatters';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';
import { Activity } from 'lucide-react';

interface TopConditionsProps {
  reportData: any;
  averageData: any;
}

const TopConditions = ({ reportData, averageData }: TopConditionsProps) => {
  // Check if we have valid data
  if (!reportData) return null;

  // Define the metrics we want to display
  const conditions = [
    { id: 'Dise_Heart Disease Prevalence', label: 'Heart Disease' },
    { id: 'Dise_Type 2 Diabetes Prevalence', label: 'Type 2 Diabetes' },
    { id: 'Dise_Type 1 Diabetes Prevalence', label: 'Type 1 Diabetes' },
    { id: 'Dise_Hypertension Prevalence', label: 'Hypertension' },
    { id: 'Dise_COPD Prevalence', label: 'COPD' },
  ];

  // Determine the condition with the highest prevalence
  const highestPrevalence = conditions.reduce((highest, condition) => {
    const value = reportData[condition.id] || 0;
    return value > highest.value ? { id: condition.id, value } : highest;
  }, { id: '', value: 0 });

  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Top Chronic Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Chronic conditions drive the majority of healthcare costs. Understanding your population's
            disease burden helps target interventions and improve care management strategies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conditions.map((condition) => {
            // Get values, with fallbacks in case data is missing
            const value = reportData[condition.id] || 0;
            const avgValue = averageData && averageData[condition.id] ? averageData[condition.id] : 0;
            const diff = value - avgValue;
            const diffPercentage = calculatePercentageDifference(value, avgValue);
            const isHigher = value > avgValue;
            const diffClass = diffPercentage === 0 ? "text-gray-600" : 
                             isHigher ? "text-amber-600" : "text-green-600";
            
            return (
              <div key={condition.id} 
                   className={`p-4 border rounded-md ${highestPrevalence.id === condition.id ? "border-blue-200 bg-blue-50" : ""}`}>
                <h4 className="font-medium text-gray-900">{condition.label}</h4>
                <div className="mt-2 flex justify-between items-baseline">
                  <span className="text-2xl font-bold">{formatPercent(value)}</span>
                  <span className={`text-sm ${diffClass}`}>
                    {diffPercentage > 0 ? '+' : ''}{Math.round(diffPercentage)}% vs archetype avg
                  </span>
                </div>
                <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(100, value * 100 * 2)}%` }} // Scale up for visibility
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>* Prevalence represents the percentage of members with an active diagnosis</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopConditions;
