
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useArchetypes } from '@/hooks/useArchetypes';
import SectionTitle from '@/components/shared/SectionTitle';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import { ArchetypeDetailedData } from '@/types/archetype';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockIcon, UnlockIcon } from 'lucide-react';

const DeepReport = () => {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('token');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    id: string;
    name: string;
    organization: string;
    archetype_id: string;
    assessment_answers: any;
    assessment_result: any;
  } | null>(null);
  const [validToken, setValidToken] = useState(false);
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [archetypeMetrics, setArchetypeMetrics] = useState<any[]>([]);

  // Verify the access token
  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken) {
        toast({
          title: "Access Denied",
          description: "No access token provided.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('report_requests')
          .select('*')
          .eq('access_token', accessToken)
          .lt('expires_at', new Date().toISOString())
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Access Denied",
            description: "Invalid or expired access token.",
            variant: "destructive"
          });
          setValidToken(false);
        } else {
          setReportData(data);
          setValidToken(true);
          
          // Load archetype data
          if (data.archetype_id) {
            const archetype = getArchetypeEnhanced(data.archetype_id);
            if (archetype) {
              setArchetypeData(archetype);
            }
            
            // Fetch archetype metrics from Supabase
            fetchArchetypeMetrics(data.archetype_id);
          }
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        toast({
          title: "Error",
          description: "Failed to verify access token.",
          variant: "destructive"
        });
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [accessToken, toast, getArchetypeEnhanced]);

  // Fetch archetype metrics from Supabase
  const fetchArchetypeMetrics = async (archetypeId: string) => {
    try {
      const { data, error } = await supabase
        .from('archetype_distinctive_metrics')
        .select('*')
        .eq('archetype_ID', archetypeId)
        .order('Difference', { ascending: false })
        .limit(10);

      if (error) throw error;
      setArchetypeMetrics(data || []);
    } catch (error) {
      console.error('Error fetching archetype metrics:', error);
    }
  };

  // If no token or loading, show appropriate UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border p-8">
            <SectionTitle 
              title="Loading Report..." 
              subtitle="Verifying your access..." 
              center 
            />
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If token is invalid, redirect to home
  if (!accessToken || !validToken) {
    return <Navigate to="/" replace />;
  }
  
  // If no report data or archetype data
  if (!reportData || !archetypeData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border p-8">
            <SectionTitle 
              title="Report Unavailable" 
              subtitle="We couldn't find the requested report data." 
              center 
            />
          </div>
        </div>
      </div>
    );
  }

  // Get the family data
  const familyData = archetypeData.familyId ? getFamilyById(archetypeData.familyId) : undefined;
  
  // If we have valid data, show the report
  const color = `archetype-${archetypeData.id}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-${color}`}>
          <div className="p-8">
            {/* Header with secure access indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <UnlockIcon className="text-green-500" size={20} />
              <span className="text-sm text-green-600 font-medium">Secure Access</span>
            </div>
            
            <SectionTitle 
              title={`${archetypeData.name} Detailed Report`}
              subtitle={`Prepared exclusively for ${reportData.organization}`}
              center
            />

            {/* Organization specific details */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-2">
                Requested by: <span className="font-medium">{reportData.name}</span>
              </p>
            </div>

            {/* Assessment answers breakdown */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-center">Your Organization Profile</h3>
              <div className="bg-gray-50 rounded-lg p-6 border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportData.assessment_answers && Object.entries(reportData.assessment_answers).map(([key, value]) => {
                    if (key === 'exactEmployeeCount') {
                      return (
                        <div key={key} className="flex flex-col">
                          <span className="text-sm text-gray-500 capitalize">
                            Employee Count
                          </span>
                          <span className="font-medium">
                            {value} employees
                          </span>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">
                          {typeof value === 'string' 
                            ? value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                            : JSON.stringify(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Tabs for different report sections */}
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="border-t pt-8">
                {/* Use the existing DetailedAnalysisTabs component */}
                <DetailedAnalysisTabs 
                  archetypeData={archetypeData}
                  onRetakeAssessment={() => {}} // No need to retake here
                />
              </TabsContent>
              
              <TabsContent value="metrics" className="border-t pt-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Distinctive Metrics for {archetypeData.name}</h3>
                  <p className="text-gray-600 mb-6">
                    These metrics show the most significant differences between this archetype and the overall average.
                  </p>
                  
                  {archetypeMetrics.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Archetype Value</TableHead>
                          <TableHead className="text-right">Overall Average</TableHead>
                          <TableHead className="text-right">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archetypeMetrics.map((metric, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{metric.Metric}</TableCell>
                            <TableCell>{metric.Category}</TableCell>
                            <TableCell className="text-right">{metric["Archetype Value"]?.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{metric["Archetype Average"]?.toFixed(2)}</TableCell>
                            <TableCell className={`text-right ${metric.Difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {metric.Difference > 0 ? '+' : ''}{metric.Difference?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-gray-500">No metrics data available</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepReport;
