
import { SupabaseClient } from '@supabase/supabase-js';
import { organizeMetricsByCategory } from './metricUtils';
import { generateReportContent } from './contentGenerator';
import { insertReportContent } from './databaseUtils';
import { ArchetypeId } from '@/types/archetype';
import { ReportGenerationResults } from './types';

const ARCHETYPE_IDS: ArchetypeId[] = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];

/**
 * Main function to generate all archetype reports in batch
 */
async function generateArchetypeReports(supabase: SupabaseClient): Promise<ReportGenerationResults> {
  console.log('Starting batch report generation for all archetypes...');
  
  try {
    // Fetch all archetype data directly from level3_report_data
    console.log('Fetching archetype data from level3_report_data table...');
    const { data: archetypes, error: archetypesError } = await supabase
      .from('level3_report_data')
      .select('*');
    
    if (archetypesError) {
      console.error('Error fetching data from level3_report_data:', archetypesError);
      throw new Error(`Failed to fetch data: ${archetypesError.message}`);
    }
    
    console.log(`Found ${archetypes?.length || 0} archetypes to process`);
    
    if (!archetypes || archetypes.length === 0) {
      throw new Error('No archetype data found in level3_report_data table');
    }
    
    const results: ReportGenerationResults = {
      total: ARCHETYPE_IDS.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      archetypeIds: [],
      errors: []
    };
    
    // Process each archetype data row
    for (const archetype of archetypes) {
      try {
        if (!ARCHETYPE_IDS.includes(archetype.archetype_id as ArchetypeId)) {
          console.log(`Skipping archetype ${archetype.archetype_id} - not in standard set`);
          continue;
        }
        
        console.log(`Processing archetype ${archetype.archetype_id}: ${archetype.archetype_name}`);
        
        // Organize metrics that are already in the row
        console.log(`Organizing metrics for archetype ${archetype.archetype_id}...`);
        const organizedMetrics = organizeMetricsByCategory(archetype);
        
        // Generate report content based on metrics
        console.log(`Generating report content for archetype ${archetype.archetype_id}...`);
        const reportContent = generateReportContent(archetype, organizedMetrics);
        
        // Get SWOT analysis directly from the data
        console.log(`Getting SWOT analysis for archetype ${archetype.archetype_id}...`);
        const swotAnalysis = {
          strengths: archetype.strengths || [],
          weaknesses: archetype.weaknesses || [],
          opportunities: archetype.opportunities || [],
          threats: archetype.threats || []
        };
        
        // Get strategic recommendations directly from the data
        console.log(`Getting strategic recommendations for archetype ${archetype.archetype_id}...`);
        const strategicRecommendations = archetype.strategic_recommendations || [];
        
        // Insert report content
        console.log(`Inserting data into Supabase for archetype ${archetype.archetype_id}...`);
        await insertReportContent(
          supabase, 
          archetype.archetype_id, 
          reportContent, 
          swotAnalysis, 
          strategicRecommendations
        );
        
        console.log(`Completed processing for ${archetype.archetype_id}`);
        results.processed++;
        results.succeeded++;
        results.archetypeIds.push(archetype.archetype_id);
        
      } catch (error) {
        console.error(`Error processing archetype ${archetype.archetype_id}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.processed++;
        results.failed++;
        results.errors.push(`Error with ${archetype.archetype_id}: ${errorMessage}`);
      }
    }
    
    console.log('Report generation complete!', results);
    return results;
  } catch (error) {
    console.error('Fatal error in report generation:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Report generation failed: ${errorMessage}`);
  }
}

export default generateArchetypeReports;
