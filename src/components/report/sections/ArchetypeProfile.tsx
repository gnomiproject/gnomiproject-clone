
import React, { memo } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card } from '@/components/ui/card';
import ExecutiveSummaryCard from './archetype-profile/ExecutiveSummaryCard';
import KeyFindingsSection from './archetype-profile/KeyFindingsSection';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';
import EnhancedDistinctiveMetrics from './archetype-profile/EnhancedDistinctiveMetrics';
import StrategicOpportunitiesPreview from './archetype-profile/StrategicOpportunitiesPreview';

export interface ArchetypeProfileProps {
  archetypeData?: ArchetypeDetailedData;
  reportData?: ArchetypeDetailedData;
}

const ArchetypeProfileBase: React.FC<ArchetypeProfileProps> = ({ archetypeData, reportData }) => {
  // Use archetypeData as primary, fall back to reportData
  const data = archetypeData || reportData;

  console.log('[ArchetypeProfile] Rendering enhanced version with data:', {
    hasData: !!data,
    name: data?.name || data?.archetype_name || 'Unknown',
    hasExecutiveSummary: !!data?.executive_summary,
    hasKeyFindings: !!data?.key_findings,
    hasDistinctiveMetrics: !!data?.distinctive_metrics,
    hasStrategicRecommendations: !!data?.strategic_recommendations
  });

  if (!data) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Archetype Profile" />
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p>No archetype data available.</p>
        </div>
      </div>
    );
  }

  const displayName = data.name || data.archetype_name || 'Unknown Archetype';
  const archetypeColor = data.hexColor || data.hex_color || '#6E59A5';
  const archetypeId = data.id || data.archetype_id || '';
  const archetypeBadge = archetypeId.includes('_') ? archetypeId.split('_')[0] : archetypeId;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Comprehensive analysis of your archetype's characteristics and strategic insights."
          />
        </div>
      </div>
      
      {/* Main Identity Card */}
      <Card className="overflow-hidden">
        <div 
          className="h-3"
          style={{ background: archetypeColor }}
        />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold">{displayName}</h3>
            {archetypeBadge && (
              <div 
                className="px-2 py-1 rounded-md text-white text-sm font-bold"
                style={{ backgroundColor: archetypeColor }}
              >
                {archetypeBadge}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium mb-2">Description</h4>
              <p className="text-gray-600">{data.long_description || 'No detailed description available.'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Executive Summary */}
      <ExecutiveSummaryCard
        executiveSummary={data.executive_summary}
        archetypeName={displayName}
        archetypeColor={archetypeColor}
      />

      {/* Key Findings */}
      <KeyFindingsSection
        keyFindings={data.key_findings}
        archetypeColor={archetypeColor}
      />

      {/* Enhanced Distinctive Metrics */}
      <EnhancedDistinctiveMetrics
        distinctiveMetrics={data.distinctive_metrics}
        topDistinctiveMetrics={data.top_distinctive_metrics}
        archetypeId={archetypeId}
        archetypeColor={archetypeColor}
      />

      {/* Key Characteristics */}
      {data.key_characteristics && (
        <div>
          <h4 className="text-lg font-medium mb-4">Key Characteristics</h4>
          <KeyCharacteristicsList 
            characteristics={data.key_characteristics} 
            archetypeColor={archetypeColor} 
          />
        </div>
      )}

      {/* Strategic Opportunities Preview */}
      <StrategicOpportunitiesPreview
        strategicRecommendations={data.strategic_recommendations}
        archetypeColor={archetypeColor}
      />

      {/* Common Industries */}
      <div>
        <h4 className="text-lg font-medium mb-4">Common Industries</h4>
        <IndustryComposition industries={data.industries || ''} />
      </div>
    </div>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
const ArchetypeProfile = memo(ArchetypeProfileBase);

export default ArchetypeProfile;
