
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { ArchetypeId } from '@/types/archetype';
import { normalizeArchetypeId } from '@/utils/archetypeValidation';
import { normalizeSwotData } from '@/utils/swot/normalizeSwotData';

interface UseReportAccessOptions {
  archetypeId: string;
  token: string;
  isAdminView?: boolean;
}

// Define valid table names to satisfy TypeScript
type SecureTableName = 'level4_report_secure' | 'level4_deepdive_report_data_secure' | 'level3_report_secure' | 'level3_report_data_secure';

export const useReportAccess = ({ archetypeId: rawArchetypeId, token, isAdminView = false }: UseReportAccessOptions) => {
  const [reportData, setReportData] = useState<any | null>(null);
  const [averageData, setAverageData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

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
          // Try exact match first
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('archetype_id', archetypeIdParam)
            .maybeSingle();
            
          if (!error && data) {
            return { data, error };
          }
          
          // If exact match fails, try case-insensitive search
          console.log(`[useReportAccess] Trying case-insensitive search in ${tableName}`);
          return await supabase
            .from(tableName)
            .select('*')
            .ilike('archetype_id', archetypeIdParam)
            .maybeSingle();
        };

        // Fetch detailed report data from level4 secure view
        const { data: deepDiveData, error: deepDiveError } = await fetchWithCaseInsensitiveSearch(
          'level4_report_secure' as SecureTableName, 
          archetypeId
        );

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
          const { data: level4BaseData, error: level4BaseError } = await fetchWithCaseInsensitiveSearch(
            'level4_deepdive_report_data_secure' as SecureTableName, 
            archetypeId
          );
            
          if (!level4BaseError && level4BaseData) {
            console.log(`[useReportAccess] Got level4 data using base secure view for ${archetypeId}`);
            
            // Process SWOT data to ensure proper structure using safe type checking
            const processedData = {
              ...level4BaseData,
              // Safely access SWOT data with optional fallbacks
              strengths: level4BaseData?.strengths || (level4BaseData?.swot_analysis?.strengths) || [],
              weaknesses: level4BaseData?.weaknesses || (level4BaseData?.swot_analysis?.weaknesses) || [],
              opportunities: level4BaseData?.opportunities || (level4BaseData?.swot_analysis?.opportunities) || [],
              threats: level4BaseData?.threats || (level4BaseData?.swot_analysis?.threats) || []
            };
            
            // Create a swot_analysis object for backward compatibility if it doesn't exist
            if (!processedData.swot_analysis) {
              processedData.swot_analysis = {
                strengths: processedData.strengths || [],
                weaknesses: processedData.weaknesses || [],
                opportunities: processedData.opportunities || [],
                threats: processedData.threats || []
              };
            }
            
            setReportData(processedData);
            setDebugInfo(prev => ({
              ...prev,
              level4BaseQuery: {
                success: true,
                dataFound: true,
                hasSwotData: !!(
                  normalizeSwotData(processedData.strengths || []).length > 0 || 
                  normalizeSwotData(processedData.swot_analysis?.strengths || []).length > 0
                )
              }
            }));
            
            console.log("[useReportAccess] SWOT data in level4BaseData:", {
              hasStrengthsArray: !!(normalizeSwotData(processedData.strengths || []).length > 0),
              strengthsLength: normalizeSwotData(processedData.strengths || []).length,
              hasSwotAnalysis: !!(processedData.swot_analysis),
              swotStrengthsLength: processedData.swot_analysis ? normalizeSwotData(processedData.swot_analysis.strengths || []).length : 0
            });
          }
        } else if (deepDiveData) {
          console.log(`[useReportAccess] Got level4 deep dive data for ${archetypeId}`);
          
          // Process SWOT data to ensure proper structure
          const processedData = {
            ...deepDiveData,
            // Safely access SWOT data with optional fallbacks
            strengths: deepDiveData?.strengths || (deepDiveData?.swot_analysis?.strengths) || [],
            weaknesses: deepDiveData?.weaknesses || (deepDiveData?.swot_analysis?.weaknesses) || [],
            opportunities: deepDiveData?.opportunities || (deepDiveData?.swot_analysis?.opportunities) || [],
            threats: deepDiveData?.threats || (deepDiveData?.swot_analysis?.threats) || []
          };
          
          // Create a swot_analysis object for backward compatibility if it doesn't exist
          if (!processedData.swot_analysis) {
            processedData.swot_analysis = {
              strengths: processedData.strengths || [],
              weaknesses: processedData.weaknesses || [],
              opportunities: processedData.opportunities || [],
              threats: processedData.threats || []
            };
          }
          
          setReportData(processedData);
          setDebugInfo(prev => ({
            ...prev,
            level4Query: {
              success: true,
              dataFound: true,
              hasSwotData: !!(
                normalizeSwotData(processedData.strengths || []).length > 0 || 
                normalizeSwotData(processedData.swot_analysis?.strengths || []).length > 0
              )
            }
          }));
          
          console.log("[useReportAccess] SWOT data in deepDiveData:", {
            hasStrengthsArray: !!(normalizeSwotData(processedData.strengths || []).length > 0),
            strengthsLength: normalizeSwotData(processedData.strengths || []).length,
            hasSwotAnalysis: !!(processedData.swot_analysis),
            swotStrengthsLength: processedData.swot_analysis ? normalizeSwotData(processedData.swot_analysis.strengths || []).length : 0
          });
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
          const { data: level3Data, error: level3Error } = await fetchWithCaseInsensitiveSearch(
            'level3_report_secure' as SecureTableName, 
            archetypeId
          );
            
          if (!level3Error && level3Data) {
            console.log(`[useReportAccess] Got level3 data using secure view for ${archetypeId}`);
            
            // Process SWOT data to ensure proper structure
            const processedData = {
              ...level3Data,
              // Safely access SWOT data with optional fallbacks
              strengths: level3Data?.strengths || (level3Data?.swot_analysis?.strengths) || [],
              weaknesses: level3Data?.weaknesses || (level3Data?.swot_analysis?.weaknesses) || [],
              opportunities: level3Data?.opportunities || (level3Data?.swot_analysis?.opportunities) || [],
              threats: level3Data?.threats || (level3Data?.swot_analysis?.threats) || []
            };
            
            // Create a swot_analysis object for backward compatibility if it doesn't exist
            if (!processedData.swot_analysis) {
              processedData.swot_analysis = {
                strengths: processedData.strengths || [],
                weaknesses: processedData.weaknesses || [],
                opportunities: processedData.opportunities || [],
                threats: processedData.threats || []
              };
            }
            
            setReportData(processedData);
            setDebugInfo(prev => ({
              ...prev,
              level3Query: {
                success: true,
                dataFound: true,
                hasSwotData: !!(
                  normalizeSwotData(processedData.strengths || []).length > 0 || 
                  normalizeSwotData(processedData.swot_analysis?.strengths || []).length > 0
                )
              }
            }));
            
            console.log("[useReportAccess] SWOT data in level3Data:", {
              hasStrengthsArray: !!(normalizeSwotData(processedData.strengths || []).length > 0),
              strengthsLength: normalizeSwotData(processedData.strengths || []).length,
              hasSwotAnalysis: !!(processedData.swot_analysis),
              swotStrengthsLength: processedData.swot_analysis ? normalizeSwotData(processedData.swot_analysis.strengths || []).length : 0
            });
          }
        }

        // If we still don't have SWOT data, try getting it directly from the Analysis_Archetype_SWOT table
        if (!reportData?.strengths && (!reportData?.swot_analysis || !reportData?.swot_analysis?.strengths)) {
          console.log(`[useReportAccess] No SWOT data found in report data, trying to fetch directly from SWOT table for ${archetypeId}`);
          
          const { data: swotData, error: swotError } = await supabase
            .from('Analysis_Archetype_SWOT')
            .select('strengths, weaknesses, opportunities, threats')
            .eq('archetype_id', archetypeId)
            .maybeSingle();
            
          if (!swotError && swotData && (swotData.strengths || swotData.weaknesses || swotData.opportunities || swotData.threats)) {
            console.log(`[useReportAccess] Got SWOT data directly from SWOT table:`, swotData);
            
            // Update reportData with SWOT information
            setReportData(prevData => {
              const updatedData = {
                ...prevData,
                strengths: swotData.strengths || [],
                weaknesses: swotData.weaknesses || [],
                opportunities: swotData.opportunities || [],
                threats: swotData.threats || [],
                // Also add to swot_analysis for compatibility
                swot_analysis: {
                  strengths: swotData.strengths || [],
                  weaknesses: swotData.weaknesses || [],
                  opportunities: swotData.opportunities || [],
                  threats: swotData.threats || []
                }
              };
              
              return updatedData;
            });
            
            setDebugInfo(prev => ({
              ...prev,
              swotQuery: {
                success: true,
                dataFound: true,
                strengths: normalizeSwotData(swotData.strengths || []).length,
                weaknesses: normalizeSwotData(swotData.weaknesses || []).length,
                opportunities: normalizeSwotData(swotData.opportunities || []).length,
                threats: normalizeSwotData(swotData.threats || []).length
              }
            }));
          }
        }

        // Fetch average data for comparisons
        const { data: avgData, error: avgError } = await supabase
          .from('level4_report_secure' as SecureTableName)
          .select('*')
          .eq('archetype_id', 'All_Average')
          .maybeSingle();

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
          const { data: avgBaseData, error: avgBaseError } = await supabase
            .from('level4_deepdive_report_data_secure' as SecureTableName)
            .select('*')
            .eq('archetype_id', 'All_Average')
            .maybeSingle();
            
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
  }, [rawArchetypeId, archetypeId, token, isAdminView]);

  return {
    reportData,
    archetypeData,
    averageData,
    isLoading: isLoading || archetypeLoading,
    error: error || archetypeError,
    debugInfo
  };
};
