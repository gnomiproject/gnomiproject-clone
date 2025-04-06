
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { ExternalLink } from 'lucide-react';

interface ArchetypeDetailViewProps {
  archetypeSummary: {
    id: ArchetypeId;
    familyId: 'a' | 'b' | 'c';
    name: string;
    familyName: string;
    description: string;
    keyCharacteristics: string[];
  };
  onShowDetailDialog: () => void;
}

const ArchetypeDetailView: React.FC<ArchetypeDetailViewProps> = ({
  archetypeSummary,
  onShowDetailDialog
}) => {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Archetype header - Level 1 */}
      <div className={`p-6 bg-white rounded-lg shadow-sm border border-gray-100`}>
        <div className="flex flex-wrap gap-2 mb-2">
          <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-family-${archetypeSummary.familyId}/20 text-family-${archetypeSummary.familyId}`}>
            Family {archetypeSummary.familyId}: {archetypeSummary.familyName}
          </div>
          <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-archetype-${archetypeSummary.id}/20 text-archetype-${archetypeSummary.id}`}>
            {archetypeSummary.id}
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-3 text-archetype-${archetypeSummary.id}`}>
          {archetypeSummary.name}
        </h3>
        
        <p className="text-gray-600 mb-4">{archetypeSummary.description}</p>
      </div>

      {/* Key Characteristics Section - Level 1 */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-semibold text-gray-700 mb-4 text-lg">Key Characteristics:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {archetypeSummary.keyCharacteristics.map((trait, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 p-4 rounded-md bg-archetype-${archetypeSummary.id}/5 border-l-3 border-archetype-${archetypeSummary.id} text-left`}
            >
              <div className={`h-2.5 w-2.5 mt-1.5 rounded-full bg-archetype-${archetypeSummary.id} flex-shrink-0`}></div>
              <span className="text-gray-700">{trait}</span>
            </div>
          ))}
        </div>
        
        {/* Learn More button at the bottom */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={onShowDetailDialog}
            className={`inline-flex items-center px-4 py-2 rounded text-white bg-archetype-${archetypeSummary.id} hover:opacity-90 transition-opacity`}
          >
            Learn More
            <ExternalLink className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeDetailView;
