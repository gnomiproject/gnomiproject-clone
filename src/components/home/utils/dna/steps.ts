
import { ArchetypeId } from '@/types/archetype';
import { StepPosition } from '../../types/dnaHelix';
import { getArchetypeColor } from './colors';

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
    
    // Get the archetype color for this step
    const stepColor = getArchetypeColor(archetypeId);
    
    // Create gradient for the step to fade on the left side
    const stepGradient = ctx.createLinearGradient(x1, y, x2, y);
    stepGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Start with semi-transparent white
    stepGradient.addColorStop(0.15, stepColor); // Fade to the archetype color
    stepGradient.addColorStop(1, stepColor); // Full archetype color for most of the step
    
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
      // Normal step with gradient color
      ctx.lineWidth = 2;
      ctx.strokeStyle = stepGradient;
      ctx.stroke();
    }
  });
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
    
    // Get the archetype color for this leader line
    const archetypeColor = getArchetypeColor(archetypeId);
    
    // Draw leader line with the archetype color
    ctx.beginPath();
    ctx.moveTo(x2, y);
    ctx.lineTo(circlesX - circleRadius, y);
    ctx.lineWidth = 2; // Match the step thickness
    ctx.strokeStyle = selectedArchetypeId && archetypeId === selectedArchetypeId ? 
      '#ffffff' : archetypeColor;
    ctx.stroke();
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(circlesX, y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = archetypeColor;
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
