
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
  
  useEffect(() => {
    const fetchData = async () => {
      if (!archetypeId) {
        setError(new Error('No archetype ID provided'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Determine primary and fallback tables based on report type
        const primaryTable = reportType === 'insights' ? 'level3_report_data' : 'level4_deepdive_report_data';
        const fallbackTable = reportType === 'insights' ? 'level4_deepdive_report_data' : 'level3_report_data';
        
        console.log(`AdminReportViewer: Fetching ${reportType} data for ${archetypeId} from ${primaryTable}`);
        
        const { data, error } = await supabase
          .from(primaryTable)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          // Use uppercase archetype ID as the code
          const archetypeCode = archetypeId.toUpperCase();
          
          setData({
            ...data,
            code: archetypeCode,
            id: data.archetype_id,
            name: data.archetype_name,
            reportType: reportType === 'insights' ? 'Insights' : 'Deep Dive'
          });
          setDataSource(primaryTable);
          return;
        }
        
        // If no data found in primary table, try fallback
        console.log(`AdminReportViewer: No data found in ${primaryTable}, trying ${fallbackTable}`);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from(fallbackTable)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
          
        if (fallbackError) throw fallbackError;
        
        if (fallbackData) {
          // Use uppercase archetype ID as the code
          const archetypeCode = archetypeId.toUpperCase();
          
          setData({
            ...fallbackData,
            code: archetypeCode,
            id: fallbackData.archetype_id,
            name: fallbackData.archetype_name,
            reportType: reportType === 'insights' ? 'Insights' : 'Deep Dive'
          });
          setDataSource(`${fallbackTable} (fallback)`);
        } else {
          throw new Error('No data found for this archetype');
        }
      } catch (err: any) {
        console.error('Error fetching archetype data:', err);
        setError(err instanceof Error ? err : new Error(err.message || 'Failed to load report data'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [archetypeId, reportType, skipCache]);
  
  const refreshData = () => {
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
