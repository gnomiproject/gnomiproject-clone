
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

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
  hexColor,
  onShowDetailDialog
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
      
      <CardContent className="space-y-4">
        <p className="text-gray-600">{shortDescription}</p>
        
        {onShowDetailDialog && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowDetailDialog}
              className="gap-2"
            >
              Learn More
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArchetypeOverviewCard;
