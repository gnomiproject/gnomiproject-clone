
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from './ReportIntroduction';
import WelcomeCard from './introduction/WelcomeCard';
import MetricCardsGrid from './introduction/MetricCardsGrid';
import ReportDiscoveryCard from './introduction/ReportDiscoveryCard';

interface HomeIntroductionProps {
  userData: any;
  archetypeData: any;
  averageData?: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // Get key values
  const archetypeId = archetypeData?.id || archetypeData?.archetype_id || 'a1';
  const archetypeName = archetypeData?.name || archetypeData?.archetype_name || 'Unknown Archetype';
  const matchPercentage = userData?.assessment_result?.percentageMatch || 85;
  const userName = userData?.name || 'Healthcare Leader';
  const familyName = archetypeData?.family_name || archetypeData?.familyName || 'Unknown Family';
  const shortDescription = archetypeData?.short_description || 'An archetype focused on optimizing healthcare management';
  
  // Prepare metrics for the grid
  const metrics = {
    cost: {
      name: "Total Cost PEPY",
      value: archetypeData?.["Cost_Medical & RX Paid Amount PEPY"] || 0,
      average: averageData?.medicalRxPaidAmountPEPY || 15000
    },
    risk: {
      name: "Risk Score",
      value: archetypeData?.["Risk_Average Risk Score"] || 0,
      average: averageData?.averageRiskScore || 1.0
    },
    emergency: {
      name: "ER Visits per 1K",
      value: archetypeData?.["Util_Emergency Visits per 1k Members"] || 0,
      average: averageData?.emergencyVisitsPer1k || 150
    },
    specialist: {
      name: "Specialist Visits per 1K",
      value: archetypeData?.["Util_Specialist Visits per 1k Members"] || 0,
      average: averageData?.specialistVisitsPer1k || 2500
    }
  };

  return (
    <div>
      {/* Report Introduction */}
      <ReportIntroduction 
        userData={userData} 
        reportData={archetypeData}
        archetypeId={archetypeId}
        archetypeName={archetypeName}
        familyName={familyName}
        shortDescription={shortDescription}
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
        />
      </div>
      
      {/* Key Metrics Grid */}
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
