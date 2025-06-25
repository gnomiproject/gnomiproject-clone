
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, TrendingDown } from 'lucide-react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface BiggestChallengesTabProps {
  archetypeData: ArchetypeDetailedData;
}

interface ChallengeCardProps {
  title: string;
  description: string;
  supportingMetric?: {
    metric: string;
    value: string;
    difference: string;
    significance: string;
  };
  icon: React.ReactNode;
  index: number;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  title, 
  description, 
  supportingMetric, 
  icon, 
  index 
}) => {
  const colors = [
    'from-orange-50 to-orange-100 border-orange-200',
    'from-red-50 to-red-100 border-red-200',
    'from-amber-50 to-amber-100 border-amber-200',
    'from-rose-50 to-rose-100 border-rose-200',
    'from-yellow-50 to-yellow-100 border-yellow-200'
  ];
  
  const cardColor = colors[index % colors.length];
  
  // Get badge variant based on significance
  const getBadgeVariant = (significance: string) => {
    switch(significance?.toLowerCase()) {
      case 'high': return 'destructive'; // Red for high significance challenges
      case 'moderate': return 'secondary'; // Yellow  
      case 'low': return 'outline'; // Gray
      default: return 'secondary';
    }
  };
  
  return (
    <Card className={`bg-gradient-to-br ${cardColor} h-full transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        
        {supportingMetric && (
          <div className="mt-auto pt-4 border-t border-white/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">{supportingMetric.metric}</span>
              <Badge variant={getBadgeVariant(supportingMetric.significance)} className="text-xs">
                {supportingMetric.significance}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-gray-900">{supportingMetric.value}</span>
              <span className="text-xs text-gray-600">({supportingMetric.difference})</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BiggestChallengesTab: React.FC<BiggestChallengesTabProps> = ({ archetypeData }) => {
  // Get appropriate icon for each challenge
  const getIcon = (index: number) => {
    const icons = [
      <AlertTriangle className="h-5 w-5 text-orange-600" />,
      <AlertCircle className="h-5 w-5 text-red-600" />,
      <TrendingDown className="h-5 w-5 text-amber-600" />,
      <AlertTriangle className="h-5 w-5 text-rose-600" />,
      <AlertCircle className="h-5 w-5 text-yellow-600" />
    ];
    return icons[index % icons.length];
  };

  // Process biggest challenges data - simple mapping from pre-structured data
  const processedChallenges = React.useMemo(() => {
    const biggestChallenges = archetypeData?.biggest_challenges;
    
    if (!biggestChallenges || !Array.isArray(biggestChallenges)) {
      return [];
    }
    
    return biggestChallenges.map((challenge: any, index: number) => ({
      title: challenge.title,
      description: challenge.description,
      supportingMetric: challenge.supporting_metric ? {
        metric: challenge.supporting_metric.name,
        value: challenge.supporting_metric.value,
        difference: challenge.supporting_metric.difference,
        significance: challenge.supporting_metric.significance
      } : null,
      icon: getIcon(index),
      index
    }));
  }, [archetypeData]);

  console.log('[BiggestChallengesTab] Processed challenges:', processedChallenges);

  if (!archetypeData?.biggest_challenges || !Array.isArray(archetypeData.biggest_challenges)) {
    return (
      <div className="py-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Challenge Data Not Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Challenge data is not available for this archetype. This may be due to data processing or the archetype being newly added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Challenges This Archetype Faces</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understand the primary obstacles and areas for improvement that organizations in this archetype commonly encounter in their healthcare strategy.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedChallenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            title={challenge.title}
            description={challenge.description}
            supportingMetric={challenge.supportingMetric}
            icon={challenge.icon}
            index={index}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
        <p className="text-sm text-gray-700 text-center">
          <strong>Key Insight:</strong> These {processedChallenges.length} biggest challenges represent the primary areas 
          where this archetype faces obstacles. Addressing these challenges proactively can lead to significant 
          improvements in cost management, member outcomes, and overall program effectiveness.
        </p>
      </div>
    </div>
  );
};

export default BiggestChallengesTab;
