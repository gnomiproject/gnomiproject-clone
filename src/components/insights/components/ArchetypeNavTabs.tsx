
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Rocket, ChevronDown, StarHalf, Building2 } from "lucide-react";

interface ArchetypeNavTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ArchetypeNavTabs = ({ activeTab, onTabChange }: ArchetypeNavTabsProps) => {
  return (
    <TabsList className="mb-8 bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-start md:justify-center">
      <TabsTrigger value="overview" className="data-[state=active]:bg-white">
        <FileText className="w-4 h-4 mr-2" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="priorities" className="data-[state=active]:bg-white">
        <Rocket className="w-4 h-4 mr-2" />
        Strategic Priorities
      </TabsTrigger>
      <TabsTrigger value="metrics" className="data-[state=active]:bg-white">
        <ChevronDown className="w-4 h-4 mr-2" />
        Key Metrics
      </TabsTrigger>
      <TabsTrigger value="swot" className="data-[state=active]:bg-white">
        <StarHalf className="w-4 h-4 mr-2" />
        SWOT Analysis
      </TabsTrigger>
      <TabsTrigger value="industries" className="data-[state=active]:bg-white">
        <Building2 className="w-4 h-4 mr-2" />
        Industries
      </TabsTrigger>
    </TabsList>
  );
};

export default ArchetypeNavTabs;
