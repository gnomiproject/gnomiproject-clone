
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import SectionTitle from '@/components/shared/SectionTitle';
import ArchetypeOverviewCard from './ArchetypeOverviewCard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { migrateDataToSupabase } from '@/utils/migrationUtil';

const ArchetypesGridSection = () => {
  // Fetch archetypes from Core_Archetype_Overview with better error handling
  const { data: archetypes, isLoading, error, refetch } = useQuery({
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
    staleTime: 60000, // 1 minute
    retry: 2
  });

  // Check for database data and offer migration if needed
  const [isMigrating, setIsMigrating] = React.useState(false);
  
  const handleMigrateData = async () => {
    try {
      setIsMigrating(true);
      const success = await migrateDataToSupabase();
      if (success) {
        toast.success('Data successfully migrated!');
        refetch();
      }
    } catch (error) {
      console.error('Migration error:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  if (error) {
    console.error('Error in archetype query:', error);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Failed to load archetypes. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">Error: {(error as Error).message}</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
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
    <section className="bg-white py-16" id="archetype-section">
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
              <p className="text-gray-500 mb-4">No archetypes found in the database.</p>
              <Button 
                onClick={handleMigrateData} 
                disabled={isMigrating} 
                variant="outline"
              >
                {isMigrating ? "Migrating Data..." : "Migrate Data to Database"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArchetypesGridSection;
