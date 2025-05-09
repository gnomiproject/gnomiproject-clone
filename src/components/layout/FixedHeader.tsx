
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteImage from '@/components/common/WebsiteImage';
import BetaBadge from '@/components/shared/BetaBadge';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

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
  const isMobile = useIsMobile();
  
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
        
        {/* Navigation - conditionally show as hamburger menu on mobile */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className="flex items-center p-2 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] pt-12">
              <div className="flex flex-col gap-1 pt-4">
                <MobileNavLink to="/">Home</MobileNavLink>
                <MobileNavLink to="/assessment">Assessment</MobileNavLink>
                <MobileNavLink to="/insights">Insights</MobileNavLink>
                <MobileNavLink to="/about">About</MobileNavLink>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-6">
            <DesktopNavLink to="/">Home</DesktopNavLink>
            <DesktopNavLink to="/assessment">Assessment</DesktopNavLink>
            <DesktopNavLink to="/insights">Insights</DesktopNavLink>
            <DesktopNavLink to="/about">About</DesktopNavLink>
          </div>
        )}
      </div>
    </header>
  );
};

const DesktopNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="text-base font-medium transition-colors px-2 py-1 rounded-md hover:bg-gray-100 text-gray-800 hover:text-blue-500"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="text-base font-medium transition-colors py-3 px-4 rounded-md text-gray-800 hover:bg-gray-50 hover:text-blue-500"
    >
      {children}
    </Link>
  );
};

export default FixedHeader;
