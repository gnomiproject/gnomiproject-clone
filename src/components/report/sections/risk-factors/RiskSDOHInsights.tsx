
import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useDistinctiveMetrics } from '@/hooks/archetype/useDistinctiveMetrics';

interface RiskSDOHInsightsProps {
  reportData: any;
  averageData: any;
}

const RiskSDOHInsights: React.FC<RiskSDOHInsightsProps> = ({ reportData, averageData }) => {
  // Get archetype ID from reportData
  const archetypeId = reportData?.archetype_id || reportData?.id;
  
  // Fetch SDOH metrics using the custom hook
  const { fetchSdohMetrics } = useDistinctiveMetrics();
  const [sdohMetrics, setSdohMetrics] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    async function loadSdohMetrics() {
      if (archetypeId) {
        try {
          const metrics = await fetchSdohMetrics(archetypeId);
          setSdohMetrics(metrics);
        } catch (error) {
          console.error('Failed to load SDOH metrics:', error);
        }
      }
    }
    
    loadSdohMetrics();
  }, [archetypeId, fetchSdohMetrics]);
  
  // Extract risk score and SDOH score
  const riskScore = reportData?.['Risk_Average Risk Score'] || 
                    reportData?.Risk_Average_Risk_Score || 0;
  const sdohScore = reportData?.['SDOH_Average SDOH'] || 
                    reportData?.SDOH_Average_SDOH || 0;
                    
  // Determine archetype's status based on risk and SDOH scores
  const highRisk = riskScore > (averageData?.['Risk_Average Risk Score'] || 0);
  const highSdohRisks = sdohScore > (averageData?.['SDOH_Average SDOH'] || 0);
  
  // Generate insights based on the combination of risk and SDOH
  let insightTitle = "Balanced Clinical Risk and Social Factors";
  let insightText = "This population shows moderate clinical risks with average social determinants. Focus on preventive care and addressing specific SDOH barriers.";
  let recommendation = "Consider targeted interventions for specific SDOH factors that fall below average.";
  
  if (highRisk && highSdohRisks) {
    insightTitle = "High Clinical Risk with Social Challenges";
    insightText = "This population faces both elevated clinical health risks and social determinant challenges, creating a potentially compounding effect on health outcomes.";
    recommendation = "Consider comprehensive interventions that address both clinical care needs and social support systems.";
  } else if (highRisk && !highSdohRisks) {
    insightTitle = "High Clinical Risk with Strong Social Support";
    insightText = "Despite elevated clinical health risks, this population benefits from better-than-average social determinants, which may help mitigate some clinical risks.";
    recommendation = "Leverage existing social strengths while addressing specific clinical risk factors.";
  } else if (!highRisk && highSdohRisks) {
    insightTitle = "Low Clinical Risk with Social Challenges";
    insightText = "This population shows lower clinical risk factors but faces challenges in social determinants that could affect long-term health outcomes if not addressed.";
    recommendation = "Focus on improving social determinants to maintain the lower clinical risk profile.";
  } else if (!highRisk && !highSdohRisks) {
    insightTitle = "Low Clinical Risk with Strong Social Support";
    insightText = "This population has both lower clinical risk factors and better social determinants, positioning them for potentially better health outcomes.";
    recommendation = "Maintain prevention strategies and continue supporting the strong social factors already in place.";
  }

  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold">Clinical Risk-SDOH Relationship Insights</h3>
      </div>
      
      <div className="bg-blue-50 p-5 rounded-lg mb-4">
        <h4 className="font-semibold text-lg mb-2">{insightTitle}</h4>
        <p className="text-gray-700">{insightText}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="font-medium mb-2 text-blue-700">Key Implications</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li>The relationship between clinical risks and social factors creates {highRisk ? 'challenges' : 'opportunities'} for this population.</li>
            <li>{sdohMetrics.length > 0 ? 'Notable SDOH factors affecting this archetype include ' + sdohMetrics[0]?.Metric : 'Address the SDOH factors that fall significantly below average.'}</li>
            <li>Consider the {highRisk ? 'higher' : 'lower'} clinical risk score when designing interventions.</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="font-medium mb-2 text-green-700">Recommended Approach</h4>
          <p className="mb-3">{recommendation}</p>
          <ul className="space-y-2 list-disc pl-5">
            {sdohMetrics.slice(0, 2).map((metric, index) => (
              <li key={index}>
                Focus on {metric?.Metric || 'key SDOH factors'} which is {metric?.Difference > 0 ? 'higher' : 'lower'} than average.
              </li>
            ))}
            <li>Integrate both clinical care and social support in program design.</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default RiskSDOHInsights;
