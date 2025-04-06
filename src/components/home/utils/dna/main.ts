
import { ArchetypeId } from '@/types/archetype';
import { StepPosition } from '../../types/dnaHelix';
import { drawDNAStrands } from './strands';
import { calculateStepPositions } from './positioning';
import { drawSteps, drawLeaderLinesAndCircles } from './steps';

/**
 * Main function to draw the entire DNA helix visualization
 */
export const drawDNAHelix = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  selectedArchetypeId?: ArchetypeId | null
): StepPosition[] => {
  // Clear the canvas first
  ctx.clearRect(0, 0, width, height);
  
  // Set some rendering parameters
  const centerX = width * 0.5; // Center X position
  const amplitude = width * 0.15; // Wave amplitude (15% of width)
  const frequency = 0.019; // Adjusted frequency for waves
  const numberOfSteps = 9; // We only show 9 steps (3 per family)
  const strandWidth = 6; // Width of DNA strands
  
  // Draw the DNA strands
  drawDNAStrands(ctx, width, height, centerX, amplitude, frequency, strandWidth);
  
  // Calculate all step positions
  const stepPositions = calculateStepPositions(width, height, centerX, amplitude, frequency, numberOfSteps);
  
  // Draw the steps connecting the strands
  drawSteps(ctx, stepPositions, selectedArchetypeId);
  
  // Draw the leader lines and archetype circles
  const { x: circlesX, radius: circleRadius } = drawLeaderLinesAndCircles(ctx, stepPositions, width, selectedArchetypeId);
  
  // Update step positions with circle information (for click detection)
  stepPositions.forEach(step => {
    step.circleX = circlesX;
    step.circleRadius = circleRadius;
  });
  
  return stepPositions;
};
