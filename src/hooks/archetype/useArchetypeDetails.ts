
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeId, ArchetypeColor } from '@/types/archetype';
import { getArchetypeColor, getArchetypeHexColor } from '@/components/home/utils/dna/colors';

interface SwotData {
  archetype_id: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export const useArchetypeDetails = () => {
  const [allDetailedArchetypes, setAllDetailedArchetypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedArchetypes = async () => {
      try {
        setLoading(true);
        
        const { data: archetypes, error: archetypesError } = await supabase
          .from('Core_Archetype_Overview')
          .select('*');
        
        if (archetypesError) throw archetypesError;

        const { data: reports, error: reportsError } = await supabase
          .from('Analysis_Archetype_Full_Reports')
          .select('*');
        
        if (reportsError) throw reportsError;

        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('*');
        
        if (swotError) throw swotError;

        const detailedArchetypes = archetypes.map(archetype => {
          const report = reports?.find(r => r.archetype_id === archetype.id);
          const swot = swotData?.find(s => s.archetype_id === archetype.id) as SwotData | undefined;
          
          let keyFindings: string[] = [];
          if (report?.key_findings) {
            try {
              if (Array.isArray(report.key_findings)) {
                keyFindings = report.key_findings.map(String);
              } else if (typeof report.key_findings === 'string') {
                keyFindings = JSON.parse(report.key_findings);
              }
            } catch (e) {
              console.warn(`Failed to parse key_findings for ${archetype.id}:`, e);
            }
          }
          
          return {
            id: archetype.id as ArchetypeId,
            familyId: archetype.family_id as 'a' | 'b' | 'c',
            name: archetype.name,
            familyName: '', // Will be populated by family data join
            color: getArchetypeColor(archetype.id as ArchetypeId) as ArchetypeColor,
            hexColor: archetype.hex_color || getArchetypeHexColor(archetype.id as ArchetypeId),
            fullDescription: archetype.long_description,
            keyFindings,
            swot: swot ? {
              strengths: Array.isArray(swot.strengths) ? swot.strengths.map(String) : [],
              weaknesses: Array.isArray(swot.weaknesses) ? swot.weaknesses.map(String) : [],
              opportunities: Array.isArray(swot.opportunities) ? swot.opportunities.map(String) : [],
              threats: Array.isArray(swot.threats) ? swot.threats.map(String) : []
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
