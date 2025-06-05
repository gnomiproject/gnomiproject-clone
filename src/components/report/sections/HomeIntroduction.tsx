
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
  // COMPREHENSIVE DEBUG LOGGING
  console.log('=== HomeIntroduction DEBUG START ===');
  console.log('[HomeIntroduction] Full userData object:', userData);
  console.log('[HomeIntroduction] userData type:', typeof userData);
  console.log('[HomeIntroduction] userData is null:', userData === null);
  console.log('[HomeIntroduction] userData is undefined:', userData === undefined);
  
  if (userData) {
    console.log('[HomeIntroduction] userData keys:', Object.keys(userData));
    console.log('[HomeIntroduction] userData.name:', userData.name);
    console.log('[HomeIntroduction] userData.organization:', userData.organization);
    console.log('[HomeIntroduction] userData.assessment_result:', userData.assessment_result);
    
    // Check for various possible property paths
    const possibleNamePaths = [
      userData.name,
      userData.user_name,
      userData.full_name,
      userData.display_name,
      userData?.assessment_result?.name,
      userData?.assessment_result?.user_name,
      userData?.assessment_result?.userData?.name,
      userData?.profile?.name,
      userData?.userProfile?.name
    ];
    
    const possibleOrgPaths = [
      userData.organization,
      userData.company,
      userData.organization_name,
      userData?.assessment_result?.organization,
      userData?.assessment_result?.company,
      userData?.assessment_result?.userData?.organization,
      userData?.profile?.organization,
      userData?.userProfile?.organization
    ];
    
    console.log('[HomeIntroduction] Possible name values:', possibleNamePaths.filter(Boolean));
    console.log('[HomeIntroduction] Possible org values:', possibleOrgPaths.filter(Boolean));
  }
  
  console.log('[HomeIntroduction] archetypeData sample:', archetypeData ? {
    id: archetypeData.id || archetypeData.archetype_id,
    name: archetypeData.name || archetypeData.archetype_name
  } : 'No archetype data');
  console.log('=== HomeIntroduction DEBUG END ===');

  // Ensure we always have fallback data
  const safeUserData = userData || {};
  const safeArchetypeData = archetypeData || {};
  const safeAverageData = averageData || {};

  // Try multiple possible paths for user name with comprehensive fallback logic
  let userName = null;
  
  // Check direct properties first
  if (safeUserData.name) userName = safeUserData.name;
  else if (safeUserData.user_name) userName = safeUserData.user_name;
  else if (safeUserData.full_name) userName = safeUserData.full_name;
  else if (safeUserData.display_name) userName = safeUserData.display_name;
  
  // Check nested assessment_result paths
  else if (safeUserData.assessment_result?.name) userName = safeUserData.assessment_result.name;
  else if (safeUserData.assessment_result?.user_name) userName = safeUserData.assessment_result.user_name;
  else if (safeUserData.assessment_result?.userData?.name) userName = safeUserData.assessment_result.userData.name;
  
  // Check profile paths
  else if (safeUserData.profile?.name) userName = safeUserData.profile.name;
  else if (safeUserData.userProfile?.name) userName = safeUserData.userProfile.name;
  
  // Final fallback
  if (!userName) userName = 'Healthcare Professional';

  // Try multiple possible paths for organization
  let userOrganization = null;
  
  // Check direct properties first
  if (safeUserData.organization) userOrganization = safeUserData.organization;
  else if (safeUserData.company) userOrganization = safeUserData.company;
  else if (safeUserData.organization_name) userOrganization = safeUserData.organization_name;
  
  // Check nested assessment_result paths
  else if (safeUserData.assessment_result?.organization) userOrganization = safeUserData.assessment_result.organization;
  else if (safeUserData.assessment_result?.company) userOrganization = safeUserData.assessment_result.company;
  else if (safeUserData.assessment_result?.userData?.organization) userOrganization = safeUserData.assessment_result.userData.organization;
  
  // Check profile paths
  else if (safeUserData.profile?.organization) userOrganization = safeUserData.profile.organization;
  else if (safeUserData.userProfile?.organization) userOrganization = safeUserData.userProfile.organization;

  console.log('[HomeIntroduction] Final extracted values:', {
    extractedName: userName,
    extractedOrganization: userOrganization,
    usedFallbackName: userName === 'Healthcare Professional',
    hasOrganization: !!userOrganization
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
