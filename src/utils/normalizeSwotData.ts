import { Json } from '@/integrations/supabase/types';

// Types for SWOT data
interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * Normalizes SWOT data from different sources into a consistent format
 * 
 * Handles:
 * 1. Direct array properties (strengths, weaknesses, etc.)
 * 2. Nested swot_analysis object with array properties
 * 3. JSON string arrays that need parsing
 * 4. Converting single strings to arrays
 * 
 * @param data The source data that might contain SWOT information
 * @returns Normalized SWOT data with consistent array properties
 */
export function normalizeSwotData(data: any): SwotData {
  // Initialize default empty result
  const result: SwotData = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };
  
  if (!data) return result;
  
  // Debug which properties exist
  console.log("[normalizeSwotData] Checking data properties:", {
    hasStrengths: !!data.strengths,
    hasWeaknesses: !!data.weaknesses,
    hasOpportunities: !!data.opportunities,
    hasThreats: !!data.threats,
    hasSwotAnalysis: !!data.swot_analysis,
    strengthsType: data.strengths ? typeof data.strengths : 'undefined',
    swotAnalysisType: data.swot_analysis ? typeof data.swot_analysis : 'undefined'
  });
  
  // Helper function to convert Json type or strings to arrays
  const ensureStringArray = (value: any): string[] => {
    if (!value) return [];
    
    // If it's already an array, filter to keep only string items
    if (Array.isArray(value)) {
      return value.filter(item => typeof item === 'string');
    }
    
    // If it's a string, try parsing it as JSON (it might be a serialized array)
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => typeof item === 'string');
        }
        // If it's just a simple string, wrap it in an array
        return [value];
      } catch (e) {
        // It's not valid JSON, so just return as single item array
        return [value];
      }
    }
    
    // If it's a JSON object from Supabase (could be complex)
    if (value && typeof value === 'object') {
      // If it has array-like properties, return those
      if ('array' in value || 'elements' in value) {
        const arr = (value as any).array || (value as any).elements;
        if (Array.isArray(arr)) {
          return arr.filter(item => typeof item === 'string');
        }
      }
    }
    
    // If all else fails, stringify and return as single item
    return [String(value)];
  };
  
  // Process direct properties first
  if (data.strengths) {
    result.strengths = ensureStringArray(data.strengths);
  }
  
  if (data.weaknesses) {
    result.weaknesses = ensureStringArray(data.weaknesses);
  }
  
  if (data.opportunities) {
    result.opportunities = ensureStringArray(data.opportunities);
  }
  
  if (data.threats) {
    result.threats = ensureStringArray(data.threats);
  }
  
  // If there's a swot_analysis object, use its properties as fallback
  if (data.swot_analysis) {
    // Try to parse if it's a string
    let swotAnalysis = data.swot_analysis;
    if (typeof swotAnalysis === 'string') {
      try {
        swotAnalysis = JSON.parse(swotAnalysis);
      } catch (e) {
        // Keep it as is if parsing fails
      }
    }
    
    // Now extract from swot_analysis if properties were not directly on the main object
    if (!data.strengths && swotAnalysis.strengths) {
      result.strengths = ensureStringArray(swotAnalysis.strengths);
    }
    
    if (!data.weaknesses && swotAnalysis.weaknesses) {
      result.weaknesses = ensureStringArray(swotAnalysis.weaknesses);
    }
    
    if (!data.opportunities && swotAnalysis.opportunities) {
      result.opportunities = ensureStringArray(swotAnalysis.opportunities);
    }
    
    if (!data.threats && swotAnalysis.threats) {
      result.threats = ensureStringArray(swotAnalysis.threats);
    }
  }
  
  // Debug final result
  console.log("[normalizeSwotData] Normalized result:", {
    strengthsCount: result.strengths.length,
    weaknessesCount: result.weaknesses.length,
    opportunitiesCount: result.opportunities.length,
    threatsCount: result.threats.length
  });
  
  return result;
}
