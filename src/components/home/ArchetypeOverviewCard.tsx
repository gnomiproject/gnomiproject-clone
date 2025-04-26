
import React from 'react';
import { Link } from 'react-router-dom';
import { ArchetypeId } from '@/types/archetype';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useArchetypeFamilies } from '@/hooks/archetype/useArchetypeFamilies';

interface ArchetypeOverviewCardProps {
  id: ArchetypeId;
  name: string;
  family_id: string;
  short_description?: string;
  hex_color?: string;
  key_characteristics?: string[];
}

const ArchetypeOverviewCard = ({
  id,
  name,
  family_id,
  short_description,
  hex_color,
  key_characteristics = []
}: ArchetypeOverviewCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { getFamilyById } = useArchetypeFamilies();
  const familyInfo = getFamilyById(family_id as 'a' | 'b' | 'c');
  const cardStyle = hex_color ? { borderTop: `3px solid ${hex_color}` } : {};
  const bulletStyle = hex_color ? { backgroundColor: hex_color } : {};
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Link to={`/archetype/${id}`}>
      <Card 
        className={`h-full p-6 hover:shadow-lg transition-all duration-300 ${isExpanded ? 'scale-105' : ''}`} 
        style={cardStyle}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-sm text-gray-500">{id}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Family {family_id} - {familyInfo?.name || ''}
        </p>
        {short_description && (
          <p className="text-gray-700 mb-4">{short_description}</p>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-4"
          onClick={handleToggleExpand}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Learn More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {isExpanded && key_characteristics && key_characteristics.length > 0 && (
          <div className="mt-4 space-y-3 animate-in fade-in duration-200">
            <h4 className="font-medium text-gray-700 mb-3">Key Characteristics:</h4>
            {key_characteristics.map((characteristic, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-100"
              >
                <div 
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0" 
                  style={bulletStyle}
                />
                <span>{characteristic}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
};

export default ArchetypeOverviewCard;
