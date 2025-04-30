
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qsecdncdiykzuimtaosp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZWNkbmNkaXlrenVpbXRhb3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NzgwNjUsImV4cCI6MjA2MDU1NDA2NX0.RKsoksZcUUziqGV4V83_6hntLh09A3rraAiz6EcoTFw";

// Performance-related settings
const CONNECTION_TIMEOUT = 10000; // 10 seconds
const REQUEST_CACHE_TTL = 60 * 5; // 5 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Browser-side cache for Supabase responses
const responseCache = new Map<string, { data: any; timestamp: number }>();

// Check if current request is for admin mode
const isAdminMode = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('_admin') || window.location.pathname.startsWith('/admin/');
  }
  return false;
};

// Helper function to create cache key
const createCacheKey = (url: string, options?: any): string => {
  return `${url}:${options ? JSON.stringify(options) : ''}`;
};

// Custom fetch with caching, timeouts, and retries
const enhancedFetch = async (url: any, options: any): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);
  
  // For GET requests, check cache first
  if (options.method === 'GET' || !options.method) {
    const cacheKey = createCacheKey(url, options);
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < REQUEST_CACHE_TTL * 1000)) {
      console.log('[Performance] Using cached response for:', url);
      clearTimeout(timeoutId);
      return new Response(JSON.stringify(cachedResponse.data), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
  }
  
  // Function to perform the actual fetch with retry logic
  const performFetch = async (retriesLeft: number): Promise<Response> => {
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'default'
      });
      
      // Cache successful GET responses
      if (response.ok && (options.method === 'GET' || !options.method)) {
        const cacheKey = createCacheKey(url, options);
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }
      
      return response;
    } catch (error: any) {
      if (retriesLeft > 0 && error.name !== 'AbortError') {
        console.log(`[Performance] Retrying request, ${retriesLeft} retries left`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return performFetch(retriesLeft - 1);
      }
      throw error;
    }
  };
  
  try {
    const response = await performFetch(MAX_RETRIES);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[Performance] Supabase request failed:', error);
    throw error;
  }
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
      fetch: enhancedFetch
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
    
    console.log('[Security] All accessible tables verified with secure views');
    return { 
      success: true, 
      results: { 
        archetypes: !!archetypes, 
        level3Data: !!level3Data
      } 
    };
  } catch (error) {
    console.error('[Security] Test failed with exception:', error);
    return { success: false, error };
  }
};
