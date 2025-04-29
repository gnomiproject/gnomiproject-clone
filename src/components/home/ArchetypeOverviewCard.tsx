
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useArchetypeFamilies } from '@/hooks/archetype/useArchetypeFamilies';

interface ArchetypeOverviewCardProps {
  id: string;
  name: string;
  family_id: string;
  short_description?: string;
  hex_color?: string;
  key_characteristics?: string[];
}

const ArchetypeOverviewCard = ({
  name,
  family_id,
  short_description,
  hex_color,
  key_characteristics = []
}: ArchetypeOverviewCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { getFamilyById } = useArchetypeFamilies();
  const familyInfo = getFamilyById(family_id as 'a' | 'b' | 'c');
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="h-full">
      <Card 
        className={`h-full p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden`}
        style={{ borderTop: `3px solid ${hex_color}` }}
      >
        <div className="space-y-4">
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: `${familyInfo?.hex_color}15`, 
              color: familyInfo?.hex_color 
            }}
          >
            Family {family_id}: {familyInfo?.name || ''}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: hex_color }}>{name}</h3>
            {short_description && (
              <p className="text-gray-600 line-clamp-3">{short_description}</p>
            )}
          </div>

          {key_characteristics && key_characteristics.length > 0 && (
            <div className="mt-4">
              {isExpanded && (
                <div className="animate-in fade-in duration-200 space-y-3">
                  <div className="pt-4 space-y-2">
                    {key_characteristics.map((characteristic, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: hex_color }}
                        />
                        <span className="text-gray-700">{characteristic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-4">
                <button
                  onClick={handleToggleExpand}
                  className="inline-flex items-center text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                  ) : (
                    <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ArchetypeOverviewCard;
