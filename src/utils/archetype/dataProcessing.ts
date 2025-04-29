
import { ArchetypeDetailedData, ArchetypeId, FamilyId, Json } from '@/types/archetype';

/**
 * Helper function to safely convert JSONB arrays to string arrays
 */
export const convertJsonToStringArray = (jsonArray: Json | null): string[] => {
  if (!jsonArray) return [];
  
  if (Array.isArray(jsonArray)) {
    return jsonArray.map(item => String(item));
  }
  
  if (typeof jsonArray === 'string') {
    try {
      const parsed = JSON.parse(jsonArray);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
      return jsonArray.split('\n').filter(Boolean);
    } catch {
      return jsonArray.split('\n').filter(Boolean);
    }
  }
  
  return [];
};

/**
 * Process raw database data into standardized ArchetypeDetailedData format
 */
export const processArchetypeData = (
  data: any, 
  getFamilyById: (id: FamilyId) => any,
  getArchetypeEnhanced: (id: ArchetypeId) => any
): { archetypeData: ArchetypeDetailedData | null, familyData: any | null, dataSource: string } => {
  if (!data) {
    console.log("No data to process");
    return { archetypeData: null, familyData: null, dataSource: '' };
  }

  console.log("Processing raw data:", {
    id: data.archetype_id,
    name: data.archetype_name || data.name,
    hasStrengths: !!data.strengths,
    hasRecommendations: Array.isArray(data.strategic_recommendations) && data.strategic_recommendations.length > 0
  });
  
  // Map data from level3_report_data to ArchetypeDetailedData structure
  const formattedData: ArchetypeDetailedData = {
    id: data.archetype_id as ArchetypeId,
    name: data.archetype_name || data.name || '',
    familyId: data.family_id as FamilyId || ('unknown' as FamilyId),
    familyName: data.family_name || '',
    family_name: data.family_name || '', // Add for compatibility with level3_report_data
    hexColor: data.hex_color || '#6E59A5',
    color: data.hex_color || '#6E59A5',
    short_description: data.short_description || '',
    long_description: data.long_description || '',
    key_characteristics: typeof data.key_characteristics === 'string'
      ? data.key_characteristics.split('\n').filter(Boolean)
      : [],
    industries: data.industries || '',
    family_id: data.family_id as FamilyId || ('unknown' as FamilyId),

    // SWOT analysis - safely convert JSONB arrays to string arrays
    strengths: Array.isArray(data.strengths) ? data.strengths : convertJsonToStringArray(data.strengths),
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : convertJsonToStringArray(data.weaknesses),
    opportunities: Array.isArray(data.opportunities) ? data.opportunities : convertJsonToStringArray(data.opportunities),
    threats: Array.isArray(data.threats) ? data.threats : convertJsonToStringArray(data.threats),

    // Strategic recommendations - handle complex structure conversion
    strategic_recommendations: Array.isArray(data.strategic_recommendations) 
      ? data.strategic_recommendations.map((rec: any) => ({
          recommendation_number: rec.recommendation_number || 0,
          title: rec.title || '',
          description: rec.description || '',
          metrics_references: rec.metrics_references || []
        }))
      : [],

    // Use the correct property names from the database with proper type safety
    "Demo_Average Family Size": data["Demo_Average Family Size"] || 0,
    "Demo_Average Age": data["Demo_Average Age"] || 0,
    "Demo_Average Employees": data["Demo_Average Employees"] || 0,
    "Demo_Average States": data["Demo_Average States"] || 0,
    "Demo_Average Percent Female": data["Demo_Average Percent Female"] || 0,
    
    "Util_Emergency Visits per 1k Members": data["Util_Emergency Visits per 1k Members"] || 0,
    "Util_Specialist Visits per 1k Members": data["Util_Specialist Visits per 1k Members"] || 0,
    "Util_Inpatient Admits per 1k Members": data["Util_Inpatient Admits per 1k Members"] || 0,
    "Util_Percent of Members who are Non-Utilizers": data["Util_Percent of Members who are Non-Utilizers"] || 0,
    
    "Risk_Average Risk Score": data["Risk_Average Risk Score"] || 0,
    "SDOH_Average SDOH": data["SDOH_Average SDOH"] || 0,
    
    "Cost_Medical & RX Paid Amount PEPY": data["Cost_Medical & RX Paid Amount PEPY"] || 0,
    "Cost_Medical & RX Paid Amount PMPY": data["Cost_Medical & RX Paid Amount PMPY"] || 0,
    "Cost_Avoidable ER Potential Savings PMPY": data["Cost_Avoidable ER Potential Savings PMPY"] || 0,
    "Cost_Medical Paid Amount PEPY": data["Cost_Medical Paid Amount PEPY"] || 0,
    "Cost_RX Paid Amount PEPY": data["Cost_RX Paid Amount PEPY"] || 0,
    
    "Dise_Heart Disease Prevalence": data["Dise_Heart Disease Prevalence"] || 0,
    "Dise_Type 2 Diabetes Prevalence": data["Dise_Type 2 Diabetes Prevalence"] || 0,
    "Dise_Mental Health Disorder Prevalence": data["Dise_Mental Health Disorder Prevalence"] || 0,
    "Dise_Substance Use Disorder Prevalence": data["Dise_Substance Use Disorder Prevalence"] || 0,
    
    "Gaps_Diabetes RX Adherence": data["Gaps_Diabetes RX Adherence"] || 0,
    "Gaps_Behavioral Health FU ED Visit Mental Illness": data["Gaps_Behavioral Health FU ED Visit Mental Illness"] || 0,
    "Gaps_Cancer Screening Breast": data["Gaps_Cancer Screening Breast"] || 0,
    "Gaps_Wellness Visit Adults": data["Gaps_Wellness Visit Adults"] || 0,
    
    // For compatibility with legacy structures
    standard: {
      fullDescription: data.long_description || '',
      keyCharacteristics: typeof data.key_characteristics === 'string'
        ? data.key_characteristics.split('\n').filter(Boolean)
        : [],
      overview: data.short_description || '',
      keyStatistics: {},
      keyInsights: []
    },
    enhanced: {
      swot: {
        strengths: Array.isArray(data.strengths) ? data.strengths : convertJsonToStringArray(data.strengths),
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : convertJsonToStringArray(data.weaknesses),
        opportunities: Array.isArray(data.opportunities) ? data.opportunities : convertJsonToStringArray(data.opportunities),
        threats: Array.isArray(data.threats) ? data.threats : convertJsonToStringArray(data.threats),
      },
      strategicPriorities: Array.isArray(data.strategic_recommendations) ? data.strategic_recommendations : [],
      costSavings: [],
      riskProfile: data["Risk_Average Risk Score"] ? {
        score: data["Risk_Average Risk Score"].toFixed(2),
        comparison: 'Based on clinical and utilization patterns',
        conditions: [
          { name: 'Risk Score', value: data["Risk_Average Risk Score"].toFixed(2), barWidth: `${data["Risk_Average Risk Score"] * 10}%` }
        ]
      } : undefined
    },
    summary: {
      description: data.short_description || '',
      keyCharacteristics: typeof data.key_characteristics === 'string'
        ? data.key_characteristics.split('\n').filter(Boolean)
        : []
    }
  };

  // Get family data if available
  const familyData = data.family_id ? getFamilyById(data.family_id as FamilyId) : null;
  const processedFamilyData = familyData || {
    id: data.family_id,
    name: data.family_name || '',
    description: data.family_short_description || '',
    short_description: data.family_short_description || '',
    long_description: data.family_long_description || '',
    commonTraits: Array.isArray(data.common_traits) ? data.common_traits.map(String) : [],
    industries: data.family_industries || ''
  };

  return {
    archetypeData: formattedData,
    familyData: processedFamilyData,
    dataSource: 'level3_report_data'
  };
};

/**
 * Process fallback data (local data) when DB data is not available
 */
export const processFallbackData = (
  archetypeId: ArchetypeId,
  getArchetypeEnhanced: (id: ArchetypeId) => any,
  getFamilyById: (id: FamilyId) => any
): { archetypeData: ArchetypeDetailedData | null, familyData: any | null, dataSource: string } => {
  console.log("Using fallback archetype data for", archetypeId);
  const fallbackArchetype = getArchetypeEnhanced(archetypeId);
  
  if (!fallbackArchetype) {
    console.error(`No fallback data available for archetype ${archetypeId}`);
    return { archetypeData: null, familyData: null, dataSource: '' };
  }

  const familyData = fallbackArchetype.familyId ? getFamilyById(fallbackArchetype.familyId) : null;
  
  console.log("Fallback data retrieved successfully for", archetypeId);
  
  return {
    archetypeData: fallbackArchetype,
    familyData,
    dataSource: 'local data'
  };
};
