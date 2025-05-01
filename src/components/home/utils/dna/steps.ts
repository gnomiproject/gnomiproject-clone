
import { ArchetypeId } from '@/types/archetype';
import { StepPosition } from '../../types/dnaHelix';
import { getArchetypeColor } from './colors';

/**
 * Draws the steps connecting the DNA strands
 */
export const drawSteps = (
  ctx: CanvasRenderingContext2D,
  stepPositions: StepPosition[],
  selectedArchetypeId: string | null | undefined,
  selectedFamilyId: 'a' | 'b' | 'c' | null | undefined,
  hoveredStepIndex: number | null = null
) => {
  stepPositions.forEach((step, index) => {
    const { x1, x2, y, archetypeId } = step;
    
    // Determine if this step belongs to the selected family
    const stepFamilyId = archetypeId.charAt(0) as 'a' | 'b' | 'c';
    const isSelectedFamily = selectedFamilyId && stepFamilyId === selectedFamilyId;
    const isHovered = hoveredStepIndex === index;
    const isSelected = selectedArchetypeId && archetypeId === selectedArchetypeId;
    
    // Get the archetype color for this step
    const stepColor = getArchetypeColor(archetypeId as ArchetypeId);
    
    // Create gradient for the step to fade on the left side
    const stepGradient = ctx.createLinearGradient(x1, y, x2, y);
    stepGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Start with semi-transparent white
    stepGradient.addColorStop(0.15, stepColor); // Fade to the archetype color
    stepGradient.addColorStop(1, stepColor); // Full archetype color for most of the step
    
    // Draw the step with visual cue if it's selected
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    
    if (isSelected) {
      // Highlight selected step with thicker line but keep color
      ctx.lineWidth = 5;
      ctx.strokeStyle = stepColor;
      ctx.stroke();
      
      // Draw a glow effect around the colored line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 12;
      ctx.strokeStyle = `${stepColor}60`; // Semi-transparent version of color
      ctx.stroke();
      
      // Draw the actual line again to ensure it's visible over the glow
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 5;
      ctx.strokeStyle = stepColor;
      ctx.stroke();
    } else if (isHovered) {
      // Hover effect for step
      ctx.lineWidth = 4;
      ctx.strokeStyle = stepColor;
      ctx.stroke();
      
      // Add subtle glow effect on hover
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 8;
      ctx.strokeStyle = `${stepColor}40`; // More transparent glow
      ctx.stroke();
      
      // Redraw the main line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = stepColor;
      ctx.stroke();
    } else if (isSelectedFamily) {
      // Highlight step in selected family (but not as prominent as selected archetype)
      ctx.lineWidth = 3;
      ctx.strokeStyle = stepColor;
      ctx.stroke();
      
      // Draw the actual line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = stepGradient;
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
  selectedArchetypeId: string | null | undefined,
  selectedFamilyId: 'a' | 'b' | 'c' | null | undefined,
  hoveredStepIndex: number | null = null
) => {
  const circleRadius = 16;
  const leaderLineLength = width * 0.15; // 15% of canvas width
  const circlesX = width * 0.85; // Position circles at 85% of canvas width
  
  stepPositions.forEach((step, index) => {
    const { x2, y, archetypeId } = step;
    
    // Determine if this step belongs to the selected family
    const stepFamilyId = archetypeId.charAt(0) as 'a' | 'b' | 'c';
    const isSelectedFamily = selectedFamilyId && stepFamilyId === selectedFamilyId;
    const isHovered = hoveredStepIndex === index;
    const isSelected = selectedArchetypeId && archetypeId === selectedArchetypeId;
    
    // Get the archetype color for this leader line
    const archetypeColor = getArchetypeColor(archetypeId as ArchetypeId);
    
    // Draw leader line with the archetype color
    ctx.beginPath();
    ctx.moveTo(x2, y);
    ctx.lineTo(circlesX - circleRadius, y);
    
    if (isSelected) {
      // Keep color but make line thicker for selected
      ctx.lineWidth = 4;
      ctx.strokeStyle = archetypeColor;
    } else if (isHovered) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = archetypeColor;
    } else if (isSelectedFamily) {
      ctx.strokeStyle = archetypeColor;
      ctx.lineWidth = 2.5;
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = archetypeColor;
    }
    
    ctx.stroke();
    
    // Calculate circle size based on state
    const finalRadius = isSelected ? circleRadius * 1.25 : 
                        isHovered ? circleRadius * 1.15 : 
                        circleRadius;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(circlesX, y, finalRadius, 0, Math.PI * 2);
    
    // Define fill style based on state
    ctx.fillStyle = archetypeColor;
    
    // Add appropriate glow effect
    if (isSelected) {
      ctx.shadowColor = archetypeColor;
      ctx.shadowBlur = 15;
    } else if (isHovered) {
      ctx.shadowColor = archetypeColor;
      ctx.shadowBlur = 10;
    } else if (isSelectedFamily) {
      ctx.shadowColor = archetypeColor;
      ctx.shadowBlur = 5;
    }
    
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
    
    // Draw circle border
    ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1.5;
    
    if (isSelected) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    } else if (isHovered) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    } else if (isSelectedFamily) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    }
    
    ctx.stroke();
    
    // Draw archetype ID text
    ctx.font = isSelected ? 'bold 15px Arial' : 
               isHovered ? 'bold 14.5px Arial' : 'bold 14px Arial';
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
