
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
  return (
    <Link to={`/archetype/${id}`}>
      <Card className="h-full p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-4">Family {family_id.toUpperCase()}</p>
        {short_description && (
          <p className="text-gray-700">{short_description}</p>
        )}
      </Card>
    </Link>
  );
};

export default ArchetypeOverviewCard;
