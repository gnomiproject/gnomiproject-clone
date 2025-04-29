
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ExpectedImpactProps {
  reportData?: any;
}

const ExpectedImpact: React.FC<ExpectedImpactProps> = ({ reportData }) => {
  // Define some expected impacts based on typical archetype improvements
  // In a full implementation, this would be based on specific report data
  const impactAreas = [
    {
      area: "Healthcare Costs",
      impact: "3-5% reduction in total healthcare spend through improved care management and care gap closure",
      metric: "PMPY medical costs"
    },
    {
      area: "Member Engagement",
      impact: "15-20% increase in preventive care utilization and program participation",
      metric: "Wellness visit compliance rates"
    },
    {
      area: "Health Outcomes",
      impact: "Improved chronic condition management and reduced disease progression",
      metric: "Condition-specific care gap closure"
    },
    {
      area: "Employee Experience",
      impact: "Enhanced satisfaction and improved access to appropriate care",
      metric: "Telehealth utilization and PCP connection rate"
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold">Expected Impact</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Based on similar benefit strategies implemented across comparable populations, 
        you can expect the following outcomes when implementing these recommendations:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impactAreas.map((item, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
            <h4 className="font-medium text-green-700">{item.area}</h4>
            <p className="text-gray-600 my-2">{item.impact}</p>
            <div className="flex items-center mt-3">
              <span className="text-xs uppercase tracking-wider text-gray-500">Key metric:</span>
              <span className="ml-2 text-sm font-medium text-gray-700">{item.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ExpectedImpact;
