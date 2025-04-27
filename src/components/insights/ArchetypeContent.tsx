
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartBarIcon, 
  ClipboardCheckIcon, 
  ChartPieIcon, 
  HeartIcon, 
  LightbulbIcon 
} from 'lucide-react';
import { useArchetypeMetrics } from '@/hooks/archetype/useArchetypeMetrics';
import { formatNumber } from '@/utils/formatters';
import MetricsAnalysis from '../report/sections/MetricsAnalysis';
import { getArchetypeColorHex } from '@/data/colors';

interface ArchetypeContentProps {
  archetypeData: ArchetypeDetailedData;
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const ArchetypeContent = ({ archetypeData, archetypeId, onRetakeAssessment }: ArchetypeContentProps) => {
  const { getTraitsForArchetype } = useArchetypeMetrics();
  const traits = getTraitsForArchetype(archetypeId);
  const familyColor = archetypeData.hexColor || '#6E59A5';
  
  // Use different sources for key characteristics with proper type handling
  const keyCharacteristics = 
    archetypeData.key_characteristics || 
    archetypeData.standard?.keyCharacteristics ||
    archetypeData.summary?.keyCharacteristics ||
    (traits?.uniqueInsights || []) ||
    [];
  
  // Use different sources for industries
  const industries = archetypeData.industries || 
    "Various industries including healthcare, finance, and technology";
    
  // Use different description sources with fallbacks
  const longDescription = 
    archetypeData.long_description || 
    archetypeData.short_description || 
    (archetypeData.summary?.description) || 
    "This archetype represents organizations with specific healthcare management approaches and characteristics.";

  // Get family name with fallback
  const familyName = archetypeData.familyName || archetypeData.family_name || "Healthcare Archetype Family";
    
  // Get strengths, weaknesses, opportunities, threats with fallbacks
  const strengths = archetypeData.strengths || archetypeData.enhanced?.swot?.strengths || [];
  const weaknesses = archetypeData.weaknesses || archetypeData.enhanced?.swot?.weaknesses || [];
  const opportunities = archetypeData.opportunities || archetypeData.enhanced?.swot?.opportunities || [];
  const threats = archetypeData.threats || archetypeData.enhanced?.swot?.threats || [];
  
  // Get strategic recommendations with fallback
  const strategicRecommendations = archetypeData.strategic_recommendations || 
    archetypeData.enhanced?.strategicPriorities || [];
  
  return (
    <div className="text-left space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartPieIcon size={16} />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <ChartBarIcon size={16} />
            <span>Key Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="swot" className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon size={16} />
            <span>SWOT Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="disease" className="flex items-center gap-2">
            <HeartIcon size={16} />
            <span>Disease & Care</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <LightBulbIcon size={16} />
            <span>Recommendations</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader style={{ borderBottom: `4px solid ${familyColor}` }}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {archetypeData.name || archetypeData.id?.toUpperCase()}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {familyName} Family
                  </p>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm" 
                  style={{ backgroundColor: `${familyColor}20`, color: familyColor }}>
                  Family: {familyName}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-lg text-gray-700">
                {longDescription}
              </p>
              
              {keyCharacteristics.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {keyCharacteristics.map((char: any, index: number) => (
                      <li key={index} className="text-gray-700">
                        {typeof char === 'string' 
                          ? char 
                          : typeof char === 'object' && char !== null && 'name' in char
                            ? char.name 
                            : JSON.stringify(char)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Common Industries</h3>
                <p className="text-gray-700">{industries}</p>
              </div>
              
              <div className="mt-8 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">Want more detail?</h3>
                <p className="text-purple-700">Get the full archetype report with comprehensive insights and strategies.</p>
                <Button 
                  className="mt-2 bg-purple-700 hover:bg-purple-800"
                  size="sm"
                >
                  Request Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Key Metrics Tab */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Demographics Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard 
                      title="Average Family Size" 
                      value={archetypeData["Demo_Average Family Size"] || 0} 
                      format="number" 
                      decimals={1}
                    />
                    <MetricCard 
                      title="Average Age" 
                      value={archetypeData["Demo_Average Age"] || 0} 
                      format="number" 
                      decimals={1}
                      suffix="years"
                    />
                    <MetricCard 
                      title="Geographic Spread" 
                      value={archetypeData["Demo_Average States"] || 0} 
                      format="number" 
                      decimals={0}
                      suffix="states"
                    />
                  </div>
                </div>

                {/* Utilization Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Utilization Patterns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                      title="ER Visits per 1k" 
                      value={archetypeData["Util_Emergency Visits per 1k Members"] || 0} 
                      format="number" 
                      decimals={0}
                    />
                    <MetricCard 
                      title="Specialist Visits per 1k" 
                      value={archetypeData["Util_Specialist Visits per 1k Members"] || 0} 
                      format="number" 
                      decimals={0}
                    />
                    <MetricCard 
                      title="Hospital Admits per 1k" 
                      value={archetypeData["Util_Inpatient Admits per 1k Members"] || 0} 
                      format="number" 
                      decimals={0}
                    />
                    <MetricCard 
                      title="Non-Utilizers" 
                      value={archetypeData["Util_Percent of Members who are Non-Utilizers"] || 0} 
                      format="percent" 
                      decimals={1}
                    />
                  </div>
                </div>

                {/* Risk Profile Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Risk Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard 
                      title="Clinical Risk Score" 
                      value={archetypeData["Risk_Average Risk Score"] || 0} 
                      format="number" 
                      decimals={2}
                    />
                    <MetricCard 
                      title="SDOH Risk Score" 
                      value={archetypeData["SDOH_Average SDOH"] || 0} 
                      format="number" 
                      decimals={2}
                    />
                  </div>
                </div>

                {/* Cost Metrics Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cost Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard 
                      title="Total Healthcare Spend per Employee" 
                      value={archetypeData["Cost_Medical & RX Paid Amount PEPY"] || 0} 
                      format="currency" 
                      decimals={0}
                    />
                    <MetricCard 
                      title="Avoidable ER Potential Savings" 
                      value={archetypeData["Cost_Avoidable ER Potential Savings PMPY"] || 0} 
                      format="currency" 
                      decimals={0}
                      suffix="PMPY"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-blue-700">For detailed benchmarking and trend analysis, request the full archetype report</p>
                  <Button 
                    className="mt-2 bg-blue-700 hover:bg-blue-800"
                    size="sm"
                  >
                    Request Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SWOT Analysis Tab */}
        <TabsContent value="swot">
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">Strengths</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {strengths.slice(0, 5).map((item, index) => (
                      <li key={`strength-${index}`} className="text-gray-700">{item}</li>
                    ))}
                    {strengths.length === 0 && <li className="text-gray-500">No specific strengths identified</li>}
                  </ul>
                </div>
                
                {/* Weaknesses */}
                <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
                  <h3 className="text-lg font-semibold mb-3 text-red-700">Weaknesses</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {weaknesses.slice(0, 5).map((item, index) => (
                      <li key={`weakness-${index}`} className="text-gray-700">{item}</li>
                    ))}
                    {weaknesses.length === 0 && <li className="text-gray-500">No specific weaknesses identified</li>}
                  </ul>
                </div>
                
                {/* Opportunities */}
                <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">Opportunities</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {opportunities.slice(0, 5).map((item, index) => (
                      <li key={`opportunity-${index}`} className="text-gray-700">{item}</li>
                    ))}
                    {opportunities.length === 0 && <li className="text-gray-500">No specific opportunities identified</li>}
                  </ul>
                </div>
                
                {/* Threats */}
                <div className="border rounded-lg p-4" style={{ borderColor: `${familyColor}40` }}>
                  <h3 className="text-lg font-semibold mb-3 text-orange-700">Threats</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {threats.slice(0, 5).map((item, index) => (
                      <li key={`threat-${index}`} className="text-gray-700">{item}</li>
                    ))}
                    {threats.length === 0 && <li className="text-gray-500">No specific threats identified</li>}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Want to explore strategic implications in detail?</h3>
                <p className="text-yellow-700">Get the full report with detailed analysis and actionable insights.</p>
                <Button 
                  className="mt-2 bg-yellow-700 hover:bg-yellow-800"
                  size="sm"
                >
                  Request Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Disease & Care Management Tab */}
        <TabsContent value="disease">
          <Card>
            <CardHeader>
              <CardTitle>Disease & Care Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Disease Prevalence */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Disease Prevalence</h3>
                  <div className="space-y-4">
                    <MetricBar 
                      title="Heart Disease" 
                      value={archetypeData["Dise_Heart Disease Prevalence"] || 0} 
                      format="percent" 
                      color="#ef4444"
                    />
                    <MetricBar 
                      title="Type 2 Diabetes" 
                      value={archetypeData["Dise_Type 2 Diabetes Prevalence"] || 0} 
                      format="percent" 
                      color="#f97316"
                    />
                    <MetricBar 
                      title="Mental Health Disorders" 
                      value={archetypeData["Dise_Mental Health Disorder Prevalence"] || 0} 
                      format="percent" 
                      color="#8b5cf6"
                    />
                    <MetricBar 
                      title="Substance Use Disorders" 
                      value={archetypeData["Dise_Substance Use Disorder Prevalence"] || 0} 
                      format="percent" 
                      color="#10b981"
                    />
                  </div>
                </div>
                
