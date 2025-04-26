
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArchetypeId } from '@/types/archetype';
import DetailedArchetypeReport from '@/components/insights/DetailedArchetypeReport';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { toast } from 'sonner';

const ArchetypePage = () => {
  const { archetypeId } = useParams<{ archetypeId: string }>();
  const navigate = useNavigate();
  const { archetypeData, isLoading, error } = useGetArchetype(archetypeId as ArchetypeId);
  
  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };
  
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load archetype data", {
        description: "We couldn't connect to the database. Using fallback data."
      });
    }
  }, [error]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading archetype information...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!archetypeData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="p-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold mb-4">Archetype Not Found</h2>
              <p className="text-gray-600 mb-6">The archetype you're looking for doesn't exist or isn't available.</p>
              <Button onClick={() => navigate('/')}>Return to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-600" 
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8" style={{ color: archetypeData.hexColor }}>
          {archetypeData.name}
        </h1>
        
        <DetailedArchetypeReport 
          archetypeId={archetypeId as ArchetypeId} 
          onRetakeAssessment={handleRetakeAssessment} 
        />
      </div>
    </div>
  );
};

export default ArchetypePage;
