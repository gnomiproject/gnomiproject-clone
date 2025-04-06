
import { ArchetypeId } from '@/types/archetype';
import { StepPosition, stepToArchetypeMap } from '../types/dnaHelix';

/**
 * Calculates step positions based on sine wave phases
 */
export const calculateStepPositions = (
  width: number,
  height: number,
  centerX: number,
  amplitude: number,
  frequency: number,
  numberOfSteps: number
): StepPosition[] => {
  // Define the phases where we want our steps (in radians)
  // We'll use phases that correspond to the widest gaps in the helix
  const stepPhases = [
    Math.PI * 0.5,   // Step 1: at first quarter cycle (maximum width)
    Math.PI * 1.5,   // Step 2: at third quarter cycle (maximum width)
    Math.PI * 2.5,   // Step 3: at fifth quarter cycle (maximum width)
    Math.PI * 3.5,   // Step 4: at seventh quarter cycle (maximum width)
    Math.PI * 4.5,   // Step 5: at ninth quarter cycle (maximum width)
    Math.PI * 5.5,   // Step 6: at eleventh quarter cycle (maximum width)
    Math.PI * 6.5,   // Step 7: at thirteenth quarter cycle (maximum width)
    Math.PI * 7.5,   // Step 8: at fifteenth quarter cycle (maximum width)
    Math.PI * 8.5    // Step 9: at seventeenth quarter cycle (maximum width)
  ];
  
  // Calculate y positions from phases
  const stepYPositions = stepPhases.map(phase => phase / frequency);
  
  // Adjust y positions to fit within the visible area
  const minY = Math.min(...stepYPositions);
  const maxY = Math.max(...stepYPositions);
  
  // Scale to fit within the available height with margins
  const topMargin = height * 0.05;
  const bottomMargin = height * 0.05;
  const availableHeight = height - topMargin - bottomMargin;
  
  const scaledStepYPositions = stepYPositions.map(y => 
    topMargin + ((y - minY) / (maxY - minY)) * availableHeight
  );

  // Create step positions array with coordinates and archetype IDs
  const stepPositions: StepPosition[] = [];
  for (let i = 0; i < numberOfSteps; i++) {
    const y = scaledStepYPositions[i];
    const x1 = centerX + amplitude * Math.sin(frequency * y);
    const x2 = centerX + amplitude * Math.sin(frequency * y + Math.PI);
    
    // Store the position for click detection
    const archetypeId = stepToArchetypeMap[i];
    stepPositions.push({ x1, x2, y, archetypeId });
  }

  return stepPositions;
};
