
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArchetypes } from '@/hooks/useArchetypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DirectReportLinks = () => {
  const { getAllArchetypes } = useArchetypes();
  const [archetypes, setArchetypes] = useState<any[]>([]);

  useEffect(() => {
    // Get all archetypes 
    const allArchetypes = getAllArchetypes();
    setArchetypes(allArchetypes);
  }, [getAllArchetypes]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Direct Report Access</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">
          Access deep dive reports directly without going through the submission process.
          Click on any archetype below to view its detailed report:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {archetypes.map((archetype) => (
            <Button 
              key={archetype.id}
              variant="outline"
              asChild
              className={`bg-archetype-${archetype.id}/10 hover:bg-archetype-${archetype.id}/20 border-archetype-${archetype.id}`}
            >
              <Link to={`/direct-report/${archetype.id}`}>
                {archetype.name}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectReportLinks;
