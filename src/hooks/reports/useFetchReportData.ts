
import { supabase } from '@/integrations/supabase/client';
import { ReportType } from '@/types/reports';
import type { ReportDataSource } from '@/utils/reports/dataSourceUtils';
import { ArchetypeDetailedData } from '@/types/archetype';
import { getDataSource } from '@/utils/reports/schemaMapping';
import { ensureArray } from '@/utils/array/ensureArray';
import { ensureStringArray } from '@/utils/array/ensureStringArray';

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
 * Enhanced constants for token expiration handling with more generous buffer times
 * 
 * TOKEN_EXPIRATION_BUFFER_HOURS: Time window (in hours) before expiration to show warnings (24h)
 * TOKEN_EXPIRATION_GRACE_HOURS: Time window (in hours) after expiration to still allow access (1h)
 */
const TOKEN_EXPIRATION_BUFFER_HOURS = 24;
const TOKEN_EXPIRATION_GRACE_HOURS = 1;

/**
 * Enhanced token validation with improved error handling and buffer times
 * 
 * Key improvements:
 * 1. Better logging of validation steps and conditions
 * 2. More generous grace period (1 hour)
 * 3. Early warning for token expiration (24 hours)
 * 4. More detailed debugging information
 * 5. Better error handling for database errors
 */
