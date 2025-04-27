
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
        // Explicit table selection based on report type - no fallbacks to ensure we get the right data format
        const tableName = reportType === 'insights' ? 'level3_report_data' : 'level4_deepdive_report_data';
        
        console.log(`useAdminReportData: Fetching data from ${tableName} for archetype ${archetypeId}`);
        
        const { data: fetchedData, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();

        if (fetchError) {
          console.error(`useAdminReportData: Error fetching data from ${tableName}:`, fetchError);
          throw fetchError;
        }
        
        if (fetchedData) {
          console.log(`useAdminReportData: Successfully fetched data from ${tableName}:`, Object.keys(fetchedData));
          
          // Process the data based on report type
          const processedData = processRawData(fetchedData, reportType);
          
          console.log(`useAdminReportData: Processed ${reportType} data:`, 
            { 
              keys: Object.keys(processedData),
              hasStrengths: Array.isArray(processedData.strengths),
              strengthsLength: Array.isArray(processedData.strengths) ? processedData.strengths.length : 'not an array',
              hasRecommendations: Array.isArray(processedData.strategic_recommendations),
              recommendationsLength: Array.isArray(processedData.strategic_recommendations) ? processedData.strategic_recommendations.length : 'not an array'
            }
          );
          
          setData(processedData);
          setDataSource(tableName);
        } else {
          console.log(`useAdminReportData: No data found in ${tableName} for archetype ${archetypeId}`);
          
          // Create minimal synthetic data with appropriate format for each report type
          const fallbackData = createFallbackData(archetypeId, reportType);
          setData(fallbackData);
          setDataSource('synthetic fallback');
        }
      } catch (err: any) {
        console.error('useAdminReportData: Error in data fetch:', err);
        setError(err instanceof Error ? err : new Error(err.message || 'Failed to load report data'));
        
        // Create appropriate fallback data even on error
        const fallbackData = createFallbackData(archetypeId, reportType);
        setData(fallbackData);
        setDataSource('error fallback');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [archetypeId, reportType, skipCache]);
  
  // Process raw data from database
  const processRawData = (rawData: any, type: 'insights' | 'deepdive') => {
    if (!rawData) return null;
    
    // Make a clean copy to avoid mutations
    const processedData = { ...rawData };
    
    // Process SWOT fields - ensure they are arrays
    const ensureArray = (field: any): any[] => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    };
    
    // Handle SWOT analysis fields
    if (rawData.swot_analysis) {
      try {
        // For deep dive reports with nested SWOT
        const swot = typeof rawData.swot_analysis === 'string' 
          ? JSON.parse(rawData.swot_analysis) 
          : rawData.swot_analysis;
          
        processedData.strengths = ensureArray(swot.strengths);
        processedData.weaknesses = ensureArray(swot.weaknesses);
        processedData.opportunities = ensureArray(swot.opportunities);
        processedData.threats = ensureArray(swot.threats);
      } catch (e) {
        console.warn('useAdminReportData: Error parsing SWOT analysis:', e);
        processedData.strengths = [];
        processedData.weaknesses = [];
        processedData.opportunities = [];
        processedData.threats = [];
      }
    } else {
      // For reports with direct SWOT fields
      processedData.strengths = ensureArray(rawData.strengths);
      processedData.weaknesses = ensureArray(rawData.weaknesses);
      processedData.opportunities = ensureArray(rawData.opportunities);
      processedData.threats = ensureArray(rawData.threats);
    }
    
    // Process strategic recommendations
    try {
      if (rawData.strategic_recommendations) {
        processedData.strategic_recommendations = typeof rawData.strategic_recommendations === 'string'
          ? JSON.parse(rawData.strategic_recommendations)
          : Array.isArray(rawData.strategic_recommendations) 
            ? rawData.strategic_recommendations 
            : [];
      } else {
        processedData.strategic_recommendations = [];
      }
      
      // Ensure recommendations have the right structure
      if (Array.isArray(processedData.strategic_recommendations)) {
        processedData.strategic_recommendations = processedData.strategic_recommendations.map((rec: any, index: number) => ({
          recommendation_number: rec.recommendation_number || index + 1,
          title: rec.title || `Recommendation ${index + 1}`,
          description: rec.description || 'No description available.'
        }));
      }
    } catch (e) {
      console.warn('useAdminReportData: Error processing strategic recommendations:', e);
      processedData.strategic_recommendations = [];
    }
    
    // Add consistent fields
    processedData.id = processedData.archetype_id || archetypeId;
    processedData.name = processedData.archetype_name || `Archetype ${archetypeId.toUpperCase()}`;
    processedData.reportType = type === 'insights' ? 'Insights' : 'Deep Dive';
    
    return processedData;
  };
  
  // Create appropriate fallback data
  const createFallbackData = (id: string, type: 'insights' | 'deepdive') => {
    const archetypeId = id.toUpperCase();
    return {
      archetype_id: id,
      id: id,
      archetype_name: `Archetype ${archetypeId}`,
      name: `Archetype ${archetypeId}`,
      short_description: `This is fallback data for Archetype ${archetypeId} ${type} report.`,
      reportType: type === 'insights' ? 'Insights' : 'Deep Dive',
      strengths: ["Fallback strength 1", "Fallback strength 2"],
      weaknesses: ["Fallback weakness 1", "Fallback weakness 2"],
      opportunities: ["Fallback opportunity 1", "Fallback opportunity 2"],
      threats: ["Fallback threat 1", "Fallback threat 2"],
      strategic_recommendations: [
        { recommendation_number: 1, title: "Fallback recommendation", description: "This is a fallback recommendation" }
      ],
      // Add some metrics that might be needed for both report types
      "Demo_Average Age": 40,
      "Demo_Average Family Size": 3.0,
      "Risk_Average Risk Score": 1.0,
      "Cost_Medical & RX Paid Amount PMPY": 5000
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
