
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ChevronDown, StarHalf, PlusCircle } from "lucide-react";

interface ArchetypeNavTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ArchetypeNavTabs = ({ activeTab, onTabChange }: ArchetypeNavTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-8 bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-start md:justify-center">
        <TabsTrigger value="overview">
          <FileText className="w-4 h-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="metrics">
          <ChevronDown className="w-4 h-4 mr-2" />
          Key Metrics
        </TabsTrigger>
        <TabsTrigger value="swot">
          <StarHalf className="w-4 h-4 mr-2" />
          SWOT Analysis
        </TabsTrigger>
        <TabsTrigger value="disease-and-care">
          <PlusCircle className="w-4 h-4 mr-2" />
          Disease & Care
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ArchetypeNavTabs;
