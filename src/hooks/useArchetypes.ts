import { useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Archetype, 
  ArchetypeId, 
  ArchetypeFamily, 
  ArchetypeDetailedData 
} from '../types/archetype';
import { useState, useEffect } from 'react';

export const useArchetypes = () => {
  const fetchArchetypes = async (): Promise<Archetype[]> => {
    const { data, error } = await supabase
      .from('archetypes')
      .select('*');
    
    if (error) {
      console.error('Error fetching archetypes:', error);
      return [];
    }
    return data as Archetype[];
  };

  const fetchArchetypeFamilies = async (): Promise<ArchetypeFamily[]> => {
    const { data, error } = await supabase
      .from('archetype_families')
      .select('*');
    
    if (error) {
      console.error('Error fetching archetype families:', error);
      return [];
    }
    return data as ArchetypeFamily[];
  };

  const fetchDetailedArchetypes = async (): Promise<ArchetypeDetailedData[]> => {
    const { data, error } = await supabase
      .from('archetypes_detailed')
      .select('*');
    
    if (error) {
      console.error('Error fetching detailed archetypes:', error);
      return [];
    }
    return data as ArchetypeDetailedData[];
  };

  const getAllArchetypes = useMemo(() => {
    const [archetypes, setArchetypes] = useState<Archetype[]>([]);
    
    useEffect(() => {
      fetchArchetypes().then(setArchetypes);
    }, []);

    return archetypes;
  }, []);

  const getAllFamilies = useMemo(() => {
    const [families, setFamilies] = useState<ArchetypeFamily[]>([]);
    
    useEffect(() => {
      fetchArchetypeFamilies().then(setFamilies);
    }, []);

    return families;
  }, []);

  const getArchetypeEnhanced = (archetypeId: ArchetypeId) => {
    const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
    
    useEffect(() => {
      const fetchDetailedArchetype = async () => {
        const { data, error } = await supabase
          .from('archetypes_detailed')
          .select('*')
          .eq('id', archetypeId)
          .single();
        
        if (error) {
          console.error('Error fetching detailed archetype:', error);
          return;
        }
        setArchetypeData(data);
      };

      fetchDetailedArchetype();
    }, [archetypeId]);

    return archetypeData;
  };

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
        setArchetype(data as Archetype);
      };

      fetchArchetype();
    }, [id]);

    return archetype;
  };

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
        setArchetypes(data as Archetype[]);
      };

      fetchArchetypes();
    }, [familyId]);

    return archetypes;
  };

  const getFamilyById = (id: 'a' | 'b' | 'c'): ArchetypeFamily | undefined => {
    const [family, setFamily] = useState<ArchetypeFamily | undefined>(undefined);

    useEffect(() => {
      const fetchFamily = async () => {
        const { data, error } = await supabase
          .from('archetype_families')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching family:', error);
          return;
        }
        setFamily(data as ArchetypeFamily);
      };

      fetchFamily();
    }, [id]);

    return family;
  };

  const getMetricsForArchetype = (archetypeId: ArchetypeId) => {
    return undefined;
  };

  const getTraitsForArchetype = (archetypeId: ArchetypeId) => {
    return undefined;
  };

  const getArchetypeSummary = (archetypeId: ArchetypeId) => {
    return undefined;
  };

  const getArchetypeStandard = (archetypeId: ArchetypeId) => {
    return undefined;
  };

  const getAllArchetypeSummaries = useMemo(() => {
    return [];
  }, []);

  const getArchetypeSummariesByFamily = (familyId: 'a' | 'b' | 'c') => {
    return [];
  };

  return {
    getAllArchetypes,
    getArchetypeById,
    getArchetypesByFamily,
    getAllFamilies,
    getFamilyById,
    getMetricsForArchetype,
    getTraitsForArchetype,
    getDetailedArchetype: getArchetypeEnhanced,
    getAllDetailedArchetypes: useMemo(() => [], []),
    getDetailedArchetypesByFamily: (familyId: 'a' | 'b' | 'c') => [],
    getArchetypeSummary,
    getArchetypeStandard,
    getArchetypeEnhanced,
    getAllArchetypeSummaries,
    getArchetypeSummariesByFamily
  };
};
