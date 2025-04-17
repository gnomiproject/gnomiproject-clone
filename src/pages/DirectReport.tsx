
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useArchetypes } from '@/hooks/useArchetypes';
import SectionTitle from '@/components/shared/SectionTitle';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, LineChart, ListChecks, BarChart4, CircleAlert, BarChart2, Users, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { useDistinctiveMetrics } from '@/hooks/archetype/useDistinctiveMetrics';

const DirectReport = () => {
  const { archetypeId } = useParams<{ archetypeId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Use the specialized hook to get archetype data
  const { archetypeData, familyData, isLoading: isLoadingArchetype, error: archetypeError } = 
    useGetArchetype(archetypeId as ArchetypeId);
    
  // Get distinctive metrics for this archetype
  const { distinctiveMetrics, isLoading: isLoadingMetrics } = 
    useDistinctiveMetrics(archetypeId as ArchetypeId);
  
  // State for deep dive report data
  const [deepDiveReport, setDeepDiveReport] = useState<any>(null);
  const [swotAnalysis, setSwotAnalysis] = useState<any>(null);
  const [strategicRecommendations, setStrategicRecommendations] = useState<any[]>([]);
  const [loadingReportData, setLoadingReportData] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!archetypeId) {
        toast({
          title: "Error",
          description: "No archetype ID provided",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      try {
        setLoadingReportData(true);
        
        // Fetch deep dive report
        const { data: reportData, error: reportError } = await supabase
          .from('archetype_deep_dive_reports')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
        
        if (reportError) {
          console.error('Error fetching deep dive report:', reportError);
        } else if (reportData) {
          setDeepDiveReport(reportData);
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
          setSwotAnalysis(swotData);
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
          setStrategicRecommendations(recommendationsData);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive"
        });
      } finally {
        setLoadingReportData(false);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [archetypeId, toast]);

  if (loading || isLoadingArchetype) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border p-8">
            <SectionTitle 
              title="Loading Report..." 
              subtitle="Retrieving archetype data..." 
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
  
  if (!archetypeData || archetypeError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border p-8">
            <SectionTitle 
              title="Report Unavailable" 
              subtitle="We couldn't find the requested archetype data." 
              center 
            />
            <div className="text-center mt-8 text-red-500">
              {archetypeError?.message || "Unknown error occurred"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const color = `archetype-${archetypeData.id}`;
  
  // Helper function to render metrics in a table
  const renderMetricsTable = (metrics: any[], title: string) => {
    if (!metrics || metrics.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h4 className="font-semibold text-lg mb-4">{title}</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Avg</TableHead>
              <TableHead className="text-right">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{metric.Metric}</TableCell>
                <TableCell>{metric.Category}</TableCell>
                <TableCell className="text-right">{(metric["Archetype Value"] || 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">{(metric["Archetype Average"] || 0).toFixed(2)}</TableCell>
                <TableCell className={`text-right ${(metric.Difference || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.Difference > 0 ? '+' : ''}{(metric.Difference || 0).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Helper function to render SWOT section
  const renderSwotSection = () => {
    if (!swotAnalysis) return null;
    
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">SWOT Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-bold text-green-700 mb-3 text-lg">Strengths</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {swotAnalysis.strengths && Array.isArray(swotAnalysis.strengths) ? 
                swotAnalysis.strengths.map((item: string, i: number) => (
                  <li key={`strength-${i}`}>{item}</li>
                )) : 
                <li>No data available</li>
              }
            </ul>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg">
            <h4 className="font-bold text-red-700 mb-3 text-lg">Weaknesses</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {swotAnalysis.weaknesses && Array.isArray(swotAnalysis.weaknesses) ? 
                swotAnalysis.weaknesses.map((item: string, i: number) => (
                  <li key={`weakness-${i}`}>{item}</li>
                )) : 
                <li>No data available</li>
              }
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-3 text-lg">Opportunities</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {swotAnalysis.opportunities && Array.isArray(swotAnalysis.opportunities) ? 
                swotAnalysis.opportunities.map((item: string, i: number) => (
                  <li key={`opportunity-${i}`}>{item}</li>
                )) : 
                <li>No data available</li>
              }
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="font-bold text-yellow-700 mb-3 text-lg">Threats</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {swotAnalysis.threats && Array.isArray(swotAnalysis.threats) ? 
                swotAnalysis.threats.map((item: string, i: number) => (
                  <li key={`threat-${i}`}>{item}</li>
                )) : 
                <li>No data available</li>
              }
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render recommendations
  const renderRecommendations = () => {
    if (!strategicRecommendations || strategicRecommendations.length === 0) return null;
    
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Strategic Recommendations</h3>
        <div className="space-y-6">
          {strategicRecommendations.map((rec, index) => (
            <Card key={`rec-${index}`}>
              <CardHeader className={`bg-${color}/10`}>
                <div className="flex items-start gap-3">
                  <div className={`bg-${color} text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm font-bold">{rec.recommendation_number || index + 1}</span>
                  </div>
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 mb-4">{rec.description}</p>
                {rec.metrics_references && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      <BarChart4 className="inline-block mr-1 h-4 w-4" /> 
                      Related metrics: {typeof rec.metrics_references === 'string' ? 
                        rec.metrics_references : 
                        JSON.stringify(rec.metrics_references)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-${color} mb-8`}>
          <div className="p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">THE POWER OF HEALTHCARE ARCHETYPES</h1>
            
            <p className="mb-6 text-gray-700">
              Traditional healthcare benchmarking often relies on broad industry classifications or geographic regions, 
              failing to capture the nuanced patterns that actually drive healthcare costs and outcomes. The Healthcare 
              Employer Archetype framework transcends these limitations, identifying distinctive employer profiles based 
              on workforce characteristics, care patterns, cost drivers, and strategic opportunities.
            </p>
            
            <div className="mb-8">
              <h3 className="font-bold mb-4">By understanding your organization's archetype, you can:</h3>
              <ul className="list-disc pl-8 space-y-2">
                <li>Benchmark against truly comparable peers rather than dissimilar organizations</li>
                <li>Identify strategic priorities that address your specific population's needs</li>
                <li>Implement targeted interventions proven effective for your archetype</li>
                <li>Anticipate future healthcare trends based on patterns observed within your archetype</li>
              </ul>
            </div>
            
            <div className="text-center mb-8">
              <p className="italic">To find out more or retake your assessment, visit us at <a href="https://g.nomi.com" className="text-blue-600 underline">g.nomi.com</a></p>
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-${color}`}>
          <div className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              SO, WHAT IS YOUR EMPLOYER HEALTHCARE ARCHETYPE?
            </h2>
            
            <div className="text-center mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                ARCHETYPE {archetypeData.id.toUpperCase()}: "{archetypeData.name.toUpperCase()}"
              </h3>
              {familyData && (
                <p className="text-gray-500">
                  Family: {familyData.name}
                </p>
              )}
            </div>
            
            <Tabs defaultValue="key-findings" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                <TabsTrigger value="key-findings">Key Findings</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="swot">SWOT</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="key-findings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className={`h-5 w-5 text-${color}`} />
                      Key Findings
                    </CardTitle>
                    <CardDescription>
                      The most notable characteristics of this archetype
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {deepDiveReport?.summary_analysis ? (
                      <>
                        <p className="mb-6 text-gray-700">{deepDiveReport.summary_analysis}</p>
                        <h4 className="font-bold text-lg mb-3">Defining Characteristics:</h4>
                        <ol className="list-decimal pl-8 space-y-3">
                          {distinctiveMetrics && distinctiveMetrics.slice(0, 5).map((metric, i) => (
                            <li key={`key-finding-${i}`} className="text-gray-700">
                              <span className="font-medium">{metric.Metric}:</span>{" "}
                              {metric.Difference > 0 ? 
                                `${metric.Difference.toFixed(1)}% higher than average (${metric["Archetype Value"].toFixed(1)} vs ${metric["Archetype Average"].toFixed(1)})` : 
                                `${Math.abs(metric.Difference).toFixed(1)}% lower than average (${metric["Archetype Value"].toFixed(1)} vs ${metric["Archetype Average"].toFixed(1)})`
                              }
                            </li>
                          ))}
                        </ol>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Key Findings Not Available</h4>
                        <p className="text-gray-500">The key findings for this archetype are still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className={`h-5 w-5 text-${color}`} />
                      In This Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-700">This comprehensive analysis provides:</p>
                      <ul className="list-disc pl-8 space-y-2">
                        <li><span className="font-medium">Detailed Metrics Profile:</span> Precise data on costs, utilization, risk, demographics, and clinical patterns</li>
                        <li><span className="font-medium">Distinctive Characteristics Analysis:</span> What truly sets this archetype apart from others</li>
                        <li><span className="font-medium">SWOT Assessment:</span> Strategic evaluation of the archetype's strengths, weaknesses, opportunities, and threats</li>
                        <li><span className="font-medium">Strategic Recommendations:</span> Specific strategies to optimize healthcare performance</li>
                        <li><span className="font-medium">Industry Context:</span> How the archetype compares to similar employer groups</li>
                      </ul>
                      <p className="text-gray-700 mt-4">
                        The insights in this report are drawn from comprehensive analysis of hundreds of employer populations,
                        representing millions of members and billions in healthcare spend. The resulting archetype framework 
                        provides a more precise, meaningful way to understand your healthcare performance and opportunities 
                        than traditional benchmarking approaches.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className={`h-5 w-5 text-${color}`} />
                      Data Details
                    </CardTitle>
                    <CardDescription>
                      Key metrics that define this archetype
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {deepDiveReport?.data_details ? (
                      <div className="space-y-8">
                        {/* Workforce Demographics */}
                        <div>
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Workforce Demographics
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {deepDiveReport.data_details.Demographics && deepDiveReport.data_details.Demographics.map((item: any, i: number) => (
                              <div key={`demo-${i}`} className="border-b pb-2">
                                <span className="text-sm text-gray-500">{item.Metric}</span>
                                <div className="flex justify-between">
                                  <span className="font-medium">{Number(item["Archetype Value"]).toFixed(2)}</span>
                                  <span className={`text-sm ${item.Difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.Difference > 0 ? '+' : ''}{Number(item.Difference).toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Healthcare Cost Profile */}
                        <div>
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <PieChart className="h-5 w-5 mr-2" />
                            Healthcare Cost Profile
                          </h4>
                          {renderMetricsTable(
                            deepDiveReport.data_details.Cost || [], 
                            ""
                          )}
                        </div>
                        
                        {/* Utilization Patterns */}
                        <div>
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2" />
                            Utilization Patterns
                          </h4>
                          {renderMetricsTable(
                            deepDiveReport.data_details.Utilization || [], 
                            ""
                          )}
                        </div>
                        
                        {/* Disease Prevalence */}
                        <div>
                          <h4 className="font-bold text-lg mb-4 flex items-center">
                            <LineChart className="h-5 w-5 mr-2" />
                            Disease Prevalence Profile
                          </h4>
                          {renderMetricsTable(
                            deepDiveReport.data_details.Disease || [], 
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Detailed Metrics Not Available</h4>
                        <p className="text-gray-500">The detailed metrics for this archetype are still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Distinctive Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className={`h-5 w-5 text-${color}`} />
                      Distinctive Metrics
                    </CardTitle>
                    <CardDescription>
                      Metrics that distinguish this archetype from others
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {distinctiveMetrics && distinctiveMetrics.length > 0 ? (
                      <div>
                        {deepDiveReport?.distinctive_metrics_summary && (
                          <p className="mb-6 text-gray-700">{deepDiveReport.distinctive_metrics_summary}</p>
                        )}
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead className="text-right">Value</TableHead>
                              <TableHead className="text-right">Avg</TableHead>
                              <TableHead className="text-right">Difference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {distinctiveMetrics.map((metric, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{metric.Metric}</TableCell>
                                <TableCell>{metric.Category}</TableCell>
                                <TableCell className="text-right">{Number(metric["Archetype Value"] || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-right">{Number(metric["Archetype Average"] || 0).toFixed(2)}</TableCell>
                                <TableCell className={`text-right ${Number(metric.Difference || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {Number(metric.Difference) > 0 ? '+' : ''}{Number(metric.Difference || 0).toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Distinctive Metrics Not Available</h4>
                        <p className="text-gray-500">The distinctive metrics for this archetype are still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className={`h-5 w-5 text-${color}`} />
                      Summary Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {deepDiveReport?.summary_analysis ? (
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{deepDiveReport.summary_analysis}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Analysis Not Available</h4>
                        <p className="text-gray-500">The summary analysis for this archetype is still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className={`h-5 w-5 text-${color}`} />
                      Distinctive Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {deepDiveReport?.distinctive_metrics_summary ? (
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{deepDiveReport.distinctive_metrics_summary}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Distinctive Insights Not Available</h4>
                        <p className="text-gray-500">The distinctive insights for this archetype are still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="swot">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className={`h-5 w-5 text-${color}`} />
                      SWOT Analysis
                    </CardTitle>
                    <CardDescription>
                      Strengths, Weaknesses, Opportunities, and Threats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {swotAnalysis ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-green-700 mb-3">Strengths</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {Array.isArray(swotAnalysis.strengths) ? swotAnalysis.strengths.map((strength: string, index: number) => (
                              <li key={`strength-${index}`}>{strength}</li>
                            )) : <li>No strengths data available</li>}
                          </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-bold text-red-700 mb-3">Weaknesses</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {Array.isArray(swotAnalysis.weaknesses) ? swotAnalysis.weaknesses.map((weakness: string, index: number) => (
                              <li key={`weakness-${index}`}>{weakness}</li>
                            )) : <li>No weaknesses data available</li>}
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-bold text-blue-700 mb-3">Opportunities</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {Array.isArray(swotAnalysis.opportunities) ? swotAnalysis.opportunities.map((opportunity: string, index: number) => (
                              <li key={`opportunity-${index}`}>{opportunity}</li>
                            )) : <li>No opportunities data available</li>}
                          </ul>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-bold text-yellow-700 mb-3">Threats</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {Array.isArray(swotAnalysis.threats) ? swotAnalysis.threats.map((threat: string, index: number) => (
                              <li key={`threat-${index}`}>{threat}</li>
                            )) : <li>No threats data available</li>}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">SWOT Analysis Not Available</h4>
                        <p className="text-gray-500">The SWOT analysis for this archetype is still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className={`h-5 w-5 text-${color}`} />
                      Strategic Recommendations
                    </CardTitle>
                    <CardDescription>
                      Based on our analysis of the {archetypeData.name} archetype
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {strategicRecommendations && strategicRecommendations.length > 0 ? (
                      <div className="space-y-6">
                        {strategicRecommendations.map((recommendation, index) => (
                          <div key={index} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start gap-3 mb-3">
                              <div className={`bg-${color} text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
                                <span className="text-sm font-bold">{recommendation.recommendation_number || index + 1}</span>
                              </div>
                              <h4 className="text-lg font-semibold">{recommendation.title}</h4>
                            </div>
                            <p className="text-gray-700 mb-2 pl-11">{recommendation.description}</p>
                            {recommendation.metrics_references && (
                              <div className="pl-11">
                                <span className="text-sm text-gray-500 flex items-center">
                                  <BarChart4 className="inline-block mr-1 h-4 w-4" /> 
                                  Related metrics: {typeof recommendation.metrics_references === 'string' ? 
                                    recommendation.metrics_references : 
                                    JSON.stringify(recommendation.metrics_references)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CircleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Recommendations Not Available</h4>
                        <p className="text-gray-500">The strategic recommendations for this archetype are still being generated.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectReport;
