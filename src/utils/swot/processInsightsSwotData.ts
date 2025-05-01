
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
    // Direct array handling - if the field is already an array, it will be used directly
    if (Array.isArray(reportData.strengths)) {
      result.strengths = reportData.strengths.map(String);
    } 
    // JSON array handling - if the field is a stringified JSON array
    else if (typeof reportData.strengths === 'string' && reportData.strengths.startsWith('[')) {
      try {
        result.strengths = JSON.parse(reportData.strengths);
      } catch (e) {
        result.strengths = [reportData.strengths];
      }
    }
    // Object handling - sometimes data comes as an object with values
    else if (reportData.strengths && typeof reportData.strengths === 'object') {
      result.strengths = Object.values(reportData.strengths).map(String);
    }

    // Process weaknesses
    if (Array.isArray(reportData.weaknesses)) {
      result.weaknesses = reportData.weaknesses.map(String);
    } 
    else if (typeof reportData.weaknesses === 'string' && reportData.weaknesses.startsWith('[')) {
      try {
        result.weaknesses = JSON.parse(reportData.weaknesses);
      } catch (e) {
        result.weaknesses = [reportData.weaknesses];
      }
    }
    else if (reportData.weaknesses && typeof reportData.weaknesses === 'object') {
      result.weaknesses = Object.values(reportData.weaknesses).map(String);
    }

    // Process opportunities
    if (Array.isArray(reportData.opportunities)) {
      result.opportunities = reportData.opportunities.map(String);
    } 
    else if (typeof reportData.opportunities === 'string' && reportData.opportunities.startsWith('[')) {
      try {
        result.opportunities = JSON.parse(reportData.opportunities);
      } catch (e) {
        result.opportunities = [reportData.opportunities];
      }
    }
    else if (reportData.opportunities && typeof reportData.opportunities === 'object') {
      result.opportunities = Object.values(reportData.opportunities).map(String);
    }

    // Process threats
    if (Array.isArray(reportData.threats)) {
      result.threats = reportData.threats.map(String);
    } 
    else if (typeof reportData.threats === 'string' && reportData.threats.startsWith('[')) {
      try {
        result.threats = JSON.parse(reportData.threats);
      } catch (e) {
        result.threats = [reportData.threats];
      }
    }
    else if (reportData.threats && typeof reportData.threats === 'object') {
      result.threats = Object.values(reportData.threats).map(String);
    }

    // Add more detailed logging of what was actually processed
    console.log('[processInsightsSwotData] Detailed SWOT data processed:', {
      strengthsCount: result.strengths.length,
      weaknessesCount: result.weaknesses.length,
      opportunitiesCount: result.opportunities.length,
      threatsCount: result.threats.length,
      sampleStrength: result.strengths.length > 0 ? result.strengths[0] : 'none'
    });

  } catch (error) {
    console.error('[processInsightsSwotData] Error processing SWOT data:', error);
  }

  return result;
}
