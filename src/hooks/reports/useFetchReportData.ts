
import { supabase } from '@/integrations/supabase/client';
import { ReportType } from '@/types/reports';
import type { ReportDataSource } from '@/utils/reports/dataSourceUtils';
import { ArchetypeDetailedData } from '@/types/archetype';
import { getDataSource } from '@/utils/reports/schemaMapping';

interface TokenAccessData {
  id: string;
  archetype_id: string;
  name: string;
  organization: string;
  email: string;
  created_at: string;
  expires_at?: string;
  status?: string;
  access_count?: number;
  assessment_result?: any;
  exact_employee_count?: number;
  last_accessed?: string;
  access_url?: string;
}

interface TokenAccessResponse {
  data: TokenAccessData | null;
  error: any;
  debugInfo?: any;
}

/**
 * Constants for token expiration handling
 * 
 * TOKEN_EXPIRATION_BUFFER_HOURS: Time window (in hours) before actual expiration to start showing warnings
 * TOKEN_EXPIRATION_GRACE_HOURS: Time window (in hours) after expiration to still allow access with warning
 * TOKEN_VALIDATION_INTERVAL_MINS: How often to check token status during active sessions (in minutes)
 */
const TOKEN_EXPIRATION_BUFFER_HOURS = 24;
const TOKEN_EXPIRATION_GRACE_HOURS = 1;
const TOKEN_VALIDATION_INTERVAL_MINS = 5;  // Increased from 30 sec to 5 minutes

/**
 * Validates a token's access for a specific archetype report
 * 
 * Validation approach:
 * 1. Query the database for the token without expiration check
 * 2. If token exists, perform JavaScript-based validation with grace period:
 *    - Check if token is marked as inactive in the database
 *    - Check if token is expired (current time > expires_at)
 *    - Apply grace period if token is recently expired
 *    - Apply warning if token is close to expiration
 * 3. Return validation result with detailed debug info
 * 
 * This approach allows for flexible handling of token expiration with 
 * customizable buffer and grace periods without requiring database changes.
 */
