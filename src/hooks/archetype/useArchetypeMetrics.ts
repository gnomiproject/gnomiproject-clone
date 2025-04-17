
import { useState, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { supabase } from "@/integrations/supabase/client";

export const useArchetypeMetrics = () => {
  const [metricsData, setMetricsData] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sdohDataByArchetype, setSdohDataByArchetype] = useState<Record<string, any[]>>({});

  // Fetch all metrics data on component mount
  useEffect(() => {
    const fetchAllMetricsData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('archetype_data_041624bw')
          .select('*');

        if (error) {
          console.error('Error fetching metrics data:', error);
          return;
        }

        // Group data by archetype_ID
        const groupedData = data.reduce((acc: Record<string, any[]>, item) => {
          const archetypeId = item.archetype_ID;
          if (!archetypeId) return acc;
          
          if (!acc[archetypeId]) {
            acc[archetypeId] = [];
          }
          acc[archetypeId].push(item);
          return acc;
        }, {});

        setMetricsData(groupedData);

        // Create a grouped version of SDOH data by archetype
        const sdohData = data.filter(item => item.Category?.includes('SDOH'));
        const groupedSdohData = sdohData.reduce((acc: Record<string, any[]>, item) => {
          const archetypeId = item.archetype_ID;
          if (!archetypeId) return acc;
          
          if (!acc[archetypeId]) {
            acc[archetypeId] = [];
          }
          acc[archetypeId].push(item);
          return acc;
        }, {});

        setSdohDataByArchetype(groupedSdohData);
      } catch (err) {
        console.error('Unexpected error fetching metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMetricsData();
  }, []);

  // Get metrics for archetype
  const getMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const metrics = metricsData[archetypeId] || [];
    
    // Process metrics into a more usable format if needed
    return {
      metrics,
      isLoading
    };
  };

  // Get SDOH metrics specifically for an archetype
  const getSdohMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const sdohMetrics = sdohDataByArchetype[archetypeId] || [];
    
    return {
      sdohMetrics,
      isLoading
    };
  };

  // Get distinctive metrics for archetype (top differentiating metrics)
  const getDistinctiveMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const allMetrics = metricsData[archetypeId] || [];
    
    // Sort by absolute difference to get most distinctive metrics
    const sortedMetrics = [...allMetrics].sort((a, b) => 
      Math.abs(b.Difference || 0) - Math.abs(a.Difference || 0)
    ).slice(0, 10); // Get top 10
    
    return {
      distinctiveMetrics: sortedMetrics,
      isLoading
    };
  };

  // Get metrics grouped by category for archetype
  const getCategorizedMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const allMetrics = metricsData[archetypeId] || [];
    
    // Group by Category
    const categorized = allMetrics.reduce((acc: Record<string, any[]>, item) => {
      const category = item.Category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    
    return {
      categorizedMetrics: categorized,
      isLoading
    };
  };

  // Get traits for archetype
  const getTraitsForArchetype = (archetypeId: ArchetypeId) => {
    const [traits, setTraits] = useState(null);
    
    useEffect(() => {
      const fetchTraits = async () => {
        const { data, error } = await supabase
          .from('distinctive_traits')
          .select('*')
          .eq('archetype_id', archetypeId)
          .single();

        if (error) {
          console.error('Error fetching traits:', error);
          return;
        }
        
        setTraits(data);
      };

      fetchTraits();
    }, [archetypeId]);

    return traits;
  };

  return {
    getMetricsForArchetype,
    getDistinctiveMetricsForArchetype,
    getCategorizedMetricsForArchetype,
    getTraitsForArchetype,
    getSdohMetricsForArchetype,
    isLoading
  };
};