export const fetchTokenAccess = async (archetypeId: string, token: string): Promise<TokenAccessResponse> => {
  console.log(`[fetchTokenAccess] Validating token for ${archetypeId} (Token: ${token.substring(0, 5)}...)`);
  
  try {
    // Special case - admin view token
    if (token === 'admin-view') {
      console.log('[fetchTokenAccess] Admin view token - always valid');
      return {
        data: {
          id: 'admin',
          archetype_id: archetypeId,
          name: 'Administrator',
          organization: 'Admin Console',
          email: 'admin@example.com',
          created_at: new Date().toISOString(),
          status: 'active'
        },
        error: null,
        debugInfo: {
          timestamp: new Date().toISOString(),
          isAdminView: true
        }
      };
    }
    
    // Get current time for validation
    const now = new Date();
    
    // Calculate buffer time threshold (current time + buffer period)
    const bufferThreshold = new Date();
    bufferThreshold.setHours(now.getHours() + TOKEN_EXPIRATION_BUFFER_HOURS);
    
    // Calculate grace period (current time - grace period)
    const gracePeriodThreshold = new Date();
    gracePeriodThreshold.setHours(now.getHours() - TOKEN_EXPIRATION_GRACE_HOURS);
    
    console.log(`[fetchTokenAccess] Time thresholds:`, {
      currentTime: now.toISOString(),
      bufferThreshold: bufferThreshold.toISOString(),
      gracePeriodThreshold: gracePeriodThreshold.toISOString(),
      bufferHours: TOKEN_EXPIRATION_BUFFER_HOURS,
      graceHours: TOKEN_EXPIRATION_GRACE_HOURS
    });
    
    // Query the database for the token - WITHOUT expiration check in SQL
    // We will check expiration in JavaScript with grace period
    console.log(`[fetchTokenAccess] Querying database for token: ${token.substring(0, 5)}... (${archetypeId})`);
    
    const result = await supabase
      .from('report_requests')
      .select('id, archetype_id, name, organization, email, created_at, expires_at, status, access_count, assessment_result, exact_employee_count, last_accessed, access_url')
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
          errorMessage: result.error.message,
          errorCode: result.error.code,
          query: 'report_requests by token and archetypeId'
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
    
    console.log('[fetchTokenAccess] Token found in database:', {
      id: result.data.id,
      archetypeId: result.data.archetype_id,
      status: result.data.status,
      expiresAt: result.data.expires_at || 'none'
    });
    
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
        gracePeriodThreshold: gracePeriodThreshold.toISOString(),
        timeDifferenceHours: expirationDiffHours
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
    
    // For expired tokens within grace period, set the status to grace-period
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
    
    // Update access count and last_accessed timestamp
    try {
      const updateResult = await supabase
        .from('report_requests')
        .update({
          last_accessed: now.toISOString(),
          access_count: (tokenData.access_count || 0) + 1
        })
        .eq('archetype_id', archetypeId)
        .eq('access_token', token);
      
      if (updateResult.error) {
        console.warn('[fetchTokenAccess] Failed to update access count:', updateResult.error);
      } else {
        console.log('[fetchTokenAccess] Updated access count and timestamp');
      }
    } catch (e) {
      console.warn('[fetchTokenAccess] Error updating access statistics:', e);
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
  // Fix: Define the type more explicitly and handle string constants correctly
  const dataSourceTable: string = reportType === 'insight' ? 'level3_report_secure' : getDataSource(reportType);
  
  console.log(`[fetchReportData] Querying ${dataSourceTable} for archetypeId ${archetypeId}`);
  
  try {
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
    
    // Use proper type checking before logging
    console.log(`[fetchReportData] Successfully retrieved data for ${archetypeId}:`, {
      hasStrategicRecommendations: !!data.strategic_recommendations,
      recommendationsCount: data.strategic_recommendations ? 
        (Array.isArray(data.strategic_recommendations) ? 
          data.strategic_recommendations.length : 
          (typeof data.strategic_recommendations === 'object' ? 
            Object.keys(data.strategic_recommendations).length : 0)) : 
        0
    });
    
    return data ? mapToArchetypeDetailedData(data) : null;
  } catch (error) {
    console.error(`[fetchReportData] Error fetching report data:`, error);
    
    // Try fallback source for deep dive reports
    if (reportType === 'deepDive' && dataSourceTable === 'level4_report_secure') {
      console.log(`[fetchReportData] Attempting fallback to level4_deepdive_report_data_secure`);
      try {
        const { data, error } = await supabase
          .from('level4_deepdive_report_data_secure')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (error) {
          console.error(`[fetchReportData] Error in fallback query:`, error);
          throw error;
        }
        
        if (!data) {
          console.log(`[fetchReportData] No data found in fallback source for ${archetypeId}`);
          return null;
        }
        
        console.log(`[fetchReportData] Successfully retrieved fallback data for ${archetypeId}`);
        return data ? mapToArchetypeDetailedData(data) : null;
      } catch (fallbackError) {
        console.error(`[fetchReportData] Fallback query failed:`, fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

const mapToArchetypeDetailedData = (data: any): ArchetypeDetailedData | null => {
  if (!data) return null;
  
  try {
    // Handle key_characteristics properly - ensure it's always a string array
    let keyCharacteristics: string[] = [];
    
    if (typeof data.key_characteristics === 'string') {
      keyCharacteristics = data.key_characteristics
        .split('\n')
        .filter(Boolean)
        .map((item: string) => item.trim());
    } else if (Array.isArray(data.key_characteristics)) {
      keyCharacteristics = data.key_characteristics
        .filter(Boolean)
        .map((item: any) => String(item).trim());
    }

    // Process strategic recommendations if available
    let strategicRecommendations = data.strategic_recommendations;
    if (strategicRecommendations) {
      // If it's not an array, convert to array for consistent handling
      if (!Array.isArray(strategicRecommendations)) {
        // It might be an object with numeric keys, convert to array
        strategicRecommendations = Object.values(strategicRecommendations);
      }
      
      // Log what we found
      console.log(`[mapToArchetypeDetailedData] Processed strategic recommendations:`, {
        originalType: typeof data.strategic_recommendations,
        isArray: Array.isArray(data.strategic_recommendations),
        processedCount: strategicRecommendations.length,
        sample: strategicRecommendations.slice(0, 2)
      });
    }
    
    return {
      id: data.archetype_id,
      name: data.archetype_name || '',
      familyId: data.family_id || 'unknown',
      familyName: data.family_name,
      family_name: data.family_name,
      hexColor: data.hex_color,
      short_description: data.short_description,
      long_description: data.long_description,
      key_characteristics: keyCharacteristics,
      industries: data.industries,
      family_id: data.family_id,
      strategic_recommendations: strategicRecommendations,
      
      // Copy all other properties
      ...Object.entries(data)
        .filter(([key]) => !['id', 'name', 'family_id', 'family_name', 
                           'hex_color', 'short_description', 'long_description',
                           'key_characteristics', 'industries', 
                           'strategic_recommendations'].includes(key))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    };
  } catch (error) {
    console.error('[mapToArchetypeDetailedData] Error mapping data:', error);
    return null;
  }
};
