
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates token access for a given archetype
 * @param archetypeId The archetype ID to validate access for
 * @param token The access token to validate
 * @returns Object containing validation result and debug info
 */
export const fetchTokenAccess = async (archetypeId: string, token: string) => {
  try {
    console.log(`[fetchTokenAccess] Validating token for ${archetypeId}`);
    
    // Check token against report_requests table (not report_access)
    const { data, error } = await supabase
      .from('report_requests')
      .select('*')
      .eq('archetype_id', archetypeId)
      .eq('access_token', token)
      .maybeSingle();
    
    if (error) {
      return { 
        data: null, 
        error, 
        debugInfo: {
          timestamp: new Date().toISOString(),
          error: error.message,
          source: 'report_requests table'
        }
      };
    }
    
    if (!data) {
      return { 
        data: null, 
        error: { message: 'Invalid access token' },
        debugInfo: {
          timestamp: new Date().toISOString(),
          message: 'No matching token found',
          source: 'report_requests table'
        }
      };
    }
    
    return { 
      data, 
      error: null, 
      debugInfo: {
        timestamp: new Date().toISOString(),
        accessFound: true,
        source: 'report_requests table'
      }
    };
  } catch (error) {
    console.error('Error validating token:', error);
    return { 
      data: null, 
      error: { message: 'Error validating token' }, 
      debugInfo: {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        source: 'fetchTokenAccess catch block'
      }
    };
  }
};
