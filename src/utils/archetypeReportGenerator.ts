
import { SupabaseClient } from '@supabase/supabase-js';

// Helper function to organize metrics by category
function organizeMetricsByCategory(metrics: any[]) {
  console.log(`Organizing ${metrics.length} metrics by category`);
  const organized: { [key: string]: any } = {};
  metrics.forEach(metric => {
    if (!organized[metric.Category]) {
      organized[metric.Category] = [];
    }
    organized[metric.Category].push(metric);
  });
  console.log(`Organized into ${Object.keys(organized).length} categories`);
  return organized;
}

// Helper function to generate report content
function generateReportContent(archetype: any, organizedMetrics: any) {
  console.log(`Generating report content for archetype ${archetype.id}: ${archetype.name}`);
  const title = `Deep Dive Report: ${archetype.name}`;
  const introduction = `This report provides an in-depth analysis of the ${archetype.name} archetype, focusing on key metrics and strategic insights.`;
  const summary_analysis = `The ${archetype.name} archetype exhibits distinct characteristics across several key performance indicators.`;
  const distinctive_metrics_summary = `Key metrics highlight the unique attributes of the ${archetype.name} archetype, providing a comprehensive overview of its strengths and weaknesses.`;
  const data_details = JSON.stringify(organizedMetrics, null, 2); // Convert organized metrics to JSON string

  return {
    title,
    introduction,
    summary_analysis,
    distinctive_metrics_summary,
    data_details
  };
}

// Helper function to generate SWOT analysis
function generateSwotAnalysis(archetype: any, organizedMetrics: any) {
  console.log(`Generating SWOT analysis for archetype ${archetype.id}`);
  const strengths = [
    `High performance in areas such as ${Object.keys(organizedMetrics)[0] || 'primary metrics'}`,
    `Strong показатели in ${Object.keys(organizedMetrics)[1] || 'another category'}`
  ];
  const weaknesses = [
    `Underperformance in areas such as ${Object.keys(organizedMetrics)[2] || 'a category with low scores'}`,
    `Challenges related to ${Object.keys(organizedMetrics)[3] || 'areas needing improvement'}`
  ];
  const opportunities = [
    `Leverage strengths in ${Object.keys(organizedMetrics)[0] || 'key metrics'} to expand market presence`,
    `Improve weaknesses in ${Object.keys(organizedMetrics)[2] || 'critical areas'} to enhance overall performance`
  ];
  const threats = [
    `Potential risks associated with ${Object.keys(organizedMetrics)[3] || 'external factors'}`,
    `Competitive pressures in the ${archetype.name} archetype segment`
  ];

  return {
    strengths,
    weaknesses,
    opportunities,
    threats
  };
}

// Helper function to generate strategic recommendations
function generateStrategicRecommendations(archetype: any, organizedMetrics: any) {
  console.log(`Generating recommendations for archetype ${archetype.id}`);
  const recommendations = [
    {
      title: `Optimize Performance in ${Object.keys(organizedMetrics)[0] || 'Key Areas'}`,
      description: `Focus on leveraging strengths in ${Object.keys(organizedMetrics)[0] || 'primary metrics'} to achieve strategic goals.`,
      metrics_references: Object.keys(organizedMetrics)[0] || 'Key Metrics'
    },
    {
      title: `Address Weaknesses in ${Object.keys(organizedMetrics)[2] || 'Critical Areas'}`,
      description: `Implement strategies to mitigate weaknesses and improve performance in key areas.`,
      metrics_references: Object.keys(organizedMetrics)[2] || 'Performance Metrics'
    }
  ];

  return recommendations;
}

