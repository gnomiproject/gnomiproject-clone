
import React from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import Recommendations from '../Recommendations';
import { ArchetypeDetailedData } from '@/types/archetype';

interface StrategicRecommendationsSectionProps {
  reportData: ArchetypeDetailedData;
  averageData?: any;
}

const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({
  reportData,
  averageData
}) => {
  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Strategic Recommendations" 
        subtitle="Actionable insights to enhance your healthcare strategy"
      />
      
      <div className="space-y-6">
        <Recommendations archetypeData={reportData} />
      </div>
    </div>
  );
};

export default StrategicRecommendationsSection;
