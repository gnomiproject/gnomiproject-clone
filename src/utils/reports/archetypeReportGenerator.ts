
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
    // First, verify database connection is active with a simpler query
    console.log('Verifying database connection...');
    const { error: connectionError } = await supabase
      .from('Core_Archetype_Overview')
      .select('id')
      .limit(1);
      
    if (connectionError) {
      console.error('Database connection error:', connectionError);
      throw new Error(`Database connection error: ${connectionError.message}`);
    }
    
    // Tracking which data source we're using
    let dataSource = '';
    let archetypes = null;
    
    // Try fetching data from all possible tables in order of preference
    // First try level3_report_data (most detailed source)
    try {
      console.log('Attempting to fetch data from level3_report_data...');
      const { data: level3Data, error: level3Error } = await supabase
        .from('level3_report_data')
        .select('*');
      
      if (level3Error) {
        console.error('Error fetching from level3_report_data:', level3Error);
      } else if (level3Data && level3Data.length > 0) {
        console.log(`Found ${level3Data.length} archetypes in level3_report_data`);
        archetypes = level3Data;
        dataSource = 'level3_report_data';
      } else {
        console.log('No data found in level3_report_data');
      }
    } catch (e) {
      console.error('Exception when accessing level3_report_data:', e);
    }
    
    // If level3 failed, try Core_Archetype_Overview + Core_Archetypes_Metrics
    if (!archetypes) {
      try {
        console.log('Falling back to Core tables...');
        const { data: overviewData, error: overviewError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*');
          
        if (overviewError) {
          console.error('Error fetching from Core_Archetype_Overview:', overviewError);
          throw new Error(`Failed to fetch archetype overviews: ${overviewError.message}`);
        }
        
        if (!overviewData || overviewData.length === 0) {
          throw new Error('No archetype data found in Core_Archetype_Overview');
        }
        
        console.log(`Found ${overviewData.length} archetypes in Core_Archetype_Overview`);
        
        // Get metrics data for these archetypes
        const { data: metricsData, error: metricsError } = await supabase
          .from('Core_Archetypes_Metrics')
          .select('*');
          
        if (metricsError) {
          console.error('Error fetching from Core_Archetypes_Metrics:', metricsError);
        }
        
        // Combine overview and metrics data
        archetypes = overviewData.map(overview => {
          const metrics = metricsData?.find(m => m.id === overview.id) || {};
          return { ...overview, ...metrics };
        });
        
        dataSource = 'Core tables';
      } catch (e) {
        console.error('Exception when accessing Core tables:', e);
        throw new Error(`Failed to fetch data from any source: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    
    console.log(`Using data source: ${dataSource} with ${archetypes?.length || 0} archetypes`);
    
    if (!archetypes || archetypes.length === 0) {
      throw new Error('No archetype data found in any table');
    }
    
    const results: ReportGenerationResults = {
      total: ARCHETYPE_IDS.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      archetypeIds: [],
      errors: []
    };
    
    // Process each archetype but only for standard archetype IDs
    for (const archetype of archetypes) {
      try {
        const archetypeId = archetype.archetype_id || archetype.id;
        
        if (!ARCHETYPE_IDS.includes(archetypeId as ArchetypeId)) {
          console.log(`Skipping archetype ${archetypeId} - not in standard set`);
          continue;
        }
        
        console.log(`Processing archetype ${archetypeId}: ${archetype.archetype_name || archetype.name}`);
        
        // Organize metrics that are already in the row
        console.log(`Organizing metrics for archetype ${archetypeId}...`);
        const organizedMetrics = organizeMetricsByCategory(archetype);
        
        // Generate report content based on metrics
        console.log(`Generating report content for archetype ${archetypeId}...`);
        const reportContent = generateReportContent(archetype, organizedMetrics);
        
        // Get SWOT analysis from the data with fallbacks
        console.log(`Getting SWOT analysis for archetype ${archetypeId}...`);
        const swotAnalysis = {
          strengths: archetype.strengths || [],
          weaknesses: archetype.weaknesses || [],
          opportunities: archetype.opportunities || [],
          threats: archetype.threats || []
        };
        
        // Get strategic recommendations with fallbacks
        console.log(`Getting strategic recommendations for archetype ${archetypeId}...`);
        const strategicRecommendations = archetype.strategic_recommendations || [];
        
        // Insert report content
        console.log(`Inserting data into Supabase for archetype ${archetypeId}...`);
        await insertReportContent(
          supabase, 
          archetypeId, 
          reportContent, 
          swotAnalysis, 
          strategicRecommendations
        );
        
        console.log(`Completed processing for ${archetypeId}`);
        results.processed++;
        results.succeeded++;
        results.archetypeIds.push(archetypeId);
        
      } catch (error) {
        console.error(`Error processing archetype ${archetype.archetype_id || archetype.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.processed++;
        results.failed++;
        results.errors.push(`Error with ${archetype.archetype_id || archetype.id}: ${errorMessage}`);
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
