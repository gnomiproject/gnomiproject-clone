
import React from 'react';
import { DollarSign, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostAnalysisProps {
  reportData: any;
  averageData: any;
}

const CostAnalysis = ({ reportData, averageData }: CostAnalysisProps) => {
  // Format cost data for charts
  const costComparisonData = generateCostComparisonData(reportData, averageData);
  
  // Get cost analysis insights
  const costAnalysis = reportData.cost_analysis || 
    "No specific cost analysis insights available for this archetype.";
  
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_charts.png';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Cost Analysis</h1>
          
          <p className="text-lg mb-6">
            Understanding your healthcare spending patterns is crucial for effective benefits management. 
            This section breaks down your organization's healthcare costs and compares them to the 
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

      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CostCard 
          title="Total Cost PEPY"
          value={formatNumber(reportData["Cost_Medical & RX Paid Amount PEPY"] || 0, 'currency')}
          comparison={formatComparison(
            reportData["Cost_Medical & RX Paid Amount PEPY"],
            averageData["Cost_Medical & RX Paid Amount PEPY"],
            'lower'
          )}
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Medical Cost PEPY"
          value={formatNumber(reportData["Cost_Medical Paid Amount PEPY"] || 0, 'currency')}
          comparison={formatComparison(
            reportData["Cost_Medical Paid Amount PEPY"],
            averageData["Cost_Medical Paid Amount PEPY"],
            'lower'
          )}
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Rx Cost PEPY"
          value={formatNumber(reportData["Cost_RX Paid Amount PEPY"] || 0, 'currency')}
          comparison={formatComparison(
            reportData["Cost_RX Paid Amount PEPY"],
            averageData["Cost_RX Paid Amount PEPY"],
            'lower'
          )}
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Total Cost PMPY"
          value={formatNumber(reportData["Cost_Medical & RX Paid Amount PMPY"] || 0, 'currency')}
          comparison={formatComparison(
            reportData["Cost_Medical & RX Paid Amount PMPY"],
            averageData["Cost_Medical & RX Paid Amount PMPY"],
            'lower'
          )}
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Medical Cost PMPY"
          value={formatNumber(reportData["Cost_Medical Paid Amount PMPY"] || 0, 'currency')}
          comparison={formatComparison(
            reportData["Cost_Medical Paid Amount PMPY"],
            averageData["Cost_Medical Paid Amount PMPY"],
            'lower'
          )}
          icon={<DollarSign className="h-5 w-5" />}
        />
        
        <CostCard 
          title="Rx Cost PMPY"
          value={formatNumber(reportData["Cost_RX Paid Amount PMPY"] || 0, 'currency')}
          comparison={formatComparison(
            reportData["Cost_RX Paid Amount PMPY"],
            averageData["Cost_RX Paid Amount PMPY"],
            'lower'
          )}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Avoidable ER Costs */}
      <Card className="mt-6 border-orange-200">
        <CardHeader className="bg-orange-50 pb-3">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
            Avoidable Emergency Room Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-1/3">
              <div className="bg-orange-100 p-6 rounded-lg text-center">
                <h3 className="text-orange-800 font-medium mb-1">Potential Annual Savings</h3>
                <div className="text-3xl font-bold text-orange-700">
                  {formatNumber(reportData["Cost_Avoidable ER Potential Savings PMPY"] || 0, 'currency')}
                </div>
                <p className="text-sm text-orange-800 mt-1">per member per year</p>
              </div>
              <div className="mt-4 text-sm">
                <p>
                  This represents potential savings from reducing avoidable emergency room visits 
                  by directing members to more appropriate care settings such as primary care, 
                  urgent care, or telehealth.
                </p>
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-lg font-medium mb-4">Specialty Rx Cost Impact</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[{
                      name: 'Specialty Rx',
                      'Your Cost': reportData["Cost_Specialty RX Allowed Amount PMPM"] || 0,
                      'Archetype Average': averageData["Cost_Specialty RX Allowed Amount PMPM"] || 0
                    }]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatNumber(value, 'currency', 0)} />
                    <Tooltip formatter={(value) => formatNumber(value as number, 'currency', 2)} />
                    <Legend />
                    <Bar dataKey="Your Cost" fill="#f97316" />
                    <Bar dataKey="Archetype Average" fill="#fdba74" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Specialty medications represent {formatPercentOfTotal(
                  reportData["Cost_Specialty RX Allowed Amount PMPM"] * 12, 
                  reportData["Cost_RX Paid Amount PMPY"]
                )} of your total pharmacy spend, compared to the archetype average of {formatPercentOfTotal(
                  averageData["Cost_Specialty RX Allowed Amount PMPM"] * 12, 
                  averageData["Cost_RX Paid Amount PMPY"]
                )}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Comparison Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingDown className="mr-2 h-5 w-5 text-blue-600" />
            Cost Comparison: Your Organization vs Archetype Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={costComparisonData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatNumber(value, 'currency', 0)} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value) => formatNumber(value as number, 'currency', 2)} />
                <Legend />
                <Bar dataKey="Your Cost" fill="#3b82f6" />
                <Bar dataKey="Archetype Average" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
            Cost Analysis Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{costAnalysis}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable cost card component
const CostCard = ({ 
  title, 
  value, 
  comparison, 
  icon 
}: { 
  title: string; 
  value: string; 
  comparison: { text: string; type: 'positive' | 'negative' | 'neutral' }; 
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-lg mr-3 ${
          comparison.type === 'positive' ? 'bg-green-100' : 
          comparison.type === 'negative' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">
          {value}
        </div>
        <p className={`text-sm mt-1 ${
          comparison.type === 'positive' ? 'text-green-600' : 
          comparison.type === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {comparison.text}
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
    return { text: 'On par with archetype average', type: 'neutral' };
  }
  
  const direction = diff > 0 ? 'higher' : 'lower';
  const text = `${Math.abs(percentDiff).toFixed(1)}% ${direction} than average`;
  
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
const formatPercentOfTotal = (part: number, total: number): string => {
  if (!part || !total) return '0%';
  return ((part / total) * 100).toFixed(1) + '%';
};

// Generate data for cost comparison charts
const generateCostComparisonData = (reportData: any, averageData: any) => {
  return [
    {
      name: 'Total Cost (PEPY)',
      'Your Cost': reportData["Cost_Medical & RX Paid Amount PEPY"] || 0,
      'Archetype Average': averageData["Cost_Medical & RX Paid Amount PEPY"] || 0
    },
    {
      name: 'Medical Cost (PEPY)',
      'Your Cost': reportData["Cost_Medical Paid Amount PEPY"] || 0,
      'Archetype Average': averageData["Cost_Medical Paid Amount PEPY"] || 0
    },
    {
      name: 'Rx Cost (PEPY)',
      'Your Cost': reportData["Cost_RX Paid Amount PEPY"] || 0,
      'Archetype Average': averageData["Cost_RX Paid Amount PEPY"] || 0
    },
    {
      name: 'Total Cost (PMPY)',
      'Your Cost': reportData["Cost_Medical & RX Paid Amount PMPY"] || 0,
      'Archetype Average': averageData["Cost_Medical & RX Paid Amount PMPY"] || 0
    },
    {
      name: 'Avoidable ER Savings (PMPY)',
      'Your Cost': reportData["Cost_Avoidable ER Potential Savings PMPY"] || 0,
      'Archetype Average': averageData["Cost_Avoidable ER Potential Savings PMPY"] || 0
    }
  ];
};

export default CostAnalysis;
