import { ArchetypeId } from '@/types/archetype';
import { StepPosition, stepToArchetypeMap } from '../types/dnaHelix';

/**
 * Creates gradients for DNA strands
 */
export const createDNAGradients = (ctx: CanvasRenderingContext2D, height: number) => {
  // Create the left strand gradient (blue to teal)
  const blueGradient = ctx.createLinearGradient(0, 0, 0, height);
  blueGradient.addColorStop(0, '#00B0F0'); // Family A color (top)
  blueGradient.addColorStop(0.5, '#0D41C0'); // Family B3 color (middle)
  blueGradient.addColorStop(1, '#00B2B1'); // Family B color (bottom)

  // Create the right strand gradient (orange to pink)
  const orangeGradient = ctx.createLinearGradient(0, 0, 0, height);
  orangeGradient.addColorStop(0, '#EC7500'); // Archetype A1 (top)
  orangeGradient.addColorStop(0.5, '#FFC600'); // Archetype A3 (middle)
  orangeGradient.addColorStop(1, '#FF8B91'); // Family C color (bottom)

  return { blueGradient, orangeGradient };
};

/**
 * Draws the DNA strands
 */
export const drawDNAStrands = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  centerX: number,
  amplitude: number,
  frequency: number,
  strandWidth: number
) => {
  const { blueGradient, orangeGradient } = createDNAGradients(ctx, height);
  
  // Draw the left strand (blue to teal gradient)
  ctx.beginPath();
  for (let y = 0; y < height; y++) {
    const x = centerX + amplitude * Math.sin(frequency * y);
    if (y === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineWidth = strandWidth;
  ctx.strokeStyle = blueGradient;
  ctx.stroke();

  // Draw the right strand (orange to pink gradient)
  ctx.beginPath();
  for (let y = 0; y < height; y++) {
    const x = centerX + amplitude * Math.sin(frequency * y + Math.PI);
    if (y === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineWidth = strandWidth;
  ctx.strokeStyle = orangeGradient;
  ctx.stroke();
};

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

/**
 * Draws the steps connecting the DNA strands
 */
export const drawSteps = (
  ctx: CanvasRenderingContext2D,
  stepPositions: StepPosition[],
  selectedArchetypeId: ArchetypeId | null | undefined
) => {
  stepPositions.forEach(step => {
    const { x1, x2, y, archetypeId } = step;
    
    // Draw the step with visual cue if it's selected
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    
    if (selectedArchetypeId && archetypeId === selectedArchetypeId) {
      // Highlight selected step
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      
      // Draw a glow effect
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
      
      // Draw the actual line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    } else {
      // Normal step
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#e0e0e0';
      ctx.stroke();
    }
    
    // Add a subtle circle at each end of the step to indicate it's clickable
    ctx.beginPath();
    ctx.arc(x1, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = selectedArchetypeId && archetypeId === selectedArchetypeId ? '#ffffff' : '#e0e0e0';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x2, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = selectedArchetypeId && archetypeId === selectedArchetypeId ? '#ffffff' : '#e0e0e0';
    ctx.fill();
  });
};

/**
 * Returns the appropriate color for an archetype circle
 */
export const getArchetypeColor = (archetypeId: ArchetypeId): string => {
  // Map archetype IDs to colors
  const colorMap: Record<ArchetypeId, string> = {
    'a1': '#EC7500', // orange
    'a2': '#00B2B1', // teal
    'a3': '#FFC600', // yellow
    'b1': '#00B0F0', // blue
    'b2': '#7030A0', // purple
    'c1': '#00B050', // green
    'c2': '#C00000', // red
    'c3': '#5B2D90', // indigo
    'b3': '#FF8B91'  // pink
  };
  
  return colorMap[archetypeId] || '#888888';
};

/**
 * Draws leader lines and archetype circles
 */
export const drawLeaderLinesAndCircles = (
  ctx: CanvasRenderingContext2D,
  stepPositions: StepPosition[],
  width: number,
  selectedArchetypeId: ArchetypeId | null | undefined
) => {
  const circleRadius = 16;
  const leaderLineLength = width * 0.15; // 15% of canvas width
  const circlesX = width * 0.85; // Position circles at 85% of canvas width
  
  stepPositions.forEach(step => {
    const { x2, y, archetypeId } = step;
    
    // Draw leader line
    ctx.beginPath();
    ctx.moveTo(x2, y);
    ctx.lineTo(circlesX - circleRadius, y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = selectedArchetypeId && archetypeId === selectedArchetypeId ? 
      '#ffffff' : 'rgba(224, 224, 224, 0.7)';
    ctx.stroke();
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(circlesX, y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = getArchetypeColor(archetypeId);
    if (selectedArchetypeId && archetypeId === selectedArchetypeId) {
      // Add glow effect for selected archetype
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 10;
    }
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
    
    // Draw circle border
    ctx.lineWidth = 2;
    ctx.strokeStyle = selectedArchetypeId && archetypeId === selectedArchetypeId ? 
      '#ffffff' : 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();
    
    // Draw archetype ID text
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(archetypeId, circlesX, y);
  });
  
  // Return the circle positions for click detection
  return {
    x: circlesX,
    radius: circleRadius
  };
};

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
    return distance < 10 && x >= Math.min(step.x1, step.x2) - 10 && x <= Math.max(step.x1, step.x2) + 10;
  });
  
  return clickedStep ? clickedStep.archetypeId : null;
};
