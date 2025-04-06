
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

interface DetailedAnalysisTriggerProps {
  isOpen: boolean;
  archetypeColor: string;
}

const DetailedAnalysisTrigger = ({ isOpen, archetypeColor }: DetailedAnalysisTriggerProps) => {
  return (
    <div className="border-t py-4 px-8 text-center">
      <CollapsibleTrigger className={`flex items-center justify-center mx-auto px-6 py-3 rounded-lg text-white font-medium transition-colors bg-${archetypeColor} hover:bg-${archetypeColor}/90 w-auto`}>
        {isOpen ? "Hide detailed analysis" : "Show detailed analysis"}
        <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
    </div>
  );
};

export default DetailedAnalysisTrigger;
