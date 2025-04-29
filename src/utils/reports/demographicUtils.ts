
/**
 * Utilities for working with demographic data
 */

/**
 * Ensures that a value is represented as an array
 * @param data Any data that should be treated as an array
 * @returns An array representation of the data
 */
export const ensureArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      // Try to parse JSON string
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [data];
    } catch (e) {
      // If not JSON, treat as a single string item
      return [data];
    }
  }
  return data ? [data] : [];
};

/**
 * Format demographic insights into a structured format
 * @param insights Raw insights text or array
 * @returns Formatted insights for display
 */
export const formatDemographicInsights = (insights: string | string[]): string[] => {
  if (!insights) return ["No demographic insights available."];
  
  if (Array.isArray(insights)) {
    return insights;
  }
  
  // If it's a string, split by paragraphs or bullet points
  return insights
    .split(/\n|•/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/**
 * Get a descriptive text for geographic distribution
 * @param states Number of states
 * @param averageStates Average number of states across archetypes
 * @returns A descriptive string about geographic distribution
 */
export const getGeographicDescription = (states: number, averageStates: number): string => {
  if (states >= 40) {
    return "This archetype has a nationwide presence, requiring benefits strategies that work across many different regional healthcare systems.";
  } else if (states > averageStates) {
    return "This archetype has a wider than average geographic distribution, which can create challenges for consistent benefits administration across regions.";
  } else if (states > 10) {
    return "This archetype has a moderate geographic footprint, with operations across multiple regions requiring coordinated benefits strategies.";
  } else {
    return "This archetype has a concentrated geographic presence, which may allow for more regionally-targeted benefits strategies.";
  }
};

/**
 * Get an appropriate description for workforce age
 * @param averageAge Average age of the workforce
 * @param industryAverage Industry average age for comparison
 * @returns A descriptive string about workforce age demographics
 */
export const getAgeDescription = (averageAge: number, industryAverage: number): string => {
  const diff = averageAge - industryAverage;
  
  if (diff > 5) {
    return "This workforce is notably older than industry average, suggesting higher healthcare utilization and potentially higher prevalence of chronic conditions.";
  } else if (diff < -5) {
    return "This workforce is notably younger than industry average, potentially requiring different benefits strategies focused on preventative care and family planning.";
  } else {
    return "This workforce age aligns with industry averages, suggesting typical age-related healthcare needs.";
  }
};
