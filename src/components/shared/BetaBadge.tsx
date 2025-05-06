
import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface BetaBadgeProps {
  className?: string;
  sticky?: boolean;
}

export const BetaBadge: React.FC<BetaBadgeProps> = ({ className, sticky = false }) => {
  const baseClasses = "inline-block bg-teal-500 text-white px-2 py-0.5 text-xs font-bold rounded cursor-help print:hidden";
  const stickyClasses = sticky ? "fixed bottom-6 right-6 z-50 shadow-lg px-3 py-1 text-sm animate-pulse" : "ml-2 align-super";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${baseClasses} ${stickyClasses} ${className || ''}`}>
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
