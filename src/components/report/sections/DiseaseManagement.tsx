
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArchetypeDetailedData } from '@/types/archetype';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';

interface DiseaseManagementProps {
  archetypeData: ArchetypeDetailedData;
}

const DiseaseManagement = ({ archetypeData }: DiseaseManagementProps) => {
  const diseaseData = [
    {
      disease: 'Heart Disease',
      prevalence: archetypeData['Dise_Heart Disease Prevalence'] * 100
    },
    {
      disease: 'Type 2 Diabetes',
      prevalence: archetypeData['Dise_Type 2 Diabetes Prevalence'] * 100
    },
    {
      disease: 'Mental Health',
      prevalence: archetypeData['Dise_Mental Health Disorder Prevalence'] * 100
    },
    {
      disease: 'Substance Use',
      prevalence: archetypeData['Dise_Substance Use Disorder Prevalence'] * 100
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disease Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={diseaseData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="disease" />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              <Radar
                name="Prevalence"
                dataKey="prevalence"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Care Gaps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-700">
                Diabetes Care Adherence: {archetypeData['Gaps_Diabetes RX Adherence']}%
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-700">
                Mental Health Follow-up: {archetypeData['Gaps_Behavioral Health FU ED Visit Mental Illness']}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseManagement;
