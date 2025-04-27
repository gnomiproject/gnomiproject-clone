
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
