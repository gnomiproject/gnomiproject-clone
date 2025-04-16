
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeFamily } from '@/types/archetype';

export const useArchetypeFamilies = () => {
  const [allFamilies, setAllFamilies] = useState<ArchetypeFamily[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all families on mount
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.from('archetype_families').select('*');
        
        if (error) throw error;
        
        // Transform data to match our interface
        const families = data.map(item => ({
          id: item.id as 'a' | 'b' | 'c',
          name: item.name,
          description: item.description,
          commonTraits: item.common_traits as string[],
          hexColor: item.hex_color // Add the new hex_color field
        }));
        
        setAllFamilies(families);
      } catch (error) {
        console.error('Error fetching family data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFamilies();
  }, []);

  // Get family by ID
  const getFamilyById = (id: 'a' | 'b' | 'c') => {
    return allFamilies.find(family => family.id === id);
  };

  return {
    allFamilies,
    getFamilyById,
    isLoading: loading
  };
};
