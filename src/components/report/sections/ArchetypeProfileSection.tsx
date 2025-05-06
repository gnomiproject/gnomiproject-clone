
import React, { memo } from 'react';
import { ArchetypeDetailedData, DistinctiveMetric } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Section } from '@/components/shared/Section';
import GnomePlaceholder from './introduction/GnomePlaceholder';
import ArchetypeIdentityCard from './archetype-profile/ArchetypeIdentityCard';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';
import ProfileNavigation from './archetype-profile/ProfileNavigation';
import DistinctiveMetrics from './archetype-profile/DistinctiveMetrics';
import { Card } from '@/components/ui/card';

export interface ArchetypeProfileSectionProps {
  archetypeData: ArchetypeDetailedData;
}

// The main component logic
const ArchetypeProfileSectionBase: React.FC<ArchetypeProfileSectionProps> = ({ archetypeData }) => {
  // Console log for debugging render cycles
  console.log('[ArchetypeProfileSection] Rendering with data:', {
    name: archetypeData?.name || archetypeData?.archetype_name || 'Unknown',
    hasTopMetrics: !!archetypeData?.top_distinctive_metrics,
    topMetricsType: archetypeData?.top_distinctive_metrics ? typeof archetypeData.top_distinctive_metrics : 'undefined',
    topMetricsPreview: archetypeData?.top_distinctive_metrics 
      ? JSON.stringify(archetypeData.top_distinctive_metrics).substring(0, 100) + '...' 
      : 'None'
  });
  
  if (!archetypeData) {
    return (
      <Section id="archetype-profile">
        <SectionTitle title="Archetype Profile" />
        <Card className="p-6">
          <p>No archetype data available.</p>
        </Card>
      </Section>
    );
  }

  // Extract the archetype ID to create the badge (e.g., "B2" from "B2_Steady_Returns")
  const archetypeId = archetypeData.id || archetypeData.archetype_id || '';
  const archetypeBadge = archetypeId.includes('_') ? archetypeId.split('_')[0] : archetypeId;
  
  // Parse top distinctive metrics if available
  const parseTopDistinctiveMetrics = (): DistinctiveMetric[] => {
    if (!archetypeData.top_distinctive_metrics) return [];
    
    try {
      if (typeof archetypeData.top_distinctive_metrics === 'string') {
        return JSON.parse(archetypeData.top_distinctive_metrics);
      } else {
        return archetypeData.top_distinctive_metrics as DistinctiveMetric[];
      }
    } catch (error) {
      console.error('Error parsing top_distinctive_metrics:', error);
      return [];
    }
  };
  
  const topMetrics = parseTopDistinctiveMetrics();
  console.log('[ArchetypeProfileSection] Parsed top metrics:', topMetrics);

  return (
    <Section id="archetype-profile">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-2/3">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Detailed insights into the characteristics and behaviors that define your organization's archetype."
          />
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="h-24 w-24">
            <GnomePlaceholder type="magnifying" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Archetype Identity Card */}
        <ArchetypeIdentityCard 
          archetype={archetypeData} 
          archetypeBadge={archetypeBadge}
        />
        
        {/* Key Characteristics - Moved above Key Distinctive Metrics */}
        {archetypeData.key_characteristics && (
          <KeyCharacteristicsList 
            characteristics={archetypeData.key_characteristics} 
            archetypeColor={archetypeData.hexColor || '#6E59A5'}
          />
        )}
        
        {/* Top Distinctive Metrics - Using our improved component */}
        {topMetrics.length > 0 && (
          <DistinctiveMetrics 
            metrics={topMetrics} 
            archetypeId={archetypeId}
          />
        )}
        
        {/* Industry Composition */}
        <IndustryComposition industries={archetypeData.industries || ''} />
        
        {/* Navigation - no longer passing props since component now returns null */}
        <ProfileNavigation />
      </div>
    </Section>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const ArchetypeProfileSection = memo(ArchetypeProfileSectionBase);

export default ArchetypeProfileSection;
