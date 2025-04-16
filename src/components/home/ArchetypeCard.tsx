import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ArchetypeId, ArchetypeColor } from '@/types/archetype';

interface ArchetypeCardProps {
  id: ArchetypeId;
  title: string;
  category: string;
  color: string;
  description: string;
  characteristics: string[];
  keyMetrics?: {
    emergencyUtilization?: {
      value: string;
      trend: 'up' | 'down' | 'neutral';
    },
    specialistUtilization?: {
      value: string;
      trend: 'up' | 'down' | 'neutral';
    },
    healthcareSpend?: {
      value: string;
      trend: 'up' | 'down' | 'neutral';
    }
  };
}

const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  id,
  title,
  category,
  color,
  description,
  characteristics,
  keyMetrics
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
      <div className={`h-2 w-full bg-archetype-${id}`}></div>
      
      <div className="p-6">
        {/* Category badge */}
        <div className={`inline-block text-xs font-medium mb-2 px-2 py-0.5 rounded-full bg-family-${familyId}/20 text-family-${familyId}`}>
          {category}
        </div>
        
        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 text-archetype-${id}`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4">{truncatedDescription}</p>
        
        {/* Characteristics */}
        {expanded && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h4>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-left">
              {characteristics.map((trait, index) => (
                <li key={index} className="text-sm">{trait}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Key Metrics (if available) */}
        {expanded && keyMetrics && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Key Metrics:</h4>
            <div className="grid grid-cols-3 gap-2">
              {keyMetrics.emergencyUtilization && (
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">ER Utilization</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-base font-medium ${
                      keyMetrics.emergencyUtilization.trend === 'up' ? 'text-orange-600' : 
                      keyMetrics.emergencyUtilization.trend === 'down' ? 'text-green-600' : 
                      'text-gray-700'
                    }`}>
                      {keyMetrics.emergencyUtilization.value}
                    </span>
                    <span className={`ml-1 ${
                      keyMetrics.emergencyUtilization.trend === 'up' ? 'text-orange-600' : 
                      keyMetrics.emergencyUtilization.trend === 'down' ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {keyMetrics.emergencyUtilization.trend === 'up' ? '↑' : keyMetrics.emergencyUtilization.trend === 'down' ? '↓' : '–'}
                    </span>
                  </div>
                </div>
              )}
              
              {keyMetrics.specialistUtilization && (
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Specialist Use</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-base font-medium ${
                      keyMetrics.specialistUtilization.trend === 'up' ? 'text-orange-600' : 
                      keyMetrics.specialistUtilization.trend === 'down' ? 'text-green-600' : 
                      'text-gray-700'
                    }`}>
                      {keyMetrics.specialistUtilization.value}
                    </span>
                    <span className={`ml-1 ${
                      keyMetrics.specialistUtilization.trend === 'up' ? 'text-orange-600' : 
                      keyMetrics.specialistUtilization.trend === 'down' ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {keyMetrics.specialistUtilization.trend === 'up' ? '↑' : keyMetrics.specialistUtilization.trend === 'down' ? '↓' : '–'}
                    </span>
                  </div>
                </div>
              )}
              
              {keyMetrics.healthcareSpend && (
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">HC Spend</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-base font-medium ${
                      keyMetrics.healthcareSpend.trend === 'up' ? 'text-orange-600' : 
                      keyMetrics.healthcareSpend.trend === 'down' ? 'text-green-600' : 
                      'text-gray-700'
                    }`}>
                      {keyMetrics.healthcareSpend.value}
                    </span>
                    <span className={`ml-1 ${
                      keyMetrics.healthcareSpend.trend === 'up' ? 'text-orange-600' : 
                      keyMetrics.healthcareSpend.trend === 'down' ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {keyMetrics.healthcareSpend.trend === 'up' ? '↑' : keyMetrics.healthcareSpend.trend === 'down' ? '↓' : '–'}
                    </span>
                  </div>
                </div>
              )}
            </div>
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
