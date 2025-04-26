import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArchetypeDetailedData } from '@/types/archetype';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Download, LineChart, PieChart, ListChecks, Activity, CircleDashed } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import OverviewTab from './tabs/OverviewTab';
import KeyMetricsTab from './tabs/KeyMetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseManagementTab from './tabs/DiseaseManagementTab';
import RecommendationsTab from './tabs/RecommendationsTab';
import RetakeButton from './RetakeButton';

interface DetailedAnalysisTabsProps {
  archetypeData: ArchetypeDetailedData;
  onRetakeAssessment: () => void;
}

const DetailedAnalysisTabs = ({ archetypeData, onRetakeAssessment }: DetailedAnalysisTabsProps) => {
  const color = archetypeData.hexColor ? 
    { borderColor: archetypeData.hexColor, color: archetypeData.hexColor } : 
    { borderColor: `var(--color-archetype-${archetypeData.id})`, color: `var(--color-archetype-${archetypeData.id})` };
  
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  const tabItems = [
    { value: "overview", label: "Overview", icon: PieChart },
    { value: "metrics", label: "Key Metrics", icon: LineChart },
    { value: "swot", label: "SWOT Analysis", icon: ListChecks },
    { value: "disease", label: "Disease & Care", icon: Activity },
    { value: "recommendations", label: "Recommendations", icon: CircleDashed },
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
              <SheetTrigger className={`w-full flex items-center justify-between p-3 border rounded-md`} style={{ color: color.color, backgroundColor: `${color.color}10` }}>
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
                      className={`p-3 text-left flex items-center ${activeTab === tab.value ? 'font-bold' : 'text-gray-600'}`}
                      style={activeTab === tab.value ? { color: color.color } : {}}
                    >
                      <tab.icon className="mr-2 h-5 w-5" />
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
                className="flex-1 data-[state=active]:border-b-2 hover:bg-gray-50"
                style={{
                  borderColor: activeTab === tab.value ? color.color : 'transparent',
                  color: activeTab === tab.value ? color.color : undefined,
                  backgroundColor: activeTab === tab.value ? `${color.color}10` : undefined
                }}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        <TabsContent value="overview">
          <OverviewTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="metrics">
          <KeyMetricsTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="swot">
          <SwotTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="disease">
          <DiseaseManagementTab archetypeData={archetypeData} />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <RecommendationsTab archetypeData={archetypeData} />
        </TabsContent>
      </Tabs>
      
      {/* Full report request section - KEEPING ONLY THIS ONE */}
      <div className="mt-12 pt-8 border-t">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2" style={{ color: color.color }}>
            Request Your Complete Archetype Analysis
          </h3>
          <p className="text-gray-600 mb-6">
            Our team will prepare a custom report with detailed analytics and actionable recommendations 
            tailored specifically to your organization's needs.
          </p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter organization name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full p-2 border rounded" placeholder="Enter your email" />
            </div>
            <Button 
              className="w-full md:w-auto" 
              style={{ backgroundColor: color.color }}
            >
              <Download className="mr-2 h-4 w-4" />
              Request Full Report
            </Button>
          </form>
        </div>
      </div>
      
      {/* Retake assessment button */}
      <div className="mt-12 text-center">
        <RetakeButton onClick={onRetakeAssessment} />
      </div>
    </div>
  );
};

export default DetailedAnalysisTabs;
