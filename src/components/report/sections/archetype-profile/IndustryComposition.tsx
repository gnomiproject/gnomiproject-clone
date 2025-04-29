
import React from 'react';
import { Card } from '@/components/ui/card';
import { Industry, Building } from 'lucide-react';

interface IndustryCompositionProps {
  industries: string;
}

const IndustryComposition: React.FC<IndustryCompositionProps> = ({ industries }) => {
  if (!industries) {
    return (
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-2">Common Industries</h4>
        <p className="text-gray-600">No industry information available.</p>
      </Card>
    );
  }

  // Parse industries string into array (split by commas if it's a single string)
  const industryList = typeof industries === 'string' 
    ? industries.split(',').map(item => item.trim())
    : [];

  return (
    <Card className="p-6">
      <h4 className="text-lg font-medium mb-4">Common Industries</h4>
      
      {industryList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryList.map((industry, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{industry}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{industries}</p>
        </div>
      )}
    </Card>
  );
};

export default IndustryComposition;
