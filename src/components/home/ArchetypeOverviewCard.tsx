
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ArchetypeOverviewCardProps {
  name: string;
  id: string;
  familyId: string;
  familyName?: string;
  shortDescription: string;
  hexColor: string;
  onShowDetailDialog?: () => void;
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
    <Card className="relative h-full transition-all hover:shadow-lg">
      {/* Colored top bar */}
      <div 
        className="h-2 w-full rounded-t-lg" 
        style={{ backgroundColor: hexColor }}
      />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {id.toLowerCase()}
          </span>
        </div>
        <CardDescription>
          family {familyId.toLowerCase()}{familyName ? `: ${familyName}` : ''}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600">{shortDescription}</p>
      </CardContent>
    </Card>
  );
};

export default ArchetypeOverviewCard;
