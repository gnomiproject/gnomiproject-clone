
import { supabase } from '@/integrations/supabase/client';
import { Archetype, ArchetypeFamily } from '@/types/archetype';

/**
 * Checks if data exists in the Supabase database
 * @returns Promise that resolves to an object with exists boolean and count
 */
export const checkDataInSupabase = async () => {
  try {
    const { data, error, count } = await supabase
      .from('Core_Archetype_Overview')
      .select('*', { count: 'exact' });
    
    if (error) throw error;
    
    return {
      exists: count ? count > 0 : false,
      count: count || 0
    };
  } catch (error) {
    console.error('Error checking data in Supabase:', error);
    throw error;
  }
};

export const migrateDataToSupabase = async () => {
  try {
    // This is a placeholder function - in a real application,
    // you would implement the actual migration logic here
    console.log('Starting data migration to Supabase...');
    
    // Mock successful migration
    return true;
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
};
