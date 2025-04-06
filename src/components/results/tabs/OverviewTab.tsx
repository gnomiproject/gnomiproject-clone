
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface OverviewTabProps {
  archetypeData: ArchetypeDetailedData;
}

const OverviewTab = ({ archetypeData }: OverviewTabProps) => {
  const color = `archetype-${archetypeData.id}`;
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 md:border-r md:pr-8">
          <div className="flex flex-col h-full">
            <div className={`bg-${color}/10 rounded-full h-24 w-24 flex items-center justify-center mb-6`}>
              <span className={`text-3xl font-bold text-${color}`}>{archetypeData.id}</span>
            </div>
            <h4 className="text-2xl font-bold mb-4 text-left">{archetypeData.name}</h4>
            <h5 className="text-xl font-bold mb-4 text-left">What Makes {archetypeData.name} Unique</h5>
            <p className="text-gray-600 mb-6 text-left">
              Organizations in the {archetypeData.name} archetype have a distinctive approach to healthcare benefits and management strategies. Here's what sets them apart:
            </p>
          </div>
        </div>
        <div className="w-full md:w-2/3 md:pl-8 mt-8 md:mt-0">
          <h4 className="text-2xl font-bold mb-6 text-left">Recommended Strategies</h4>
          <p className="mb-6 text-gray-700 text-left">
            Based on extensive analysis of similar organizations, these are the most effective healthcare strategies for the {archetypeData.name} archetype:
          </p>

          <div className="space-y-6">
            {archetypeData.enhanced?.strategicPriorities?.slice(0, 3).map((priority, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <div className={`bg-${color}/10 rounded-full p-3`}>
                    <span className={`text-${color}`}>
                      {index === 0 ? '🧠' : index === 1 ? '💎' : '📈'}
                    </span>
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold mb-2">{priority.title}</h5>
                    <p className="text-gray-600">
                      {priority.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
