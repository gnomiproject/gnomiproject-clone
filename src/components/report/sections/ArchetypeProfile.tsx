
import React, { memo } from 'react';
import { ArchetypeDetailedData, DistinctiveMetric } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import GnomePlaceholder from './introduction/GnomePlaceholder';
import { Card } from '@/components/ui/card';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';

export interface ArchetypeProfileProps {
  archetypeData?: ArchetypeDetailedData;
  reportData?: ArchetypeDetailedData;  // Added for backward compatibility
}

// Base component implementation
const ArchetypeProfileBase: React.FC<ArchetypeProfileProps> = ({ archetypeData, reportData }) => {
  // Use archetypeData as primary, fall back to reportData
  const data = archetypeData || reportData;

  // Add debugging
  console.log('[ArchetypeProfile] Rendering with data:', {
    hasData: !!data,
    name: data?.name || data?.archetype_name || 'Unknown',
    hasDescription: !!data?.long_description,
    hasCharacteristics: !!data?.key_characteristics,
    hasTopMetrics: !!data?.top_distinctive_metrics
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
  const archetypeColor = data.hexColor || '#6E59A5';
  
  // Extract the archetype ID to create the badge (e.g., "B2" from "B2_Steady_Returns")
  const archetypeId = data.id || data.archetype_id || '';
  const archetypeBadge = archetypeId.includes('_') ? archetypeId.split('_')[0] : archetypeId;
  
  // Parse top distinctive metrics if available
  const parseTopDistinctiveMetrics = (): DistinctiveMetric[] => {
    if (!data.top_distinctive_metrics) return [];
    
    try {
      if (typeof data.top_distinctive_metrics === 'string') {
        return JSON.parse(data.top_distinctive_metrics);
      } else {
        return data.top_distinctive_metrics as DistinctiveMetric[];
      }
    } catch (error) {
      console.error('Error parsing top_distinctive_metrics:', error);
      return [];
    }
  };
  
  const topMetrics = parseTopDistinctiveMetrics();
  console.log('[ArchetypeProfile] Parsed top metrics:', topMetrics);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-2/3">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Understanding the characteristics and behaviors of your organization's archetype."
          />
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="h-48 w-48">
            <GnomePlaceholder type="magnifying" />
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div 
          className="h-3"
          style={{ background: archetypeColor }}
        />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
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
            {/* Description */}
            <div>
              <h4 className="text-lg font-medium mb-2">Description</h4>
              <p className="text-gray-600">{data.long_description || 'No detailed description available.'}</p>
            </div>
            
            {/* Top Distinctive Metrics - Replacing Archetype Overview */}
            {topMetrics.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-2">Key Distinctive Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{metric.metric}</h5>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{metric.category}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Value: {metric.archetype_value.toLocaleString()}</span>
                        <span className="text-gray-500">Avg: {metric.archetype_average.toLocaleString()}</span>
                      </div>
                      <div className={`text-sm font-medium ${metric.difference > 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {metric.difference > 0 ? '+' : ''}{metric.difference.toFixed(1)}% {metric.significance && `(${metric.significance})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Key Characteristics */}
            <div>
              <h4 className="text-lg font-medium mb-2">Key Characteristics</h4>
              {data.key_characteristics ? (
                <KeyCharacteristicsList 
                  characteristics={data.key_characteristics} 
                  archetypeColor={archetypeColor} 
                />
              ) : (
                <p className="text-gray-600">No key characteristics available.</p>
              )}
            </div>
            
            {/* Common Industries */}
            <div>
              <h4 className="text-lg font-medium mb-2">Common Industries</h4>
              <IndustryComposition industries={data.industries || ''} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
const ArchetypeProfile = memo(ArchetypeProfileBase);

export default ArchetypeProfile;
