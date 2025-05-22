
/**
 * Utility function for processing SWOT analysis data specifically for the Insights page
 * ONLY used with data from level3_report_secure table
 */

import { ensureArray } from '@/utils/array/ensureArray';

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * Processes SWOT data from the level3_report_secure table for display in the Insights page
 * @param reportData Data from level3_report_secure table
 * @returns Structured SWOT data with arrays of strings for each category
 */
export function processInsightsSwotData(reportData: any): SwotData {
  // Initialize with empty arrays
  const result: SwotData = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };
  
  if (!reportData) {
    console.warn('[processInsightsSwotData] No report data provided');
    return result;
  }

  // Enhanced debug logging
  console.log('[processInsightsSwotData] Processing SWOT data from level3_report_secure:', {
    hasStrengths: !!reportData.strengths,
    hasWeaknesses: !!reportData.weaknesses,
    hasOpportunities: !!reportData.opportunities,
    hasThreats: !!reportData.threats,
    strengthsType: reportData.strengths ? typeof reportData.strengths : 'undefined',
    strengthsRawValue: reportData.strengths ? 
      (typeof reportData.strengths === 'string' ? 
        reportData.strengths.substring(0, 100) : 
        JSON.stringify(reportData.strengths).substring(0, 100)) : 'undefined'
  });

  // Enhanced helper function to handle different data formats
  const processSwotCategory = (data: any): string[] => {
    if (!data) return [];
    
    try {
      // Case 1: Already an array of strings
      if (Array.isArray(data) && typeof data[0] === 'string') {
        return data.map(String);
      }
      
      // Case 2: Already an array of something else
      if (Array.isArray(data)) {
        return data.map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'text' in item) return String(item.text);
          return String(item);
        });
      }
      
      // Case 3: JSON string array
      if (typeof data === 'string' && data.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            return parsed.map(String);
          }
          // If parsing succeeded but result is not an array
          return [String(data)];
        } catch (e) {
          // If parsing failed, treat as regular string
          return [data];
        }
      }
      
      // Case 4: JSON object
      if (typeof data === 'string' && data.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(data);
          if (typeof parsed === 'object' && parsed !== null) {
            return Object.values(parsed).map(String);
          }
          return [String(data)];
        } catch (e) {
          return [data];
        }
      }
      
      // Case 5: Object with values
      if (data && typeof data === 'object') {
        return Object.values(data).map(String);
      }
      
      // Case 6: Single string
      return [String(data)];
    } catch (error) {
      console.error('[processInsightsSwotData] Error processing SWOT category:', error);
      return [];
    }
  };

  // Process each SWOT category using our enhanced helper
  result.strengths = processSwotCategory(reportData.strengths);
  result.weaknesses = processSwotCategory(reportData.weaknesses);
  result.opportunities = processSwotCategory(reportData.opportunities);
  result.threats = processSwotCategory(reportData.threats);
  
  // Fallback to swot_analysis if available and primary fields didn't yield results
  if (reportData.swot_analysis) {
    if (result.strengths.length === 0) {
      result.strengths = processSwotCategory(reportData.swot_analysis.strengths);
    }
    if (result.weaknesses.length === 0) {
      result.weaknesses = processSwotCategory(reportData.swot_analysis.weaknesses);
    }
    if (result.opportunities.length === 0) {
      result.opportunities = processSwotCategory(reportData.swot_analysis.opportunities);
    }
    if (result.threats.length === 0) {
      result.threats = processSwotCategory(reportData.swot_analysis.threats);
    }
  }

  // Enhanced logging of processed data
  console.log('[processInsightsSwotData] Processed SWOT data:', {
    strengthsCount: result.strengths.length,
    weaknessesCount: result.weaknesses.length,
    opportunitiesCount: result.opportunities.length,
    threatsCount: result.threats.length,
    sampleStrengths: result.strengths.slice(0, 2)
  });

  return result;
}
