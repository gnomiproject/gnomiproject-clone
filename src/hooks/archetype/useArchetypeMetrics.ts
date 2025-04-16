
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeId } from '@/types/archetype';

export const useArchetypeMetrics = () => {
  // Get metrics for archetype
  const getMetricsForArchetype = (archetypeId: ArchetypeId) => {
    const [metrics, setMetrics] = useState(null);
    
    useEffect(() => {
      const fetchMetrics = async () => {
        const { data, error } = await supabase
          .from('archetype_metrics')
          .select('*')
          .eq('archetype_id', archetypeId)
          .single();

        if (error) {
          console.error('Error fetching metrics:', error);
          return;
        }
        
        setMetrics(data);
      };

      fetchMetrics();
    }, [archetypeId]);

    return metrics;
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
    getTraitsForArchetype
  };
};
