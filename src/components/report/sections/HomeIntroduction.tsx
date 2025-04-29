
import React from 'react';
import { ReportUserData } from '@/hooks/useReportUserData';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';
import { formatPercentageDifference } from '@/utils/reports/metricUtils';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import MetricComparisonCard from '@/components/shared/MetricComparisonCard';

interface HomeIntroductionProps {
  userData: ReportUserData | null;
  archetypeData: any;
  averageData: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // Extract user data with fallback values
  const userName = userData?.name || 'Healthcare Leader';
  const organization = userData?.organization || 'Your Organization';
  const assessmentResult = userData?.assessment_result || {};
  
  // Extract archetype information
  const archetypeName = archetypeData?.name || 'Your Archetype';
  const archetypeId = archetypeData?.id || '';
  const shortDescription = archetypeData?.short_description || 'Your organization has a unique healthcare profile.';
  
  // Extract key metrics with fallbacks
  const metrics = {
    cost: {
      value: archetypeData?.["Cost_Medical & RX Paid Amount PEPY"] || 0,
      average: averageData?.["Cost_Medical & RX Paid Amount PEPY"] || 0,
      name: "Healthcare Cost Per Employee"
    },
    risk: {
      value: archetypeData?.["Risk_Average Risk Score"] || 0,
      average: averageData?.["Risk_Average Risk Score"] || 0,
      name: "Risk Score"
    },
    emergency: {
      value: archetypeData?.["Util_Emergency Visits per 1k Members"] || 0,
      average: averageData?.["Util_Emergency Visits per 1k Members"] || 0,
      name: "ER Visits per 1,000"
    },
    specialist: {
      value: archetypeData?.["Util_Specialist Visits per 1k Members"] || 0,
      average: averageData?.["Util_Specialist Visits per 1k Members"] || 0,
      name: "Specialist Visits per 1,000"
    }
  };

  // Get archetype match information
  const matchPercentage = assessmentResult?.percentageMatch || 98;
  const secondaryArchetype = assessmentResult?.secondaryArchetype || "Similar organizations";
  const primaryArchetype = assessmentResult?.primaryArchetype || archetypeId;
  
  // Determine if metric is favorable (lower is better for costs and emergency visits)
  const isFavorable = (metricName: string, value: number, average: number): boolean => {
    const percentDiff = calculatePercentageDifference(value, average);
    const lowerIsBetter = metricName.toLowerCase().includes('cost') || 
      metricName.toLowerCase().includes('emergency') || 
      metricName.toLowerCase().includes('risk');
    
    return (lowerIsBetter && percentDiff < 0) || (!lowerIsBetter && percentDiff > 0);
  };

  return (
    <Section id="home-introduction" className="pb-0 md:pb-0">
      <div className="relative">
        {/* Gnome Image */}
        <div className="hidden md:block absolute -top-20 left-0">
          <img 
            src="/lovable-uploads/c44c4897-43c2-48a4-8e58-df83da99bcb0.png" 
            alt="Gnome guide" 
            className="w-32 h-auto"
          />
        </div>
        
        {/* Header Section */}
        <div className="mb-8 md:mb-12 pl-0 md:pl-24">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Welcome, <span className="text-primary">{userName}</span>{" "}
            from <span className="text-primary">{organization}</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            This personalized report is tailored based on your assessment results and organization profile.
          </p>
          
          {/* Nomi Pulse Line - Visual element as requested */}
          <div className="mt-6 h-1 w-full bg-gradient-to-r from-blue-500 via-[#46E0D3] to-pink-500 rounded-full"></div>
        </div>
        
        {/* Archetype Match Information */}
        <div className="mb-10">
          <Card className="border border-gray-200 p-6 bg-gradient-to-br from-white to-slate-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Your Primary Archetype Match</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary">
                    {archetypeName}
                  </span>
                  <span className="ml-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {matchPercentage}% match
                  </span>
                </div>
                
                <p className="mt-3 text-sm text-gray-600">
                  Secondary Match: <span className="font-medium">{secondaryArchetype}</span>
                </p>
                
                <div className="mt-4 p-4 bg-slate-50 border-l-4 border-primary rounded">
                  <p className="text-gray-700">{shortDescription}</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="inline-flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">Archetype ID</span>
                  <span className="inline-block px-4 py-2 bg-gray-100 rounded-lg font-mono font-medium text-xl">
                    {archetypeId.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Key Metrics Preview */}
        <div className="mb-10">
          <SectionTitle 
            title="Your Key Metrics" 
            subtitle="See how your organization compares to the population average"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cost Metric */}
            <MetricCard 
              title={metrics.cost.name}
              value={metrics.cost.value}
              average={metrics.cost.average}
              format="currency"
              lowerIsBetter={true}
            />
            
            {/* Risk Metric */}
            <MetricCard 
              title={metrics.risk.name}
              value={metrics.risk.value}
              average={metrics.risk.average}
              format="number"
              decimals={2}
              lowerIsBetter={true}
            />
            
            {/* Emergency Visits Metric */}
            <MetricCard 
              title={metrics.emergency.name}
              value={metrics.emergency.value}
              average={metrics.emergency.average}
              lowerIsBetter={true}
            />
            
            {/* Specialist Visits Metric */}
            <MetricCard 
              title={metrics.specialist.name}
              value={metrics.specialist.value}
              average={metrics.specialist.average}
              lowerIsBetter={false}
            />
          </div>
        </div>
        
        {/* User Engagement Section */}
        <div className="mb-10 bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h3 className="text-xl font-semibold mb-4">What You'll Discover in This Report</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <span>Comprehensive analysis of your population's healthcare utilization patterns</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <span>Insights into cost drivers specific to your archetype</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <span>Strategic recommendations tailored to your organization's profile</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-primary font-bold text-sm">4</span>
              </div>
              <span>Actionable opportunities for improving healthcare outcomes</span>
            </li>
          </ul>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 max-w-lg">
              Navigate through the sections using the links at the top of each page or by scrolling down through the report.
            </p>
            
            <Button className="bg-[#46E0D3] hover:bg-[#3BC0B5] text-white">
              Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

// Metric Card component to display individual metrics
interface MetricCardProps {
  title: string;
  value: number;
  average: number;
  format?: 'number' | 'percent' | 'currency';
  decimals?: number;
  lowerIsBetter?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  average, 
  format = 'number',
  decimals = 0,
  lowerIsBetter = false
}: MetricCardProps) => {
  // Calculate the percentage difference
  const difference = calculatePercentageDifference(value, average);
  const percentageText = formatPercentageDifference(difference);
  
  // Determine if this is better or worse based on lowerIsBetter flag
  const isPositive = (lowerIsBetter && difference < 0) || (!lowerIsBetter && difference > 0);
  
  // Format the value based on type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'percent':
        return `${(val * 100).toFixed(decimals)}%`;
      case 'currency':
        return `$${val.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}`;
      case 'number':
      default:
        return val.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-100">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{formatValue(value)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Avg: {formatValue(average)}
          </span>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            <span className="text-xs font-medium">{percentageText}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HomeIntroduction;
