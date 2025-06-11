
// Utility to extract user data with comprehensive fallback logic
export const extractUserData = (userData: any) => {
  console.log('[extractUserData] Processing user data:', {
    hasUserData: !!userData,
    userDataKeys: userData ? Object.keys(userData).length : 0
  });

  let userName = null;
  if (userData?.name) userName = userData.name;
  else if (userData?.user_name) userName = userData.user_name;
  else if (userData?.full_name) userName = userData.full_name;
  else if (userData?.display_name) userName = userData.display_name;
  else if (userData?.assessment_result?.name) userName = userData.assessment_result.name;
  else if (userData?.assessment_result?.user_name) userName = userData.assessment_result.user_name;
  else if (userData?.assessment_result?.userData?.name) userName = userData.assessment_result.userData.name;
  else if (userData?.profile?.name) userName = userData.profile.name;
  else if (userData?.userProfile?.name) userName = userData.userProfile.name;
  if (!userName) userName = 'Healthcare Professional';

  let userOrganization = null;
  if (userData?.organization) userOrganization = userData.organization;
  else if (userData?.company) userOrganization = userData.company;
  else if (userData?.organization_name) userOrganization = userData.organization_name;
  else if (userData?.assessment_result?.organization) userOrganization = userData.assessment_result.organization;
  else if (userData?.assessment_result?.company) userOrganization = userData.assessment_result.company;
  else if (userData?.assessment_result?.userData?.organization) userOrganization = userData.assessment_result.userData.organization;
  else if (userData?.profile?.organization) userOrganization = userData.profile.organization;
  else if (userData?.userProfile?.organization) userOrganization = userData.userProfile.organization;

  console.log('[extractUserData] Extracted values:', {
    userName,
    userOrganization,
    usedFallbackName: userName === 'Healthcare Professional'
  });

  return { userName, userOrganization };
};

// Extract archetype data
export const extractArchetypeData = (archetypeData: any, userData: any) => {
  const archetypeId = archetypeData?.id || archetypeData?.archetype_id || 'a1';
  const archetypeName = archetypeData?.name || archetypeData?.archetype_name || 'Healthcare Archetype';
  const matchPercentage = userData?.assessment_result?.percentageMatch || 85;
  const familyName = archetypeData?.family_name || archetypeData?.familyName || 'Healthcare Family';
  const shortDescription = archetypeData?.short_description || 'An archetype focused on optimizing healthcare management';
  const organizationSize = userData?.exact_employee_count || userData?.assessment_result?.exactData?.employeeCount;
  
  const executiveSummary = archetypeData?.executive_summary;
  const keyInsights = archetypeData?.key_findings || [];

  return {
    archetypeId,
    archetypeName,
    matchPercentage,
    familyName,
    shortDescription,
    organizationSize,
    executiveSummary,
    keyInsights
  };
};
