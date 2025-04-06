
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import { StepPosition } from '../../types/dnaHelix';

/**
 * Checks if a click is on a step or circle and returns the corresponding archetype ID
 */
export const detectStepClick = (
  event: React.MouseEvent<HTMLCanvasElement>, 
  canvas: HTMLCanvasElement, 
  stepPositions: StepPosition[]
): ArchetypeId | null => {
  // Get click position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Check if click is on any circle first (higher priority than step clicks)
  const clickedCircle = stepPositions.find(step => {
    if (!step.circleX || !step.circleRadius) return false;
    
    const distance = Math.sqrt(Math.pow(step.circleX - x, 2) + Math.pow(step.y - y, 2));
    return distance <= step.circleRadius;
  });
  
  if (clickedCircle) {
    return clickedCircle.archetypeId;
  }
  
  // If no circle was clicked, check if click is near any step
  const clickedStep = stepPositions.find(step => {
    // Calculate if click is within range of the step line
    const distance = Math.abs(step.y - y);
    return distance < 12 && x >= Math.min(step.x1, step.x2) - 12 && x <= Math.max(step.x1, step.x2) + 12;
  });
  
  return clickedStep ? clickedStep.archetypeId : null;
};

/**
 * Checks if mouse is hovering over a step or circle and returns the index
 */
export const detectStepHover = (
  x: number,
  y: number,
  stepPositions: StepPosition[]
): number | null => {
  // Check if hover is on any circle first
  for (let i = 0; i < stepPositions.length; i++) {
    const step = stepPositions[i];
    
    if (step.circleX && step.circleRadius) {
      const distance = Math.sqrt(Math.pow(step.circleX - x, 2) + Math.pow(step.y - y, 2));
      if (distance <= step.circleRadius * 1.2) { // Slightly larger than actual radius for better UX
        return i;
      }
    }
  }
  
  // If not hovering over a circle, check for steps
  for (let i = 0; i < stepPositions.length; i++) {
    const step = stepPositions[i];
    const distance = Math.abs(step.y - y);
    
    if (distance < 12 && x >= Math.min(step.x1, step.x2) - 12 && x <= Math.max(step.x1, step.x2) + 12) {
      return i;
    }
  }
  
  return null;
};
