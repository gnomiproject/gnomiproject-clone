
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/c7752575-8c92-44b3-a9ae-8ee62f19c77a.png" 
          alt="g nomi logo" 
          className="h-8"
        />
      </Link>
      <div className="flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/assessment">Assessment</NavLink>
        <NavLink to="/insights">Insights</NavLink>
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
