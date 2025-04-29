
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { ArchetypeId } from '@/types/archetype';
import { normalizeArchetypeId } from '@/utils/archetypeValidation';
import { useDebug } from '@/components/debug/DebugProvider';

interface UseReportAccessOptions {
  archetypeId: string;
  token: string;
  isAdminView?: boolean;
}

// Define valid table names to satisfy TypeScript
type SecureTableName = 'level4_report_secure' | 'level4_deepdive_report_data_secure' | 'level3_report_secure';

export const useReportAccess = ({ archetypeId: rawArchetypeId, token, isAdminView = false }: UseReportAccessOptions) => {
  const [reportData, setReportData] = useState<any | null>(null);
  const [averageData, setAverageData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { addDataSource, trackQueryTime } = useDebug();

  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = normalizeArchetypeId(rawArchetypeId);
  
  // Get archetypeData using the existing hook
  const {
    archetypeData,
    isLoading: archetypeLoading,
    error: archetypeError,
  } = useGetArchetype(archetypeId as ArchetypeId);

  // Load report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`[useReportAccess] Fetching report data for ${rawArchetypeId} (normalized: ${archetypeId}) with token ${token.substring(0, 5)}...`);
        setDebugInfo(prev => ({
          ...prev,
          fetchStarted: true,
          originalArchetypeId: rawArchetypeId,
          normalizedArchetypeId: archetypeId,
          tokenPreview: token.substring(0, 5) + '...',
          isAdminView
        }));

        // Skip token validation for admin view
        if (isAdminView) {
          console.log(`[useReportAccess] Admin view detected, skipping token validation`);
          setDebugInfo(prev => ({
            ...prev,
            adminViewDetected: true
          }));
        } else {
          // For normal users, verify the token is valid first
          console.log(`[useReportAccess] Validating token: ${token.substring(0, 5)}...`);
        }

        // Try case-insensitive search for more robust data retrieval
        const fetchWithCaseInsensitiveSearch = async (tableName: SecureTableName, archetypeIdParam: string) => {
          const startTime = performance.now();
          
          // Try exact match first
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('archetype_id', archetypeIdParam)
            .maybeSingle();
            
          const endTime = performance.now();
          const queryTime = endTime - startTime;
          
          // Track query for debugging
          addDataSource({
            tableName,
            fields: data ? Object.keys(data) : [],
            queryParams: [
              { name: 'archetype_id', value: archetypeIdParam }
            ]
          });
          
          trackQueryTime(tableName, queryTime);
            
          if (!error && data) {
            return { data, error };
          }
          
          // If exact match fails, try case-insensitive search
          console.log(`[useReportAccess] Trying case-insensitive search in ${tableName}`);
          const iCaseStartTime = performance.now();
          
          const result = await supabase
            .from(tableName)
            .select('*')
            .ilike('archetype_id', archetypeIdParam)
            .maybeSingle();
            
          const iCaseEndTime = performance.now();
          const iCaseQueryTime = iCaseEndTime - iCaseStartTime;
          
          // Track query for debugging
          addDataSource({
            tableName,
            fields: result.data ? Object.keys(result.data) : [],
            queryParams: [
              { name: 'archetype_id (ilike)', value: archetypeIdParam }
            ]
          });
          
          trackQueryTime(tableName, iCaseQueryTime);
          
          return result;
        };

        // Fetch detailed report data from level4 secure view
        const { data: deepDiveData, error: deepDiveError } = await fetchWithCaseInsensitiveSearch('level4_report_secure', archetypeId);

        if (deepDiveError) {
          console.warn(`[useReportAccess] Could not fetch level4 data: ${deepDiveError.message}`);
          setDebugInfo(prev => ({
            ...prev,
            level4Query: {
              success: false,
              error: deepDiveError.message
            }
          }));
          
          // Try the base level4 data with secure view if level4_report_secure fails
          const { data: level4BaseData, error: level4BaseError } = await fetchWithCaseInsensitiveSearch('level4_deepdive_report_data_secure', archetypeId);
            
          if (!level4BaseError && level4BaseData) {
            console.log(`[useReportAccess] Got level4 data using base secure view for ${archetypeId}`);
            setReportData(level4BaseData);
            setDebugInfo(prev => ({
              ...prev,
              level4BaseQuery: {
                success: true,
                dataFound: true
              }
            }));
          }
        } else if (deepDiveData) {
          console.log(`[useReportAccess] Got level4 deep dive data for ${archetypeId}`);
          setReportData(deepDiveData);
          setDebugInfo(prev => ({
            ...prev,
            level4Query: {
              success: true,
              dataFound: true
            }
          }));
        } else {
          console.log(`[useReportAccess] No level4 data found for ${archetypeId}, falling back`);
          setDebugInfo(prev => ({
            ...prev,
            level4Query: {
              success: true,
              dataFound: false
            }
          }));
          
          // Try the level3 secure view as fallback
          const { data: level3Data, error: level3Error } = await fetchWithCaseInsensitiveSearch('level3_report_secure', archetypeId);
            
          if (!level3Error && level3Data) {
            console.log(`[useReportAccess] Got level3 data using secure view for ${archetypeId}`);
            setReportData(level3Data);
            setDebugInfo(prev => ({
              ...prev,
              level3Query: {
                success: true,
                dataFound: true
              }
            }));
          }
        }

        // Fetch average data for comparisons
        const avgStartTime = performance.now();
        const { data: avgData, error: avgError } = await supabase
          .from('level4_report_secure' as const)
          .select('*')
          .eq('archetype_id', 'All_Average')
          .maybeSingle();
          
        const avgEndTime = performance.now();
        const avgQueryTime = avgEndTime - avgStartTime;
        
        // Track query for debugging
        addDataSource({
          tableName: 'level4_report_secure',
          fields: avgData ? Object.keys(avgData) : [],
          queryParams: [
            { name: 'archetype_id', value: 'All_Average' }
          ]
        });
        
        trackQueryTime('level4_report_secure (avg)', avgQueryTime);

        if (avgError) {
          console.warn(`[useReportAccess] Could not fetch average data: ${avgError.message}`);
          setDebugInfo(prev => ({
            ...prev,
            averageQuery: {
              success: false,
              error: avgError.message
            }
          }));
          
          // Try the base secure view for average data
          const avgBaseStartTime = performance.now();
          const { data: avgBaseData, error: avgBaseError } = await supabase
            .from('level4_deepdive_report_data_secure' as const)
            .select('*')
            .eq('archetype_id', 'All_Average')
            .maybeSingle();
          
          const avgBaseEndTime = performance.now();
          const avgBaseQueryTime = avgBaseEndTime - avgBaseStartTime;
          
          // Track query for debugging
          addDataSource({
            tableName: 'level4_deepdive_report_data_secure',
            fields: avgBaseData ? Object.keys(avgBaseData) : [],
            queryParams: [
              { name: 'archetype_id', value: 'All_Average' }
            ]
          });
          
          trackQueryTime('level4_deepdive_report_data_secure (avg)', avgBaseQueryTime);
            
          if (!avgBaseError && avgBaseData) {
            console.log(`[useReportAccess] Got average data using base secure view`);
            setAverageData(avgBaseData);
            setDebugInfo(prev => ({
              ...prev,
              averageBaseQuery: {
                success: true,
                dataFound: true
              }
            }));
          }
        } else if (avgData) {
          console.log(`[useReportAccess] Got average comparison data`);
          setAverageData(avgData);
          setDebugInfo(prev => ({
            ...prev,
            averageQuery: {
              success: true,
              dataFound: true
            }
          }));
        }

      } catch (err) {
        console.error(`[useReportAccess] Error loading report data:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error loading report data'));
        setDebugInfo(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [rawArchetypeId, archetypeId, token, isAdminView, addDataSource, trackQueryTime]);

  return {
    reportData,
    archetypeData,
    averageData,
    isLoading: isLoading || archetypeLoading,
    error: error || archetypeError,
    debugInfo
  };
};
