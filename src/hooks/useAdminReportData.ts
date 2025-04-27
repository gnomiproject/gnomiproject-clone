
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminReportDataOptions {
  archetypeId: string;
  reportType: 'insights' | 'deepdive';
  skipCache?: boolean;
}

export function useAdminReportData({ archetypeId, reportType, skipCache = false }: AdminReportDataOptions) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  
  console.log('useAdminReportData: Hook initialized with:', { archetypeId, reportType, skipCache });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!archetypeId) {
        console.log('useAdminReportData: No archetypeId provided, setting error');
        setError(new Error('No archetype ID provided'));
        setLoading(false);
        return;
      }

      console.log('useAdminReportData: Starting data fetch for', archetypeId, 'report type:', reportType);
      setLoading(true);
      setError(null);
      
      try {
        // Determine primary table based on report type
        const primaryTable = reportType === 'insights' ? 'level3_report_data' : 'level4_deepdive_report_data';
        
        console.log(`useAdminReportData: Fetching ${reportType} data for ${archetypeId} from ${primaryTable}`);
        
        const { data, error } = await supabase
          .from(primaryTable)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (error) {
          console.error('useAdminReportData: Error from primary table:', error);
          throw error;
        }
        
        if (data) {
          console.log('useAdminReportData: Data found in primary table:', Object.keys(data));
          
          // Ensure JSON fields are properly parsed
          const processedData = standardizeArchetypeData(data, archetypeId, reportType);
          
          console.log('useAdminReportData: Processed data keys:', Object.keys(processedData));
          setData(processedData);
          setDataSource(primaryTable);
          setLoading(false);
          return;
        }
        
        // If no data found in primary table, try fallback (other table)
        const fallbackTable = reportType === 'insights' ? 'level4_deepdive_report_data' : 'level3_report_data';
        console.log(`useAdminReportData: No data found in ${primaryTable}, trying ${fallbackTable}`);
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from(fallbackTable)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (fallbackError) {
          console.error('useAdminReportData: Error from fallback table:', fallbackError);
          throw fallbackError;
        }
        
        if (fallbackData) {
          console.log('useAdminReportData: Data found in fallback table:', Object.keys(fallbackData));
          
          // Create a consistent data structure regardless of source
          const processedFallbackData = standardizeArchetypeData(fallbackData, archetypeId, reportType);
          
          console.log('useAdminReportData: Processed fallback data keys:', Object.keys(processedFallbackData));
          setData(processedFallbackData);
          setDataSource(`${fallbackTable} (fallback)`);
          setLoading(false);
        } else {
          console.log('useAdminReportData: No data found in either table');
          
          // Last resort: Create minimal synthetic data for testing
          const syntheticData = createSyntheticData(archetypeId, reportType);
          
          console.log('useAdminReportData: Using synthetic data:', Object.keys(syntheticData));
          setData(syntheticData);
          setDataSource('synthetic (no data found)');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('useAdminReportData: Error fetching archetype data:', err);
        setError(err instanceof Error ? err : new Error(err.message || 'Failed to load report data'));
        
        // Create fallback minimal data even on error
        const errorFallbackData = createErrorFallbackData(archetypeId, reportType, err);
        
        console.log('useAdminReportData: Using error fallback data');
        setData(errorFallbackData);
        setDataSource('error fallback');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [archetypeId, reportType, skipCache]);
  
  // Helper function to standardize data structure regardless of source
  const standardizeArchetypeData = (sourceData: any, id: string, type: 'insights' | 'deepdive') => {
    // Check for JSON fields that need parsing and handle them safely
    const safeParseJSON = (value: any) => {
      if (!value) return null;
      
      // If it's already an object, don't try to parse it again
      if (typeof value === 'object' && value !== null) {
        return value;
      }
      
      // Try to parse string JSON
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.warn('useAdminReportData: Failed to parse JSON string:', value);
          return value; // Return original value if parsing fails
        }
      }
      
      return value;
    };
    
    // Handle SWOT data which might be stored differently in different tables
    const parsedSwotAnalysis = sourceData.swot_analysis ? safeParseJSON(sourceData.swot_analysis) : null;
    
    // Extract SWOT data from either direct fields or nested swot_analysis
    const strengths = sourceData.strengths ? 
      safeParseJSON(sourceData.strengths) : 
      (parsedSwotAnalysis?.strengths || []);
      
    const weaknesses = sourceData.weaknesses ? 
      safeParseJSON(sourceData.weaknesses) : 
      (parsedSwotAnalysis?.weaknesses || []);
      
    const opportunities = sourceData.opportunities ? 
      safeParseJSON(sourceData.opportunities) : 
      (parsedSwotAnalysis?.opportunities || []);
      
    const threats = sourceData.threats ? 
      safeParseJSON(sourceData.threats) : 
      (parsedSwotAnalysis?.threats || []);
    
    // Parse strategic recommendations if it exists and is a string
    const strategicRecommendations = sourceData.strategic_recommendations ? 
      safeParseJSON(sourceData.strategic_recommendations) : 
      [];
    
    // Create a standard data structure that works for both report types
    const archetypeCode = id.toUpperCase();
    
    return {
      ...sourceData,
      // Ensure these key fields exist for both report types
      code: archetypeCode,
      id: sourceData.archetype_id || id,
      name: sourceData.archetype_name || `Archetype ${archetypeCode}`,
      reportType: type === 'insights' ? 'Insights' : 'Deep Dive',
      // Ensure SWOT data is consistently structured as arrays
      strengths: Array.isArray(strengths) ? strengths : [],
      weaknesses: Array.isArray(weaknesses) ? weaknesses : [],
      opportunities: Array.isArray(opportunities) ? opportunities : [],
      threats: Array.isArray(threats) ? threats : [],
      // Ensure strategic recommendations exist as an array
      strategic_recommendations: Array.isArray(strategicRecommendations) ? strategicRecommendations : []
    };
  };
  
  // Helper function to create synthetic data
  const createSyntheticData = (id: string, type: 'insights' | 'deepdive') => {
    const archetypeCode = id.toUpperCase();
    return {
      archetype_id: id,
      archetype_name: `Archetype ${archetypeCode}`,
      short_description: "This is fallback data since no actual data was found in the database.",
      code: archetypeCode,
      id: id,
      name: `Archetype ${archetypeCode} (Synthetic)`,
      reportType: type === 'insights' ? 'Insights' : 'Deep Dive',
      // Add minimal required properties for report rendering
      strengths: ["Fallback strength 1", "Fallback strength 2"],
      weaknesses: ["Fallback weakness 1", "Fallback weakness 2"],
      opportunities: ["Fallback opportunity 1", "Fallback opportunity 2"],
      threats: ["Fallback threat 1", "Fallback threat 2"],
      strategic_recommendations: [
        { recommendation_number: 1, title: "Fallback recommendation", description: "This is a fallback recommendation" }
      ],
      // Add other required fields that might be needed by both report types
      Demo_Average_Age: 40,
      Demo_Average_Family_Size: 3.0,
      Risk_Average_Risk_Score: 1.0,
      Cost_Medical_RX_Paid_Amount_PMPY: 5000
    };
  };
  
  // Helper function to create error fallback data
  const createErrorFallbackData = (id: string, type: 'insights' | 'deepdive', err: any) => {
    const archetypeCode = id.toUpperCase();
    return {
      archetype_id: id,
      archetype_name: `Archetype ${archetypeCode} (Error Fallback)`,
      short_description: `Error loading data: ${err.message || 'Unknown error'}`,
      code: archetypeCode,
      id: id,
      name: `Archetype ${archetypeCode} (Error Fallback)`,
      reportType: type === 'insights' ? 'Insights' : 'Deep Dive',
      // Add minimal required properties for report rendering
      strengths: ["Error fallback strength"],
      weaknesses: ["Error fallback weakness"],
      opportunities: ["Error fallback opportunity"],
      threats: ["Error fallback threat"],
      strategic_recommendations: [
        { recommendation_number: 1, title: "Error fallback recommendation", description: "This is an error fallback recommendation" }
      ]
    };
  };

  const refreshData = () => {
    console.log('useAdminReportData: Refreshing data');
    setLoading(true);
    // This will trigger the useEffect again
  };

  return { 
    data, 
    loading, 
    error, 
    dataSource,
    refreshData
  };
}
