
import React, { memo } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Section } from '@/components/shared/Section';
import ArchetypeIdentityCard from './archetype-profile/ArchetypeIdentityCard';
import KeyFindingsSection from './archetype-profile/KeyFindingsSection';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';
import EnhancedDistinctiveMetrics from './archetype-profile/EnhancedDistinctiveMetrics';
import ProfileNavigation from './archetype-profile/ProfileNavigation';
import { Card } from '@/components/ui/card';

export interface ArchetypeProfileSectionProps {
  archetypeData: ArchetypeDetailedData;
}

const ArchetypeProfileSectionBase: React.FC<ArchetypeProfileSectionProps> = ({ archetypeData }) => {
  console.log('[ArchetypeProfileSection] Rendering with data:', {
    name: archetypeData?.name || archetypeData?.archetype_name || 'Unknown',
    hasKeyFindings: !!(archetypeData?.key_findings || archetypeData?.keyFindings),
    hasDistinctiveMetrics: !!(archetypeData?.distinctive_metrics),
    hasTopMetrics: !!(archetypeData?.top_distinctive_metrics),
    hasKeyCharacteristics: !!(archetypeData?.key_characteristics),
    distinctiveMetricsRaw: archetypeData?.distinctive_metrics,
    topMetricsRaw: archetypeData?.top_distinctive_metrics
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

  // Extract the archetype ID and color
  const archetypeId = archetypeData.id || archetypeData.archetype_id || '';
  const archetypeBadge = archetypeId.includes('_') ? archetypeId.split('_')[0] : archetypeId;
  const archetypeColor = archetypeData.hexColor || archetypeData.hex_color || '#6E59A5';

  // Simplified function to safely convert distinctive_metrics
  const getDistinctiveMetrics = () => {
    console.log('[ArchetypeProfileSection] Processing distinctive_metrics:', {
      raw: archetypeData.distinctive_metrics,
      type: typeof archetypeData.distinctive_metrics,
      isArray: Array.isArray(archetypeData.distinctive_metrics)
    });

    if (!archetypeData.distinctive_metrics) {
      console.log('[ArchetypeProfileSection] No distinctive_metrics found');
      return [];
    }
    
    if (Array.isArray(archetypeData.distinctive_metrics)) {
      console.log('[ArchetypeProfileSection] distinctive_metrics is already an array');
      return archetypeData.distinctive_metrics;
    }
    
    if (typeof archetypeData.distinctive_metrics === 'string') {
      try {
        const parsed = JSON.parse(archetypeData.distinctive_metrics);
        console.log('[ArchetypeProfileSection] Parsed distinctive_metrics from string');
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('[ArchetypeProfileSection] Error parsing distinctive_metrics string:', error);
        return [];
      }
    }
    
    console.log('[ArchetypeProfileSection] distinctive_metrics is unknown type, returning empty array');
    return [];
  };

  // Helper function to get key findings
  const getKeyFindings = () => {
    const findings = archetypeData.key_findings || archetypeData.keyFindings;
    if (!findings) return [];
    if (Array.isArray(findings)) return findings;
    if (typeof findings === 'string') {
      try {
        return JSON.parse(findings);
      } catch {
        return [];
      }
    }
    return [];
  };

  const processedDistinctiveMetrics = getDistinctiveMetrics();
  console.log('[ArchetypeProfileSection] Final processed distinctive metrics:', processedDistinctiveMetrics);

  return (
    <Section id="archetype-profile">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Understanding the characteristics and patterns that define your healthcare archetype."
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Archetype Identity Card */}
        <ArchetypeIdentityCard 
          archetype={archetypeData} 
          archetypeBadge={archetypeBadge}
        />
        
        {/* Key Findings */}
        <KeyFindingsSection
          keyFindings={getKeyFindings()}
          archetypeColor={archetypeColor}
        />
        
        {/* Enhanced Distinctive Metrics - Pass both props for maximum compatibility */}
        <EnhancedDistinctiveMetrics
          distinctiveMetrics={processedDistinctiveMetrics}
          topDistinctiveMetrics={archetypeData.top_distinctive_metrics}
          archetypeId={archetypeId}
          archetypeColor={archetypeColor}
        />
        
        {/* Key Characteristics */}
        {archetypeData.key_characteristics && (
          <KeyCharacteristicsList 
            characteristics={archetypeData.key_characteristics} 
            archetypeColor={archetypeColor}
          />
        )}
        
        {/* Industry Composition */}
        <IndustryComposition industries={archetypeData.industries || ''} />
        
        {/* Navigation */}
        <ProfileNavigation />
      </div>
    </Section>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const ArchetypeProfileSection = memo(ArchetypeProfileSectionBase);

export default ArchetypeProfileSection;
