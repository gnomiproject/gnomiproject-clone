
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArchetypeDetailedData } from '@/types/archetype';
import Button from '@/components/shared/Button';
import { RefreshCw } from 'lucide-react';

interface AssessmentResultsHeaderProps {
  archetypeData: ArchetypeDetailedData;
  familyData: { name: string } | undefined;
  onRetakeAssessment: () => void;
}

const AssessmentResultsHeader = ({ 
  archetypeData, 
  familyData, 
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

      <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
        {archetypeData.summary.description}
      </p>

      <div className="flex justify-center">
        <Button
          onClick={onRetakeAssessment}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Retake Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResultsHeader;
