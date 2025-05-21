
import { supabase } from '@/integrations/supabase/client';

/**
 * Track report access and update access counters
 * This will increment the access count and update the last_accessed timestamp
 * 
 * @param archetypeId The archetype ID being accessed
 * @param token The access token for the report
 * @returns Promise<boolean> True if tracking was successful
 */
export const trackReportAccess = async (
  archetypeId: string,
  token: string
): Promise<boolean> => {
  // Skip tracking if no token or archetypeId provided
  if (!token || !archetypeId) {
    console.warn('[trackReportAccess] Cannot track report access: Missing token or archetype ID');
    return false;
  }
  
  try {
    console.log(`[trackReportAccess] Tracking report access for archetype: ${archetypeId}, token: ${token.substring(0, 5)}...`);
    
    // Call the PostgreSQL function to increment the access counter
    const { data, error } = await supabase.rpc('increment_report_access', {
      p_access_token: token,
      p_archetype_id: archetypeId
    });
    
    if (error) {
      console.error('[trackReportAccess] Error tracking report access:', error);
      return false;
    }
    
    // Log successful tracking with response data
    if (data) {
      // The response is already properly typed from the RPC function
      console.log('[trackReportAccess] Report access tracked successfully:', {
        access_count: data.access_count,
        last_accessed: data.last_accessed
      });
    } else {
      console.log('[trackReportAccess] Report access tracked, but no data returned');
    }
    
    return true;
  } catch (err) {
    console.error('[trackReportAccess] Exception tracking report access:', err);
    return false;
  }
};
