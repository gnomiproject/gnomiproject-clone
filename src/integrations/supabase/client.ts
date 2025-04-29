
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
        
        // Log request for RLS testing
        console.log('[RLS Test] Supabase request:', { 
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
          console.error('[RLS Test] Supabase request error:', error);
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

// Add a dedicated test function for RLS
export const testRlsAccess = async () => {
  try {
    console.log('[RLS Test] Testing access to tables with new RLS policies...');
    
    // Test Core_Archetype_Overview
    const { data: archetypes, error: archetypesError } = await supabase
      .from('Core_Archetype_Overview')
      .select('count')
      .limit(1);
      
    if (archetypesError) {
      console.error('[RLS Test] Core_Archetype_Overview access error:', archetypesError);
      return { success: false, error: archetypesError };
    }
    
    // Test Core_Archetype_Families
    const { data: families, error: familiesError } = await supabase
      .from('Core_Archetype_Families')
      .select('count')
      .limit(1);
      
    if (familiesError) {
      console.error('[RLS Test] Core_Archetype_Families access error:', familiesError);
      return { success: false, error: familiesError };
    }
    
    // Test Core_Archetypes_Metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('Core_Archetypes_Metrics')
      .select('count')
      .limit(1);
      
    if (metricsError) {
      console.error('[RLS Test] Core_Archetypes_Metrics access error:', metricsError);
      return { success: false, error: metricsError };
    }
    
    console.log('[RLS Test] All tables accessible after RLS implementation');
    return { 
      success: true, 
      results: { 
        archetypes: !!archetypes, 
        families: !!families, 
        metrics: !!metrics 
      } 
    };
  } catch (error) {
    console.error('[RLS Test] Test failed with exception:', error);
    return { success: false, error };
  }
};
