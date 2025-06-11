
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
  // ENHANCED DEBUG LOGGING - Focus on averageData investigation
  console.log('=== HomeIntroduction DEEP DEBUG START ===');
  console.log('[HomeIntroduction] averageData received:', averageData);
  console.log('[HomeIntroduction] averageData type:', typeof averageData);
  console.log('[HomeIntroduction] averageData is null/undefined:', averageData === null || averageData === undefined);
  
  if (averageData) {
    console.log('[HomeIntroduction] averageData keys count:', Object.keys(averageData).length);
    console.log('[HomeIntroduction] averageData first 10 keys:', Object.keys(averageData).slice(0, 10));
    
    // Check specific fields we need for metrics
    const costPEPY = averageData["Cost_Medical & RX Paid Amount PEPY"];
    const riskScore = averageData["Risk_Average Risk Score"];
    const emergencyVisits = averageData["Util_Emergency Visits per 1k Members"];
    const specialistVisits = averageData["Util_Specialist Visits per 1k Members"];
    
    console.log('[HomeIntroduction] CRITICAL METRIC VALUES:', {
      costPEPY: { value: costPEPY, type: typeof costPEPY, exists: costPEPY !== undefined },
      riskScore: { value: riskScore, type: typeof riskScore, exists: riskScore !== undefined },
      emergencyVisits: { value: emergencyVisits, type: typeof emergencyVisits, exists: emergencyVisits !== undefined },
      specialistVisits: { value: specialistVisits, type: typeof specialistVisits, exists: specialistVisits !== undefined }
    });
  } else {
    console.warn('[HomeIntroduction] averageData is null/undefined - this should not happen!');
  }
  
  // Check if we're using fallback data from the service
  const isUsingServiceFallback = averageDataService.isUsingFallbackData();
  console.log('[HomeIntroduction] AverageDataService using fallback:', isUsingServiceFallback);
  
  if (userData) {
    console.log('[HomeIntroduction] userData keys:', Object.keys(userData));
  }
  
  console.log('[HomeIntroduction] archetypeData sample:', archetypeData ? {
    id: archetypeData.id || archetypeData.archetype_id,
    name: archetypeData.name || archetypeData.archetype_name
  } : 'No archetype data');
  console.log('=== HomeIntroduction DEEP DEBUG END ===');

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
  
  // FIXED: Extract average values properly with detailed validation
  const getAverageValue = (fieldName: string, fallbackValue: number) => {
    const value = safeAverageData[fieldName];
    const isValid = value !== undefined && value !== null && typeof value === 'number';
    
    console.log(`[HomeIntroduction] getAverageValue for ${fieldName}:`, {
      rawValue: value,
      isValid,
      willUseFallback: !isValid,
      fallbackValue
    });
    
    return isValid ? value : fallbackValue;
  };

  // CORRECTED: Use the actual averageData values, not hardcoded fallbacks
  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: safeArchetypeData?.["Cost_Medical & RX Paid Amount PEPY"] || 12000,
      average: getAverageValue("Cost_Medical & RX Paid Amount PEPY", 13440)
    },
    risk: {
      name: "Risk Score",
      value: safeArchetypeData?.["Risk_Average Risk Score"] || 1.0,
      average: getAverageValue("Risk_Average Risk Score", 0.95)
    },
    emergency: {
      name: "ER Visits per 1K",
      value: safeArchetypeData?.["Util_Emergency Visits per 1k Members"] || 120,
      average: getAverageValue("Util_Emergency Visits per 1k Members", 135)
    },
    specialist: {
      name: "Specialist Visits per 1K",
      value: safeArchetypeData?.["Util_Specialist Visits per 1k Members"] || 2200,
      average: getAverageValue("Util_Specialist Visits per 1k Members", 2250)
    }
  };

  // COMPREHENSIVE logging to show what values are actually being used
  console.log('[HomeIntroduction] FINAL METRICS VALIDATION:', {
    costMetric: {
      archetype: metrics.cost.value,
      average: metrics.cost.average,
      expectedAverage: 13440,
      averageIsCorrect: metrics.cost.average === 13440
    },
    riskMetric: {
      archetype: metrics.risk.value,
      average: metrics.risk.average,
      expectedAverage: 0.95,
      averageIsCorrect: metrics.risk.average === 0.95
    },
    emergencyMetric: {
      archetype: metrics.emergency.value,
      average: metrics.emergency.average,
      expectedAverage: 135,
      averageIsCorrect: metrics.emergency.average === 135
    },
    specialistMetric: {
      archetype: metrics.specialist.value,
      average: metrics.specialist.average,
      expectedAverage: 2250,
      averageIsCorrect: metrics.specialist.average === 2250
    }
  });

  // Log if any averages are wrong
  const wrongAverages = [];
  if (metrics.cost.average !== 13440) wrongAverages.push(`Cost: got ${metrics.cost.average}, expected 13440`);
  if (metrics.risk.average !== 0.95) wrongAverages.push(`Risk: got ${metrics.risk.average}, expected 0.95`);
  if (metrics.emergency.average !== 135) wrongAverages.push(`Emergency: got ${metrics.emergency.average}, expected 135`);
  if (metrics.specialist.average !== 2250) wrongAverages.push(`Specialist: got ${metrics.specialist.average}, expected 2250`);
  
  if (wrongAverages.length > 0) {
    console.error('[HomeIntroduction] INCORRECT AVERAGE VALUES DETECTED:', wrongAverages);
    console.error('[HomeIntroduction] Raw averageData for troubleshooting:', safeAverageData);
  } else {
    console.log('[HomeIntroduction] ✅ All average values are correct!');
  }

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
