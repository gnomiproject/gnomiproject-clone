
import { supabase } from '@/integrations/supabase/client';
import { ReportType } from '@/types/reports';
import type { ReportDataSource } from '@/utils/reports/dataSourceUtils';
import { ArchetypeDetailedData } from '@/types/archetype';
import { getDataSource } from '@/utils/reports/schemaMapping';

interface TokenAccessResponse {
  data: {
    id: string;
    archetype_id: string;
    name: string;
    organization: string;
    email: string;
    created_at: string;
  } | null;
  error: any;
}

// Function to map raw database fields to our application model
const mapToArchetypeDetailedData = (data: any): ArchetypeDetailedData | null => {
  if (!data) return null;
  
  return {
    id: data.archetype_id,
    name: data.archetype_name || '',
    familyId: data.family_id || 'unknown',
    familyName: data.family_name,
    family_name: data.family_name,
    hexColor: data.hex_color,
    short_description: data.short_description,
    long_description: data.long_description,
    key_characteristics: typeof data.key_characteristics === 'string'
      ? data.key_characteristics.split('\n').filter(Boolean)
      : [],
    industries: data.industries,
    family_id: data.family_id,
    
    // Map SWOT analysis fields
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
    threats: Array.isArray(data.threats) ? data.threats : [],
    
    // Map strategic recommendations
    strategic_recommendations: Array.isArray(data.strategic_recommendations) 
      ? data.strategic_recommendations
      : [],
      
    // Map metrics with their original names
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
    
    // Add standard structure for backward compatibility
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
        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
        opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
        threats: Array.isArray(data.threats) ? data.threats : [],
      },
      strategicPriorities: Array.isArray(data.strategic_recommendations) ? data.strategic_recommendations : [],
      costSavings: [],
      riskProfile: data["Risk_Average Risk Score"] ? {
        score: String(data["Risk_Average Risk Score"]).substring(0, 4),
        comparison: 'Based on clinical and utilization patterns',
        conditions: [
          { 
            name: 'Risk Score', 
            value: String(data["Risk_Average Risk Score"]).substring(0, 4), 
            barWidth: `${Math.min(data["Risk_Average Risk Score"] * 10, 100)}%` 
          }
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
};

export const fetchReportData = async (
  archetypeId: string,
  reportType: ReportType
): Promise<ArchetypeDetailedData | null> => {
  // Get the appropriate data source table based on report type
  const dataSourceTable = getDataSource(reportType);
  
  // Type assertion to satisfy TypeScript's constraint for Supabase table names
  const { data, error } = await supabase
    .from(dataSourceTable as any)
    .select('*')
    .eq('archetype_id', archetypeId)
    .maybeSingle();

  if (error) throw error;
  
  return data ? mapToArchetypeDetailedData(data) : null;
};

export const fetchTokenAccess = async (archetypeId: string, token: string): Promise<TokenAccessResponse> => {
  return await supabase
    .from('report_requests')
    .select('id, archetype_id, name, organization, email, created_at')
    .eq('archetype_id', archetypeId)
    .eq('access_token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
};
