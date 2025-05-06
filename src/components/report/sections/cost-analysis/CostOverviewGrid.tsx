
import React from 'react';
import { DollarSign } from 'lucide-react';
import CostCard from './CostCard';

interface CostOverviewGridProps {
  reportData: any;
  averageData: any;
}

const CostOverviewGrid = ({ reportData, averageData }: CostOverviewGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CostCard 
        title="Total Cost PEPY"
        value={reportData["Cost_Medical & RX Paid Amount PEPY"] || 0}
        average={averageData["Cost_Medical & RX Paid Amount PEPY"] || 0}
        betterDirection="lower"
        icon={<DollarSign className="h-5 w-5" />}
      />
      
      <CostCard 
        title="Medical Cost PEPY"
        value={reportData["Cost_Medical Paid Amount PEPY"] || 0}
        average={averageData["Cost_Medical Paid Amount PEPY"] || 0}
        betterDirection="lower"
        icon={<DollarSign className="h-5 w-5" />}
      />
      
      <CostCard 
        title="Rx Cost PEPY"
        value={reportData["Cost_RX Paid Amount PEPY"] || 0}
        average={averageData["Cost_RX Paid Amount PEPY"] || 0}
        betterDirection="lower"
        icon={<DollarSign className="h-5 w-5" />}
      />
    </div>
  );
};

export default CostOverviewGrid;
