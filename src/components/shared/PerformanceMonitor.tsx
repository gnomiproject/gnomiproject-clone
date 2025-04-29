
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
  const [, forceUpdate] = useState({});
  
  // Only show in development or if explicitly enabled
  const shouldShow = process.env.NODE_ENV !== 'production' || showInProduction;
  
  useEffect(() => {
    renderCount.current += 1;
    // Force a re-render to update the counter display
    if (shouldShow) forceUpdate({});
  });

  if (!shouldShow) return <>{children}</>;

  return (
    <>
      <div className="hidden print:hidden absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs px-1 py-0.5 rounded">
        {componentName}: {renderCount.current} renders
      </div>
      {children}
    </>
  );
};

/**
 * Utility to track render performance of components
 */
export const useRenderPerformance = (componentName: string) => {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;
    
    // Only log in development to avoid console spam in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
    }
    
    // Reset timer for next render
    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const MemoizedComponent = React.memo(Component);
  
  const MonitoredComponent = (props: P) => {
    useRenderPerformance(componentName);
    
    return (
      <RenderCounter componentName={componentName}>
        <MemoizedComponent {...props} />
      </RenderCounter>
    );
  };
  
  MonitoredComponent.displayName = `Monitored(${componentName})`;
  return MonitoredComponent;
};
