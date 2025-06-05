
import React, { memo } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Section } from '@/components/shared/Section';
import ArchetypeIdentityCard from './archetype-profile/ArchetypeIdentityCard';
import ExecutiveSummaryCard from './archetype-profile/ExecutiveSummaryCard';
import KeyFindingsSection from './archetype-profile/KeyFindingsSection';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';
import EnhancedDistinctiveMetrics from './archetype-profile/EnhancedDistinctiveMetrics';
import StrategicOpportunitiesPreview from './archetype-profile/StrategicOpportunitiesPreview';
import ProfileNavigation from './archetype-profile/ProfileNavigation';
import { Card } from '@/components/ui/card';

export interface ArchetypeProfileSectionProps {
  archetypeData: ArchetypeDetailedData;
}

const ArchetypeProfileSectionBase: React.FC<ArchetypeProfileSectionProps> = ({ archetypeData }) => {
  console.log('[ArchetypeProfileSection] Rendering with enhanced data:', {
    name: archetypeData?.name || archetypeData?.archetype_name || 'Unknown',
    hasExecutiveSummary: !!(archetypeData?.executive_summary),
    hasKeyFindings: !!(archetypeData?.key_findings || archetypeData?.keyFindings),
    hasDistinctiveMetrics: !!(archetypeData?.distinctive_metrics),
    hasTopMetrics: !!(archetypeData?.top_distinctive_metrics),
    hasStrategicRecommendations: !!(archetypeData?.strategic_recommendations),
    dataPreview: {
      executiveSummary: archetypeData?.executive_summary ? 'Present' : 'Missing',
      keyFindings: (archetypeData?.key_findings || archetypeData?.keyFindings) ? `${Array.isArray(archetypeData.key_findings || archetypeData.keyFindings) ? (archetypeData.key_findings || archetypeData.keyFindings).length : 'Unknown'} findings` : 'Missing',
      distinctiveMetrics: archetypeData?.distinctive_metrics ? `${Array.isArray(archetypeData.distinctive_metrics) ? archetypeData.distinctive_metrics.length : 'Unknown'} metrics` : 'Missing'
    }
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
  const archetypeName = archetypeData.name || archetypeData.archetype_name || 'Unknown Archetype';

  // Helper function to safely convert distinctive_metrics
  const getDistinctiveMetrics = () => {
    if (!archetypeData.distinctive_metrics) return [];
    if (Array.isArray(archetypeData.distinctive_metrics)) return archetypeData.distinctive_metrics;
    if (typeof archetypeData.distinctive_metrics === 'string') {
      try {
        return JSON.parse(archetypeData.distinctive_metrics);
      } catch {
        return [];
      }
    }
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

  return (
    <Section id="archetype-profile">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Comprehensive analysis of your organization's healthcare archetype characteristics, patterns, and strategic opportunities."
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Archetype Identity Card */}
        <ArchetypeIdentityCard 
          archetype={archetypeData} 
          archetypeBadge={archetypeBadge}
        />
        
        {/* Executive Summary - New enhanced component */}
        <ExecutiveSummaryCard
          executiveSummary={archetypeData.executive_summary}
          archetypeName={archetypeName}
          archetypeColor={archetypeColor}
        />
        
        {/* Key Findings - New component */}
        <KeyFindingsSection
          keyFindings={getKeyFindings()}
          archetypeColor={archetypeColor}
        />
        
        {/* Enhanced Distinctive Metrics - Replaces the old component */}
        <EnhancedDistinctiveMetrics
          distinctiveMetrics={getDistinctiveMetrics()}
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
        
        {/* Strategic Opportunities Preview - New component */}
        <StrategicOpportunitiesPreview
          strategicRecommendations={archetypeData.strategic_recommendations}
          archetypeColor={archetypeColor}
        />
        
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
