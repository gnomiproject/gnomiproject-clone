
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from './ReportIntroduction';
import WelcomeCard from './introduction/WelcomeCard';
import ArchetypeOverviewCard from './introduction/ArchetypeOverviewCard';
import ArchetypeInsightsCard from './introduction/ArchetypeInsightsCard';

interface HomeIntroductionProps {
  userData: any;
  archetypeData: any;
  averageData?: any;
}

const HomeIntroduction = ({ userData, archetypeData, averageData }: HomeIntroductionProps) => {
  // Get key values once to avoid repetition
  const archetypeId = archetypeData?.id || archetypeData?.archetype_id || 'a1';
  const archetypeName = archetypeData?.name || archetypeData?.archetype_name || 'Unknown Archetype';
  const matchPercentage = userData?.assessment_result?.percentageMatch || 85;
  const userName = userData?.name || 'Healthcare Leader';
  const familyName = archetypeData?.family_name || archetypeData?.familyName || 'Unknown Family';
  
  // Get secondary archetype if available
  const secondaryArchetype = userData?.assessment_result?.secondaryArchetype?.name || 
                            archetypeData?.secondaryArchetype?.name || 
                            null;
  
  // Get short description with fallbacks
  const shortDescription = archetypeData?.short_description || 
                          archetypeData?.summary?.description || 
                          'An archetype focused on optimizing healthcare management';
  
  // Get key characteristics with proper handling
  const rawCharacteristics = archetypeData?.key_characteristics || 
                            archetypeData?.characteristics || 
                            archetypeData?.traits || 
                            [];
  
  // Simply convert any non-array characteristics to an array
  const characteristics = Array.isArray(rawCharacteristics) 
    ? rawCharacteristics 
    : typeof rawCharacteristics === 'string' 
      ? [rawCharacteristics] 
      : [];
      
  // Get key findings for the insights card
  const keyFindings = archetypeData?.key_findings || [
    "High overall healthcare costs, especially in pharmacy spend",
    "Above average prevalence of mental health disorders and chronic conditions",
    "High utilization of specialist and emergency services",
    "Significant gaps in preventive care and medication adherence",
    "Moderate social determinants of health challenges"
  ];
  
  // Get top strategic priority if available
  const topPriority = Array.isArray(archetypeData?.strategic_recommendations) && 
                     archetypeData.strategic_recommendations.length > 0
                     ? archetypeData.strategic_recommendations[0]
                     : "Implement integrated behavioral health programs to address mental health needs";
  
  // Debug logging
  console.log('[HomeIntroduction] Archetype data:', {
    id: archetypeId,
    name: archetypeName,
    family: familyName,
    description: shortDescription.substring(0, 50) + '...',
    userData: userData ? `User data present for: ${userName}` : 'No user data',
    archetypeObj: JSON.stringify(archetypeData).substring(0, 100) + '...',
    keyFindings: keyFindings ? `${keyFindings.length} findings found` : 'No key findings',
    topPriority: topPriority ? (typeof topPriority === 'string' ? topPriority.substring(0, 30) + '...' : 'Object') : 'No priority'
  });
  
  return (
    <Section id="introduction" className="mt-2">
      <SectionTitle 
        title="Introduction" 
        subtitle={`Welcome to your ${archetypeName} Deep Dive Report`} 
      />
      
      {/* Main report introduction */}
      <ReportIntroduction 
        userData={userData} 
        archetypeId={archetypeId}
        archetypeName={archetypeName}
        familyName={familyName}
        shortDescription={shortDescription}
      />
      
      {/* Welcome Card */}
      <div className="mt-8">
        <WelcomeCard 
          userName={userName}
          archetypeName={archetypeName}
          archetypeId={archetypeId}
          matchPercentage={matchPercentage}
          secondaryArchetype={secondaryArchetype}
        />
      </div>
      
      {/* Archetype Insights Card - Now with added visibility styling */}
      <div className="mt-6 mb-6">
        <ArchetypeInsightsCard
          archetypeName={archetypeName}
          familyName={familyName}
          shortDescription={shortDescription}
          keyFindings={keyFindings}
          topPriority={typeof topPriority === 'string' ? topPriority : topPriority?.title || topPriority?.description}
        />
      </div>
      
      {/* Archetype Overview Card */}
      <div className="mt-6">
        <ArchetypeOverviewCard 
          shortDescription={shortDescription}
          characteristics={characteristics}
          archetypeId={archetypeId}
        />
      </div>
    </Section>
  );
};

export default HomeIntroduction;
