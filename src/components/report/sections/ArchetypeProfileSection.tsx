
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
    hasExecutiveSummary: !!archetypeData?.executive_summary,
    hasKeyFindings: !!archetypeData?.key_findings,
    hasDistinctiveMetrics: !!archetypeData?.distinctive_metrics,
    hasTopMetrics: !!archetypeData?.top_distinctive_metrics,
    hasStrategicRecommendations: !!archetypeData?.strategic_recommendations,
    dataPreview: {
      executiveSummary: archetypeData?.executive_summary ? 'Present' : 'Missing',
      keyFindings: archetypeData?.key_findings ? `${Array.isArray(archetypeData.key_findings) ? archetypeData.key_findings.length : 'Unknown'} findings` : 'Missing',
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
          keyFindings={archetypeData.key_findings}
          archetypeColor={archetypeColor}
        />
        
        {/* Enhanced Distinctive Metrics - Replaces the old component */}
        <EnhancedDistinctiveMetrics
          distinctiveMetrics={archetypeData.distinctive_metrics}
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
