
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from '@/utils/formatters';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';
import { Cancer, Pill, Flask, Eye, Syringe } from 'lucide-react';

interface SpecialtyConditionsProps {
  reportData: any;
  averageData: any;
}

const SpecialtyConditionsProps = ({ reportData, averageData }: SpecialtyConditionsProps) => {
  // Check if we have valid data
  if (!reportData) return null;

  // Define specialty conditions
  const conditions = [
    { 
      id: 'Dise_Cancer Prevalence', 
      label: 'Cancer', 
      icon: <Cancer className="h-6 w-6 text-pink-500" />,
      description: 'Includes all active cancer diagnoses and treatments'
    },
    { 
      id: 'Dise_Multiple Sclerosis Prevalence', 
      label: 'Multiple Sclerosis', 
      icon: <Flask className="h-6 w-6 text-purple-500" />,
      description: 'Chronic autoimmune disease affecting the central nervous system'
    },
    { 
      id: 'Dise_Infertility Prevalence', 
      label: 'Infertility', 
      icon: <Syringe className="h-6 w-6 text-blue-500" />,
      description: 'Includes diagnosis and treatment for infertility'
    },
    { 
      id: 'Dise_Vitamin D Deficiency Prevalence', 
      label: 'Vitamin D Deficiency', 
      icon: <Pill className="h-6 w-6 text-amber-500" />,
      description: 'Insufficiency of Vitamin D, often requiring supplementation'
    },
  ];

  // Calculate the total specialty condition burden (as percentage points)
  const totalBurden = conditions.reduce((sum, condition) => {
    return sum + (reportData[condition.id] || 0);
  }, 0);

  // Calculate average total burden
  const avgTotalBurden = conditions.reduce((sum, condition) => {
    return sum + (averageData && averageData[condition.id] ? averageData[condition.id] : 0);
  }, 0);

  // Determine if this archetype has significantly different prevalence
  const diffPercentage = calculatePercentageDifference(totalBurden, avgTotalBurden);
  const hasSignificantDifference = Math.abs(diffPercentage) > 15;

  return (
    <Card>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Flask className="h-5 w-5 text-blue-600" />
          <span>Specialty Conditions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Specialty conditions often require specialized care and can represent significant cost drivers.
            Understanding prevalence helps in benefit design and care management programs.
          </p>
          
          {hasSignificantDifference && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> This population has {diffPercentage > 0 ? 'higher' : 'lower'} than average 
                prevalence of specialty conditions ({Math.abs(Math.round(diffPercentage))}% {diffPercentage > 0 ? 'above' : 'below'} benchmark), 
                suggesting a need for {diffPercentage > 0 ? 'enhanced' : 'standard'} specialty care networks.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conditions.map(condition => {
            const value = reportData[condition.id] || 0;
            const avgValue = averageData && averageData[condition.id] ? averageData[condition.id] : 0;
            const diff = value - avgValue;
            const diffPercentage = calculatePercentageDifference(value, avgValue);
            const diffClass = diff > 0 ? "text-amber-600" : diff < 0 ? "text-green-600" : "text-gray-500";
            
            return (
              <div key={condition.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="shrink-0 p-2 bg-gray-50 rounded-md">
                  {condition.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900">{condition.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{condition.description}</p>
                  
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-semibold">
                      {formatPercent(value)}
                    </span>
                    <span className={`text-sm ${diffClass}`}>
                      {diff > 0 ? '↑' : diff < 0 ? '↓' : '–'}
                      {' '}
                      {Math.abs(Math.round(diffPercentage * 10) / 10)}% vs. avg
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Total Specialty Condition Burden</h4>
              <p className="text-xs text-gray-500 mt-1">Combined prevalence of all specialty conditions</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPercent(totalBurden)}</div>
              <div className={diffPercentage > 0 ? "text-amber-600" : "text-green-600"}>
                {diffPercentage > 0 ? '+' : ''}{Math.round(diffPercentage)}% vs. benchmark
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialtyConditionsProps;
