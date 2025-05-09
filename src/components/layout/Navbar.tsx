
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BetaBadge } from '@/components/shared/BetaBadge';
import WebsiteImage from '@/components/common/WebsiteImage';
import { testRlsAccess } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Run RLS test on initial page load
  useEffect(() => {
    const runRlsTest = async () => {
      try {
        const result = await testRlsAccess();
        if (result.success) {
          console.log('[Security Test] Success: Database access is working correctly with secure views.');
        } else {
          console.error('[Security Test] Failed: There may be issues with database access policies.', result.error);
          toast.error('Database connection issue', {
            description: 'There was a problem accessing data. Please check the console for details.'
          });
        }
      } catch (error) {
        console.error('[Security Test] Test failed with exception:', error);
      }
    };
    
    runRlsTest();
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center relative">
      <Link to="/" className="flex items-center">
        <WebsiteImage 
          type="logo" 
          altText="g.nomi logo" 
          className="h-8"
        />
        <BetaBadge className="ml-2" />
      </Link>
      
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
            <div className="flex flex-col py-3 space-y-1">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/assessment">Assessment</MobileNavLink>
              <MobileNavLink to="/insights">Insights</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/assessment">Assessment</NavLink>
          <NavLink to="/insights">Insights</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "text-base font-medium transition-colors",
        isActive ? "text-blue-500" : "text-gray-800 hover:text-blue-500"
      )}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ 
  to, 
  children, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "text-base font-medium transition-colors py-3 px-4 rounded-md",
        isActive ? "text-blue-500 bg-gray-100" : "text-gray-800 hover:bg-gray-50 hover:text-blue-500"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
