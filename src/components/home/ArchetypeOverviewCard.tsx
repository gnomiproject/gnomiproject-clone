
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

interface ArchetypeOverviewCardProps {
  name: string;
  id: string;
  familyId: string;
  familyName?: string;  // Make family name optional
  shortDescription: string;
  hexColor: string;
}

const ArchetypeOverviewCard = ({ 
  name, 
  id, 
  familyId,
  familyName,
  shortDescription,
  hexColor 
}: ArchetypeOverviewCardProps) => {
  return (
    <Link to={`/archetype-report/${id}`} className="block h-full">
      <Card className="relative h-full transition-all hover:shadow-lg">
        {/* Colored top bar */}
        <div 
          className="h-2 w-full rounded-t-lg" 
          style={{ backgroundColor: hexColor }}
        />
        
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {familyName ? `Family ${familyName}` : `Family ${familyId.toUpperCase()}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600">{shortDescription}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArchetypeOverviewCard;
