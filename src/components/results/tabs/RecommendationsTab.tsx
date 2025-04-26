
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Download, Lightbulb } from 'lucide-react';

interface RecommendationsTabProps {
  archetypeData: ArchetypeDetailedData;
}

const RecommendationsTab = ({ archetypeData }: RecommendationsTabProps) => {
  const color = archetypeData.hexColor ? 
    archetypeData.hexColor : 
    `var(--color-archetype-${archetypeData.id})`;

  // Extract strategic recommendations from the new data structure
  const recommendations = Array.isArray(archetypeData.strategic_recommendations) 
    ? archetypeData.strategic_recommendations 
    : archetypeData.enhanced?.strategicPriorities || [];

  // Total number of recommendations in the full report (actual or mocked)
  const totalRecommendations = Math.max(recommendations.length, 12);
  const shownRecommendations = recommendations.slice(0, 5);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold">Strategic Recommendations</h2>
        <Button 
          style={{ backgroundColor: color }}
          className="mt-4 md:mt-0"
        >
          <Download className="mr-2 h-4 w-4" />
          Get Full Implementation Plan
        </Button>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700">
          Based on our analysis of your organization's profile, we've identified these key strategic recommendations
          that align with the {archetypeData.name} archetype.
        </p>
      </div>
      
      {shownRecommendations.length > 0 ? (
        <div className="space-y-4 mb-8">
          {shownRecommendations.map((rec, index) => {
            const title = rec.title || `Strategic Priority ${index + 1}`;
            const priority = rec.recommendation_number || index + 1;
            
            return (
              <Card key={index} className="relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: color }}
                ></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {priority}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{title}</h3>
                        <p className="text-gray-600 text-sm">Full implementation strategy available in detailed report</p>
                      </div>
                    </div>
                    <Lock className="text-gray-400 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            Strategic recommendations are available in the full report
          </p>
        </div>
      )}
      
      {recommendations.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
          <div className="mb-4">
            <Badge variant="outline" className="text-gray-700">
              {shownRecommendations.length} of {totalRecommendations} recommendations shown
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color }}>
            Access All Strategic Recommendations
          </h3>
          <p className="text-gray-600 mb-4">
            The full report includes detailed implementation strategies and expected outcomes for each recommendation.
          </p>
          <Button style={{ backgroundColor: color }}>
            <Download className="mr-2 h-4 w-4" />
            Get Complete Recommendations
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsTab;
