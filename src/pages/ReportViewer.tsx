
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { ArchetypeId } from '@/types/archetype';
import { Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import DetailedArchetypeReport from '@/components/insights/DetailedArchetypeReport';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import AssessmentResultsHeader from '@/components/insights/AssessmentResultsHeader';

const ReportViewer = () => {
  const { archetypeId, token } = useParams<{ archetypeId: ArchetypeId, token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const { archetypeData, familyData, isLoading } = useGetArchetype(archetypeId as ArchetypeId);
  
  // Validate the access token
  useEffect(() => {
    if (!archetypeId || !token) {
      setIsChecking(false);
      setIsValidToken(false);
      return;
    }
    
    // Check if the token is valid
    const storedTokens = JSON.parse(localStorage.getItem('admin_report_tokens') || '{}');
    const validToken = storedTokens[archetypeId] === token;
    
    // Token is valid if it exists and hasn't expired
    setIsValidToken(validToken);
    setIsChecking(false);
    
    if (!validToken) {
      toast.error("Invalid or expired access token");
    }
  }, [archetypeId, token]);

  const handleBack = () => {
    navigate('/admin');
  };
  
  const handleRetakeAssessment = () => {
    navigate('/assessment');
  };

  if (isChecking) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying access...</p>
      </div>
    );
  }
  
  if (!isValidToken || !archetypeId) {
    return (
      <div className="container mx-auto py-16">
        <Card className="max-w-lg mx-auto p-6 text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this report. Please return to the admin panel and generate a valid access link.
            </p>
            <Button onClick={handleBack}>Return to Admin Panel</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>
      </div>
      
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : archetypeData && familyData ? (
          <div>
            <AssessmentResultsHeader 
              archetypeData={archetypeData}
              familyData={familyData}
              onRetakeAssessment={handleRetakeAssessment}
            />
            <DetailedArchetypeReport 
              archetypeId={archetypeId as ArchetypeId}
              onRetakeAssessment={handleRetakeAssessment} 
            />
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-lg">Report data not found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportViewer;
