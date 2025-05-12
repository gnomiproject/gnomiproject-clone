
import React from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import KeyPriorities from './KeyPriorities';
import { ArchetypeDetailedData } from '@/types/archetype';
import { ensureArray } from '@/utils/array/arrayUtils';

interface StrategicRecommendationsSectionProps {
  reportData: ArchetypeDetailedData;
  averageData?: any;
}

const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({
  reportData,
  averageData
}) => {
  // Extract strategic recommendations from either enhanced.strategicPriorities or strategic_recommendations
  const recommendations = reportData?.enhanced?.strategicPriorities || reportData?.strategic_recommendations || [];
  
  // Extract success metrics if available
  const successMetrics = reportData?.success_metrics || reportData?.enhanced?.successMetrics || [];
  
  console.log('[StrategicRecommendationsSection] Data:', {
    hasRecommendations: Array.isArray(recommendations) ? recommendations.length > 0 : !!recommendations,
    hasSuccessMetrics: Array.isArray(successMetrics) ? successMetrics.length > 0 : !!successMetrics
  });
  
  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Strategic Recommendations" 
        subtitle="Actionable insights to enhance your healthcare strategy"
      />
      
      <div className="space-y-6">
        <KeyPriorities 
          recommendations={recommendations} 
          successMetrics={successMetrics} 
        />
      </div>
    </div>
  );
};

export default StrategicRecommendationsSection;
