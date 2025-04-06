
import React, { useEffect, useRef, useState } from 'react';
import { ArchetypeId } from '@/types/archetype';

interface DNAHelixProps {
  className?: string;
  onStepClick?: (archetypeId: ArchetypeId) => void;
  selectedArchetypeId?: ArchetypeId | null;
}

// Map step positions to archetype IDs
const stepToArchetypeMap: ArchetypeId[] = [
  'a1', 'a2', 'a3',
  'b1', 'b2', 'b3',
  'c1', 'c2', 'c3',
  'a1', 'a2', 'a3', 'b1' // Adding extras to fill all 13 steps (we'll only use first 9)
];

const DNAHelix: React.FC<DNAHelixProps> = ({ className, onStepClick, selectedArchetypeId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stepPositions, setStepPositions] = useState<{x1: number, x2: number, y: number, archetypeId: ArchetypeId}[]>([]);
  
  // Handle click on canvas
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onStepClick || stepPositions.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get click position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is near any step
    const clickedStep = stepPositions.find(step => {
      // Calculate if click is within range of the step line
      const distance = Math.abs(step.y - y);
      return distance < 10 && x >= Math.min(step.x1, step.x2) - 10 && x <= Math.max(step.x1, step.x2) + 10;
    });
    
    if (clickedStep) {
      onStepClick(clickedStep.archetypeId);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = Math.min(600, window.innerHeight * 0.6);
        drawDNAHelix(ctx, canvas.width, canvas.height);
      }
    };

    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedArchetypeId]);

  const drawDNAHelix = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Constants for the helix
    const centerX = width / 2;
    const amplitude = width * 0.25; // Increased from 0.2 to 0.25 to make the helix even wider
    const frequency = Math.PI * 3 / height; // How many cycles to fit in the height
    const strandWidth = 10;
    const numberOfSteps = 9; // Using 9 steps for the 9 archetypes
    
    // Store positions for click detection
    const newStepPositions: {x1: number, x2: number, y: number, archetypeId: ArchetypeId}[] = [];

    // Draw the left strand (blue to teal gradient)
    const blueGradient = ctx.createLinearGradient(0, 0, 0, height);
    blueGradient.addColorStop(0, '#00B0F0'); // Family A color (top)
    blueGradient.addColorStop(0.5, '#0D41C0'); // Family B3 color (middle)
    blueGradient.addColorStop(1, '#00B2B1'); // Family B color (bottom)
    
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
    const orangeGradient = ctx.createLinearGradient(0, 0, 0, height);
    orangeGradient.addColorStop(0, '#EC7500'); // Archetype A1 (top)
    orangeGradient.addColorStop(0.5, '#FFC600'); // Archetype A3 (middle)
    orangeGradient.addColorStop(1, '#FF8B91'); // Family C color (bottom)
    
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

    // Calculate basic parameters for steps
    const topMargin = height * 0.1; // 10% margin from the top
    const bottomMargin = height * 0.1; // 10% margin from the bottom
    const usableHeight = height - topMargin - bottomMargin;
    
    // Reference step spacing from steps 4-6 that look good
    const midSectionSpacing = usableHeight / (numberOfSteps - 1);
    
    // Calculate y positions for all steps to better match the helix pattern
    const stepYPositions = [];
    
    // For steps 1-3, position them in the first helix twist with the same spacing as 4-6
    // but adjusted to flow with the helix
    const firstTwistHeight = height / 3;
    
    // Step 1 - top position, following the helix curve
    stepYPositions[0] = topMargin + (firstTwistHeight * 0.15);
    
    // Step 2 - centered at the widest part of the first twist
    stepYPositions[1] = topMargin + (firstTwistHeight * 0.25);
    
    // Step 3 - bottom of first section, before the crossover
    stepYPositions[2] = topMargin + (firstTwistHeight * 0.5);
    
    // Steps 4-6 - maintain their good positioning based on even spacing
    stepYPositions[3] = topMargin + (midSectionSpacing * 3);
    stepYPositions[4] = topMargin + (midSectionSpacing * 4);
    stepYPositions[5] = topMargin + (midSectionSpacing * 5);
    
    // Steps 7-9 - position in the bottom third of the helix, matching the natural curve
    const lastTwistStart = height * 0.65;
    stepYPositions[6] = lastTwistStart + (usableHeight * 0.1);
    stepYPositions[7] = lastTwistStart + (usableHeight * 0.2);
    stepYPositions[8] = lastTwistStart + (usableHeight * 0.3);
    
    // Draw the connecting steps
    for (let i = 0; i < numberOfSteps; i++) {
      const y = stepYPositions[i];
      const x1 = centerX + amplitude * Math.sin(frequency * y);
      const x2 = centerX + amplitude * Math.sin(frequency * y + Math.PI);
      
      // Store the position for click detection
      const archetypeId = stepToArchetypeMap[i];
      newStepPositions.push({ x1, x2, y, archetypeId });
      
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
    }
    
    // Update step positions for click detection
    setStepPositions(newStepPositions);
  };

  return (
    <div className={`dna-helix-container ${className || ''}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full cursor-pointer"
        style={{ maxHeight: '600px' }}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default DNAHelix;
