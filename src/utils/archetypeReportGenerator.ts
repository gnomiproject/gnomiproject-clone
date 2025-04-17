
import { SupabaseClient } from '@supabase/supabase-js';

// Helper function to organize metrics by category
function organizeMetricsByCategory(metrics: any[]) {
  const organized: { [key: string]: any } = {};
  metrics.forEach(metric => {
    if (!organized[metric.Category]) {
      organized[metric.Category] = [];
    }
    organized[metric.Category].push(metric);
  });
  return organized;
}

// Helper function to generate report content
function generateReportContent(archetype: any, organizedMetrics: any) {
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
  const strengths = [
    `High performance in areas such as ${Object.keys(organizedMetrics)[0]}`,
    `Strong показатели in ${Object.keys(organizedMetrics)[1] || 'another category'}`
  ];
  const weaknesses = [
    `Underperformance in areas such as ${Object.keys(organizedMetrics)[2] || 'a category with low scores'}`,
    `Challenges related to ${Object.keys(organizedMetrics)[3] || 'areas needing improvement'}`
  ];
  const opportunities = [
    `Leverage strengths in ${Object.keys(organizedMetrics)[0]} to expand market presence`,
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
  const recommendations = [
    {
      title: `Optimize Performance in ${Object.keys(organizedMetrics)[0]}`,
      description: `Focus on leveraging strengths in ${Object.keys(organizedMetrics)[0]} to achieve strategic goals.`,
      metrics_references: Object.keys(organizedMetrics)[0]
    },
    {
      title: `Address Weaknesses in ${Object.keys(organizedMetrics)[2] || 'Critical Areas'}`,
      description: `Implement strategies to mitigate weaknesses and improve performance in key areas.`,
      metrics_references: Object.keys(organizedMetrics)[2] || 'N/A'
    }
  ];

  return recommendations;
}

// Full function to generate archetype reports
async function generateArchetypeReports(supabase: SupabaseClient) {
  console.log('Starting report generation process...');
  
  // 1. Fetch all archetypes
  const { data: archetypes, error: archetypesError } = await supabase
    .from('archetypes')
    .select('*');
  
  if (archetypesError) {
    console.error('Error fetching archetypes:', archetypesError);
    throw archetypesError;
  }
  
  console.log(`Found ${archetypes.length} archetypes to process`);
  
  const results = {
    total: archetypes.length,
    processed: 0,
    succeeded: 0,
    failed: 0,
    archetypeIds: [] as string[]
  };
  
  // 2. Process each archetype
  for (const archetype of archetypes) {
    try {
      console.log(`Processing archetype ${archetype.id}: ${archetype.name}`);
      
      // 3. Fetch metrics data for this archetype
      const { data: metrics, error: metricsError } = await supabase
        .from('archetype_data_041624bw')
        .select('*')
        .eq('archetype_ID', archetype.id);
      
      if (metricsError) {
        console.error(`Error fetching metrics for ${archetype.id}:`, metricsError);
        results.failed++;
        continue;
      }
      
      console.log(`Found ${metrics.length} metrics for archetype ${archetype.id}`);
      
      // 4. Organize metrics by category
      const organizedMetrics = organizeMetricsByCategory(metrics);
      
      // 5. Generate report content based on metrics
      const reportContent = generateReportContent(archetype, organizedMetrics);
      
      // 6. Generate SWOT analysis
      const swotAnalysis = generateSwotAnalysis(archetype, organizedMetrics);
      
      // 7. Generate strategic recommendations
      const strategicRecommendations = generateStrategicRecommendations(archetype, organizedMetrics);
      
      // 8. Insert report content
      await insertReportContent(supabase, archetype.id, reportContent, swotAnalysis, strategicRecommendations);
      
      console.log(`Completed processing for ${archetype.id}`);
      results.processed++;
      results.succeeded++;
      results.archetypeIds.push(archetype.id);
      
    } catch (error) {
      console.error(`Error processing archetype ${archetype.id}:`, error);
      results.processed++;
      results.failed++;
    }
  }
  
  console.log('Report generation complete!', results);
  return results;
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
    const { error: reportError } = await supabase
      .from('archetype_deep_dive_reports')
      .upsert({
        archetype_id: archetypeId,
        title: reportContent.title,
        introduction: reportContent.introduction,
        summary_analysis: reportContent.summary_analysis,
        distinctive_metrics_summary: reportContent.distinctive_metrics_summary,
        data_details: JSON.parse(reportContent.data_details),
        last_updated: new Date().toISOString()
      }, { 
        onConflict: 'archetype_id' 
      });

    if (reportError) {
      console.error(`Error inserting report for ${archetypeId}:`, reportError);
      throw reportError;
    }

    // Insert or update SWOT analysis
    const { error: swotError } = await supabase
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

    // Insert strategic recommendations
    for (let i = 0; i < strategicRecommendations.length; i++) {
      const rec = strategicRecommendations[i];
      const { error: recommendationError } = await supabase
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
    }
    
    console.log(`Successfully inserted all data for archetype ${archetypeId}`);
  } catch (error) {
    console.error(`Error in insertReportContent for ${archetypeId}:`, error);
    throw error;
  }
}

export default generateArchetypeReports;
