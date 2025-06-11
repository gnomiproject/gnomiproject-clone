
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Building2 } from 'lucide-react';
import { getArchetypeColorHex } from '@/data/colors';

interface WelcomeCardProps {
  userName: string;
  archetypeName: string;
  archetypeId: string;
  matchPercentage: number;
  secondaryArchetype?: string;
  organizationSize?: number;
}

const WelcomeCard = ({ 
  userName, 
  archetypeName, 
  archetypeId, 
  matchPercentage,
  secondaryArchetype,
  organizationSize
}: WelcomeCardProps) => {
  const archetypeColor = getArchetypeColorHex(archetypeId as any);
  
  // Enhanced debug logging to verify the userName prop
  console.log('=== WelcomeCard DEBUG START ===');
  console.log('[WelcomeCard] Received userName:', userName);
  console.log('[WelcomeCard] userName type:', typeof userName);
  console.log('[WelcomeCard] userName length:', userName?.length);
  console.log('[WelcomeCard] userName is fallback:', userName === 'Healthcare Professional' || userName === 'Healthcare Leader');
  console.log('[WelcomeCard] All props:', {
    userName,
    archetypeName,
    archetypeId,
    matchPercentage,
    secondaryArchetype,
    organizationSize
  });
  console.log('=== WelcomeCard DEBUG END ===');
  
  return (
    <Card className="border-l-4 bg-gradient-to-r from-blue-50 to-white" 
          style={{ borderLeftColor: archetypeColor }}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {userName}
            </h2>
            <div className="flex items-center gap-3 mb-3">
              <Badge 
                variant="secondary" 
                className="text-lg px-3 py-1 font-semibold"
                style={{ backgroundColor: `${archetypeColor}20`, color: archetypeColor }}
              >
                {archetypeName}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {matchPercentage}% Match
              </Badge>
            </div>
          </div>
          
          {organizationSize && (
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Organization Size</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {organizationSize.toLocaleString()} employees
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            Based on your assessment, your organization aligns most closely with the <strong>{archetypeName}</strong> archetype. 
            This report provides comprehensive insights into your healthcare spending patterns, utilization trends, and strategic opportunities.
          </p>
          
          {secondaryArchetype && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Secondary Archetype:</span> Your organization also shows characteristics of the {secondaryArchetype} archetype, 
                which may indicate opportunities for hybrid strategies.
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg">
            <Users className="w-5 h-5" />
            <p className="text-sm font-medium">
              This analysis is based on archetype benchmarks and your specific organizational profile.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
