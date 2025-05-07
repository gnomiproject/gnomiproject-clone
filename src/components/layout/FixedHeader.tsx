
import React from 'react';
import { Link } from 'react-router-dom';
import WebsiteImage from '@/components/common/WebsiteImage';
import BetaBadge from '@/components/shared/BetaBadge';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

interface FixedHeaderProps {
  hideNavLinks?: boolean;
  className?: string;
  showBetaBadge?: boolean;
}

const FixedHeader: React.FC<FixedHeaderProps> = ({ 
  hideNavLinks = false,
  className,
  showBetaBadge = true
}) => {
  console.log('[FixedHeader] Rendering with hideNavLinks:', hideNavLinks);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-3 px-6",
      className
    )}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and beta badge */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <WebsiteImage 
              type="logo" 
              altText="g.nomi logo" 
              className="h-8"
            />
            {showBetaBadge && <BetaBadge className="ml-2" />}
          </Link>
        </div>
        
        {/* Navigation - Always show navigation links regardless of hideNavLinks prop */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/assessment" className={navigationMenuTriggerStyle()}>
                Assessment
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/insights" className={navigationMenuTriggerStyle()}>
                Insights
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className={navigationMenuTriggerStyle()}>
                About
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default FixedHeader;
