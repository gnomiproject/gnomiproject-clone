
import { useState } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { supabase } from '@/integrations/supabase/client';

export const useArchetypeMetrics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to get metrics for an archetype
  const getMetricsForArchetype = async (archetypeId: ArchetypeId) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get metrics for the archetype
      const { data, error } = await supabase
        .from('Core_Archetypes_Metrics')
        .select('*')
        .eq('id', archetypeId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get distinctive metrics for an archetype
  const getDistinctiveMetricsForArchetype = async (archetypeId: ArchetypeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Analysis_Archetype_Distinctive_Metrics')
        .select('*')
        .eq('archetype_id', archetypeId);

      if (error) throw error;
      
      return data.map((metric) => ({
        metric: metric.metric,
        category: metric.category,
        archetypeValue: metric.archetype_value,
        archetypeAverage: metric.archetype_average,
        difference: metric.difference,
        significance: metric.significance
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get categorized metrics for an archetype (grouped by category)
  const getCategorizedMetricsForArchetype = async (archetypeId: ArchetypeId) => {
    const metrics = await getMetricsForArchetype(archetypeId);
    if (!metrics) return {};

    // Group metrics by category (based on prefix like Cost_, Demo_, etc.)
    const categorized: Record<string, any> = {};
    Object.entries(metrics).forEach(([key, value]) => {
      // Skip the id and Archetype fields
      if (key === 'id' || key === 'Archetype' || key === 'Data Date') return;

      // Extract category from key (e.g., "Cost_Medical Paid Amount PMPM" -> "Cost")
      const category = key.split('_')[0];
      
      if (!categorized[category]) {
        categorized[category] = {};
      }
      
      // Store the metric without the category prefix
      const metricName = key.substring(key.indexOf('_') + 1);
      categorized[category][metricName] = value;
    });

    return categorized;
  };

  // Helper function to get traits for an archetype
  const getTraitsForArchetype = async (archetypeId: ArchetypeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Core_Archetype_Overview')
        .select('key_characteristics')
        .eq('id', archetypeId)
        .single();

      if (error) throw error;
      
      // Handle different formats of key_characteristics
      if (Array.isArray(data.key_characteristics)) {
        return data.key_characteristics.map(String);
      } else if (typeof data.key_characteristics === 'string') {
        return data.key_characteristics.split('\n').filter(item => item.trim() !== '');
      }
      
      return [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getMetricsForArchetype,
    getDistinctiveMetricsForArchetype,
    getCategorizedMetricsForArchetype,
    getTraitsForArchetype,
    isLoading,
    error
  };
};
