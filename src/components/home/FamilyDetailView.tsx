
import React from 'react';
import { ArchetypeSummary } from '@/types/archetype';

interface FamilyDetailViewProps {
  familyInfo: {
    id: string;
    name: string;
    description: string;
    commonTraits: string[];
  };
  archetypes: ArchetypeSummary[];
  onSelectArchetype: (id: string) => void;
}

const FamilyDetailView: React.FC<FamilyDetailViewProps> = ({ 
  familyInfo, 
  archetypes,
  onSelectArchetype
}) => {
  return (
    <div className={`animate-fade-in p-6 bg-white rounded-lg shadow-sm border-l-4 border-family-${familyInfo.id}`}>
      <h3 className={`text-2xl font-bold mb-3 text-family-${familyInfo.id}`}>
        family {familyInfo.id}: {familyInfo.name.toLowerCase()}
      </h3>
      
      <p className="text-gray-600 mb-4">{familyInfo.description}</p>
      
      <h4 className="font-semibold text-gray-700 mb-2">Common Traits:</h4>
      <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-left">
        {familyInfo.commonTraits.map((trait, index) => (
          <li key={index}>{trait}</li>
        ))}
      </ul>
      
      <div className="mt-6 space-y-4">
        <h4 className="font-semibold text-gray-700">Archetypes in this family:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {archetypes
            .filter(archetype => archetype.familyId === familyInfo.id)
            .map(archetype => (
              <div 
                key={archetype.id} 
                className={`p-3 bg-gray-50 rounded border-l-3 border-archetype-${archetype.id} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => onSelectArchetype(archetype.id)}
              >
                <h5 className={`font-semibold text-archetype-${archetype.id}`}>{archetype.name}</h5>
                <p className="text-sm text-gray-600 mt-1">
                  {archetype.description ? `${archetype.description.substring(0, 75)}...` : 'No description available'}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default FamilyDetailView;
