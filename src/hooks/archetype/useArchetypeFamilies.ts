
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeFamily } from '@/types/archetype';
import { getFamilyColorHex } from '@/data/colors';

export const useArchetypeFamilies = () => {
  const [allFamilies, setAllFamilies] = useState<ArchetypeFamily[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all families on mount
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        setLoading(true);
        console.log("Fetching archetype families from Supabase...");
        
        const { data, error } = await supabase.from('Core_Archetype_Families').select('*');
        
        if (error) {
          console.error('Error fetching family data:', error);
          throw error;
        }
        
        console.log("Retrieved families data:", data);
        
        // Transform data to match our interface and ensure proper type conversion
        const families = data.map(item => ({
          id: item.id as 'a' | 'b' | 'c',
          name: item.name || '',
          description: item.short_description || '', // Map from short_description to description
          // Ensure commonTraits is always a string array
          commonTraits: Array.isArray(item.common_traits) 
            ? item.common_traits.map(trait => String(trait)) 
            : [],
          hexColor: item.hex_color || getFamilyColorHex(item.id as 'a' | 'b' | 'c') // Use database value or fallback
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
