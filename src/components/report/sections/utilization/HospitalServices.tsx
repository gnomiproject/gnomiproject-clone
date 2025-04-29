
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/utils/formatters';

interface HospitalServicesProps {
  reportData: any;
  averageData: any;
}

const HospitalServices = ({
  reportData,
  averageData
}: HospitalServicesProps) => {
  // Safety check for data
  if (!reportData || !averageData) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-gray-500">No hospital services data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = [
    {
      name: 'Inpatient Admits',
      'Your Population': reportData["Util_Inpatient Admits per 1k Members"] || 0,
      'Archetype Average': averageData["Util_Inpatient Admits per 1k Members"] || 0
    },
    {
      name: 'Inpatient Days',
      'Your Population': reportData["Util_Inpatient Days per 1k Members"] || 0,
      'Archetype Average': averageData["Util_Inpatient Days per 1k Members"] || 0
    },
    {
      name: 'Observation Stays',
      'Your Population': reportData["Util_Observational Stays per 1k Members"] || 0,
      'Archetype Average': averageData["Util_Observational Stays per 1k Members"] || 0
    },
    {
      name: 'Outpatient Surgeries',
      'Your Population': reportData["Util_Outpatient Surgeries per 1k Members"] || 0,
      'Archetype Average': averageData["Util_Outpatient Surgeries per 1k Members"] || 0
    }
  ];

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Hospital className="mr-2 h-5 w-5 text-blue-600" />
          Hospital Services Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-600 mb-6">
          Analysis of inpatient admissions, length of stay, observation visits, and outpatient surgical procedures.
        </p>

        <div className="h-80 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: 'Per 1,000 Members', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => formatNumber(value, 'number', 0)}
              />
              <Tooltip formatter={(value) => formatNumber(value as number, 'number', 0)} />
              <Legend />
              <Bar dataKey="Your Population" fill="#3b82f6" />
              <Bar dataKey="Archetype Average" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-1">Length of Stay</h4>
            <p className="text-sm text-gray-600">
              {
                reportData["Util_Inpatient Days per 1k Members"] && reportData["Util_Inpatient Admits per 1k Members"] ?
                `Average length of stay: ${(reportData["Util_Inpatient Days per 1k Members"] / reportData["Util_Inpatient Admits per 1k Members"]).toFixed(1)} days` :
                "Length of stay data not available"
              }
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-1">Outpatient Ratio</h4>
            <p className="text-sm text-gray-600">
              {
                reportData["Util_Outpatient Surgeries per 1k Members"] && reportData["Util_Inpatient Admits per 1k Members"] ?
                `Outpatient to inpatient ratio: ${(reportData["Util_Outpatient Surgeries per 1k Members"] / reportData["Util_Inpatient Admits per 1k Members"]).toFixed(1)}:1` :
                "Outpatient ratio data not available"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalServices;
