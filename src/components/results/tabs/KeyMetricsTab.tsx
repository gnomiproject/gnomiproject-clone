
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Users, Activity, AlertTriangle, DollarSign } from 'lucide-react';

interface KeyMetricsTabProps {
  archetypeData: ArchetypeDetailedData;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: string;
  isHighlighted?: boolean;
}

const MetricCard = ({ title, value, description, icon, color = '#888888', isHighlighted = false }: MetricCardProps) => {
  return (
    <Card className={`overflow-hidden ${isHighlighted ? 'ring-2' : ''}`} style={{ borderColor: isHighlighted ? color : undefined }}>
      <div className="h-1" style={{ backgroundColor: color }}></div>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: `${color}15`, color: color }}>
            {icon}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <HelpCircle size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className="mt-2 text-2xl font-bold" style={{ color }}>
          {typeof value === 'number' ? value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          }) : value}
        </div>
      </CardContent>
    </Card>
  );
};

const KeyMetricsTab = ({ archetypeData }: KeyMetricsTabProps) => {
  const color = archetypeData.hexColor ? 
    archetypeData.hexColor : 
    `var(--color-archetype-${archetypeData.id})`;

  // Demographics metrics
  const familySize = archetypeData.Demo_Average_Family_Size ?? 0;
  const averageAge = archetypeData.Demo_Average_Age ?? 0;
  const averageStates = archetypeData.Demo_Average_States ?? 0;

  // Utilization metrics
  const erVisits = archetypeData.Util_Emergency_Visits_per_1k_Members ?? 0;
  const specialistVisits = archetypeData.Util_Specialist_Visits_per_1k_Members ?? 0;
  const inpatientAdmits = archetypeData.Util_Inpatient_Admits_per_1k_Members ?? 0;
  const nonUtilizers = archetypeData.Util_Percent_of_Members_who_are_Non_Utilizers ?? 0;

  // Risk metrics
  const riskScore = archetypeData.Risk_Average_Risk_Score ?? 0;
  const sdohScore = archetypeData.SDOH_Average_SDOH ?? 0;

  // Cost metrics
  const totalCostPEPY = archetypeData.Cost_Medical_RX_Paid_Amount_PEPY ?? 0;
  const savingsPMPY = archetypeData.Cost_Avoidable_ER_Potential_Savings_PMPY ?? 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Key Performance Metrics</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-5 w-5 text-gray-500" /> 
          Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Family Size" 
            value={familySize} 
            description="Average family size for members in this archetype" 
            color={color}
            icon={<Users size={16} />}
          />
          <MetricCard 
            title="Average Age" 
            value={averageAge} 
            description="Average age of members in this archetype" 
            color={color}
            icon={<Users size={16} />}
          />
          <MetricCard 
            title="Geographic Spread" 
            value={averageStates} 
            description="Average number of states where members are located" 
            color={color}
            icon={<Users size={16} />}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-gray-500" /> 
          Utilization Patterns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="ER Visits" 
            value={`${erVisits} per 1k`} 
            description="Emergency room visits per 1,000 members" 
            color={color}
            icon={<Activity size={16} />}
            isHighlighted={erVisits > 200}
          />
          <MetricCard 
            title="Specialist Visits" 
            value={`${specialistVisits} per 1k`} 
            description="Specialist visits per 1,000 members" 
            color={color}
            icon={<Activity size={16} />}
            isHighlighted={specialistVisits > 3000}
          />
          <MetricCard 
            title="Hospital Admits" 
            value={`${inpatientAdmits} per 1k`}  
            description="Inpatient hospital admissions per 1,000 members" 
            color={color}
            icon={<Activity size={16} />}
            isHighlighted={inpatientAdmits > 100}
          />
          <MetricCard 
            title="Non-Utilizers" 
            value={`${(nonUtilizers * 100).toFixed(1)}%`} 
            description="Percentage of members who do not use healthcare services" 
            color={color}
            icon={<Activity size={16} />}
            isHighlighted={nonUtilizers > 0.3}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-gray-500" /> 
          Risk Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard 
            title="Clinical Risk Score" 
            value={riskScore.toFixed(2)} 
            description="Average clinical risk score (higher values indicate higher risk)" 
            color={color}
            icon={<AlertTriangle size={16} />}
            isHighlighted={riskScore > 1.2}
          />
          <MetricCard 
            title="SDOH Score" 
            value={sdohScore.toFixed(2)} 
            description="Social Determinants of Health score (higher values indicate more favorable social factors)" 
            color={color}
            icon={<AlertTriangle size={16} />}
            isHighlighted={sdohScore < 70}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-gray-500" /> 
          Cost Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard 
            title="Total Healthcare Spend" 
            value={`$${totalCostPEPY.toLocaleString()}`} 
            description="Medical and pharmacy cost per employee per year" 
            color={color}
            icon={<DollarSign size={16} />}
            isHighlighted={totalCostPEPY > 12000}
          />
          <MetricCard 
            title="Potential Savings" 
            value={`$${savingsPMPY.toLocaleString()}`} 
            description="Potential savings from avoidable ER visits per member per year" 
            color={color}
            icon={<DollarSign size={16} />}
            isHighlighted={savingsPMPY > 100}
          />
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 text-sm">
          For detailed benchmarking and trend analysis, request the full archetype report
        </p>
      </div>
    </div>
  );
};

export default KeyMetricsTab;
