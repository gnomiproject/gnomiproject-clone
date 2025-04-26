
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Heart, Brain, Pill, MoveHorizontal } from 'lucide-react';

interface DiseaseManagementTabProps {
  archetypeData: ArchetypeDetailedData;
}

const MetricBar = ({ 
  label, 
  value, 
  color = "#888888",
  icon
}: { 
  label: string; 
  value: number;
  color?: string;
  icon?: React.ReactNode;
}) => {
  // Convert decimal to percentage if needed
  const displayValue = value > 1 ? value : value * 100;
  const formattedValue = `${displayValue.toFixed(1)}%`;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold" style={{ color }}>
          {formattedValue}
        </span>
      </div>
      <Progress value={displayValue} className="h-2" style={{ 
        '--progress-background': `${color}20`,
        '--progress-foreground': color
      } as React.CSSProperties} />
    </div>
  );
};

const DiseaseManagementTab = ({ archetypeData }: DiseaseManagementTabProps) => {
  const color = archetypeData.hexColor ? 
    archetypeData.hexColor : 
    `var(--color-archetype-${archetypeData.id})`;

  // Disease prevalence metrics - already stored as decimals (0-1)
  const heartDiseasePrevalence = archetypeData["Dise_Heart Disease Prevalence"] ?? 0;
  const diabetesPrevalence = archetypeData["Dise_Type 2 Diabetes Prevalence"] ?? 0;
  const mentalHealthPrevalence = archetypeData["Dise_Mental Health Disorder Prevalence"] ?? 0;
  const substanceUsePrevalence = archetypeData["Dise_Substance Use Disorder Prevalence"] ?? 0;

  // Care gaps metrics - may be stored as percentages (0-100) already
  // Console log to check the actual values
  console.log('Care Gaps Data:', {
    diabetesRxAdherence: archetypeData["Gaps_Diabetes RX Adherence"],
    behavioralHealthFollowup: archetypeData["Gaps_Behavioral Health FU ED Visit Mental Illness"],
    breastCancerScreening: archetypeData["Gaps_Cancer Screening Breast"],
    adultsWellnessVisit: archetypeData["Gaps_Wellness Visit Adults"],
  });
  
  const diabetesRxAdherence = archetypeData["Gaps_Diabetes RX Adherence"] ?? 0;
  const behavioralHealthFollowup = archetypeData["Gaps_Behavioral Health FU ED Visit Mental Illness"] ?? 0;
  const breastCancerScreening = archetypeData["Gaps_Cancer Screening Breast"] ?? 0;
  const adultsWellnessVisit = archetypeData["Gaps_Wellness Visit Adults"] ?? 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Disease & Care Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="pb-3" style={{ borderBottom: `1px solid ${color}30` }}>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" style={{ color }} />
              <span>Disease Prevalence</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <MetricBar 
                label="Heart Disease" 
                value={heartDiseasePrevalence * 100}
                color={color}
                icon={<Heart size={16} color={color} />}
              />
              
              <MetricBar 
                label="Type 2 Diabetes" 
                value={diabetesPrevalence * 100}
                color={color}
                icon={<Activity size={16} color={color} />}
              />
              
              <MetricBar 
                label="Mental Health Disorders" 
                value={mentalHealthPrevalence * 100}
                color={color}
                icon={<Brain size={16} color={color} />}
              />
              
              <MetricBar 
                label="Substance Use Disorder" 
                value={substanceUsePrevalence * 100}
                color={color}
                icon={<Pill size={16} color={color} />}
              />
            </div>
            
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-gray-500">These prevalence rates indicate the percentage of members with these conditions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3" style={{ borderBottom: `1px solid ${color}30` }}>
            <CardTitle className="flex items-center">
              <MoveHorizontal className="mr-2 h-5 w-5" style={{ color }} />
              <span>Care Gaps</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <MetricBar 
                label="Diabetes Medication Adherence" 
                value={diabetesRxAdherence}
                color={color}
                icon={<Pill size={16} color={color} />}
              />
              
              <MetricBar 
                label="Mental Health Follow-Up" 
                value={behavioralHealthFollowup}
                color={color}
                icon={<Brain size={16} color={color} />}
              />
              
              <MetricBar 
                label="Breast Cancer Screening" 
                value={breastCancerScreening}
                color={color}
                icon={<Activity size={16} color={color} />}
              />
              
              <MetricBar 
                label="Adult Wellness Visits" 
                value={adultsWellnessVisit}
                color={color}
                icon={<Heart size={16} color={color} />}
              />
            </div>
            
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-gray-500">Higher percentages indicate better performance in closing care gaps</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color }}>Condition Management Insights</h3>
            <p className="text-gray-700 mb-4">
              This archetype shows clear correlations between disease prevalence and care gaps. 
              Focused interventions in the areas highlighted above can significantly improve health outcomes.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Get the complete condition analysis in the full report, including detailed intervention strategies 
                and cost-benefit analysis for targeted programs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseManagementTab;
