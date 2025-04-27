import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, FileText, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculatePercentageDifference } from '@/utils/reports/metricUtils';

interface ReportDetailViewProps {
  archetypeId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ReportData {
  executive_summary: string;
  archetype_overview: any;
  detailed_metrics: any;
  swot_analysis: any;
  strategic_recommendations: any;
}

const ReportDetailView = ({ archetypeId, isOpen, onClose }: ReportDetailViewProps) => {
  const [loading, setLoading] = useState(true);
  const [archetypeName, setArchetypeName] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [copied, setCopied] = useState(false);
  const [averageData, setAverageData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && archetypeId) {
      loadReportData();
    }
  }, [isOpen, archetypeId]);

  const loadReportData = async () => {
    if (!archetypeId) return;
    
    setLoading(true);
    
    try {
      // Get archetype name
      const { data: archetypeData } = await supabase
        .from('Core_Archetype_Overview')
        .select('name')
        .eq('id', archetypeId)
        .single();
      
      if (archetypeData) {
        setArchetypeName(archetypeData.name);
      }

      // Fetch the average data (All_Average)
      const { data: avgData } = await supabase
        .from('level4_deepdive_report_data')
        .select('*')
        .eq('archetype_id', 'All_Average')
        .maybeSingle();

      if (avgData) {
        setAverageData(avgData);
        console.log("Average data loaded:", avgData);
      }
      
      // Get the full report data
      const { data: reportData } = await supabase
        .from('Analysis_Archetype_Full_Reports')
        .select('executive_summary, archetype_overview, detailed_metrics, swot_analysis, strategic_recommendations')
        .eq('archetype_id', archetypeId)
        .single();
      
      if (reportData) {
        setReport(reportData);

        // Process metrics with correct percentages if we have average data
        if (avgData && reportData.detailed_metrics) {
          // Add percentage difference calculations to the metrics
          const processedMetrics = processMetricsWithPercentages(reportData.detailed_metrics, avgData);
          reportData.detailed_metrics = processedMetrics;
        }
      } else {
        toast({
          title: "Report Not Found",
          description: "No report data available for this archetype",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading report data:', error);
      toast({
        title: "Error Loading Report",
        description: "Failed to load report data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Process metrics to add correct percentage differences
  const processMetricsWithPercentages = (metrics: any, averageData: any) => {
    if (!metrics || !averageData) return metrics;

    const processedMetrics = { ...metrics };
    
    // Go through metrics categories
    Object.keys(processedMetrics).forEach(category => {
      if (typeof processedMetrics[category] === 'object') {
        // Process each metric in the category
        Object.keys(processedMetrics[category]).forEach(metricKey => {
          const fullMetricKey = `${category}_${metricKey}`;
          const currentValue = processedMetrics[category][metricKey].value;
          const avgValue = averageData[fullMetricKey];

          if (currentValue && avgValue) {
            const percentDiff = calculatePercentageDifference(currentValue, avgValue);
            processedMetrics[category][metricKey].percentDifference = percentDiff;
            processedMetrics[category][metricKey].formattedDifference = 
              `${percentDiff > 0 ? '+' : ''}${percentDiff.toFixed(1)}%`;
            processedMetrics[category][metricKey].average = avgValue;
          }
        });
      }
    });

    return processedMetrics;
  };

  const exportReportData = () => {
    if (!report || !archetypeName) return;
    
    // Create a formatted JSON string
    const exportData = JSON.stringify(report, null, 2);
    
    // Create blob and download link
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${archetypeName.replace(/\s+/g, '_')}_Report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Exported",
      description: "The report data has been downloaded as a JSON file",
    });
  };

  const copyToClipboard = () => {
    if (!report) return;
    
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to Clipboard",
          description: "Report data copied to clipboard",
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy report data to clipboard",
          variant: "destructive",
        });
      });
  };

  const formatJson = (data: any) => {
    if (!data) return "No data available";
    if (typeof data === 'string') return data;
    
    return JSON.stringify(data, null, 2);
  };

  // Enhanced display for detailed metrics
  const renderDetailedMetrics = () => {
    if (!report?.detailed_metrics) return <p>No detailed metrics available</p>;
    
    return (
      <div className="space-y-6">
        {Object.entries(report.detailed_metrics).map(([category, metrics]: [string, any]) => (
          <div key={category} className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3 capitalize">{category} Metrics</h4>
            <div className="space-y-4">
              {Object.entries(metrics).map(([metricName, metricData]: [string, any]) => (
                <div key={metricName} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{metricName}</span>
                    <span className="font-bold">{metricData.value}</span>
                  </div>
                  {metricData.average && (
                    <div className="text-sm flex justify-between mt-1">
                      <span className="text-gray-500">Average: {metricData.average}</span>
                      <span className={metricData.percentDifference > 0 ? "text-green-600" : "text-amber-600"}>
                        {metricData.formattedDifference}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {loading ? "Loading Report..." : `Report: ${archetypeId ? archetypeId.toLowerCase() : ''} ${archetypeName}`}
          </DialogTitle>
          <DialogDescription>
            Review the generated report data for this archetype
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-600">Loading report data...</p>
          </div>
        ) : report ? (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy JSON
              </Button>
              <Button onClick={exportReportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="swot">SWOT</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                <p className="whitespace-pre-line">{report.executive_summary || "No summary available"}</p>
              </TabsContent>
              
              <TabsContent value="overview" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-2">Archetype Overview</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96">
                  {formatJson(report.archetype_overview)}
                </pre>
              </TabsContent>
              
              <TabsContent value="metrics" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-2">Detailed Metrics</h3>
                {renderDetailedMetrics()}
              </TabsContent>
              
              <TabsContent value="swot" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-2">SWOT Analysis</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96">
                  {formatJson(report.swot_analysis)}
                </pre>
              </TabsContent>
              
              <TabsContent value="recommendations" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-2">Strategic Recommendations</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96">
                  {formatJson(report.strategic_recommendations)}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>No report data available for this archetype.</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailView;
