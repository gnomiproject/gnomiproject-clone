
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ArchetypeOverviewCardProps {
  name: string;
  id: string;
  familyId: string;
  shortDescription: string;
  hexColor: string;
}

const ArchetypeOverviewCard = ({ 
  name, 
  id, 
  familyId,
  shortDescription,
  hexColor 
}: ArchetypeOverviewCardProps) => {
  return (
    <Card className="relative h-full">
      {/* Colored top bar */}
      <div 
        className="h-2 w-full rounded-t-lg" 
        style={{ backgroundColor: hexColor }}
      />
      
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Family {familyId.toUpperCase()}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600">{shortDescription}</p>
      </CardContent>
    </Card>
  );
};

export default ArchetypeOverviewCard;
