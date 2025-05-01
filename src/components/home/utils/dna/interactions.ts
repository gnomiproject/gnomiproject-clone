
import { StepPosition } from '../../types/dnaHelix';

/**
 * Sets up interactions for the DNA helix visualization
 */
export const setupDNAInteractions = () => {
  console.log('DNA interactions setup initialized');
  // This function can be expanded later with more interaction setup logic
};

/**
 * Detects if a click occurred on a DNA step and returns the corresponding archetype ID
 * @param event Mouse event
 * @param canvas The canvas element
 * @param steps Array of step positions
 * @returns The ID of the clicked archetype or null if no step was clicked
 */
export const detectStepClick = (
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  steps: StepPosition[]
): string | null => {
  // Get mouse position
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Check if click is near any step or circle
  for (const step of steps) {
    // Check if click is near circle
    if (step.circleX && step.circleRadius) {
      const distance = Math.sqrt(Math.pow(step.circleX - x, 2) + Math.pow(step.y - y, 2));
      if (distance <= step.circleRadius * 1.2) {
        return step.archetypeId;
      }
    }
    
    // Check if click is near step
    const distance = Math.abs(step.y - y);
    if (distance < 10 && x >= Math.min(step.x1, step.x2) - 15 && x <= Math.max(step.x1, step.x2) + 15) {
      return step.archetypeId;
    }
  }
  
  return null;
};
