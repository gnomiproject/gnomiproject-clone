
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BetaBadge } from '@/components/shared/BetaBadge';
import { testRlsAccess } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        <img 
          src="/lovable-uploads/c7752575-8c92-44b3-a9ae-8ee62f19c77a.png" 
          alt="g nomi logo" 
          className="h-8"
        />
        <BetaBadge className="ml-2" />
      </Link>
      
      {isMobile ? (
        <>
          <button 
            onClick={toggleMobileMenu}
            className="flex items-center p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu size={24} />
          </button>
          
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-md z-50 mt-1">
              <div className="flex flex-col py-3">
                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/assessment" onClick={() => setMobileMenuOpen(false)}>Assessment</MobileNavLink>
                <MobileNavLink to="/insights" onClick={() => setMobileMenuOpen(false)}>Insights</MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
              </div>
            </div>
          )}
        </>
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
        "text-base font-medium transition-colors px-6 py-2",
        isActive ? "text-blue-500 bg-gray-100" : "text-gray-800 hover:bg-gray-50 hover:text-blue-500"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
