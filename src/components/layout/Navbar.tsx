
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center border-b">
      <Link to="/" className="flex items-center">
        <span className="text-3xl font-bold">
          <span className="text-gray-800">g</span>
          <span className="text-black">nomi</span>
        </span>
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
  // Check if current path matches the link
  const isActive = window.location.pathname === to;
  
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
