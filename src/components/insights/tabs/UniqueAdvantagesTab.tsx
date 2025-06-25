
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target } from 'lucide-react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface UniqueAdvantagesTabProps {
  archetypeData: ArchetypeDetailedData;
}

interface AdvantageCardProps {
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

const AdvantageCard: React.FC<AdvantageCardProps> = ({ 
  title, 
  description, 
  supportingMetric, 
  icon, 
  index 
}) => {
  const colors = [
    'from-blue-50 to-blue-100 border-blue-200',
    'from-green-50 to-green-100 border-green-200',
    'from-purple-50 to-purple-100 border-purple-200',
    'from-amber-50 to-amber-100 border-amber-200',
    'from-teal-50 to-teal-100 border-teal-200'
  ];
  
  const cardColor = colors[index % colors.length];
  
  // Get badge variant based on significance
  const getBadgeVariant = (significance: string) => {
    switch(significance?.toLowerCase()) {
      case 'high': return 'default'; // Green
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

const UniqueAdvantagesTab: React.FC<UniqueAdvantagesTabProps> = ({ archetypeData }) => {
  // Get appropriate icon for each advantage
  const getIcon = (index: number) => {
    const icons = [
      <Lightbulb className="h-5 w-5 text-blue-600" />,
      <Target className="h-5 w-5 text-green-600" />,
      <TrendingUp className="h-5 w-5 text-purple-600" />,
      <Lightbulb className="h-5 w-5 text-amber-600" />,
      <Target className="h-5 w-5 text-teal-600" />
    ];
    return icons[index % icons.length];
  };

  // Process unique advantages data - simple mapping from pre-structured data
  const processedAdvantages = React.useMemo(() => {
    const uniqueAdvantages = archetypeData?.unique_advantages;
    
    if (!uniqueAdvantages || !Array.isArray(uniqueAdvantages)) {
      return [];
    }
    
    return uniqueAdvantages.map((advantage: any, index: number) => ({
      title: advantage.title,
      description: advantage.description,
      supportingMetric: advantage.supporting_metric ? {
        metric: advantage.supporting_metric.name,
        value: advantage.supporting_metric.value,
        difference: advantage.supporting_metric.difference,
        significance: advantage.supporting_metric.significance
      } : null,
      icon: getIcon(index),
      index
    }));
  }, [archetypeData]);

  console.log('[UniqueAdvantagesTab] Processed advantages:', processedAdvantages);

  if (!archetypeData?.unique_advantages || !Array.isArray(archetypeData.unique_advantages)) {
    return (
      <div className="py-12 text-center">
        <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Unique Advantages Not Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Advantage data is not available for this archetype. This may be due to data processing or the archetype being newly added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What Sets This Archetype Apart</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the distinctive strengths and competitive advantages that make companies in this archetype successful in their healthcare strategy.
        </p>
      </div>

      {/* Advantages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedAdvantages.map((advantage, index) => (
          <AdvantageCard
            key={index}
            title={advantage.title}
            description={advantage.description}
            supportingMetric={advantage.supportingMetric}
            icon={advantage.icon}
            index={index}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-700 text-center">
          <strong>Key Insight:</strong> These {processedAdvantages.length} unique advantages represent the core differentiators 
          that set this archetype apart from other healthcare approaches. Companies sharing these strengths 
          tend to achieve better outcomes in cost management, member satisfaction, and overall program effectiveness.
        </p>
      </div>
    </div>
  );
};

export default UniqueAdvantagesTab;
