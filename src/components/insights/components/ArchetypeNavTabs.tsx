
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ChevronDown, StarHalf, PlusCircle } from "lucide-react";

interface ArchetypeNavTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ArchetypeNavTabs = ({ activeTab, onTabChange }: ArchetypeNavTabsProps) => {
  return (
    <TabsList className="mb-8 bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-start md:justify-center">
      <TabsTrigger value="overview" className="data-[state=active]:bg-white" onClick={() => onTabChange('overview')}>
        <FileText className="w-4 h-4 mr-2" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="metrics" className="data-[state=active]:bg-white" onClick={() => onTabChange('metrics')}>
        <ChevronDown className="w-4 h-4 mr-2" />
        Key Metrics
      </TabsTrigger>
      <TabsTrigger value="swot" className="data-[state=active]:bg-white" onClick={() => onTabChange('swot')}>
        <StarHalf className="w-4 h-4 mr-2" />
        SWOT Analysis
      </TabsTrigger>
      <TabsTrigger value="diseaseAndCare" className="data-[state=active]:bg-white" onClick={() => onTabChange('diseaseAndCare')}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Disease & Care
      </TabsTrigger>
    </TabsList>
  );
};

export default ArchetypeNavTabs;
