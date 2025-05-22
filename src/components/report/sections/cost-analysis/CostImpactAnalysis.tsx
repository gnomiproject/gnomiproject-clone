
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/utils/formatters';

interface CostImpactAnalysisProps {
  reportData: any;
  averageData: any;
}

const CostImpactAnalysis = ({ reportData, averageData }: CostImpactAnalysisProps) => {
  // Check if we have the required data for rendering
  const hasReportData = reportData && typeof reportData === 'object';
  const hasAverageData = averageData && typeof averageData === 'object';
  
  // Log available data for debugging
  console.log('[CostImpactAnalysis] Data check:', {
    hasReportData,
    hasAverageData,
    reportDataKeys: hasReportData ? Object.keys(reportData).filter(k => k.startsWith('Cost_')).slice(0, 5) : [],
    averageDataKeys: hasAverageData ? Object.keys(averageData).filter(k => k.startsWith('Cost_')).slice(0, 5) : []
  });
  
  // Safely get values with fallbacks
  const getReportValue = (key: string): number => {
    if (!hasReportData) return 0;
    return typeof reportData[key] === 'number' ? reportData[key] : 0;
  };
  
  const getAverageValue = (key: string): number => {
    if (!hasAverageData) return 0;
    return typeof averageData[key] === 'number' ? averageData[key] : 0;
  };

  // Format a percentage of total with safety checks
  const formatPercentOfTotal = (part: number, total: number, formatted: boolean = true): string | number => {
    if (!part || !total) return formatted ? '0%' : 0;
    const percentage = (part / total) * 100;
    return formatted ? `${percentage.toFixed(1)}%` : percentage;
  };
  
  // Prepare data for charts
  const avoidableERData = [{
    name: 'Avoidable ER',
    'Archetype Cost': getReportValue("Cost_Avoidable ER Potential Savings PMPY"),
    'Population Average': getAverageValue("Cost_Avoidable ER Potential Savings PMPY")
  }];
  
  const specialtyRxData = [{
    name: 'Specialty Rx',
    'Archetype Cost': getReportValue("Cost_Specialty RX Allowed Amount PMPM"),
    'Population Average': getAverageValue("Cost_Specialty RX Allowed Amount PMPM")
  }];
  
  // Calculate specialty Rx percentage of total pharmacy spend
  const specialtyRxMonthly = getReportValue("Cost_Specialty RX Allowed Amount PMPM");
  const totalRxYearly = getReportValue("Cost_RX Paid Amount PMPY");
  const specialtyRxPercentage = formatPercentOfTotal(specialtyRxMonthly * 12, totalRxYearly);

  return (
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
                  data={avoidableERData}
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
              {getAverageValue("Cost_Avoidable ER Potential Savings PMPY") > 0 && (
                <p className="mt-2 text-orange-700">
                  Archetype average: {formatNumber(getAverageValue("Cost_Avoidable ER Potential Savings PMPY"), 'currency')} per member per year
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
                  data={specialtyRxData}
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
              {totalRxYearly > 0 ? (
                <p>
                  Specialty medications represent {specialtyRxPercentage} of this archetype's total pharmacy spend.
                </p>
              ) : (
                <p>
                  Specialty medication data is not available for this archetype.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostImpactAnalysis;
