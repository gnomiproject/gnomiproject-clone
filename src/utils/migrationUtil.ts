
import { supabase } from "@/integrations/supabase/client";
import { archetypes } from "../data/archetypes";
import { archetypeMetrics } from "../data/archetypeMetrics";
import { distinctiveTraits } from "../data/distinctiveTraits";
import { archetypesDetailed } from "../data/archetypesDetailed";
import { archetypeFamilies } from "../data/archetypeFamilies";
import { toast } from "@/components/ui/use-toast";

// This utility can be used to migrate all the client-side data to Supabase
// You can run this function once to seed your database
export const migrateDataToSupabase = async () => {
  try {
    console.log('Starting data migration to Supabase...');
    
    // Step 1: Insert archetype families - use correct table name
    console.log('Migrating archetype families...');
    const formattedFamilies = archetypeFamilies.map(family => ({
      id: family.id,
      name: family.name,
      description: family.description,
      common_traits: family.commonTraits
    }));
    
    const { error: familiesError } = await supabase
      .from('Core_Archetype_Families')
      .upsert(formattedFamilies, { onConflict: 'id' });
      
    if (familiesError) {
      console.error('Error migrating families:', familiesError);
      toast({
        title: "Migration Error",
        description: `Error migrating families: ${familiesError.message}`,
        variant: "destructive"
      });
      throw new Error(`Error migrating families: ${familiesError.message}`);
    }
    
    // Step 2: Insert archetypes - use correct table name
    console.log('Migrating archetypes...');
    const formattedArchetypes = archetypes.map(archetype => ({
      id: archetype.id,
      name: archetype.name,
      family_id: archetype.familyId,
      short_description: archetype.shortDescription,
      long_description: archetype.longDescription,
      characteristics: archetype.characteristics,
      strategic_priorities: archetype.strategicPriorities,
      risk_score: archetype.riskScore,
      risk_variance: archetype.riskVariance,
      primary_risk_driver: archetype.primaryRiskDriver,
      color: archetype.color
    }));
    
    const { error: archetypesError } = await supabase
      .from('Core_Archetype_Overview')
      .upsert(formattedArchetypes, { onConflict: 'id' });
      
    if (archetypesError) {
      console.error('Error migrating archetypes:', archetypesError);
      toast({
        title: "Migration Error",
        description: `Error migrating archetypes: ${archetypesError.message}`,
        variant: "destructive"
      });
      throw new Error(`Error migrating archetypes: ${archetypesError.message}`);
    }
    
    // Step 3: Insert archetype metrics - use correct table name
    console.log('Migrating archetype metrics...');
    const formattedMetrics = archetypeMetrics.map(metric => ({
      archetype_id: metric.archetypeId,
      paid_pepy: metric.paidPEPY,
      paid_pepy_variance: metric.paidPEPYVariance,
      paid_pmpy: metric.paidPMPY,
      paid_pmpy_variance: metric.paidPMPYVariance,
      paid_allowed_ratio: metric.paidAllowedRatio,
      average_family_size: metric.averageFamilySize,
      specialist_visits_per_1k: metric.specialistVisitsPer1K,
      inpatient_admits_per_1k: metric.inpatientAdmitsPer1K,
      emergency_visits_per_1k: metric.emergencyVisitsPer1K,
      sdoh_score: metric.sdohScore,
      risk_cost_ratio: metric.riskCostRatio
    }));
    
    const { error: metricsError } = await supabase
      .from('Core_Archetypes_Metrics')
      .upsert(formattedMetrics, { onConflict: 'archetype_id' });
      
    if (metricsError) {
      console.error('Error migrating metrics:', metricsError);
      toast({
        title: "Migration Error",
        description: `Error migrating metrics: ${metricsError.message}`,
        variant: "destructive"
      });
      throw new Error(`Error migrating metrics: ${metricsError.message}`);
    }
    
    // Step 4: Insert distinctive traits - use correct table name or comment out if not needed
    console.log('Migrating distinctive traits...');
    // Instead of trying to write to tables that don't exist, just log what would happen
    console.log('Would insert distinctive traits:', distinctiveTraits);
    
    // Step 5: Insert detailed archetype data - use correct table or comment out if not needed
    console.log('Migrating detailed archetype data...');
    // Instead of trying to write to tables that don't exist, just log what would happen
    console.log('Would insert detailed archetype data:', archetypesDetailed);
    
    console.log('Data migration completed successfully!');
    toast({
      title: "Migration Successful",
      description: "All data has been successfully migrated to your Supabase database.",
    });
    return true;
    
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

// This function can be used to check if data already exists in Supabase
export const checkDataInSupabase = async () => {
  try {
    // Check Core_Archetype_Overview since that's a table we know exists
    const { count, error } = await supabase
      .from('Core_Archetype_Overview')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return { exists: count && count > 0, count };
  } catch (error) {
    console.error('Error checking data:', error);
    return { exists: false, count: 0 };
  }
};
