
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

      console.log('useAdminReportData: Starting data fetch for', archetypeId);
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
          // Use uppercase archetype ID as the code
          const archetypeCode = archetypeId.toUpperCase();
          
          // Process the data before setting it
          const processedData = {
            ...data,
            code: archetypeCode,
            id: data.archetype_id || archetypeId,
            name: data.archetype_name || archetypeId,
            reportType: reportType === 'insights' ? 'Insights' : 'Deep Dive'
          };
          
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
          // Use uppercase archetype ID as the code
          const archetypeCode = archetypeId.toUpperCase();
          
          // Process the data before setting it
          const processedFallbackData = {
            ...fallbackData,
            code: archetypeCode,
            id: fallbackData.archetype_id || archetypeId,
            name: fallbackData.archetype_name || archetypeId,
            reportType: reportType === 'insights' ? 'Insights' : 'Deep Dive'
          };
          
          console.log('useAdminReportData: Processed fallback data keys:', Object.keys(processedFallbackData));
          setData(processedFallbackData);
          setDataSource(`${fallbackTable} (fallback)`);
          setLoading(false);
        } else {
          console.log('useAdminReportData: No data found in either table');
          
          // Last resort: Create minimal synthetic data for testing
          const syntheticData = {
            archetype_id: archetypeId,
            archetype_name: `Archetype ${archetypeId.toUpperCase()}`,
            short_description: "This is fallback data since no actual data was found in the database.",
            code: archetypeId.toUpperCase(),
            id: archetypeId,
            name: `Archetype ${archetypeId.toUpperCase()} (Synthetic)`,
            reportType: reportType === 'insights' ? 'Insights' : 'Deep Dive',
            // Add minimal required properties for report rendering
            strengths: ["Fallback strength 1", "Fallback strength 2"],
            weaknesses: ["Fallback weakness 1", "Fallback weakness 2"],
            opportunities: ["Fallback opportunity 1", "Fallback opportunity 2"],
            threats: ["Fallback threat 1", "Fallback threat 2"],
            strategic_recommendations: [
              { recommendation_number: 1, title: "Fallback recommendation", description: "This is a fallback recommendation" }
            ]
          };
          
          console.log('useAdminReportData: Using synthetic data:', Object.keys(syntheticData));
          setData(syntheticData);
          setDataSource('synthetic (no data found)');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('useAdminReportData: Error fetching archetype data:', err);
        setError(err instanceof Error ? err : new Error(err.message || 'Failed to load report data'));
        
        // Create fallback minimal data even on error
        const errorFallbackData = {
          archetype_id: archetypeId,
          archetype_name: `Archetype ${archetypeId.toUpperCase()} (Error Fallback)`,
          short_description: `Error loading data: ${err.message || 'Unknown error'}`,
          code: archetypeCode || archetypeId.toUpperCase(),
          id: archetypeId,
          name: `Archetype ${archetypeId.toUpperCase()} (Error Fallback)`,
          reportType: reportType === 'insights' ? 'Insights' : 'Deep Dive',
          // Add minimal required properties for report rendering
          strengths: ["Error fallback strength"],
          weaknesses: ["Error fallback weakness"],
          opportunities: ["Error fallback opportunity"],
          threats: ["Error fallback threat"],
          strategic_recommendations: [
            { recommendation_number: 1, title: "Error fallback recommendation", description: "This is an error fallback recommendation" }
          ]
        };
        
        console.log('useAdminReportData: Using error fallback data');
        setData(errorFallbackData);
        setDataSource('error fallback');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [archetypeId, reportType, skipCache]);
  
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
