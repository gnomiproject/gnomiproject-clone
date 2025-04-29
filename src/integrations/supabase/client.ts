
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qsecdncdiykzuimtaosp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZWNkbmNkaXlrenVpbXRhb3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NzgwNjUsImV4cCI6MjA2MDU1NDA2NX0.RKsoksZcUUziqGV4V83_6hntLh09A3rraAiz6EcoTFw";

// Check if current request is for admin mode
const isAdminMode = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('_admin') || window.location.pathname.startsWith('/admin/');
  }
  return false;
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (...args) => {
        // Increase timeout to prevent rapid retries
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        // Log request for security testing
        console.log('[Security] Supabase request:', { 
          url: args[0],
          isAdmin: isAdminMode()
        });
        
        // @ts-ignore
        return fetch(...args, { 
          signal: controller.signal,
          // Use standard cache policy instead of force-cache
          cache: 'default'
        })
        .then(response => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('[Security] Supabase request error:', error);
          throw error;
        });
      }
    },
    db: {
      // Add schema to all queries
      schema: 'public'
    },
    // Enhance realtime subscription settings
    realtime: {
      timeout: 30000 // Increased from 10000
    }
  }
);

// Helper for detecting admin mode throughout the app
export const isAdmin = isAdminMode();

// Add a dedicated test function for security
export const testRlsAccess = async () => {
  try {
    console.log('[Security] Testing access to tables with new secure views...');
    
    // Test Core_Archetype_Overview - this table isn't behind a secure view
    const { data: archetypes, error: archetypesError } = await supabase
      .from('Core_Archetype_Overview')
      .select('count')
      .limit(1);
      
    if (archetypesError) {
      console.error('[Security] Core_Archetype_Overview access error:', archetypesError);
      return { success: false, error: archetypesError };
    }
    
    // Test level3_report_secure view instead of the table directly
    const { data: level3Data, error: level3Error } = await supabase
      .from('level3_report_secure')
      .select('count')
      .limit(1);
      
    if (level3Error) {
      console.error('[Security] level3_report_secure access error:', level3Error);
      return { success: false, error: level3Error };
    }
    
    // Test level4_report_secure view instead of the table directly
    const { data: level4Data, error: level4Error } = await supabase
      .from('level4_report_secure')
      .select('count')
      .limit(1);
      
    if (level4Error) {
      console.error('[Security] level4_report_secure access error:', level4Error);
      // Don't fail on level4 error as it's expected for unauthorized users
      console.log('[Security] Note: level4 access errors may be expected if no valid report request exists');
    }
    
    console.log('[Security] All accessible tables verified with secure views');
    return { 
      success: true, 
      results: { 
        archetypes: !!archetypes, 
        level3Data: !!level3Data, 
        level4Data: !!level4Data 
      } 
    };
  } catch (error) {
    console.error('[Security] Test failed with exception:', error);
    return { success: false, error };
  }
};