// Full function to generate archetype reports
async function generateArchetypeReports(supabase: SupabaseClient) {
  console.log('Starting report generation process with detailed logging...');
  
  try {
    // 1. Fetch all archetypes
    console.log('Fetching archetypes from database...');
    const { data: archetypes, error: archetypesError } = await supabase
      .from('archetypes')
      .select('*');
    
    if (archetypesError) {
      console.error('Error fetching archetypes:', archetypesError);
      throw archetypesError;
    }
    
    console.log(`Found ${archetypes?.length || 0} archetypes to process`);
    
    if (!archetypes || archetypes.length === 0) {
      throw new Error('No archetypes found in the database');
    }
    
    const results = {
      total: archetypes.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      archetypeIds: [] as string[],
      errors: [] as string[]
    };
    
    // 2. Process each archetype
    for (const archetype of archetypes) {
      try {
        console.log(`Processing archetype ${archetype.id}: ${archetype.name}`);
        
        // 3. Fetch metrics data for this archetype
        console.log(`Fetching metrics for archetype ${archetype.id}...`);
        const { data: metrics, error: metricsError } = await supabase
          .from('archetype_data_041624bw')
          .select('*')
          .eq('archetype_ID', archetype.id);
        
        if (metricsError) {
          console.error(`Error fetching metrics for ${archetype.id}:`, metricsError);
          throw metricsError;
        }
        
        console.log(`Found ${metrics?.length || 0} metrics for archetype ${archetype.id}`);
        
        if (!metrics || metrics.length === 0) {
          throw new Error(`No metrics found for archetype ${archetype.id}`);
        }
        
        // 4. Organize metrics by category
        console.log(`Organizing metrics for archetype ${archetype.id}...`);
        const organizedMetrics = organizeMetricsByCategory(metrics);
        
        if (Object.keys(organizedMetrics).length === 0) {
          throw new Error(`Failed to organize metrics for archetype ${archetype.id}`);
        }
        
        // 5. Generate report content based on metrics
        console.log(`Generating report content for archetype ${archetype.id}...`);
        const reportContent = generateReportContent(archetype, organizedMetrics);
        
        // 6. Generate SWOT analysis
        console.log(`Generating SWOT analysis for archetype ${archetype.id}...`);
        const swotAnalysis = generateSwotAnalysis(archetype, organizedMetrics);
        
        // 7. Generate strategic recommendations
        console.log(`Generating strategic recommendations for archetype ${archetype.id}...`);
        const strategicRecommendations = generateStrategicRecommendations(archetype, organizedMetrics);
        
        // 8. Insert report content
        console.log(`Inserting data into Supabase for archetype ${archetype.id}...`);
        await insertReportContent(supabase, archetype.id, reportContent, swotAnalysis, strategicRecommendations);
        
        console.log(`Completed processing for ${archetype.id}`);
        results.processed++;
        results.succeeded++;
        results.archetypeIds.push(archetype.id);
        
      } catch (error) {
        console.error(`Error processing archetype ${archetype.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.processed++;
        results.failed++;
        results.errors.push(`Error with ${archetype.id}: ${errorMessage}`);
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
    // Debug: Log the reportContent.data_details to see what's being inserted
    console.log(`Report data_details type: ${typeof reportContent.data_details}`);
    console.log(`Report data details sample:`, reportContent.data_details.substring(0, 100) + '...');
    
    let parsedData;
    try {
      // Parse the JSON string to an object for storage
      parsedData = JSON.parse(reportContent.data_details);
      console.log('Successfully parsed data_details JSON');
    } catch (parseError) {
      console.error('Error parsing data_details:', parseError);
      // If parsing fails, use the string directly
      parsedData = reportContent.data_details;
    }

    // Insert or update the deep dive report
    console.log(`Inserting deep dive report for ${archetypeId}...`);
    const { data: reportData, error: reportError } = await supabase
      .from('archetype_deep_dive_reports')
      .upsert({
        archetype_id: archetypeId,
        title: reportContent.title,
        introduction: reportContent.introduction,
        summary_analysis: reportContent.summary_analysis,
        distinctive_metrics_summary: reportContent.distinctive_metrics_summary,
        data_details: parsedData,
        last_updated: new Date().toISOString()
      }, { 
        onConflict: 'archetype_id' 
      });

    if (reportError) {
      console.error(`Error inserting report for ${archetypeId}:`, reportError);
      throw reportError;
    }
    
    console.log(`Successfully inserted deep dive report for ${archetypeId}`);

    // Insert or update SWOT analysis
    console.log(`Inserting SWOT analysis for ${archetypeId}...`);
    const { data: swotData, error: swotError } = await supabase
      .from('archetype_swot_analyses')
      .upsert({
        archetype_id: archetypeId,
        strengths: swotAnalysis.strengths,
        weaknesses: swotAnalysis.weaknesses,
        opportunities: swotAnalysis.opportunities,
        threats: swotAnalysis.threats,
        last_updated: new Date().toISOString()
      }, { 
        onConflict: 'archetype_id' 
      });

    if (swotError) {
      console.error(`Error inserting SWOT analysis for ${archetypeId}:`, swotError);
      throw swotError;
    }
    
    console.log(`Successfully inserted SWOT analysis for ${archetypeId}`);

    // Insert strategic recommendations
    console.log(`Inserting ${strategicRecommendations.length} recommendations for ${archetypeId}...`);
    for (let i = 0; i < strategicRecommendations.length; i++) {
      const rec = strategicRecommendations[i];
      console.log(`Inserting recommendation ${i + 1}: ${rec.title}`);
      
      const { data: recData, error: recommendationError } = await supabase
        .from('archetype_strategic_recommendations')
        .upsert({
          archetype_id: archetypeId,
          recommendation_number: i + 1,
          title: rec.title,
          description: rec.description,
          metrics_references: rec.metrics_references,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'archetype_id, recommendation_number' 
        });

      if (recommendationError) {
        console.error(`Error inserting recommendation ${i+1} for ${archetypeId}:`, recommendationError);
        throw recommendationError;
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
