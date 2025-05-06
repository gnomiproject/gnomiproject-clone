
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
  // Format a percentage of total
  const formatPercentOfTotal = (part: number, total: number, formatted: boolean = true): string | number => {
    if (!part || !total) return formatted ? '0%' : 0;
    const percentage = (part / total) * 100;
    return formatted ? `${percentage.toFixed(1)}%` : percentage;
  };

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
  );
};

export default CostImpactAnalysis;
