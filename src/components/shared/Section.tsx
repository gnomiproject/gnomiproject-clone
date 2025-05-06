
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section = ({
  id,
  className,
  children,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn('py-12', className)}
    >
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
};
