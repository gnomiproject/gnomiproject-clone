
import React from 'react';
import { Card } from '@/components/ui/card';
import { Diamond, Check } from 'lucide-react';

interface KeyCharacteristicsListProps {
  characteristics: string[];
  archetypeColor: string;
}

const KeyCharacteristicsList: React.FC<KeyCharacteristicsListProps> = ({ 
  characteristics,
  archetypeColor
}) => {
  if (!characteristics || characteristics.length === 0) {
    return (
      <Card className="p-6">
        <h4 className="text-lg font-medium mb-2">Key Characteristics</h4>
        <p className="text-gray-600">No key characteristics available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h4 className="text-lg font-medium mb-4">Key Characteristics</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characteristics.map((characteristic, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div 
              className="flex items-center justify-center h-6 w-6 rounded-full"
              style={{ backgroundColor: archetypeColor + '20' }} // Using color with opacity
            >
              <Check size={16} style={{ color: archetypeColor }} />
            </div>
            <p className="text-gray-700">{characteristic}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default KeyCharacteristicsList;
