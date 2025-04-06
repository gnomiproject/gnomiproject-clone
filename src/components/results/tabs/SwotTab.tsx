
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotTab = ({ archetypeData }: SwotTabProps) => {
  return (
    <div className="py-6">
      <h4 className="text-2xl font-bold mb-6">SWOT Analysis</h4>
      <p className="mb-6">Strategic analysis for {archetypeData.name} organizations:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h5 className="text-lg font-bold text-green-700 mb-4">Strengths</h5>
          <ul className="space-y-2 text-left">
            {archetypeData.enhanced?.swot?.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <span className="text-left">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h5 className="text-lg font-bold text-red-700 mb-4">Weaknesses</h5>
          <ul className="space-y-2 text-left">
            {archetypeData.enhanced?.swot?.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                <span className="text-left">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h5 className="text-lg font-bold text-blue-700 mb-4">Opportunities</h5>
          <ul className="space-y-2 text-left">
            {archetypeData.enhanced?.swot?.opportunities.map((opportunity, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span className="text-left">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h5 className="text-lg font-bold text-amber-700 mb-4">Threats</h5>
          <ul className="space-y-2 text-left">
            {archetypeData.enhanced?.swot?.threats.map((threat, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                <span className="text-left">{threat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SwotTab;
