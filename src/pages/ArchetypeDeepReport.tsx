
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeId } from '@/types/archetype';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeepReportLanding from '@/components/deepreport/DeepReportLanding';
import DeepReportOverview from '@/components/deepreport/DeepReportOverview';
import DeepReportKeyFindings from '@/components/deepreport/DeepReportKeyFindings';
import DeepReportDetailedMetrics from '@/components/deepreport/DeepReportDetailedMetrics';
import DeepReportSwot from '@/components/deepreport/DeepReportSwot';
import DeepReportRecommendations from '@/components/deepreport/DeepReportRecommendations';
import DeepReportMethodology from '@/components/deepreport/DeepReportMethodology';
import DeepReportNextSteps from '@/components/deepreport/DeepReportNextSteps';
import DeepReportSidebar from '@/components/deepreport/DeepReportSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleAlert } from 'lucide-react';
import { DistinctiveMetric } from '@/hooks/archetype/useDistinctiveMetrics';

export type DeepReportData = {
  deepDiveReport: any;
  swotAnalysis: any;
  strategicRecommendations: any[];
  distinctiveMetrics: DistinctiveMetric[];
  archetypeData: any;
  familyData: any;
  sdohMetrics?: any[];
};

const ArchetypeDeepReport = () => {
  const { archetypeId } = useParams<{ archetypeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('landing');
  const [loading, setLoading] = useState(true);
  
  // Use the specialized hook to get archetype data
  const { archetypeData, familyData, isLoading: isLoadingArchetype, error: archetypeError } = 
    useGetArchetype(archetypeId as ArchetypeId);
    
  // State for deep dive report data
  const [deepDiveReport, setDeepDiveReport] = useState<any>(null);
  const [swotAnalysis, setSwotAnalysis] = useState<any>(null);
  const [strategicRecommendations, setStrategicRecommendations] = useState<any[]>([]);
  const [distinctiveMetrics, setDistinctiveMetrics] = useState<DistinctiveMetric[]>([]);
  const [sdohMetrics, setSdohMetrics] = useState<any[]>([]);
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
        
        // Fetch deep dive report - Use correct table name
        const { data: reportData, error: reportError } = await supabase
          .from('Analysis_Archetype_Deep_Dive_Reports')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
        
        if (reportError) {
          console.error('Error fetching deep dive report:', reportError);
          toast({
            title: "Error",
            description: "Failed to load deep dive report data",
            variant: "destructive"
          });
        } else if (reportData) {
          setDeepDiveReport(reportData);
        } else {
          toast({
            title: "No Report Data",
            description: "No deep dive report found for this archetype",
            variant: "default"
          });
        }
        
        // Fetch SWOT analysis - Use correct table name
        const { data: swotData, error: swotError } = await supabase
          .from('Analysis_Archetype_SWOT')
          .select('*')
          .eq('archetype_id', archetypeId)
          .maybeSingle();
        
        if (swotError) {
          console.error('Error fetching SWOT analysis:', swotError);
        } else if (swotData) {
          // Ensure arrays are properly converted from JSON
          const processedSwot = {
            ...swotData,
            strengths: Array.isArray(swotData.strengths) ? swotData.strengths.map(String) : [],
            weaknesses: Array.isArray(swotData.weaknesses) ? swotData.weaknesses.map(String) : [],
            opportunities: Array.isArray(swotData.opportunities) ? swotData.opportunities.map(String) : [],
            threats: Array.isArray(swotData.threats) ? swotData.threats.map(String) : []
          };
          setSwotAnalysis(processedSwot);
        }
        
        // Fetch strategic recommendations - Use correct table name
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from('Analysis_Archetype_Strategic_Recommendations')
          .select('*')
          .eq('archetype_id', archetypeId)
          .order('recommendation_number', { ascending: true });
        
        if (recommendationsError) {
          console.error('Error fetching strategic recommendations:', recommendationsError);
        } else if (recommendationsData) {
          setStrategicRecommendations(recommendationsData);
        }
        
        // Fetch distinctive metrics - Use correct table name
        const { data: metricsData, error: metricsError } = await supabase
          .from('Analysis_Archetype_Distinctive_Metrics')
          .select('*')
          .eq('archetype_id', archetypeId)
          .order('difference', { ascending: false });
        
        if (metricsError) {
          console.error('Error fetching distinctive metrics:', metricsError);
        } else if (metricsData) {
          // Map the data to match the DistinctiveMetric interface
          const formattedMetrics: DistinctiveMetric[] = metricsData.map(item => ({
            Metric: item.metric || '',
            archetype_ID: item.archetype_id || '',
            Difference: item.difference || 0,
            "Archetype Average": item.archetype_average || 0,
            "Archetype Value": item.archetype_value || 0,
            Category: item.category || '',
            definition: item.significance || ''
          }));
          
          setDistinctiveMetrics(formattedMetrics);
        }
        
        // Create mock SDOH metrics since the table doesn't exist in the schema
        const mockSdohMetrics = [
          {
            Metric: "Healthcare Access",
            Category: "SDOH",
            "Archetype Value": 76.5,
            "Archetype Average": 68.2,
            Difference: 8.3
          },
          {
            Metric: "Food Access",
            Category: "SDOH",
            "Archetype Value": 82.1,
            "Archetype Average": 75.8,
            Difference: 6.3
          },
          {
            Metric: "Economic Security",
            Category: "SDOH",
            "Archetype Value": 71.2,
            "Archetype Average": 65.9,
            Difference: 5.3
          }
        ];
        
        setSdohMetrics(mockSdohMetrics);
        
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

  // Prepare report data for child components
  const reportData: DeepReportData = {
    deepDiveReport,
    swotAnalysis,
    strategicRecommendations,
    distinctiveMetrics,
    archetypeData,
    familyData,
    sdohMetrics
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  if (loading || isLoadingArchetype) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12 gap-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!archetypeData || archetypeError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <CircleAlert className="h-16 w-16 text-red-500" />
              <h2 className="text-2xl font-bold">Report Unavailable</h2>
              <p className="text-gray-600">We couldn't find the requested archetype data.</p>
              <p className="text-red-500">{archetypeError?.message || "Unknown error occurred"}</p>
              <button 
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => navigate('/admin')}
              >
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const color = `archetype-${archetypeData.id}`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <DeepReportSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        archetypeId={archetypeData.id as ArchetypeId}
        archetypeName={archetypeData.name}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeSection === 'landing' && (
            <DeepReportLanding reportData={reportData} />
          )}
          
          {activeSection === 'overview' && (
            <DeepReportOverview reportData={reportData} />
          )}
          
          {activeSection === 'key-findings' && (
            <DeepReportKeyFindings reportData={reportData} />
          )}
          
          {activeSection === 'detailed-metrics' && (
            <DeepReportDetailedMetrics reportData={reportData} />
          )}
          
          {activeSection === 'swot' && (
            <DeepReportSwot reportData={reportData} />
          )}
          
          {activeSection === 'recommendations' && (
            <DeepReportRecommendations reportData={reportData} />
          )}
          
          {activeSection === 'methodology' && (
            <DeepReportMethodology />
          )}
          
          {activeSection === 'next-steps' && (
            <DeepReportNextSteps archetypeData={archetypeData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchetypeDeepReport;
