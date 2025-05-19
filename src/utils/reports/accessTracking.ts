import { supabase } from '@/integrations/supabase/client';

/**
 * Tracks when a user accesses a report by token, with deduplication
 * @param archetypeId The ID of the archetype
 * @param accessToken The access token for the report
 */
export const trackReportAccess = async (
  archetypeId: string,
  accessToken: string
): Promise<void> => {
  try {
    // Prevent tracking during the same session
    const sessionKey = `tracked_${archetypeId}_${accessToken}`;
    const lastTracked = sessionStorage.getItem(sessionKey);
    
    // If we've tracked this session in the last 5 minutes, don't track again
    if (lastTracked) {
      const elapsedTime = Date.now() - parseInt(lastTracked, 10);
      if (elapsedTime < 5 * 60 * 1000) {  // 5 minutes
        console.log(`[trackReportAccess] Recently tracked, skipping (${Math.round(elapsedTime/1000)}s ago)`);
        return;
      }
    }
    
    // Record that we're tracking this session now
    sessionStorage.setItem(sessionKey, Date.now().toString());
    
    // Log for debugging
    console.log(`[trackReportAccess] Tracking access for ${archetypeId} with token ${accessToken.substring(0, 5)}...`);
    
    // Method 1: Direct RPC call to database function
    // This is the most reliable method as it uses a security definer function
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'increment_report_access',
      { p_access_token: accessToken, p_archetype_id: archetypeId }
    );
    
    if (rpcError) {
      console.error('Error tracking report access via RPC:', rpcError);
      
      // Method 2: Direct update to the database
      // As fallback, try direct update to the report_requests table
      console.log('[trackReportAccess] Falling back to direct update method');
      
      // First get current count
      const { data: currentData, error: getCurrentError } = await supabase
        .from('report_requests')
        .select('access_count')
        .eq('archetype_id', archetypeId)
        .eq('access_token', accessToken)
        .maybeSingle();
      
      if (getCurrentError) {
        console.error('Error getting current access count:', getCurrentError);
      }
      
      // Safely extract the access_count value
      let currentCount = 0;
      if (currentData && typeof currentData === 'object' && 'access_count' in currentData) {
        currentCount = typeof currentData.access_count === 'number' 
          ? currentData.access_count 
          : parseInt(currentData.access_count as string, 10) || 0;
      }
      
      const { error } = await supabase
        .from('report_requests')
        .update({
          last_accessed: new Date().toISOString(),
          access_count: currentCount + 1
        })
        .eq('archetype_id', archetypeId)
        .eq('access_token', accessToken);
      
      if (error) {
        console.error('Error tracking report access via direct update:', error);
      } else {
        console.log('[trackReportAccess] Successfully updated access count via direct update');
      }
    } else {
      // Safely handle returned data
      let accessCount: number | string | null = null;
      
      // Fix for the TypeScript error - Properly type check the rpcData
      if (rpcData && typeof rpcData === 'object') {
        // Safely extract access_count with proper type handling
        if ('access_count' in rpcData) {
          const rawCount = rpcData.access_count;
          if (typeof rawCount === 'number') {
            accessCount = rawCount;
          } else if (typeof rawCount === 'string') {
            accessCount = rawCount;
          } else if (rawCount !== null && rawCount !== undefined) {
            // Convert other types to string representation
            accessCount = String(rawCount);
          }
        }
      }
      
      console.log(`[trackReportAccess] Successfully tracked access via RPC. New count: ${accessCount}`);
    }
    
    // No need for Method 3 (edge function) - we've moved to a dedicated tracking pixel
    
  } catch (err) {
    console.error('Error tracking report access:', err);
    // Don't throw as this is a non-critical operation
  }
};

/**
 * Validate an access token directly
 * @param archetypeId The ID of the archetype
 * @param token The token to validate
 * @returns Promise with validation result
 */
export const validateReportToken = async (
  archetypeId: string,
  token: string
): Promise<{ isValid: boolean; userData?: any; error?: Error }> => {
  try {
    console.log(`[validateReportToken] Validating token ${token.substring(0, 5)}... for ${archetypeId}`);
    
    const { data, error } = await supabase
      .from('report_requests')
      .select('*')
      .eq('archetype_id', archetypeId)
      .eq('access_token', token)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      console.error('[validateReportToken] DB query error:', error);
      return { isValid: false, error: new Error(`Database error: ${error.message}`) };
    }
    
    if (!data) {
      console.log('[validateReportToken] No matching record found');
      return { isValid: false, error: new Error('Invalid or expired token') };
    }
    
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.log('[validateReportToken] Token expired:', data.expires_at);
      return { isValid: false, error: new Error('Token has expired') };
    }
    
    console.log('[validateReportToken] Token validated successfully');
    return { isValid: true, userData: data };
    
  } catch (err) {
    console.error('[validateReportToken] Error:', err);
    return { 
      isValid: false, 
      error: err instanceof Error ? err : new Error('Unknown validation error') 
    };
  }
};
