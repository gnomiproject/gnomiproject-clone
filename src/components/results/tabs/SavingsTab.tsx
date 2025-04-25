
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface SavingsTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SavingsTab = ({ archetypeData }: SavingsTabProps) => {
  const color = `archetype-${archetypeData.id}`;
  
  // Get cost savings or provide an empty array if it doesn't exist
  const costSavings = archetypeData.enhanced?.costSavings || [];

  return (
    <div className="py-6">
      <h4 className="text-2xl font-bold mb-6 text-left">Cost Saving Opportunities</h4>
      <p className="mb-6 text-left">Potential savings opportunities for {archetypeData.name} organizations:</p>
      
      <div className="space-y-8">
        {costSavings.map((saving, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            <h5 className="text-lg font-bold mb-4 flex items-start gap-2 text-left">
              <span className={`inline-flex h-6 w-6 rounded-full bg-${color}/10 text-${color} items-center justify-center font-bold flex-shrink-0`}>{index + 1}</span>
              <span>{saving.title}</span>
            </h5>
            <p className="text-gray-700 mb-4 text-left">{saving.description}</p>
            
            {saving.potentialSavings && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <span className="font-medium">Potential Savings:</span>
                <span className="text-green-700 font-bold">{saving.potentialSavings}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsTab;