                {/* Care Gaps */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Care Gaps</h3>
                  <div className="space-y-4">
                    <MetricBar 
                      title="Diabetes Rx Adherence" 
                      value={archetypeData["Gaps_Diabetes RX Adherence"] || 0} 
                      format="percent" 
                      color="#f97316"
                      isGap={true}
                    />
                    <MetricBar 
                      title="Mental Health ER Follow-Up" 
                      value={archetypeData["Gaps_Behavioral Health FU ED Visit Mental Illness"] || 0} 
                      format="percent" 
                      color="#8b5cf6"
                      isGap={true}
                    />
                    <MetricBar 
                      title="Breast Cancer Screening" 
                      value={archetypeData["Gaps_Cancer Screening Breast"] || 0} 
                      format="percent" 
                      color="#ec4899"
                      isGap={true}
                    />
                    <MetricBar 
                      title="Adult Wellness Visits" 
                      value={archetypeData["Gaps_Wellness Visit Adults"] || 0} 
                      format="percent" 
                      color="#0ea5e9"
                      isGap={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                <h3 className="font-semibold text-green-800">Get the complete condition analysis</h3>
                <p className="text-green-700">Access detailed disease management strategies in the full report.</p>
                <Button 
                  className="mt-2 bg-green-700 hover:bg-green-800"
                  size="sm"
                >
                  Request Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Strategic Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-600">
                  Key strategic priorities for this archetype based on comprehensive analysis:
                </p>
                
                <ul className="space-y-4">
                  {strategicRecommendations.slice(0, 5).map((rec: any, index: number) => (
                    <li key={`rec-${index}`} className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {rec.title || `Strategic Priority ${index + 1}`}
                        </h4>
                      </div>
                    </li>
                  ))}
                  {strategicRecommendations.length === 0 && (
                    <li className="text-gray-500">No specific recommendations available for this archetype</li>
                  )}
                </ul>
                
                {strategicRecommendations.length > 5 && (
                  <p className="text-sm text-gray-600 italic">
                    Showing 5 of {strategicRecommendations.length} recommendations available
                  </p>
                )}
                
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <h3 className="font-semibold text-indigo-800">Access detailed implementation strategies</h3>
                  <p className="text-indigo-700">
                    Get the full archetype report with {
                      strategicRecommendations.length > 5 ? 
                      `all ${strategicRecommendations.length} recommendations and` : ''
                    } comprehensive implementation guidance.
                  </p>
                  <Button 
                    className="mt-2 bg-indigo-700 hover:bg-indigo-800"
                    size="sm"
                  >
                    Request Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={onRetakeAssessment}
          variant="outline"
          className="text-sm"
        >
          Want to try again? Retake the assessment
        </Button>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  format, 
  decimals = 0,
  suffix = '',
}: { 
  title: string;
  value: number;
  format: 'number' | 'percent' | 'currency';
  decimals?: number;
  suffix?: string;
}) => {
  const formattedValue = formatNumber(value, format, decimals);
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="text-2xl font-bold">
        {formattedValue} {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </div>
    </div>
  );
};

// Metric Bar Component
const MetricBar = ({ 
  title, 
  value, 
  format, 
  color = '#3b82f6',
  isGap = false,
}: { 
  title: string;
  value: number;
  format: 'number' | 'percent' | 'currency';
  color?: string;
  isGap?: boolean;
}) => {
  // For care gaps, higher values mean worse performance (more gaps)
  // For disease prevalence, higher values just mean more prevalent
  const barWidth = `${Math.min(value * 100, 100)}%`;
  const formattedValue = formatNumber(value, format, 1);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm font-semibold">{formattedValue}</p>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: barWidth,
            backgroundColor: color,
            opacity: isGap ? 0.8 : 1,
          }} 
        />
      </div>
      {isGap && (
        <p className="text-xs text-gray-500">
          {value > 0.5 ? 'Significant improvement opportunity' : 'Performing well'}
        </p>
      )}
    </div>
  );
};

export default ArchetypeContent;
