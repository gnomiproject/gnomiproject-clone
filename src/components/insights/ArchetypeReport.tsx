
import React from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChartBar, FileText, StarHalf, Award, Building2, Rocket, Heart } from 'lucide-react';
import { gnomeImages } from '@/utils/gnomeImages';
import { getArchetypeColorHex } from '@/data/colors';
import Button from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: any;
}

const ArchetypeReport = ({ archetypeId, reportData }: ArchetypeReportProps) => {
  const { getArchetypeEnhanced, getFamilyById, getTraitsForArchetype } = useArchetypes();
  
  const archetype = getArchetypeEnhanced(archetypeId);
  const family = archetype ? getFamilyById(archetype.familyId) : undefined;
  const traits = getTraitsForArchetype(archetypeId);
  
  if (!archetype) return <div className="text-left">Archetype not found</div>;

  // Using proper archetype-specific color classes
  const archetypeColor = `archetype-${archetype.id}`;
  const familyColor = `family-${archetype.familyId}`;
  
  // Choose a gnome image based on archetype
  const gnomeImage = archetypeId.startsWith('a') 
    ? gnomeImages.presentation 
    : archetypeId.startsWith('b') 
      ? gnomeImages.clipboard 
      : gnomeImages.magnifying;
  
  // Ensure we have SWOT data with fallback
  const swotData = {
    strengths: reportData?.swot_analysis?.strengths || reportData?.strengths || archetype.enhanced?.swot?.strengths || [],
    weaknesses: reportData?.swot_analysis?.weaknesses || reportData?.weaknesses || archetype.enhanced?.swot?.weaknesses || [],
    opportunities: reportData?.swot_analysis?.opportunities || reportData?.opportunities || archetype.enhanced?.swot?.opportunities || [],
    threats: reportData?.swot_analysis?.threats || reportData?.threats || archetype.enhanced?.swot?.threats || []
  };
  
  // Ensure we have strategic priorities data with fallback
  const strategicPriorities = reportData?.strategic_recommendations || 
    reportData?.strategic_recommendations || 
    archetype.enhanced?.strategicPriorities || [];
  
  // Get risk profile with fallback to default if it doesn't exist
  const riskProfile = archetype.enhanced?.riskProfile || {
    score: 'N/A',
    comparison: 'No risk comparison data available',
    conditions: [{ name: 'No Data', value: '0%', barWidth: '0%' }]
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-12 max-w-6xl mx-auto">
      {/* Top colored border using the appropriate archetype color */}
      <div className={`h-2 bg-${archetypeColor}`}></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-center">
          <div className="md:flex-grow space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`bg-${familyColor}/10 text-${familyColor} hover:bg-${familyColor}/20 border-0`}>
                {`Family ${archetype.familyId.toUpperCase()}`}
              </Badge>
              <Badge variant="outline">{archetype.id.toUpperCase()}</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{archetype.name}</h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              {reportData?.short_description || archetype.short_description || ''}
            </p>
          </div>
          
          {/* Gnome mascot image */}
          <div className="flex-shrink-0 hidden md:block">
            <img 
              src={gnomeImage}
              alt={`${archetype.name} Guide`}
              className="h-48 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/gnomes/placeholder.svg';
              }}
            />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-start md:justify-center">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="priorities" className="data-[state=active]:bg-white">
              <Rocket className="w-4 h-4 mr-2" />
              Strategic Priorities
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-white">
              <ChartBar className="w-4 h-4 mr-2" />
              Key Metrics
            </TabsTrigger>
            <TabsTrigger value="swot" className="data-[state=active]:bg-white">
              <StarHalf className="w-4 h-4 mr-2" />
              SWOT Analysis
            </TabsTrigger>
            <TabsTrigger value="industries" className="data-[state=active]:bg-white">
              <Building2 className="w-4 h-4 mr-2" />
              Industries
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className={`w-24 h-24 rounded-full bg-${archetypeColor}/10 flex items-center justify-center mb-6`}>
                  <span className={`text-3xl font-bold text-${archetypeColor}`}>{archetype.id.toUpperCase()}</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">About {archetype.name}</h3>
                    <p className="text-gray-700">
                      {reportData?.long_description || archetype.long_description || ''}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2">Family Background</h4>
                    <p className="text-gray-700">{family?.description || family?.short_description || 'No family information available'}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Key Characteristics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {(reportData?.key_characteristics || archetype.key_characteristics || []).map((characteristic: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-md bg-gray-50 text-left">
                      <div className={`h-2 w-2 rounded-full bg-${archetypeColor}`}></div>
                      <span>{characteristic}</span>
                    </div>
                  ))}
                </div>
                
                {traits && traits.uniqueInsights && traits.uniqueInsights.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Unique Insights</h3>
                    <div className={`bg-${archetypeColor}/5 rounded-lg p-5`}>
                      <ul className="space-y-3">
                        {traits.uniqueInsights.map((insight, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full bg-${archetypeColor}`}></div>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Strategic Priorities Tab */}
          <TabsContent value="priorities" className="mt-6">
            <h3 className="text-2xl font-bold mb-6">Strategic Priorities for {archetype.name}</h3>
            <div className="space-y-6">
              {(strategicPriorities).map((priority: any, index: number) => (
                <Card key={index} className="bg-white border rounded-lg p-6 shadow-sm overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className={`bg-${archetypeColor}/10 rounded-lg p-4 flex-shrink-0`}>
                      <span className={`text-${archetypeColor} text-xl font-bold`}>{priority.recommendation_number || priority.number || index+1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{priority.title}</h4>
                      <p className="text-gray-700">{priority.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
              
              {strategicPriorities.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-500">No strategic priorities available</h4>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Metrics & Traits Tab */}
          <TabsContent value="metrics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Risk Profile</h3>
                <Card className="bg-white border rounded-lg p-6 mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold">Risk Score</h4>
                    <span className={`text-${archetypeColor} text-lg font-bold`}>{riskProfile.score}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{riskProfile.comparison}</p>
                  
                  <h5 className="font-bold mb-3">Top Conditions</h5>
                  <div className="space-y-4">
                    {riskProfile.conditions.map((condition: any, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{condition.name}</span>
                          <span className={(condition.value || '').startsWith('+') ? 'text-orange-600' : 'text-green-600'}>
                            {condition.value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${(condition.value || '').startsWith('+') ? `bg-orange-500` : `bg-green-500`}`}
                            style={{ width: condition.barWidth }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Health Metrics */}
                <Card className="bg-white border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className={`h-6 w-6 text-${archetypeColor}`} />
                    <h4 className="text-lg font-bold">Health Metrics</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {traits && traits.diseasePatterns && traits.diseasePatterns.map((pattern, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{pattern.condition}</span>
                        <Badge className={cn(pattern.variance > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800')}>
                          {pattern.variance > 0 ? `+${pattern.variance}%` : `${pattern.variance}%`}
                        </Badge>
                      </div>
                    ))}
                    
                    {(!traits || !traits.diseasePatterns || traits.diseasePatterns.length === 0) && (
                      <p className="text-gray-500 italic">No health metrics available</p>
                    )}
                  </div>
                </Card>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Utilization Patterns</h3>
                <Card className="bg-white border rounded-lg p-6">
                  <h4 className="font-bold mb-4">Service Utilization</h4>
                  
                  <div className="space-y-4">
                    {traits && traits.utilizationPatterns && traits.utilizationPatterns.map((pattern, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{pattern.category}</span>
                          <span className={pattern.variance > 0 ? 'text-orange-600' : 'text-green-600'}>
                            {pattern.variance > 0 ? `+${pattern.variance}%` : `${pattern.variance}%`}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={pattern.variance > 0 ? 'bg-orange-500 h-2 rounded-full' : 'bg-green-500 h-2 rounded-full'}
                            style={{ width: `${Math.min(Math.abs(pattern.variance), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    {(!traits || !traits.utilizationPatterns || traits.utilizationPatterns.length === 0) && (
                      <p className="text-gray-500 italic">No utilization data available</p>
                    )}
                  </div>
                </Card>
                
                {/* Cost Metrics */}
                <Card className="bg-white border rounded-lg p-6">
                  <h4 className="font-bold mb-4">Cost Indicators</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reportData && [
                      { label: 'Medical & Rx PMPY', value: reportData['Cost_Medical & RX Paid Amount PMPY'] },
                      { label: 'Medical & Rx PEPY', value: reportData['Cost_Medical & RX Paid Amount PEPY'] },
                      { label: 'Medical PEPY', value: reportData['Cost_Medical Paid Amount PEPY'] },
                      { label: 'Rx PEPY', value: reportData['Cost_RX Paid Amount PEPY'] },
                      { label: 'Avoidable ER Savings', value: reportData['Cost_Avoidable ER Potential Savings PMPY'] }
                    ].map((metric, index) => metric.value ? (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-500">{metric.label}</div>
                        <div className="font-semibold">${metric.value?.toLocaleString()}</div>
                      </div>
                    ) : null)}
                  </div>
                  
                  {(!reportData || (!reportData['Cost_Medical & RX Paid Amount PMPY'] && !reportData['Cost_Medical Paid Amount PEPY'])) && (
                    <p className="text-gray-500 italic">No cost data available</p>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* SWOT Analysis Tab */}
          <TabsContent value="swot" className="mt-6">
            <h3 className="text-2xl font-bold mb-6">SWOT Analysis for {archetype.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-700 mb-4">Strengths</h4>
                <ul className="space-y-2">
                  {(swotData.strengths || []).map((strength: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>{strength}</span>
                    </li>
                  ))}
                  
                  {(!swotData.strengths || swotData.strengths.length === 0) && (
                    <li className="text-gray-500 italic">No strengths data available</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-red-700 mb-4">Weaknesses</h4>
                <ul className="space-y-2">
                  {(swotData.weaknesses || []).map((weakness: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>{weakness}</span>
                    </li>
                  ))}
                  
                  {(!swotData.weaknesses || swotData.weaknesses.length === 0) && (
                    <li className="text-gray-500 italic">No weaknesses data available</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-blue-700 mb-4">Opportunities</h4>
                <ul className="space-y-2">
                  {(swotData.opportunities || []).map((opportunity: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>{opportunity}</span>
                    </li>
                  ))}
                  
                  {(!swotData.opportunities || swotData.opportunities.length === 0) && (
                    <li className="text-gray-500 italic">No opportunities data available</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-amber-700 mb-4">Threats</h4>
                <ul className="space-y-2">
                  {(swotData.threats || []).map((threat: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span>{threat}</span>
                    </li>
                  ))}
                  
                  {(!swotData.threats || swotData.threats.length === 0) && (
                    <li className="text-gray-500 italic">No threats data available</li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          {/* Industries Tab */}
          <TabsContent value="industries" className="mt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-6">Common Industries</h3>
                <Card className="bg-white border rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    {reportData?.industries || archetype.industries || 'No industry data available'}
                  </p>
                </Card>
              </div>
              
              <div className="md:w-1/2 flex items-center justify-center">
                <div className="max-w-xs">
                  <img 
                    src={gnomeImages.welcome || gnomeImages.presentation}
                    alt="Industries Guide"
                    className="max-h-80 mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/gnomes/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Call to action footer */}
      <div className="bg-gray-50 p-6 md:p-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Want a deeper analysis?</h3>
            <p className="text-gray-600 max-w-xl">Get a customized report tailored to your specific organization with detailed metrics and actionable recommendations.</p>
          </div>
          <Button 
            className={`bg-${archetypeColor} hover:bg-${archetypeColor}/90 text-white px-6 py-3`}
            onClick={() => window.open('/contact', '_blank')}
          >
            Request Custom Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeReport;
