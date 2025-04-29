
import React from 'react';
import { ReportUserData } from '@/hooks/useReportUserData';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculatePercentageDifference, formatPercentageDifference } from '@/utils/reports/metricUtils';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface HomeIntroductionProps {
  userData: ReportUserData | null;
  archetypeData: any;
  averageData: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // Extract user data with fallback values
  const userName = userData?.name || 'Healthcare Leader';
  const organization = userData?.organization || 'Your Organization';
  const reportDate = userData?.created_at 
    ? new Date(userData.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
  const employeeCount = userData?.exact_employee_count || 
    userData?.assessment_result?.exactData?.employeeCount || 
    1000;
  
  // Assessment results data
  const assessmentResult = userData?.assessment_result || {};
  const matchPercentage = assessmentResult?.percentageMatch || 98;
  const secondaryArchetype = assessmentResult?.secondaryArchetype || "Similar organizations";
  
  // Extract archetype information
  const archetypeName = archetypeData?.name || archetypeData?.archetype_name || 'Your Archetype';
  const archetypeId = archetypeData?.id || archetypeData?.archetype_id || '';
  const familyId = archetypeData?.family_id || '';
  const hexColor = archetypeData?.hex_color || '#3b82f6'; // Default to blue if no color provided
  const shortDescription = archetypeData?.short_description || 'Your organization has a unique healthcare profile.';
  
  // Extract key characteristics (limited to 3)
  const keyCharacteristics = archetypeData?.key_characteristics || [];
  const characteristics = Array.isArray(keyCharacteristics) 
    ? keyCharacteristics.slice(0, 3) 
    : typeof keyCharacteristics === 'string' 
      ? keyCharacteristics.split(',').slice(0, 3)
      : ['Data-driven decision making', 'Proactive health management', 'Value-based care focus'];
  
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

  return (
    <Section id="home-introduction">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/insights">Insights</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Deep Dive Report</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-6">
          {/* Gnome Image Placeholder - Left side */}
          <div className="hidden md:flex md:w-24 md:h-24 flex-shrink-0 mr-6">
            <GnomePlaceholder type="welcome" />
          </div>
          
          {/* Main Header Content */}
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              {archetypeName} Deep Dive Report
            </h1>
            <p className="mt-2 text-gray-600">
              Prepared for {organization} on {reportDate}
            </p>
            
            {employeeCount && (
              <div className="mt-3 inline-flex items-center bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                <span>Personalized for an organization with {employeeCount.toLocaleString()} employees</span>
              </div>
            )}
          </div>
          
          {/* Archetype Info Badge */}
          <div className="flex flex-col items-center md:items-end">
            <div className="text-center md:text-right">
              <span className="text-sm text-gray-500 block mb-1">Archetype ID</span>
              <span className="inline-block px-4 py-2 bg-gray-100 rounded-lg font-mono font-medium">
                {archetypeId?.toUpperCase() || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Divider with brand styling */}
        <div className="mb-10 h-1 w-full bg-gradient-to-r from-blue-500 via-[#46E0D3] to-pink-500 rounded-full"></div>
        
        {/* Welcome & Match Information */}
        <div className="mb-10">
          <Card className="p-6 border border-gray-200 bg-gradient-to-br from-white to-slate-50">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Welcome, <span className="text-primary">{userName}</span>
                </h2>
                <p className="text-gray-700">
                  We've analyzed your organization's health profile and matched you with the <strong>{archetypeName}</strong> archetype.
                </p>
                
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {matchPercentage}% match
                  </span>
                  
                  {secondaryArchetype && (
                    <span className="text-sm text-gray-600">
                      Secondary match: <span className="font-medium">{secondaryArchetype}</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <Button 
                  onClick={() => document.getElementById('metrics-overview')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full md:w-auto"
                >
                  Explore Full Report <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Archetype Overview */}
        <div className="mb-10">
          <SectionTitle 
            title="Archetype Overview" 
            subtitle="Understanding your organization's healthcare profile"
          />
          
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">About Your Archetype</h3>
                  <p className="text-gray-700">{shortDescription}</p>
                </div>
                
                {characteristics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Characteristics</h3>
                    <ul className="space-y-2">
                      {characteristics.map((characteristic, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                          </div>
                          <span>{characteristic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/3 md:border-l md:pl-6 border-slate-200">
                <h3 className="text-lg font-medium mb-3">What This Means For You</h3>
                <p className="text-gray-700 mb-4">
                  This report provides tailored insights and recommendations specific to organizations 
                  with your health profile and demographic characteristics.
                </p>
                <p className="text-sm text-gray-600">
                  By understanding your archetype, you can make more informed decisions about 
                  benefit design, wellness programs, and care management initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Metrics Preview */}
        <div className="mb-10" id="metrics-overview">
          <SectionTitle 
            title="Key Metrics At a Glance" 
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
        
        {/* What You'll Discover Section */}
        <div className="mb-6">
          <Card className="bg-slate-50 p-6 border border-slate-100">
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
            
            <div className="mt-6 flex justify-end">
              <Button className="bg-[#46E0D3] hover:bg-[#3BC0B5] text-white">
                Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};

// Helper component for gnome placeholder
const GnomePlaceholder = ({ type = 'welcome' }: { type?: string }) => {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
      <div className="text-center">
        <div className="text-xs text-gray-500">Gnome Image ({type})</div>
      </div>
    </div>
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
