
import React, { useState, useEffect, useRef } from 'react';

interface RenderCounterProps {
  componentName: string;
  showInProduction?: boolean;
  children: React.ReactNode;
}

export const RenderCounter = ({ 
  componentName, 
  showInProduction = false,
  children 
}: RenderCounterProps) => {
  const renderCount = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);
  
  // Only show in development or if explicitly enabled
  const shouldShow = process.env.NODE_ENV !== 'production' || showInProduction;
  
  // Increment render count on each render but only update display occasionally
  renderCount.current += 1;
  
  useEffect(() => {
    // Only update display count every 10 renders to avoid excessive re-renders
    if (renderCount.current % 10 === 0 || renderCount.current === 1) {
      setDisplayCount(renderCount.current);
    }
  }, []); // Empty dependency array to run only once

  if (!shouldShow) return <>{children}</>;

  return (
    <>
      <div className="fixed top-0 right-0 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-bl z-50 pointer-events-none">
        {componentName}: {displayCount} renders
      </div>
      {children}
    </>
  );
};

/**
 * Utility to track render performance of components
 */
export const useRenderPerformance = (componentName: string, options?: { silent?: boolean }) => {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;
    
    // Only log in development to avoid console spam in production
    // Respect the silent option if provided
    const isSilent = options?.silent === true;
    if (process.env.NODE_ENV !== 'production' && !isSilent) {
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    }
    
    // Reset timer for next render
    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

// Simplified HOC for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  // Use React.memo to prevent re-renders when props don't change
  const MemoizedComponent = React.memo(Component);
  
  const MonitoredComponent: React.FC<P> = (props) => {
    useRenderPerformance(componentName);
    
    return (
      <RenderCounter componentName={componentName}>
        <MemoizedComponent {...props as any} />
      </RenderCounter>
    );
  };
  
  MonitoredComponent.displayName = `Monitored(${componentName})`;
  return MonitoredComponent;
}
