
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center border-b">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/1cc408c3-b095-48b1-8087-b96fa079c8be.png" 
          alt="gnomi logo" 
          className="h-10"
        />
      </Link>
      <div className="flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/assessment">Assessment</NavLink>
        <NavLink to="/insights">Insights</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
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

export default Navbar;
