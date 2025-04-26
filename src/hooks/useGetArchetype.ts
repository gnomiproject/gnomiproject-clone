
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeDetailedData, ArchetypeId, FamilyId, Json } from '@/types/archetype';
import { useArchetypes } from './useArchetypes';

interface UseGetArchetype {
  archetypeData: ArchetypeDetailedData | null;
  familyData: any | null;
  isLoading: boolean;
  error: Error | null;
}

export const useGetArchetype = (archetypeId: ArchetypeId): UseGetArchetype => {
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [familyData, setFamilyData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();

  useEffect(() => {
    const fetchArchetypeData = async () => {
      if (!archetypeId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("useGetArchetype - Fetching data for archetypeId:", archetypeId);
        
        // Attempt to fetch data from level3_report_data table
        const { data, error: fetchError } = await supabase
          .from('level3_report_data')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        console.log("useGetArchetype - Data fetched from level3_report_data:", data);

        if (data) {
          // Helper function to safely convert JSONB arrays to string arrays
          const convertJsonToStringArray = (jsonArray: Json | null): string[] => {
            if (!jsonArray) return [];
            
            if (Array.isArray(jsonArray)) {
              return jsonArray.map(item => String(item));
            }
            
            if (typeof jsonArray === 'string') {
              return jsonArray.split('\n').filter(Boolean);
            }
            
            return [];
          };

          // Map data from level3_report_data to ArchetypeDetailedData structure
          const formattedData: ArchetypeDetailedData = {
            id: data.archetype_id as ArchetypeId,
            name: data.archetype_name || '',
            familyId: data.family_id as FamilyId || ('unknown' as FamilyId),
            familyName: data.family_name,
            family_name: data.family_name, // Add for compatibility
            hexColor: data.hex_color,
            short_description: data.short_description,
            long_description: data.long_description,
            key_characteristics: typeof data.key_characteristics === 'string'
              ? data.key_characteristics.split('\n').filter(Boolean)
              : [],
            industries: data.industries,
            family_id: data.family_id as FamilyId,

            // SWOT analysis - safely convert JSONB arrays to string arrays
            strengths: convertJsonToStringArray(data.strengths),
            weaknesses: convertJsonToStringArray(data.weaknesses),
            opportunities: convertJsonToStringArray(data.opportunities),
            threats: convertJsonToStringArray(data.threats),

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
                strengths: convertJsonToStringArray(data.strengths),
                weaknesses: convertJsonToStringArray(data.weaknesses),
                opportunities: convertJsonToStringArray(data.opportunities),
                threats: convertJsonToStringArray(data.threats),
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

          console.log("useGetArchetype - Formatted data:", formattedData);
          setArchetypeData(formattedData);
          
          // Set family data
          if (data.family_id) {
            const familyInfo = getFamilyById(data.family_id as FamilyId);
            setFamilyData(familyInfo || {
              id: data.family_id,
              name: data.family_name || '',
              description: data.family_short_description || '',
              short_description: data.family_short_description || '',
              long_description: data.family_long_description || '',
              commonTraits: Array.isArray(data.common_traits) ? data.common_traits.map(String) : [],
              industries: data.family_industries || ''
            });
          }

        } else {
          // Fallback to original archetype data structure
          console.log("useGetArchetype - No data found in level3_report_data, falling back to local data");
          const fallbackArchetype = getArchetypeEnhanced(archetypeId);
          
          if (fallbackArchetype) {
            setArchetypeData(fallbackArchetype);
            
            if (fallbackArchetype.familyId) {
              const familyInfo = getFamilyById(fallbackArchetype.familyId);
              setFamilyData(familyInfo);
            }
          } else {
            throw new Error("Archetype not found");
          }
        }

      } catch (err) {
        console.error("Error fetching archetype data:", err);
        setError(err as Error);
        
        // Fallback to original archetype data structure
        const fallbackArchetype = getArchetypeEnhanced(archetypeId);
        
        if (fallbackArchetype) {
          setArchetypeData(fallbackArchetype);
          
          if (fallbackArchetype.familyId) {
            const familyInfo = getFamilyById(fallbackArchetype.familyId);
            setFamilyData(familyInfo);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchetypeData();
  }, [archetypeId, getArchetypeEnhanced, getFamilyById]);

  return { archetypeData, familyData, isLoading, error };
};
