
import React from 'react';
import { DollarSign, TrendingDown, AlertTriangle, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculatePercentageDifference, getMetricComparisonText } from '@/utils/reports/metricUtils';

interface CostAnalysisProps {
  reportData: any;
  averageData: any;
}

const CostAnalysis = ({ 
  reportData, 
  averageData 
}: CostAnalysisProps) => {
  // Get cost analysis insights
  const costAnalysis = reportData.cost_analysis || 
    "No specific cost analysis insights available for this archetype.";
  
  // Parse and format the cost analysis insights if it's in JSON format
  const formattedCostAnalysis = React.useMemo(() => {
    try {
      // Check if the text appears to be a JSON string
      if (costAnalysis && (costAnalysis.startsWith('{') || costAnalysis.startsWith('['))) {
        const parsedData = JSON.parse(costAnalysis);
        
        // Process the parsed data to create a readable format
        if (parsedData.overview) {
          const overview = parsedData.overview;
          const findings = parsedData.findings || [];
          const keyMetrics = parsedData.key_metrics || [];
          
          return (
            <div className="space-y-4">
              <p>{overview}</p>
              
              {findings.length > 0 && (
                <div>
                  <h4 className="font-medium my-2">Key Findings:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {findings.map((finding: string, index: number) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {keyMetrics.length > 0 && (
                <div>
                  <h4 className="font-medium my-2">Key Cost Metrics:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {keyMetrics.map((metric: any, index: number) => (
                      <li key={index}>
                        <strong>{metric.name}:</strong> {formatNumber(metric.value, 'currency')} 
                        {metric.context && <span className="text-gray-600"> ({metric.context})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }
      }
    } catch (e) {
      console.error("Error parsing cost analysis data:", e);
    }
    
    // If not JSON or parsing fails, just return the text as is, splitting by periods and newlines for better formatting
    return (
      <div className="space-y-2">
        {costAnalysis.split(/\.\s+|[\n\r]+/).filter(Boolean).map((paragraph: string, index: number) => (
          <p key={index}>{paragraph.trim()}{!paragraph.trim().endsWith('.') ? '.' : ''}</p>
        ))}
      </div>
    );
  }, [costAnalysis]);
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_charts.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <p className="text-lg mb-6">
            Understanding healthcare spending patterns is crucial for effective benefits management. 
            This section breaks down this archetype's healthcare costs and compares them to the 
            {reportData.archetype_name} archetype average.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Cost Analysis Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>

      {/* Cost Analysis Insights - Moved to the top */}
      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
            Cost Analysis Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {formattedCostAnalysis}
          </div>
        </CardContent>
      </Card>

      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CostCard 
          title="Total Cost PEPY"
          value={reportData["Cost_Medical & RX Paid Amount PEPY"] || 0}
          average={averageData["Cost_Medical & RX Paid Amount PEPY"] || 0}
          betterDirection="lower"
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Medical Cost PEPY"
          value={reportData["Cost_Medical Paid Amount PEPY"] || 0}
          average={averageData["Cost_Medical Paid Amount PEPY"] || 0}
          betterDirection="lower"
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Rx Cost PEPY"
          value={reportData["Cost_RX Paid Amount PEPY"] || 0}
          average={averageData["Cost_RX Paid Amount PEPY"] || 0}
          betterDirection="lower"
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Total Cost PMPY"
          value={reportData["Cost_Medical & RX Paid Amount PMPY"] || 0}
          average={averageData["Cost_Medical & RX Paid Amount PMPY"] || 0}
          betterDirection="lower"
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Medical Cost PMPY"
          value={reportData["Cost_Medical Paid Amount PMPY"] || 0}
          average={averageData["Cost_Medical Paid Amount PMPY"] || 0}
          betterDirection="lower"
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Rx Cost PMPY"
          value={reportData["Cost_RX Paid Amount PMPY"] || 0}
          average={averageData["Cost_RX Paid Amount PMPY"] || 0}
          betterDirection="lower"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Cost Impact Analysis Card */}
      <Card className="mt-6 border-orange-200">
        <CardHeader className="bg-orange-50 pb-3">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
            Avoidable ER and Specialty Rx Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avoidable ER Section */}
            <div className="md:w-1/2">
              <h3 className="text-lg font-medium mb-4">Avoidable Emergency Room Costs</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{
                      name: 'Avoidable ER',
                      'Archetype Cost': reportData["Cost_Avoidable ER Potential Savings PMPY"] || 0,
                      'Population Average': averageData["Cost_Avoidable ER Potential Savings PMPY"] || 0
                    }]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatNumber(value, 'currency', 0)} />
                    <Tooltip formatter={(value) => formatNumber(value as number, 'currency', 2)} />
                    <Legend />
                    <Bar dataKey="Archetype Cost" fill="#3b82f6" />
                    <Bar dataKey="Population Average" fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm">
                <p>
                  This represents potential savings from reducing avoidable emergency room visits 
                  by directing members to more appropriate care settings such as primary care, 
                  urgent care, or telehealth.
                </p>
                {averageData["Cost_Avoidable ER Potential Savings PMPY"] && (
                  <p className="mt-2 text-orange-700">
                    Archetype average: {formatNumber(averageData["Cost_Avoidable ER Potential Savings PMPY"], 'currency')} per member per year
                  </p>
                )}
              </div>
            </div>

            {/* Specialty Rx Section */}
            <div className="md:w-1/2">
              <h3 className="text-lg font-medium mb-4">Specialty Rx Cost Impact</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{
                      name: 'Specialty Rx',
                      'Archetype Cost': reportData["Cost_Specialty RX Allowed Amount PMPM"] || 0,
                      'Population Average': averageData["Cost_Specialty RX Allowed Amount PMPM"] || 0
                    }]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatNumber(value, 'currency', 0)} />
                    <Tooltip formatter={(value) => formatNumber(value as number, 'currency', 2)} />
                    <Legend />
                    <Bar dataKey="Archetype Cost" fill="#3b82f6" />
                    <Bar dataKey="Population Average" fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm">
                <p>
                  Specialty medications represent {formatPercentOfTotal(
                    reportData["Cost_Specialty RX Allowed Amount PMPM"] * 12, 
                    reportData["Cost_RX Paid Amount PMPY"]
                  )} of this archetype's total pharmacy spend.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable cost card component with improved display of average values
const CostCard = ({ 
  title, 
  value, 
  average, 
  icon,
  betterDirection = 'higher'
}: { 
  title: string; 
  value: number; 
  average: number; 
  icon: React.ReactNode;
  betterDirection?: 'higher' | 'lower';
}) => {
  const formattedValue = formatNumber(value, 'currency', 0);
  const { text, type } = formatComparison(value, average, betterDirection);
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-lg mr-3 ${
          type === 'positive' ? 'bg-green-100' : 
          type === 'negative' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {formattedValue}
        </div>
        <p className={`text-sm mt-1 ${
          type === 'positive' ? 'text-green-600' : 
          type === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {text}
        </p>
      </div>
    </div>
  );
};

// Format comparison text and determine if it's positive or negative
const formatComparison = (value: number, benchmark: number, betterDirection: 'higher' | 'lower' = 'higher'): { text: string; type: 'positive' | 'negative' | 'neutral' } => {
  if (!value || !benchmark) {
    return { text: 'No comparison data', type: 'neutral' };
  }
  
  const diff = value - benchmark;
  const percentDiff = (diff / benchmark) * 100;
  
  if (Math.abs(percentDiff) < 1) {
    return { text: 'On par with population average', type: 'neutral' };
  }
  
  const direction = diff > 0 ? 'higher' : 'lower';
  
  // Format the benchmark/average value
  const formattedAverage = `$${benchmark.toLocaleString()}`;
    
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${direction} than average (${formattedAverage})`;
  
  // Determine if this is positive or negative based on the direction
  const isPositive = 
    (betterDirection === 'higher' && diff > 0) || 
    (betterDirection === 'lower' && diff < 0);
  
  return { 
    text, 
    type: isPositive ? 'positive' : 'negative'
  };
};

// Format a percentage of total
const formatPercentOfTotal = (part: number, total: number, formatted: boolean = true): string | number => {
  if (!part || !total) return formatted ? '0%' : 0;
  const percentage = (part / total) * 100;
  return formatted ? `${percentage.toFixed(1)}%` : percentage;
};

export default CostAnalysis;
