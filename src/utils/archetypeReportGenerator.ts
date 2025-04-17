
// Helper function to organize metrics by category
function organizeMetricsByCategory(metrics: any[]) {
  const result: Record<string, Record<string, any>> = {
    workforce_demographics: {},
    healthcare_cost_profile: {},
    utilization_patterns: {},
    disease_prevalence_profile: {},
    benefits_access_metrics: {},
    key_metrics: {} // Important overall metrics
  };
  
  // Map metric categories to our structure
  const categoryMap: Record<string, string> = {
    'Workforce': 'workforce_demographics',
    'Cost': 'healthcare_cost_profile',
    'Utilization': 'utilization_patterns',
    'Disease': 'disease_prevalence_profile',
    'Benefits': 'benefits_access_metrics'
  };
  
  // Define key metrics we want to specifically track
  const keyMetrics = [
    'Paid PEPY', 'Risk Score', 'Emergency Visits per 1K', 
    'Specialist Visits per 1K', 'Inpatient Admits per 1K',
    'Average Family Size', 'SDOH Score', 'High-Cost Claimant Rate',
    'Non-Utilizer Rate', 'RX Paid Amount PEPY'
  ];
  
  // Process metrics and organize them
  for (const metric of metrics) {
    const category = categoryMap[metric.Category] || 'other';
    
    if (!result[category]) {
      result[category] = {};
    }
    
    // Store the metric in its category
    result[category][metric.Metric] = {
      value: metric['Archetype Value'],
      average: metric['Archetype Average'],
      variance: metric.Difference
    };
    
    // If this is a key metric, also store it in the key_metrics section
    if (keyMetrics.includes(metric.Metric)) {
      result.key_metrics[metric.Metric] = {
        value: metric['Archetype Value'],
        average: metric['Archetype Average'],
        variance: metric.Difference
      };
    }
  }
  
  return result;
}

// Helper function to generate report content
function generateReportContent(archetype: any, metrics: any) {
  return {
    title: `${archetype.name}: Deep Dive Report`,
    introduction: generateIntroduction(archetype, metrics),
    summary_analysis: generateSummaryAnalysis(archetype, metrics),
    distinctive_metrics_summary: generateDistinctiveMetricsSummary(archetype, metrics),
    data_details: metrics
  };
}

// Helper functions for specific report sections
function generateIntroduction(archetype: any, metrics: any) {
  const introduction = `The ${archetype.name} archetype represents a distinctive healthcare management approach with several defining characteristics. This deep dive report provides a comprehensive analysis of this archetype's unique patterns, from utilization behaviors to cost drivers and strategic opportunities. By understanding these distinctive traits, organizations can develop targeted strategies to optimize healthcare outcomes and financial performance.`;
  
  return introduction;
}

function generateSummaryAnalysis(archetype: any, metrics: any) {
  // Extract key metrics for our summary
  const keyMetrics = metrics.key_metrics;
  
  // Format metrics for readability
  const riskScore = keyMetrics['Risk Score']?.value?.toFixed(4) || 'unknown';
  const riskVariance = keyMetrics['Risk Score']?.variance || 0;
  
  const paidPEPY = keyMetrics['Paid PEPY']?.value || 'unknown';
  const paidPEPYVariance = keyMetrics['Paid PEPY']?.variance || 0;
  
  const specialistVisits = keyMetrics['Specialist Visits per 1K']?.value || 'unknown';
  const specialistVariance = keyMetrics['Specialist Visits per 1K']?.variance || 0;
  
  const emergencyVisits = keyMetrics['Emergency Visits per 1K']?.value || 'unknown';
  const emergencyVariance = keyMetrics['Emergency Visits per 1K']?.variance || 0;
  
  const familySize = keyMetrics['Average Family Size']?.value?.toFixed(2) || 'unknown';
  const familySizeVariance = keyMetrics['Average Family Size']?.variance || 0;
  
  const sdohScore = keyMetrics['SDOH Score']?.value?.toFixed(2) || 'unknown';
  const sdohVariance = keyMetrics['SDOH Score']?.variance || 0;
  
  // Generate a comprehensive summary based on the key metrics
  return `${archetype.name} (${archetype.id}) represents a healthcare archetype that demonstrates ${getUtilizationPattern(specialistVariance, emergencyVariance)}. This population has ${getRiskDescription(riskVariance)} (${riskScore} risk score, ${Math.abs(riskVariance)}% ${riskVariance >= 0 ? 'above' : 'below'} archetype average) with ${getCostDescription(paidPEPYVariance)} (${Math.abs(paidPEPYVariance)}% ${paidPEPYVariance >= 0 ? 'above' : 'below'} archetype average PEPY). Their workforce is characterized by ${archetype.characteristics || 'distinctive industry patterns'} with ${getSdohDescription(sdohVariance)} (${sdohScore}, ${Math.abs(sdohVariance)}% ${sdohVariance >= 0 ? 'above' : 'below'} archetype average). Their ${getFamilySizeDescription(familySizeVariance)} (${familySize}, ${Math.abs(familySizeVariance)}% ${familySizeVariance >= 0 ? 'above' : 'below'} archetype average) ${familySizeVariance > 0 ? 'contributes to' : 'helps explain'} their cost metrics. ${getPrimaryRiskDriverDescription(archetype.primary_risk_driver)}`;
}

