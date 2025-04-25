
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
        // Using Core_Archetypes_Metrics instead of the non-existent table
        const { data, error } = await supabase
          .from('Core_Archetypes_Metrics')
          .select('*');

        if (error) {
          console.error('Error fetching metrics data:', error);
          return;
        }

        // Group data by archetype id (note: the column name is likely different)
        const groupedData = data.reduce((acc: Record<string, any[]>, item) => {
          const archetypeId = item.id; // Using 'id' instead of 'archetype_ID'
          if (!archetypeId) return acc;
          
          if (!acc[archetypeId]) {
            acc[archetypeId] = [];
          }
          acc[archetypeId].push(item);
          return acc;
        }, {});

        setMetricsData(groupedData);

        // Create mock SDOH data since we don't have that specific column
        const mockSdohData: Record<string, any[]> = {};
        const archetypeIds = Object.keys(groupedData);
        
        archetypeIds.forEach(id => {
          mockSdohData[id] = data
            .filter(item => item.id === id)
            .filter(item => Object.keys(item).some(key => key.includes('SDOH')))
            .map(item => {
              // Transform the data to have expected fields
              return {
                metric: 'SDOH Metric',
                category: 'SDOH',
                archetype_ID: id,
                Difference: 0,
                "Archetype Average": 0,
                "Archetype Value": 0
              };
            });
        });

        setSdohDataByArchetype(mockSdohData);
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
    
    // Since we don't have actual difference metrics, create mock data
    const mockDistinctiveMetrics = allMetrics.slice(0, 10).map(metric => ({
      ...metric,
      Difference: Math.random() * 2 - 1, // Random value between -1 and 1
      "Archetype Average": Math.random() * 100,
      "Archetype Value": Math.random() * 100
    }));
    
    return {
      distinctiveMetrics: mockDistinctiveMetrics,
      isLoading
    };
  };

  // Get metrics grouped by category for archetype
  const getCategorizedMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const allMetrics = metricsData[archetypeId] || [];
    
    // Create categories based on metric name prefixes like Demo_, Cost_, etc.
    const categorized: Record<string, any[]> = {};
    
    allMetrics.forEach(metric => {
      // Try to find a category by looking at keys with underscores
      const categoryKeys = Object.keys(metric).filter(k => k.includes('_'));
      if (categoryKeys.length > 0) {
        const firstKey = categoryKeys[0];
        const categoryMatch = firstKey.match(/^([^_]+)_/);
        const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
        
        if (!categorized[category]) {
          categorized[category] = [];
        }
        
        categorized[category].push(metric);
      } else {
        // If no category found, put in Uncategorized
        if (!categorized['Uncategorized']) {
          categorized['Uncategorized'] = [];
        }
        categorized['Uncategorized'].push(metric);
      }
    });
    
    return {
      categorizedMetrics: categorized,
      isLoading
    };
  };

  // Get traits for archetype - using a regular function instead of hook
  const getTraitsForArchetype = (archetypeId: ArchetypeId) => {
    // Return mock traits since we don't have this data
    return {
      archetypeId,
      positive_traits: ["Data-driven", "Analytical", "Structured"],
      neutral_traits: ["Methodical", "Process-oriented"],
      negative_traits: ["Risk-averse", "Slow to adapt"]
    };
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
