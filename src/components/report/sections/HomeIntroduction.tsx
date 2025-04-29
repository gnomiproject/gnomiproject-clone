
import React from 'react';
import { ReportUserData } from '@/hooks/useReportUserData';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import WelcomeCard from './introduction/WelcomeCard';
import ArchetypeOverviewCard from './introduction/ArchetypeOverviewCard';
import MetricCardsGrid from './introduction/MetricCardsGrid';
import ReportDiscoveryCard from './introduction/ReportDiscoveryCard';
import GnomePlaceholder from './introduction/GnomePlaceholder';

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

  // Extract key metrics for metrics grid component
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
          <WelcomeCard
            userName={userName}
            archetypeName={archetypeName}
            matchPercentage={matchPercentage}
            secondaryArchetype={secondaryArchetype}
          />
        </div>
        
        {/* Archetype Overview */}
        <div className="mb-10">
          <SectionTitle 
            title="Archetype Overview" 
            subtitle="Understanding your organization's healthcare profile"
          />
          
          <ArchetypeOverviewCard
            shortDescription={shortDescription}
            characteristics={characteristics}
          />
        </div>
        
        {/* Key Metrics Preview */}
        <div className="mb-10" id="metrics-overview">
          <SectionTitle 
            title="Key Metrics At a Glance" 
            subtitle="See how your organization compares to the population average"
          />
          
          <MetricCardsGrid metrics={metrics} />
        </div>
        
        {/* What You'll Discover Section */}
        <div className="mb-6">
          <ReportDiscoveryCard />
        </div>
      </div>
    </Section>
  );
};

export default HomeIntroduction;
