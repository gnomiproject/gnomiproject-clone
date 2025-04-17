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
        
        // Fix: Using the correct table name from the database schema
        const { data: metricsData, error: metricsError } = await supabase
          .from('archetype_distinctive_metrics_table')
          .select('*')
          .eq('archetype_ID', archetypeId)
          .order('Difference', { ascending: false });
        
        if (metricsError) {
          console.error('Error fetching distinctive metrics:', metricsError);
        } else if (metricsData) {
          setDistinctiveMetrics(metricsData);
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

  // Prepare report data for child components
  const reportData: DeepReportData = {
    deepDiveReport,
    swotAnalysis,
    strategicRecommendations,
    distinctiveMetrics,
    archetypeData,
    familyData
  };

  // Handle section navigation
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
