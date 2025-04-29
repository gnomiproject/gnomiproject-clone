
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { ArchetypeId } from '@/types/archetype';

interface UseReportAccessOptions {
  archetypeId: string;
  token: string;
  isAdminView?: boolean;
}

export const useReportAccess = ({ archetypeId, token, isAdminView = false }: UseReportAccessOptions) => {
  const [reportData, setReportData] = useState<any | null>(null);
  const [averageData, setAverageData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

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

        console.log(`[useReportAccess] Fetching report data for ${archetypeId} with token ${token.substring(0, 5)}...`);
        setDebugInfo(prev => ({
          ...prev,
          fetchStarted: true,
          archetypeId,
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

        // Fetch detailed report data from level4 data table
        const { data: deepDiveData, error: deepDiveError } = await supabase
          .from('level4_deepdive_report_data')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (deepDiveError) {
          console.warn(`[useReportAccess] Could not fetch level4 data: ${deepDiveError.message}`);
          setDebugInfo(prev => ({
            ...prev,
            level4Query: {
              success: false,
              error: deepDiveError.message
            }
          }));
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
        }

        // Fetch average data for comparisons
        const { data: avgData, error: avgError } = await supabase
          .from('level4_deepdive_report_data')
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
  }, [archetypeId, token, isAdminView]);

  return {
    reportData,
    archetypeData,
    averageData,
    isLoading: isLoading || archetypeLoading,
    error: error || archetypeError,
    debugInfo
  };
};
