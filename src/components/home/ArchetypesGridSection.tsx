
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import SectionTitle from '@/components/shared/SectionTitle';
import ArchetypeOverviewCard from './ArchetypeOverviewCard';
import { toast } from 'sonner';

const ArchetypesGridSection = () => {
  // Fetch archetypes from Core_Archetype_Overview with better error handling
  const { data: archetypes, isLoading, error } = useQuery({
    queryKey: ['archetypes-overview'],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch archetypes from Supabase...");
        
        const { data, error } = await supabase
          .from('Core_Archetype_Overview')
          .select('*');
          
        if (error) {
          console.error('Error fetching archetypes:', error);
          toast.error(`Failed to load archetypes: ${error.message}`);
          throw error;
        }
        
        console.log('Fetched archetypes:', data);
        
        if (!data || data.length === 0) {
          console.warn('No archetypes found in the database');
        }
        
        return data || [];
      } catch (err) {
        console.error('Exception in archetype query:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
    retry: 2
  });

  if (error) {
    console.error('Error in archetype query:', error);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Failed to load archetypes. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">Error: {(error as Error).message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <SectionTitle
          title="Meet the Nine Employer Healthcare Archetypes"
          subtitle="Dive deeper into each archetype to uncover specific strategies, strengths, and areas for improvement."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="h-[200px]">
              <Skeleton className="h-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto">
        <SectionTitle
          title="Meet the Nine Employer Healthcare Archetypes"
          subtitle="Dive deeper into each archetype to uncover specific strategies, strengths, and areas for improvement."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {archetypes && archetypes.length > 0 ? (
            archetypes.map((archetype) => (
              <ArchetypeOverviewCard
                key={archetype.id}
                id={archetype.id}
                name={archetype.name}
                familyId={archetype.family_id}
                shortDescription={archetype.short_description}
                hexColor={archetype.hex_color}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No archetypes found. Please check the database or use the "Migrate Data" button at the top of the page.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArchetypesGridSection;
