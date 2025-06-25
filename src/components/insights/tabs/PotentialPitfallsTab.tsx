
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, TrendingDown, XCircle, Zap } from 'lucide-react';
import { ArchetypeDetailedData } from '@/types/archetype';

interface PotentialPitfallsTabProps {
  archetypeData: ArchetypeDetailedData;
}

interface PitfallCardProps {
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

const PitfallCard: React.FC<PitfallCardProps> = ({ 
  title, 
  description, 
  supportingMetric, 
  icon, 
  index 
}) => {
  const colors = [
    'from-red-50 to-red-100 border-red-200',
    'from-orange-50 to-orange-100 border-orange-200',
    'from-rose-50 to-rose-100 border-rose-200',
    'from-amber-50 to-amber-100 border-amber-200',
    'from-yellow-50 to-yellow-100 border-yellow-200'
  ];
  
  const cardColor = colors[index % colors.length];
  
  // Get badge variant based on significance
  const getBadgeVariant = (significance: string) => {
    switch(significance?.toLowerCase()) {
      case 'high': return 'destructive'; // Red for high significance pitfalls
      case 'moderate': return 'secondary'; // Yellow/Orange  
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

const PotentialPitfallsTab: React.FC<PotentialPitfallsTabProps> = ({ archetypeData }) => {
  // Get appropriate icon for each pitfall
  const getIcon = (index: number) => {
    const icons = [
      <AlertTriangle className="h-5 w-5 text-red-600" />,
      <AlertCircle className="h-5 w-5 text-orange-600" />,
      <TrendingDown className="h-5 w-5 text-rose-600" />,
      <XCircle className="h-5 w-5 text-amber-600" />,
      <Zap className="h-5 w-5 text-yellow-600" />
    ];
    return icons[index % icons.length];
  };

  // Process potential pitfalls data - simple mapping from pre-structured data
  const processedPitfalls = React.useMemo(() => {
    const potentialPitfalls = archetypeData?.potential_pitfalls;
    
    if (!potentialPitfalls || !Array.isArray(potentialPitfalls)) {
      return [];
    }
    
    return potentialPitfalls.map((pitfall: any, index: number) => ({
      title: pitfall.title,
      description: pitfall.description,
      supportingMetric: pitfall.supporting_metric ? {
        metric: pitfall.supporting_metric.name,
        value: pitfall.supporting_metric.value,
        difference: pitfall.supporting_metric.difference,
        significance: pitfall.supporting_metric.significance
      } : null,
      icon: getIcon(index),
      index
    }));
  }, [archetypeData]);

  console.log('[PotentialPitfallsTab] Processed pitfalls:', processedPitfalls);

  if (!archetypeData?.potential_pitfalls || !Array.isArray(archetypeData.potential_pitfalls)) {
    return (
      <div className="py-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Pitfall Data Not Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Potential pitfall data is not available for this archetype. This may be due to data processing or the archetype being newly added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Risks and Potential Pitfalls</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understand the primary risks and potential pitfalls that organizations in this archetype should be aware of and actively work to mitigate.
        </p>
      </div>

      {/* Pitfalls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedPitfalls.map((pitfall, index) => (
          <PitfallCard
            key={index}
            title={pitfall.title}
            description={pitfall.description}
            supportingMetric={pitfall.supportingMetric}
            icon={pitfall.icon}
            index={index}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
        <p className="text-sm text-gray-700 text-center">
          <strong>Risk Awareness:</strong> These {processedPitfalls.length} potential pitfalls represent key areas 
          of risk that this archetype should monitor closely. Proactive awareness and mitigation of these risks 
          can prevent significant challenges and improve overall program resilience.
        </p>
      </div>
    </div>
  );
};

export default PotentialPitfallsTab;
