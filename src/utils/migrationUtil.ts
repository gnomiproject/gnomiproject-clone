
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
    
    // Step 1: Insert archetype families
    console.log('Migrating archetype families...');
    const formattedFamilies = archetypeFamilies.map(family => ({
      id: family.id,
      name: family.name,
      description: family.description,
      common_traits: family.commonTraits
    }));
    
    const { error: familiesError } = await supabase
      .from('archetype_families')
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
    
    // Step 2: Insert archetypes
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
      .from('archetypes')
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
    
    // Step 3: Insert archetype metrics
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
      .from('archetype_metrics')
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
    
    // Step 4: Insert distinctive traits
    console.log('Migrating distinctive traits...');
    const formattedTraits = distinctiveTraits.map(trait => ({
      archetype_id: trait.archetypeId,
      disease_patterns: trait.diseasePatterns,
      utilization_patterns: trait.utilizationPatterns,
      unique_insights: trait.uniqueInsights
    }));
    
    const { error: traitsError } = await supabase
      .from('distinctive_traits')
      .upsert(formattedTraits, { onConflict: 'archetype_id' });
      
    if (traitsError) {
      console.error('Error migrating traits:', traitsError);
      toast({
        title: "Migration Error",
        description: `Error migrating traits: ${traitsError.message}`,
        variant: "destructive"
      });
      throw new Error(`Error migrating traits: ${traitsError.message}`);
    }
    
    // Step 5: Insert detailed archetype data
    console.log('Migrating detailed archetype data...');
    const formattedDetailedData = archetypesDetailed.map(data => {
      const familyName = archetypeFamilies.find(f => f.id === data.familyId)?.name || '';
      return {
        id: data.id,
        family_id: data.familyId,
        name: data.name,
        family_name: familyName,
        color: data.color,
        summary: data.summary,
        standard: data.standard,
        enhanced: data.enhanced
      };
    });
    
    const { error: detailedError } = await supabase
      .from('archetypes_detailed')
      .upsert(formattedDetailedData, { onConflict: 'id' });
      
    if (detailedError) {
      console.error('Error migrating detailed data:', detailedError);
      toast({
        title: "Migration Error",
        description: `Error migrating detailed data: ${detailedError.message}`,
        variant: "destructive"
      });
      throw new Error(`Error migrating detailed data: ${detailedError.message}`);
    }
    
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
    const { count, error } = await supabase
      .from('archetypes')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return { exists: count && count > 0, count };
  } catch (error) {
    console.error('Error checking data:', error);
    return { exists: false, count: 0 };
  }
};
