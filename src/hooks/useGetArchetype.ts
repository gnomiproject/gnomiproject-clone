
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
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
        // Attempt to fetch data from level3_report_data first (newest structure)
        const { data, error: fetchError } = await supabase
          .from('level3_report_data')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          // Map data from level3_report_data to ArchetypeDetailedData structure
          const formattedData: ArchetypeDetailedData = {
            id: data.archetype_id as ArchetypeId,
            name: data.archetype_name || '',
            familyId: data.family_id as any,
            familyName: data.family_name,
            hexColor: data.hex_color,
            short_description: data.short_description,
            long_description: data.long_description,
            key_characteristics: Array.isArray(data.key_characteristics) 
              ? data.key_characteristics 
              : data.key_characteristics?.split('\n').filter(Boolean) || [],
            industries: data.industries,
            family_id: data.family_id,

            // SWOT analysis
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            opportunities: data.opportunities || [],
            threats: data.threats || [],

            // Strategic recommendations
            strategic_recommendations: data.strategic_recommendations || [],

            // Metrics - using the new format but providing backwards compatibility
            Demo_Average_Family_Size: data.Demo_Average_Family_Size,
            Demo_Average_Age: data.Demo_Average_Age,
            Demo_Average_Employees: data.Demo_Average_Employees,
            Demo_Average_States: data.Demo_Average_States,
            Demo_Average_Percent_Female: data.Demo_Average_Percent_Female,
            
            Util_Emergency_Visits_per_1k_Members: data.Util_Emergency_Visits_per_1k_Members,
            Util_Specialist_Visits_per_1k_Members: data.Util_Specialist_Visits_per_1k_Members,
            Util_Inpatient_Admits_per_1k_Members: data.Util_Inpatient_Admits_per_1k_Members,
            Util_Percent_of_Members_who_are_Non_Utilizers: data.Util_Percent_of_Members_who_are_Non_Utilizers,
            
            Risk_Average_Risk_Score: data.Risk_Average_Risk_Score,
            SDOH_Average_SDOH: data.SDOH_Average_SDOH,
            
            Cost_Medical_RX_Paid_Amount_PEPY: data.Cost_Medical_RX_Paid_Amount_PEPY,
            Cost_Medical_RX_Paid_Amount_PMPY: data.Cost_Medical_RX_Paid_Amount_PMPY,
            Cost_Avoidable_ER_Potential_Savings_PMPY: data.Cost_Avoidable_ER_Potential_Savings_PMPY,
            
            Dise_Heart_Disease_Prevalence: data.Dise_Heart_Disease_Prevalence,
            Dise_Type_2_Diabetes_Prevalence: data.Dise_Type_2_Diabetes_Prevalence,
            Dise_Mental_Health_Disorder_Prevalence: data.Dise_Mental_Health_Disorder_Prevalence,
            Dise_Substance_Use_Disorder_Prevalence: data.Dise_Substance_Use_Disorder_Prevalence,
            
            Gaps_Diabetes_RX_Adherence: data.Gaps_Diabetes_RX_Adherence,
            Gaps_Behavioral_Health_FU_ED_Visit_Mental_Illness: data.Gaps_Behavioral_Health_FU_ED_Visit_Mental_Illness,
            Gaps_Cancer_Screening_Breast: data.Gaps_Cancer_Screening_Breast,
            Gaps_Wellness_Visit_Adults: data.Gaps_Wellness_Visit_Adults,
            
            // For compatibility with legacy structures
            standard: {
              fullDescription: data.long_description || '',
              keyCharacteristics: Array.isArray(data.key_characteristics) 
                ? data.key_characteristics 
                : data.key_characteristics?.split('\n').filter(Boolean) || [],
              overview: data.short_description || '',
              keyStatistics: {},
              keyInsights: []
            },
            enhanced: {
              swot: {
                strengths: data.strengths || [],
                weaknesses: data.weaknesses || [],
                opportunities: data.opportunities || [],
                threats: data.threats || [],
              },
              strategicPriorities: data.strategic_recommendations || [],
              costSavings: [],
              riskProfile: data.Risk_Average_Risk_Score ? {
                score: data.Risk_Average_Risk_Score.toFixed(2),
                comparison: 'Based on clinical and utilization patterns',
                conditions: [
                  { name: 'Risk Score', value: data.Risk_Average_Risk_Score.toFixed(2), barWidth: `${data.Risk_Average_Risk_Score * 50}%` }
                ]
              } : undefined
            },
            summary: {
              description: data.short_description || '',
              keyCharacteristics: Array.isArray(data.key_characteristics) 
                ? data.key_characteristics 
                : data.key_characteristics?.split('\n').filter(Boolean) || []
            }
          };

          setArchetypeData(formattedData);
          
          // Set family data
          if (data.family_id) {
            const familyInfo = getFamilyById(data.family_id as any);
            setFamilyData(familyInfo || {
              id: data.family_id,
              name: data.family_name || '',
              description: data.family_short_description || '',
              short_description: data.family_short_description || '',
              long_description: data.family_long_description || '',
              commonTraits: data.common_traits || [],
              industries: data.family_industries || ''
            });
          }

        } else {
          // Fallback to original archetype data structure
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
