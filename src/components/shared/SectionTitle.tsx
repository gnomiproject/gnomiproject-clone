
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  tag?: React.ElementType;
}

const SectionTitle = ({
  title,
  subtitle,
  center = false,
  className,
  titleClassName,
  subtitleClassName,
  tag: Tag = 'h2',
}: SectionTitleProps) => {
  return (
    <div className={cn(
      'mb-8',
      center && 'text-center',
      className
    )}>
      <Tag className={cn(
        'text-3xl md:text-4xl font-bold',
        titleClassName
      )}>
        {title}
      </Tag>
      {subtitle && (
        <p className={cn(
          'text-lg text-gray-600 mt-3',
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
