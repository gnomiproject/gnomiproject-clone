
import { SupabaseClient } from '@supabase/supabase-js';
import { ReportContent, SwotAnalysis, StrategicRecommendation } from './types';

/**
 * Inserts or updates report content into the database
 */
export async function insertReportContent(
  supabase: SupabaseClient, 
  archetypeId: string, 
  reportContent: ReportContent, 
  swotAnalysis: SwotAnalysis, 
  strategicRecommendations: StrategicRecommendation[]
): Promise<void> {
  console.log(`Inserting report content for archetype ${archetypeId}`);
  
  try {
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
          detailed_metrics: reportContent.detailed_metrics,
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
          detailed_metrics: reportContent.detailed_metrics,
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

    // Insert or update SWOT analysis
    await insertSwotAnalysis(supabase, archetypeId, swotAnalysis);
    
    // Insert strategic recommendations
    await insertStrategicRecommendations(supabase, archetypeId, strategicRecommendations);
    
    console.log(`Successfully inserted all data for archetype ${archetypeId}`);
  } catch (error) {
    console.error(`Error in insertReportContent for ${archetypeId}:`, error);
    throw error;
  }
}

/**
 * Inserts or updates SWOT analysis data
 */
async function insertSwotAnalysis(
  supabase: SupabaseClient,
  archetypeId: string,
  swotAnalysis: SwotAnalysis
): Promise<void> {
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
}

/**
 * Inserts strategic recommendations after clearing existing ones
 */
async function insertStrategicRecommendations(
  supabase: SupabaseClient,
  archetypeId: string,
  recommendations: StrategicRecommendation[]
): Promise<void> {
  // Clear existing recommendations first
  await supabase
    .from('Analysis_Archetype_Strategic_Recommendations')
    .delete()
    .eq('archetype_id', archetypeId);
  
  console.log(`Inserting ${recommendations.length} recommendations for ${archetypeId}...`);
  
  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i];
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
}
