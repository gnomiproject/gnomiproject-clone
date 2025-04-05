
import React from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChartBar, FileText, StarHalf, Award } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import Button from '@/components/shared/Button';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
}

const ArchetypeReport = ({ archetypeId }: ArchetypeReportProps) => {
  const { getArchetypeEnhanced, getFamilyById, getTraitsForArchetype, getMetricsForArchetype } = useArchetypes();
  
  const archetype = getArchetypeEnhanced(archetypeId);
  const family = archetype ? getFamilyById(archetype.familyId) : undefined;
  const traits = getTraitsForArchetype(archetypeId);
  const metrics = getMetricsForArchetype(archetypeId);
  
  if (!archetype) return <div>Archetype not found</div>;
  
  const colorMap = {
    orange: 'orange',
    teal: 'teal',
    yellow: 'yellow',
    blue: 'blue',
    purple: 'purple',
    green: 'green',
    red: 'red',
    indigo: 'indigo',
    pink: 'pink'
  };
  
  const color = colorMap[archetype.color] || 'blue';
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
      <div className={`h-2 bg-${color}-500`}></div>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`bg-${color}-100 text-${color}-700 hover:bg-${color}-200`}>
                {archetype.familyName}
              </Badge>
              <Badge variant="outline">{archetype.id}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{archetype.name}</h1>
          </div>
        </div>
        
        <p className="text-lg text-gray-700 mb-8">
          {archetype.standard.fullDescription}
        </p>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="priorities" className="data-[state=active]:bg-white">
              <Award className="w-4 h-4 mr-2" />
              Strategic Priorities
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-white">
              <ChartBar className="w-4 h-4 mr-2" />
              Key Metrics & Traits
            </TabsTrigger>
            <TabsTrigger value="swot" className="data-[state=active]:bg-white">
              <StarHalf className="w-4 h-4 mr-2" />
              SWOT Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className={`w-24 h-24 rounded-full bg-${color}-100 flex items-center justify-center mb-4`}>
                  <span className={`text-3xl font-bold text-${color}-600`}>{archetype.id}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">About {archetype.name}</h3>
                <p className="text-gray-700">{archetype.standard.overview}</p>
                
                <div className="mt-6">
                  <h4 className="font-bold mb-3">Family Background</h4>
                  <p className="text-gray-700">{family?.description || 'No family information available'}</p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Key Characteristics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {archetype.standard.keyCharacteristics.map((characteristic, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
                      <div className={`h-2 w-2 rounded-full bg-${color}-500`}></div>
                      <span>{characteristic}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mb-4">Key Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(archetype.standard.keyStatistics).map(([key, stat]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-600 mb-1">
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
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Strategic Priorities Tab */}
          <TabsContent value="priorities" className="mt-6">
            <h3 className="text-xl font-bold mb-6">Strategic Priorities for {archetype.name}</h3>
            <div className="space-y-6">
              {archetype.enhanced?.strategicPriorities?.map((priority, index) => (
                <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`bg-${color}-100 rounded-lg p-4 flex-shrink-0`}>
                      <span className={`text-${color}-600 text-xl font-bold`}>{priority.number}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{priority.title}</h4>
                      <p className="text-gray-700">{priority.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Cost Saving Opportunities</h3>
              {archetype.enhanced?.costSavings?.map((saving, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-bold mb-2">{saving.title}</h4>
                  <p className="text-gray-700">{saving.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Metrics & Traits Tab */}
          <TabsContent value="metrics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Risk Profile</h3>
                <div className="bg-white border rounded-lg p-6 mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold">Risk Score</h4>
                    <span className={`text-${color}-600 text-lg font-bold`}>{archetype.enhanced?.riskProfile.score}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{archetype.enhanced?.riskProfile.comparison}</p>
                  
                  <h5 className="font-bold mb-3">Top Conditions</h5>
                  <div className="space-y-4">
                    {archetype.enhanced?.riskProfile.conditions.map((condition, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{condition.name}</span>
                          <span className={condition.value.startsWith('+') ? 'text-orange-600' : 'text-green-600'}>
                            {condition.value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${condition.value.startsWith('+') ? `bg-orange-500` : `bg-green-500`}`}
                            style={{ width: condition.barWidth }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Distinctive Traits</h3>
                {traits && (
                  <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="font-bold mb-3">Disease Patterns</h4>
                      <div className="space-y-2">
                        {traits.diseasePatterns.map((pattern, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{pattern.condition}</span>
                            <span className={pattern.variance > 0 ? 'text-orange-600' : 'text-green-600'}>
                              {pattern.variance > 0 ? `+${pattern.variance}%` : `${pattern.variance}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="font-bold mb-3">Utilization Patterns</h4>
                      <div className="space-y-2">
                        {traits.utilizationPatterns.map((pattern, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{pattern.category}</span>
                            <span className={pattern.variance > 0 ? 'text-orange-600' : 'text-green-600'}>
                              {pattern.variance > 0 ? `+${pattern.variance}%` : `${pattern.variance}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {!traits && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p>No distinctive traits data available for this archetype.</p>
                  </div>
                )}
              </div>
            </div>
            
            {traits && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Unique Insights</h3>
                <ul className="space-y-2">
                  {traits.uniqueInsights.map((insight, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full bg-${color}-500 flex-shrink-0`}></div>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          
          {/* SWOT Analysis Tab */}
          <TabsContent value="swot" className="mt-6">
            <h3 className="text-xl font-bold mb-6">SWOT Analysis for {archetype.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-700 mb-4">Strengths</h4>
                <ul className="space-y-2">
                  {archetype.enhanced?.swot.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-red-700 mb-4">Weaknesses</h4>
                <ul className="space-y-2">
                  {archetype.enhanced?.swot.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-blue-700 mb-4">Opportunities</h4>
                <ul className="space-y-2">
                  {archetype.enhanced?.swot.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-amber-700 mb-4">Threats</h4>
                <ul className="space-y-2">
                  {archetype.enhanced?.swot.threats.map((threat, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span>{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-gray-50 p-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-1">Want an even deeper analysis?</h3>
            <p className="text-gray-600">Get a customized report tailored to your specific organization.</p>
          </div>
          <Button className={`bg-${color}-500 hover:bg-${color}-600`}>Request Custom Analysis</Button>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeReport;
