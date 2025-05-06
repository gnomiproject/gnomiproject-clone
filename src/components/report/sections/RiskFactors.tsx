
import React from 'react';
import { Shield } from 'lucide-react';
import RiskProfile from './risk-factors/RiskProfile';
import OverallSDOH from './risk-factors/OverallSDOH';
import EconomicAccessFactors from './risk-factors/EconomicAccessFactors';
import CommunityFactors from './risk-factors/CommunityFactors';
import RiskSDOHInsights from './risk-factors/RiskSDOHInsights';
import { formatNumber } from '@/utils/formatters';
import { Card } from '@/components/ui/card';

interface RiskFactorsProps {
  reportData: any;
  averageData: any;
}

const RiskFactors = ({ reportData, averageData }: RiskFactorsProps) => {
  // Gnome image
  const gnomeImage = '/assets/gnomes/gnome_magnifying.png';
  
  // Check if we have risk and SDOH data
  const hasRiskData = typeof reportData?.Risk_Average_Risk_Score !== 'undefined' || 
                      typeof reportData?.['Risk_Average Risk Score'] !== 'undefined';
  
  const hasSDOHData = typeof reportData?.SDOH_Average_SDOH !== 'undefined' || 
                      typeof reportData?.['SDOH_Average SDOH'] !== 'undefined';

  // If no risk or SDOH data is available, show the placeholder
  if (!hasRiskData && !hasSDOHData) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-6">Clinical Risk & SDOH Factors</h1>
            <p className="text-lg">
              This section analyzes clinical risk scores and social determinants of health.
              We'll expand this section in the next update.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <img
              src={gnomeImage}
              alt="Risk Factors Gnome"
              className="max-h-64 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
              }}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p>The full risk factors analysis will be available in the next update.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Clinical Risk & SDOH Factors</h1>
          <p className="text-lg">
            Social Determinants of Health (SDOH) are the conditions in which people are born, grow, live, 
            work, and age that impact their health outcomes. Higher SDOH scores indicate greater social risk factors,
            which may negatively impact health. Clinical Risk scores are based on the population's claims and demographic history.
            Understanding both clinical and social risk factors helps identify 
            barriers to healthcare access and opportunities for targeted interventions.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <img
            src={gnomeImage}
            alt="Risk Factors Gnome"
            className="max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/gnomes/placeholder.svg';
            }}
          />
        </div>
      </div>
      
      {/* Risk-SDOH Relationship - Moved to top */}
      <RiskSDOHInsights reportData={reportData} averageData={averageData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Profile Component */}
        <RiskProfile reportData={reportData} averageData={averageData} />
        
        {/* Overall SDOH Component */}
        <OverallSDOH reportData={reportData} averageData={averageData} />
      </div>

      {/* Economic & Access Factors */}
      <EconomicAccessFactors reportData={reportData} averageData={averageData} />

      {/* Digital & Community Factors */}
      <CommunityFactors reportData={reportData} averageData={averageData} />
    </div>
  );
};

export default RiskFactors;
