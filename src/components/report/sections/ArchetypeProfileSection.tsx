
import React, { memo } from 'react';
import { ArchetypeDetailedData, DistinctiveMetric } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Section } from '@/components/shared/Section';
import GnomePlaceholder from './introduction/GnomePlaceholder';
import ArchetypeIdentityCard from './archetype-profile/ArchetypeIdentityCard';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';
import DistinctiveMetrics from './archetype-profile/DistinctiveMetrics';
import ProfileNavigation from './archetype-profile/ProfileNavigation';
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
        
        {/* Top Distinctive Metrics - Replacing Archetype Overview */}
        {topMetrics.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Key Distinctive Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topMetrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{metric.category}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Archetype value</span>
                    <span className="font-semibold">{metric.archetype_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Average</span>
                    <span>{metric.archetype_average.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`text-sm font-medium ${metric.difference > 0 ? 'text-blue-600' : 'text-amber-600'}`}
                    >
                      {metric.difference > 0 ? '+' : ''}{metric.difference.toFixed(1)}%
                    </div>
                    {metric.significance && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {metric.significance}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Key Characteristics */}
        {archetypeData.key_characteristics && (
          <KeyCharacteristicsList 
            characteristics={archetypeData.key_characteristics} 
            archetypeColor={archetypeData.hexColor || '#6E59A5'}
          />
        )}
        
        {/* Industry Composition */}
        <IndustryComposition industries={archetypeData.industries || ''} />
        
        {/* Distinctive Metrics */}
        <DistinctiveMetrics 
          metrics={archetypeData.distinctive_metrics || []} 
          archetypeId={archetypeData.id || archetypeData.archetype_id || ''}
        />
        
        {/* Navigation */}
        <ProfileNavigation onNavigate={id => console.log(`Navigation to ${id} will be handled by parent`)} />
      </div>
    </Section>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const ArchetypeProfileSection = memo(ArchetypeProfileSectionBase);

export default ArchetypeProfileSection;
