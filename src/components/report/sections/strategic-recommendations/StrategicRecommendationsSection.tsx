
import React, { useMemo } from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import KeyPriorities from './KeyPriorities';
import SuccessMetrics from './SuccessMetrics';
import { memoizedEnsureArray } from '@/utils/ensureArray';
import { useRenderPerformance } from '@/components/shared/PerformanceMonitor';

interface StrategicRecommendationsSectionProps {
  reportData?: any;
  averageData?: any;
}

const StrategicRecommendationsSection: React.FC<StrategicRecommendationsSectionProps> = ({ 
  reportData, 
  averageData 
}) => {
  // Monitor performance
  useRenderPerformance('StrategicRecommendationsSection');
  
  // Memoize recommendations processing to avoid expensive operations on re-renders
  const recommendations = useMemo(() => {
    // Log what we're working with
    console.log('[StrategicRecommendationsSection] Processing strategic_recommendations:', reportData?.strategic_recommendations);
    
    // Extract strategic recommendations using the memoized function for better performance
    const recs = reportData?.strategic_recommendations 
      ? memoizedEnsureArray(reportData.strategic_recommendations, 'strategic_recommendations') 
      : [];
    
    // Add debug logging to see what's being processed
    console.log('[StrategicRecommendationsSection] Processed recommendations:', {
      count: recs.length,
      processedData: recs
    });
    
    return recs;
  }, [reportData?.strategic_recommendations]);

  return (
    <Section id="strategic-recommendations">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full">
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
        </div>

        {/* Key Priorities Section - Now showing all recommendations */}
        <KeyPriorities recommendations={recommendations} />
        
        {/* Success Metrics */}
        <SuccessMetrics reportData={reportData} />
      </div>
    </Section>
  );
};

export default React.memo(StrategicRecommendationsSection);
