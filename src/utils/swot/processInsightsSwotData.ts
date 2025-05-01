
import { ArchetypeDetailedData } from "@/types/archetype";

/**
 * Processes SWOT data from the level3_report_secure table for the Insights page
 * Handles multiple potential data formats:
 * 1. Direct string arrays
 * 2. JSON string representations of arrays
 * 3. Array inside an object structure
 * 4. Single string values (converts to array with one item)
 * 
 * @param archetypeData The archetype data from level3_report_secure
 * @returns Processed SWOT data as string arrays
 */
export const processInsightsSwotData = (archetypeData: ArchetypeDetailedData): {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
} => {
  // Log the input data types for debugging
  console.log("[processInsightsSwotData] Processing data from level3_report_secure:", {
    hasStrengths: !!archetypeData.strengths,
    hasWeaknesses: !!archetypeData.weaknesses,
    hasOpportunities: !!archetypeData.opportunities,
    hasThreats: !!archetypeData.threats,
    strengthsType: typeof archetypeData.strengths
  });

  // Helper function to parse different potential data formats
  const parseSwotData = (data: any): string[] => {
    try {
      if (!data) {
        return []; // No data available
      }
      
      // If it's already an array, use it
      if (Array.isArray(data)) {
        return data.map(item => String(item));
      }
      
      // If it's a string, try to parse it as JSON
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            return parsed.map(item => String(item));
          }
          // If it's a JSON object but not an array, convert to string
          return [data];
        } catch {
          // Not valid JSON, treat as a single string
          return [data];
        }
      }
      
      // If it's an object with potential nested data
      if (typeof data === 'object') {
        // Check for common patterns in how SWOT data might be structured
        if (data.items && Array.isArray(data.items)) {
          return data.items.map(item => String(item));
        }
        if (data.points && Array.isArray(data.points)) {
          return data.points.map(item => String(item));
        }
        if (data.data && Array.isArray(data.data)) {
          return data.data.map(item => String(item));
        }
        // For other object structures, convert to string
        return [JSON.stringify(data)];
      }
      
      // Fallback: convert to string and return as single item
      return [String(data)];
    } catch (error) {
      console.error("Error parsing SWOT data:", error);
      return [];
    }
  };

  // Process each section
  const strengths = parseSwotData(archetypeData.strengths);
  const weaknesses = parseSwotData(archetypeData.weaknesses);
  const opportunities = parseSwotData(archetypeData.opportunities);
  const threats = parseSwotData(archetypeData.threats);

  // Log the processed results
  console.log("[processInsightsSwotData] Processed results:", {
    strengthsCount: strengths.length,
    weaknessesCount: weaknesses.length,
    opportunitiesCount: opportunities.length,
    threatsCount: threats.length
  });

  return {
    strengths,
    weaknesses,
    opportunities,
    threats
  };
};
