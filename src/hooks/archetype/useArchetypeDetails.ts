import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeId, ArchetypeColor } from '@/types/archetype';
import { getArchetypeColor, getArchetypeHexColor } from '@/components/home/utils/dna/colors';

export const useArchetypeDetails = () => {
  const [allDetailedArchetypes, setAllDetailedArchetypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all detailed archetype data on mount
  useEffect(() => {
    const fetchDetailedArchetypes = async () => {
      try {
        setLoading(true);
        
        // Get base archetype data from Core_Archetype_Overview
        const { data: archetypes, error: archetypesError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*');
        
        if (archetypesError) throw archetypesError;

        // Get detailed reports data from Analysis_Archetype_Full_Reports
        const { data: reports, error: reportsError } = await supabase
          .from('Analysis_Archetype_Full_Reports')
          .select('*');
        
        if (reportsError) throw reportsError;

        // Get SWOT analysis data from Analysis_Archetype_SWOT
        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('*');
        
        if (swotError) throw swotError;

        // Transform the data to match our interface
        const detailedArchetypes = archetypes.map(archetype => {
          const report = reports?.find(r => r.archetype_id === archetype.id);
          const swot = swotData?.find(s => s.archetype_id === archetype.id);
          
          return {
            id: archetype.id as ArchetypeId,
            familyId: archetype.family_id as 'a' | 'b' | 'c',
            name: archetype.name,
            familyName: '', // Will be populated by family data join
            color: getArchetypeColor(archetype.id as ArchetypeId) as ArchetypeColor,
            hexColor: archetype.hex_color || getArchetypeHexColor(archetype.id as ArchetypeId),
            fullDescription: archetype.long_description,
            keyFindings: report?.key_findings || [],
            swot: swot ? {
              strengths: swot.strengths || [],
              weaknesses: swot.weaknesses || [],
              opportunities: swot.opportunities || [],
              threats: swot.threats || []
            } : null
          };
        });
        
        setAllDetailedArchetypes(detailedArchetypes);
      } catch (error) {
        console.error('Error fetching detailed archetype data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailedArchetypes();
  }, []);

  // Get detailed archetype by ID
  const getArchetypeDetailedById = (archetypeId: ArchetypeId) => {
    // Return the archetype data directly from allDetailedArchetypes
    return allDetailedArchetypes.find(archetype => archetype.id === archetypeId) || null;
  };

  return {
    allDetailedArchetypes,
    isLoading: loading,
    getArchetypeDetailedById,
    // Keep other methods for compatibility
    getArchetypeSummary: () => null,
    getArchetypeStandard: () => null,
    getDetailedArchetypesByFamily: () => [],
    getArchetypeSummariesByFamily: () => [],
    allArchetypeSummaries: allDetailedArchetypes
  };
};
