
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArchetypeDetailedData } from '@/types/archetype';
import OverviewTab from './tabs/OverviewTab';
import KpiRiskTab from './tabs/KpiRiskTab';
import PrioritiesTab from './tabs/PrioritiesTab';
import SwotTab from './tabs/SwotTab';
import SavingsTab from './tabs/SavingsTab';

interface DetailedAnalysisTabsProps {
  archetypeData: ArchetypeDetailedData;
}

const DetailedAnalysisTabs = ({ archetypeData }: DetailedAnalysisTabsProps) => {
  const color = `archetype-${archetypeData.id}`;
  
  return (
    <div className="bg-white px-8 py-6">
      <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-gray-100 p-1 w-full overflow-x-auto flex">
          <TabsTrigger 
            value="overview" 
            className={`flex-1 data-[state=active]:bg-white data-[state=active]:text-${color} data-[state=active]:border-b-2 data-[state=active]:border-${color}`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="kpi" 
            className={`flex-1 data-[state=active]:bg-white data-[state=active]:text-${color} data-[state=active]:border-b-2 data-[state=active]:border-${color}`}
          >
            KPIs & Risk
          </TabsTrigger>
          <TabsTrigger 
            value="priorities" 
            className={`flex-1 data-[state=active]:bg-white data-[state=active]:text-${color} data-[state=active]:border-b-2 data-[state=active]:border-${color}`}
          >
            Strategic Priorities
          </TabsTrigger>
          <TabsTrigger 
            value="swot" 
            className={`flex-1 data-[state=active]:bg-white data-[state=active]:text-${color} data-[state=active]:border-b-2 data-[state=active]:border-${color}`}
          >
            SWOT Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="savings" 
            className={`flex-1 data-[state=active]:bg-white data-[state=active]:text-${color} data-[state=active]:border-b-2 data-[state=active]:border-${color}`}
          >
            Cost Savings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="kpi">
          <KpiRiskTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="priorities">
          <PrioritiesTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="swot">
          <SwotTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="savings">
          <SavingsTab archetypeData={archetypeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAnalysisTabs;
