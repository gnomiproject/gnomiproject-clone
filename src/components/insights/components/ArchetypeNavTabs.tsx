
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, StarHalf, PlusCircle } from "lucide-react";

interface ArchetypeNavTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ArchetypeNavTabs = ({ activeTab, onTabChange }: ArchetypeNavTabsProps) => {
  // Map of tab values to their display names and icons
  const tabOptions = {
    'overview': { label: 'Overview', icon: <FileText className="w-4 h-4 mr-2" /> },
    'metrics': { label: 'Key Metrics', icon: <ChevronDown className="w-4 h-4 mr-2" /> },
    'swot': { label: 'SWOT Analysis', icon: <StarHalf className="w-4 h-4 mr-2" /> },
    'disease-and-care': { label: 'Disease & Care', icon: <PlusCircle className="w-4 h-4 mr-2" /> }
  };

  // Get the current active tab's display information
  const activeTabInfo = tabOptions[activeTab as keyof typeof tabOptions] || tabOptions.overview;

  return (
    <div className="mb-8 flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="py-5 px-4 bg-white border border-gray-200 shadow-sm flex items-center gap-2 text-base font-medium">
            {activeTabInfo.icon}
            {activeTabInfo.label}
            <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-white">
          {Object.entries(tabOptions).map(([value, { label, icon }]) => (
            <DropdownMenuItem 
              key={value}
              onClick={() => onTabChange(value)}
              className={`flex items-center px-4 py-2 ${activeTab === value ? 'bg-gray-100 text-blue-600' : ''}`}
            >
              {icon}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ArchetypeNavTabs;
