
import React from 'react';
import { Link } from 'react-router-dom';
import { ArchetypeId } from '@/types/archetype';
import { Card } from '@/components/ui/card';

interface ArchetypeOverviewCardProps {
  id: ArchetypeId;
  name: string;
  family_id: string;
  short_description?: string;
  hex_color?: string;
}

const ArchetypeOverviewCard = ({
  id,
  name,
  family_id,
  short_description,
  hex_color
}: ArchetypeOverviewCardProps) => {
  const cardStyle = hex_color ? { borderTop: `3px solid ${hex_color}` } : {};
  
  return (
    <Link to={`/archetype/${id}`}>
      <Card className="h-full p-6 hover:shadow-lg transition-shadow" style={cardStyle}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-sm text-gray-500">{id}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">family {family_id}</p>
        {short_description && (
          <p className="text-gray-700">{short_description}</p>
        )}
      </Card>
    </Link>
  );
};

export default ArchetypeOverviewCard;
