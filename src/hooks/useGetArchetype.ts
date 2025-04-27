import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArchetypeDetailedData, ArchetypeId, FamilyId, Json } from '@/types/archetype';
import { useArchetypes } from './useArchetypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast"; // Add this import

interface UseGetArchetype {
  archetypeData: ArchetypeDetailedData | null;
  familyData: any | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  dataSource: string;
  refreshData: () => Promise<void>;
}

// In-memory cache
const archetypeCache = new Map();

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

// Function to fetch archetype data from Supabase
const fetchArchetypeData = async (archetypeId: ArchetypeId, skipCache: boolean = false) => {
  console.log("Fetching data for archetypeId:", archetypeId);
  
  // Check cache first if not explicitly skipping
  const cacheKey = `archetype-${archetypeId}`;
  if (!skipCache && archetypeCache.has(cacheKey)) {
    console.log(`Using cached data for archetype ${archetypeId}`);
    return archetypeCache.get(cacheKey).data;
  }
  
  const { data, error: fetchError } = await supabase
    .from('level3_report_data')
    .select('*')
    .eq('archetype_id', archetypeId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }
  
  // Store in cache
  if (data) {
    archetypeCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  return data;
};

export const useGetArchetype = (archetypeId: ArchetypeId, skipCache: boolean = false): UseGetArchetype => {
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [familyData, setFamilyData] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<string>(''); 
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const queryClient = useQueryClient();
  
  // Process data on success - defined as a callback to avoid recreating on each render
  const processData = useCallback((data: any) => {
    console.log("Processing data:", data);
    
    if (data) {
      // Map data from level3_report_data to ArchetypeDetailedData structure
      const formattedData: ArchetypeDetailedData = {
        id: data.archetype_id as ArchetypeId,
        name: data.archetype_name || '',
        familyId: data.family_id as FamilyId || ('unknown' as FamilyId),
        familyName: data.family_name,
        family_name: data.family_name, // Add for compatibility with level3_report_data
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

      setArchetypeData(formattedData);
      setDataSource('level3_report_data');
      console.log("Formatted archetype data:", formattedData);
      
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
      console.log("No data found in level3_report_data, falling back to local data");
      const fallbackArchetype = getArchetypeEnhanced(archetypeId);
      
      if (fallbackArchetype) {
        console.log("Using fallback archetype data:", fallbackArchetype);
        setArchetypeData(fallbackArchetype);
        setDataSource('local data'); // Set data source for fallback
        
        if (fallbackArchetype.familyId) {
          const familyInfo = getFamilyById(fallbackArchetype.familyId);
          setFamilyData(familyInfo);
        }
      }
    }
  }, [getFamilyById, getArchetypeEnhanced, archetypeId]);

  // Handle errors - defined as a callback to avoid recreating on each render
  const handleError = useCallback((error: Error) => {
    console.error("Error fetching archetype data:", error);
    
    // Fallback to original archetype data structure on error
    const fallbackArchetype = getArchetypeEnhanced(archetypeId);
    if (fallbackArchetype) {
      console.log("Using fallback data due to error");
      setArchetypeData(fallbackArchetype);
      setDataSource('local data (fallback after error)'); // Set data source for error fallback
      
      if (fallbackArchetype.familyId) {
        const familyInfo = getFamilyById(fallbackArchetype.familyId);
        setFamilyData(familyInfo);
      }
    }
  }, [getFamilyById, getArchetypeEnhanced, archetypeId]);
  
  // Use React Query for data fetching with proper caching
  const { 
    isLoading, 
    error, 
    refetch,
    data 
  } = useQuery({
    queryKey: ['archetype', archetypeId, skipCache],
    queryFn: () => fetchArchetypeData(archetypeId, skipCache),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once
    enabled: !!archetypeId,
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
    refetchOnMount: false, // Prevent refetching on component mount if data exists
    // Fix: Remove conditional state updates inside the query callbacks
    meta: {
      onError: (err: Error) => {
        console.log("Query error caught in meta handler");
      }
    }
  });

  // Force refresh data
  const refreshData = async () => {
    toast.loading("Refreshing archetype data...");
    
    // Clear cache for this archetype
    const cacheKey = `archetype-${archetypeId}`;
    archetypeCache.delete(cacheKey);
    
    // Invalidate query cache
    queryClient.invalidateQueries({
      queryKey: ['archetype', archetypeId]
    });
    
    try {
      await refetch();
      toast.success("Archetype data refreshed!");
    } catch (e) {
      toast.error("Failed to refresh data. Please try again.");
    }
  };

  // Process data in useEffect, not conditionally in render
  useEffect(() => {
    if (data) {
      processData(data);
    } else if (error) {
      handleError(error as Error);
    }
  }, [data, error, processData, handleError]);

  // Cleanup function for memory management
  useEffect(() => {
    return () => {
      // Clean up any heavy data on unmount
      console.log(`Cleaning up resources for archetype ${archetypeId}`);
    };
  }, [archetypeId]);

  return { 
    archetypeData, 
    familyData, 
    isLoading,
    error: error as Error | null,
    refetch: refetch as () => Promise<any>,
    dataSource,
    refreshData
  };
};
