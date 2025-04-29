import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import SectionTitle from '@/components/shared/SectionTitle';
import ArchetypeOverviewCard from './ArchetypeOverviewCard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { migrateDataToSupabase } from '@/utils/migrationUtil';
import { useArchetypeBasics } from '@/hooks/archetype/useArchetypeBasics';
import { ArchetypeId } from '@/types/archetype';

const ArchetypesGridSection = () => {
  const { archetypes, isLoading, error } = useArchetypeBasics();
  const [isMigrating, setIsMigrating] = React.useState(false);
  const [debugInfo, setDebugInfo] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Log to verify data access after RLS implementation
    console.log('[RLS Test] ArchetypesGridSection data access:', {
      hasArchetypes: Boolean(archetypes?.length),
      archetypeCount: archetypes?.length || 0,
      isLoading,
      hasError: Boolean(error)
    });
    
    if (error) {
      console.error('[RLS Test] ArchetypesGridSection error:', error);
      setDebugInfo(error);
    }
  }, [archetypes, isLoading, error]);
  
  const handleMigrateData = async () => {
    try {
      setIsMigrating(true);
      const success = await migrateDataToSupabase();
      if (success) {
        toast.success('Data successfully migrated!');
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
        {debugInfo && (
          <details className="mt-4 text-left bg-gray-50 p-4 rounded-md">
            <summary className="cursor-pointer text-sm text-gray-700">Debug Information</summary>
            <pre className="text-xs mt-2 overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
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

  // Sort archetypes by family_id and numerical part of id
  const sortedArchetypes = [...(archetypes || [])].sort((a, b) => {
    if (a.family_id !== b.family_id) {
      return a.family_id.localeCompare(b.family_id);
    }
    return a.id.localeCompare(b.id);
  });

  return (
    <section className="bg-white py-16" id="archetype-section">
      <div className="container mx-auto">
        <SectionTitle
          title="Meet the Nine Employer Healthcare Archetypes"
          subtitle="Dive deeper into each archetype to uncover specific strategies, strengths, and areas for improvement."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {sortedArchetypes && sortedArchetypes.length > 0 ? (
            sortedArchetypes.map((archetype) => (
              <ArchetypeOverviewCard
                key={archetype.id}
                id={archetype.id}
                name={archetype.name}
                family_id={archetype.family_id}
                short_description={archetype.short_description}
                hex_color={archetype.hex_color}
                key_characteristics={archetype.key_characteristics}
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
