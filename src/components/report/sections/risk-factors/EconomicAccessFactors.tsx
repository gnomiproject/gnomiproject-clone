
import React from 'react';
import { Banknote, Hospital, Carrot, Bus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters';
import { calculatePercentageDifferenceSync } from '@/utils/reports/metricUtils';

interface EconomicAccessFactorsProps {
  reportData: any;
  averageData: any;
}

const EconomicAccessFactors: React.FC<EconomicAccessFactorsProps> = ({ reportData, averageData }) => {
  // Define the factors to display with their respective icons and field names
  const factors = [
    {
      title: "Economic Security",
      fieldName: "SDOH_Average Economic Insecurity",
      icon: <Banknote className="h-5 w-5 text-emerald-500" />,
      description: "Financial stability and economic resources",
      isRiskFactor: true // Higher values = higher risk
    },
    {
      title: "Healthcare Access",
      fieldName: "SDOH_Average Healthcare Access",
      icon: <Hospital className="h-5 w-5 text-blue-500" />,
      description: "Access to healthcare providers and services",
      isRiskFactor: true // Higher values = higher risk (barriers to access)
    },
    {
      title: "Food Access",
      fieldName: "SDOH_Average Food Access",
      icon: <Carrot className="h-5 w-5 text-orange-500" />,
      description: "Access to healthy food options and nutrition",
      isRiskFactor: true // Higher values = higher risk (food insecurity)
    },
    {
      title: "Transportation",
      fieldName: "SDOH_Average Transportation",
      icon: <Bus className="h-5 w-5 text-indigo-500" />,
      description: "Availability of transportation to access healthcare",
      isRiskFactor: true // Higher values = higher risk (transportation barriers)
    }
  ];

  return (
    <Card className="p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Economic & Access Factors (SDOH)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {factors.map((factor, index) => {
          // Get the value from reportData, handling possible field name variations
          const value = reportData?.[factor.fieldName] || 
                       reportData?.[factor.fieldName.replace(/ /g, '_')] || 0;
                       
          // Get the average value
          const avgValue = averageData?.[factor.fieldName] || 
                          averageData?.[factor.fieldName.replace(/ /g, '_')] || 0;
          
          // Calculate comparison data using the synchronous version
          const percentDiff = calculatePercentageDifferenceSync(value, avgValue);
          
          // For SDOH risk factors, higher values indicate higher risks
          // So higher than average = more risk (red), lower than average = less risk (green)
          const higherRisk = percentDiff > 0;
          
          const comparisonWord = percentDiff > 0 ? "higher than" : "lower than";
          const text = `${Math.abs(percentDiff).toFixed(1)}% ${comparisonWord} average`;
          
          // Color based on risk assessment - higher risks (red), lower risks (green)
          const color = higherRisk ? "text-red-600" : "text-green-600";

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                {factor.icon}
                <h4 className="font-medium">{factor.title}</h4>
              </div>
              
              <div className="mt-2">
                <div className="text-2xl font-bold">{formatNumber(value, 'number', 1)}</div>
                <div className="text-sm text-gray-500">{factor.description}</div>
              </div>
              
              <div className="mt-2">
                <span className={`text-sm ${color}`}>{text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default EconomicAccessFactors;
