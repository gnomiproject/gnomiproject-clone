
import React, { ReactNode, useEffect, useState } from 'react';

interface QuestionTransitionProps {
  children: ReactNode;
  animationDirection: 'forward' | 'backward' | null;
  questionKey: number;
}

/**
 * Component that wraps question content and applies appropriate transition animations
 */
const QuestionTransition = ({ 
  children, 
  animationDirection, 
  questionKey 
}: QuestionTransitionProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted to true after component mounts to trigger animation
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [questionKey]);
  
  const getAnimationClass = () => {
    // Don't animate if component just mounted
    if (!mounted) return 'opacity-0';
    
    if (animationDirection === 'forward') {
      return 'animate-slide-in-right';
    } else if (animationDirection === 'backward') {
      return 'animate-slide-in-left';
    }
    return 'animate-fade-in';
  };

  return (
    <div key={questionKey} className={`transition-all ${getAnimationClass()}`}>
      {children}
    </div>
  );
};

export default QuestionTransition;
