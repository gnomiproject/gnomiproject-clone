
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, StarHalf, PlusCircle, Lock } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface ArchetypeNavTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isUnlocked?: boolean;
  onUnlockRequest?: () => void;
}

const ArchetypeNavTabs = ({ 
  activeTab, 
  onTabChange, 
  isUnlocked = false, 
  onUnlockRequest 
}: ArchetypeNavTabsProps) => {
  const isMobile = useIsMobile();
  
  // Map of tab values to their display names and icons
  const tabOptions = {
    'overview': { label: 'Overview', icon: <FileText className="w-4 h-4 mr-2" />, alwaysUnlocked: true },
    'metrics': { label: 'Key Metrics', icon: <ChevronDown className="w-4 h-4 mr-2" />, alwaysUnlocked: false },
    'swot': { label: 'SWOT Analysis', icon: <StarHalf className="w-4 h-4 mr-2" />, alwaysUnlocked: false },
    'disease-and-care': { label: 'Disease & Care', icon: <PlusCircle className="w-4 h-4 mr-2" />, alwaysUnlocked: false }
  };

  // Get the current active tab's display information for mobile
  const activeTabInfo = tabOptions[activeTab as keyof typeof tabOptions] || tabOptions.overview;

  // Handler for tab change with unlock check
  const handleTabChange = (value: string) => {
    const tabInfo = tabOptions[value as keyof typeof tabOptions];
    
    // If tab is locked and we're not already on the overview tab
    if (!isUnlocked && !tabInfo.alwaysUnlocked && onUnlockRequest) {
      onUnlockRequest();
      return;
    }
    
    onTabChange(value);
  };

  return (
    <div className="mb-8">
      {isMobile ? (
        // Mobile view: Dropdown menu
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="py-5 px-4 bg-white border border-gray-200 shadow-sm flex items-center gap-2 text-base font-medium">
                {activeTabInfo.icon}
                {activeTabInfo.label}
                <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 bg-white">
              {Object.entries(tabOptions).map(([value, { label, icon, alwaysUnlocked }]) => (
                <DropdownMenuItem 
                  key={value}
                  onClick={() => handleTabChange(value)}
                  className={`flex items-center px-4 py-2 ${activeTab === value ? 'bg-gray-100 text-blue-600' : ''} ${!isUnlocked && !alwaysUnlocked ? 'text-gray-400' : ''}`}
                >
                  {icon}
                  {label}
                  {!isUnlocked && !alwaysUnlocked && (
                    <Lock className="ml-auto h-3 w-3 text-gray-400" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Desktop view: Tabs
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-center">
            <TabsTrigger value="overview">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            
            <TabsTrigger value="metrics" disabled={!isUnlocked} className={!isUnlocked ? 'relative' : ''}>
              <ChevronDown className="w-4 h-4 mr-2" />
              Key Metrics
              {!isUnlocked && (
                <Lock className="w-3 h-3 ml-2 text-gray-400" />
              )}
            </TabsTrigger>
            
            <TabsTrigger value="swot" disabled={!isUnlocked} className={!isUnlocked ? 'relative' : ''}>
              <StarHalf className="w-4 h-4 mr-2" />
              SWOT Analysis
              {!isUnlocked && (
                <Lock className="w-3 h-3 ml-2 text-gray-400" />
              )}
            </TabsTrigger>
            
            <TabsTrigger value="disease-and-care" disabled={!isUnlocked} className={!isUnlocked ? 'relative' : ''}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Disease & Care
              {!isUnlocked && (
                <Lock className="w-3 h-3 ml-2 text-gray-400" />
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};

export default ArchetypeNavTabs;
