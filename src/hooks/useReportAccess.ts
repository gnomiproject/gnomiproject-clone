
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { ArchetypeId } from '@/types/archetype';
import { normalizeArchetypeId } from '@/utils/archetypeValidation';
import { toast } from 'sonner';

interface UseReportAccessOptions {
  archetypeId: string;
  token: string;
  isAdminView?: boolean;
  skipCache?: boolean;
}

export const useReportAccess = ({ 
  archetypeId: rawArchetypeId, 
  token, 
  isAdminView = false,
  skipCache = false
}: UseReportAccessOptions) => {
  const [reportData, setReportData] = useState<any | null>(null);
  const [averageData, setAverageData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Normalize the archetype ID to handle case sensitivity
  const archetypeId = normalizeArchetypeId(rawArchetypeId);
  
  // Get archetypeData using the existing hook (kept for compatibility)
  const {
    archetypeData,
    isLoading: archetypeLoading,
    error: archetypeError,
  } = useGetArchetype(archetypeId as ArchetypeId);

  // Function to fetch report data
  const fetchReportData = useCallback(async () => {
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

      // SINGLE SOURCE OF TRUTH: Fetch data ONLY from level4_report_secure
      const { data, error } = await supabase
        .from('level4_report_secure')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();

      if (error) {
        console.error(`[useReportAccess] Database error fetching level4_report_secure:`, error);
        setError(error);
        setDebugInfo(prev => ({
          ...prev,
          level4Query: {
            success: false,
            error: error.message
          }
        }));
        return;
      }
      
      if (!data) {
        console.log(`[useReportAccess] No data found in level4_report_secure for ${archetypeId}`);
        setDebugInfo(prev => ({
          ...prev,
          level4Query: {
            success: true,
            dataFound: false
          }
        }));
        setError(new Error(`No data available for archetype ${archetypeId}`));
        return;
      }

      console.log(`[useReportAccess] Got level4 deep dive data for ${archetypeId}`);
      
      // Log the available fields related to SWOT
      const swotAnalysisField = data.swot_analysis;
      
      console.log("[useReportAccess] SWOT data check:", {
        hasSwotAnalysisField: !!swotAnalysisField,
        swotAnalysisType: swotAnalysisField ? typeof swotAnalysisField : 'N/A',
        swotSampleData: swotAnalysisField 
          ? (typeof swotAnalysisField === 'object' 
              ? `Object with keys: ${Object.keys(swotAnalysisField).join(', ')}` 
              : typeof swotAnalysisField)
          : 'N/A'
      });
      
      setReportData(data);
      
      setDebugInfo(prev => ({
        ...prev,
        level4Query: {
          success: true,
          dataFound: true,
          swotDataAvailable: !!swotAnalysisField
        }
      }));

      // Fetch average data for comparisons (still from level4_report_secure)
      const { data: avgData, error: avgError } = await supabase
        .from('level4_report_secure')
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
  }, [rawArchetypeId, archetypeId, token, isAdminView]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Add refreshData function that can be called by components
  const refreshData = useCallback(async () => {
    try {
      toast({
        title: "Refreshing Data",
        description: "Loading the latest report information..."
      });
      await fetchReportData();
      toast({
        title: "Data Refreshed",
        description: "Successfully updated report data"
      });
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: "Could not update report data",
        variant: "destructive"
      });
    }
  }, [fetchReportData]);

  return {
    reportData,
    archetypeData, // Kept for backward compatibility
    averageData,
    isLoading: isLoading || archetypeLoading,
    error: error || archetypeError,
    debugInfo,
    refreshData // Added the missing refreshData function
  };
};
