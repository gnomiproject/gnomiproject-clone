
import React, { useEffect } from 'react';
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
  // Enhanced styles for better visibility
  const baseClasses = "inline-block bg-teal-500 text-white px-2 py-0.5 text-xs font-bold rounded cursor-help print:hidden";
  const stickyClasses = sticky ? "px-3 py-1 text-sm animate-pulse shadow-lg" : "ml-2 align-super";
  
  useEffect(() => {
    console.log('[BetaBadge] Component mounted with sticky:', sticky);
    
    // Check if this component is actually in the DOM
    setTimeout(() => {
      const badgeElement = document.querySelector('.beta-badge-element');
      console.log('[BetaBadge] Badge element in DOM:', !!badgeElement);
      
      if (badgeElement) {
        const computedStyle = window.getComputedStyle(badgeElement);
        console.log('[BetaBadge] Computed style:', {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex
        });
      }
    }, 200);
  }, [sticky]);
  
  // Debug logging to verify rendering
  console.log('[BetaBadge] Rendering with sticky:', sticky);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`${baseClasses} ${stickyClasses} ${className || ''} beta-badge-element`}
            style={{ 
              zIndex: 9999,
              position: sticky ? 'relative' : 'initial',
              display: 'inline-block',
              opacity: 1,
              pointerEvents: 'auto'
            }} 
            data-testid="beta-badge"
          >
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
