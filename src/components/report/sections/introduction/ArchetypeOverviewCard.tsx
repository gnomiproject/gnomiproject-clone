
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { getArchetypeColorHex } from '@/data/colors';

interface ArchetypeOverviewCardProps {
  shortDescription: string;
  characteristics: string[];
  archetypeId?: ArchetypeId;
}

const ArchetypeOverviewCard = ({ 
  shortDescription, 
  characteristics,
  archetypeId = 'a1' as ArchetypeId
}: ArchetypeOverviewCardProps) => {
  const archetypeColor = archetypeId ? getArchetypeColorHex(archetypeId) : '#00B0F0';
  
  return (
    <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">About Your Archetype</h3>
            <p className="text-gray-700">{shortDescription}</p>
          </div>
          
          {characteristics.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Key Characteristics</h3>
              <ul className="space-y-2">
                {characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-start">
                    <div 
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5"
                      style={{ backgroundColor: `${archetypeColor}25`, color: archetypeColor }}
                    >
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span>{characteristic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/3 md:border-l md:pl-6 border-slate-200">
          <h3 className="text-lg font-medium mb-3">What This Means For You</h3>
          <p className="text-gray-700 mb-4">
            This report provides tailored insights and recommendations specific to organizations 
            with your health profile and demographic characteristics.
          </p>
          <p className="text-sm text-gray-600">
            By understanding your archetype, you can make more informed decisions about 
            benefit design, wellness programs, and care management initiatives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeOverviewCard;
