
import { ArchetypeId } from '@/types/archetype';
import { StepPosition } from '../types/dnaHelix';
import { drawDNAStrands } from './strands';
import { calculateStepPositions } from './positioning';
import { drawSteps, drawLeaderLinesAndCircles } from './steps';

/**
 * Main function to draw the entire DNA helix
 */
export const drawDNAHelix = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  selectedArchetypeId: ArchetypeId | null | undefined
): StepPosition[] => {
  ctx.clearRect(0, 0, width, height);

  // Constants for the helix
  const centerX = width / 2;
  const amplitude = width * 0.25; // Width of the helix
  const frequency = Math.PI * 3 / height; // How many cycles to fit in the height
  const strandWidth = 10;
  const numberOfSteps = 9; // Using 9 steps for the 9 archetypes
  
  // Draw the DNA strands
  drawDNAStrands(ctx, width, height, centerX, amplitude, frequency, strandWidth);
  
  // Calculate and store step positions
  const stepPositions = calculateStepPositions(width, height, centerX, amplitude, frequency, numberOfSteps);
  
  // Draw the connecting steps
  drawSteps(ctx, stepPositions, selectedArchetypeId);
  
  // Draw leader lines and archetype circles
  const circleInfo = drawLeaderLinesAndCircles(ctx, stepPositions, width, selectedArchetypeId);
  
  // Add circle info to step positions for click detection
  stepPositions.forEach(pos => {
    pos.circleX = circleInfo.x;
    pos.circleRadius = circleInfo.radius;
  });
  
  return stepPositions;
};
