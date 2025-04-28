
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
        
        // As a last resort, load an invisible tracking pixel
        // Get the base URL from the client's URL
        const baseUrl = typeof window !== 'undefined' ? 
          `${window.location.protocol}//${window.location.host}` : 
          '';
        
        // Construct the function URL
        const functionUrl = `${baseUrl}/functions/v1/increment-counter`;
        
        const img = new Image();
        img.src = functionUrl;
        img.style.display = 'none';
        document.body.appendChild(img);
        
        // Remove the image after it has loaded (or failed to load)
        img.onload = img.onerror = () => {
          document.body.removeChild(img);
        };
      }
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
    // Call the edge function that will create the increment function in the database
    const { error } = await supabase.functions.invoke('create-increment-function');
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Increment function created successfully');
  } catch (error: any) {
    console.error('Error creating increment function:', error);
  }
};
