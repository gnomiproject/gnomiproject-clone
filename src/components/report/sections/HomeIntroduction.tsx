
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from './ReportIntroduction';
import WelcomeCard from './introduction/WelcomeCard';
import MetricCardsGrid from './introduction/MetricCardsGrid';
import ExecutiveSummaryCard from './introduction/ExecutiveSummaryCard';
import ReportDiscoveryCard from './introduction/ReportDiscoveryCard';

interface HomeIntroductionProps {
  userData: any;
  archetypeData: any;
  averageData?: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // Enhanced debug logging for user data
  console.log('[HomeIntroduction] Full userData object:', userData);
  console.log('[HomeIntroduction] User data properties:', {
    name: userData?.name,
    organization: userData?.organization,
    email: userData?.email,
    assessmentResult: userData?.assessment_result,
    exactEmployeeCount: userData?.exact_employee_count,
    allKeys: userData ? Object.keys(userData) : 'No userData'
  });

  // Ensure we always have fallback data
  const safeUserData = userData || {};
  const safeArchetypeData = archetypeData || {};
  const safeAverageData = averageData || {};

  // Enhanced user name extraction with multiple fallback paths
  const userName = safeUserData?.name || 
                  safeUserData?.assessment_result?.name ||
                  safeUserData?.assessment_result?.userData?.name ||
                  'Healthcare Leader';

  // Enhanced organization extraction with multiple fallback paths  
  const userOrganization = safeUserData?.organization ||
                          safeUserData?.assessment_result?.organization ||
                          safeUserData?.assessment_result?.userData?.organization ||
                          undefined;

  console.log('[HomeIntroduction] Extracted user info:', {
    extractedName: userName,
    extractedOrganization: userOrganization,
    fallbackUsed: userName === 'Healthcare Leader'
  });

  // Get key values with safe fallbacks
  const archetypeId = safeArchetypeData?.id || safeArchetypeData?.archetype_id || 'a1';
  const archetypeName = safeArchetypeData?.name || safeArchetypeData?.archetype_name || 'Healthcare Archetype';
  const matchPercentage = safeUserData?.assessment_result?.percentageMatch || 85;
  const familyName = safeArchetypeData?.family_name || safeArchetypeData?.familyName || 'Healthcare Family';
  const shortDescription = safeArchetypeData?.short_description || 'An archetype focused on optimizing healthcare management';
  const organizationSize = safeUserData?.exact_employee_count || safeUserData?.assessment_result?.exactData?.employeeCount;
  
  // Extract executive summary and key insights with fallbacks
  const executiveSummary = safeArchetypeData?.executive_summary;
  const keyInsights = safeArchetypeData?.key_findings || [];
  
  // Use exact database field names with safe fallbacks
  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: safeArchetypeData?.["Cost_Medical & RX Paid Amount PEPY"] || 12000,
      average: safeAverageData?.["Cost_Medical & RX Paid Amount PEPY"] || 15000
    },
    risk: {
      name: "Risk Score",
      value: safeArchetypeData?.["Risk_Average Risk Score"] || 1.0,
      average: safeAverageData?.["Risk_Average Risk Score"] || 1.0
    },
    emergency: {
      name: "ER Visits per 1K",
      value: safeArchetypeData?.["Util_Emergency Visits per 1k Members"] || 120,
      average: safeAverageData?.["Util_Emergency Visits per 1k Members"] || 150
    },
    specialist: {
      name: "Specialist Visits per 1K",
      value: safeArchetypeData?.["Util_Specialist Visits per 1k Members"] || 2200,
      average: safeAverageData?.["Util_Specialist Visits per 1k Members"] || 2500
    }
  };

  console.log('[HomeIntroduction] Processed metrics:', metrics);

  return (
    <div className="mb-8">
      {/* Report Introduction with proper user data */}
      <ReportIntroduction 
        userData={safeUserData} 
        reportData={safeArchetypeData}
        archetypeId={archetypeId}
        archetypeName={archetypeName}
        familyName={familyName}
        shortDescription={shortDescription}
        userName={userName}
        userOrganization={userOrganization}
      />
      
      {/* Introduction Section Title */}
      <SectionTitle 
        title="Introduction" 
        subtitle={`Welcome to your ${archetypeName} Deep Dive Report`} 
        className="mt-8"
      />
      
      {/* Welcome Card with proper user name */}
      <div className="mb-6">
        <WelcomeCard 
          userName={userName}
          archetypeName={archetypeName}
          archetypeId={archetypeId}
          matchPercentage={matchPercentage}
          secondaryArchetype={safeUserData?.assessment_result?.secondaryArchetype?.name}
          organizationSize={organizationSize}
        />
      </div>
      
      {/* Executive Summary Card - Always show with fallback content */}
      <div className="mb-6">
        <ExecutiveSummaryCard 
          executiveSummary={executiveSummary}
          archetypeName={archetypeName}
          keyInsights={Array.isArray(keyInsights) ? keyInsights : []}
        />
      </div>
      
      {/* Key Metrics Grid with enhanced comparisons */}
      <div className="mb-8">
        <MetricCardsGrid metrics={metrics} />
      </div>
      
      {/* Report Discovery Card */}
      <div className="mb-8">
        <ReportDiscoveryCard />
      </div>
    </div>
  );
};

export default HomeIntroduction;
