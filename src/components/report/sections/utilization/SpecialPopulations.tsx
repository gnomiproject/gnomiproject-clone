
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatPercent(value as number, 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-center">
              <p className="text-gray-700 font-medium">
                {formatPercent(nonUtilizers)} of members did not use any healthcare services
              </p>
              <p className="text-gray-500 text-xs mt-1">
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={HIGH_COST_COLORS[index % HIGH_COST_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatPercent(value as number, 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-center">
              <p className="text-gray-700 font-medium">
                {formatPercent(highCostClaimants)} of members account for {formatPercent(highCostSpend)} of spending
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Archetype average: {formatPercent(averageData["Util_Percent of Members who are High Cost Claimants"] || 0)} of members account for {formatPercent(averageData["Util_Percent of Allowed Amount Spent on High Cost Claimants"] || 0)} of spending
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-100">
          <h4 className="font-medium mb-2 text-yellow-800">Opportunity Analysis</h4>
          <p className="text-yellow-700 mb-2">
            The concentration of healthcare costs in a small percentage of members presents both challenges and opportunities for care management:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-yellow-700">
            <li>Consider targeted case management programs for high-cost members</li>
            <li>Analyze characteristics of non-utilizers to identify potential care barriers</li>
            <li>Implement preventive care outreach to convert non-utilizers to appropriate care users</li>
            <li>Examine high-cost conditions to identify potential early intervention opportunities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialPopulations;
