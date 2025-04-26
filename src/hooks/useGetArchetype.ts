
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
            familyId: data.family_id as FamilyId,
            familyName: data.family_name,
            family_name: data.family_name, // Add for compatibility
            hexColor: data.hex_color,
            short_description: data.short_description,
            long_description: data.long_description,
            key_characteristics: Array.isArray(data.key_characteristics) 
              ? data.key_characteristics 
              : data.key_characteristics?.split('\n').filter(Boolean) || [],
            industries: data.industries,
            family_id: data.family_id,

            // SWOT analysis
            strengths: data.strengths ? Array.isArray(data.strengths) ? data.strengths : [] : [],
            weaknesses: data.weaknesses ? Array.isArray(data.weaknesses) ? data.weaknesses : [] : [],
            opportunities: data.opportunities ? Array.isArray(data.opportunities) ? data.opportunities : [] : [],
            threats: data.threats ? Array.isArray(data.threats) ? data.threats : [] : [],

            // Strategic recommendations
            strategic_recommendations: data.strategic_recommendations ? 
              Array.isArray(data.strategic_recommendations) ? data.strategic_recommendations : [] : [],

            // Use the correct property names from the database
            "Demo_Average Family Size": data["Demo_Average Family Size"],
            "Demo_Average Age": data["Demo_Average Age"],
            "Demo_Average Employees": data["Demo_Average Employees"],
            "Demo_Average States": data["Demo_Average States"],
            "Demo_Average Percent Female": data["Demo_Average Percent Female"],
            
            "Util_Emergency Visits per 1k Members": data["Util_Emergency Visits per 1k Members"],
            "Util_Specialist Visits per 1k Members": data["Util_Specialist Visits per 1k Members"],
            "Util_Inpatient Admits per 1k Members": data["Util_Inpatient Admits per 1k Members"],
            "Util_Percent of Members who are Non-Utilizers": data["Util_Percent of Members who are Non-Utilizers"],
            
            "Risk_Average Risk Score": data["Risk_Average Risk Score"],
            "SDOH_Average SDOH": data["SDOH_Average SDOH"],
            
            "Cost_Medical & RX Paid Amount PEPY": data["Cost_Medical & RX Paid Amount PEPY"],
            "Cost_Medical & RX Paid Amount PMPY": data["Cost_Medical & RX Paid Amount PMPY"],
            "Cost_Avoidable ER Potential Savings PMPY": data["Cost_Avoidable ER Potential Savings PMPY"],
            "Cost_Medical Paid Amount PEPY": data["Cost_Medical Paid Amount PEPY"],
            "Cost_RX Paid Amount PEPY": data["Cost_RX Paid Amount PEPY"],
            
            "Dise_Heart Disease Prevalence": data["Dise_Heart Disease Prevalence"],
            "Dise_Type 2 Diabetes Prevalence": data["Dise_Type 2 Diabetes Prevalence"],
            "Dise_Mental Health Disorder Prevalence": data["Dise_Mental Health Disorder Prevalence"],
            "Dise_Substance Use Disorder Prevalence": data["Dise_Substance Use Disorder Prevalence"],
            
            "Gaps_Diabetes RX Adherence": data["Gaps_Diabetes RX Adherence"],
            "Gaps_Behavioral Health FU ED Visit Mental Illness": data["Gaps_Behavioral Health FU ED Visit Mental Illness"],
            "Gaps_Cancer Screening Breast": data["Gaps_Cancer Screening Breast"],
            "Gaps_Wellness Visit Adults": data["Gaps_Wellness Visit Adults"],
            
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
                strengths: Array.isArray(data.strengths) ? data.strengths : [],
                weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
                opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
                threats: Array.isArray(data.threats) ? data.threats : [],
              },
              strategicPriorities: Array.isArray(data.strategic_recommendations) ? data.strategic_recommendations : [],
              costSavings: [],
              riskProfile: data["Risk_Average Risk Score"] ? {
                score: data["Risk_Average Risk Score"].toFixed(2),
                comparison: 'Based on clinical and utilization patterns',
                conditions: [
                  { name: 'Risk Score', value: data["Risk_Average Risk Score"].toFixed(2), barWidth: `${data["Risk_Average Risk Score"] * 50}%` }
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
            const familyInfo = getFamilyById(data.family_id as FamilyId);
            setFamilyData(familyInfo || {
              id: data.family_id,
              name: data.family_name || '',
              description: data.family_short_description || '',
              short_description: data.family_short_description || '',
              long_description: data.family_long_description || '',
              commonTraits: Array.isArray(data.common_traits) ? data.common_traits : [],
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
