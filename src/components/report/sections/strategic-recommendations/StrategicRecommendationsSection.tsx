
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import KeyPriorities from './KeyPriorities';
import ImplementationRoadmap from './ImplementationRoadmap';
import ExpectedImpact from './ExpectedImpact';
import SuccessMetrics from './SuccessMetrics';
import GnomeImage from '@/components/common/GnomeImage';
import { ensureArray } from '@/utils/ensureArray';

interface StrategicRecommendationsSectionProps {
  reportData?: any;
  averageData?: any;
}

const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({ 
  reportData, 
  averageData 
}) => {
  // Extract strategic recommendations and ensure it's an array
  const recommendations = reportData?.strategic_recommendations 
    ? ensureArray(reportData.strategic_recommendations) 
    : [];

  // Log for debugging
  console.log('[StrategicRecommendationsSection] Data:', {
    hasData: !!reportData,
    recCount: recommendations.length,
    recommendations
  });

  return (
    <Section id="strategic-recommendations">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-3/4">
            <SectionTitle 
              title="Strategic Recommendations" 
              subtitle="Targeted strategies to optimize your healthcare benefits and improve outcomes"
            />
            <p className="text-gray-600 mt-4">
              Based on comprehensive analysis of your population health data, we've identified 
              key strategic opportunities that can help improve health outcomes, enhance member 
              experience, and optimize healthcare spending.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center">
            <GnomeImage type="chart" showDebug={false} />
          </div>
        </div>

        {/* Key Priorities Section */}
        <KeyPriorities recommendations={recommendations} />
        
        {/* Implementation Roadmap */}
        <ImplementationRoadmap recommendations={recommendations} />
        
        {/* Expected Impact */}
        <ExpectedImpact reportData={reportData} />
        
        {/* Success Metrics */}
        <SuccessMetrics reportData={reportData} />
      </div>
    </Section>
  );
};

export default StrategicRecommendationsSection;
