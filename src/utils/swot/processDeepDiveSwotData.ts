
/**
 * Utility function for processing SWOT analysis data specifically for the Deep Dive Report
 * ONLY used with data from level4_report_secure table
 */

import { ensureArray } from '@/utils/array/ensureArray';

export interface DeepDiveSwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

/**
 * Processes SWOT data from the level4_report_secure table for display in the Deep Dive Report
 * @param reportData Data from level4_report_secure table
 * @returns Structured SWOT data with arrays of strings for each category
 */
export function processDeepDiveSwotData(reportData: any): DeepDiveSwotData {
  // Initialize with empty arrays
  const result: DeepDiveSwotData = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };
  
  if (!reportData) {
    console.warn('[processDeepDiveSwotData] No report data provided');
    return result;
  }

  // Log the data source to help with debugging
  console.log('[processDeepDiveSwotData] Processing data from level4_report_secure:', {
    hasSwotAnalysis: !!reportData.swot_analysis,
    swotAnalysisType: reportData.swot_analysis ? typeof reportData.swot_analysis : 'undefined'
  });

  // For level4_report_secure, the SWOT data is nested within a swot_analysis object
  if (reportData.swot_analysis && typeof reportData.swot_analysis === 'object') {
    const swotObj = reportData.swot_analysis as Record<string, any>;
    
    // Process each SWOT category using ensureArray to handle different data formats
    result.strengths = ensureArray(swotObj.strengths);
    result.weaknesses = ensureArray(swotObj.weaknesses);
    result.opportunities = ensureArray(swotObj.opportunities);
    result.threats = ensureArray(swotObj.threats);
  }

  return result;
}
