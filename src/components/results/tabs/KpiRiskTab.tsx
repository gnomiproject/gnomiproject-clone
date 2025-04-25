
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import { BarChart, Users, Activity, AlertTriangle } from 'lucide-react';

interface KpiRiskTabProps {
  archetype: ArchetypeDetailedData;
}

// Define a fallback risk profile for when it doesn't exist in the data
const defaultRiskProfile = {
  score: 'N/A',
  comparison: 'No risk comparison data available',
  conditions: [
    { name: 'No Data', value: '0%', barWidth: '0%' }
  ]
};

const KpiRiskTab = ({ archetype }: KpiRiskTabProps) => {
  // Using fallback values when properties don't exist
  const archetypeColor = archetype.color || archetype.hexColor || '#9b87f5';
  const riskProfile = archetype.enhanced?.riskProfile || defaultRiskProfile;
  
  return (
    <div className="space-y-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards - Statistics Overview */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Risk Score</h3>
                <p className="text-sm text-gray-500 mb-4">Overall health risk assessment</p>
                <div className="text-3xl font-bold text-blue-700">{riskProfile.score || 'N/A'}</div>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Cost Prediction</h3>
                <p className="text-sm text-gray-500 mb-4">Projected healthcare spend</p>
                <div className="text-3xl font-bold text-green-700">$9,850<span className="text-sm font-normal ml-1">PMPY</span></div>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">High-Risk Members</h3>
                <p className="text-sm text-gray-500 mb-4">Population requiring attention</p>
                <div className="text-3xl font-bold text-purple-700">14%<span className="text-sm font-normal ml-1">of population</span></div>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-xl font-bold">Risk Assessment</h3>
          </div>
          
          <p className="text-gray-600 mb-8">
            {riskProfile.comparison || 'No risk comparison data available for this archetype.'}
          </p>
          
          <h4 className="font-semibold mb-6 text-gray-700">Top Risk Conditions</h4>
          <div className="space-y-6">
            {riskProfile.conditions?.map((condition, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{condition.name}</span>
                  <span className={`${condition.value.startsWith('+') ? 'text-orange-600' : 'text-green-600'} font-medium`}>
                    {condition.value}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`${condition.value.startsWith('+') ? 'bg-orange-500' : 'bg-green-500'} h-2 rounded-full`}
                    style={{ width: condition.barWidth }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiRiskTab;
