
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
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
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          Family {familyId.toLowerCase()}{familyName ? `: ${familyName}` : ''}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600">{shortDescription}</p>
        
        <div className="flex justify-between items-center">
          <Link to={`/archetype-report/${id}`} className="text-sm text-gray-500 hover:text-gray-700">
            View Report
          </Link>
          {onShowDetailDialog && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowDetailDialog}
              className="gap-2"
            >
              Learn More
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchetypeOverviewCard;
