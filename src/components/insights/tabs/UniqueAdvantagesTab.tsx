import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target } from 'lucide-react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface UniqueAdvantagesTabProps {
  archetypeData: ArchetypeDetailedData;
}

interface StrengthCardProps {
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

const StrengthCard: React.FC<StrengthCardProps> = ({ 
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
              <Badge variant="secondary" className="text-xs">
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
  // Extract improved title from strength text
  const extractCardTitle = (strength: string): string => {
    if (strength.length < 50) {
      return strength.split('(')[0].trim();
    }
    
    const words = strength.split(' ');
    if (words.length <= 6) {
      return strength;
    }
    
    return words.slice(0, 5).join(' ') + '...';
  };

  // Simplified strength text processing - no generic fluff
  const processStrengthText = (strength: string): string => {
    // Clean up the text but don't add generic fluff
    if (strength.includes('vs average') || strength.includes('compared to')) {
      // It's already contextual, use as-is
      return strength;
    }
    
    // Just add minimal framing if needed
    if (!strength.includes('Companies') && !strength.includes('Organizations')) {
      return `Organizations in this archetype demonstrate ${strength.toLowerCase()}.`;
    }
    
    return strength;
  };

  // Format metric display with proper value types
  const formatMetricDisplay = (metric: any) => {
    const value = parseFloat(metric.archetype_value || metric.difference || 0);
    const difference = parseFloat(metric.difference || 0);
    
    let formattedValue;
    if (metric.metric.includes('Amount') || metric.metric.includes('Cost')) {
      formattedValue = `$${Math.round(value).toLocaleString()}`;
    } else if (metric.metric.includes('Percent') || metric.metric.includes('%')) {
      formattedValue = `${Math.round(value)}%`;
    } else if (metric.metric.includes('Visits') || metric.metric.includes('per 1k')) {
      formattedValue = Math.round(value).toLocaleString();
    } else {
      formattedValue = `${Math.round(value)}%`;
    }
    
    const diffSymbol = difference > 0 ? '+' : '';
    const diffFormatted = `${diffSymbol}${difference}% vs avg`;
    
    return {
      value: formattedValue,
      difference: diffFormatted,
      significance: metric.significance || 'Moderate'
    };
  };

  // Get unique metric for each card to avoid duplicates
  const getUniqueMetricForCard = (strength: string, distinctiveMetrics: any[], cardIndex: number): any => {
    if (!distinctiveMetrics || !Array.isArray(distinctiveMetrics)) return null;
    
    const strengthLower = strength.toLowerCase();
    
    const keywordMatches: { [key: string]: string[] } = {
      'cost': ['Cost', 'Amount', 'Savings'],
      'visit': ['Visits', 'PCP', 'Specialist'],
      'benefits': ['Access', 'Insurance', 'Benefits', 'Flexible'],
      'emergency': ['Emergency', 'ER'],
      'preventive': ['Wellness', 'Screening'],
      'utilization': ['Utilization', 'Non-Utilizers'],
      'risk': ['Risk', 'SDOH']
    };
    
    for (const [strengthKey, metricKeys] of Object.entries(keywordMatches)) {
      if (strengthLower.includes(strengthKey)) {
        const match = distinctiveMetrics.find(metric => 
          metricKeys.some(key => metric.metric && metric.metric.includes(key))
        );
        if (match) return match;
      }
    }
    
    return distinctiveMetrics[cardIndex % distinctiveMetrics.length];
  };

  // Get appropriate icon for each strength
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

  // Process strengths data with all improvements
  const processedStrengths = React.useMemo(() => {
    const strengths = archetypeData?.strengths || [];
    const distinctiveMetrics = archetypeData?.distinctive_metrics || [];
    
    if (!Array.isArray(strengths)) return [];
    
    return strengths.map((strength: string, index: number) => {
      const rawMetric = getUniqueMetricForCard(strength, distinctiveMetrics, index);
      const formattedMetric = rawMetric ? formatMetricDisplay(rawMetric) : null;
      
      return {
        title: extractCardTitle(strength),
        description: processStrengthText(strength),
        supportingMetric: formattedMetric ? {
          metric: rawMetric.metric,
          value: formattedMetric.value,
          difference: formattedMetric.difference,
          significance: formattedMetric.significance
        } : null,
        icon: getIcon(index),
        index
      };
    });
  }, [archetypeData]);

  console.log('[UniqueAdvantagesTab] Processed strengths:', processedStrengths);

  if (!archetypeData?.strengths || !Array.isArray(archetypeData.strengths)) {
    return (
      <div className="py-12 text-center">
        <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Unique Advantages Not Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Strength data is not available for this archetype. This may be due to data processing or the archetype being newly added.
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

      {/* Strengths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedStrengths.map((strength, index) => (
          <StrengthCard
            key={index}
            title={strength.title}
            description={strength.description}
            supportingMetric={strength.supportingMetric}
            icon={strength.icon}
            index={index}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-700 text-center">
          <strong>Key Insight:</strong> These {processedStrengths.length} unique advantages represent the core differentiators 
          that set this archetype apart from other healthcare approaches. Companies sharing these strengths 
          tend to achieve better outcomes in cost management, member satisfaction, and overall program effectiveness.
        </p>
      </div>
    </div>
  );
};

export default UniqueAdvantagesTab;
