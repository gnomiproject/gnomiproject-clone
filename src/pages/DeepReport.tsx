
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useArchetypes } from '@/hooks/useArchetypes';
import SectionTitle from '@/components/shared/SectionTitle';
import DetailedAnalysisTabs from '@/components/results/DetailedAnalysisTabs';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockIcon, UnlockIcon, FileText, LineChart, ListChecks, BarChart4, CircleAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Json } from '@/integrations/supabase/types';

interface DeepDiveReport {
  id: string;
  archetype_id: string;
  title: string;
  introduction: string;
  summary_analysis: string;
  distinctive_metrics_summary: string;
  data_details: Record<string, any>;
  last_updated: string;
}

interface SwotAnalysis {
  id: string;
  archetype_id: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  last_updated: string;
}

interface StrategicRecommendation {
  id: string;
  archetype_id: string;
  recommendation_number: number;
  title: string;
  description: string;
  metrics_references: string;
  last_updated: string;
}

const DeepReport = () => {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('token');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    id: string;
    name: string;
    organization: string;
    archetype_id: ArchetypeId;
    assessment_answers: any;
    assessment_result: any;
  } | null>(null);
  const [validToken, setValidToken] = useState(false);
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const [archetypeData, setArchetypeData] = useState<ArchetypeDetailedData | null>(null);
  const [archetypeMetrics, setArchetypeMetrics] = useState<any[]>([]);
  
  // New state for deep dive report data
  const [deepDiveReport, setDeepDiveReport] = useState<DeepDiveReport | null>(null);
  const [swotAnalysis, setSwotAnalysis] = useState<SwotAnalysis | null>(null);
  const [strategicRecommendations, setStrategicRecommendations] = useState<StrategicRecommendation[]>([]);
  const [loadingReportData, setLoadingReportData] = useState(false);

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
          // Ensure archetype_id is treated as ArchetypeId type
          const archetypeId = data.archetype_id as ArchetypeId;
          setReportData({
            ...data,
            archetype_id: archetypeId
          });
          setValidToken(true);
          
          // Load archetype data with properly typed archetypeId
          if (archetypeId) {
            const archetype = getArchetypeEnhanced(archetypeId);
            if (archetype) {
              setArchetypeData(archetype);
            }
            
            // Fetch archetype metrics from Supabase
            fetchArchetypeMetrics(archetypeId);
            
            // Fetch deep dive report data
            fetchDeepDiveReportData(archetypeId);
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
  const fetchArchetypeMetrics = async (archetypeId: ArchetypeId) => {
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
  
  // New function to fetch deep dive report data
  const fetchDeepDiveReportData = async (archetypeId: ArchetypeId) => {
    setLoadingReportData(true);
    try {
      // Fetch deep dive report
      const { data: reportData, error: reportError } = await supabase
        .from('archetype_deep_dive_reports')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
      
      if (reportError) {
        console.error('Error fetching deep dive report:', reportError);
      } else if (reportData) {
        // Convert JSON data to expected type
        setDeepDiveReport({
          ...reportData,
          data_details: reportData.data_details as Record<string, any>
        });
      }
      
      // Fetch SWOT analysis
      const { data: swotData, error: swotError } = await supabase
        .from('archetype_swot_analyses')
        .select('*')
        .eq('archetype_id', archetypeId)
        .maybeSingle();
      
      if (swotError) {
        console.error('Error fetching SWOT analysis:', swotError);
      } else if (swotData) {
        // Convert JSON arrays to string arrays
        setSwotAnalysis({
          ...swotData,
          strengths: swotData.strengths as unknown as string[],
          weaknesses: swotData.weaknesses as unknown as string[],
          opportunities: swotData.opportunities as unknown as string[],
          threats: swotData.threats as unknown as string[]
        });
      }
      
      // Fetch strategic recommendations
      const { data: recommendationsData, error: recommendationsError } = await supabase
        .from('archetype_strategic_recommendations')
        .select('*')
        .eq('archetype_id', archetypeId)
        .order('recommendation_number', { ascending: true });
      
      if (recommendationsError) {
        console.error('Error fetching strategic recommendations:', recommendationsError);
      } else if (recommendationsData) {
        // Convert metrics_references JSON to string
        const typedRecommendations: StrategicRecommendation[] = recommendationsData.map(rec => ({
          ...rec,
          metrics_references: typeof rec.metrics_references === 'string' 
            ? rec.metrics_references 
            : JSON.stringify(rec.metrics_references)
        }));
        setStrategicRecommendations(typedRecommendations);
      }
      
    } catch (error) {
      console.error('Error fetching deep dive report data:', error);
    } finally {
      setLoadingReportData(false);
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

  // Helper function to safely display any value as a string
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }
    if (typeof value === 'string') {
      return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    return String(value);
  };

  const renderLoading = () => (
    <div className="flex items-center justify-center py-10">
      <div className="space-y-4 w-full">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );

  const renderMetricsList = (categoryData: any[], category: string) => {
    if (!categoryData || categoryData.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">{category}</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Archetype Value</TableHead>
              <TableHead className="text-right">Average</TableHead>
              <TableHead className="text-right">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryData.map((metric, index) => (
              <TableRow key={`${category}-${index}`}>
                <TableCell className="font-medium">{metric.Metric}</TableCell>
                <TableCell className="text-right">{(metric.Archetype_Value || 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">{(metric.Archetype_Average || 0).toFixed(2)}</TableCell>
                <TableCell className={`text-right ${(metric.Difference || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(metric.Difference || 0) > 0 ? '+' : ''}{(metric.Difference || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

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
                            {formatValue(value)} employees
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
                          {formatValue(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Updated Tabs for different report sections including deep dive content */}
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                <TabsTrigger value="deepdive">Deep Dive</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
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

              {/* New Tab: Deep Dive Report */}
              <TabsContent value="deepdive" className="border-t pt-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Deep Dive Analysis: {archetypeData.name}</h3>
                  
                  {loadingReportData ? (
                    renderLoading()
                  ) : deepDiveReport ? (
                    <div className="space-y-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className={`text-${color}`}>
                            <FileText className={`inline-block mr-2 h-5 w-5 text-${color}`} />
                            {deepDiveReport.title || `${archetypeData.name} Deep Dive Report`}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-lg mb-2">Introduction</h4>
                              <p className="text-gray-700">{deepDiveReport.introduction}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-lg mb-2">Summary Analysis</h4>
                              <p className="text-gray-700">{deepDiveReport.summary_analysis}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-lg mb-2">Distinctive Metrics</h4>
                              <p className="text-gray-700 mb-4">{deepDiveReport.distinctive_metrics_summary}</p>
                              
                              {deepDiveReport.data_details && Object.keys(deepDiveReport.data_details).length > 0 ? (
                                <div className="mt-6">
                                  <h4 className="font-semibold text-lg mb-4">Detailed Metrics by Category</h4>
                                  {Object.entries(deepDiveReport.data_details).map(([category, metrics]) => 
                                    renderMetricsList(metrics as any[], category)
                                  )}
                                </div>
                              ) : (
                                <p className="text-center py-4 text-gray-500">No detailed metrics available</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* SWOT Analysis Card */}
                      {swotAnalysis && (
                        <Card>
                          <CardHeader>
                            <CardTitle className={`text-${color}`}>
                              <LineChart className={`inline-block mr-2 h-5 w-5 text-${color}`} />
                              SWOT Analysis
                            </CardTitle>
                            <CardDescription>Strengths, Weaknesses, Opportunities, and Threats</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-bold text-green-700 mb-3">Strengths</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                  {swotAnalysis.strengths.map((strength, index) => (
                                    <li key={`strength-${index}`}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-bold text-red-700 mb-3">Weaknesses</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                  {swotAnalysis.weaknesses.map((weakness, index) => (
                                    <li key={`weakness-${index}`}>{weakness}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-bold text-blue-700 mb-3">Opportunities</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                  {swotAnalysis.opportunities.map((opportunity, index) => (
                                    <li key={`opportunity-${index}`}>{opportunity}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-bold text-yellow-700 mb-3">Threats</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                  {swotAnalysis.threats.map((threat, index) => (
                                    <li key={`threat-${index}`}>{threat}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Deep Dive Report Not Available</h4>
                      <p className="text-gray-500">The detailed analysis for this archetype is still being generated.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* New Tab: Strategic Recommendations */}
              <TabsContent value="recommendations" className="border-t pt-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Strategic Recommendations</h3>
                  <p className="text-gray-600 mb-6">
                    Based on our analysis of the {archetypeData.name} archetype, here are key recommendations for your organization.
                  </p>
                  
                  {loadingReportData ? (
                    renderLoading()
                  ) : strategicRecommendations.length > 0 ? (
                    <div className="space-y-6">
                      {strategicRecommendations.map((recommendation, index) => (
                        <Card key={index}>
                          <CardHeader className={`bg-${color}/10`}>
                            <div className="flex items-start gap-3">
                              <div className={`bg-${color} text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
                                <span className="text-sm font-bold">{recommendation.recommendation_number}</span>
                              </div>
                              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <p className="text-gray-700 mb-4">{recommendation.description}</p>
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">
                                <BarChart4 className="inline-block mr-1 h-4 w-4" /> 
                                Related metrics: {recommendation.metrics_references}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ListChecks className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Recommendations Not Available</h4>
                      <p className="text-gray-500">Strategic recommendations for this archetype are still being generated.</p>
                    </div>
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