// Helper functions for generating specific descriptive text
function getUtilizationPattern(specialistVariance: number, emergencyVariance: number) {
  if (specialistVariance > 5 && emergencyVariance < -5) {
    return "sophisticated navigation to specialist care while avoiding emergency utilization";
  } else if (specialistVariance < -5 && emergencyVariance > 5) {
    return "higher emergency utilization with lower specialist engagement";
  } else if (specialistVariance > 5 && emergencyVariance > 5) {
    return "high utilization across both specialist and emergency settings";
  } else if (specialistVariance < -5 && emergencyVariance < -5) {
    return "lower overall utilization in both specialist and emergency settings";
  } else {
    return "balanced utilization patterns across care settings";
  }
}

function getRiskDescription(riskVariance: number) {
  if (riskVariance > 5) {
    return "above-average clinical risk";
  } else if (riskVariance < -5) {
    return "below-average clinical risk";
  } else {
    return "average clinical risk";
  }
}

function getCostDescription(costVariance: number) {
  if (costVariance > 10) {
    return "significantly higher costs";
  } else if (costVariance > 0) {
    return "moderately higher costs";
  } else if (costVariance < -10) {
    return "significantly lower costs";
  } else if (costVariance < 0) {
    return "moderately lower costs";
  } else {
    return "average costs";
  }
}

function getSdohDescription(sdohVariance: number) {
  if (sdohVariance < -10) {
    return "significantly lower socioeconomic barriers";
  } else if (sdohVariance < 0) {
    return "moderately lower socioeconomic barriers";
  } else if (sdohVariance > 10) {
    return "significantly higher socioeconomic barriers";
  } else if (sdohVariance > 0) {
    return "moderately higher socioeconomic barriers";
  } else {
    return "average socioeconomic barriers";
  }
}

function getFamilySizeDescription(familySizeVariance: number) {
  if (familySizeVariance > 0) {
    return "larger family size";
  } else if (familySizeVariance < 0) {
    return "smaller family size";
  } else {
    return "average family size";
  }
}

function getPrimaryRiskDriverDescription(primaryRiskDriver: string) {
  if (!primaryRiskDriver) return "";
  return `Their primary risk driver is ${primaryRiskDriver}.`;
}

function generateDistinctiveMetricsSummary(archetype: any, metrics: any) {
  // Identify distinctive metrics (those with variance > 10% or < -10%)
  const distinctiveMetrics: Array<{
    name: string;
    category: string;
    value: number;
    average: number;
    variance: number;
  }> = [];
  
  // Check each category for distinctive metrics
  Object.keys(metrics).forEach(category => {
    if (category === 'key_metrics') return; // Skip the summary section
    
    Object.keys(metrics[category]).forEach(metricName => {
      const metric = metrics[category][metricName];
      if (Math.abs(metric.variance) >= 10) {
        distinctiveMetrics.push({
          name: metricName,
          category: category,
          value: metric.value,
          average: metric.average,
          variance: metric.variance
        });
      }
    });
  });
  
  // Sort by absolute variance (most distinctive first)
  distinctiveMetrics.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
  
  // Generate summary text for the top distinctive metrics
  let summary = `This archetype exhibits several notable data patterns. `;
  
  // Add utilization patterns if distinctive
  const utilizationMetrics = distinctiveMetrics.filter(m => m.category === 'utilization_patterns');
  if (utilizationMetrics.length > 0) {
    summary += `Their utilization data shows ${describeUtilizationPatterns(utilizationMetrics)}. `;
  }
  
  // Add demographic patterns if distinctive
  const demographicMetrics = distinctiveMetrics.filter(m => m.category === 'workforce_demographics');
  if (demographicMetrics.length > 0) {
    summary += `Their demographic data includes ${describeDemographicPatterns(demographicMetrics)}. `;
  }
  
  // Add disease prevalence patterns if distinctive
  const diseaseMetrics = distinctiveMetrics.filter(m => m.category === 'disease_prevalence_profile');
  if (diseaseMetrics.length > 0) {
    summary += `Their disease prevalence profile shows ${describeDiseasePatterns(diseaseMetrics)}. `;
  }
  
  // Add cost patterns if distinctive
  const costMetrics = distinctiveMetrics.filter(m => m.category === 'healthcare_cost_profile');
  if (costMetrics.length > 0) {
    summary += `Their cost profile reveals ${describeCostPatterns(costMetrics)}. `;
  }
  
  return summary;
}

