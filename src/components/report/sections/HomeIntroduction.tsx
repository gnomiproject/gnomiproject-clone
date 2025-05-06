
import React from 'react';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';
import ReportIntroduction from './ReportIntroduction';
import WelcomeCard from './introduction/WelcomeCard';
import ArchetypeInsightsCard from './introduction/ArchetypeInsightsCard';
import WebsiteImage from '@/components/common/WebsiteImage';

interface HomeIntroductionProps {
  userData: any;
  archetypeData: any;
  averageData?: any;
}

/**
 * HomeIntroduction - The first section of the report
 * 
 * This component presents a welcome message and overview of the archetype
 * with key findings and characteristics. It shows:
 * 1. A section title
 * 2. A personalized welcome message
 * 3. Key insights about the archetype
 */
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
  
  // Enhanced debug logging
  console.log('[HomeIntroduction] Rendering with data:', {
    id: archetypeId,
    name: archetypeName,
    family: familyName,
    description: shortDescription ? (shortDescription.substring(0, 50) + '...') : 'No description',
    userData: userData ? `User data present for: ${userName}` : 'No user data',
    archetypeObj: archetypeData ? 'Archetype data present' : 'No archetype data',
    keyFindings: keyFindings ? `${keyFindings.length} findings found` : 'No key findings'
  });
  
  return (
    <div className="mt-2">
      {/* Welcome Card - Explicitly placed at the very top */}
      <div className="mb-6">
        <WelcomeCard 
          userName={userName}
          archetypeName={archetypeName}
          archetypeId={archetypeId}
          matchPercentage={matchPercentage}
          secondaryArchetype={secondaryArchetype}
        />
      </div>

      {/* Main report introduction */}
      <ReportIntroduction 
        userData={userData} 
        reportData={archetypeData}
        archetypeId={archetypeId}
        archetypeName={archetypeName}
        familyName={familyName}
        shortDescription={shortDescription}
      />
      
      {/* Introduction title - Positioned after the welcome card and intro */}
      <SectionTitle 
        title="Introduction" 
        subtitle={`Welcome to your ${archetypeName} Deep Dive Report`} 
        className="mt-8"
      />
      
      {/* Insights Card */}
      <div className="mt-8 mb-8">
        <ArchetypeInsightsCard
          archetypeName={archetypeName}
          familyName={familyName}
          shortDescription={shortDescription}
          keyFindings={keyFindings}
          archetypeId={archetypeId}
        />
      </div>
      
      {/* Welcome section with gnome */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6 mt-8">
        <div className="flex items-start gap-4">
          <WebsiteImage 
            type="magnifying_glass" 
            altText="Gnome with magnifying glass"
            className="h-40 w-40 object-contain flex-shrink-0"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Let's Dive Deep</h2>
            
            <p className="text-gray-700 mb-3">
              Thanks for requesting a closer look at your healthcare archetype. This report unpacks the patterns your organization shares with others like it—based on data from hundreds of employers and millions of covered lives.
            </p>
            
            <p className="text-gray-700 mb-3">
              Inside, you'll find insights to help you understand your workforce's healthcare behaviors, compare yourself to similar companies, and explore ideas for smarter benefits decisions.
            </p>
            
            <p className="text-gray-700">
              We're excited to help you turn these insights into action. Let's get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroduction;
