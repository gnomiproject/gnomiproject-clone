
import React from 'react';
import { DollarSign } from 'lucide-react';
import CostCard from './CostCard';

interface CostOverviewGridProps {
  reportData: any;
  averageData: any;
}

const CostOverviewGrid = ({ reportData, averageData }: CostOverviewGridProps) => {
  // Add safety checks for missing data
  if (!reportData) {
    console.warn('[CostOverviewGrid] No report data provided');
    return <div className="text-gray-500">Cost data unavailable</div>;
  }

  // Safely access cost values
  const totalCostPEPY = reportData["Cost_Medical & RX Paid Amount PEPY"] || 0;
  const medicalCostPEPY = reportData["Cost_Medical Paid Amount PEPY"] || 0;
  const rxCostPEPY = reportData["Cost_RX Paid Amount PEPY"] || 0;
  
  // Safely access average values
  const avgTotalCostPEPY = averageData?.["Cost_Medical & RX Paid Amount PEPY"] || 0;
  const avgMedicalCostPEPY = averageData?.["Cost_Medical Paid Amount PEPY"] || 0;
  const avgRxCostPEPY = averageData?.["Cost_RX Paid Amount PEPY"] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CostCard 
        title="Total Cost PEPY"
        value={totalCostPEPY}
        average={avgTotalCostPEPY}
        betterDirection="lower"
        icon={<DollarSign className="h-5 w-5" />}
      />
      
      <CostCard 
        title="Medical Cost PEPY"
        value={medicalCostPEPY}
        average={avgMedicalCostPEPY}
        betterDirection="lower"
        icon={<DollarSign className="h-5 w-5" />}
      />
      
      <CostCard 
        title="Rx Cost PEPY"
        value={rxCostPEPY}
        average={avgRxCostPEPY}
        betterDirection="lower"
        icon={<DollarSign className="h-5 w-5" />}
      />
    </div>
  );
};

export default CostOverviewGrid;
