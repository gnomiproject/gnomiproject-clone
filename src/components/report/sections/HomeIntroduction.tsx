
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from './ReportIntroduction';
import WelcomeCard from './introduction/WelcomeCard';
import ArchetypeOverviewCard from './introduction/ArchetypeOverviewCard';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

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
  
  // Normalize characteristics array
  const characteristics = normalizeSwotData(rawCharacteristics);
  
  // Debug logging
  console.log('[HomeIntroduction] Archetype data:', {
    id: archetypeId,
    name: archetypeName,
    family: familyName,
    description: shortDescription.substring(0, 50) + '...'
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
