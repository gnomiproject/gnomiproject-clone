
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from '@/utils/formatters';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';
import { Activity } from 'lucide-react';
import MetricComparisonCard from '@/components/shared/MetricComparisonCard';

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
  // (for highlighting in our component)
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conditions.map((condition) => {
            // Get values, with fallbacks in case data is missing
            const value = reportData[condition.id] ? reportData[condition.id] * 100 : 0;
            const avgValue = averageData && averageData[condition.id] ? 
                             averageData[condition.id] * 100 : 0;
            
            return (
              <MetricComparisonCard
                key={condition.id}
                title={condition.label}
                value={value}
                average={avgValue}
                unit="%"
                className={highestPrevalence.id === condition.id ? 
                          "border-blue-200 bg-blue-50" : ""}
              />
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
