
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
    const amplitude = width * 0.25; // Width of the helix
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

    // Calculate positions based on the sine wave phase
    // We want steps to be at specific phases of the sine wave for visual consistency
    
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
    
    // Draw the connecting steps
    for (let i = 0; i < numberOfSteps; i++) {
      const y = scaledStepYPositions[i];
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
