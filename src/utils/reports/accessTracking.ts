
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
    console.warn('Cannot track report access: Missing token or archetype ID');
    return false;
  }
  
  try {
    // Call the PostgreSQL function to increment the access counter
    const { data, error } = await supabase.rpc('increment_report_access', {
      p_access_token: token,
      p_archetype_id: archetypeId
    });
    
    if (error) {
      console.error('Error tracking report access:', error);
      return false;
    }
    
    if (data) {
      // Type assertion to make TypeScript happy
      const responseData = data as { access_count?: number, last_accessed?: string };
      
      console.log('Report access tracked successfully:', {
        access_count: responseData.access_count,
        last_accessed: responseData.last_accessed
      });
    }
    
    return true;
  } catch (err) {
    console.error('Exception tracking report access:', err);
    return false;
  }
};
