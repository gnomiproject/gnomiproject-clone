
import React from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from '../ReportIntroduction';
import WelcomeCard from './WelcomeCard';
import MetricCardsGrid from './MetricCardsGrid';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import ReportDiscoveryCard from './ReportDiscoveryCard';
import MetricsValidator from './MetricsValidator';
import CacheClearButton from './CacheClearButton';
import { extractUserData, extractArchetypeData } from './utils/userDataExtraction';
import { buildMetrics } from './utils/metricExtraction';

interface HomeIntroductionProps {
  userData: any;
  archetypeData: any;
  averageData?: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // CRITICAL DEBUG LOGGING
  console.log('=== HomeIntroduction REFACTORED VERSION ===');
  console.log('[HomeIntroduction] Props received:', {
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
  } else {
    console.error('[HomeIntroduction] ❌ NO AVERAGE DATA RECEIVED - This is the problem!');
  }

  // Extract user and archetype data using utilities
  const { userName, userOrganization } = extractUserData(userData);
  const {
    archetypeId,
    archetypeName,
    matchPercentage,
    familyName,
    shortDescription,
    organizationSize,
    executiveSummary,
    keyInsights
  } = extractArchetypeData(archetypeData, userData);

  // Build metrics using the utility function
  const metrics = buildMetrics(archetypeData, averageData);

  return (
    <div className="mb-8">
      {/* Cache Clear Button - only visible in development */}
      <CacheClearButton />
      
      {/* Metrics Validator - shows warning in dev if averages are wrong */}
      <MetricsValidator metrics={metrics} />
      
      {/* Report Introduction */}
      <ReportIntroduction 
        userData={userData || {}} 
        reportData={archetypeData || {}}
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
      
      {/* Welcome Card */}
      <div className="mb-6">
        <WelcomeCard 
          userName={userName}
          archetypeName={archetypeName}
          archetypeId={archetypeId}
          matchPercentage={matchPercentage}
          secondaryArchetype={userData?.assessment_result?.secondaryArchetype?.name}
          organizationSize={organizationSize}
        />
      </div>
      
      {/* Executive Summary Card */}
      <div className="mb-6">
        <ExecutiveSummaryCard 
          executiveSummary={executiveSummary}
          archetypeName={archetypeName}
          keyInsights={Array.isArray(keyInsights) ? keyInsights : []}
        />
      </div>
      
      {/* Key Metrics Grid - NOW USING CORRECT AVERAGES */}
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
