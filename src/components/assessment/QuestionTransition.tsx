
import React, { ReactNode } from 'react';

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
  const getAnimationClass = () => {
    if (animationDirection === 'forward') {
      return 'animate-slide-in-right';
    } else if (animationDirection === 'backward') {
      return 'animate-slide-in-left';
    }
    return 'animate-fade-in';
  };

  return (
    <div key={questionKey} className={getAnimationClass()}>
      {children}
    </div>
  );
};

export default QuestionTransition;
