
import { ensureArray, ensureStringArray, normalizeArray } from '@/utils/array/arrayUtils';

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * Universal SWOT data processor - works with any data source format
 * 
 * @param data The data containing SWOT information
 * @returns Properly formatted SWOT data
 */
export function processSwotData(data: any): SwotData {
  // Initialize with empty arrays
  const result: SwotData = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };
  
  if (!data) {
    console.warn('[processSwotData] No data provided');
    return result;
  }
  
  // Log data structure for debugging
  console.log('[processSwotData] Processing SWOT data:', {
    dataType: typeof data,
    hasSwotAnalysis: !!data.swot_analysis,
    hasDirectStrengths: !!data.strengths
  });

  // Case 1: SWOT data is in a nested swot_analysis object
  if (data.swot_analysis && typeof data.swot_analysis === 'object') {
    console.log('[processSwotData] Using nested swot_analysis object');
    const swot = data.swot_analysis;
    
    result.strengths = normalizeArray(swot.strengths);
    result.weaknesses = normalizeArray(swot.weaknesses);
    result.opportunities = normalizeArray(swot.opportunities);
    result.threats = normalizeArray(swot.threats);
    
    // If we found data, return it
    if (result.strengths.length > 0 || result.weaknesses.length > 0 ||
        result.opportunities.length > 0 || result.threats.length > 0) {
      return result;
    }
  }
  
  // Case 2: SWOT data is at the top level of the object
  console.log('[processSwotData] Using top-level SWOT properties');
  result.strengths = normalizeArray(data.strengths);
  result.weaknesses = normalizeArray(data.weaknesses);
  result.opportunities = normalizeArray(data.opportunities);
  result.threats = normalizeArray(data.threats);
  
  // Case 3: Enhanced SWOT data might be in an "enhanced" property
  if (data.enhanced && typeof data.enhanced === 'object' && data.enhanced.swot) {
    console.log('[processSwotData] Found enhanced.swot data');
    const enhancedSwot = data.enhanced.swot;
    
    // Only use enhanced data if we don't already have this category
    if (result.strengths.length === 0 && enhancedSwot.strengths) {
      result.strengths = normalizeArray(enhancedSwot.strengths);
    }
    if (result.weaknesses.length === 0 && enhancedSwot.weaknesses) {
      result.weaknesses = normalizeArray(enhancedSwot.weaknesses);
    }
    if (result.opportunities.length === 0 && enhancedSwot.opportunities) {
      result.opportunities = normalizeArray(enhancedSwot.opportunities);
    }
    if (result.threats.length === 0 && enhancedSwot.threats) {
      result.threats = normalizeArray(enhancedSwot.threats);
    }
  }
  
  console.log('[processSwotData] Final SWOT data:', {
    strengthsCount: result.strengths.length,
    weaknessesCount: result.weaknesses.length,
    opportunitiesCount: result.opportunities.length,
    threatsCount: result.threats.length
  });
  
  return result;
}
