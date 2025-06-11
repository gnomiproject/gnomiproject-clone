
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, TrendingUp, Target } from 'lucide-react';

interface WelcomeCardProps {
  userName: string;
  archetypeName: string;
  archetypeId: string;
  matchPercentage?: number;
  secondaryArchetype?: string;
  organizationSize?: string | number;
}

const WelcomeCard = ({
  userName,
  archetypeName,
  archetypeId,
  matchPercentage = 85,
  secondaryArchetype,
  organizationSize
}: WelcomeCardProps) => {
  // COMPREHENSIVE DEBUG LOGGING
  console.log('=== WelcomeCard DEBUG START ===');
  console.log('[WelcomeCard] Received userName:', userName);
  console.log('[WelcomeCard] userName type:', typeof userName);
  console.log('[WelcomeCard] userName length:', userName?.length);
  console.log('[WelcomeCard] userName is fallback:', userName === 'Healthcare Professional');
  console.log('[WelcomeCard] All props:', {
    userName,
    archetypeName,
    archetypeId,
    matchPercentage,
    secondaryArchetype,
    organizationSize
  });
  console.log('=== WelcomeCard DEBUG END ===');

  const formatOrganizationSize = (size: string | number | undefined): string => {
    if (!size) return '';
    
    if (typeof size === 'number') {
      return `${size.toLocaleString()} employees`;
    }
    
    // If it's already a string, return as is
    return size.toString();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building className="h-6 w-6 text-blue-600" />
          Welcome to Your Deep Dive Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Hello, {userName}!</h3>
            <p className="text-gray-600 text-sm mt-1">
              Based on your assessment, your organization most closely aligns with the <span className="font-medium text-blue-700">{archetypeName}</span> archetype.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Archetype Match</h4>
            <p className="text-gray-600 text-sm mt-1">
              {matchPercentage}% compatibility with the {archetypeName} profile
              {organizationSize && (
                <span className="block mt-1">
                  Organization size: {formatOrganizationSize(organizationSize)}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Report Overview</h4>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              This report analyzes the {archetypeName} archetype patterns that best match your organization. 
              The insights and benchmarks are based on aggregated data from similar organizations within this archetype, 
              providing strategic recommendations for optimization and cost savings.
            </p>
          </div>
        </div>

        {secondaryArchetype && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Secondary match:</span> Your organization also shows characteristics of the {secondaryArchetype} archetype.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
