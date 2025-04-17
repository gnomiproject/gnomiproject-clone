
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArchetypes } from '@/hooks/useArchetypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArchetypeId } from '@/types/archetype';
import { FileText, BarChart4 } from 'lucide-react';

const DirectReportLinks = () => {
  const { getAllArchetypes } = useArchetypes();
  const [archetypes, setArchetypes] = useState<any[]>([]);

  useEffect(() => {
    // Check if getAllArchetypes is an array and use it directly
    if (getAllArchetypes && Array.isArray(getAllArchetypes)) {
      setArchetypes(getAllArchetypes);
    }
  }, [getAllArchetypes]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Direct Report Access</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-gray-600">
          Access deep dive reports directly without going through the submission process.
          Choose a report format below for any archetype:
        </p>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Standard Report Links */}
          <div>
            <h3 className="text-lg font-medium flex items-center mb-4">
              <FileText className="mr-2 h-5 w-5 text-gray-600" />
              Standard Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {archetypes.length > 0 ? (
                archetypes.map((archetype) => (
                  <Button 
                    key={`standard-${archetype.id}`}
                    variant="outline"
                    asChild
                    className={`bg-archetype-${archetype.id}/10 hover:bg-archetype-${archetype.id}/20 border-archetype-${archetype.id}`}
                  >
                    <Link to={`/direct-report/${archetype.id}`}>
                      {archetype.name}
                    </Link>
                  </Button>
                ))
              ) : (
                <p>Loading archetypes...</p>
              )}
            </div>
          </div>
          
          {/* Enhanced Deep Dive Report Links */}
          <div>
            <h3 className="text-lg font-medium flex items-center mb-4">
              <BarChart4 className="mr-2 h-5 w-5 text-gray-600" />
              Enhanced Deep Dive Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {archetypes.length > 0 ? (
                archetypes.map((archetype) => (
                  <Button 
                    key={`enhanced-${archetype.id}`}
                    variant="outline"
                    asChild
                    className={`bg-archetype-${archetype.id}/10 hover:bg-archetype-${archetype.id}/20 border-archetype-${archetype.id}`}
                  >
                    <Link to={`/archetype-report/${archetype.id}`}>
                      {archetype.name}
                    </Link>
                  </Button>
                ))
              ) : (
                <p>Loading archetypes...</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectReportLinks;
