
import React from 'react';
import { DeepReportData } from '@/pages/ArchetypeDeepReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArchetypeColorHex } from '@/data/colors';
import { CircleAlert, BarChart4, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DeepReportRecommendationsProps {
  reportData: DeepReportData;
}

const DeepReportRecommendations: React.FC<DeepReportRecommendationsProps> = ({ reportData }) => {
  const { archetypeData, strategicRecommendations } = reportData;
  
  if (!archetypeData) {
    return <div>Loading archetype data...</div>;
  }
  
  const archetypeColor = getArchetypeColorHex(archetypeData.id);
  
  // Check if recommendations data is available
  const hasRecommendations = strategicRecommendations && strategicRecommendations.length > 0;
  
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Strategic Recommendations</h1>
        <div 
          className="h-1 w-24 rounded-full mb-6"
          style={{ backgroundColor: archetypeColor }}
        ></div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-8">
            Based on our analysis of the {archetypeData.name} archetype, we've developed the following 
            strategic recommendations to help optimize your healthcare program performance. These 
            recommendations address key opportunities identified in the data and SWOT analysis.
          </p>
          
          {hasRecommendations ? (
            <div className="space-y-8">
              {strategicRecommendations.map((recommendation, index) => (
                <Card key={index} className="border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: archetypeColor }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div 
                        className="flex items-center justify-center h-8 w-8 rounded-full text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: archetypeColor }}
                      >
                        {recommendation.recommendation_number || index + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-3">{recommendation.title}</h3>
                        <p className="text-gray-700 mb-4">{recommendation.description}</p>
                        
                        {recommendation.metrics_references && (
                          <div className="mt-4">
                            <div className="text-sm text-gray-500 mb-2 flex items-center">
                              <BarChart4 className="inline-block mr-2 h-4 w-4" /> 
                              Related metrics:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {typeof recommendation.metrics_references === 'string' ? (
                                <Badge variant="outline">{recommendation.metrics_references}</Badge>
                              ) : Array.isArray(recommendation.metrics_references) ? (
                                recommendation.metrics_references.map((metric, i) => (
                                  <Badge key={i} variant="outline">{metric}</Badge>
                                ))
                              ) : (
                                Object.keys(recommendation.metrics_references).map((key, i) => (
                                  <Badge key={i} variant="outline">{key}</Badge>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-6 flex justify-end">
                          <Button 
                            variant="outline" 
                            className="text-sm" 
                            style={{ color: archetypeColor, borderColor: archetypeColor }}
                          >
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CircleAlert className="h-12 w-12 text-amber-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Recommendations Not Available</h4>
              <p className="text-gray-500 mb-6">The strategic recommendations for this archetype are still being generated.</p>
              <Button variant="outline">Request Recommendations</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Implementation Guidance */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            Successfully implementing these recommendations requires a strategic approach and careful planning.
            Here are some key considerations for effective execution:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div 
                className="p-1 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: archetypeColor }}
              >
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Prioritize Based on Impact</h4>
                <p className="text-gray-600">
                  Consider starting with recommendations that address your most significant challenges
                  or offer the highest potential return on investment.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div 
                className="p-1 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: archetypeColor }}
              >
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Align with Existing Initiatives</h4>
                <p className="text-gray-600">
                  Look for opportunities to integrate these recommendations with your current healthcare
                  strategy and programs to maximize efficiency and adoption.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div 
                className="p-1 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: archetypeColor }}
              >
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Measure and Monitor</h4>
                <p className="text-gray-600">
                  Establish clear metrics to track the effectiveness of implemented recommendations
                  and be prepared to adjust your approach based on outcomes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div 
                className="p-1 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: archetypeColor }}
              >
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Engage Stakeholders</h4>
                <p className="text-gray-600">
                  Ensure buy-in from key stakeholders across your organization to support successful
                  implementation and adoption of recommended changes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepReportRecommendations;
