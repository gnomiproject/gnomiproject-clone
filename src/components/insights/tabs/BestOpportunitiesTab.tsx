
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap, ArrowUpRight, Plus } from 'lucide-react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface BestOpportunitiesTabProps {
  archetypeData: ArchetypeDetailedData;
}

interface OpportunityCardProps {
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

const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
  title, 
  description, 
  supportingMetric, 
  icon, 
  index 
}) => {
  const colors = [
    'from-green-50 to-green-100 border-green-200',
    'from-blue-50 to-blue-100 border-blue-200',
    'from-emerald-50 to-emerald-100 border-emerald-200',
    'from-teal-50 to-teal-100 border-teal-200',
    'from-cyan-50 to-cyan-100 border-cyan-200'
  ];
  
  const cardColor = colors[index % colors.length];
  
  // Get badge variant based on significance
  const getBadgeVariant = (significance: string) => {
    switch(significance?.toLowerCase()) {
      case 'high': return 'success'; // Green for high significance opportunities
      case 'moderate': return 'default'; // Blue
      case 'low': return 'outline'; // Gray
      default: return 'default';
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

const BestOpportunitiesTab: React.FC<BestOpportunitiesTabProps> = ({ archetypeData }) => {
  // Get appropriate icon for each opportunity
  const getIcon = (index: number) => {
    const icons = [
      <TrendingUp className="h-5 w-5 text-green-600" />,
      <Target className="h-5 w-5 text-blue-600" />,
      <Zap className="h-5 w-5 text-emerald-600" />,
      <ArrowUpRight className="h-5 w-5 text-teal-600" />,
      <Plus className="h-5 w-5 text-cyan-600" />
    ];
    return icons[index % icons.length];
  };

  // Process best opportunities data - simple mapping from pre-structured data
  const processedOpportunities = React.useMemo(() => {
    const bestOpportunities = archetypeData?.best_opportunities;
    
    if (!bestOpportunities || !Array.isArray(bestOpportunities)) {
      return [];
    }
    
    return bestOpportunities.map((opportunity: any, index: number) => ({
      title: opportunity.title,
      description: opportunity.description,
      supportingMetric: opportunity.supporting_metric ? {
        metric: opportunity.supporting_metric.name,
        value: opportunity.supporting_metric.value,
        difference: opportunity.supporting_metric.difference,
        significance: opportunity.supporting_metric.significance
      } : null,
      icon: getIcon(index),
      index
    }));
  }, [archetypeData]);

  console.log('[BestOpportunitiesTab] Processed opportunities:', processedOpportunities);

  if (!archetypeData?.best_opportunities || !Array.isArray(archetypeData.best_opportunities)) {
    return (
      <div className="py-12 text-center">
        <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Opportunity Data Not Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Opportunity data is not available for this archetype. This may be due to data processing or the archetype being newly added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Opportunities for Growth and Improvement</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the most promising opportunities and strategic advantages that organizations in this archetype can leverage to drive growth and competitive positioning.
        </p>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedOpportunities.map((opportunity, index) => (
          <OpportunityCard
            key={index}
            title={opportunity.title}
            description={opportunity.description}
            supportingMetric={opportunity.supportingMetric}
            icon={opportunity.icon}
            index={index}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
        <p className="text-sm text-gray-700 text-center">
          <strong>Strategic Insight:</strong> These {processedOpportunities.length} key opportunities represent the highest-potential 
          areas for strategic advantage and growth. Leveraging these opportunities can lead to significant 
          improvements in competitive positioning, operational efficiency, and member outcomes.
        </p>
      </div>
    </div>
  );
};

export default BestOpportunitiesTab;
