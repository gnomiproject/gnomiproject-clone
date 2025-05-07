
/**
 * SwotAnalysis Component - Transitional component that imports the dedicated DeepDiveSwotAnalysis
 * This is kept for backward compatibility
 */
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import DeepDiveSwotAnalysis from './DeepDiveSwotAnalysis';

export interface SwotAnalysisProps {
  reportData?: ArchetypeDetailedData;
  archetypeData?: ArchetypeDetailedData; // Kept for backward compatibility
  swotData?: {
    strengths?: any[];
    weaknesses?: any[];
    opportunities?: any[];
    threats?: any[];
  };
}

const SwotAnalysis: React.FC<SwotAnalysisProps> = ({ reportData, archetypeData, swotData: propSwotData }) => {
  // Use reportData from level4_report_secure as primary source
  const data = reportData || archetypeData;
  
  return (
    <DeepDiveSwotAnalysis reportData={data} />
  );
};

export default SwotAnalysis;
