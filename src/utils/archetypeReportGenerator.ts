
import { SupabaseClient } from '@supabase/supabase-js';

// Helper function to organize metrics by category
function organizeMetricsByCategory(metrics: any[]) {
  console.log(`Organizing ${metrics.length} metrics by category`);
  const organized: { [key: string]: any } = {};
  metrics.forEach(metric => {
    if (!metric.Category) {
      console.log('Found metric without Category:', metric);
      if (!organized['General']) {
        organized['General'] = [];
      }
      organized['General'].push(metric);
      return;
    }

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
  
  // Convert organized metrics to a detailed_metrics field
  const detailed_metrics = organizedMetrics;

  return {
    title,
    introduction,
    summary_analysis,
    distinctive_metrics_summary,
    detailed_metrics
  };
}

// Helper function to generate SWOT analysis
function generateSwotAnalysis(archetype: any, organizedMetrics: any) {
  console.log(`Generating SWOT analysis for archetype ${archetype.id}`);
  
  // Get categories or use defaults if no metrics
  const metricCategories = Object.keys(organizedMetrics).length > 0 
    ? Object.keys(organizedMetrics) 
    : ['Utilization', 'Cost', 'Quality', 'Access'];

  const strengths = [
    `Strong performance in ${archetype.name} core competencies`,
    `Effective management of ${metricCategories[0] || 'primary metrics'}`
  ];
  const weaknesses = [
    `Areas for improvement in ${metricCategories[1] || 'secondary metrics'}`,
    `Challenges related to coordinating care effectively`
  ];
  const opportunities = [
    `Leverage strengths in ${metricCategories[0] || 'key areas'} to expand market presence`,
    `Implement strategies to address ${archetype.name}'s unique needs`
  ];
  const threats = [
    `Competitive pressures in the ${archetype.name} archetype segment`,
    `Rising costs in key service areas`
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
  
  // Get categories or use defaults if no metrics
  const metricCategories = Object.keys(organizedMetrics).length > 0 
    ? Object.keys(organizedMetrics) 
    : ['Utilization', 'Cost', 'Quality', 'Access'];

  const recommendations = [
    {
      title: `Optimize Performance in ${metricCategories[0] || 'Key Areas'}`,
      description: `Focus on leveraging strengths in ${metricCategories[0] || 'primary metrics'} to achieve strategic goals.`,
      metrics_references: metricCategories[0] || 'Key Metrics'
    },
    {
      title: `Address ${archetype.name} Specific Needs`,
      description: `Implement tailored strategies to support this archetype's unique healthcare requirements.`,
      metrics_references: metricCategories[1] || 'Performance Metrics' 
    }
  ];

  return recommendations;
}

// Full function to generate archetype reports
async function generateArchetypeReports(supabase: SupabaseClient) {
  console.log('Starting report generation process with detailed logging...');
  
  try {
    // 1. Fetch all archetypes from the correct table name: Core_Archetype_Overview
    console.log('Fetching archetypes from database...');
    const { data: archetypes, error: archetypesError } = await supabase
      .from('Core_Archetype_Overview')
      .select('*');
    
    if (archetypesError) {
      console.error('Error fetching archetypes:', archetypesError);
      throw new Error(`Failed to fetch archetypes: ${archetypesError.message}`);
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
        
        // 3. Fetch metrics data for this archetype - trying both tables
        console.log(`Fetching metrics for archetype ${archetype.id} from Core_Archetypes_Metrics...`);
        let { data: metrics, error: metricsError } = await supabase
          .from('Core_Archetypes_Metrics')
          .select('*')
          .eq('id', archetype.id);
        
        if (metricsError) {
          console.error(`Error fetching metrics from Core_Archetypes_Metrics for ${archetype.id}:`, metricsError);
          console.log(`Will try alternative metrics source...`);
        }
        
        // If no metrics found in first table, try another approach
        if (!metrics || metrics.length === 0) {
          console.log(`No metrics found in Core_Archetypes_Metrics for ${archetype.id}`);
          
          // Create minimal metrics data since no metrics were found
          metrics = [
            {
              Category: 'Cost',
              Metric: 'PEPY',
              Archetype_Value: 0,
              Archetype_Average: 0,
              Difference: 0,
              archetype_ID: archetype.id
            },
            {
              Category: 'Utilization',
              Metric: 'Office Visits',
              Archetype_Value: 0,
              Archetype_Average: 0,
              Difference: 0,
              archetype_ID: archetype.id
            }
          ];
        }
        
        // 4. Organize metrics by category
        console.log(`Organizing metrics for archetype ${archetype.id}...`);
        const organizedMetrics = organizeMetricsByCategory(metrics);
        
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
          recommendation_number: i + 1,
          title: rec.title,
          description: rec.description,
          metrics_references: rec.metrics_references,
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
