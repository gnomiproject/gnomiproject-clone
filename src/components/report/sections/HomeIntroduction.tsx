
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
  // CRITICAL DEBUG LOGGING - Focus on averageData investigation
  console.log('=== HomeIntroduction CRITICAL DEBUG START ===');
  console.log('[HomeIntroduction] Raw props received:', {
    hasUserData: !!userData,
    hasArchetypeData: !!archetypeData,
    hasAverageData: !!averageData,
    averageDataType: typeof averageData,
    averageDataKeys: averageData ? Object.keys(averageData).length : 0
  });

  // Log the specific average data values we need
  if (averageData) {
    const criticalFields = [
      "Cost_Medical & RX Paid Amount PEPY",
      "Risk_Average Risk Score", 
      "Util_Emergency Visits per 1k Members",
      "Util_Specialist Visits per 1k Members"
    ];
    
    console.log('[HomeIntroduction] CRITICAL FIELD VALUES:');
    criticalFields.forEach(field => {
      const value = averageData[field];
      console.log(`  ${field}: ${value} (type: ${typeof value}, exists: ${value !== undefined})`);
    });
    
    // Check if it's using fallback data
    const isUsingFallback = averageDataService.isUsingFallbackData();
    console.log('[HomeIntroduction] AverageDataService using fallback:', isUsingFallback);
  } else {
    console.error('[HomeIntroduction] ❌ NO AVERAGE DATA RECEIVED - This is the problem!');
  }

  // Ensure we always have fallback data
  const safeUserData = userData || {};
  const safeArchetypeData = archetypeData || {};
  const safeAverageData = averageData || {};

  // FIXED: Extract user data with comprehensive fallback logic
  let userName = null;
  if (safeUserData.name) userName = safeUserData.name;
  else if (safeUserData.user_name) userName = safeUserData.user_name;
  else if (safeUserData.full_name) userName = safeUserData.full_name;
  else if (safeUserData.display_name) userName = safeUserData.display_name;
  else if (safeUserData.assessment_result?.name) userName = safeUserData.assessment_result.name;
  else if (safeUserData.assessment_result?.user_name) userName = safeUserData.assessment_result.user_name;
  else if (safeUserData.assessment_result?.userData?.name) userName = safeUserData.assessment_result.userData.name;
  else if (safeUserData.profile?.name) userName = safeUserData.profile.name;
  else if (safeUserData.userProfile?.name) userName = safeUserData.userProfile.name;
  if (!userName) userName = 'Healthcare Professional';

  let userOrganization = null;
  if (safeUserData.organization) userOrganization = safeUserData.organization;
  else if (safeUserData.company) userOrganization = safeUserData.company;
  else if (safeUserData.organization_name) userOrganization = safeUserData.organization_name;
  else if (safeUserData.assessment_result?.organization) userOrganization = safeUserData.assessment_result.organization;
  else if (safeUserData.assessment_result?.company) userOrganization = safeUserData.assessment_result.company;
  else if (safeUserData.assessment_result?.userData?.organization) userOrganization = safeUserData.assessment_result.userData.organization;
  else if (safeUserData.profile?.organization) userOrganization = safeUserData.profile.organization;
  else if (safeUserData.userProfile?.organization) userOrganization = safeUserData.userProfile.organization;

  console.log('[HomeIntroduction] Final extracted user values:', {
    extractedName: userName,
    extractedOrganization: userOrganization,
    usedFallbackName: userName === 'Healthcare Professional',
    hasOrganization: !!userOrganization
  });

  // Get key archetype values with safe fallbacks
  const archetypeId = safeArchetypeData?.id || safeArchetypeData?.archetype_id || 'a1';
  const archetypeName = safeArchetypeData?.name || safeArchetypeData?.archetype_name || 'Healthcare Archetype';
  const matchPercentage = safeUserData?.assessment_result?.percentageMatch || 85;
  const familyName = safeArchetypeData?.family_name || safeArchetypeData?.familyName || 'Healthcare Family';
  const shortDescription = safeArchetypeData?.short_description || 'An archetype focused on optimizing healthcare management';
  const organizationSize = safeUserData?.exact_employee_count || safeUserData?.assessment_result?.exactData?.employeeCount;
  
  // Extract executive summary and key insights with fallbacks
  const executiveSummary = safeArchetypeData?.executive_summary;
  const keyInsights = safeArchetypeData?.key_findings || [];

  // CRITICAL FIX: Use actual averageData values, not hardcoded fallbacks
  const getAverageValue = (fieldName: string, hardcodedFallback: number) => {
    // First try to get the value from averageData
    if (safeAverageData && safeAverageData[fieldName] !== undefined && safeAverageData[fieldName] !== null) {
      const value = safeAverageData[fieldName];
      console.log(`[HomeIntroduction] ✅ Using REAL average for ${fieldName}: ${value}`);
      return value;
    }
    
    // Only use hardcoded fallback if no data is available
    console.warn(`[HomeIntroduction] ⚠️ Using FALLBACK average for ${fieldName}: ${hardcodedFallback}`);
    return hardcodedFallback;
  };

  // CRITICAL FIX: Extract archetype values from the correct data source
  const getArchetypeValue = (fieldName: string, fallbackValue: number) => {
    // Try archetypeData first
    if (safeArchetypeData && safeArchetypeData[fieldName] !== undefined && safeArchetypeData[fieldName] !== null) {
      const value = safeArchetypeData[fieldName];
      console.log(`[HomeIntroduction] ✅ Using archetype value for ${fieldName}: ${value}`);
      return value;
    }
    
    console.warn(`[HomeIntroduction] ⚠️ Using fallback archetype value for ${fieldName}: ${fallbackValue}`);
    return fallbackValue;
  };

  // FIXED: Build metrics using actual data, not hardcoded values
  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: getArchetypeValue("Cost_Medical & RX Paid Amount PEPY", 12000),
      average: getAverageValue("Cost_Medical & RX Paid Amount PEPY", 13440)
    },
    risk: {
      name: "Risk Score", 
      value: getArchetypeValue("Risk_Average Risk Score", 1.0),
      average: getAverageValue("Risk_Average Risk Score", 0.95)
    },
    emergency: {
      name: "ER Visits per 1K",
      value: getArchetypeValue("Util_Emergency Visits per 1k Members", 120),
      average: getAverageValue("Util_Emergency Visits per 1k Members", 135)
    },
    specialist: {
      name: "Specialist Visits per 1K", 
      value: getArchetypeValue("Util_Specialist Visits per 1k Members", 2200),
      average: getAverageValue("Util_Specialist Visits per 1k Members", 2250)
    }
  };

  // COMPREHENSIVE VALIDATION: Log final metric values
  console.log('[HomeIntroduction] FINAL METRICS USED:', {
    cost: { 
      archetype: metrics.cost.value, 
      average: metrics.cost.average,
      isCorrectAverage: metrics.cost.average === 13440
    },
    risk: { 
      archetype: metrics.risk.value, 
      average: metrics.risk.average,
      isCorrectAverage: metrics.risk.average === 0.95
    },
    emergency: { 
      archetype: metrics.emergency.value, 
      average: metrics.emergency.average,
      isCorrectAverage: metrics.emergency.average === 135
    },
    specialist: { 
      archetype: metrics.specialist.value, 
      average: metrics.specialist.average,
      isCorrectAverage: metrics.specialist.average === 2250
    }
  });

  // Alert if wrong averages are being used
  const incorrectAverages = [];
  if (metrics.cost.average !== 13440) incorrectAverages.push(`Cost: ${metrics.cost.average} ≠ 13440`);
  if (metrics.risk.average !== 0.95) incorrectAverages.push(`Risk: ${metrics.risk.average} ≠ 0.95`);
  if (metrics.emergency.average !== 135) incorrectAverages.push(`Emergency: ${metrics.emergency.average} ≠ 135`);
  if (metrics.specialist.average !== 2250) incorrectAverages.push(`Specialist: ${metrics.specialist.average} ≠ 2250`);

  if (incorrectAverages.length > 0) {
    console.error('[HomeIntroduction] 🚨 WRONG AVERAGES DETECTED:', incorrectAverages);
    console.error('[HomeIntroduction] This indicates averageData is not being passed correctly!');
    console.error('[HomeIntroduction] Raw averageData:', safeAverageData);
  } else {
    console.log('[HomeIntroduction] ✅ All average values are CORRECT!');
  }

  console.log('=== HomeIntroduction CRITICAL DEBUG END ===');

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
