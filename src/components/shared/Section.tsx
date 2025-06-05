
import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ 
  id, 
  className = '', 
  children 
}) => {
  console.log(`[Section] Rendering section with id: ${id}`);
  
  return (
    <section 
      id={id} 
      className={`w-full ${className}`}
      style={{ minHeight: '50px' }} // Ensure section has minimum height
    >
      {children}
    </section>
  );
};
