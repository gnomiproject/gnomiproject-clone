
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArchetypeDetailedData } from "@/types/archetype";

interface DiseaseAndCareTabProps {
  archetypeData: ArchetypeDetailedData;
  hideRequestSection?: boolean;
}

const DiseaseAndCareTab = ({ archetypeData, hideRequestSection = false }: DiseaseAndCareTabProps) => {
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  // Add debug logging
  console.log("DiseaseAndCareTab received data:", {
    heart: archetypeData["Dise_Heart Disease Prevalence"],
    diabetes: archetypeData["Dise_Type 2 Diabetes Prevalence"],
    mental: archetypeData["Dise_Mental Health Disorder Prevalence"],
    substance: archetypeData["Dise_Substance Use Disorder Prevalence"],
    rxAdherence: archetypeData["Gaps_Diabetes RX Adherence"],
    behavioralHealth: archetypeData["Gaps_Behavioral Health FU ED Visit Mental Illness"],
    breastScreening: archetypeData["Gaps_Cancer Screening Breast"],
    wellnessVisit: archetypeData["Gaps_Wellness Visit Adults"]
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Disease & Care Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Disease Prevalence Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Disease Prevalence</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Heart Disease</span>
                <span className="font-medium">{formatPercentage(archetypeData["Dise_Heart Disease Prevalence"])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Type 2 Diabetes</span>
                <span className="font-medium">{formatPercentage(archetypeData["Dise_Type 2 Diabetes Prevalence"])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Mental Health Disorders</span>
                <span className="font-medium">{formatPercentage(archetypeData["Dise_Mental Health Disorder Prevalence"])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Substance Use Disorder</span>
                <span className="font-medium">{formatPercentage(archetypeData["Dise_Substance Use Disorder Prevalence"])}</span>
              </div>
            </div>
          </div>
          
          {/* Care Gaps Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Care Gaps</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Diabetes RX Adherence</span>
                <span className="font-medium">{formatPercentage(archetypeData["Gaps_Diabetes RX Adherence"])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Behavioral Health Follow-up (Mental Illness)</span>
                <span className="font-medium">{formatPercentage(archetypeData["Gaps_Behavioral Health FU ED Visit Mental Illness"])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cancer Screening (Breast)</span>
                <span className="font-medium">{formatPercentage(archetypeData["Gaps_Cancer Screening Breast"])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Wellness Visit (Adults)</span>
                <span className="font-medium">{formatPercentage(archetypeData["Gaps_Wellness Visit Adults"])}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseAndCareTab;
