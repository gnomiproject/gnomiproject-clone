
import { useState, useEffect } from 'react';
import { useArchetypes } from './useArchetypes';
import { ArchetypeId, ArchetypeDetailedData } from '@/types/archetype';
import { supabase } from "@/integrations/supabase/client";
import { getArchetypeColor, getArchetypeHexColor } from '@/components/home/utils/dna/colors';

export const useGetArchetype = (archetypeId?: ArchetypeId) => {
  const { getFamilyById, allDetailedArchetypes } = useArchetypes();
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArchetypeData = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!archetypeId) {
        setIsLoading(false);
        setError(new Error('No archetype ID provided'));
        return;
      }
      
      try {
        // First, try to get data from allDetailedArchetypes (which might be preloaded)
        const preloadedArchetype = allDetailedArchetypes.find(a => a.id === archetypeId);
        
        if (preloadedArchetype) {
          setArchetypeData(preloadedArchetype);
          setIsLoading(false);
          return;
        }
        
        // If not available, try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('Core_Archetype_Overview')
            .select('*')
            .eq('id', archetypeId)
            .maybeSingle();

          if (error) {
            throw new Error(`Error fetching archetype data: ${error.message}`);
          }

          if (data) {
            // Process key_characteristics
            let keyCharacteristics: string[] = [];
            if (data.key_characteristics) {
              if (Array.isArray(data.key_characteristics)) {
                keyCharacteristics = data.key_characteristics.map(String);
              } else if (typeof data.key_characteristics === 'string') {
                // Split by newline if it's a string
                keyCharacteristics = data.key_characteristics.split('\n').filter(item => item.trim() !== '');
              }
            }

            const transformedData: ArchetypeDetailedData = {
              id: data.id as ArchetypeId,
              familyId: data.family_id as any,
              name: data.name,
              familyName: '', // Will be populated using getFamilyById
              color: getArchetypeColor(archetypeId),
              hexColor: data.hex_color || getArchetypeHexColor(archetypeId),
              short_description: data.short_description || '',
              long_description: data.long_description || '',
              key_characteristics: keyCharacteristics,
              family_id: data.family_id as any,
              
              // Add compatibility with components using these properties
              summary: {
                description: data.short_description || '',
                keyCharacteristics: keyCharacteristics
              },
              standard: {
                fullDescription: data.long_description || '',
                keyCharacteristics: keyCharacteristics,
                overview: data.short_description || '',
                keyStatistics: {},
                keyInsights: []
              },
              enhanced: {
                swot: {
                  strengths: [],
                  weaknesses: [],
                  opportunities: [],
                  threats: []
                },
                strategicPriorities: [],
                costSavings: []
              }
            };
            
            // Add family name if available
            const family = getFamilyById(data.family_id as any);
            if (family) {
              transformedData.familyName = family.name;
            }
            
            setArchetypeData(transformedData);
          } else {
            // If no data from Supabase, look for a hardcoded fallback
            throw new Error(`Archetype ${archetypeId} not found in database`);
          }
        } catch (supabaseErr) {
          console.error('Supabase fetch error:', supabaseErr);
          
          // Fallback to hardcoded archetype data
          const fallbackArchetype = createFallbackArchetype(archetypeId);
          if (fallbackArchetype) {
            console.log('Using fallback archetype data:', fallbackArchetype);
            setArchetypeData(fallbackArchetype);
          } else {
            throw new Error(`Failed to load archetype ${archetypeId}`);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error in useGetArchetype:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (archetypeId) {
      fetchArchetypeData();
    } else {
      setIsLoading(false);
      setArchetypeData(null);
      setError(new Error('No archetype ID provided'));
    }
  }, [archetypeId, getFamilyById, allDetailedArchetypes]);

  const familyData = archetypeData?.familyId ? getFamilyById(archetypeData.familyId) : undefined;

  return {
    archetypeData,
    familyData,
    isLoading,
    error
  };
};

