
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface DetailToggleButtonProps {
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  archetypeData: ArchetypeDetailedData;
}

const DetailToggleButton = ({ showDetails, setShowDetails, archetypeData }: DetailToggleButtonProps) => {
  const color = `archetype-${archetypeData.id}`;

  return (
    <div className="text-center mb-8">
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center justify-center mx-auto px-6 py-3 rounded-lg text-white font-medium transition-colors bg-${color} hover:bg-${color}/90`}
      >
        {showDetails ? "Hide Detailed Analysis" : "Show Detailed Analysis"}
        <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default DetailToggleButton;
