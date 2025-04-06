import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArchetypeDetailedData } from '@/types/archetype';

interface AssessmentResultsHeaderProps {
  archetypeData: ArchetypeDetailedData;
  familyData: { name: string } | undefined;
  onRetakeAssessment: () => void;
}

const AssessmentResultsHeader = ({ 
  archetypeData, 
  familyData, 
  // We keep the prop even though we don't use it, to avoid breaking the API
  onRetakeAssessment 
}: AssessmentResultsHeaderProps) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
        <p className="text-gray-600">The best match for your organization is:</p>
      </div>
      
      <div className="text-center mb-6">
        <Badge className={`bg-family-${archetypeData.familyId}/10 text-family-${archetypeData.familyId} hover:bg-family-${archetypeData.familyId}/20 border-0 px-4 py-2 rounded-full text-sm`}>
          Family {archetypeData.familyId}: {familyData?.name}
        </Badge>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center flex items-center justify-center gap-3 mb-6">
        {archetypeData.name}
        <span className={`inline-flex items-center justify-center bg-${`archetype-${archetypeData.id}`}/10 text-${`archetype-${archetypeData.id}`} border border-${`archetype-${archetypeData.id}`}/30 rounded-full px-3 py-1 text-sm font-medium`}>
          {archetypeData.id}
        </span>
      </h2>

      <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto">
        {archetypeData.summary.description}
      </p>
    </div>
  );
};

export default AssessmentResultsHeader;
