
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface KpiRiskTabProps {
  archetypeData: ArchetypeDetailedData;
}

const KpiRiskTab = ({ archetypeData }: KpiRiskTabProps) => {
  const color = `archetype-${archetypeData.id}`;

  // Safely access statistics with proper type checking
  const keyStatistics = archetypeData.standard?.keyStatistics || {};

  return (
    <div className="py-6">
      <div className="space-y-6">
        <h4 className="text-2xl font-bold mb-4 text-left">Key Performance Indicators</h4>
        <p className="mb-6 text-left">KPIs specific to {archetypeData.name} organizations:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(keyStatistics).map(([key, stat]) => {
            if (!stat) return null; // Skip if stat doesn't exist
            
            return (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-600 mb-1 text-left">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <div className="flex items-center">
                  <span className={`text-2xl font-bold ${stat.trend === 'up' ? 'text-orange-600' : stat.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                    {stat.value}
                  </span>
                  <span className={`ml-2 ${stat.trend === 'up' ? 'text-orange-600' : stat.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '–'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <h4 className="text-2xl font-bold mb-4 mt-8 text-left">Risk Assessment</h4>
        <p className="mb-6 text-left">The risk profile for {archetypeData.name} organizations:</p>
        
        <div className="bg-white border rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className={`h-24 w-24 md:h-32 md:w-32 rounded-full bg-${color}/10 flex items-center justify-center flex-shrink-0`}>
              <span className={`text-3xl md:text-4xl font-bold text-${color}`}>{archetypeData.enhanced?.riskProfile?.score || 'N/A'}</span>
            </div>
            <div className="text-left">
              <h5 className="text-xl font-bold mb-2">Risk Score</h5>
              <p className="text-gray-700">{archetypeData.enhanced?.riskProfile?.comparison || 'No risk data available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiRiskTab;
