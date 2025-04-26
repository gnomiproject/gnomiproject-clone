
import { SupabaseClient } from '@supabase/supabase-js';

// Helper function to organize metrics by category
function organizeMetricsByCategory(metrics: any) {
  console.log(`Organizing metrics by category`);
  const organized: { [key: string]: any } = {};
  
  // Go through all properties in the data object
  Object.keys(metrics).forEach(key => {
    // Skip non-metric properties or null values
    if (!key.includes('_') || !metrics[key]) return;
    
    // Extract category from the metric name (e.g., "Cost_Medical Paid Amount PEPY" -> "Cost")
    const category = key.split('_')[0];
    
    if (!organized[category]) {
      organized[category] = [];
    }
    
    organized[category].push({
      metric: key.split('_')[1],
      value: metrics[key],
      category: category
    });
  });
  
  console.log(`Organized into ${Object.keys(organized).length} categories`);
  return organized;
}

// Helper function to generate report content
function generateReportContent(archetype: any, organizedMetrics: any) {
  console.log(`Generating report content for archetype ${archetype.archetype_id}: ${archetype.archetype_name}`);
  const title = `Deep Dive Report: ${archetype.archetype_name}`;
  const introduction = archetype.executive_summary || 
    `This report provides an in-depth analysis of the ${archetype.archetype_name} archetype, focusing on key metrics and strategic insights.`;
  const summary_analysis = `The ${archetype.archetype_name} archetype exhibits distinct characteristics across several key performance indicators.`;
  const distinctive_metrics_summary = `Key metrics highlight the unique attributes of the ${archetype.archetype_name} archetype, providing a comprehensive overview of its strengths and weaknesses.`;
  
  return {
    title,
    introduction,
    summary_analysis,
    distinctive_metrics_summary,
    detailed_metrics: organizedMetrics
  };
}

// Full function to generate archetype reports
async function generateArchetypeReports(supabase: SupabaseClient) {
  console.log('Starting report generation process with detailed logging...');
  
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
    
    const results = {
      total: archetypes.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      archetypeIds: [] as string[],
      errors: [] as string[]
    };
    
    // Process each archetype data row
    for (const archetype of archetypes) {
      try {
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

// Utility function to insert report content into Supabase
async function insertReportContent(
  supabase: SupabaseClient, 
  archetypeId: string, 
  reportContent: any, 
  swotAnalysis: any, 
  strategicRecommendations: any
) {
  console.log(`Inserting report content for archetype ${archetypeId}`);
  
  try {
    // Insert or update the deep dive report
    console.log(`Inserting deep dive report for ${archetypeId}...`);
    console.log(`Report data structure:`, Object.keys(reportContent));
    
    // Ensure detailed_metrics is properly formatted as a valid JSON object
    const detailedMetrics = reportContent.detailed_metrics || {};
    
    console.log(`Inserting report with detailed_metrics:`, typeof detailedMetrics);
    
    // Check if report already exists
    const { data: existingReport } = await supabase
      .from('Analysis_Archetype_Full_Reports')
      .select('id')
      .eq('archetype_id', archetypeId)
      .maybeSingle();
    
    // Insert or update based on existence
    let reportError;
    if (existingReport?.id) {
      // Update existing report
      const { error } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .update({
          executive_summary: reportContent.introduction,
          archetype_overview: reportContent,
          key_findings: [],
          detailed_metrics: detailedMetrics,
          swot_analysis: swotAnalysis,
          strategic_recommendations: strategicRecommendations,
          last_updated: new Date().toISOString()
        })
        .eq('archetype_id', archetypeId);
      reportError = error;
    } else {
      // Insert new report
      const { error } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .insert({
          archetype_id: archetypeId,
          executive_summary: reportContent.introduction,
          archetype_overview: reportContent,
          key_findings: [],
          detailed_metrics: detailedMetrics,
          swot_analysis: swotAnalysis,
          strategic_recommendations: strategicRecommendations,
          last_updated: new Date().toISOString()
        });
      reportError = error;
    }

    if (reportError) {
      console.error(`Error inserting report for ${archetypeId}:`, reportError);
      console.error('Error code:', reportError.code);
      console.error('Error message:', reportError.message);
      console.error('Error details:', reportError.details);
      throw new Error(`Failed to insert report: ${reportError.message}`);
    }
    
    console.log(`Successfully inserted deep dive report for ${archetypeId}`);

    // Insert or update SWOT analysis - same pattern as above
    const { data: existingSwot } = await supabase
      .from('Analysis_Archetype_SWOT')
      .select('id')
      .eq('archetype_id', archetypeId)
      .maybeSingle();
    
    // Insert or update based on existence
    let swotError;
    if (existingSwot?.id) {
      const { error } = await supabase
        .from('Analysis_Archetype_SWOT')
        .update({
          strengths: swotAnalysis.strengths,
          weaknesses: swotAnalysis.weaknesses,
          opportunities: swotAnalysis.opportunities,
          threats: swotAnalysis.threats,
          last_updated: new Date().toISOString()
        })
        .eq('archetype_id', archetypeId);
      swotError = error;
    } else {
      const { error } = await supabase
        .from('Analysis_Archetype_SWOT')
        .insert({
          archetype_id: archetypeId,
          strengths: swotAnalysis.strengths,
          weaknesses: swotAnalysis.weaknesses,
          opportunities: swotAnalysis.opportunities,
          threats: swotAnalysis.threats,
          last_updated: new Date().toISOString()
        });
      swotError = error;
    }

    if (swotError) {
      console.error(`Error inserting SWOT analysis for ${archetypeId}:`, swotError);
      console.error('Error code:', swotError.code);
      console.error('Error message:', swotError.message);
      console.error('Error details:', swotError.details);
      throw new Error(`Failed to insert SWOT analysis: ${swotError.message}`);
    }
    
    console.log(`Successfully inserted SWOT analysis for ${archetypeId}`);

    // Clear and re-insert Strategic Recommendations
    // Delete existing recommendations first
    await supabase
      .from('Analysis_Archetype_Strategic_Recommendations')
      .delete()
      .eq('archetype_id', archetypeId);
    
    console.log(`Inserting ${strategicRecommendations.length} recommendations for ${archetypeId}...`);
    
    for (let i = 0; i < strategicRecommendations.length; i++) {
      const rec = strategicRecommendations[i];
      console.log(`Inserting recommendation ${i + 1}: ${rec.title}`);
      
      const { error: recommendationError } = await supabase
        .from('Analysis_Archetype_Strategic_Recommendations')
        .insert({
          archetype_id: archetypeId,
          recommendation_number: rec.recommendation_number || i + 1,
          title: rec.title,
          description: rec.description,
          metrics_references: rec.metrics_references || '',
          last_updated: new Date().toISOString()
        });

      if (recommendationError) {
        console.error(`Error inserting recommendation ${i+1} for ${archetypeId}:`, recommendationError);
        console.error('Error code:', recommendationError.code);
        console.error('Error message:', recommendationError.message);
        console.error('Error details:', recommendationError.details);
        throw new Error(`Failed to insert recommendation: ${recommendationError.message}`);
      }
      
      console.log(`Successfully inserted recommendation ${i+1} for ${archetypeId}`);
    }
    
    console.log(`Successfully inserted all data for archetype ${archetypeId}`);
  } catch (error) {
    console.error(`Error in insertReportContent for ${archetypeId}:`, error);
    throw error;
  }
}

export default generateArchetypeReports;
