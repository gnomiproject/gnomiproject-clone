
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Archetype, ArchetypeId, ArchetypeColor } from '@/types/archetype';

export const useArchetypeBasics = () => {
  const [allArchetypes, setAllArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all archetypes on mount
  useEffect(() => {
    const fetchArchetypes = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.from('archetypes').select('*');
        
        if (error) throw error;
        
        // Transform data to match our interface
        const archetypes = data.map(item => ({
          id: item.id as ArchetypeId,
          name: item.name,
          familyId: item.family_id as 'a' | 'b' | 'c',
          shortDescription: item.short_description,
          longDescription: item.long_description, 
          characteristics: item.characteristics as string[],
          strategicPriorities: item.strategic_priorities as {
            primaryFocus: string;
            secondaryPriorities: string[];
            keyOpportunities: string[];
          },
          riskScore: item.risk_score,
          riskVariance: item.risk_variance,
          primaryRiskDriver: item.primary_risk_driver,
          color: item.color as ArchetypeColor
        }));
        
        setAllArchetypes(archetypes);
      } catch (error) {
        console.error('Error fetching archetype data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArchetypes();
  }, []);

  // Get archetype by ID
  const getArchetypeById = (id: ArchetypeId) => {
    const [archetype, setArchetype] = useState<Archetype | undefined>(undefined);

    useEffect(() => {
      const fetchArchetype = async () => {
        const { data, error } = await supabase
          .from('archetypes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching archetype:', error);
          return;
        }
        
        // Transform data to match our interface
        const transformedData: Archetype = {
          id: data.id as ArchetypeId,
          name: data.name,
          familyId: data.family_id as 'a' | 'b' | 'c',
          shortDescription: data.short_description,
          longDescription: data.long_description,
          characteristics: data.characteristics as string[],
          strategicPriorities: data.strategic_priorities as {
            primaryFocus: string;
            secondaryPriorities: string[];
            keyOpportunities: string[];
          },
          riskScore: data.risk_score,
          riskVariance: data.risk_variance,
          primaryRiskDriver: data.primary_risk_driver,
          color: data.color as ArchetypeColor
        };
        
        setArchetype(transformedData);
      };

      fetchArchetype();
    }, [id]);

    return archetype;
  };

  // Get archetypes by family
  const getArchetypesByFamily = (familyId: 'a' | 'b' | 'c') => {
    const [archetypes, setArchetypes] = useState<Archetype[]>([]);

    useEffect(() => {
      const fetchArchetypes = async () => {
        const { data, error } = await supabase
          .from('archetypes')
          .select('*')
          .eq('family_id', familyId);

        if (error) {
          console.error('Error fetching archetypes:', error);
          return;
        }
        
        if (!data?.length) return;
        
        // Transform data to match our interface
        const transformedData = data.map(item => ({
          id: item.id as ArchetypeId,
          name: item.name,
          familyId: item.family_id as 'a' | 'b' | 'c',
          shortDescription: item.short_description,
          longDescription: item.long_description,
          characteristics: item.characteristics as string[],
          strategicPriorities: item.strategic_priorities as {
            primaryFocus: string;
            secondaryPriorities: string[];
            keyOpportunities: string[];
          },
          riskScore: item.risk_score,
          riskVariance: item.risk_variance,
          primaryRiskDriver: item.primary_risk_driver,
          color: item.color as ArchetypeColor
        }));
        
        setArchetypes(transformedData);
      };

      fetchArchetypes();
    }, [familyId]);

    return archetypes;
  };

  return {
    allArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    isLoading: loading
  };
};
