
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StrategicOpportunitiesPreviewProps {
  strategicRecommendations?: any[];
  archetypeColor?: string;
}

const StrategicOpportunitiesPreview: React.FC<StrategicOpportunitiesPreviewProps> = ({
  strategicRecommendations = [],
  archetypeColor = '#6E59A5'
}) => {
  // Parse and get top 2 recommendations
  const parseRecommendations = () => {
    if (!strategicRecommendations || strategicRecommendations.length === 0) return [];
    
    try {
      if (typeof strategicRecommendations === 'string') {
        return JSON.parse(strategicRecommendations);
      }
      return Array.isArray(strategicRecommendations) ? strategicRecommendations : [];
    } catch (error) {
      console.error('Error parsing strategic recommendations:', error);
      return [];
    }
  };

  const recommendations = parseRecommendations().slice(0, 2); // Show only top 2

  if (recommendations.length === 0) {
    return null;
  }

  const scrollToRecommendations = () => {
    const element = document.getElementById('recommendations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: archetypeColor }}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" style={{ color: archetypeColor }} />
            Strategic Opportunities
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={scrollToRecommendations}
            className="text-xs"
          >
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">
              {rec.title || rec.name || `Opportunity ${index + 1}`}
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              {rec.description || rec.content || ''}
            </p>
          </div>
        ))}
        
        {recommendations.length >= 2 && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              + {Math.max(0, parseRecommendations().length - 2)} more strategic recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategicOpportunitiesPreview;
