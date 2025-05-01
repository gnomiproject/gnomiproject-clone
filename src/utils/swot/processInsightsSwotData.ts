
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
    strengthsStructure: reportData.strengths ? JSON.stringify(reportData.strengths).substring(0, 100) + '...' : 'undefined'
  });

  // Enhanced processing of SWOT data to handle different formats
  try {
    // Process strengths
    if (reportData.strengths) {
      if (typeof reportData.strengths === 'string') {
        // Handle string format (possibly JSON)
        try {
          const parsed = JSON.parse(reportData.strengths);
          result.strengths = processSwotItem(parsed);
        } catch (e) {
          // If not valid JSON, treat as plain text
          result.strengths = [reportData.strengths];
        }
      } else if (typeof reportData.strengths === 'object') {
        result.strengths = processSwotItem(reportData.strengths);
      }
    }

    // Process weaknesses
    if (reportData.weaknesses) {
      if (typeof reportData.weaknesses === 'string') {
        try {
          const parsed = JSON.parse(reportData.weaknesses);
          result.weaknesses = processSwotItem(parsed);
        } catch (e) {
          result.weaknesses = [reportData.weaknesses];
        }
      } else if (typeof reportData.weaknesses === 'object') {
        result.weaknesses = processSwotItem(reportData.weaknesses);
      }
    }

    // Process opportunities
    if (reportData.opportunities) {
      if (typeof reportData.opportunities === 'string') {
        try {
          const parsed = JSON.parse(reportData.opportunities);
          result.opportunities = processSwotItem(parsed);
        } catch (e) {
          result.opportunities = [reportData.opportunities];
        }
      } else if (typeof reportData.opportunities === 'object') {
        result.opportunities = processSwotItem(reportData.opportunities);
      }
    }

    // Process threats
    if (reportData.threats) {
      if (typeof reportData.threats === 'string') {
        try {
          const parsed = JSON.parse(reportData.threats);
          result.threats = processSwotItem(parsed);
        } catch (e) {
          result.threats = [reportData.threats];
        }
      } else if (typeof reportData.threats === 'object') {
        result.threats = processSwotItem(reportData.threats);
      }
    }

    // Add more detailed logging for the processed result
    console.log('[processInsightsSwotData] Detailed SWOT data structure:', {
      strengths: result.strengths,
      strengthsCount: result.strengths.length,
      weaknessesCount: result.weaknesses.length,
      opportunitiesCount: result.opportunities.length,
      threatsCount: result.threats.length,
      sample: result.strengths.length > 0 ? result.strengths[0] : 'none'
    });

  } catch (error) {
    console.error('[processInsightsSwotData] Error processing SWOT data:', error);
  }

  return result;
}

/**
 * Helper function to process a SWOT item into a string array
 * Handles various data formats that might come from the database
 */
function processSwotItem(item: any): string[] {
  // If it's already an array, ensure all items are strings
  if (Array.isArray(item)) {
    return item.map(i => typeof i === 'string' ? i : JSON.stringify(i));
  }
  
  // If it's an object with specific known formats
  if (typeof item === 'object' && item !== null) {
    // Check for common patterns in the data structure
    
    // Pattern 1: Array in a property like 'items', 'data', 'points'
    for (const key of ['items', 'data', 'points', 'list']) {
      if (key in item && Array.isArray(item[key])) {
        return item[key].map((i: any) => typeof i === 'string' ? i : String(i));
      }
    }
    
    // Pattern 2: Numbered keys like {"0": "point 1", "1": "point 2"}
    const numericKeys = Object.keys(item).filter(k => !isNaN(Number(k)));
    if (numericKeys.length > 0) {
      return numericKeys.map(k => String(item[k]));
    }
    
    // Pattern 3: Text content in properties like 'text', 'content', or 'description'
    for (const key of ['text', 'content', 'description']) {
      if (key in item && typeof item[key] === 'string') {
        return [item[key]];
      }
    }
    
    // Last resort: extract all string values from object
    const values = Object.values(item).filter(v => v !== null && v !== undefined);
    if (values.length > 0) {
      return values.map(v => typeof v === 'string' ? v : String(v));
    }
  }
  
  // Default case: convert to string and return as single-item array
  return [String(item)];
}
