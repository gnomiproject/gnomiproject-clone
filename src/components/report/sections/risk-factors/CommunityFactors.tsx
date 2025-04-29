
import React from 'react';
import { Smartphone, Home, GraduationCap, Heart, Baby, Store } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters';
import { getMetricComparisonText } from '@/utils/reports/metricUtils';

interface CommunityFactorsProps {
  reportData: any;
  averageData: any;
}

const CommunityFactors: React.FC<CommunityFactorsProps> = ({ reportData, averageData }) => {
  // Define the factors to display with their respective icons and field names
  const factors = [
    {
      title: "Digital Access",
      fieldName: "SDOH_Average Digital Access",
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      description: "Access to internet and digital health tools"
    },
    {
      title: "Neighborhood Quality",
      fieldName: "SDOH_Average Neighborhood",
      icon: <Home className="h-5 w-5 text-amber-500" />,
      description: "Safety, pollution, and general community health"
    },
    {
      title: "Health Literacy",
      fieldName: "SDOH_Average Health Literacy",
      icon: <GraduationCap className="h-5 w-5 text-purple-500" />,
      description: "Understanding health information and navigation"
    },
    {
      title: "Women's Health Access",
      fieldName: "SDOH_Average Womens Health",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      description: "Access to women's health services"
    },
    {
      title: "Childcare Access",
      fieldName: "SDOH_Average Childcare Access",
      icon: <Baby className="h-5 w-5 text-teal-500" />,
      description: "Access to childcare services"
    },
    {
      title: "Amenities Access",
      fieldName: "SDOH_Average Amenities Access",
      icon: <Store className="h-5 w-5 text-indigo-500" />,
      description: "Community resources and amenities"
    }
  ];

  return (
    <Card className="p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Digital & Community Factors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {factors.map((factor, index) => {
          // Get the value from reportData, handling possible field name variations
          const value = reportData?.[factor.fieldName] || 
                       reportData?.[factor.fieldName.replace(/ /g, '_')] || 0;
                       
          // Get the average value
          const avgValue = averageData?.[factor.fieldName] || 
                          averageData?.[factor.fieldName.replace(/ /g, '_')] || 0;
          
          // Get comparison text and color
          const { text, color } = getMetricComparisonText(value, avgValue, factor.fieldName);

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

export default CommunityFactors;