// Helper functions to describe patterns in different categories
function describeUtilizationPatterns(metrics: any[]) {
  let description = '';
  
  // Find key utilization metrics
  const specialistMetric = metrics.find(m => m.name.includes('Specialist'));
  const emergencyMetric = metrics.find(m => m.name.includes('Emergency'));
  const inpatientMetric = metrics.find(m => m.name.includes('Inpatient'));
  
  if (specialistMetric) {
    description += `${specialistMetric.variance > 0 ? 'higher' : 'lower'} specialist utilization (${Math.abs(specialistMetric.variance)}% ${specialistMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  if (emergencyMetric) {
    if (description) description += ' paired with ';
    description += `${emergencyMetric.variance > 0 ? 'higher' : 'lower'} emergency utilization (${Math.abs(emergencyMetric.variance)}% ${emergencyMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  if (inpatientMetric) {
    if (description) description += ' and ';
    description += `${inpatientMetric.variance > 0 ? 'higher' : 'lower'} inpatient admissions (${Math.abs(inpatientMetric.variance)}% ${inpatientMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  return description || 'typical utilization patterns';
}

function describeDemographicPatterns(metrics: any[]) {
  let description = '';
  
  // Find key demographic metrics
  const sdohMetric = metrics.find(m => m.name.includes('SDOH'));
  const familySizeMetric = metrics.find(m => m.name.includes('Family Size'));
  
  if (sdohMetric) {
    description += `${sdohMetric.variance < 0 ? 'lower' : 'higher'} SDOH scores (${Math.abs(sdohMetric.variance)}% ${sdohMetric.variance < 0 ? 'below' : 'above'} archetype average)`;
  }
  
  if (familySizeMetric) {
    if (description) description += ' and ';
    description += `${familySizeMetric.variance > 0 ? 'larger' : 'smaller'} family size (${Math.abs(familySizeMetric.variance)}% ${familySizeMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  return description || 'typical demographic patterns';
}

function describeDiseasePatterns(metrics: any[]) {
  // Take top 3 most distinctive disease patterns
  const topDiseases = metrics.slice(0, 3);
  
  if (topDiseases.length === 0) return 'typical disease patterns';
  
  return topDiseases.map(m => 
    `${m.variance > 0 ? 'higher' : 'lower'} rates of ${m.name} (${Math.abs(m.variance)}% ${m.variance > 0 ? 'above' : 'below'} archetype average)`
  ).join(', ');
}

function describeCostPatterns(metrics: any[]) {
  let description = '';
  
  // Find key cost metrics
  const pepyMetric = metrics.find(m => m.name === 'Paid PEPY');
  const pmpmMetric = metrics.find(m => m.name === 'Paid PMPM');
  const rxMetric = metrics.find(m => m.name.includes('RX'));
  
  if (pepyMetric) {
    description += `${pepyMetric.variance > 0 ? 'higher' : 'lower'} per-employee costs (${Math.abs(pepyMetric.variance)}% ${pepyMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  if (pmpmMetric) {
    if (description) description += ' with ';
    description += `${pmpmMetric.variance > 0 ? 'higher' : 'lower'} per-member costs (${Math.abs(pmpmMetric.variance)}% ${pmpmMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  if (rxMetric) {
    if (description) description += ' and ';
    description += `${rxMetric.variance > 0 ? 'higher' : 'lower'} pharmacy costs (${Math.abs(rxMetric.variance)}% ${rxMetric.variance > 0 ? 'above' : 'below'} archetype average)`;
  }
  
  return description || 'typical cost patterns';
}

// SWOT analysis generation
function generateSwotAnalysis(archetype: any, metrics: any) {
  return {
    strengths: identifyStrengths(archetype, metrics),
    weaknesses: identifyWeaknesses(archetype, metrics),
    opportunities: identifyOpportunities(archetype, metrics),
    threats: identifyThreats(archetype, metrics)
  };
}

function identifyStrengths(archetype: any, metrics: any) {
  const strengths = [];
  const km = metrics.key_metrics;
  
  // Check for care navigation strength
  if ((km['Emergency Visits per 1K']?.variance < -10 && km['Inpatient Admits per 1K']?.variance < 0) ||
      (km['Specialist Visits per 1K']?.variance > 0 && km['Emergency Visits per 1K']?.variance < -10)) {
    strengths.push(
      `Strategic Care Navigation: These employers excel at directing members to appropriate care settings, evidenced by ${Math.abs(km['Emergency Visits per 1K']?.variance || 0)}% lower emergency visits and ${Math.abs(km['Inpatient Admits per 1K']?.variance || 0)}% ${km['Inpatient Admits per 1K']?.variance < 0 ? 'lower' : 'higher'} inpatient admits.`
    );
  }
  
  // Check for preventive care strength
  if (metrics.utilization_patterns['Preventive Visits per 1K']?.variance > 5) {
    strengths.push(
      `Preventive Care Culture: ${metrics.utilization_patterns['Preventive Visits per 1K']?.variance}% higher preventive visits demonstrate a stronger orientation toward proactive health management.`
    );
  }
  
  // Check for socioeconomic advantage
  if (km['SDOH Score']?.variance < -10) {
    strengths.push(
      `Socioeconomic Advantage: Significantly lower SDOH barriers (${Math.abs(km['SDOH Score']?.variance || 0)}% below average) create a strong foundation for healthcare engagement.`
    );
  }
  
  return strengths;
}

function identifyWeaknesses(archetype: any, metrics: any) {
  const weaknesses = [];
  const km = metrics.key_metrics;
  
  // Check for non-engaged population
  if (km['Non-Utilizer Rate']?.variance > 5) {
    weaknesses.push(
      `Non-Engaged Population Segment: The ${km['Non-Utilizer Rate']?.variance}% higher non-utilizer rate reveals a segment of the population not engaging with healthcare.`
    );
  }
  
  // Check for pharmacy cost pressure
  if (metrics.healthcare_cost_profile['RX Paid Amount PEPY']?.variance > 5) {
    weaknesses.push(
      `Pharmacy Cost Pressure: ${metrics.healthcare_cost_profile['RX Paid Amount PEPY']?.variance}% higher pharmacy costs without correspondingly higher chronic condition prevalence suggests potential optimization opportunities.`
    );
  }
  
  // Check for cost efficiency gap
  if (km['Paid PEPY']?.variance > 0 && km['Risk Score']?.variance < 0) {
    weaknesses.push(
      `Cost Efficiency Gap: ${km['Paid PEPY']?.variance}% higher PEPY costs despite ${Math.abs(km['Risk Score']?.variance || 0)}% lower risk scores indicates opportunities to improve the return on healthcare investment.`
    );
  }
  
  return weaknesses;
}

function identifyOpportunities(archetype: any, metrics: any) {
  const opportunities = [];
  const km = metrics.key_metrics;
  
  // Check for digital health opportunity
  if (metrics.workforce_demographics['Digital Access']?.variance < 0) {
    opportunities.push(
      `Digital Health Transformation: The ${Math.abs(metrics.workforce_demographics['Digital Access']?.variance || 0)}% better digital access metrics create exceptional potential for digital health solutions.`
    );
  }
  
  // Check for non-utilizer activation opportunity
  if (km['Non-Utilizer Rate']?.variance > 5) {
    opportunities.push(
      `Non-Utilizer Activation: The ${km['Non-Utilizer Rate']?.variance}% higher non-utilizer population represents a significant opportunity to improve preventive care engagement.`
    );
  }
  
  // Check for specialist optimization opportunity
  if (km['Specialist Visits per 1K']?.variance > 5) {
    opportunities.push(
      `Specialist Care Optimization: Refining the ${km['Specialist Visits per 1K']?.variance}% higher specialist utilization through network design and referral management could yield substantial savings.`
    );
  }
  
  return opportunities;
}

function identifyThreats(archetype: any, metrics: any) {
  const threats = [];
  const km = metrics.key_metrics;
  
  // Check for rising healthcare costs threat
  if (km['Paid PEPY']?.variance > 0 && km['Specialist Visits per 1K']?.variance > 5) {
    threats.push(
      `Rising Healthcare Costs: The combination of ${km['Paid PEPY']?.variance}% higher costs and ${km['Specialist Visits per 1K']?.variance}% higher specialist utilization could drive further cost escalation without intervention.`
    );
  }
  
  // Check for pharmacy trend acceleration
  if (metrics.healthcare_cost_profile['RX Paid Amount PEPY']?.variance > 5) {
    threats.push(
      `Pharmacy Trend Acceleration: The already ${metrics.healthcare_cost_profile['RX Paid Amount PEPY']?.variance}% higher pharmacy costs may face additional pressure from specialty drug pipeline and inflation.`
    );
  }
  
  // Check for preventive care gaps
  if (km['Non-Utilizer Rate']?.variance > 5 && metrics.utilization_patterns['Preventive Visits per 1K']?.variance > 0) {
    threats.push(
      `Preventive Care Gaps: Despite strong preventive metrics overall, the ${km['Non-Utilizer Rate']?.variance}% higher non-utilizer rate could lead to missed early intervention opportunities.`
    );
  }
  
  return threats;
}

// Strategic recommendations generation based on SWOT analysis
function generateStrategicRecommendations(archetype: any, metrics: any) {
  const recommendations = [];
  const km = metrics.key_metrics;
  
  // Specialist Network Optimization recommendation
  if (km['Specialist Visits per 1K']?.variance > 5) {
    recommendations.push({
      title: "Specialist Network Optimization Program",
      description: `Implement a comprehensive approach to optimize the ${km['Specialist Visits per 1K']?.variance}% higher specialist utilization through network tiering based on quality and efficiency metrics, centers of excellence for high-volume specialty areas, and enhanced referral management protocols.`,
      metrics_references: ["Specialist Visits per 1K", "Emergency Visits per 1K", "Inpatient Admits per 1K"]
    });
  }
  
  // Non-Utilizer Engagement recommendation
  if (km['Non-Utilizer Rate']?.variance > 5) {
    recommendations.push({
      title: "Non-Utilizer Engagement Strategy",
      description: `Develop a multi-faceted approach to the ${km['Non-Utilizer Rate']?.variance}% higher non-utilizer rate through targeted outreach campaigns, simplified preventive care scheduling, incentives for annual wellness visits, and digital engagement touchpoints.`,
      metrics_references: ["Non-Utilizer Rate", "Preventive Visits per 1K"]
    });
  }
  
  // Digital Health Ecosystem recommendation
  if (metrics.workforce_demographics['Digital Access']?.variance < 0) {
    recommendations.push({
      title: "Digital Health Ecosystem",
      description: `Create a comprehensive digital solution leveraging the ${Math.abs(metrics.workforce_demographics['Digital Access']?.variance || 0)}% better digital access metrics through integrated telehealth platform, AI-powered navigation tools, mobile health applications, and digital-first care pathways.`,
      metrics_references: ["Digital Access", "SDOH Score"]
    });
  }
  
  // Pharmacy Management recommendation
  if (metrics.healthcare_cost_profile['RX Paid Amount PEPY']?.variance > 5) {
    recommendations.push({
      title: "Pharmacy Management Initiative",
      description: `Address the ${metrics.healthcare_cost_profile['RX Paid Amount PEPY']?.variance}% higher pharmacy costs through enhanced formulary design, specialty pharmacy optimization, medication adherence programs, and value-based pharmacy contracts.`,
      metrics_references: ["RX Paid Amount PEPY", "Risk Score"]
    });
  }
  
  // Family Health Optimization recommendation
  if (km['Average Family Size']?.variance > 5) {
    recommendations.push({
      title: "Family Health Optimization",
      description: `Design a comprehensive approach leveraging the ${km['Average Family Size']?.variance}% larger family size through family-centered preventive care scheduling, dependent engagement strategies, family health challenges and incentives, and pediatric care coordination.`,
      metrics_references: ["Average Family Size", "Paid PEPY", "Paid PMPY"]
    });
  }
  
  return recommendations;
}

// Helper function to insert report content into Supabase
async function insertReportContent(supabase: any, archetypeId: string, reportContent: any, swotAnalysis: any, strategicRecommendations: any[]) {
  try {
    // Insert deep dive report
    const { data: reportData, error: reportError } = await supabase
      .from('archetype_deep_dive_reports')
      .upsert({
        archetype_id: archetypeId,
        title: reportContent.title,
        introduction: reportContent.introduction,
        summary_analysis: reportContent.summary_analysis,
        distinctive_metrics_summary: reportContent.distinctive_metrics_summary,
        data_details: reportContent.data_details,
        last_updated: new Date().toISOString()
      }, { onConflict: 'archetype_id' })
      .select();
      
    if (reportError) {
      console.error(`Error inserting report for ${archetypeId}:`, reportError);
      return false;
    }
    
    // Insert SWOT analysis
    const { error: swotError } = await supabase
      .from('archetype_swot_analyses')
      .upsert({
        archetype_id: archetypeId,
        strengths: swotAnalysis.strengths,
        weaknesses: swotAnalysis.weaknesses,
        opportunities: swotAnalysis.opportunities,
        threats: swotAnalysis.threats,
        last_updated: new Date().toISOString()
      }, { onConflict: 'archetype_id' });
      
    if (swotError) {
      console.error(`Error inserting SWOT analysis for ${archetypeId}:`, swotError);
    }
    
    // Insert strategic recommendations
    // First, delete existing recommendations to avoid duplication
    await supabase
      .from('archetype_strategic_recommendations')
      .delete()
      .eq('archetype_id', archetypeId);
      
    // Then insert new recommendations if we have any
    if (strategicRecommendations.length > 0) {
      // Add recommendation numbers and archetype IDs
      const recommendationsToInsert = strategicRecommendations.map((rec, index) => ({
        archetype_id: archetypeId,
        recommendation_number: index + 1,
        title: rec.title,
        description: rec.description,
        metrics_references: rec.metrics_references
      }));
      
      const { error: recError } = await supabase
        .from('archetype_strategic_recommendations')
        .insert(recommendationsToInsert);
        
      if (recError) {
        console.error(`Error inserting recommendations for ${archetypeId}:`, recError);
      }
    }
    
    return true;
  } catch (err) {
    console.error(`Unexpected error processing ${archetypeId}:`, err);
    return false;
  }
}

// Full function to generate archetype reports
export async function generateArchetypeReports(supabase: any) {
  try {
    // 1. Fetch all archetypes
    const { data: archetypes, error: archetypesError } = await supabase
      .from('archetypes')
      .select('*');
    
    if (archetypesError) {
      console.error('Error fetching archetypes:', archetypesError);
      throw new Error('Failed to fetch archetypes');
    }
    
    const results = {
      total: archetypes.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      archetypeIds: [] as string[]
    };
    
    // 2. Process each archetype
    for (const archetype of archetypes) {
      console.log(`Processing archetype ${archetype.id}: ${archetype.name}`);
      
      try {
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
        
        // 4. Organize metrics by category
        const organizedMetrics = organizeMetricsByCategory(metrics);
        
        // 5. Generate report content based on metrics
        const reportContent = generateReportContent(archetype, organizedMetrics);
        
        // 6. Generate SWOT analysis
        const swotAnalysis = generateSwotAnalysis(archetype, organizedMetrics);
        
        // 7. Generate strategic recommendations
        const strategicRecommendations = generateStrategicRecommendations(archetype, organizedMetrics);
        
        // 8. Insert report content
        const success = await insertReportContent(supabase, archetype.id, reportContent, swotAnalysis, strategicRecommendations);
        
        if (success) {
          results.succeeded++;
          results.archetypeIds.push(archetype.id);
        } else {
          results.failed++;
        }
        
        results.processed++;
        
        console.log(`Completed processing for ${archetype.id}`);
      } catch (err) {
        console.error(`Error processing archetype ${archetype.id}:`, err);
        results.failed++;
        results.processed++;
      }
    }
    
    console.log('Report generation complete!', results);
    return results;
  } catch (err) {
    console.error('Error in generateArchetypeReports:', err);
    throw err;
  }
}

export default generateArchetypeReports;
