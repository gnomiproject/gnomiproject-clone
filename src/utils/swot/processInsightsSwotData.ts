
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
    strengthsType: reportData.strengths ? typeof reportData.strengths : 'undefined'
  });

  // Enhanced processing of SWOT data to handle different formats
  try {
    // Process strengths
    if (reportData.strengths) {
      if (typeof reportData.strengths === 'object' && !Array.isArray(reportData.strengths)) {
        // If it's a JSON object, try to extract array data
        if ('items' in reportData.strengths) {
          result.strengths = ensureArray(reportData.strengths.items);
        } else if ('points' in reportData.strengths) {
          result.strengths = ensureArray(reportData.strengths.points);
        } else if ('data' in reportData.strengths) {
          result.strengths = ensureArray(reportData.strengths.data);
        } else {
          // Try to extract values from the object
          const values = Object.values(reportData.strengths).filter(Boolean);
          result.strengths = values.map(value => String(value));
        }
      } else {
        // Use the existing ensureArray utility for other formats
        result.strengths = ensureArray(reportData.strengths);
      }
    }

    // Process weaknesses using the same pattern
    if (reportData.weaknesses) {
      if (typeof reportData.weaknesses === 'object' && !Array.isArray(reportData.weaknesses)) {
        if ('items' in reportData.weaknesses) {
          result.weaknesses = ensureArray(reportData.weaknesses.items);
        } else if ('points' in reportData.weaknesses) {
          result.weaknesses = ensureArray(reportData.weaknesses.points);
        } else if ('data' in reportData.weaknesses) {
          result.weaknesses = ensureArray(reportData.weaknesses.data);
        } else {
          const values = Object.values(reportData.weaknesses).filter(Boolean);
          result.weaknesses = values.map(value => String(value));
        }
      } else {
        result.weaknesses = ensureArray(reportData.weaknesses);
      }
    }

    // Process opportunities using the same pattern
    if (reportData.opportunities) {
      if (typeof reportData.opportunities === 'object' && !Array.isArray(reportData.opportunities)) {
        if ('items' in reportData.opportunities) {
          result.opportunities = ensureArray(reportData.opportunities.items);
        } else if ('points' in reportData.opportunities) {
          result.opportunities = ensureArray(reportData.opportunities.points);
        } else if ('data' in reportData.opportunities) {
          result.opportunities = ensureArray(reportData.opportunities.data);
        } else {
          const values = Object.values(reportData.opportunities).filter(Boolean);
          result.opportunities = values.map(value => String(value));
        }
      } else {
        result.opportunities = ensureArray(reportData.opportunities);
      }
    }

    // Process threats using the same pattern
    if (reportData.threats) {
      if (typeof reportData.threats === 'object' && !Array.isArray(reportData.threats)) {
        if ('items' in reportData.threats) {
          result.threats = ensureArray(reportData.threats.items);
        } else if ('points' in reportData.threats) {
          result.threats = ensureArray(reportData.threats.points);
        } else if ('data' in reportData.threats) {
          result.threats = ensureArray(reportData.threats.data);
        } else {
          const values = Object.values(reportData.threats).filter(Boolean);
          result.threats = values.map(value => String(value));
        }
      } else {
        result.threats = ensureArray(reportData.threats);
      }
    }

    // Add more detailed logging for the processed result
    console.log('[processInsightsSwotData] Detailed SWOT data structure:', {
      strengths: result.strengths,
      strengthsType: typeof result.strengths
    });

  } catch (error) {
    console.error('[processInsightsSwotData] Error processing SWOT data:', error);
  }

  return result;
}
