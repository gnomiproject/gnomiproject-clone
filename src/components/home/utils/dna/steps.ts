
import { ArchetypeId } from '@/types/archetype';
import { StepPosition } from '../../types/dnaHelix';
import { getArchetypeColor } from './colors';

/**
 * Draws the steps connecting the DNA strands
 */
export const drawSteps = (
  ctx: CanvasRenderingContext2D,
  stepPositions: StepPosition[],
  selectedArchetypeId: ArchetypeId | null | undefined,
  selectedFamilyId: 'a' | 'b' | 'c' | null | undefined,
  hoveredStepIndex: number | null = null
) => {
  stepPositions.forEach((step, index) => {
    const { x1, x2, y, archetypeId } = step;
    
    // Determine if this step belongs to the selected family
    const stepFamilyId = archetypeId.charAt(0) as 'a' | 'b' | 'c';
    const isSelectedFamily = selectedFamilyId && stepFamilyId === selectedFamilyId;
    const isHovered = hoveredStepIndex === index;
    
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
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      
      // Draw a glow effect
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 10;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();
      
      // Draw the actual line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    } else if (isHovered) {
      // Hover effect for step
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.lineWidth = 3;
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
      ctx.lineWidth = 2;
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
  selectedArchetypeId: ArchetypeId | null | undefined,
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
    
    // Get the archetype color for this leader line
    const archetypeColor = getArchetypeColor(archetypeId);
    
    // Draw leader line with the archetype color
    ctx.beginPath();
    ctx.moveTo(x2, y);
    ctx.lineTo(circlesX - circleRadius, y);
    
    if (selectedArchetypeId && archetypeId === selectedArchetypeId) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
    } else if (isHovered) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    } else if (isSelectedFamily) {
      ctx.strokeStyle = archetypeColor;
      ctx.lineWidth = 2.5;
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = archetypeColor;
    }
    
    ctx.stroke();
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(circlesX, y, circleRadius, 0, Math.PI * 2);
    
    // Define fill style based on state
    if (selectedArchetypeId && archetypeId === selectedArchetypeId) {
      ctx.fillStyle = '#ffffff';
      // Add glow effect for selected archetype
      ctx.shadowColor = archetypeColor;
      ctx.shadowBlur = 15;
    } else if (isHovered) {
      ctx.fillStyle = archetypeColor;
      // Hover glow
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 10;
    } else if (isSelectedFamily) {
      ctx.fillStyle = archetypeColor;
      // Subtle glow for selected family
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 5;
    } else {
      ctx.fillStyle = archetypeColor;
    }
    
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
    
    // Draw circle border
    ctx.lineWidth = 2;
    
    if (selectedArchetypeId && archetypeId === selectedArchetypeId) {
      ctx.strokeStyle = archetypeColor;
    } else if (isHovered) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3;
    } else if (isSelectedFamily) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    }
    
    ctx.stroke();
    
    // Draw archetype ID text
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (selectedArchetypeId && archetypeId === selectedArchetypeId) {
      ctx.fillStyle = archetypeColor;
    } else if (isHovered) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Arial'; // Slightly larger font for hover
    } else {
      ctx.fillStyle = '#ffffff';
    }
    
    ctx.fillText(archetypeId, circlesX, y);
  });
  
  // Return the circle positions for click detection
  return {
    x: circlesX,
    radius: circleRadius
  };
};
