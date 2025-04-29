
import { supabase } from '@/integrations/supabase/client';

/**
 * Tracks when a user accesses a report by token
 * @param archetypeId The ID of the archetype
 * @param accessToken The access token for the report
 */
export const trackReportAccess = async (
  archetypeId: string,
  accessToken: string
): Promise<void> => {
  try {
    // Log for debugging
    console.log(`[trackReportAccess] Tracking access for ${archetypeId} with token ${accessToken.substring(0, 5)}...`);
    
    // First, try to update the existing record
    // We'll first get the current count, then increment it
    const { data: currentData } = await supabase
      .from('report_requests')
      .select('access_count')
      .eq('archetype_id', archetypeId)
      .eq('access_token', accessToken)
      .single();
      
    const currentCount = currentData?.access_count || 0;
    
    // Now update with the incremented count
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
      
      // As a fallback, call the increment-counter edge function
      try {
        const response = await supabase.functions.invoke('increment-counter', {
          body: { archetypeId, accessToken }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        console.log('Tracked access via edge function:', response.data);
      } catch (fallbackErr) {
        console.error('Edge function fallback failed:', fallbackErr);
      }
    } else {
      console.log(`[trackReportAccess] Successfully updated access count to ${currentCount + 1}`);
    }
  } catch (err) {
    console.error('Error tracking report access:', err);
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
