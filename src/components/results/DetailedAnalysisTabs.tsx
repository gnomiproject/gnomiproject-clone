
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArchetypeDetailedData } from '@/types/archetype';
import OverviewTab from './tabs/OverviewTab';
import KpiRiskTab from './tabs/KpiRiskTab';
import PrioritiesTab from './tabs/PrioritiesTab';
import SwotTab from './tabs/SwotTab';
import SavingsTab from './tabs/SavingsTab';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DetailedAnalysisTabsProps {
  archetypeData: ArchetypeDetailedData;
}

const DetailedAnalysisTabs = ({ archetypeData }: DetailedAnalysisTabsProps) => {
  const color = `archetype-${archetypeData.id}`;
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  const tabItems = [
    { value: "overview", label: "Overview" },
    { value: "kpi", label: "KPIs & Risk" },
    { value: "priorities", label: "Strategic Priorities" },
    { value: "swot", label: "SWOT Analysis" },
    { value: "savings", label: "Cost Savings" },
  ];
  
  // Function to get the active tab label
  const getActiveTabLabel = () => {
    return tabItems.find(tab => tab.value === activeTab)?.label || "Overview";
  };
  
  return (
    <div className="bg-white px-4 md:px-8 py-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-6">
            <Sheet>
              <SheetTrigger className={`w-full flex items-center justify-between p-3 border rounded-md text-${color}`}>
                <span className="font-medium">{getActiveTabLabel()}</span>
                <ChevronDown size={18} />
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh]">
                <div className="flex flex-col gap-2 pt-6">
                  {tabItems.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setActiveTab(tab.value);
                        // Close sheet by simulating Escape key press
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                      }}
                      className={`p-3 text-left ${activeTab === tab.value ? `text-${color} font-bold` : 'text-gray-600'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <TabsList className="mb-6 bg-gray-100 p-1 w-full overflow-x-auto flex">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`flex-1 data-[state=active]:bg-white data-[state=active]:text-${color} data-[state=active]:border-b-2 data-[state=active]:border-${color}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

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
