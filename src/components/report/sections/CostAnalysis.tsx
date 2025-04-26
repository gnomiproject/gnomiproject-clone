
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CostAnalysisProps {
  archetypeData: ArchetypeDetailedData;
}

const CostAnalysis = ({ archetypeData }: CostAnalysisProps) => {
  const costData = [
    {
      name: 'Medical',
      amount: archetypeData['Cost_Medical Paid Amount PEPY'],
    },
    {
      name: 'Pharmacy',
      amount: archetypeData['Cost_RX Paid Amount PEPY'],
    },
    {
      name: 'Total',
      amount: archetypeData['Cost_Medical & RX Paid Amount PEPY'],
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Cost Saving Opportunities</h3>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-amber-800">
              Potential ER Savings: ${archetypeData['Cost_Avoidable ER Potential Savings PMPY']}/PMPY
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostAnalysis;
