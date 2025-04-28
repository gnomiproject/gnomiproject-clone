
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArchetypeDetailedData } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';

interface AssessmentResultsHeaderProps {
  archetypeName: string;
  archetypeId: string;
  familyName: string;
  familyColor: string;
  onRetakeAssessment: () => void;
  assessmentResult?: AssessmentResult | null;
}

const AssessmentResultsHeader = ({ 
  archetypeName, 
  archetypeId,
  familyName,
  familyColor,
  onRetakeAssessment,
  assessmentResult
}: AssessmentResultsHeaderProps) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
        <p className="text-gray-600">The best match for your organization is:</p>
      </div>
      
      <div className="text-center mb-6">
        <Badge className={`bg-family-${archetypeId.charAt(0)}/10 text-family-${archetypeId.charAt(0)} hover:bg-family-${archetypeId.charAt(0)}/20 border-0 px-4 py-2 rounded-full text-sm`}>
          Family {archetypeId.charAt(0).toUpperCase()}: {familyName}
        </Badge>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center justify-center gap-3 mb-6">
        {archetypeName}
        <span className={`inline-flex items-center justify-center bg-${`archetype-${archetypeId}`}/10 text-${`archetype-${archetypeId}`} border border-${`archetype-${archetypeId}`}/30 rounded-full px-3 py-1 text-sm font-medium`}>
          {archetypeId}
        </span>
      </h2>

      <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto">
        {assessmentResult && assessmentResult.resultTier === 'Comprehensive' ? 
          'You have completed a comprehensive assessment with detailed insights.' : 
          'Based on your answers, we\'ve identified your organization\'s healthcare archetype.'}
      </p>
    </div>
  );
};

export default AssessmentResultsHeader;
