
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getArchetypeColorHex } from '@/data/colors';
import { ArchetypeId } from '@/types/archetype';

interface WelcomeCardProps {
  userName: string;
  archetypeName: string;
  archetypeId: ArchetypeId;
  matchPercentage: number;
  secondaryArchetype?: string;
}

const WelcomeCard = ({ 
  userName, 
  archetypeName, 
  archetypeId,
  matchPercentage, 
  secondaryArchetype 
}: WelcomeCardProps) => {
  const archetypeColor = getArchetypeColorHex(archetypeId);
  
  return (
    <Card className="p-6 border border-gray-200 bg-gradient-to-br from-white to-slate-50">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <span 
              className="inline-block px-3 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: `${archetypeColor}20`, color: archetypeColor }}
            >
              Archetype {archetypeId.toUpperCase()}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold mb-1">
            Welcome, <span className="text-primary">{userName}</span>
          </h2>
          
          <p className="text-gray-700">
            We've analyzed your organization's health profile and matched you with the <strong>{archetypeName}</strong> archetype.
          </p>
          
          <div className="mt-3 flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {matchPercentage}% match
            </span>
            
            {secondaryArchetype && (
              <span className="text-sm text-gray-600">
                Secondary match: <span className="font-medium">{secondaryArchetype}</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <Button 
            onClick={() => document.getElementById('metrics-overview')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full md:w-auto"
            style={{ backgroundColor: archetypeColor }}
          >
            Explore Full Report <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
