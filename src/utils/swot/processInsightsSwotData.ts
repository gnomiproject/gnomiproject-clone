
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

  // Process each SWOT category using ensureArray to handle different data formats
  result.strengths = ensureArray(reportData.strengths);
  result.weaknesses = ensureArray(reportData.weaknesses);
  result.opportunities = ensureArray(reportData.opportunities);
  result.threats = ensureArray(reportData.threats);

  return result;
}
