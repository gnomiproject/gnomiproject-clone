
import React from 'react';
import { Shield } from 'lucide-react';
import GnomeImage from '@/components/common/GnomeImage';

interface RiskFactorsProps {
  reportData: any;
  averageData: any;
}

const RiskFactors = ({ reportData, averageData }: RiskFactorsProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Risk & SDOH Factors</h1>
          <p className="text-lg">
            This section analyzes clinical risk scores and social determinants of health.
            We'll expand this section in the next update.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <GnomeImage
            type="magnifying"
            sectionType="risk-factors"
            className="max-h-64 object-contain"
            alt="Risk Factors Gnome"
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
};

export default RiskFactors;
