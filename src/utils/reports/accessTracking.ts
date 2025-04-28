
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
    // First, try to update the existing record via direct API call
    const { error } = await supabase
      .from('report_requests')
      .update({
        last_accessed: new Date().toISOString(),
        access_count: supabase.rpc('increment', { row_id: archetypeId })
      })
      .eq('archetype_id', archetypeId)
      .eq('access_token', accessToken);
    
    if (error) {
      console.error('Error tracking report access via direct update:', error);
      
      // As a fallback, load an invisible tracking pixel from our edge function
      const supabaseUrl = supabase.supabaseUrl;
      const trackingUrl = 
        `${supabaseUrl}/functions/v1/send-report-email/track-access/${archetypeId}/${accessToken}`;
      
      const img = new Image();
      img.src = trackingUrl;
      img.style.display = 'none';
      document.body.appendChild(img);
      
      // Remove the image after it has loaded (or failed to load)
      img.onload = img.onerror = () => {
        document.body.removeChild(img);
      };
    }
  } catch (err) {
    console.error('Error tracking report access:', err);
  }
};

/**
 * Creates a SQL function to increment a counter field
 * This is a utility function that can be used to create the necessary SQL function
 * Run this in your SQL console once
 */
export const createIncrementFunction = async (): Promise<void> => {
  try {
    await supabase.rpc('create_increment_function');
    console.log('Increment function created successfully');
  } catch (error) {
    console.error('Error creating increment function:', error);
  }
};
