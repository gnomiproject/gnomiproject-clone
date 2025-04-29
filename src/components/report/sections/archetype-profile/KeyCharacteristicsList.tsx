
import React from 'react';
import { Card } from '@/components/ui/card';
import { Diamond, Check } from 'lucide-react';

interface KeyCharacteristicsListProps {
  characteristics: string[];
  archetypeColor: string;
}

// Utility function to ensure we always have an array
const ensureArray = (data: any): string[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [data];
    } catch (e) {
      // If it's not JSON parsable, return as a single item array
      return [data];
    }
  }
  return data ? [data] : [];
};

const KeyCharacteristicsList: React.FC<KeyCharacteristicsListProps> = ({ 
  characteristics,
  archetypeColor
}) => {
  // Log the characteristics data for debugging
  console.log('[KeyCharacteristicsList] characteristics type:', typeof characteristics);
  console.log('[KeyCharacteristicsList] characteristics value:', characteristics);
  
  // Ensure we have an array to work with
  const characteristicsArray = ensureArray(characteristics);
  
  if (!characteristicsArray || characteristicsArray.length === 0) {
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
        {characteristicsArray.map((characteristic, index) => (
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
