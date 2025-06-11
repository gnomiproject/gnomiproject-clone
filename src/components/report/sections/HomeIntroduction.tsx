
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from './ReportIntroduction';
import WelcomeCard from './introduction/WelcomeCard';
import MetricCardsGrid from './introduction/MetricCardsGrid';
import ExecutiveSummaryCard from './introduction/ExecutiveSummaryCard';
import ReportDiscoveryCard from './introduction/ReportDiscoveryCard';
import { averageDataService } from '@/services/AverageDataService';

interface HomeIntroductionProps {
  userData: any;
  archetypeData: any;
  averageData?: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // COMPREHENSIVE DEBUG LOGGING - Enhanced for data validation
  console.log('=== HomeIntroduction DEBUG START ===');
  console.log('[HomeIntroduction] Full userData object:', userData);
  console.log('[HomeIntroduction] userData type:', typeof userData);
  console.log('[HomeIntroduction] userData is null:', userData === null);
  console.log('[HomeIntroduction] userData is undefined:', userData === undefined);
  
  // NEW: Enhanced averageData validation and logging
  console.log('[HomeIntroduction] averageData received:', averageData);
  console.log('[HomeIntroduction] averageData type:', typeof averageData);
  if (averageData) {
    console.log('[HomeIntroduction] averageData keys:', Object.keys(averageData));
    console.log('[HomeIntroduction] averageData demo fields:', {
      percentFemale: averageData["Demo_Average Percent Female"],
      age: averageData["Demo_Average Age"],
      familySize: averageData["Demo_Average Family Size"],
      employees: averageData["Demo_Average Employees"]
    });
    console.log('[HomeIntroduction] averageData cost fields:', {
      costPEPY: averageData["Cost_Medical & RX Paid Amount PEPY"],
      costPMPY: averageData["Cost_Medical & RX Paid Amount PMPY"],
      riskScore: averageData["Risk_Average Risk Score"]
    });
  }
  
  // Check if we're using fallback data from the service
  const isUsingServiceFallback = averageDataService.isUsingFallbackData();
  console.log('[HomeIntroduction] AverageDataService using fallback:', isUsingServiceFallback);
  
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

  // NEW: Validate that we have the expected average data fields
  const requiredAverageFields = [
    "Demo_Average Percent Female",
    "Demo_Average Age", 
    "Demo_Average Family Size",
    "Cost_Medical & RX Paid Amount PEPY",
    "Risk_Average Risk Score",
    "Util_Emergency Visits per 1k Members",
    "Util_Specialist Visits per 1k Members"
  ];
  
  const missingFields = requiredAverageFields.filter(field => 
    safeAverageData[field] === undefined || safeAverageData[field] === null
  );
  
  if (missingFields.length > 0) {
    console.warn('[HomeIntroduction] Missing average data fields:', missingFields);
    console.warn('[HomeIntroduction] This may cause fallback values to be used');
  }

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
  
  // FIXED: Use exact database field names with CORRECTED fallback values from AverageDataService
  const getAverageDataFallback = () => {
    // Use the same fallback values as AverageDataService for consistency
    return {
      "Cost_Medical & RX Paid Amount PEPY": 13440,  // CORRECTED: was 15000
      "Risk_Average Risk Score": 0.95,
      "Util_Emergency Visits per 1k Members": 135,  // CORRECTED: was 150
      "Util_Specialist Visits per 1k Members": 2250 // CORRECTED: was 2500
    };
  };
  
  const fallbackAverages = getAverageDataFallback();
  
  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: safeArchetypeData?.["Cost_Medical & RX Paid Amount PEPY"] || 12000,
      average: safeAverageData?.["Cost_Medical & RX Paid Amount PEPY"] || fallbackAverages["Cost_Medical & RX Paid Amount PEPY"]
    },
    risk: {
      name: "Risk Score",
      value: safeArchetypeData?.["Risk_Average Risk Score"] || 1.0,
      average: safeAverageData?.["Risk_Average Risk Score"] || fallbackAverages["Risk_Average Risk Score"]
    },
    emergency: {
      name: "ER Visits per 1K",
      value: safeArchetypeData?.["Util_Emergency Visits per 1k Members"] || 120,
      average: safeAverageData?.["Util_Emergency Visits per 1k Members"] || fallbackAverages["Util_Emergency Visits per 1k Members"]
    },
    specialist: {
      name: "Specialist Visits per 1K",
      value: safeArchetypeData?.["Util_Specialist Visits per 1k Members"] || 2200,
      average: safeAverageData?.["Util_Specialist Visits per 1k Members"] || fallbackAverages["Util_Specialist Visits per 1k Members"]
    }
  };

  // NEW: Log which values are using fallbacks vs real data
  console.log('[HomeIntroduction] Metrics data source analysis:', {
    cost: {
      usingFallback: !safeAverageData?.["Cost_Medical & RX Paid Amount PEPY"],
      value: metrics.cost.average,
      source: safeAverageData?.["Cost_Medical & RX Paid Amount PEPY"] ? 'database' : 'fallback'
    },
    risk: {
      usingFallback: !safeAverageData?.["Risk_Average Risk Score"],
      value: metrics.risk.average,
      source: safeAverageData?.["Risk_Average Risk Score"] ? 'database' : 'fallback'
    },
    emergency: {
      usingFallback: !safeAverageData?.["Util_Emergency Visits per 1k Members"],
      value: metrics.emergency.average,
      source: safeAverageData?.["Util_Emergency Visits per 1k Members"] ? 'database' : 'fallback'
    },
    specialist: {
      usingFallback: !safeAverageData?.["Util_Specialist Visits per 1k Members"],
      value: metrics.specialist.average,
      source: safeAverageData?.["Util_Specialist Visits per 1k Members"] ? 'database' : 'fallback'
    }
  });

  console.log('[HomeIntroduction] Final processed metrics with consistent averages:', {
    hasDistinctiveMetrics: Array.isArray(keyInsights) ? keyInsights.length > 0 : false,
    averageDataSource: isUsingServiceFallback ? 'fallback' : 'database',
    costPEPYAverage: metrics.cost.average,
    riskScoreAverage: metrics.risk.average
  });

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
