
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, Lock, Lightbulb, AlertTriangle, TrendingUp, AlertCircle } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    'unique-advantages': { label: 'Unique Advantages', icon: <Lightbulb className="w-4 h-4 mr-2" />, alwaysUnlocked: false },
    'biggest-challenges': { label: 'Biggest Challenges', icon: <AlertTriangle className="w-4 h-4 mr-2" />, alwaysUnlocked: false },
    'best-opportunities': { label: 'Best Opportunities', icon: <TrendingUp className="w-4 h-4 mr-2" />, alwaysUnlocked: false },
    'potential-pitfalls': { label: 'Potential Pitfalls', icon: <AlertCircle className="w-4 h-4 mr-2" />, alwaysUnlocked: false }
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

  // Enhanced rendering for locked tabs
  const renderLockedTabContent = (label: string, icon: React.ReactNode) => (
    <div className="flex items-center relative">
      {icon}
      <span>{label}</span>
      <Lock className="ml-2 w-3 h-3 text-blue-500 animate-pulse" />
    </div>
  );

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
                  className={`flex items-center px-4 py-2 
                    ${activeTab === value ? 'bg-gray-100 text-blue-600' : ''} 
                    ${!isUnlocked && !alwaysUnlocked ? 'text-gray-700 relative hover:bg-blue-50 hover:text-blue-600 transition-colors' : ''}`}
                >
                  {icon}
                  {label}
                  {!isUnlocked && !alwaysUnlocked && (
                    <Lock className="ml-auto h-3 w-3 text-blue-500 animate-pulse" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Desktop view: Tabs with tooltips for locked tabs
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-center">
            <TabsTrigger value="overview">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            
            {/* Enhanced locked tabs with tooltips */}
            {Object.entries(tabOptions).filter(([key]) => key !== 'overview').map(([value, { label, icon, alwaysUnlocked }]) => (
              !isUnlocked && !alwaysUnlocked ? (
                <TooltipProvider key={value}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value={value} 
                        className="relative group border border-transparent hover:border-blue-200 overflow-visible cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center relative">
                          {icon}
                          <span>{label}</span>
                          <Lock className="ml-2 h-3.5 w-3.5 text-blue-500 group-hover:animate-pulse" />
                        </div>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-blue-600 text-white border-blue-700 p-3">
                      <p className="font-medium">Unlock {label}</p>
                      <p className="text-xs text-blue-100">Click to get full insights access</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TabsTrigger key={value} value={value}>
                  {icon}
                  {label}
                </TabsTrigger>
              )
            ))}
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};

export default ArchetypeNavTabs;
