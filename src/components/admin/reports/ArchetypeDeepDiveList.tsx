
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Archetype {
  id: string;
  name: string;
  family_id: string;
}

export const ArchetypeDeepDiveList = () => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchArchetypes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Core_Archetype_Overview')
          .select('id, name, family_id');
          
        if (error) throw error;
        setArchetypes(data || []);
      } catch (err) {
        console.error("Failed to fetch archetypes:", err);
        toast.error("Failed to load archetypes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArchetypes();
  }, []);
  
  const openDeepDiveReport = (archetypeId: string) => {
    window.open(`/report/${archetypeId}/admin-view`, '_blank');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">Loading archetypes...</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {archetypes.map(archetype => (
        <Card key={archetype.id} className="p-4">
          <h3 className="font-medium mb-2">{archetype.name}</h3>
          <Button 
            onClick={() => openDeepDiveReport(archetype.id)}
            variant="outline"
            className="w-full gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Report
          </Button>
        </Card>
      ))}
    </div>
  );
};
