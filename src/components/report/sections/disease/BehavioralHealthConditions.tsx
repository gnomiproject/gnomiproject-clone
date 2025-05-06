
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from '@/utils/formatters';
import { Brain } from 'lucide-react';

interface BehavioralHealthConditionsProps {
  reportData: any;
  averageData: any;
}

const BehavioralHealthConditions = ({ reportData, averageData }: BehavioralHealthConditionsProps) => {
  // Check if we have valid data
  if (!reportData) return null;

  // Define behavioral health conditions - removed Anxiety, Major Depression, and PTSD
  const conditions = [
    { id: 'Dise_Mental Health Disorder Prevalence', label: 'Mental Health Disorders' },
    { id: 'Dise_Substance Use Disorder Prevalence', label: 'Substance Use Disorders' },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Behavioral Health Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Behavioral health conditions frequently co-occur with physical health conditions and can significantly
            impact healthcare costs and outcomes if not properly addressed.
          </p>
        </div>
        
        <div className="mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium">Condition</th>
                <th className="text-right py-2 font-medium">Prevalence</th>
                <th className="text-right py-2 font-medium">Benchmark</th>
                <th className="text-right py-2 font-medium">Difference</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map(condition => {
                const value = reportData[condition.id] || 0;
                const avgValue = averageData && averageData[condition.id] ? averageData[condition.id] : 0;
                const diff = value - avgValue;
                const diffClass = diff > 0 ? "text-amber-600" : diff < 0 ? "text-green-600" : "text-gray-600";
                
                return (
                  <tr key={condition.id} className="border-b border-gray-100">
                    <td className="py-2">{condition.label}</td>
                    <td className="text-right py-2 font-semibold">{formatPercent(value)}</td>
                    <td className="text-right py-2">{formatPercent(avgValue)}</td>
                    <td className={`text-right py-2 ${diffClass}`}>
                      {diff > 0 ? '+' : ''}{formatPercent(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralHealthConditions;
