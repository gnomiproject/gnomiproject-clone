
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import WebsiteImage from '@/components/common/WebsiteImage';

interface ArchetypeHeaderProps {
  name: string;
  description: string;
  familyId: string;
  familyName: string;
  familyColor: string;
  archetypeHexColor: string;
  dataSource?: string;
  gnomeImage?: string;
}

const ArchetypeHeader = ({
  name,
  description,
  familyId,
  familyName,
  familyColor,
  archetypeHexColor,
  dataSource,
  gnomeImage
}: ArchetypeHeaderProps) => {
  return (
    <>
      <div className="h-2" style={{ backgroundColor: archetypeHexColor }}></div>
      
      <div className="p-6 md:p-8">
        {dataSource && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs text-muted-foreground">
              Data source: {dataSource}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-center">
          <div className="md:flex-grow space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-opacity-10 border-0" style={{ 
                backgroundColor: `${familyColor}20`, 
                color: familyColor 
              }}>
                {`Family ${familyId?.toLowerCase() || 'unknown'}`}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{name}</h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex-shrink-0 hidden md:block">
            <WebsiteImage 
              type="chart"
              altText={`${name} Guide`}
              className="h-48 object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArchetypeHeader;
