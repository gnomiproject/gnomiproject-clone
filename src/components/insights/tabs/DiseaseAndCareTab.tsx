
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArchetypeDetailedData } from "@/types/archetype";

interface DiseaseAndCareTabProps {
  archetypeData: ArchetypeDetailedData;
  hideRequestSection?: boolean;
}

const DiseaseAndCareTab = ({ archetypeData, hideRequestSection = false }: DiseaseAndCareTabProps) => {
  // Enhanced formatting function with fallbacks
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  // Case-insensitive field lookup helper
  const getFieldValue = (data: any, fieldKey: string): number | undefined => {
    // Direct match
    if (data[fieldKey] !== undefined) {
      return data[fieldKey];
    }
    
    // Try with different case patterns
    const keys = Object.keys(data);
    // Try case-insensitive match
    const caseInsensitiveKey = keys.find(k => k.toLowerCase() === fieldKey.toLowerCase());
    if (caseInsensitiveKey) {
      return data[caseInsensitiveKey];
    }
    
    // Try with underscores instead of spaces
    const underscoreKey = keys.find(k => 
      k.toLowerCase() === fieldKey.toLowerCase().replace(/ /g, '_'));
    if (underscoreKey) {
      return data[underscoreKey];
    }
    
    return undefined;
  };

  // Enhanced debug logging
  console.log("DiseaseAndCareTab received data:", {
    heart: getFieldValue(archetypeData, "Dise_Heart Disease Prevalence"),
    diabetes: getFieldValue(archetypeData, "Dise_Type 2 Diabetes Prevalence"),
    mental: getFieldValue(archetypeData, "Dise_Mental Health Disorder Prevalence"),
    substance: getFieldValue(archetypeData, "Dise_Substance Use Disorder Prevalence")
  });

  // Prepare all disease field keys for better discovery
  const allDiseaseFields = useMemo(() => {
    const diseaseFields: Record<string, string> = {
      heartDisease: "Dise_Heart Disease Prevalence",
      diabetes: "Dise_Type 2 Diabetes Prevalence",
      mentalHealth: "Dise_Mental Health Disorder Prevalence",
      substanceUse: "Dise_Substance Use Disorder Prevalence"
    };
    
    // Log all possible keys in the data that match disease patterns
    const possibleDiseaseKeys = Object.keys(archetypeData || {})
      .filter(key => key.toLowerCase().includes('dise_'));
    
    console.log("[DiseaseAndCareTab] Possible disease keys found:", possibleDiseaseKeys);
    
    return diseaseFields;
  }, [archetypeData]);

  // Prepare all care gap field keys
  const allCareGapFields = useMemo(() => {
    const careFields: Record<string, string> = {
      diabetesRx: "Gaps_Diabetes RX Adherence",
      behavioralHealth: "Gaps_Behavioral Health FU ED Visit Mental Illness",
      cancerScreening: "Gaps_Cancer Screening Breast",
      wellnessVisit: "Gaps_Wellness Visit Adults"
    };
    
    // Log all possible keys in the data that match care gap patterns
    const possibleCareKeys = Object.keys(archetypeData || {})
      .filter(key => key.toLowerCase().includes('gaps_'));
    
    console.log("[DiseaseAndCareTab] Possible care gap keys found:", possibleCareKeys);
    
    return careFields;
  }, [archetypeData]);

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
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allDiseaseFields.heartDisease))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Type 2 Diabetes</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allDiseaseFields.diabetes))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Mental Health Disorders</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allDiseaseFields.mentalHealth))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Substance Use Disorder</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allDiseaseFields.substanceUse))}</span>
              </div>
            </div>
          </div>
          
          {/* Care Gaps Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Care Gaps</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Diabetes RX Adherence</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allCareGapFields.diabetesRx))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Behavioral Health Follow-up (Mental Illness)</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allCareGapFields.behavioralHealth))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cancer Screening (Breast)</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allCareGapFields.cancerScreening))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Wellness Visit (Adults)</span>
                <span className="font-medium">{formatPercentage(getFieldValue(archetypeData, allCareGapFields.wellnessVisit))}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseAndCareTab;
