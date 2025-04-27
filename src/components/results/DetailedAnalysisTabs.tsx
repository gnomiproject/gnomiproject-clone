
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArchetypeDetailedData } from '@/types/archetype';
import { ChevronDown, LineChart, PieChart, ListChecks, Activity, CircleDashed } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import RetakeButton from './RetakeButton';
import { Card, CardContent } from '@/components/ui/card';

interface DetailedAnalysisTabsProps {
  archetypeData: ArchetypeDetailedData;
  onRetakeAssessment: () => void;
}

const DetailedAnalysisTabs = ({ archetypeData, onRetakeAssessment }: DetailedAnalysisTabsProps) => {
  const color = archetypeData.hexColor ? 
    archetypeData.hexColor : 
    `var(--color-archetype-${archetypeData.id})`;
  
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

  // Temporary placeholder component for tabs
  const PlaceholderTabContent = ({ title }: { title: string }) => (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">{title} Content</h3>
          <p className="text-gray-500">This tab content is currently being updated.</p>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="bg-white px-4 md:px-8 py-6">      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-6">
            <Sheet>
              <SheetTrigger className={`w-full flex items-center justify-between p-3 border rounded-md`} style={{ color: color, backgroundColor: `${color}10` }}>
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
                      style={activeTab === tab.value ? { color: color } : {}}
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
          <TabsList className="mb-6 bg-gray-100 p-1 w-full overflow-x-auto flex border-b">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors
                  ${activeTab === tab.value ? 'border-b-2 bg-white' : 'hover:bg-gray-50'}`}
                style={{
                  borderColor: activeTab === tab.value ? color : 'transparent',
                  color: activeTab === tab.value ? color : 'inherit',
                }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        <TabsContent value="overview">
          <PlaceholderTabContent title="Overview" />
        </TabsContent>
        
        <TabsContent value="metrics">
          <PlaceholderTabContent title="Key Metrics" />
        </TabsContent>
        
        <TabsContent value="swot">
          <PlaceholderTabContent title="SWOT Analysis" />
        </TabsContent>
        
        <TabsContent value="disease">
          <PlaceholderTabContent title="Disease Management" />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <PlaceholderTabContent title="Recommendations" />
        </TabsContent>
      </Tabs>
      
      {/* Retake assessment button */}
      <div className="mt-12 text-center">
        <RetakeButton onClick={onRetakeAssessment} />
      </div>
    </div>
  );
};

export default DetailedAnalysisTabs;
