
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface PrioritiesTabProps {
  archetypeData: ArchetypeDetailedData;
}

const PrioritiesTab = ({ archetypeData }: PrioritiesTabProps) => {
  const color = `archetype-${archetypeData.id}`;
  
  // Get strategic priorities or provide an empty array if they don't exist
  const strategicPriorities = archetypeData.enhanced?.strategicPriorities || [];

  return (
    <div className="py-6">
      <h4 className="text-2xl font-bold mb-6 text-left">Strategic Priorities</h4>
      <p className="mb-6 text-left">Based on benchmarking data, these are the recommended priorities for {archetypeData.name} organizations:</p>
      
      <div className="space-y-6">
        {strategicPriorities.map((priority, index) => (
          <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`bg-${color}/10 rounded-lg p-4 flex-shrink-0`}>
                <span className={`text-${color} text-xl font-bold`}>{priority.number}</span>
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold mb-2">{priority.title}</h4>
                <p className="text-gray-700">{priority.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrioritiesTab;
