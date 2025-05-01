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

  // Log the data source to help with debugging
  console.log('[processInsightsSwotData] Processing data from level3_report_secure:', {
    hasStrengths: !!reportData.strengths,
    hasWeaknesses: !!reportData.weaknesses,
    hasOpportunities: !!reportData.opportunities,
    hasThreats: !!reportData.threats,
    strengthsType: reportData.strengths ? typeof reportData.strengths : 'undefined',
    strengthsValue: reportData.strengths ? JSON.stringify(reportData.strengths).substring(0, 100) : 'undefined'
  });

  // Process each SWOT category
  try {
    // Helper function to process different data formats
    const processField = (field: any): string[] => {
      if (!field) {
        return [];
      }
      
      // If it's already an array of strings, use it directly
      if (Array.isArray(field) && field.every(item => typeof item === 'string')) {
        return field;
      }
      
      // If it's a string that looks like JSON array, parse it
      if (typeof field === 'string' && field.startsWith('[')) {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed.map(String) : [];
        } catch (e) {
          console.error('[processInsightsSwotData] Failed to parse JSON string', e);
          return [field]; // Treat as a single string
        }
      }
      
      // If it's an object (likely from supabase jsonb), extract values
      if (typeof field === 'object') {
        // Convert keys like "0", "1", "2" to values
        if (Object.keys(field).every(key => !isNaN(Number(key)))) {
          return Object.values(field).map(String);
        }
        
        // Otherwise return object values
        return Object.values(field).map(String);
      }
      
      // Default: treat as a single string
      return [String(field)];
    };
    
    // Process each category
    result.strengths = processField(reportData.strengths);
    result.weaknesses = processField(reportData.weaknesses);
    result.opportunities = processField(reportData.opportunities);
    result.threats = processField(reportData.threats);
    
    // Add more detailed logging of what was actually processed
    console.log('[processInsightsSwotData] Detailed SWOT data processed:', {
      strengthsCount: result.strengths.length,
      weaknessesCount: result.weaknesses.length,
      opportunitiesCount: result.opportunities.length,
      threatsCount: result.threats.length,
      sampleStrength: result.strengths.length > 0 ? result.strengths[0] : 'none',
      // Show the raw first entry of each category
      rawStrengthSample: reportData.strengths ? 
        (typeof reportData.strengths === 'object' ? 
          JSON.stringify(reportData.strengths).substring(0, 100) : 
          String(reportData.strengths).substring(0, 100)
        ) : 'none'
    });
  } catch (error) {
    console.error('[processInsightsSwotData] Error processing SWOT data:', error);
  }

  return result;
}
