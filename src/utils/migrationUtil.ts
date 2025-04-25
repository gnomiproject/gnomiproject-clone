import { supabase } from "@/integrations/supabase/client";
import { archetypes } from "../data/archetypes";
import { archetypeMetrics } from "../data/archetypeMetrics";
import { distinctiveTraits } from "../data/distinctiveTraits";
import { archetypesDetailed } from "../data/archetypesDetailed";
import { archetypeFamilies } from "../data/archetypeFamilies";
import { toast } from "sonner";

// This utility can be used to migrate all the client-side data to Supabase
// You can run this function once to seed your database
export const migrateDataToSupabase = async () => {
  try {
    console.log('Starting data migration to Supabase...');
    
    // Step 1: Insert archetype families - use correct column names
    console.log('Migrating archetype families...');
    const formattedFamilies = archetypeFamilies.map(family => ({
      id: family.id,
      name: family.name,
      short_description: family.description, // Changed from "description" to "short_description"
      common_traits: family.commonTraits,
      hex_color: family.hexColor // Added hex_color field
    }));
    
    const { error: familiesError } = await supabase
      .from('Core_Archetype_Families')
      .upsert(formattedFamilies, { onConflict: 'id' });
      
    if (familiesError) {
      console.error('Error migrating families:', familiesError);
      toast.error(`Error migrating families: ${familiesError.message}`);
      throw new Error(`Error migrating families: ${familiesError.message}`);
    }
    
    // Step 2: Insert archetypes - use correct table name and fields
    console.log('Migrating archetypes...');
    const formattedArchetypes = archetypes.map(archetype => ({
      id: archetype.id,
      name: archetype.name,
      family_id: archetype.familyId,
      short_description: archetype.shortDescription,
      long_description: archetype.longDescription,
      hex_color: archetype.hexColor
    }));
    
    const { error: archetypesError } = await supabase
      .from('Core_Archetype_Overview')
      .upsert(formattedArchetypes, { onConflict: 'id' });
      
    if (archetypesError) {
      console.error('Error migrating archetypes:', archetypesError);
      toast.error(`Error migrating archetypes: ${archetypesError.message}`);
      throw new Error(`Error migrating archetypes: ${archetypesError.message}`);
    }
    
    // Step 3: Insert archetype metrics - use correct table name and format
    console.log('Migrating archetype metrics...');
    // Fixed to match Supabase schema - each metric needs an 'id' field
    const formattedMetrics = archetypeMetrics.map(metric => ({
      id: metric.archetypeId,  // Use archetypeId as the id field
      Archetype: metric.archetypeId,
      "Cost_Medical Paid Amount PEPY": metric.paidPEPY,
      "Cost_Medical Paid Amount PMPY": metric.paidPMPY,
      // Add other fields as needed to match the schema
      "Demo_Average Family Size": metric.averageFamilySize,
      "Util_Specialist Visits per 1k Members": metric.specialistVisitsPer1K,
      "Util_Inpatient Admits per 1k Members": metric.inpatientAdmitsPer1K,
      "Util_Emergency Visits per 1k Members": metric.emergencyVisitsPer1K,
      "Risk_Average Risk Score": metric.riskCostRatio
    }));
    
    const { error: metricsError } = await supabase
      .from('Core_Archetypes_Metrics')
      .upsert(formattedMetrics, { onConflict: 'id' });
      
    if (metricsError) {
      console.error('Error migrating metrics:', metricsError);
      toast.error(`Error migrating metrics: ${metricsError.message}`);
      throw new Error(`Error migrating metrics: ${metricsError.message}`);
    }
    
    // After migration, verify the data was inserted correctly
    const { data: checkFamilies, error: checkFamiliesError } = await supabase
      .from('Core_Archetype_Families')
      .select('count');
      
    if (checkFamiliesError) {
      console.error('Error verifying families migration:', checkFamiliesError);
    } else {
      console.log('Verification - Families in database:', checkFamilies);
    }
    
    const { data: checkArchetypes, error: checkArchetypesError } = await supabase
      .from('Core_Archetype_Overview')
      .select('count');
      
    if (checkArchetypesError) {
      console.error('Error verifying archetypes migration:', checkArchetypesError);
    } else {
      console.log('Verification - Archetypes in database:', checkArchetypes);
    }
    
    console.log('Data migration completed successfully!');
    toast.success("All data has been successfully migrated to your Supabase database.");
    return true;
    
  } catch (error) {
    console.error('Migration failed:', error);
    toast.error(`Migration failed: ${(error as Error).message}`);
    return false;
  }
};

// This function can be used to check if data already exists in Supabase
export const checkDataInSupabase = async () => {
  try {
    // Check Core_Archetype_Overview since that's a table we know exists
    console.log('Checking if archetype data exists in Supabase...');
    
    const { data, count, error } = await supabase
      .from('Core_Archetype_Overview')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error checking data:', error);
      throw error;
    }
    
    console.log('Data check result:', { count, dataLength: data?.length });
    return { exists: count ? count > 0 : false, count, dataItems: data };
  } catch (error) {
    console.error('Error checking data:', error);
    return { exists: false, count: 0, error };
  }
};
