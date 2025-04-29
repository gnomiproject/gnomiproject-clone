
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ArchetypeId } from '@/types/archetype';

interface ArchetypeCardProps {
  id: ArchetypeId;
  title: string;
  category: string;
  color: string;
  description: string;
  characteristics: string[];
}

const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  id,
  title,
  category,
  color,
  description,
  characteristics
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);
  
  // Get family letter for styling (a, b, or c)
  const familyId = id.charAt(0);
  
  // Determine if we should truncate the description
  const shouldTruncate = description.length > 120 && !expanded;
  const truncatedDescription = shouldTruncate ? `${description.substring(0, 120)}...` : description;
  
  return (
    <div className={`relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md`}>
      {/* Colored top bar */}
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="p-6">
        {/* Category badge */}
        <div 
          className={`inline-block text-xs font-medium mb-2 px-2 py-0.5 rounded-full`}
          style={{ 
            backgroundColor: `${color}20`,
            color: color
          }}
        >
          Family {familyId}: {category}
        </div>
        
        {/* Title */}
        <h3 
          className={`text-xl font-bold mb-3`}
          style={{ color: color }}
        >
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4">{truncatedDescription}</p>
        
        {/* Characteristics */}
        {expanded && characteristics && characteristics.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h4>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-left">
              {characteristics.map((trait, index) => (
                <li key={index} className="text-sm">{trait}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Card footer actions */}
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={toggleExpand} 
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <>Show Less <ChevronUp size={16} className="ml-1" /></>
            ) : (
              <>Show More <ChevronDown size={16} className="ml-1" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeCard;
