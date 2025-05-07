
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getArchetypeColorHex } from '@/data/colors';
import { ArchetypeId } from '@/types/archetype';
import WebsiteImage from '@/components/common/WebsiteImage';

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
  
  // Debug logging to verify rendering
  useEffect(() => {
    console.log('[WelcomeCard] Component mounted with props:', { 
      userName, 
      archetypeName, 
      archetypeId,
      matchPercentage,
      archetypeColor
    });
    
    // Check if this component is actually in the DOM
    setTimeout(() => {
      const cardElement = document.querySelector('.welcome-card-container');
      console.log('[WelcomeCard] Card element in DOM:', !!cardElement);
    }, 200);
  }, [userName, archetypeName, archetypeId, matchPercentage, archetypeColor]);
  
  console.log('[WelcomeCard] Rendering component for:', { userName, archetypeName });
  
  return (
    <Card className="p-6 border border-gray-200 bg-gradient-to-br from-white to-slate-50 shadow-md welcome-card-container">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2">
        <div className="hidden md:block mr-2">
          <WebsiteImage 
            type="righthand" 
            altText="Healthcare Gnome" 
            className="h-32 w-auto"
          />
        </div>
        
        <div>
          <div className="mb-2">
            <span 
              className="inline-block px-3 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: `${archetypeColor}20`, color: archetypeColor }}
            >
              Archetype {archetypeId.toLowerCase()}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold mb-1">
            Welcome, <span style={{ color: archetypeColor }}>{userName}</span>
          </h2>
          
          <p className="text-gray-700">
            We've analyzed your organization's health profile and matched you with the <strong style={{ color: archetypeColor }}>{archetypeName}</strong> archetype.
          </p>
          
          <div className="mt-3 flex items-center flex-wrap gap-2">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: `rgba(128, 128, 128, 0.15)`, color: '#555555' }}
            >
              {matchPercentage}% match
            </span>
            
            {secondaryArchetype && (
              <span className="text-sm text-gray-600">
                Secondary match: <span className="font-medium">{secondaryArchetype}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
