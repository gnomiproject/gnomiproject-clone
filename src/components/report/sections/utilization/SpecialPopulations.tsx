
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users } from 'lucide-react';
import { formatNumber, formatPercent } from '@/utils/formatters';

interface SpecialPopulationsProps {
  reportData: any;
  averageData: any;
}

const SpecialPopulations = ({
  reportData,
  averageData
}: SpecialPopulationsProps) => {
  // Safety check for data
  if (!reportData || !averageData) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-gray-500">No special populations data available.</p>
        </CardContent>
      </Card>
    );
  }

  const nonUtilizers = reportData["Util_Percent of Members who are Non-Utilizers"] || 0;
  const highCostClaimants = reportData["Util_Percent of Members who are High Cost Claimants"] || 0;
  const highCostSpend = reportData["Util_Percent of Allowed Amount Spent on High Cost Claimants"] || 0;
  
  // Format data for non-utilizers vs utilizers pie chart
  const utilizationData = [
    { name: 'Non-Utilizers', value: nonUtilizers },
    { name: 'Utilizers', value: 1 - nonUtilizers }
  ];
  
  // Format data for high cost claimant spending
  const spendingData = [
    { name: 'High Cost Claimants', value: highCostSpend },
    { name: 'All Others', value: 1 - highCostSpend }
  ];
  
  const COLORS = ['#0088FE', '#e0e0e0'];
  const HIGH_COST_COLORS = ['#FF8042', '#e0e0e0'];

  // Custom legend component
  const renderLegend = (props: any, colors: string[]) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm text-gray-600">
              {entry.value}: {formatPercent(entry.payload.value, 0)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="mr-2 h-5 w-5 text-blue-600" />
          Special Populations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-600 mb-6">
          Analysis of non-utilizers and high-cost claimants and their impact on overall healthcare spending.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Non-Utilizers */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-center">Member Utilization</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatPercent(value as number, 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {renderLegend({ payload: utilizationData.map((item, index) => ({ value: item.name, payload: item })) }, COLORS)}
            <div className="mt-4 text-sm text-center space-y-2">
              <p className="text-gray-700 font-medium">
                {formatPercent(nonUtilizers)} of members did not use any healthcare services
              </p>
              <p className="text-gray-500 text-xs">
                Archetype average: {formatPercent(averageData["Util_Percent of Members who are Non-Utilizers"] || 0)}
              </p>
            </div>
          </div>

          {/* High Cost Claimants */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-center">High Cost Claimant Impact</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={HIGH_COST_COLORS[index % HIGH_COST_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatPercent(value as number, 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {renderLegend({ payload: spendingData.map((item, index) => ({ value: item.name, payload: item })) }, HIGH_COST_COLORS)}
            <div className="mt-4 text-sm text-center space-y-2">
              <p className="text-gray-700 font-medium">
                {formatPercent(highCostClaimants)} of members account for {formatPercent(highCostSpend)} of spending
              </p>
              <p className="text-gray-500 text-xs">
                Archetype average: {formatPercent(averageData["Util_Percent of Members who are High Cost Claimants"] || 0)} of members account for {formatPercent(averageData["Util_Percent of Allowed Amount Spent on High Cost Claimants"] || 0)} of spending
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialPopulations;
