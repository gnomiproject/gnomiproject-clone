
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
      
      const currentCount = currentData?.access_count ? Number(currentData.access_count) : 0;
      
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
        
        // Method 3: Edge function as last resort
        // Call the increment-counter edge function
        console.log('[trackReportAccess] Falling back to edge function method');
        
        const response = await supabase.functions.invoke('increment-counter', {
          body: { archetypeId, accessToken }
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        console.log('[trackReportAccess] Tracked access via edge function:', response.data);
      } else {
        console.log('[trackReportAccess] Successfully updated access count via direct update');
      }
    } else {
      // Safely handle rpcData which might be of type Json (string | number | boolean | null | Json[] | { [key: string]: Json })
      const accessCount = typeof rpcData === 'object' && rpcData !== null && 'access_count' in rpcData 
        ? rpcData.access_count 
        : 'unknown';
      
      console.log(`[trackReportAccess] Successfully tracked access via RPC. New count: ${accessCount}`);
    }
    
    // Method 4: Loading a tracking pixel as additional fallback
    // This happens separately in the component, since we need the DOM to load an image
  } catch (err) {
    console.error('Error tracking report access:', err);
    
    // Don't throw as this is a non-critical operation
    // and shouldn't break the UI flow if it fails
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
