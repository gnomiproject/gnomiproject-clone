
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface KpiRiskTabProps {
  archetypeData: ArchetypeDetailedData;
}

const KpiRiskTab = ({ archetypeData }: KpiRiskTabProps) => {
  const color = `archetype-${archetypeData.id}`;
  
  // Safely access key statistics or provide defaults
  const keyStatistics = archetypeData.standard?.keyStatistics || {};
  
  // Helper function to determine trend class
  const getTrendClass = (trend?: 'up' | 'down' | 'neutral') => {
    if (!trend) return '';
    
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  // Helper function to get trend icon
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'neutral':
        return '→';
      default:
        return null;
    }
  };
  
  // Get risk profile data safely
  const riskProfile = archetypeData.enhanced?.riskProfile;
  
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-2xl font-bold mb-6 text-left">Key Performance Indicators</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(keyStatistics).map(([key, data], index) => {
              // Safely access data properties with type checking
              const statData = data as { value?: string; trend?: 'up' | 'down' | 'neutral' } | undefined;
              
              return (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <h5 className="text-sm text-gray-600 mb-1 capitalize text-left">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {statData?.value || 'N/A'}
                    </span>
                    {statData?.trend && (
                      <span className={`${getTrendClass(statData.trend)} text-sm`}>
                        {getTrendIcon(statData.trend)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-2xl font-bold mb-6 text-left">Risk Profile</h4>
          {riskProfile ? (
            <div className="bg-white border rounded-lg p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Risk Score</h5>
                  <span className="text-xl font-bold">{riskProfile.score}</span>
                </div>
                <p className="text-sm text-gray-600 text-left">{riskProfile.comparison}</p>
              </div>
              
              {riskProfile.conditions && riskProfile.conditions.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-medium mb-3 text-left">Key Condition Variances</h5>
                  <div className="space-y-4">
                    {riskProfile.conditions.map((condition, index) => (
                      <div key={index} className="text-left">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{condition.name}</span>
                          <span className={condition.value.includes('-') ? 'text-green-600' : 'text-red-600'}>
                            {condition.value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${condition.value.includes('-') ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                            style={{ width: condition.barWidth }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 border rounded-lg p-6 text-center">
              <p className="text-gray-500">No risk profile data available for this archetype.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiRiskTab;
