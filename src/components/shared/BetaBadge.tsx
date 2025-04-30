
import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface BetaBadgeProps {
  className?: string;
}

export const BetaBadge: React.FC<BetaBadgeProps> = ({ className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-block bg-teal-500 text-white px-2 py-0.5 text-xs font-bold rounded ml-2 align-super cursor-help print:hidden ${className || ''}`}>
            BETA
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">This tool is in beta testing. We're actively improving it and welcome your feedback!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BetaBadge;