export const fetchTokenAccess = async (archetypeId: string, token: string): Promise<TokenAccessResponse> => {
  console.log(`[fetchTokenAccess] Validating token for ${archetypeId} (Token: ${token.substring(0, 5)}...)`);
  
  try {
    // Get current time for validation
    const now = new Date();
    
    // Calculate buffer time threshold (current time + buffer period)
    const bufferThreshold = new Date();
    bufferThreshold.setHours(now.getHours() + TOKEN_EXPIRATION_BUFFER_HOURS);
    
    // Calculate grace period (current time - grace period)
    const gracePeriodThreshold = new Date();
    gracePeriodThreshold.setHours(now.getHours() - TOKEN_EXPIRATION_GRACE_HOURS);
    
    console.log(`[fetchTokenAccess] Current time: ${now.toISOString()}`);
    console.log(`[fetchTokenAccess] Buffer threshold: ${bufferThreshold.toISOString()}`);
    console.log(`[fetchTokenAccess] Grace period threshold: ${gracePeriodThreshold.toISOString()}`);
    
    // Query the database for the token - WITHOUT expiration check
    // We will check expiration in JavaScript with grace period
    const result = await supabase
      .from('report_requests')
      .select('id, archetype_id, name, organization, email, created_at, expires_at, status, access_count, assessment_result, exact_employee_count')
      .eq('archetype_id', archetypeId)
      .eq('access_token', token)
      .maybeSingle();
    
    // Log validation attempt results  
    if (result.error) {
      console.error(`[fetchTokenAccess] Database error:`, result.error);
      return { 
        data: null, 
        error: result.error,
        debugInfo: {
          timestamp: now.toISOString(),
          archetypeId,
          tokenPreview: token.substring(0, 5) + '...',
          errorMessage: result.error.message
        }
      };
    }
    
    if (!result.data) {
      console.warn(`[fetchTokenAccess] No token found for ${archetypeId}`);
      
      return { 
        data: null, 
        error: { message: 'Invalid access token' },
        debugInfo: {
          timestamp: now.toISOString(),
          archetypeId,
          tokenPreview: token.substring(0, 5) + '...',
          found: false
        }
      };
    }
    
    // Validate token status and expiration with grace period
    const tokenData = result.data;
    const isInactive = tokenData.status !== 'active';
    let isExpired = false;
    let isWithinGracePeriod = false;
    let expirationMsg = "No expiration set";
    
    if (tokenData.expires_at) {
      const expirationDate = new Date(tokenData.expires_at);
      isExpired = expirationDate <= now;
      isWithinGracePeriod = isExpired && expirationDate >= gracePeriodThreshold;
      
      // Detailed logging for expiration
      const expirationDiffMs = expirationDate.getTime() - now.getTime();
      const expirationDiffHours = Math.round(expirationDiffMs / (1000 * 60 * 60));
      expirationMsg = isExpired 
        ? `Expired ${Math.abs(expirationDiffHours)}h ago`
        : `Expires in ${expirationDiffHours}h`;
      
      console.log(`[fetchTokenAccess] Token expiration details:`, {
        expirationDate: expirationDate.toISOString(),
        expirationMessage: expirationMsg,
        isExpired,
        isWithinGracePeriod,
        gracePeriodThreshold: gracePeriodThreshold.toISOString()
      });
    } else {
      console.log(`[fetchTokenAccess] Token has no expiration date set`);
    }
    
    // Return invalid for inactive tokens
    if (isInactive) {
      console.warn(`[fetchTokenAccess] Token found but inactive for ${archetypeId}`);
      return { 
        data: null, 
        error: { 
          message: 'Token is no longer active',
          code: 'INACTIVE_TOKEN'
        },
        debugInfo: {
          timestamp: now.toISOString(),
          archetypeId,
          tokenPreview: token.substring(0, 5) + '...',
          found: true,
          isInactive,
          status: tokenData.status
        }
      };
    }
    
    // Handle expired tokens outside grace period
    if (isExpired && !isWithinGracePeriod) {
      console.warn(`[fetchTokenAccess] Token expired for ${archetypeId} (outside grace period): ${expirationMsg}`);
      return { 
        data: null, 
        error: { 
          message: `Token expired on ${new Date(tokenData.expires_at || '').toLocaleString()}`,
          code: 'EXPIRED_TOKEN'
        },
        debugInfo: {
          timestamp: now.toISOString(),
          archetypeId,
          tokenPreview: token.substring(0, 5) + '...',
          found: true,
          isExpired,
          expirationMsg,
          expiresAt: tokenData.expires_at
        }
      };
    }
    
    // For expired tokens within grace period, add a warning flag
    if (isExpired && isWithinGracePeriod) {
      console.warn(`[fetchTokenAccess] Token expired but within grace period for ${archetypeId}: ${expirationMsg}`);
      // Add a warning flag to the data
      tokenData.status = 'grace-period';
    }
    
    // Check if token is close to expiration (within buffer period)
    if (tokenData.expires_at) {
      const expirationDate = new Date(tokenData.expires_at || '');
      const isNearExpiration = expirationDate <= bufferThreshold && !isExpired;
      
      if (isNearExpiration) {
        const hoursRemaining = Math.round((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        console.warn(`[fetchTokenAccess] Token will expire soon: ${hoursRemaining} hours remaining`);
        // Add expiration warning
        tokenData.status = 'expiring-soon';
      }
    }
    
    console.log(`[fetchTokenAccess] Token validated successfully for ${archetypeId}`);
    
    return { 
      data: tokenData,
      error: null,
      debugInfo: {
        timestamp: now.toISOString(),
        archetypeId,
        tokenPreview: token.substring(0, 5) + '...',
        validUntil: tokenData.expires_at,
        expirationMsg: tokenData.expires_at ? expirationMsg : "No expiration",
        status: tokenData.status
      }
    };
  } catch (error) {
    console.error(`[fetchTokenAccess] Unexpected error:`, error);
    return { 
      data: null, 
      error, 
      debugInfo: {
        timestamp: new Date().toISOString(),
        archetypeId,
        tokenPreview: token.substring(0, 5) + '...',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};

export const fetchReportData = async (
  archetypeId: string,
  reportType: ReportType
): Promise<ArchetypeDetailedData | null> => {
  // For insights reports, always use level3_report_secure
  const dataSourceTable = reportType === 'insight' ? 'level3_report_secure' : getDataSource(reportType);
  
  console.log(`[fetchReportData] Querying ${dataSourceTable} for archetypeId ${archetypeId}`);
  
  const { data, error } = await supabase
    .from(dataSourceTable as any)
    .select('*')
    .eq('archetype_id', archetypeId)
    .maybeSingle();

  if (error) {
    console.error(`[fetchReportData] Error querying ${dataSourceTable}:`, error);
    throw error;
  }
  
  if (!data) {
    console.log(`[fetchReportData] No data found in ${dataSourceTable} for archetype ${archetypeId}`);
    return null;
  }
  
  return data ? mapToArchetypeDetailedData(data) : null;
};

const mapToArchetypeDetailedData = (data: any): ArchetypeDetailedData | null => {
  if (!data) return null;
  
  return {
    id: data.archetype_id,
    name: data.archetype_name || '',
    familyId: data.family_id || 'unknown',
    familyName: data.family_name,
    family_name: data.family_name,
    hexColor: data.hex_color,
    short_description: data.short_description,
    long_description: data.long_description,
    key_characteristics: typeof data.key_characteristics === 'string'
      ? data.key_characteristics.split('\n').filter(Boolean)
      : [],
    industries: data.industries,
    family_id: data.family_id,
    
    // Map SWOT analysis fields
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    opportunities: data.opportunities || [],
    threats: data.threats || [],
    
    // Map strategic recommendations
    strategic_recommendations: data.strategic_recommendations || [],
      
    // Map metrics with their original names
    "Demo_Average Family Size": data["Demo_Average Family Size"] || 0,
    "Demo_Average Age": data["Demo_Average Age"] || 0,
    "Demo_Average Employees": data["Demo_Average Employees"] || 0,
    "Demo_Average States": data["Demo_Average States"] || 0,
    "Demo_Average Percent Female": data["Demo_Average Percent Female"] || 0,
    
    "Util_Emergency Visits per 1k Members": data["Util_Emergency Visits per 1k Members"] || 0,
    "Util_Specialist Visits per 1k Members": data["Util_Specialist Visits per 1k Members"] || 0,
    "Util_Inpatient Admits per 1k Members": data["Util_Inpatient Admits per 1k Members"] || 0,
    "Util_Percent of Members who are Non-Utilizers": data["Util_Percent of Members who are Non-Utilizers"] || 0,
    
    "Risk_Average Risk Score": data["Risk_Average Risk Score"] || 0,
    "SDOH_Average SDOH": data["SDOH_Average SDOH"] || 0,
    
    "Cost_Medical & RX Paid Amount PEPY": data["Cost_Medical & RX Paid Amount PEPY"] || 0,
    "Cost_Medical & RX Paid Amount PMPY": data["Cost_Medical & RX Paid Amount PMPY"] || 0,
    "Cost_Avoidable ER Potential Savings PMPY": data["Cost_Avoidable ER Potential Savings PMPY"] || 0,
    "Cost_Medical Paid Amount PEPY": data["Cost_Medical Paid Amount PEPY"] || 0,
    "Cost_RX Paid Amount PEPY": data["Cost_RX Paid Amount PEPY"] || 0,
    
    "Dise_Heart Disease Prevalence": data["Dise_Heart Disease Prevalence"] || 0,
    "Dise_Type 2 Diabetes Prevalence": data["Dise_Type 2 Diabetes Prevalence"] || 0, 
    "Dise_Mental Health Disorder Prevalence": data["Dise_Mental Health Disorder Prevalence"] || 0,
    "Dise_Substance Use Disorder Prevalence": data["Dise_Substance Use Disorder Prevalence"] || 0,
    
    "Gaps_Diabetes RX Adherence": data["Gaps_Diabetes RX Adherence"] || 0,
    "Gaps_Behavioral Health FU ED Visit Mental Illness": data["Gaps_Behavioral Health FU ED Visit Mental Illness"] || 0,
    "Gaps_Cancer Screening Breast": data["Gaps_Cancer Screening Breast"] || 0,
    "Gaps_Wellness Visit Adults": data["Gaps_Wellness Visit Adults"] || 0,
  };
};