// Fallback data in case the Supabase fetch fails
const createFallbackArchetype = (archetypeId: ArchetypeId): ArchetypeDetailedData | null => {
  const archetypeMap: Record<string, Partial<ArchetypeDetailedData>> = {
    'a1': {
      id: 'a1',
      name: 'Balanced Cost Performer',
      familyId: 'a',
      familyName: 'Balanced Performers',
      hexColor: '#3B82F6',
      short_description: 'Organizations with moderate healthcare costs and generally balanced utilization patterns.',
      key_characteristics: [
        'Moderate overall healthcare spending',
        'Balanced utilization across service categories',
        'Moderate chronic condition prevalence',
        'Average risk profile',
        'Cost-effective care patterns'
      ]
    },
    'a2': {
      id: 'a2',
      name: 'Young & Healthy Workforce',
      familyId: 'a',
      familyName: 'Balanced Performers',
      hexColor: '#60A5FA',
      short_description: 'Organizations with younger employees and low healthcare utilization.',
      key_characteristics: [
        'Lower than average healthcare costs',
        'Lower utilization across most service categories',
        'Lower chronic disease burden',
        'Younger demographic profile',
        'Higher focus on preventive care'
      ]
    },
    'a3': {
      id: 'a3',
      name: 'Preventive Care Leaders',
      familyId: 'a',
      familyName: 'Balanced Performers',
      hexColor: '#93C5FD',
      short_description: 'Organizations with excellent preventive care utilization and care management.',
      key_characteristics: [
        'Strong preventive care utilization',
        'Effective chronic condition management',
        'Balanced healthcare spending',
        'High engagement with wellness programs',
        'Lower emergency and urgent care use'
      ]
    },
    'b1': {
      id: 'b1',
      name: 'High-Cost, High-Complexity',
      familyId: 'b',
      familyName: 'High-Need Population',
      hexColor: '#EF4444',
      short_description: 'Organizations with high healthcare costs and complex medical needs.',
      key_characteristics: [
        'High overall healthcare spending',
        'Higher utilization of specialty care',
        'High prevalence of chronic conditions',
        'Higher inpatient and emergency services',
        'Substantial high-cost claimants'
      ]
    },
    'b2': {
      id: 'b2',
      name: 'Chronic Condition Managers',
      familyId: 'b',
      familyName: 'High-Need Population',
      hexColor: '#F87171',
      short_description: 'Organizations managing a population with significant chronic disease burden.',
      key_characteristics: [
        'Above average chronic disease prevalence',
        'Focused chronic condition management programs',
        'Moderate to high pharmaceutical costs',
        'Established care management protocols',
        'Higher specialist utilization'
      ]
    },
    'b3': {
      id: 'b3',
      name: 'Aging Workforce Navigators',
      familyId: 'b',
      familyName: 'High-Need Population',
      hexColor: '#FCA5A5',
      short_description: 'Organizations with an older workforce requiring specialized healthcare strategies.',
      key_characteristics: [
        'Higher average age demographic',
        'Increasing healthcare utilization trends',
        'Focus on age-appropriate preventive services',
        'Higher prevalence of age-related conditions',
        'Specialized retirement transition programs'
      ]
    },
    'c1': {
      id: 'c1',
      name: 'High-Tech Adopters',
      familyId: 'c',
      familyName: 'Innovative Care Models',
      hexColor: '#10B981',
      short_description: 'Organizations embracing digital health solutions and innovative care delivery.',
      key_characteristics: [
        'High telehealth adoption rates',
        'Digital health engagement strategies',
        'Data-driven care management',
        'Modern benefits design',
        'Strong technology infrastructure'
      ]
    },
    'c2': {
      id: 'c2',
      name: 'Value-Based Pioneers',
      familyId: 'c',
      familyName: 'Innovative Care Models',
      hexColor: '#34D399',
      short_description: 'Organizations implementing value-based care models with strong outcomes.',
      key_characteristics: [
        'Value-based care arrangements',
        'Alternative payment models',
        'Centers of excellence programs',
        'Quality-focused provider networks',
        'Integrated care coordination'
      ]
    },
    'c3': {
      id: 'c3',
      name: 'Wellness Champions',
      familyId: 'c',
      familyName: 'Innovative Care Models',
      hexColor: '#6EE7B7',
      short_description: 'Organizations with comprehensive wellness programs and preventive health focus.',
      key_characteristics: [
        'Comprehensive wellness initiatives',
        'Higher preventive care utilization',
        'Mental health support programs',
        'Lifestyle medicine approaches',
        'Employee engagement in health programs'
      ]
    }
  };

  const archetypeData = archetypeMap[archetypeId];
  
  if (!archetypeData) {
    return null;
  }
  
  return {
    id: archetypeData.id as ArchetypeId,
    name: archetypeData.name || 'Unknown Archetype',
    familyId: archetypeData.familyId as any,
    familyName: archetypeData.familyName || '',
    color: getArchetypeColor(archetypeId),
    hexColor: archetypeData.hexColor || getArchetypeHexColor(archetypeId),
    short_description: archetypeData.short_description || '',
    long_description: archetypeData.short_description || '',
    key_characteristics: archetypeData.key_characteristics || [],
    family_id: archetypeData.familyId as any,
    
    // Add compatibility with components using these properties
    summary: {
      description: archetypeData.short_description || '',
      keyCharacteristics: archetypeData.key_characteristics || []
    },
    standard: {
      fullDescription: archetypeData.short_description || '',
      keyCharacteristics: archetypeData.key_characteristics || [],
      overview: archetypeData.short_description || '',
      keyStatistics: {},
      keyInsights: []
    },
    enhanced: {
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      },
      strategicPriorities: [],
      costSavings: []
    }
  } as ArchetypeDetailedData;
};
