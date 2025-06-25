
import { ArchetypeDetailedData } from '@/types/archetype';

export const useTabDataAvailability = (reportData: ArchetypeDetailedData | null) => {
  const hasStrengthsData = !!(reportData?.strengths && Array.isArray(reportData.strengths));
  const hasChallengesData = !!(reportData?.biggest_challenges && Array.isArray(reportData.biggest_challenges));
  const hasOpportunitiesData = !!(reportData?.best_opportunities && Array.isArray(reportData.best_opportunities));
  const hasPitfallsData = !!(reportData?.potential_pitfalls && Array.isArray(reportData.potential_pitfalls));

  return {
    hasStrengthsData,
    hasChallengesData,
    hasOpportunitiesData,
    hasPitfallsData
  };
};
